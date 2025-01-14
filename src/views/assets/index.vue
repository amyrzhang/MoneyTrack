<template>
	<div class="selector-container layout-pd">
		<el-card shadow="hover" header="月度对账单" class="mt15">
			<el-table :data="state.tableData" show-summary style="width: 100%">
				<el-table-column prop="支付方式" label="资产账户"> </el-table-column>
				<el-table-column prop="支出" label="支出(￥)" align="right"> </el-table-column>
				<el-table-column prop="收入" label="收入(￥)" align="right"> </el-table-column>
        <el-table-column prop="不计收支" label="不计收支(￥)" align="right"> </el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="makeSelector">
import { reactive } from 'vue';
import { useReportApi } from '/src/api/report';

// 定义变量内容
const state = reactive({
	tableData: [],
});

const initTableData = async () => {
  const { getAdminAccount } = useReportApi();
  getAdminAccount().then((res) => {
    state.tableData = res;
	});
};

initTableData();
</script>
