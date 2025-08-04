<template>
	<div class="system-user-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-user-search mb15">
				<el-date-picker
					v-model="value2"
					type="month"
					format="YYYY-MM"
					value-format="YYYY-MM"
					placeholder="选择月">
				</el-date-picker>
				
				<el-select v-model="searchForm.debit_credit" clearable placeholder="请选择收支" class="ml10">
					<el-option label="收入" value="收入"></el-option>
					<el-option label="支出" value="支出"></el-option>
					<el-option label="不计收支" value="不计收支"></el-option>
				</el-select>
				
				<el-input v-model="searchForm.source" placeholder="请输入来源" clearable class="ml10" style="width: 150px;"></el-input>
				
				<el-input v-model="searchForm.payment_method" placeholder="请输入支付方式" clearable class="ml10" style="width: 150px;"></el-input>
				
				<el-button size="default" type="primary" class="ml10" @click="getTableData">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddBill('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增记录
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddTransfer">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增自转账
				</el-button>
				<!-- TODO: 改为读环境变量，动态获取             -->
        <el-upload
            style="display: inline-block; vertical-align: top;"
            class="upload-btn ml10"
            action="http://43.134.233.6:18080/upload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
        >
          <el-button size="default" type="warning">
            <el-icon>
              <UploadFilled />
            </el-icon>
            上传文件
          </el-button>
        </el-upload>
			</div>
			
			<!-- 统计信息 -->
			<el-row :gutter="15" class="mb15">
				<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
					<el-card shadow="hover" class="home-card-item">
						<div class="flex">
							<div class="flex-auto">
								<span class="font30">{{ statisticsData.income }}</span>
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
								<span class="font30">{{ statisticsData.expense }}</span>
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
								<span class="font30">{{ statisticsData.balance }}</span>
								<div class="mt10">结余</div>
							</div>
							<div class="home-card-item-icon flex" style="background: var(--el-color-primary-light-9);">
								<i class="flex-margin font32 iconfont icon-balance" style="color: var(--el-color-primary);"></i>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
			
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" />
        <el-table-column prop="time" label="交易时间" min-width="150" show-overflow-tooltip></el-table-column>
				<el-table-column prop="debit_credit" label="收/支" show-overflow-tooltip></el-table-column>
				<el-table-column prop="type" label="类别" show-overflow-tooltip></el-table-column>
				<el-table-column prop="source" label="来源" show-overflow-tooltip></el-table-column>
				<el-table-column prop="counterparty" label="交易对方" min-width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="goods" label="商品" min-width="150" show-overflow-tooltip></el-table-column>
				<el-table-column prop="amount" label="金额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payment_method" label="支付方式" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onOpenEditBill('edit', scope.row)"
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
				:page-sizes="[100, 200, 300]"
				v-model:current-page="state.tableData.param.pageNum"
				background
				v-model:page-size="state.tableData.param.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="state.tableData.total"
			>
			</el-pagination>
		</el-card>
		<UserDialog ref="userDialogRef" @refresh="getTableData()" />
		<TransferDialog ref="transferDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useTableApi } from "/@/api/table";
import { verifyNumberRMB } from "/@/utils/toolsValidate";
import { UploadFilled } from "@element-plus/icons-vue";

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/bill/dialog.vue'));
const TransferDialog = defineAsyncComponent(() => import('/@/views/bill/transferDialog.vue'));

// 定义变量内容
const userDialogRef = ref();
const transferDialogRef = ref();
const value2 = ref('');

// 搜索表单
const searchForm = reactive({
  debit_credit: '',
  source: '',
  payment_method: ''
});

const statisticsData = reactive({
	income: '0.00',
	expense: '0.00',
	balance: '0.00'
});

const state = reactive<SysUserState>({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNum: 1,
			pageSize: 100,
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
  // 将 value2 和搜索条件的值添加到 params 中
  const combineParams  = {
    ...state.tableData.param,  // 使用传入的 params（如分页参数）
    time: value2.value,
    debit_credit: searchForm.debit_credit,
    source: searchForm.source,
    payment_method: searchForm.payment_method
  }

  let newParams = removeEmptyProperties(combineParams)

  getTable(newParams)
      .then((res) => {
        // 对 res 中的每个元素进行格式化处理
        const formattedData = res.data.map(item => ({
          ...item,
          amount: formatNumberForAmount(item.amount)
        }));
        state.tableData.data = formattedData;
        state.tableData.total = res.total || formattedData.length;
        
        // 计算统计数据
        calculateStatistics(res.data);
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

// 为金额字段格式化数字显示
const formatNumberForAmount = (value: any) => {
  // 如果值为空或无效，返回默认值
  if (value === undefined || value === null || value === '') {
    return '0.00';
  }
  
  // 如果是字符串，尝试转换为数字
  let numericValue: number;
  if (typeof value === 'string') {
    numericValue = parseFloat(value);
    // 如果转换失败，返回默认值
    if (isNaN(numericValue)) {
      return '0.00';
    }
  } else if (typeof value === 'number') {
    numericValue = value;
  } else {
    // 其他类型尝试转换为数字
    numericValue = Number(value);
    if (isNaN(numericValue)) {
      return '0.00';
    }
  }
  
  // 使用项目中已有的工具函数格式化
  return verifyNumberRMB(numericValue);
};

// 计算统计数据
const calculateStatistics = (data: RowBillType[]) => {
  let income = 0;
  let expense = 0;
  
  data.forEach(item => {
    // 确保金额是数字类型
    const amount = parseFloat(String(item.amount)) || 0;
    if (item.debit_credit === '收入') {
      income += amount;
    } else if (item.debit_credit === '支出') {
      expense += amount;
    }
  });
  
  statisticsData.income = verifyNumberRMB(income);
  statisticsData.expense = verifyNumberRMB(expense);
  statisticsData.balance = verifyNumberRMB(income - expense);
};

// 打开新增记录弹窗
const onOpenAddBill = (type: string) => {
	userDialogRef.value.openDialog(type);
};

// 打开新增转账弹窗
const onOpenAddTransfer = () => {
	transferDialogRef.value.openDialog();
};

// 打开修改记录弹窗
const onOpenEditBill = (type: string, row: RowBillType) => {
	userDialogRef.value.openDialog(type, row);
};
// 删除记录
const onRowDel = (row: RowBillType) => {
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