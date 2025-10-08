<template>
	<div class="selector-container layout-pd">
		<el-date-picker
			v-model="value"
			type="year"
			format="YYYY"
			value-format="YYYY"
			placeholder="选择年"
			@change="initTableData"
		></el-date-picker>
		
		<!-- 统计信息 -->
		<el-row :gutter="15" class="mt15">
			<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
				<el-card shadow="hover" class="home-card-item">
					<div class="flex">
						<div class="flex-auto">
							<span class="font30">{{ summaryData.annualIncome }}</span>
							<div class="mt10">年度总收入</div>
						</div>
						<div class="home-card-item-icon flex" style="background: var(--el-color-success-light-9);">
							<i class="flex-margin font32 el-icon el-icon-TrendCharts" style="color: var(--el-color-success);"></i>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
				<el-card shadow="hover" class="home-card-item">
					<div class="flex">
						<div class="flex-auto">
							<span class="font30">{{ summaryData.annualExpense }}</span>
							<div class="mt10">年度总支出</div>
						</div>
						<div class="home-card-item-icon flex" style="background: var(--el-color-danger-light-9);">
							<i class="flex-margin font32 el-icon el-icon-TrendCharts" style="color: var(--el-color-danger);"></i>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
				<el-card shadow="hover" class="home-card-item">
					<div class="flex">
						<div class="flex-auto">
							<span class="font30">{{ summaryData.annualBalance }}</span>
							<div class="mt10">年度结余</div>
						</div>
						<div class="home-card-item-icon flex" style="background: var(--el-color-primary-light-9);">
							<i class="flex-margin font32 el-icon el-icon-Money" style="color: var(--el-color-primary);"></i>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
				<el-card shadow="hover" class="home-card-item">
					<div class="flex">
						<div class="flex-auto">
							<span class="font30">{{ summaryData.maxIncomeMonth }}</span>
							<div class="mt10">最高收入月</div>
						</div>
						<div class="home-card-item-icon flex" style="background: var(--el-color-warning-light-9);">
							<i class="flex-margin font32 el-icon el-icon-Help" style="color: var(--el-color-warning);"></i>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		
    <el-card shadow="hover" header="月度账单" class="mt15">
      <el-table :data="state.tableData" style="width: 100%">
        <el-table-column prop="month" label="月份"> </el-table-column>
        <el-table-column prop="income" label="收入(￥)" align="right"> </el-table-column>
        <el-table-column prop="expenditure" label="支出(￥)" align="right"> </el-table-column>
        <el-table-column prop="balance" label="结余(￥)" align="right"> </el-table-column>
        <el-table-column prop="credit" label="流入(￥)" align="right"> </el-table-column>
        <el-table-column prop="debit" label="流出(￥)" align="right"> </el-table-column>
        <el-table-column prop="accumulatedIncome" label="累计收入(￥)" align="right"> </el-table-column>
        <el-table-column prop="accumulatedExpenditure" label="累计支出(￥)" align="right"> </el-table-column>
        <el-table-column prop="accumulatedBalance" label="累计结余(￥)" align="right"> </el-table-column>
      </el-table>
    </el-card>
	</div>
</template>

<script setup lang="ts" name="makeSelector">
import { reactive, ref } from 'vue';
import { useStatementApi } from '/@/api/report';
import { verifyNumberRMB } from '/@/utils/toolsValidate';

// 定义变量内容
const state = reactive({
	tableData: [],
});

const summaryData = reactive({
	annualIncome: '0.00',
	annualExpense: '0.00',
	annualBalance: '0.00',
	maxIncomeMonth: '无'
});

const value = ref('');

// 计算汇总数据
const calculateSummary = (data: any[]) => {
	let totalIncome = 0;
	let totalExpense = 0;
	let maxIncome = 0;
	let maxIncomeMonth = '无';
	
	data.forEach(item => {
		// 处理可能的格式化字符串，提取数值
		const income = parseFloat(String(item.income).replace(/[^0-9.-]+/g, "")) || 0;
		const expenditure = parseFloat(String(item.expenditure).replace(/[^0-9.-]+/g, "")) || 0;
		
		totalIncome += income;
		totalExpense += expenditure;
		
		if (income > maxIncome) {
			maxIncome = income;
			maxIncomeMonth = item.month;
		}
	});
	
	summaryData.annualIncome = verifyNumberRMB(totalIncome);
	summaryData.annualExpense = verifyNumberRMB(totalExpense);
	summaryData.annualBalance = verifyNumberRMB(totalIncome - totalExpense);
	summaryData.maxIncomeMonth = maxIncomeMonth;
};

// 计算累计数据
const calculateAccumulatedData = (data: any[]) => {
	let accumulatedIncome = 0;
	let accumulatedExpenditure = 0;
	
	return data.map(item => {
		// 处理可能的格式化字符串，提取数值
		const income = parseFloat(String(item.income).replace(/[^0-9.-]+/g, "")) || 0;
		const expenditure = parseFloat(String(item.expenditure).replace(/[^0-9.-]+/g, "")) || 0;
		
		accumulatedIncome += income;
		accumulatedExpenditure += expenditure;
		
		return {
			...item,
			accumulatedIncome: verifyNumberRMB(accumulatedIncome),
			accumulatedExpenditure: verifyNumberRMB(accumulatedExpenditure),
			accumulatedBalance: verifyNumberRMB(accumulatedIncome - accumulatedExpenditure)
		};
	});
};

const initTableData = async () => {
  const { getMonthlyBalance } = useStatementApi();
	const params = {
		time: value.value,
	};

  // 获取月度账单数据
  getMonthlyBalance(params).then((res) => {
    // 计算汇总数据
    calculateSummary(res);
    
    // 计算累计数据
    state.tableData = calculateAccumulatedData(res);
  });
};

// 初始化数据
initTableData();
</script>

<style scoped lang="scss">
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

.mt15 {
	margin-top: 15px;
}

.mb15 {
	margin-bottom: 15px;
}

.font30 {
	font-size: 30px;
}

.mt10 {
	margin-top: 10px;
}

.flex {
	display: flex;
}

.flex-auto {
	flex: auto;
}

.ml5 {
	margin-left: 5px;
}
</style>