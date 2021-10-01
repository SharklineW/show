<template>
  <div> 
    <!-- 面包屑导航 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
    <el-card>
    <!-- 提示区域 -->
     <el-alert show-icon
    title="提示：只允许为第三级分类添加相关参数" :closable="false"
    type="warning">
    </el-alert> 

    <!-- 选择商品分类区域 -->
    <el-row class="cat_opt">
      <el-col>
        <span>选择商品分类：</span>
        <!-- 级联选择框 -->
        <el-cascader
        v-model="selectedCateKeys"
        :options="cateList"
        :props="cateProps"
        @change="handleChange"></el-cascader>
      </el-col>
    </el-row>
    <!-- 页签区域 -->
    <el-tabs v-model="activeName" @tab-click="handleTagClick">
<!-- 添加动态参数的面板 -->
    <el-tab-pane label="动态参数" name="many">
      <!-- 添加参数按钮 -->
      <el-button type="primary" size="mini" :disabled="isBtnDialog" @click="addDialogVisible=true">添加参数</el-button>
      <!-- 动态参数表格 -->
      <el-table :data="manyTableData" border>
        <!-- 展开行 --> 
         <el-table-column type='expand'>
           <!-- 循环导入数据标签 -->
           <template v-slot="scope">
           <el-tag v-for="(item,i) in scope.row.attr_vals" closable
           :key="i" @close="handleClose(i,scope.row)">{{item}}</el-tag>
             <!-- 输入新建标签 -->
           <el-input
          class="input-new-tag"
          v-if="scope.row.inputVisible"
          v-model="scope.row.inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm(scope.row)"
          @blur="handleInputConfirm(scope.row)"
          ></el-input>
          <!-- 添加按钮 -->
          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
           </template>
         </el-table-column>
         <!-- 索引页 -->
        <el-table-column type='index'></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
  <template v-slot="scope">
	<el-button type="primary" size="mini" class="el-icon-edit" @click="showEditDialog(scope.row.attr_id)" 
	>编辑</el-button>
	<el-button type="danger" size="mini" class="el-icon-delate" @click="removeParams(scope.row.attr_id)"
	>删除</el-button>
</template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    
<!-- 添加静态属性的面板 -->
    <el-tab-pane label="静态属性" name="only">
      <!-- 添加属性按钮 -->
    <el-button type="primary" size="mini" :disabled="isBtnDialog" @click="addDialogVisible=true">添加属性</el-button>
    <!-- 静态属性表格 -->
      <el-table :data="onlyTableData" border>
        <!-- 展开行 -->

          <el-table-column type='expand'>
           <!-- 循环导入数据标签 -->
           <template v-slot="scope">
           <el-tag v-for="(item,i) in scope.row.attr_vals" closable
           :key="i" @close="handleClose(i,scope.row)">{{item}}</el-tag>
             <!-- 输入新建标签 -->
           <el-input
          class="input-new-tag"
          v-if="scope.row.inputVisible"
          v-model="scope.row.inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm(scope.row)"
          @blur="handleInputConfirm(scope.row)"
          ></el-input>
          <!-- 添加按钮 -->
          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
           </template>
         </el-table-column>

         <!-- 索引页 -->
        <el-table-column type='index'></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
  <template v-slot="scope">
	<el-button type="primary" size="mini" class="el-icon-edit" @click="showEditDialog(scope.row.attr_id)" 
	 >编辑</el-button>
	<el-button type="danger" size="mini" class="el-icon-delate" @click="removeParams(scope.row.attr_id)"
>删除</el-button>
</template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    
  </el-tabs>
  </el-card>


  <!--添加参数的对话框-->
<el-dialog
  :title="'添加'+ titleText"
  :visible.sync="addDialogVisible"
  width="50%" @close="addDialogClose"
  >
  <!--添加参数的对话框-->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>

<!--修改参数的对话框-->
<el-dialog
  :title="'修改'+ titleText"
  :visible.sync="editDialogVisible"
  width="50%" @close="editDialogClose"
  >
  <!--添加参数的对话框-->
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>


















    </div>
</template>

