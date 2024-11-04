<template>
  <div class="system-user-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="交易时间">
              <el-date-picker v-model="state.ruleForm.time" type="date" placeholder="请选择" class="w100"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="类别">
              <el-input v-model="state.ruleForm.category" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="来源">
              <el-input v-model="state.ruleForm.source" placeholder="请输入账户名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="收/支">
              <el-select v-model="state.ruleForm.expenditure_income" placeholder="请选择" clearable class="w100">
                <el-option label="收入" value="收入"></el-option>
                <el-option label="支出" value="支出"></el-option>
                <el-option label="不计收支" value="不计收支"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="交易对方">
              <el-input v-model="state.ruleForm.counterparty" placeholder="请输入用户昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="商品">
              <el-input v-model="state.ruleForm.goods" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="金额">
              <el-input v-model="state.ruleForm.amount" placeholder="请输入用户昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="支付方式">
              <el-input v-model="state.ruleForm.pay_method" placeholder="请输入用户昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="是否冲账">
              <el-switch v-model="state.ruleForm.reversed" inline-prompt active-text="启" inactive-text="禁"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useMenuApi } from '/@/api/menu';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const userDialogFormRef = ref();
const state = reactive({
  ruleForm: {
    time: '',
    source: '',
    expenditure_income: '',
    category: '',
    counterparty: '',
    goods: '',
    amount: '',
    pay_method: '',
    reversed: false,
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});

// 打开弹窗
const openDialog = (type: string, row: RowUserType) => {
  if (type === 'edit') {
    state.ruleForm = row;
    state.dialog.title = '修改记录';
    state.dialog.submitTxt = '修 改';
  } else {
    state.dialog.title = '新增记录';
    state.dialog.submitTxt = '新 增';
    // 清空表单，此项需加表单验证才能使用
    nextTick(() => {
      userDialogFormRef.value.resetFields();
    });
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
// 提交
const onSubmit = () => {
  userDialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const data = state.ruleForm;
      console.log('提交的数据:', data);
      useMenuApi().updateRecord(data).then(res => {
        ElMessage.success('提交成功');
        closeDialog();
        emit('refresh');
      }).catch(err => {
        ElMessage.error('提交失败');
        console.error('提交失败:', err);
      });
    } else {
      ElMessage.warning('表单验证未通过');
      return false;
    }
  });
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
