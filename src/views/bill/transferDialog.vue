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
              <el-input
                  v-model="formData.payment_method"
                  placeholder="请输入支付方式"
                  clearable
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="交易对方" prop="counterparty">
              <el-input
                  v-model="formData.counterparty"
                  placeholder="请输入交易对方"
                  clearable
                  style="width: 100%"
              />
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
import { useTableApi } from '/@/api/table';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const formRef = ref();
const { proxy } = getCurrentInstance() as any;

const title = ref('新增自转账');
const isShowDialog = ref(false);

const formData = reactive({
  time: '',
  payment_method: '',
  counterparty: '',
  amount: ''
});

// 表单校验规则
const rules = reactive({
  time: [{required: true, message: '请选择时间', trigger: 'change'}],
  payment_method: [{required: true, message: '请输入支付方式', trigger: 'blur'}],
  counterparty: [{required: true, message: '请输入交易对方', trigger: 'blur'}],
  amount: [{required: true, message: '请输入金额', trigger: 'blur'}]
});

// 打开弹窗
const openDialog = () => {
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

    const { transfer } = useTableApi();
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