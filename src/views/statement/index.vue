<template>
	<div class="system-statement-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-statement-search mb15">
				<el-date-picker
					v-model="searchForm.year"
					type="year"
					format="YYYY"
					value-format="YYYY"
					placeholder="选择年份">
				</el-date-picker>
				
				<el-select v-model="searchForm.type" clearable placeholder="请选择类型" class="ml10" style="width: 150px;">
					<el-option label="交通" value="交通"></el-option>
					<el-option label="餐饮" value="餐饮"></el-option>
					<el-option label="购物" value="购物"></el-option>
					<el-option label="娱乐" value="娱乐"></el-option>
					<el-option label="医疗" value="医疗"></el-option>
					<el-option label="教育" value="教育"></el-option>
					<el-option label="投资" value="投资"></el-option>
					<el-option label="理财" value="理财"></el-option>
					<el-option label="保险" value="保险"></el-option>
					<el-option label="其他" value="其他"></el-option>
				</el-select>
				
				<el-button size="default" type="primary" class="ml10" @click="getTableData">
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
								<span class="font30">{{ statementData.totalIncome }}</span>
								<div class="mt10">总收入</div>
							</div>
							<div class="home-card-item-icon flex" style="background: var(--el-color-success-light-9);">
								<i class="flex-margin font32 iconfont icon-income" style="color: var(--el-color-success);"></i>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
					<el-card shadow="hover" class="home-card-item">
						<div class="flex">
							<div class="flex-auto">
								<span class="font30">{{ statementData.totalExpense }}</span>
								<div class="mt10">总支出</div>
							</div>
							<div class="home-card-item-icon flex" style="background: var(--el-color-danger-light-9);">
								<i class="flex-margin font32 iconfont icon-expenses" style="color: var(--el-color-danger);"></i>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
					<el-card shadow="hover" class="home-card-item">
						<div class="flex">
							<div class="flex-auto">
								<span class="font30">{{ statementData.netBalance }}</span>
								<div class="mt10">净结余</div>
							</div>
							<div class="home-card-item-icon flex" style="background: var(--el-color-primary-light-9);">
								<i class="flex-margin font32 iconfont icon-balance" style="color: var(--el-color-primary);"></i>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
			
			<el-table :data="tableData" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="month" label="月份" width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="type" label="类型" width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="incomeCount" label="收入笔数" width="100" align="right" show-overflow-tooltip></el-table-column>
				<el-table-column prop="incomeAmount" label="收入金额" width="120" align="right" show-overflow-tooltip></el-table-column>
				<el-table-column prop="expenseCount" label="支出笔数" width="100" align="right" show-overflow-tooltip></el-table-column>
				<el-table-column prop="expenseAmount" label="支出金额" width="120" align="right" show-overflow-tooltip></el-table-column>
				<el-table-column prop="netAmount" label="净额" width="120" align="right" show-overflow-tooltip></el-table-column>
				<el-table-column prop="balance" label="月末余额" width="120" align="right" show-overflow-tooltip></el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="statement">
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

// 定义变量内容
const searchForm = reactive({
	year: new Date().getFullYear().toString(),
	type: ''
});

const statementData = reactive({
	totalIncome: '0.00',
	totalExpense: '0.00',
	netBalance: '0.00'
});

const tableData = ref<any[]>([]);

// 初始化表格数据
const getTableData = () => {
	// 这里应该调用实际的API获取数据
	// 模拟数据
	const mockData = [];
	for (let i = 1; i <= 12; i++) {
		const incomeAmount = (Math.random() * 10000).toFixed(2);
		const expenseAmount = (Math.random() * 8000).toFixed(2);
		const netAmount = (parseFloat(incomeAmount) - parseFloat(expenseAmount)).toFixed(2);
		mockData.push({
			month: `${i}月`,
			type: searchForm.type || '全部',
			incomeCount: Math.floor(Math.random() * 50),
			incomeAmount: incomeAmount,
			expenseCount: Math.floor(Math.random() * 40),
			expenseAmount: expenseAmount,
			netAmount: netAmount,
			balance: (Math.random() * 20000).toFixed(2)
		});
	}
	
	tableData.value = mockData;
	calculateStatementSummary(mockData);
};

// 计算对账单汇总数据
const calculateStatementSummary = (data: any[]) => {
	let totalIncome = 0;
	let totalExpense = 0;
	
	data.forEach(item => {
		totalIncome += parseFloat(item.incomeAmount) || 0;
		totalExpense += parseFloat(item.expenseAmount) || 0;
	});
	
	statementData.totalIncome = totalIncome.toFixed(2);
	statementData.totalExpense = totalExpense.toFixed(2);
	statementData.netBalance = (totalIncome - totalExpense).toFixed(2);
};

// 导出对账单
const exportStatement = () => {
	ElMessage.success('导出对账单功能待实现');
};

// 页面加载时
onMounted(() => {
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