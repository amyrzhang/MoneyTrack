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
              <el-input v-model="state.ruleForm.counterparty" placeholder="请输入交易对方" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="商品">
              <el-input v-model="state.ruleForm.goods" placeholder="请输入商品名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="金额">
              <el-input v-model="state.ruleForm.amount" placeholder="请输入账单金额" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="支付方式">
              <el-input v-model="state.ruleForm.payment_method" placeholder="请输入支付方式" clearable></el-input>
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
import { useBillApi } from '/@/api/menu';

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
    payment_method: '',
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
const openDialog = (type: string, row: RowBillType) => {
  if (type === 'edit') {
    // 将RowUserType转换为state.ruleForm的类型
    const adaptedRow = {
      time: row.time as string,
      source: row.source || '',
      expenditure_income: row.debit_credit || '',
      category: row.type || '',
      counterparty: row.counterparty || '',
      goods: row.goods || '',
      amount: row.amount || '',
      payment_method: row.payment_method || '',
      reversed: row.reversed,
    };
    state.ruleForm = adaptedRow;
    state.dialog.title = '修改记录';
    state.dialog.submitTxt = '修 改';
  } else {
    state.dialog.title = '新增记录';
    state.dialog.submitTxt = '新 增';
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
      const data = state.ruleForm;

    // 判断是新增还是编辑
    if (state.dialog.type === 'edit') {
      // 调用 PUT 接口，更新记录
      useBillApi().updateBillRecord(data).then(res => {
        ElMessage.success('修改成功');
        closeDialog();
        emit('refresh');
      }).catch(err => {
        ElMessage.error('修改失败');
        console.error('修改失败:', err);
      });
    } else {
      // 调用 POST 接口，新增记录
      useBillApi().createBillRecord(data).then(res => {
        ElMessage.success('新增成功');
        closeDialog();
        emit('refresh');
      }).catch(err => {
        ElMessage.error('新增失败');
        console.error('新增失败:', err);
        });
    }
  });
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
