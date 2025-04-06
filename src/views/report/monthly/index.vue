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
    <el-card shadow="hover" header="月度账单" class="mt15">
      <el-table :data="state.tableData" style="width: 100%">
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
import { reactive, ref } from 'vue';
import { useReportApi } from '/@/api/report';

// 定义变量内容
const state = reactive({
	tableData: [],
});
const value = ref('');

const initTableData = async () => {
  const { getMonthlyBalance } = useReportApi();
	const params = {
		time: value.value,
	};

  // 获取月度账单数据
  getMonthlyBalance(params).then((res) => {
    state.tableData = res;
  });
};

initTableData();
</script>
