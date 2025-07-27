<template>
  <div class="transaction-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="transaction-search mb15">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="mr10"
        ></el-date-picker>
        <el-select v-model="searchForm.securityType" placeholder="证券类型" clearable class="mr10">
          <el-option label="股票" value="stock"></el-option>
          <el-option label="基金" value="fund"></el-option>
          <el-option label="债券" value="bond"></el-option>
        </el-select>
        <el-input v-model="searchForm.securityCode" placeholder="证券代码" clearable class="mr10" style="width: 150px;"></el-input>
        <el-button size="default" type="primary" class="ml10" @click="getTransactionData">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddTransaction('add')">
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          新增记录
        </el-button>
      </div>

      <!-- 统计信息 -->
      <el-row :gutter="15" class="mb15">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <el-card shadow="hover" class="home-card-item">
            <div class="flex">
              <div class="flex-auto">
                <span class="font30">{{ statisticsData.totalBuy }}</span>
                <div class="mt10">总买入</div>
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
                <span class="font30">{{ statisticsData.totalSell }}</span>
                <div class="mt10">总卖出</div>
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
                <span class="font30">{{ statisticsData.profit }}</span>
                <div class="mt10">总盈亏</div>
              </div>
              <div class="home-card-item-icon flex" style="background: var(--el-color-primary-light-9);">
                <i class="flex-margin font32 el-icon el-icon-Money" style="color: var(--el-color-primary);"></i>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="tradeDate" label="交易日期" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="securityCode" label="证券代码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="securityName" label="证券名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="securityType" label="证券类型" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-if="scope.row.securityType === 'stock'">股票</el-tag>
            <el-tag v-else-if="scope.row.securityType === 'fund'">基金</el-tag>
            <el-tag v-else-if="scope.row.securityType === 'bond'">债券</el-tag>
            <span v-else>{{ scope.row.securityType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tradeType" label="交易类型" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.tradeType === 'buy'">买入</el-tag>
            <el-tag type="danger" v-else-if="scope.row.tradeType === 'sell'">卖出</el-tag>
            <span v-else>{{ scope.row.tradeType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="成交价格(￥)" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column prop="quantity" label="成交数量" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column prop="amount" label="成交金额(￥)" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fee" label="手续费(￥)" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenEditTransaction('edit', scope.row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
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
    <TransactionDialog ref="transactionDialogRef" @refresh="getTransactionData()" />
  </div>
</template>

<script setup lang="ts" name="transaction">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useTransactionApi } from '/@/api/transaction';
import { verifyNumberRMB } from '/@/utils/toolsValidate';

// 引入组件
const TransactionDialog = defineAsyncComponent(() => import('./dialog.vue'));

// 定义变量内容
const transactionDialogRef = ref();
const searchForm = reactive({
  dateRange: [],
  securityType: '',
  securityCode: ''
});

const statisticsData = reactive({
  totalBuy: '0.00',
  totalSell: '0.00',
  profit: '0.00'
});

const state = reactive({
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
const getTransactionData = () => {
  const { getTransactions } = useTransactionApi();
  state.tableData.loading = true;
  state.tableData.data = [];

  // 构造查询参数
  const params = {
    ...state.tableData.param,
    startDate: searchForm.dateRange && searchForm.dateRange[0] ? searchForm.dateRange[0] : undefined,
    endDate: searchForm.dateRange && searchForm.dateRange[1] ? searchForm.dateRange[1] : undefined,
    securityType: searchForm.securityType || undefined,
    securityCode: searchForm.securityCode || undefined
  };

  // 移除空参数
  const cleanedParams = Object.keys(params).reduce((acc, key) => {
    if (params[key] !== undefined && params[key] !== '') {
      acc[key] = params[key];
    }
    return acc;
  }, {});

  getTransactions(cleanedParams)
    .then((res: any) => {
      state.tableData.data = res.data.map((item: any) => {
        return {
          ...item,
          price: verifyNumberRMB(item.price),
          amount: verifyNumberRMB(item.amount),
          fee: verifyNumberRMB(item.fee)
        };
      });
      state.tableData.total = res.total || res.data.length;
      
      // 计算统计数据
      calculateStatistics(res.data);
    })
    .catch((err: any) => {
      console.error('Error fetching transaction data: ', err);
      ElMessage.error('获取数据失败');
    })
    .finally(() => {
      setTimeout(() => {
        state.tableData.loading = false;
      }, 500);
    });
};

// 计算统计数据
const calculateStatistics = (data: any[]) => {
  let totalBuy = 0;
  let totalSell = 0;
  
  data.forEach(item => {
    const amount = parseFloat(String(item.amount).replace(/[^0-9.-]+/g, "")) || 0;
    if (item.tradeType === 'buy') {
      totalBuy += amount;
    } else if (item.tradeType === 'sell') {
      totalSell += amount;
    }
  });
  
  statisticsData.totalBuy = verifyNumberRMB(totalBuy);
  statisticsData.totalSell = verifyNumberRMB(totalSell);
  statisticsData.profit = verifyNumberRMB(totalSell - totalBuy);
};

// 打开新增记录弹窗
const onOpenAddTransaction = (type: string) => {
  transactionDialogRef.value.openDialog(type);
};

// 打开修改记录弹窗
const onOpenEditTransaction = (type: string, row: any) => {
  transactionDialogRef.value.openDialog(type, row);
};

// 删除记录
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除证券代码：“${row.securityCode}”的交易记录，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { deleteTransaction } = useTransactionApi();
      try {
        await deleteTransaction(row.id);
        ElMessage.success('删除成功');
        getTransactionData();
      } catch (err) {
        console.error('Error deleting transaction: ', err);
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {});
};

// 分页改变
const onHandleSizeChange = (val: number) => {
  state.tableData.param.pageSize = val;
  getTransactionData();
};

// 分页改变
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNum = val;
  getTransactionData();
};

// 页面加载时
onMounted(() => {
  getTransactionData();
});
</script>

<style scoped lang="scss">
.transaction-container {
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

.mr10 {
  margin-right: 10px;
}

.mb15 {
  margin-bottom: 15px;
}

.mt15 {
  margin-top: 15px;
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
</style>