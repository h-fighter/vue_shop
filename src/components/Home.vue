<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="" alt="">
        <span>管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
<!--        侧边栏区域-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapsed" :collapse-transition="false" router>
<!--          1级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
<!--一级菜单的模板区域-->
            <template slot="title">
              <i :class="icons[item.id]"/>
              <span>{{ item.authName }}</span>
            </template>
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                  <i class="el-icon-menu"/>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  created () {
    this.getMenuList()
  },
  data () {
    return {
      menuList: [],
      icons: {
        '125': 'iconfont iconusers',
        '103': 'iconfont iconlifangtilitiduomiantifangkuai2',
        '101': 'iconfont iconshangpinguanli',
        '102': 'iconfont icondingdan',
        '145': 'iconfont iconshuju'
      },
      isCollapsed: false
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/Login')
    },
    async getMenuList () {
      const {data: res} = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse () {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>

<style lang="less" scoped>
  .home_container{
    height: 100%;
  }
  .el-header{
  background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2mm;
    cursor: pointer;
  }
</style>
