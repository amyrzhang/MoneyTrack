<template>
  <div class="home-container layout-pd">
    <el-row :gutter="15" class="home-card-one mb15">
      <el-col
          :xs="24"
          :sm="8"
          :md="8"
          :lg="8"
          :xl="8"
          v-for="(v, k) in state.homeOne"
          :key="k"
          :class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }"
      >
        <div class="home-card-item flex">
          <div class="flex-margin flex w100" :class="` home-one-animation${k}`">
            <div class="flex-auto">
              <span class="font30">{{ v.num1 }}</span>
              <span class="ml5 font16" :style="{ color: v.color1 }">{{ v.num2 }}%</span>
              <div class="mt10">{{ v.num3 }}</div>
            </div>
            <div class="home-card-item-icon flex" :style="{ background: `var(${v.color2})` }">
              <i class="flex-margin font32" :class="v.num4" :style="{ color: `var(${v.color3})` }"></i>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-two mb15">
			<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="home-media">
				<el-card shadow="hover" header="支出构成" class="mt15">
					<el-table :data="state.tableData1" stripe border style="width: 100%">
						<el-table-column prop="category" label="类别"></el-table-column>
						<el-table-column prop="amount" label="金额" align="right"></el-table-column>
						<el-table-column prop="percent" label="占比" align="right"></el-table-column>
					</el-table>
				</el-card>
			</el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="home-media">
				<el-card shadow="hover" header="支出排行" class="mt15">
					<el-table :data="state.tableData" stripe border style="width: 100%">
						<el-table-column prop="goods" label="商品" min-width="200"></el-table-column>
						<el-table-column prop="amount" label="金额" min-width="80" align="right">
							<template #default="scope">
								{{ formatAmount(scope.row.amount) }}
							</template>
						</el-table-column>
						<el-table-column prop="cumulativeAmount" label="累计金额" min-width="80" align="right">
							<template #default="scope">
								{{ formatAmount(scope.row.cumulativeAmount) }}
							</template>
						</el-table-column>
						<el-table-column prop="cdf" label="累积占比" min-width="80" align="right"></el-table-column>
					</el-table>
				</el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="home">
import {nextTick, onActivated, onMounted, reactive, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useThemeConfig} from '/@/stores/themeConfig';
import {useTagsViewRoutes} from '/@/stores/tagsViewRoutes';
import {useStatementApi} from "/src/api/statement";
import {verifyNumberRMB} from '/@/utils/toolsValidate'

// 定义变量内容
const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const state = reactive({
  global: {
    homeChartOne: null,
    homeChartTwo: null,
    homeCharThree: null,
    dispose: [null, '', undefined],
  } as any,
  homeOne: [
    {
      num1: '',
      num2: '-12.32',
      num3: '月度结余',
      num4: 'fa fa-meetup',
      color1: '#FF6462',
      color2: '--next-color-primary-lighter',
      color3: '--el-color-primary',
    },
    {
      num1: '',
      num2: '+42.32',
      num3: '月度收入',
      num4: 'iconfont icon-ditu',
      color1: '#6690F9',
      color2: '--next-color-success-lighter',
      color3: '--el-color-success',
    },
    {
      num1: '',
      num2: '+17.32',
      num3: '月度支出',
      num4: 'iconfont icon-zaosheng',
      color1: '#6690F9',
      color2: '--next-color-warning-lighter',
      color3: '--el-color-warning',
    },
  ],
  tableData: [],
	tableData1: [],
  myCharts: [] as EmptyArrayType,
  charts: {
    theme: '',
    bgColor: '',
    color: '#303133',
  },
});

// 数据卡片
const initCard = () => {
  const { getStatement } = useStatementApi(); // 获取 API 数据
  getStatement()
      .then((res) => {
        state.homeOne[0].num1 = verifyNumberRMB(res['balance']);
        state.homeOne[1].num1 = verifyNumberRMB(res['income']);
        state.homeOne[2].num1 = verifyNumberRMB(res['expenditure']);
      })
      .catch((err) => {
				// eslint-disable-next-line no-console
        console.error('Error fetching data data: ', err);
      })
};

const initTableData1 = () => {
	const { getExpCategory } = useStatementApi();
	getExpCategory().then((res) => {
		// eslint-disable-next-line no-console
		console.log(res);
		state.tableData1 = res;
	});
};

