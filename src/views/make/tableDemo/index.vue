<template>
	<div class="table-demo-container layout-padding">
		<div class="table-demo-padding layout-padding-view layout-padding-auto">
			<TableSearch
          :search="state.tableData.search"
          @search="onSearch"
          :options="state.tableData.search[0].options"
          v-model:month="state.tableData.param.month"
      />
			<Table
				ref="tableRef"
				v-bind="state.tableData"
				class="table-demo"
				@delRow="onTableDelRow"
				@pageChange="onTablePageChange"
				@sortHeader="onSortHeader"
			/>
		</div>
	</div>
</template>

<script setup lang="ts" name="makeTableDemo">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useTableApi } from "/@/api/table";
import { verifyNumberRMB } from "/@/utils/toolsValidate"

// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/views/make/tableDemo/search.vue'));

// 定义变量内容
const tableRef = ref<RefType>();
const state = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		// 表头内容（必传，注意格式）
		header: [
      { key: 'time', colWidth: '180px', title: '交易时间', type: 'text', isCheck: true },
      { key: 'source', colWidth: '', title: '来源', type: 'text', isCheck: true },
      { key: 'expenditure_income', colWidth: '', title: '收/支', type: 'text', isCheck: true },
      { key: 'status', colWidth: '', title: '支付状态', type: 'text', isCheck: true },
      { key: 'type', colWidth: '', title: '类型', type: 'text', isCheck: true },
      { key: 'category', colWidth: '', title: '类别', type: 'text', isCheck: true },
      { key: 'counterparty', colWidth: '', title: '交易对方', type: 'text', isCheck: true },
      { key: 'goods', colWidth: '200px', title: '商品', type: 'text', isCheck: true },
      { key: 'reversed', colWidth: '', title: '是否冲账', type: 'text', isCheck: true },
      { key: 'amount', colWidth: '150px', title: '金额', type: 'text', isCheck: true },
      { key: 'pay_method', colWidth: '100px', title: '支付方式', type: 'text', isCheck: true },
    ],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: true, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: true, // 是否显示表格序号
			isSelection: true, // 是否显示表格多选
			isOperate: true, // 是否显示表格操作栏
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{
        label: '选择月份',
        prop: 'time',
        placeholder: '请选择月份',
        required: false,
        type: 'select',
        options: [
            { label: '2024-09', value: '2024-09' },
            { label: '2024-08', value: '2024-08' },
            { label: '2024-07', value: '2024-07' },
            { label: '2023-06', value: '2024-06' },
            { label: '2023-05', value: '2024-05' },
        ]
      },
      {
        label: '收/支',
        prop: 'expenditure_income',
        placeholder: '请选择',
        required: false,
        type: 'select',
        options: [
          { label: '收入', value: '收入' },
          { label: '支出', value: '支出' },
        ],
      },
      {
        label: '支付方式',
        prop: 'pay_method',
        placeholder: '请选择',
        required: false,
        type: 'select',
        options: [
          { label: '民生银行储蓄卡(4827)', value: '民生银行储蓄卡' },
          { label: '零钱', value: '零钱' },
          { label: '支付宝', value: '支付宝' },
        ],
      },
			{ label: '日期', prop: 'time', placeholder: '请选择', required: false, type: 'date' },
		],
		// 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
		param: {
			pageNum: 1,
			pageSize: 10,
		},
		// 打印标题
		printName: 'vueNextAdmin 表格打印演示',
	},
});

// 初始化列表数据
const getTableData = (params?: EmptyObjectType) => {
  const { getAdminTable } = useTableApi(); // 获取 API 数据
  state.tableData.config.loading = true;
  state.tableData.data = [];

  function removeEmptyProperties(obj) {
    for (const key in obj) {
      if (obj[key] === '') {
        delete obj[key];
      }
    }
    return obj;
  }
  let newParams = removeEmptyProperties(params)
  getAdminTable(newParams)
      .then((res) => {
        // 对 res 中的每个元素进行格式化处理

        const formattedData = res.map(item => ({
          ...item,
          amount: verifyNumberRMB(item.amount)
        }));
        state.tableData.data = formattedData;
        state.tableData.config.total = formattedData.length;
      })
      .catch((err) => {
        console.error('Error fetching data: ', err);
      })
      .finally(() => {
        setTimeout(() => {
          state.tableData.config.loading = false;
        }, 500);
      });
};

// 搜索点击时表单回调
const onSearch = (a) => {
	getTableData(a)
  tableRef.value.pageReset();
};
// 删除当前项回调
const onTableDelRow = (row: EmptyObjectType) => {
	ElMessage.success(`删除${row.name}成功！`);
	getTableData();
};
// 分页改变时回调
const onTablePageChange = (page: TableDemoPageType) => {
	state.tableData.param.pageNum = page.pageNum;
	state.tableData.param.pageSize = page.pageSize;
	// getTableData();
};
// 拖动显示列排序回调
const onSortHeader = (data: TableHeaderType[]) => {
	state.tableData.header = data;
};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.table-demo-container {
	.table-demo-padding {
		padding: 15px;
		.table-demo {
			flex: 1;
			overflow: hidden;
		}
	}
}
</style>
