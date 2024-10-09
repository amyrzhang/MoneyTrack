<template>
  <div class="home-container layout-pd">
    <el-row :gutter="15" class="home-card-one mb15">
      <el-col
          :xs="24"
          :sm="12"
          :md="12"
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
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="home-card-item">
          <div style="height: 100%" ref="homeLineRef"></div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="home-media">
        <div class="home-card-item">
          <div style="height: 100%" ref="homePieRef"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-three">
      <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8">
        <div class="home-card-item">
          <div class="home-card-item-title">快捷导航工具</div>
          <div class="home-monitor">
            <div class="flex-warp">
              <div class="flex-warp-item" v-for="(v, k) in state.homeThree" :key="k">
                <div class="flex-warp-item-box" :class="`home-animation${k}`">
                  <div class="flex-margin">
                    <i :class="v.icon" :style="{ color: v.iconColor }"></i>
                    <span class="pl5">{{ v.label }}</span>
                    <div class="mt10">{{ v.value }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="14" :md="14" :lg="16" :xl="16" class="home-media">
        <el-table :data="state.tableData" stripe border style="width: 100%">
          <el-table-column prop="商品" label="商品" width="380"></el-table-column>
          <el-table-column prop="金额" label="金额" align="right" width="180"></el-table-column>
          <el-table-column prop="cdf" label="累积占比" align="right"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="home">
import { reactive, onMounted, ref, watch, nextTick, onActivated, markRaw } from 'vue';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useTableApi } from "/@/api/table";
import { useReportApi } from "/@/api/report";
import { verifyNumberRMB } from '/@/utils/toolsValidate'

// 定义变量内容
const homeLineRef = ref();
const homePieRef = ref();
const homeBarRef = ref();
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
      num3: '月度支出',
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
      num3: '月度结余',
      num4: 'iconfont icon-zaosheng',
      color1: '#6690F9',
      color2: '--next-color-warning-lighter',
      color3: '--el-color-warning',
    },
  ],
  homeThree: [
    {
      icon: 'iconfont icon-yangan',
      label: '浅粉红',
      value: '2.1%OBS/M',
      iconColor: '#F72B3F',
    },
    {
      icon: 'iconfont icon-wendu',
      label: '深红(猩红)',
      value: '30℃',
      iconColor: '#91BFF8',
    },
    {
      icon: 'iconfont icon-shidu',
      label: '淡紫红',
      value: '57%RH',
      iconColor: '#88D565',
    },
    {
      icon: 'iconfont icon-shidu',
      label: '弱紫罗兰红',
      value: '107w',
      iconColor: '#88D565',
    },
    {
      icon: 'iconfont icon-zaosheng',
      label: '中紫罗兰红',
      value: '57DB',
      iconColor: '#FBD4A0',
    },
    {
      icon: 'iconfont icon-zaosheng',
      label: '紫罗兰',
      value: '57PV',
      iconColor: '#FBD4A0',
    },
    {
      icon: 'iconfont icon-zaosheng',
      label: '暗紫罗兰',
      value: '517Cpd',
      iconColor: '#FBD4A0',
    },
    {
      icon: 'iconfont icon-zaosheng',
      label: '幽灵白',
      value: '12kg',
      iconColor: '#FBD4A0',
    },
    {
      icon: 'iconfont icon-zaosheng',
      label: '海军蓝',
      value: '64fm',
      iconColor: '#FBD4A0',
    },
  ],
  tableData: [],
  myCharts: [] as EmptyArrayType,
  charts: {
    theme: '',
    bgColor: '',
    color: '#303133',
  },
});

// 数据卡片
const initCard = () => {
  const { getAdminReport } = useReportApi(); // 获取 API 数据
  getAdminReport()
      .then((res) => {
        state.homeOne[0].num1 = verifyNumberRMB(res['expenditure']);
        state.homeOne[1].num1 = verifyNumberRMB(res['income']);
        state.homeOne[2].num1 = verifyNumberRMB(res['balance']);
      })
      .catch((err) => {
        console.error('Error fetching data data: ', err);
      })
};

