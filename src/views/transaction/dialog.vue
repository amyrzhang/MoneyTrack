<template>
  <div class="system-user-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="交易日期">
              <el-date-picker
                v-model="state.ruleForm.tradeDate"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择交易日期"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="证券代码">
              <el-input v-model="state.ruleForm.securityCode" placeholder="请输入证券代码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="证券名称">
              <el-input v-model="state.ruleForm.securityName" placeholder="请输入证券名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="证券类型">
              <el-select v-model="state.ruleForm.securityType" placeholder="请选择证券类型" clearable class="w100">
                <el-option label="股票" value="stock"></el-option>
                <el-option label="基金" value="fund"></el-option>
                <el-option label="债券" value="bond"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="交易类型">
              <el-select v-model="state.ruleForm.tradeType" placeholder="请选择交易类型" clearable class="w100">
                <el-option label="买入" value="buy"></el-option>
                <el-option label="卖出" value="sell"></el-option>
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
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="备注">
              <el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入备注" maxlength="150"></el-input>
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
    id: '',
    tradeDate: '',
    securityCode: '',
    securityName: '',
    securityType: '',
    tradeType: '',
    price: '',
    quantity: '',
    amount: '',
    fee: '',
    remark: '',
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
  Object.keys(state.ruleForm).forEach(key => {
    state.ruleForm[key] = '';
  });
};

// 提交
const onSubmit = () => {
  userDialogFormRef.value.validate((valid: boolean) => {
    if (!valid) return;
    
    state.dialog.loading = true;
    
    const { createTransaction, updateTransaction } = useTransactionApi();
    
    if (state.dialog.title === '修改证券交易记录') {
      // 修改证券交易记录
      updateTransaction(state.ruleForm.id, state.ruleForm)
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
      createTransaction(state.ruleForm)
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