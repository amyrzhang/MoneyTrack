<template>
	<div class="system-user-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-user-search mb15">
				<el-input size="default" placeholder="请输入收入/支出" style="max-width: 180px"> </el-input>
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
				<!-- TODO: 改为读环境变量，动态获取             -->
				<el-upload
					style="display: inline-block"
					class="upload-btn ml10"
					action="http://43.134.233.6:18080/upload"
					:on-success="handleUploadSuccess"
					:on-error="handleUploadError"
				>
					<el-button size="default" type="success" style="background-color: #4dbb7e; border-color: #4dbb7e;"> 上传文件</el-button>
				</el-upload>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" />
        <el-table-column prop="time" label="交易时间" min-width="150" show-overflow-tooltip></el-table-column>
				<el-table-column prop="debit_credit" label="收/支" show-overflow-tooltip></el-table-column>
				<el-table-column prop="counterparty" label="交易对方" min-width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="goods" label="商品" min-width="150" show-overflow-tooltip></el-table-column>
				<el-table-column prop="amount" label="金额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payment_method" label="支付方式" show-overflow-tooltip></el-table-column>
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
import { useTableApi } from "/src/api/table";
import {verifyNumberRMB} from "/src/utils/toolsValidate";

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/src/views/bill/dialog.vue'));

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
  const { getTable } = useTableApi();
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
  getTable(newParams)
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
const handleUploadSuccess = (response: any, file: any) => {
	console.log(response);
};
const handleUploadError = (err: any, file: any) => {
	console.log(err);
	if (err.response.status === 409) {
		errorMessage = '文件已存在';
	}
	this.$message.error(errorMessage);
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
