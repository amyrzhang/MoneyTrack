<template>
  <div class="system-user-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="交易时间">
              <el-date-picker
                  v-model="state.ruleForm.timestamp"
                  type="datetime"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择交易日期"
                  style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="证券代码">
              <el-input v-model="state.ruleForm.stock_code" placeholder="请输入证券代码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="交易类型">
              <el-select v-model="state.ruleForm.type" placeholder="请选择交易类型" clearable class="w100">
                <el-option label="买入" value="BUY"></el-option>
                <el-option label="卖出" value="SELL"></el-option>
                <el-option label="红利入账" value="DIVIDEND"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="成交价格">
              <el-input v-model="state.ruleForm.price" placeholder="请输入成交价格" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="成交数量">
              <el-input v-model="state.ruleForm.quantity" placeholder="请输入成交数量" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="成交金额">
              <el-input v-model="state.ruleForm.amount" placeholder="请输入成交金额" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="手续费">
              <el-input v-model="state.ruleForm.fee" placeholder="请输入手续费" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="交易对方">
              <el-select v-model="state.ruleForm.payment_method" placeholder="请选择交易对方" clearable>
                <el-option value="东方财富证券(5700)">东方财富证券(5700)</el-option>
                <el-option value="招商银行储蓄卡(7752)">招商银行储蓄卡(7752)</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="state.dialog.loading">{{ state.dialog.submitTxt }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="transactionDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import { useTransactionApi } from '/@/api/transaction';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const userDialogFormRef = ref();
const { proxy } = getCurrentInstance() as any;

const state = reactive({
  dialog: {
    isShowDialog: false,
    loading: false,
    title: '',
    submitTxt: '',
  },
  ruleForm: {
    transaction_id: 0,
    timestamp: '',
    stock_code: '',
    type: '',
    price: 0.00,
    quantity: 0.00,
    amount: 0.00,
    fee: 0.00,
    payment_method: '东方财富证券(5700)'
  },
});

// 打开弹窗
const openDialog = (type: string, row?: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改证券交易记录';
    state.dialog.submitTxt = '修 改';
    // 复制row数据到ruleForm
    Object.keys(state.ruleForm).forEach(key => {
      if (row[key] !== undefined) {
        state.ruleForm[key] = row[key];
      }
    });
  } else {
    state.dialog.title = '新增证券交易记录';
    state.dialog.submitTxt = '新 增';
    // 重置表单
    resetForm();
  }
  state.dialog.isShowDialog = true;
};

// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
};

// 取消
const onCancel = () => {
  closeDialog();
};

// 重置表单
const resetForm = () => {
  state.ruleForm = {
    transaction_id: 0,
    timestamp: '',
    stock_code: '',
    type: '',
    price: 0,
    quantity: 0,
    amount: 0,
    fee: 0,
    payment_method: ''
  };
};

// 提交
const onSubmit = () => {
  userDialogFormRef.value.validate((valid: boolean) => {
    if (!valid) return;
    
    state.dialog.loading = true;
    
    // 确保数值字段是数字类型
    const formData = {
      ...state.ruleForm,
      price: parseFloat(state.ruleForm.price as any) || 0,
      quantity: parseFloat(state.ruleForm.quantity as any) || 0,
      amount: parseFloat(state.ruleForm.amount as any) || 0,
      fee: parseFloat(state.ruleForm.fee as any) || 0
    };
    
    const { createTransaction, updateTransaction } = useTransactionApi();
    
    if (state.dialog.title === '修改证券交易记录') {
      // 修改证券交易记录
      updateTransaction(formData.transaction_id, formData)
        .then(() => {
          ElMessage.success('修改成功');
          closeDialog();
          emit('refresh');
        })
        .catch((err: any) => {
          console.error('Error updating transaction: ', err);
          ElMessage.error('修改失败');
        })
        .finally(() => {
          state.dialog.loading = false;
        });
    } else {
      // 新增证券交易记录
      createTransaction([formData])
        .then(() => {
          ElMessage.success('新增成功');
          closeDialog();
          emit('refresh');
        })
        .catch((err: any) => {
          console.error('Error creating transaction: ', err);
          ElMessage.error('新增失败');
        })
        .finally(() => {
          state.dialog.loading = false;
        });
    }
  });
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>

<style scoped lang="scss">
.system-user-dialog-container {
  .w100 {
    width: 100%;
  }
  
  :deep(.el-select) {
    width: 100%;
  }
}
</style>