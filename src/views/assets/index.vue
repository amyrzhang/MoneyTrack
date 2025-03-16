<template>
	<div class="selector-container layout-pd">
		<el-card shadow="hover" header="资产概览" class="mt15">
			<el-table :data="state.tableData" style="width: 100%">
				<el-table-column prop="account_name" label="资产账户"> </el-table-column>
				<el-table-column prop="account_type" label="账户类型" align="right"> </el-table-column>
				<el-table-column prop="balance" label="余额(￥)" align="right"> </el-table-column>
				<el-table-column prop="percent" label="仓位(%)" align="right"> </el-table-column>
				<el-table-column prop="credit" label="流入(￥)" align="right"> </el-table-column>
				<el-table-column prop="debit" label="流出(￥)" align="right"> </el-table-column>
			</el-table>
		</el-card>
		<el-card shadow="hover" header="月度账单" class="mt15">
			<el-table :data="state.billData" style="width: 100%">
				<el-table-column prop="month" label="月份"> </el-table-column>
				<el-table-column prop="balance" label="余额(￥)" align="right"> </el-table-column>
				<el-table-column prop="income" label="收入(￥)" align="right"> </el-table-column>
				<el-table-column prop="expenditure" label="支出(￥)" align="right"> </el-table-column>
				<el-table-column prop="credit" label="流入(￥)" align="right"> </el-table-column>
				<el-table-column prop="debit" label="流出(￥)" align="right"> </el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="makeSelector">
import { reactive } from 'vue';
import { useTableApi } from '/src/api/table';

// 定义变量内容
const state = reactive({
	tableData: [],
	billData: [],
});

const initTableData = async () => {
  const { getAccountBalance } = useTableApi();
  getAccountBalance().then((res) => {
    state.tableData = res;
	});

	const { getMonthlyBalance } = useTableApi();
	getMonthlyBalance().then((res) => {
		state.billData = res;
	});
};

initTableData();
</script>
