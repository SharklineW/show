<template>
<div>
<!-- 面包屑导航 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
<el-card>
  <!-- 搜索与添加区域 -->
  <el-row :gutter="20">
    <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
    </el-col>
    <!-- 添加用户按钮 -->
    <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
    </el-col>
    <!-- 用户列表卡片 -->
  </el-row>
  <el-table :data="userList" border stripe>
      <el-table-column type="index" ></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
          <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
      </el-table-column>
      <el-table-column label="操作">
          <template v-slot="scope">
          <!-- 修改按钮 -->
        <el-tooltip effect="dark" content="编辑角色" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEideDialog(scope.row.id)"></el-button>
        </el-tooltip>
          <!-- 删除按钮 -->
        <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)	"></el-button>
        </el-tooltip>
          <!-- 分配角色按钮 -->
        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
        </el-tooltip>
          </template>
      </el-table-column>
 </el-table>
        <!-- 分页 -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="queryInfo.pagenum"
    :page-sizes="[1, 2, 5, 10]"
    :page-size="queryInfo.pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</el-card>
<!-- 添加用户的对话框 -->
<el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%" @close="addDialogClose">
  <!-- 内容主体区域 -->
  <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" 
  label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item  label="密码" prop="password" >
    <el-input type="password" v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑用户的对话框 -->
<el-dialog
  title="编辑用户"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClose">
  <!-- 主体内容区域 -->
  <el-form :model="editForm" :rules="addFormrules" ref="editFormRef" label-width="70px">
  <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
   <el-form-item label="邮箱"  prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机"  prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配角色的对话框 -->
<el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%" @close="rolesDialogClose" 
  >
  <p>当前用户名: {{userInfo.username}}</p>
  <p>当前角色名: {{userInfo.role_name}}</p>
  <p>分配新角色:
  
  <el-select v-model="selectedRoleId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </p>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="rolesUserInfo">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
    data() {
        // 校验手机号码
      var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
        return {
            //获取用户列表的参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2
            },
         userList:[],
         total:0,
         checkPhone:'',
         // 控制添加用户的对话框的显示与隐藏
         addDialogVisible:false ,
         // 控制修改用户的对话款的显示与隐藏
         editDialogVisible:false,
         // 添加用户的表单数据
         addForm:{
             username:'',
             password:'',
             email:'',
             mobile:'',
             
         },
         //添加表单的验证规则对象
         addFormrules:{
            username: [
                 {required:true,message:'请输入用户名',trigger:'blur'},
                 {min:3,max:10,message:'用户名的长度在3个到10个字符之间',trigger:'blur'}
             
             ],
            password:[
                 {required:true,message:'请输入密码',trigger:'blur'},
                 {min:6,max:15,message:'用户名的长度在6个到15个字符之间',trigger:'blur'}
             ],
            email:[
                 {required:true,message:'请输入邮箱',trigger:'blur'},
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
             ],
            mobile:[
                // { required: true, trigger: ['blur'], validator: checkPhone }
                { required: true, message:'请输入手机号码',trigger: 'blur'},
                {validator: checkPhone,trigger:'blur' }
            ],
            
             },
            //  查询用户表单信息
        editForm:{},
        // 表单验证规则可以直接使用上面的
        // editFormRules:{
        //     email:[ {required:true,message:'请输入邮箱',trigger:'blur'},
        //         { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
        //         ],
        //         mobile:[
        //         { required: true, message:'请输入手机号码',trigger: 'blur'},
        //         {validator: checkPhone,trigger:'blur' }
        //     ],
        //     },
        //控制分配角色对话框的按钮
        setRoleDialogVisible : false,
        // 需要被分配角色的用户信息
        userInfo:{},
        // 所有角色的数据列表
        rolesList :[],
        selectedRoleId:'',




        }  
    },
    created() {
        this.getUserList()
    },
    methods: {
        //获取用户列表数据
        async getUserList() {
            const {data:res} = await this.$http.get('users',{
                params:this.queryInfo
            })
            if(res.meta.status !== 200) {
                return this.$message.error('获取用户列表失败')
            }
            this.userList = res.data.users
            this.total = res.data.total
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        //监听页码值 改变的事件
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getUserList() 
        },
        // 监听 switch 开关状态的改变
        async userStateChanged(userinfo) {
            // console.log(userinfo)
            const { data:res } =
             await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        },
        //监听添加用户框的关闭
        addDialogClose() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加用户的网络请求
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                //可以发送添加用户的网络请求
               const { data:res } = await this.$http.post(`users`,this.addForm)

                if(res.meta.status !== 201) {
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                // 隐藏添加用户弹窗
                this.addDialogVisible=false ,
                //重新获取用户列表数据
                this.getUserList()
                
            })
        },
        // 展示编辑用户的对话框
        async showEideDialog(id) {
            const {data:res} = 
            await this.$http.get('users/' + id)
            if(res.meta.status !== 200) {
                return this.$message.error('查询用户信息失败!')
            }
           
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 监听编辑用户框的关闭
      editDialogClose(){
          this.$refs.editFormRef.resetFields()
        },
          // 点击按钮确定的网络请求
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if(!valid) return
          //可以发送修改用户的网络请求
          console.log(this.editForm.id)
          const { data:res } = await this.$http.put(`users/` + this.editForm.id
					,{ 
          email:this.editForm.email,
          mobile:this.editForm.mobile
          })
          if(res.meta.status !== 201) {
          this.$message.error('修改用户失败')
          }
          this.$message.success('修改用户成功')
          // 隐藏修改用户弹窗
          this.editDialogVisible=false,
          //重新获取用户列表数据
          this.getUserList()     
          })
        },
			
				// 根据id删除对应的用户信息
			async removeUserById(id) {
        // 弹窗询问用户是否删除数据
				const confirmResult = 
				await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
				//如果用户确认删除,则返回值为字符串confirm
				//如果用户取消删除,则返回值为字符串cancel
				if(confirmResult !== 'confirm') {
					return this.$message.info('已删除')
				}
				const {data:res} = await this.$http.delete(`users/` + id)
				if(res.meta.status !== 200){
					return this.$message.error('用户删除失败')
				}
				this.$message.success('用户删除成功')
				this.getUserList()
			},
      // 展示分配的对话框
      async setRole(userInfo) {
        this.userInfo = userInfo
      // 在展示对话框前,获取所有角色数据
      const {data :res } = await this.$http.get(`roles`)
      if(res.meta.status !== 200) {
        return this.$message.error('获取用户列表数据失败')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
      },
      // 监听分配角色对话框的关闭
      rolesDialogClose(){
        this.selectedRoleId = ''
        this.userInfo = {}
      },
      // 点击按钮分配角色的网络请求
      async rolesUserInfo(){
        if(!this.selectedRoleId) 
        return this.$message.error('请选择要分配的角色!')

        const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
          rid:this.selectedRoleId
        })
        if(res.meta.status !== 200) {
          return this.$message.error('分配角色失败')
        }
        this.$message.success('分配角色成功')
        this.getUserList()
        this.setRoleDialogVisible = false
      }
			



	},
}       

</script>

<style lang="less" scoped>

</style>
