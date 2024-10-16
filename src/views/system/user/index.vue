<template>
	<div class="system-user-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-user-search mb15">
				<el-input size="default" placeholder="请输入商品名称" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddUser('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增用户
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="time" label="交易时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="source" label="来源" show-overflow-tooltip></el-table-column>
				<el-table-column prop="expenditure_income" label="收/支" show-overflow-tooltip></el-table-column>
				<el-table-column prop="category" label="类别" show-overflow-tooltip></el-table-column>
				<el-table-column prop="counterparty" label="交易对方" show-overflow-tooltip></el-table-column>
				<el-table-column prop="goods" label="商品" show-overflow-tooltip></el-table-column>
				<el-table-column prop="reversed" label="是否冲账" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status">冲账</el-tag>
						<el-tag type="info" v-else>不冲账</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="amount" label="金额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pay_method" label="支付方式" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onOpenEditUser('edit', scope.row)"
							>修改</el-button
						>
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10, 20, 30]"
				v-model:current-page="state.tableData.param.pageNum"
				background
				v-model:page-size="state.tableData.param.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="state.tableData.total"
			>
			</el-pagination>
		</el-card>
		<UserDialog ref="userDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useTableApi } from "/@/api/table";
import {verifyNumberRMB} from "/@/utils/toolsValidate";

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/system/user/dialog.vue'));

// 定义变量内容
const userDialogRef = ref();
const state = reactive<SysUserState>({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNum: 1,
			pageSize: 10,
		},
	},
});

// 初始化表格数据
const getTableData = (params?: EmptyObjectType) => {
  const { getAdminTable } = useTableApi();
	state.tableData.loading = true;
  state.tableData.data = [];
  function removeEmptyProperties(obj) {
    for (const key in obj) {
      if (obj[key] === '') {
        delete obj[key];
      }
    }
    return obj;
  }
  let newParams = removeEmptyProperties(params)
  getAdminTable(newParams)
      .then((res) => {
        // 对 res 中的每个元素进行格式化处理
        const formattedData = res.map(item => ({
          ...item,
          amount: verifyNumberRMB(item.amount)
        }));
        state.tableData.data = formattedData;
        console.log(formattedData);
        state.tableData.total = formattedData.length;
      })
      .catch((err) => {
        console.error('Error fetching data: ', err);
      })
      .finally(() => {
        setTimeout(() => {
          state.tableData.loading = false;
        }, 500);
      });
};
// 打开新增用户弹窗
const onOpenAddUser = (type: string) => {
	userDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditUser = (type: string, row: RowUserType) => {
	userDialogRef.value.openDialog(type, row);
};
// 删除用户
const onRowDel = (row: RowUserType) => {
	ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.userName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			getTableData();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};
// 分页改变
const onHandleSizeChange = (val: number) => {
	state.tableData.param.pageSize = val;
	getTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNum = val;
	getTableData();
};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.system-user-container {
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
</style>
