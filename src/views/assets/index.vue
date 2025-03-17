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
	</div>
</template>

<script setup lang="ts" name="makeSelector">
import { reactive } from 'vue';
import { useTableApi } from '/@/api/table';

// 定义变量内容
const state = reactive({
	tableData: [],
});

const initTableData = async () => {
  const { getAccountBalance } = useTableApi();
  try {
    const res = await getAccountBalance();
    state.tableData = res;
  } catch (error) {
    console.error('Failed to fetch account balance:', error);
  }
};

initTableData();
</script>
