<template>
    <div>
         <!-- 面包屑导航 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
<el-card>
    <!-- 添加角色按钮 -->
    <el-row>
        <el-col>
            <el-button type="primary"  @click="addJDialogVisible = true">添加角色</el-button>
        </el-col>
    </el-row>
    <!-- 添加角色列表 -->
<el-table :data="rolesList" border stripe>
	<!-- 展开列 -->
	<el-table-column type="expand">
		<template v-slot="scope">
			<el-row :class="['bdbottom', i1 ===0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children"
			 :key="item1.id">
				<!-- 渲染一级权限 -->
				<el-col :span="5">
					<el-tag  	
					closable>{{item1.authName}}
						<!-- <i class="el-icon-close"></i> -->
					</el-tag>
					<i class="el-icon-caret-right"></i>
				</el-col>
				<!-- 渲染二三级权限 -->
				<el-col :span="18">
					<!-- 二级权限 -->
					<el-row :class="['bdbottom', i2 ===0 ? 'bdtop' : '']" v-for="(item2,i2) in item1.children" 
					:key="item2.id">
						<el-col :span="5">
							<el-tag @close="removeRightsById(scope.row,item2.id)" closable type="success">{{item2.authName}}
						<!-- <i class="el-icon-close"></i> -->
							</el-tag>
								<i class="el-icon-caret-right"></i>
						</el-col>
						<!-- 三级权限 -->
						<el-col :span="17">
							<el-tag closable type="warning" :class="['bdbottom', i3 === 0 ? 'bdtop' : '']"
							 v-for="(item3,i3) in item2.children" :key="item3.id"
							 @close="removeRightsById(scope.row,item3.id)">
								{{item3.authName}}
							</el-tag>
								<!-- <i class="el-icon-caret-right"></i> -->
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</template>
	</el-table-column>
	<!-- 索引列 -->
<el-table-column type="index"></el-table-column>
<el-table-column label="角色名称" prop="roleName"></el-table-column>
<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
<el-table-column label="操作">
	<template v-slot="scope">
		       <!-- 修改按钮 -->
        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEideJDialog(scope.row.id)">编辑</el-button>
        </el-tooltip>
          <!-- 删除按钮 -->
        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeJUserById(scope.row.id)	">删除</el-button>
        </el-tooltip>
          <!-- 分配权限按钮 -->
        <el-tooltip effect="dark" content="编辑权限" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRolesDialog(scope.row)">编辑权限</el-button>
        </el-tooltip>
	</template>
</el-table-column>
</el-table>
</el-card>
<!-- 分配权限对话框 -->
<el-dialog
  title="分配权限"
  :visible.sync="setRightsDialogVisible"
  width="50%" @close="setRightsDialogClosed">
  <!-- 内容主体区域 -->
 <el-tree :data="rightsList " show-checkbox default-expand-all node-key="id"
  :props="treeProps" :default-checked-keys="defKeys" ref="treeRef">
	</el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
<!-- 添加角色的对话框 -->
<el-dialog
  title="添加角色"
  :visible.sync="addJDialogVisible"
  width="50%" @close="addJDialogClose">
  <!-- 内容主体区域 -->
  <el-form :model="addJForm" ref="addJFormRef" 
  label-width="70px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addJForm.roleName"></el-input>
  </el-form-item>
  <el-form-item  label="角色描述" prop="roleDesc" >
    <el-input v-model="addJForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
	<!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addJDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addJUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑用户的对话框 -->
<el-dialog
  title="编辑用户"
  :visible.sync="editJDialogVisible"
  width="50%"
  @close="editJDialogClose">
  <!-- 主体内容区域 -->
  <el-form :model="editJForm" ref="editJFormRef" label-width="70px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editJForm.roleName"></el-input>
  </el-form-item>
   <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="editJForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editJDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editJUserInfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
  name:'Roles',
  data() {
    return {
			// 获取所有角色列表数据list
	    rolesList:[],
			//获取所有角色列表数据tree
			rightsList:[],
			// 树形控件的属性绑定对象
			treeProps:{
				label:'authName',
				children:'children'
			},
			// 默认选中节点的id
			defKeys:[],
			//控制添加角色对话框的关闭
			addJDialogVisible:false,
	    // 控制编辑角色对话框的关闭
			editJDialogVisible:false,
			addJForm:{
        roleName:'',
				roleDesc:'',
			},
			editJForm:{
				
			},
			// 控制权限对话框的关闭
			setRightsDialogVisible:false,
			// 当前即将分配权限的角色id
			roleId:'',

    }
  },
	created() {
		this.getRolesList()
	},
