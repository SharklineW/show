<template>
    <div>
           <!-- 面包屑导航 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
<el-card>
    <!-- 提示区 -->
    <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon
    :closeable="false">
  </el-alert>
  <!-- 步骤条 -->
  <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>  
  <el-step title="商品内容"></el-step>
  <el-step title="确定"></el-step>
</el-steps>
<!-- tab栏区域 -->
<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top" >
  <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTagLeave" @tab-click="tabClicked">
    <el-tab-pane label="基本信息" name="0">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input v-model="addForm.goods_price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input v-model="addForm.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
        <el-input v-model="addForm.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="goods_cat">
         <el-cascader
        v-model="addForm.goods_cat"
        :options="cateList"
        :props="cateProps"
        @change="handleChange"></el-cascader>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
      <!-- 渲染表单的item项 -->
      <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id" >
<!-- 复选框组 -->
<el-checkbox-group v-model="item.attr_vals">
    <el-checkbox border :label="cd" v-for="(cd,i) in item.attr_vals" :key="i"></el-checkbox> 
    
  </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2" >
      <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
        <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>
    <!-- action填写上传图片的URL地址 --> 
    <!-- 点击图片触发:on-preview -->
    <!-- list-type决定图片的呈现效果 -->
    <el-tab-pane label="商品图片" name="3">
    <el-upload :action="uploadURL"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :headers="headerObj"
    :on-success="handleSuccess"
    list-type="picture">
    <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
      <!-- 富文本编辑器 -->
      <quill-editor v-model="addForm.goods_introduce" />
      <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
</el-form>
</el-card>
<!-- 图片预览效果对话框 -->
<el-dialog
  title="图片预览"
  :visible.sync="previewVisiable"
  width="50%">
  <img :src="previewPath" alt="">
</el-dialog>




    </div>
</template>

<script>
import _ from 'lodash'
export default {
  name:'Add',
    data(){
      return {
    activeIndex:0, 
    // 添加表单对象   
    addForm:{
      goods_name:'',
      goods_price:0,
      goods_number:0,
      goods_weight:0,
      // 商品所属的分类数组
      goods_cat: [],
      // 图片的数组
      pics:[],
      // 商品的详细描述
      goods_introduce:'',
      // 属性参数数值
      attrs:[],

    },
    // 表单验证规则
    addFormRules:{
      goods_name:[
        {required:true,message:'请输入商品名称',trigger:'blur'}
      ],
      goods_price:[
        {required:true,message:'请输入商品价格',trigger:'blur'}
      ],
      goods_number:[
        {required:true,message:'请输入商品数量',trigger:'blur'}
      ],
      goods_weight:[
        {required:true,message:'请输入商品重量',trigger:'blur'}
      ],
      goods_cat:[
        {required:true,message:'请选择商品分类',trigger:'blur'}
      ]
    },
    cateProps:{
      expandTrigger: 'hover',
      // 表示看到的是哪个属性
      label:'cat_name',
      // 代表选中的是哪个值
      value:'cat_id',
      // 代表哪个属性实现父子节点嵌套
      children:'children'
    
    },
    // 动态参数列表
    manyTableData:[],
    //静态属性列表
    onlyTableData:[],
// 上传图片的URL地址
    uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
    //上传图片的请求头headers
    headerObj:{
      Authorization:window.sessionStorage.getItem('token')
    },
    // 存放图片的地址
    previewPath:'',
    //预览对话框的显示与隐藏
    previewVisiable:false,
    cateList:[],    
    }
    },
    created(){
      this.getCateList()
    },
    methods:{
      // 获取所有商品的列表
      async getCateList(){
        const { data:res} = 
        await this.$http.get(`categories`)

        if(res.meta.status != 200) {
          return this.$message.error('获取商品列表失败')
        }
        this.cateList = res.data
      },
      // 级联选择器中选项变化,会触发这个函数
      handleChange(){ 
        if(this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },
      beforeTagLeave(activeName,oldActiveName) {
        if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3)
        {
          this.$message.error('请先选择商品分类!')
          return false
        }
      },
      async tabClicked(){
        // 确认是否进入商品名称
        if(this.activeIndex == 1){
          const {data:res} = 
          await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})

          if(res.meta.status !== 200){
            return this.$message.error('获取参数列表失败')
          }
          console.log(res)
          res.data.forEach(item => {
            item.attr_vals= item.attr_vals.length === 0 ? [] :item.attr_vals.split(',')
          })
          this.manyTableData = res.data
        }else if (this.activeIndex === '2') {
          const {data:res} = 
          await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})

          if(res.meta.status !== 200){
            return this.$message.error('获取参数列表失败')
          }
          this.onlyTableData = res.data
        }
      },
      // 处理图片的预览效果
      handlePreview(file){
        // console.log(file)
        this.previewPath = file.response.data.url
        this.previewVisiable = true
      },
      // 移除图片的操作
      handleRemove(file){
        // console.log(file)

        // 1获取将要删除的图片的临时路径
        const filePath = 
        file.response.data.tmp_path

        // 2从pics数组中，找到这个图片对应的索引值
        const i = 
        this.addForm.pics.findIndex(x => x.pic === filePath)
        // 3调用数组的splice方法把图片信息从pics数组中移除
        this.addForm.pics.splice(i,1)
        console.log(this.addForm)


      },
      // 监听图片上传成功的事件 response为第一个参数表示服务器返回的图片信息
      handleSuccess(response){
        const picInfo = {pic : response.data.tmp_path}
      // 将服务器返回 的图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo)
      },
      // 点击添加商品的操作函数
      addGoods(){ 
       this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加的业务逻辑
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // console.log(form)
        // 发起请求添加商品数据
        // 商品的名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败!')
        }
        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
        // 不能直接做转换因为在 级联选择器 中双向绑定了 goods_cat 作为key
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      })
      
    }

    },
    computed:{
      cateId() {
        if(this.addForm.goods_cat.length === 3){
          return this.addForm.goods_cat[2]
        }
        return null
      }
    }    
}
</script>

<style lang="less" scoped>
.btnAdd {
  margin: 15px 0 0 0
}
</style>