// 折线图
const initLineChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.homeChartOne)) state.global.homeChartOne.dispose();
  state.global.homeChartOne = markRaw(echarts.init(homeLineRef.value, state.charts.theme));
  const { getAdminAccount } = useReportApi();
  getAdminAccount()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error('Error fetching data: ', err);
      })
  const option = {
    backgroundColor: state.charts.bgColor,
    title: {
      text: '政策补贴额度',
      x: 'left',
      textStyle: {fontSize: '15', color: state.charts.color},
    },
    grid: {top: 70, right: 20, bottom: 30, left: 30},
    tooltip: {trigger: 'axis'},
    legend: {data: ['预购队列', '最新成交价'], right: 0},
    xAxis: {
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    },
    yAxis: [
      {
        type: 'value',
        name: '价格',
        splitLine: {show: true, lineStyle: {type: 'dashed', color: '#f5f5f5'}},
      },
    ],
    series: [
      {
        name: '预购队列',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: [0, 41.1, 30.4, 65.1, 53.3, 53.3, 53.3, 41.1, 30.4, 65.1, 53.3, 10],
        lineStyle: {color: '#fe9a8b'},
        itemStyle: {color: '#fe9a8b', borderColor: '#fe9a8b'},
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#fe9a8bb3'},
            {offset: 1, color: '#fe9a8b03'},
          ]),
        },
      },
      {
        name: '最新成交价',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: [0, 24.1, 7.2, 15.5, 42.4, 42.4, 42.4, 24.1, 7.2, 15.5, 42.4, 0],
        lineStyle: {color: '#9E87FF'},
        itemStyle: {color: '#9E87FF', borderColor: '#9E87FF'},
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#9E87FFb3'},
            {offset: 1, color: '#9E87FF03'},
          ]),
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {offset: 0, color: '#9E87FF'},
                {offset: 0.4, color: '#9E87FF'},
                {offset: 0.5, color: '#fff'},
                {offset: 0.7, color: '#fff'},
                {offset: 0.8, color: '#fff'},
                {offset: 1, color: '#fff'},
              ],
            },
            borderColor: '#9E87FF',
            borderWidth: 2,
          },
        },
      },
    ],
  };
  state.global.homeChartOne.setOption(option);
  state.myCharts.push(state.global.homeChartOne);
};
// 饼图
const initPieChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.homeChartTwo)) state.global.homeChartTwo.dispose();
  state.global.homeChartTwo = markRaw(echarts.init(homePieRef.value, state.charts.theme));
  const data = [];
  const { getAdminCategory } = useReportApi();
  getAdminCategory().then((res) => {
    for (const key in res) {
      data.push({name: key, value: res[key]});
    }
    const option = {
      title: {
        text: '消费类别分布',
        x: 'left',
        textStyle: { fontSize: '15', color: state.charts.color },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['45%', '60%'],
          labelLine: {
            length: 30
          },
          label: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#6E7079',
                lineHeight: 22,
                align: 'center'
              },
              hr: {
                borderColor: '#8C8D8E',
                width: '100%',
                borderWidth: 1,
                height: 0
              },
              b: {
                color: '#4C5058',
                fontSize: 14,
                fontWeight: 'bold',
                lineHeight: 33
              },
              per: {
                color: '#fff',
                backgroundColor: '#4C5058',
                padding: [3, 4],
                borderRadius: 4
              }
            }
          },
          data: data
        }
      ]
    };
    state.global.homeChartTwo.setOption(option);
  });
  state.myCharts.push(state.global.homeChartTwo);
};
// 柱状图
const initBarChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.homeCharThree)) state.global.homeCharThree.dispose();
  state.global.homeCharThree = markRaw(echarts.init(homeBarRef.value, state.charts.theme));
  const option = {
    backgroundColor: state.charts.bgColor,
    title: {
      text: '月度支出排行',
      x: 'left',
      textStyle: { fontSize: '15', color: state.charts.color },
    },
    tooltip: { trigger: 'axis' },
    legend: { data: ['供温', '回温', '压力值(Mpa)'], right: 0 },
    grid: { top: 70, right: 80, bottom: 30, left: 80 },
    xAxis: [
      {
        type: 'category',
        data: ['1km', '2km', '3km', '4km', '5km', '6km'],
        boundaryGap: true,
        axisTick: { show: false },
      },
    ],
    yAxis: [
      {
        name: '累计密度(%)',
        nameLocation: 'middle',
        nameTextStyle: { padding: [3, 4, 50, 6] },
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: state.charts.color, formatter: '{value} ' },
      },
      {
        name: '金额(￥)',
        nameLocation: 'middle',
        nameTextStyle: { padding: [50, 4, 5, 6] },
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: state.charts.color, formatter: '{value} ' },
      },
    ],
    series: [
      {
        name: '累计密度(%)',
        type: 'line',
        smooth: true,
        showSymbol: true,
        // 矢量画五角星
        symbol: 'path://M150 0 L80 175 L250 75 L50 75 L220 175 Z',
        symbolSize: 12,
        yAxisIndex: 0,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(250,180,101,0.3)' },
            { offset: 1, color: 'rgba(250,180,101,0)' },
          ]),
          shadowColor: 'rgba(250,180,101,0.2)',
          shadowBlur: 20,
        },
        itemStyle: { color: '#FF8000' },
        // data中可以使用对象，value代表相应的值，另外可加入自定义的属性
        data: [
          { value: 17.2, stationName: 's1' },
          { value: 31.96, stationName: 's2' },
          { value: 44.36, stationName: 's3' },
          { value: 49.07, stationName: 's4' },
          { value: 53.56, stationName: 's5' },
          { value: 57.4, stationName: 's6' },
        ],
      },
      {
        name: '金额(￥)',
        type: 'bar',
        barWidth: 30,
        yAxisIndex: 1,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(108,80,243,0.3)' },
            { offset: 1, color: 'rgba(108,80,243,0)' },
          ]),
          //柱状图圆角
          borderRadius: [30, 30, 0, 0],
        },
        data: [
          { value: 757.0, stationName: 's1' },
          { value: 650.0, stationName: 's2' },
          { value: 546.0, stationName: 's3' },
          { value: 207.0, stationName: 's4' },
          { value: 197.99, stationName: 's5' },
          { value: 169.0, stationName: 's6' },
        ],
      },
    ],
  };
  state.global.homeCharThree.setOption(option);
  state.myCharts.push(state.global.homeCharThree);
};
const initTableData = () => {
  const { getAdminTop10 } = useReportApi();
  getAdminTop10().then((res) => {
    state.tableData = res;
    console.log(res);
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
// 批量设置 echarts resize
const initEchartsResize = () => {
  window.addEventListener('resize', initEchartsResizeFun);
};
// 页面加载时
onMounted(() => {
  initCard();
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