<template>
	<div class="selector-container layout-pd">
		<el-card shadow="hover" header="年度账单" class="mt15">
			<el-table :data="state.tableData[0]" style="width: 100%">
				<el-table-column prop="month" label="月份"> </el-table-column>
				<el-table-column prop="balance" label="余额(￥)" align="right"> </el-table-column>
				<el-table-column prop="income" label="收入(￥)" align="right"> </el-table-column>
				<el-table-column prop="expenditure" label="支出(￥)" align="right"> </el-table-column>
				<el-table-column prop="credit" label="流入(￥)" align="right"> </el-table-column>
				<el-table-column prop="debit" label="流出(￥)" align="right"> </el-table-column>
			</el-table>
		</el-card>
    <el-card shadow="hover" header="季度账单" class="mt15">
      <el-table :data="state.tableData[1]" style="width: 100%">
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
import { useStatementApi } from '/src/api/statement';

// 定义变量内容
const state = reactive({
	tableData: [[],[],[]],
});

const initTableData = async () => {
  const { getAnnualBalance, getQuarterlyBalance } = useStatementApi();
  // 获取年度账单数据
  getAnnualBalance().then((res) => {
    state.tableData[0] = res;
	});

  // 获取季度账单数据
  getQuarterlyBalance().then((res) => {
		state.tableData[1] = res;
	});
};

initTableData();
</script>
