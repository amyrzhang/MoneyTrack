<template>
	<div class="selector-container layout-pd">
		<el-tabs v-model="activeTab" class="mt15">
      <el-tab-pane label="资产概览" name="overview">
        <el-card shadow="hover" header="资产概览">
          <el-table 
            :data="treeTableData" 
            style="width: 100%"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            default-expand-all
          >
            <el-table-column prop="name" label="资产账户">
            </el-table-column>
            <el-table-column prop="balance" label="余额(￥)" align="right">
              <template #default="scope">
                {{ formatAmount(scope.row.balance) }}
              </template>
            </el-table-column>
            <el-table-column prop="credit" label="流入(￥)" align="right">
              <template #default="scope">
                {{ formatAmount(scope.row.credit) }}
              </template>
            </el-table-column>
            <el-table-column prop="debit" label="流出(￥)" align="right">
              <template #default="scope">
                {{ formatAmount(scope.row.debit) }}
              </template>
            </el-table-column>
            <el-table-column prop="income" label="收入(￥)" align="right">
              <template #default="scope">
                {{ formatAmount(scope.row.income) }}
              </template>
            </el-table-column>
            <el-table-column prop="expense" label="支出(￥)" align="right">
              <template #default="scope">
                {{ formatAmount(scope.row.expense) }}
              </template>
            </el-table-column>
            <el-table-column prop="percent" label="仓位(%)" align="right">
              <template #default="scope">
                {{ formatPercent(scope.row.percent) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="证券持仓" name="positions">
        <Positions />
      </el-tab-pane>
    </el-tabs>
	</div>
</template>

<script setup lang="ts" name="assets">
import { reactive, ref, computed } from 'vue';
import { useTableApi } from '/@/api/table';
import Positions from '/@/views/assets/positions.vue';

// 定义变量内容
const activeTab = ref('overview');

const state = reactive({
	tableData: [],
});

// 格式化金额显示
const formatAmount = (value: string | number) => {
  // 转换为浮点数
  const num = parseFloat(String(value));
  
  // 检查是否为有效数字
  if (isNaN(num)) {
    return '0.00';
  }
  
  // 格式化为带有千分位分隔符的字符串，保留两位小数
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// 格式化百分比显示
const formatPercent = (value: string | number) => {
  // 转换为浮点数
  const num = parseFloat(String(value));
  
  // 检查是否为有效数字
  if (isNaN(num)) {
    return '0.00%';
  }
  
  // 格式化为百分比形式，保留两位小数
  return `${num.toFixed(2)}%`;
};

// 构建树形表格数据
const treeTableData = computed(() => {
  // 按账户类型分组
  const groups: { [key: string]: any[] } = {};
  
  state.tableData.forEach((item: any) => {
    const type = item.account_type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
  });

  // 构建树形结构数据
  const result = [];
  
  for (const type in groups) {
    // 计算该类型下的总余额
    const totalBalance = groups[type].reduce((sum, account) => sum + parseFloat(account.balance || 0), 0);
    const totalCredit = groups[type].reduce((sum, account) => sum + parseFloat(account.credit || 0), 0);
    const totalDebit = groups[type].reduce((sum, account) => sum + parseFloat(account.debit || 0), 0);
    const totalIncome = groups[type].reduce((sum, account) => sum + parseFloat(account.income || 0), 0);
    const totalExpense = groups[type].reduce((sum, account) => sum + parseFloat(account.expense || 0), 0);
    // 对于类型节点，percent显示为100%
    const totalPercent = 100;
    
    // 创建类型节点
    const typeNode = {
      id: `type_${type}`,
      name: type,
      balance: totalBalance,
      credit: totalCredit,
      debit: totalDebit,
      income: totalIncome,
      expense: totalExpense,
      percent: totalPercent,
      children: groups[type].map((account, index) => ({
        id: `account_${type}_${index}`,
        name: account.account_name,
        balance: parseFloat(account.balance || 0),
        credit: parseFloat(account.credit || 0),
        debit: parseFloat(account.debit || 0),
        income: parseFloat(account.income || 0),
        expense: parseFloat(account.expense || 0),
        percent: parseFloat(account.percent || 0),
        children: []
      }))
    };
    
    result.push(typeNode);
  }
  
  return result;
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

// 初始化数据
initTableData();
</script>

<style scoped lang="scss">
.mt15 {
  margin-top: 15px;
}
</style>