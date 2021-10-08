<template>
  <el-container class="homeContainer">
    <!-- 头部 -->
    <el-header>
      <div class="home_logo">电商后台管理系统</div>
      <div>
        <el-button type="info" @click="loginOut">退出登陆</el-button>
      </div>
    </el-header>
    <!-- container -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="asideWidth">
        <div class="toggle-button" @click="toggleCollpase">|||</div>
       
        <el-menu
          :collapse="isCollapse"
          background-color="#333744"
          text-color="#fff"
          unique-opened
          router
          :default-active="activePath"
        >
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="menuListIcon[item.id]"></i>
              <span slot="title">{{item.authName}}</span>
            </template>
            <el-menu-item
            :index="'/' + items.path"
            v-for="items in item.children"
            :key="items.id"
            @click="activeItem('/' + items.path)"
            >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{items.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主要内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      isCollapse: false,
      asideWidth: '200px',
      menuList: [],
      menuListIcon: {
        125: 'iconfont icon-yonghu',
        103: 'iconfont icon-quanxian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-dingdan',
        145: 'iconfont icon-shujutongji'
      },
      activePath: ''
    }
  },
  components: {},
  methods: {
    loginOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollpase () {
      this.isCollapse = !this.isCollapse
      this.asideWidth = this.isCollapse ? '64px' : '200px'
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取列表数据失败')
      this.menuList = res.data
    },
    activeItem (path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.homeContainer {
  height: 100%;
  min-width: 1230px;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .home_logo {
    font-size: 25px;
    color: white;
  }
}
.toggle-button {
   background: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
  }
  .el-menu {
    border-right: none;
    i {
      margin-right: 10px;
    }
  }

.el-main {
  background-color: #eaedf1;
}
</style>