methods:{
		// 获取所有角色列表
	async getRolesList() {
			const {data:res}= 
			await this.$http.get('roles')
			if(res.meta.status !== 200){ 
				return this.$message.error('获取角色列表数据失败')
			}
			this.rolesList = res.data
			// console.log(this.rolesList)
		},
		// 监听添加角色框的关闭
		addJDialogClose() {
            this.$refs.addJFormRef.resetFields()
        },
		//点击添加角色按钮的网络请求
		addJUser() {
			this.$refs.addJFormRef.validate(async valid => {
				if(!valid) return
				//发送添加角色网络请求
				const {data:res} = 
				await this.$http.post('roles',this.addJForm)
				if(res.meta.status !== 201){
					return this.$message.error('添加角色失败')
				}
				this.$message.success('添加角色成功')
				//隐藏对话框
				this.addJDialogVisible = false
				//重新获取用户列表数据
				this.getRolesList()
			})
		},
		// 根据id删除对应的用户信息
	async removeJUserById(id) {
        // 弹窗询问用户是否删除数据
				const confirmJResult = 
				await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
				//如果用户确认删除,则返回值为字符串confirm
				//如果用户取消删除,则返回值为字符串cancel
				if(confirmJResult !== 'confirm') {
					return this.$message.info('已删除')
				}
				const {data:res} = await this.$http.delete(`roles/` + id)
				if(res.meta.status !== 200){
					return this.$message.error('用户删除失败')
				}
				this.$message.success('用户删除成功')
				this.getRolesList()
			},

			// 展示编辑用户的对话框
  async showEideJDialog(id) {
        const {data:res} = 
        await this.$http.get('roles/' + id)
				console.log(res)
        if(res.meta.status !== 200) {
          return this.$message.error('查询用户信息失败!')
        }
           
        this.editJForm = res.data
        this.editJDialogVisible = true
        },
  // 监听编辑用户框的关闭
  editJDialogClose(){
          this.$refs.editJFormRef.resetFields()
        },
  // 点击按钮确定的网络请求
  editJUserInfo() {
    this.$refs.editJFormRef.validate(async valid => {
    if(!valid) return
    //可以发送修改用户的网络请求
    console.log(11)
    const { data:res } = await this.$http.put(`roles/` + this.editJForm.id
		,{ 
    roleName :this.editJForm.roleName,
    roleDesc :this.editJForm.roleDesc
    })
    if(res.meta.status !== 200) {
    this.$message.error('修改角色失败')
    }
    // 隐藏修改用户弹窗
    this.editJDialogVisible=false,
    //重新获取用户列表数据
		this.getRolesList()
		this.$message.success('修改角色成功')     
    })
        },
//根据id删除对应的权限
async removeRightsById(role,rightId){
	// 弹框确认是否删除
	 const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

				if(confirmResult !== 'confirm'){
					return this.$message.info('取消删除')
				}

				const { data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
				if(res.meta.status !== 200) {
					return this.$message.error('删除权限失败')
				}

				this.$message.success('删除权限成功')

				// this.getRolesList()会导致页面再次渲染，可以直接使用返回值来赋值
				role.children = res.data
			
},
// 监听分配权限框的关闭
// rightsDialogClose(){
//           this.$refs.rightsFormRef.resetFields()
//         },
// 				 @close="rightsDialogClose"
// 展示分配权限的对话框
async showSetRolesDialog(role){
	//获取所有权限的数据
	this.roleId = role.id
	const {data:res} = await this.$http.get(`rights/tree`)
	if(res.meta.status !== 200){
		return this.$message.error('获取权限数据失败')
	}
	// 获得的权限数据赋值给rightsList
	this.rightsList = res.data
	//递归获取三级节点的id
	this.getLeafKeys(role,this.defKeys)
this.setRightsDialogVisible = true
},
//通过递归的方式，获取角色下所有三级权限的id，并保存到 defkey 数组中 
getLeafKeys(node,arr) {
	//如果当前节点不包含children属性这是三级节点
	if(!node.children){
		return arr.push(node.id)
	}
	node.children.forEach(item => 
		this.getLeafKeys(item, arr)
	)
},
//监听分配权限对话框的关闭setRightsDialogClosed
setRightsDialogClosed() {
	this.defKeys=[]
},
// 点击确定为角色分配权限
async allotRights() {
	const keys =[
		// ...展开运算符
		...this.$refs.treeRef.getCheckedKeys(),
		...this.$refs.treeRef.getHalfCheckedKeys()
	]
	const idStr = keys.join(',')

	const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`
	 , {rids : idStr})

 if(res.meta.status !== 200){
	 return this.$message.error('分配权限失败')

 }

	this.$message.success('分配权限成功')
	this.getRolesList()
	this.setRightsDialogVisible = false

	


}




	
	},
}
</script>

<style lang="less" scoped>

.el-col {
	margin:10px;

}
.bdtop {
	border-top:1px solid #eee
}
.bdbottom {
	border-bottom: 1px solid #eee
}
</style>