<script>
export default {
    data() {
      return{
        cateList:[],
        cateProps:{ 

        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: 'hover'
        },
        // 级联选择双向绑定的数据
        selectedCateKeys:[],
        
        activeName:'many',
        // 动态参数列表
        manyTableData:[],
        //静态参数列表
        onlyTableData:[],
        // 控制对话框的显示与隐藏
        addDialogVisible:false,
        // 添加参数的表单数据对象
        addForm:{
          attr_name:'',

        },
        addFormRules:{
          attr_name:[
            {required: true, message:'请输入参数名称',trigger:'blur' }
          ]
        },
        // 编辑对话框的显示与隐藏
        editDialogVisible: false,
        // 编辑对话框的表单数据
        editForm:{
          attr_name:'',
          attr_sel:''
        } ,
        // 修改表单的验证规则
        editFormRules:{
          attr_name:[
            {required: true, message:'请输入参数名称',trigger:'blur' }
          ]
        },
        
        // 控制按钮与输入框的显示
        // inputVisible: false,
        // 文本框中输入的内容
        // inputValue:'',


      }
    },
    created() {
      this.getCateList()
    },
    methods:{
      // 请求上商品分类数据
      async getCateList() {
        const {data:res} = await this.$http.get(`categories`)

      if(res.meta.status !== 200) {
        return this.$message.error('请求商品分类数据失败')
      }
      this.cateList = res.data
      },
      
      // 级联选择框选中触发函数
      handleChange(){
        this.getParamsData()
      },
      // 获取参数的列表数据
      async getParamsData() {
        // 证明不是三级分类
        if(this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          this.manyTableData = []
          this.onlyTableData = []
          return
        }
        // 证明是三级分类
        // 根据所选分类的id，和当前所处的面板，获取对应的参数
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})

        if(res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败')
        }
        // 获取tag的数据分割为数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') :[]
          // 动态添加
          this.$set(item, "inputVisible", false)
          this.$set(item, "inputValue", "")
        })
        if(this.activeName === 'many'){
          this.manyTableData = res.data
        }else{
          this.onlyTableData = res.data
        }


      },
      // 标签页点击触发函数
      handleTagClick(){
      this.getParamsData()
      },
      addDialogClose() {
        this.$refs.addFormRef.resetFields()
        
      },
      // 点击按钮，添加参数
      addParams(){
        this.$refs.addFormRef.validate(async valid => {
          if(!valid)return
          const {data:res } = await this.$http.post(`categories/${this.cateId}/attributes`,{
            attr_name:this.addForm.attr_name,
            attr_sel:this.activeName
          })
          if(res.meta.status !== 201){
            return this.$message.error('添加参数失败')
          }
          this.$message.success('添加参数成功')
          this.addDialogVisible = false
          this.getParamsData()
        })
      },

      // 点击按钮展示修改的对话框
      async showEditDialog(id){
        // 查询当前参数的信息 
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{ params: {attr_sel: this.activeName}
        })
      
        if(res.meta.status !== 200) {
          return this.$message.error('获取参数信息失败')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      // this.editDialogVisible = true
      // this.editForm.attr_name = row.attr_name
      // this.editForm.attr_id = row.attr_id


      }, 
      // 监听对话框的关闭
      editDialogClose(){
        this.$refs.editFormRef.resetFields()
        
      },
      // 点击按钮提交修改参数操作
      editParams(){
        this.$refs.editFormRef.validate(async valid => {
          const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_name: this.editForm.attr_name,attr_sel:this.activeName})
          
          if(res.meta.status !== 200){
            return this.$message.error('修改参数失败')
          }
          this.$message.success('修改参数成功')
          this.getParamsData()
          this.editDialogVisible = false
        })
      },
removeParams(attr_id) {
  this.$confirm('此操作将永久删除该分类信息, 是否继续?', '删除分类', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getParamsData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
},
// 向属性/参数里面添加一个新标签
async handleInputConfirm(row) {
  // 判断修剪后的输入框里面还有没有数据
  if(row.inputValue.trim().length === 0){
    row.inputValue = ''
    row.inputVisible = false
    return
  }
  // 有则进入下一步操作
  row.attr_vals.push(row.inputValue.trim())
  row.inputValue=''
  row.inputVisible = false
//  再进行网络请求
this.saveAttrVals(row)
  
},
// 对attr_vals的操作，保存到数据库中
async saveAttrVals(row){
 // 再发送网络请求
  const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
    attr_name: row.attr_name,
    attr_sel: this.activeName,
    // 服务器接受字符形式需要将数组转化为字符
    attr_vals: row.attr_vals.join(',')
  })
  console.log(res)
  if(res.meta.status !== 200) {
    return this.$message.error('修改新标签失败！')
  }
  this.$message.success('修改新标签成功！')
  row.inputValue = ''
  row.inputVisible = false
},
// 删除对应的标签
handleClose(i,row){
  row.attr_vals.splice(i,1)
  this.saveAttrVals(row)
},
// 点击按钮切换显示输入框
showInput(row) {
  row.inputVisible = true
  // 让文本框自动获得焦点
  //$nextTick方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
   this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
}



      },
      computed:{
        // 如果按钮需要被禁用，则返回true，否则返回false
        isBtnDialog(){
          if(this.selectedCateKeys.length !== 3) {return true}
        return false
        },
        // 当前选中三级分类的Id
        cateId(){
          if(this.selectedCateKeys.length === 3 ) {
            console.log(this.selectedCateKeys[2])
            return this.selectedCateKeys[2]

          }return null
        },
        titleText(){
          if(this.activeName === 'many') {
            return '动态参数'
          }
          return '静态参数'
        }

      }
      
}
</script>

<style lang="less" scoped>
.cat_opt{
  margin:15px 0
}
.input-new-tag{
  width: 120px;
}
</style>
