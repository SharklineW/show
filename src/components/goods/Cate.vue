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
    <el-row>
        <el-col>
            <el-button type="primary" @click="showCateDialog">
                添加商品
            </el-button>
        </el-col>
    </el-row>

		<!-- 表格 -->
<tree-table :data="cateList" :columns="columns"  class="treetable"
:selection-type="false" :expand-type="false"
show-index index-text="#" border :show-row-hover="false">

<template v-slot:isok="scope">
	
	<i class="el-icon-success" v-if="scope.row.cat_deleted === false"
	style="color:lightgreen;"></i>
	<i class="el-icon-error" v-else style="color:red;"></i>
</template>
<template v-slot="istop">
		<el-tag  v-if="scope.row.cat_level === 0" t
	type="primary" size="mini">一级</el-tag>
	<el-tag  v-if="scope.row.cat_level === 1" t
	type="success" size="mini">二级</el-tag>
	<el-tag  v-if="scope.row.cat_level === 2" t
	type="warning" size="mini">三级</el-tag>
</template>
<template v-slot:isopt="scope">
	<el-button type="primary" size="mini" class="el-icon-edit" 
	 @click="openEditCateInfo(scope.row)">编辑</el-button>
	<el-button type="danger" size="mini" class="el-icon-delate"
	@click="deleteCate(scope.row.cat_id)">删除</el-button>
</template>

</tree-table>
<!-- 页区域 -->
 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pagenum"
      :page-sizes="[3,5,7,10]"
			:page-size="queryInfo.pagesize"
      layout="total,sizes, prev, pager, next,jumper"
      :total="total">
	</el-pagination>
</el-card>
<!--添加分类的对话框-->
<el-dialog
  title="添加商品分类"
  :visible.sync="addCateDialogVisible"
  width="30%" @close="addCateDialogClose">
	<!--添加分类的表单-->
  <el-form :model="addCateForm" :rules="addCateFormRules" 
	ref="addCateFormRef" label-width="100px">
  <el-form-item label="分类名称：" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
	<el-form-item label="父级分类：">
	<!--options用来指定数据源-->
	<!--props用来指定配置对象-->
  <el-cascader clearable
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascaderProps"
    @change="parentCateChanged"></el-cascader>
  </el-form-item>
	</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
<!--编辑分类对话框-->

<el-dialog
        title="修改分类名称"
        :visible.sync="editInfoVisible"
        width="50%"
        @close="resetEditForm"
      >
        <el-form label-width="80px" :model="editForm" ref="editFormRefs" :rules="addCateFormRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editInfoVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "istop"
        },
        {
          label: "操作",
          type: "template",
          template: "isopt"
        }
      ],
      addCateDialogVisible: false,
			editInfoVisible:false,
      // 添加表单的数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
			editForm: {
        id: '',
        cat_name: ''
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 父级属性列表
      parentCateList: [],
			// 指定级联选择器的配置对象
			cascaderProps:{
        value: "cat_id",
        label: "cat_name",
        children: "children",
				expandTrigger: 'hover',
				},
			// 选中的父级分类的Id数组
		  selectedKeys:[]
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品数据
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: this.queryInfo
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品数据失败");
      }
      // 把数据赋值给cataList
      // console.log(res)
      this.cateList = res.data.result;
      // 为总数据条数赋值
      this.total = res.data.total;
    },
    // 监听pagesize的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的变化页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据
    async getParentCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 2 }
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！");
      }

      this.parentCateList = res.data;
    },
		// 父级分类数据保存
    parentCateChanged() {
			// console.log(this.selectedKeys)
			// 如果selectedKeys数组中的length>0证明选中的父级分类
			// 反之，就说明没有选中任何父级分类
			if(this.selectedKeys.length > 0) {
				// 父级分类的id
				this.addCateForm.cat_pid = 
				this.selectedKeys[ this.selectedKeys.length -1]
			
			//为当前分类等级赋值
			this.addCateForm.cat_level =
			this.selectedKeys.length
			return
			}else {
				// 父级分类的id
				this.addCateForm.cat_pid = 0
			
			//为当前分类等级赋值
			this.addCateForm.cat_level =0
			}
		},
		//提交添加信息
		addCate(){
			this.$refs.addCateFormRef.validate(async valid => {
				if(!valid) return
				const {data: res} = 
				await this.$http.post(`categories`,this.addCateForm)

				if(res.meta.status !== 201){
					return this.$message.error('添加分类失败！')
				}
				this.$message.success('添加分类成功')

				this.getCateList()

				this.addCateDialogVisible = false
			})
		},
		addCateDialogClose(){
			this.$refs.addCateFormRef.resetFields()
			this.selectedKeys=[]
			this.addCateForm.cat_pid=0
			this.addCateForm.cat_level =0

		},
		resetEditForm () {
      this.$refs.editFormRefs.resetFields()
    },

		deleteCate (id) {
      this.$confirm('此操作将永久删除该分类信息, 是否继续?', '删除分类', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        const { data: res } = await this.$http.delete('categories/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getCateList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openEditCateInfo (row) {
      this.editInfoVisible = true
      this.editForm.cat_name = row.cat_name
      this.editForm.id = row.cat_id
    },
    editCate () {
      this.$refs.editFormRefs.validate(async (valid) => {
        if (!valid) return this.$message.error('提交信息有误')
        const { data: res } = await this.$http.put('categories/' + this.editForm.id, {
          cat_name: this.editForm.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getCateList()
        this.editInfoVisible = false
      })
    }


  }
};
</script>

<style lang="less" scoped>
.treetable {
  margin-top: 15px;
}
.el-cascader {
	width:100%;
	height: 200px;
}
</style>
