<template>
	<div class="system-statement-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-statement-search mb15">
				<el-date-picker
					v-model="searchForm.month"
					type="month"
					format="YYYY-MM"
					value-format="YYYY-MM"
					placeholder="选择月份">
				</el-date-picker>
				
				<el-button size="default" type="primary" class="ml10" @click="getTableData" :loading="loading">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="exportStatement">
					<el-icon>
						<ele-Download />
					</el-icon>
					导出对账单
				</el-button>
			</div>
			
			<!-- 统计信息 -->
			<el-row :gutter="15" class="mb15">
				<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
					<el-card shadow="hover" class="home-card-item">
						<div class="flex">
							<div class="flex-auto">
								<span class="font30">{{ statementData.openingBalance }}</span>
								<div class="mt10">期初余额</div>
							</div>
							<div class="home-card-item-icon flex" style="background: var(--el-color-primary-light-9);">
								<i class="flex-margin font32 iconfont icon-balance" style="color: var(--el-color-primary);"></i>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
					<el-card shadow="hover" class="home-card-item">
						<div class="flex">
							<div class="flex-auto">
								<span class="font30">{{ statementData.currentPeriodChange }}</span>
								<div class="mt10">本期变动</div>
							</div>
							<div class="home-card-item-icon flex" :style="parseFloat(statementData.currentPeriodChange) >= 0 ? 'background: var(--el-color-success-light-9);' : 'background: var(--el-color-danger-light-9);'">
								<i class="flex-margin font32 iconfont" :class="parseFloat(statementData.currentPeriodChange) >= 0 ? 'icon-income' : 'icon-expenses'" :style="parseFloat(statementData.currentPeriodChange) >= 0 ? 'color: var(--el-color-success);' : 'color: var(--el-color-danger);'"></i>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
					<el-card shadow="hover" class="home-card-item">
						<div class="flex">
							<div class="flex-auto">
								<span class="font30">{{ statementData.closingBalance }}</span>
								<div class="mt10">期末余额</div>
							</div>
							<div class="home-card-item-icon flex" style="background: var(--el-color-primary-light-9);">
								<i class="flex-margin font32 iconfont icon-balance" style="color: var(--el-color-primary);"></i>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
			
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="month_date" label="月份" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="total_opening_balance" label="期初余额" width="150" align="right" show-overflow-tooltip></el-table-column>
				<el-table-column prop="total_current_period_change" label="本期变动" width="150" align="right" show-overflow-tooltip>
					<template #default="scope">
						<span :style="parseFloat(scope.row.total_current_period_change) >= 0 ? 'color: var(--el-color-success);' : 'color: var(--el-color-danger);'">
							{{ scope.row.total_current_period_change }}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="total_closing_balance" label="期末余额" width="150" align="right" show-overflow-tooltip></el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="statement">
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '/@/utils/request';

// 获取上个月的年月格式
const getLastMonth = () => {
	const now = new Date();
	const lastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	return lastMonth.toISOString().slice(0, 7);
};

// 定义变量内容
const searchForm = reactive({
	month: getLastMonth() // 默认为上个月
});

const statementData = reactive({
	openingBalance: '0.00',
	currentPeriodChange: '0.00',
	closingBalance: '0.00'
});

const tableData = ref<any[]>([]);
const loading = ref(false);

// 初始化表格数据
const getTableData = () => {
	console.log('getTableData function called');
	loading.value = true;
  const params = {
		start_month: searchForm.month + '-01',
    end_month: searchForm.month + '-01'
	};
  console.log('请求参数:', params);
  
  request({
    url: '/api/bank-statement/monthly-agg',
    method: 'get',
    params
  })
    .then((res) => {
      console.log('API完整响应:', res);
      // 检查响应数据结构
      if (res) {
        // 检查是否有code字段表示状态
        if (res.code !== undefined && res.code !== 0) {
          console.warn('API返回错误码:', res.code, res.message);
          ElMessage.error('获取对账单数据失败: ' + (res.message || '未知错误'));
          tableData.value = [];
          return;
        }
        
        // 根据不同可能的数据结构处理数据
        let data = [];
        if (res.data) {
          data = Array.isArray(res.data) ? res.data : [res.data];
        } else if (Array.isArray(res)) {
          data = res;
        } else if (res) {
          data = [res];
        }
        
        console.log('处理后的数据:', data);
        tableData.value = data;
        
        // 更新统计信息
        if (data.length > 0) {
          const latest = data[0];
          statementData.openingBalance = latest.total_opening_balance || latest.openingBalance || '0.00';
          statementData.currentPeriodChange = latest.total_current_period_change || latest.currentPeriodChange || '0.00';
          statementData.closingBalance = latest.total_closing_balance || latest.closingBalance || '0.00';
        }
      } else {
        console.warn('响应数据为空或格式不正确');
        tableData.value = [];
      }
    })
    .catch((error) => {
      ElMessage.error('获取对账单数据失败: ' + (error.message || error));
      console.error('获取对账单数据失败:', error);
      tableData.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
};

// 导出对账单
const exportStatement = () => {
	ElMessage.success('导出对账单功能待实现');
};

// 页面加载时
onMounted(() => {
	console.log('onMounted hook called');
	getTableData();
});
</script>

<style scoped lang="scss">
.system-statement-container {
	:deep(.el-card__body) {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: auto;
		.el-table {
			flex: 1;
		}
	}
}

.home-card-item {
	height: 100%;
	:deep(.el-card__body) {
		padding: 20px;
		.home-card-item-icon {
			width: 40px;
			height: 40px;
			border-radius: 4px;
			i {
				color: var(--el-text-color-placeholder);
			}
		}
	}
}
</style>