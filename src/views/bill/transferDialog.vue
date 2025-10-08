<template>
  <div class="transfer-dialog">
    <el-dialog
        :title="title"
        v-model="isShowDialog"
        width="769px"
        @close="onCancel"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" size="default" label-width="100px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="时间" prop="time">
              <el-date-picker
                  v-model="formData.time"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择时间"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="支付方式" prop="payment_method">
              <el-select
                  v-model="formData.payment_method"
                  placeholder="请选择支付方式"
                  clearable
                  filterable
                  style="width: 100%">
                <el-option
                  v-for="item in paymentMethodOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="交易对方" prop="counterparty">
              <el-select
                  v-model="formData.counterparty"
                  placeholder="请选择交易对方"
                  clearable
                  filterable
                  style="width: 100%">
                <el-option
                  v-for="item in counterpartyOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="金额" prop="amount">
              <el-input
                  v-model="formData.amount"
                  placeholder="请输入金额"
                  clearable
                  style="width: 100%"
                  type="number"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default">新 增</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="transferDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import { useCashflowApi } from '/src/api/cashflow';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const formRef = ref();
const { proxy } = getCurrentInstance() as any;

const title = ref('新增自转账');
const isShowDialog = ref(false);

// 常见支付方式选项
const paymentMethodOptions = [
  '交通银行储蓄卡(9585)',
  '民生银行储蓄卡(4827)',
  '沧州银行储蓄卡(3043)',
  '北京银行储蓄卡(3574)',
  '华夏银行储蓄卡(8041)',
  '招商银行储蓄卡(7752)',
  '东方财富证券(5700)',
  '零钱',
  '余额宝'
];

// 常见交易对方选项
const counterpartyOptions = [
  '交通银行储蓄卡(9585)',
  '民生银行储蓄卡(4827)',
  '沧州银行储蓄卡(3043)',
  '北京银行储蓄卡(3574)',
  '华夏银行储蓄卡(8041)',
  '招商银行储蓄卡(7752)',
  '东方财富证券(5700)',
  '零钱',
  '余额宝'
];

const formData = reactive({
  time: '',
  payment_method: '',
  counterparty: '',
  amount: ''
});

// 表单校验规则
const rules = reactive({
  time: [{required: true, message: '请选择时间', trigger: 'change'}],
  payment_method: [{required: true, message: '请选择支付方式', trigger: 'change'}],
  counterparty: [{required: true, message: '请选择交易对方', trigger: 'change'}],
  amount: [{required: true, message: '请输入金额', trigger: 'blur'}]
});

// 打开弹窗
const openDialog = () => {
  // 重置表单
  formData.time = '';
  formData.payment_method = '';
  formData.counterparty = '';
  formData.amount = '';
  isShowDialog.value = true;
};

// 关闭弹窗
const closeDialog = () => {
  isShowDialog.value = false;
};

// 取消
const onCancel = () => {
  closeDialog();
};

// 新增
const onSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return;

    const { transfer } = useCashflowApi();
    console.log('New transfer created: ', formData);
    transfer(formData)
        .then(() => {
          console.log('New transfer created: ', formData.time);
          ElMessage.success('新增自转账成功');
          closeDialog();
          emit('refresh');
        })
        .catch((err) => {
          console.error('Error creating transfer: ', err);
          ElMessage.error('新增自转账失败');
        });
  });
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>