const initTableData = () => {
  const { getExpTop10 } = useStatementApi();
  getExpTop10().then((res) => {

    // 计算累计金额和占比
    let cumulativeAmount = 0;
    state.tableData = res.map((item: any) => {
      // 累计金额计算（逐项累加）
      cumulativeAmount += parseFloat(item.amount);
      return {
        ...item,
        cumulativeAmount: cumulativeAmount.toFixed(2)
      };
    });
  });
};
// 批量设置 echarts resize
const initEchartsResizeFun = () => {
  nextTick(() => {
    for (let i = 0; i < state.myCharts.length; i++) {
      setTimeout(() => {
        state.myCharts[i].resize();
      }, i * 1000);
    }
  });
};

// 格式化金额，添加千分位分隔符
const formatAmount = (value: string | number) => {
  // 去除千分位分隔符并转换为浮点数
  const cleanValue = String(value).replace(/,/g, '');
  const num = parseFloat(cleanValue);
  
  // 检查是否为有效数字
  if (isNaN(num)) {
    return value;
  }
  
  // 格式化为带有千分位分隔符的字符串，保留两位小数
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// 批量设置 echarts resize
const initEchartsResize = () => {
  window.addEventListener('resize', initEchartsResizeFun);
};
// 页面加载时
onMounted(() => {
  initCard();
	initTableData1();
  initTableData();
  initEchartsResize();
});
// 由于页面缓存原因，keep-alive
onActivated(() => {
  initEchartsResizeFun();
});
// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
    () => isTagsViewCurrenFull.value,
    () => {
      initEchartsResizeFun();
    }
);
// 监听 pinia 中是否开启深色主题
watch(
    () => themeConfig.value.isIsDark,
    (isIsDark) => {
      nextTick(() => {
        state.charts.theme = isIsDark ? 'dark' : '';
        state.charts.bgColor = isIsDark ? 'transparent' : '';
        state.charts.color = isIsDark ? '#dadada' : '#303133';
        setTimeout(() => {
          initLineChart();
        }, 500);
        setTimeout(() => {
          initPieChart();
        }, 700);
        setTimeout(() => {
          initBarChart();
        }, 1000);
      });
    },
    {
      deep: true,
      immediate: true,
    }
);
</script>

<style scoped lang="scss">
$homeNavLengh: 8;
.home-container {
  overflow: hidden;
  .home-card-one,
  .home-card-two,
  .home-card-three {
    .home-card-item {
      width: 100%;
      height: 130px;
      border-radius: 4px;
      transition: all ease 0.3s;
      padding: 20px;
      overflow: hidden;
      background: var(--el-color-white);
      color: var(--el-text-color-primary);
      border: 1px solid var(--next-border-color-light);
      &:hover {
        box-shadow: 0 2px 12px var(--next-color-dark-hover);
        transition: all ease 0.3s;
      }
      &-icon {
        width: 70px;
        height: 70px;
        border-radius: 100%;
        flex-shrink: 1;
        i {
          color: var(--el-text-color-placeholder);
        }
      }
      &-title {
        font-size: 15px;
        font-weight: bold;
        height: 30px;
      }
    }
  }
  .home-card-one {
    @for $i from 0 through 3 {
      .home-one-animation#{$i} {
        opacity: 0;
        animation-name: error-num;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        animation-delay: calc($i/4) + s;
      }
    }
  }
  .home-card-two,
  .home-card-three {
    .home-card-item {
      height: 400px;
      width: 100%;
      overflow: hidden;
      .home-monitor {
        height: 100%;
        .flex-warp-item {
          width: 25%;
          height: 111px;
          display: flex;
          .flex-warp-item-box {
            margin: auto;
            text-align: center;
            color: var(--el-text-color-primary);
            display: flex;
            border-radius: 5px;
            background: var(--next-bg-color);
            cursor: pointer;
            transition: all 0.3s ease;
            &:hover {
              background: var(--el-color-primary-light-9);
              transition: all 0.3s ease;
            }
          }
          @for $i from 0 through $homeNavLengh {
            .home-animation#{$i} {
              opacity: 0;
              animation-name: error-num;
              animation-duration: 0.5s;
              animation-fill-mode: forwards;
              animation-delay: calc($i/10) + s;
            }
          }
        }
      }
    }
  }
}
</style>