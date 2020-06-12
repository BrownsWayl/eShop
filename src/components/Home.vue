<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <h3>电商后台管理系统</h3>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menuWidth">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router='true'
          :default-active='activeLinkPath'
        >
          <el-submenu v-for="list in menuList" :index='list.id+ ""' :key="list.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ list.authName }}</span>
            </template>
            <el-menu-item @click="saveLinkState(child.path)" v-for="child in list.children" :index='"/"+child.path' :key="child.id">
              <i class="el-icon-menu"></i>
              <span>{{ child.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      isCollapse: false,
      menuWidth: '200px',
      activeLinkPath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activeLinkPath = '/' + sessionStorage.getItem('activePath')
    console.log(this.activeLinkPath)
  },
  methods: {
    saveLinkState(linkpath) {
      sessionStorage.setItem('activePath', linkpath)
      this.activeLinkPath = '/' + linkpath
    },
    logout() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) this.menuWidth = '65px'
      else this.menuWidth = '200px'
    }
  }
}
</script>

<style lang="less" scoped>
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
