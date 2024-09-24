<template>
	<div class="selector-container layout-pd">
		<el-card shadow="hover" header="图标选择器(宽度自动)：">
			<IconSelector @get="onGetIcon" @clear="onClearIcon" v-model="state.modelIcon" />
		</el-card>

		<el-card shadow="hover" header="月度对账单" class="mt15">
			<el-table :data="state.tableData" show-summary style="width: 100%">
				<el-table-column prop="支付方式" label="资产账户"> </el-table-column>
				<el-table-column prop="支出" label="支出(￥)" align="right"> </el-table-column>
				<el-table-column prop="收入" label="收入(￥)" align="right"> </el-table-column>
        <el-table-column prop="不计收支" label="不计收支(￥)" align="right"> </el-table-column>
			</el-table>
		</el-card>

		<el-card shadow="hover" header="图标选择器(宽度自动)：事件" class="mt15">
			<el-table :data="state.tableData1" style="width: 100%">
				<el-table-column prop="a1" label="事件名称"> </el-table-column>
				<el-table-column prop="a2" label="说明"> </el-table-column>
				<el-table-column prop="a3" label="类型"> </el-table-column>
				<el-table-column prop="a4" label="回调参数"> </el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="makeSelector">
import {defineAsyncComponent, reactive, ref} from 'vue';
import { useReportApi } from '/@/api/report';

// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

// 定义变量内容
const state = reactive({
	modelIcon: '',
	tableData: [],
	tableData1: [
		{
			a1: 'get',
			a2: '获取当前点击的 icon 图标',
			a3: 'function',
			a4: '(icon: string)',
		},
		{
			a1: 'clear',
			a2: '清空当前点击的 icon 图标',
			a3: 'function',
			a4: '(icon: string)',
		},
	],
});

const initTableData = async () => {
  const { getAdminAccount } = useReportApi();
  getAdminAccount().then((res) => {
    state.tableData = res;
		console.log(res);
	});
};

initTableData();
// 获取当前点击的 icon 图标
const onGetIcon = (icon: string) => {
	console.log(icon);
};
// 清空当前点击的 icon 图标
const onClearIcon = (icon: string) => {
	console.log(icon);
};
</script>
