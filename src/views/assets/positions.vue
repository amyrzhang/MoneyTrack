<template>
  <div class="positions-container layout-pd">
    <el-card shadow="hover" header="证券持仓" class="mt15">
      <!-- 统计信息 -->
      <el-row :gutter="15" class="mb15">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <el-card shadow="hover" class="home-card-item">
            <div class="flex">
              <div class="flex-auto">
                <span class="font30">{{ formatNumber(state.statistics.totalPositionValue, 2) }}</span>
                <div class="mt10">证券市值</div>
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
                <span :class="state.statistics.totalUnrealizedPnl >= 0 ? 'text-danger' : 'text-success'">
                  {{ formatNumber(state.statistics.totalUnrealizedPnl, 2) }}
                </span>
                <div class="mt10">持仓盈亏</div>
              </div>
              <div class="home-card-item-icon flex" style="background: var(--el-color-primary-light-9);">
                <i class="flex-margin font32 iconfont icon-balance" style="color: var(--el-color-primary);"></i>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-table :data="state.tableData" style="width: 100%" v-loading="state.loading">
        <el-table-column prop="stock_code" label="证券代码" width="100">
        </el-table-column>
        <el-table-column prop="position_value" label="市值" align="right">
          <template #default="scope">
            {{ formatNumber(scope.row.position_value, 2) }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="持仓数量" align="right">
          <template #default="scope">
            {{ formatNumber(scope.row.quantity, 0) }}
          </template>
        </el-table-column>
        <el-table-column prop="avg_cost" label="成本价" align="right">
          <template #default="scope">
            {{ formatNumber(scope.row.avg_cost, 3) }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="当前价" align="right">
          <template #default="scope">
            {{ formatNumber(scope.row.price, 3) }}
          </template>
        </el-table-column>
        <el-table-column prop="unrealized_pnl" label="持仓盈亏" align="right">
          <template #default="scope">
            <span :class="scope.row.unrealized_pnl >= 0 ? 'text-danger' : 'text-success'">
              {{ formatNumber(scope.row.unrealized_pnl, 2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="pnl_ratio" label="持仓盈亏率" align="right">
          <template #default="scope">
            <span :class="scope.row.pnl_ratio >= 0 ? 'text-danger' : 'text-success'">
              {{ scope.row.pnl_ratio >= 0 ? '+' : '' }}{{ formatNumber(scope.row.pnl_ratio, 2) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="realized_pnl" label="总成本" align="right">
          <template #default="scope">
            <span :class="scope.row.realized_pnl >= 0 ? 'text-danger' : 'text-success'">
              {{ formatNumber(scope.row.realized_pnl, 2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="position_ratio" label="仓位比例(%)" align="right">
          <template #default="scope">
            {{ formatNumber(scope.row.position_ratio * 100, 2) }}%
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
        class="mt15"
        :pager-count="5"
        :page-sizes="[10, 20, 30]"
        v-model:current-page="state.queryParams.pageNum"
        background
        v-model:page-size="state.queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="assetPositions">
import { reactive, onMounted } from 'vue';
import { useTableApi } from '/@/api/table';

// 定义变量内容
const state = reactive({
  tableData: [],
  total: 0,
  loading: false,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
  statistics: {
    totalPositionValue: 0, // 证券市值总和
    totalUnrealizedPnl: 0  // 持仓盈亏总和
  }
});

// 格式化数字显示，添加千分位逗号分隔符
const formatNumber = (value: number, digits: number = 2) => {
  if (value === undefined || value === null) return '-';
  
  // 先保留指定小数位数
  const fixedValue = value.toFixed(digits);
  
  // 添加千分位分隔符
  const [integerPart, decimalPart] = fixedValue.split('.');
  
  // 对整数部分添加千分位分隔符
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // 如果有小数部分，则拼接小数部分
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

// 计算统计信息
const calculateStatistics = (data: any[]) => {
  let totalPositionValue = 0;
  let totalUnrealizedPnl = 0;
  
  data.forEach(item => {
    totalPositionValue += parseFloat(item.position_value) || 0;
    totalUnrealizedPnl += parseFloat(item.unrealized_pnl) || 0;
  });
  
  state.statistics.totalPositionValue = totalPositionValue;
  state.statistics.totalUnrealizedPnl = totalUnrealizedPnl;
};

// 获取持仓数据
const getPositionsData = async () => {
  state.loading = true;
  try {
    const { getPosition } = useTableApi();
    const res = await getPosition(state.queryParams);
    state.tableData = res.data || [];
    state.total = res.total || 0;
    
    // 计算统计信息
    calculateStatistics(state.tableData);
  } catch (error) {
    console.error('获取证券持仓数据失败:', error);
  } finally {
    state.loading = false;
  }
};

// 分页相关方法
const onHandleSizeChange = (val: number) => {
  state.queryParams.pageSize = val;
  getPositionsData();
};

const onHandleCurrentChange = (val: number) => {
  state.queryParams.pageNum = val;
  getPositionsData();
};

// 页面加载时获取数据
onMounted(() => {
  getPositionsData();
});
</script>

<style scoped lang="scss">
.positions-container {
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    
    .el-table {
      flex: 1;
    }
  }
  
  .text-success {
    color: var(--el-color-success);
  }
  
  .text-danger {
    color: var(--el-color-danger);
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
}
</style>