<template>
    <div>
        <!-- 面包屑导航 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"  >
          <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
       </el-col>
</el-row>
<!-- 订单列表数据 -->
<el-table border stripe :data="orderList">
	<el-table-column type="index"></el-table-column>
	<el-table-column label="订单编号" prop="order_number"></el-table-column>
	<el-table-column label="订单价格" prop="order_price"></el-table-column>
	<el-table-column label="是否付款" prop="pay_status">
		<template slot-scope="scope">
			<el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
			<el-tag type="danger" v-else>未付款</el-tag>
		</template>
	</el-table-column>
	<el-table-column label="是否发货" prop="is_send"></el-table-column>
	<el-table-column label="下单时间" prop="create_time">
		<template slot-scope="scope">
			{{scope.row.create_time | dateFormat}}
		</template>
	</el-table-column>
	<el-table-column label="操作">
		<template slot-scope="scope">
			<el-button type="primary" size="mini" class="el-icon-edit" @click="showEditDialog"></el-button>
	<el-button type="success" size="mini" class="el-icon-location" @click="showProgressDialog"
></el-button>
		</template>
	</el-table-column>


</el-table>
<!-- 页区域 -->
 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pagenum"
      :page-sizes="[7,10,15]"
			:page-size="queryInfo.pagesize"
      layout="total,sizes, prev, pager, next,jumper"
      :total="total">
	</el-pagination>
</el-card>

<!-- 修改功能对话框 -->
<el-dialog
  title="修改地址"
  :visible.sync="editDialogVisible"
  width="50%"
	@close="editDialogClose"
  >
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
  <el-form-item label="省市区/县" prop="edit1">
    <el-cascader :options="citydata" v-model="editForm.edit1"></el-cascader>
  </el-form-item>
	<el-form-item label="详细地址" prop="edit2">
    <el-input v-model="editForm.edit2"></el-input>
  </el-form-item>
	</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

<!-- 查看进度对话框 -->
<el-dialog
  title="查看物流"
  :visible.sync="progressDialogVisible"
  width="50%">
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>




    </div>

</template>

<script>
import citydata from './citydata.js'
export default {
    // name:'Order',
    data(){
    return {
      queryInfo:{
        query:'',
				pagenum: 1,
				pagesize: 10 
      },
			total:0,
			orderList:[],	
			// 控制修改地址的对话框显示与隐藏
			editDialogVisible:false,
			editForm:{
				edit1: [],
				edit2: '',
			},
			// 物流信息
			progressInfo:[],
			editFormRules:{
				edit1:[
					{required:true,message:'请选择省市区/县',trigger:'blur'}
				],
				edit2:[
					{required:true,message:'请填写详细地址',trigger:'blur'}
				]
			},
			citydata,
			// 物流对话框的显示与隐藏
			progressDialogVisible:false,
      }
    },
    created(){
			this.getOrderList()
    },
    methods:{
			async getOrderList() {
				const {data : res} = 
				await this.$http.get(`orders`,{
					params:this.queryInfo
				})
				console.log(res)
				if(res.meta.status !== 200) {
					return this.$message.error('获取订单数据失败！')
				}
				this.total = res.data.total
				this.orderList = res.data.goods 
			},
			// 监听页数
			handleSizeChange(newSize){ 
				this.queryInfo.pagesize = newSize;
        this.getOrderList();
			},
			// 监听页码
			handleCurrentChange(newPage){ 
				this.queryInfo.pagenum = newPage;
        this.getOrderList();
			},
			// 修改地址的对话框事件
			showEditDialog(){
				this.editDialogVisible = true
			},
			// 监听对话框关闭
			editDialogClose(){ 
				this.$refs.editFormRef.resetFields()
			},
			// 查看物流对话框事件处理函数
				showProgressDialog() {
				// const {data: res} =
				// await this.$http.get(`/kuaidi/1106975712662`)

				// if(res.meta.status !== 200 ){
				// 	return this.$message.error="获取物流信息失败"
				// }

				// this.progressInfo = res.data
		
		this.progressInfo = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
      console.log(this.progressInfo)
				this.progressDialogVisible = true
			}
    },
    computed:{

    }
}
</script>

<style lang="less" scoped>

</style>
