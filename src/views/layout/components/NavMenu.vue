<template>
  <!-- <div class="nav-menu-wrap">
        <div class="menu-item">
            <router-link to="">
                <i class="fa fa-home"></i>
                123
            </router-link>
        </div>
        <div class="menu-item">
            <router-link to=""> <i class="fa fa-home "></i>123</router-link>
        </div>
        <div class="menu-item">
            <router-link to=""> <i class="fa fa-home"></i> 123</router-link>
        </div>
         <el-dropdown style="display:inline">
            <span class="el-dropdown-link">
                下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
  </div>-->
  <el-menu
    class="el-menu-navMenu"
    mode="horizontal"
  >
    <!-- <el-menu-item :index="item.url" v-for="item in menuList" :key="item.id">
      <i :class="item.icon"></i>
      <span>{{item.name}}</span>
    </el-menu-item> -->
    <el-menu-item>
      <i class="icon iconfont icon-wenjian"></i>
      <span>文档</span>
    </el-menu-item>
    <el-menu-item @click="toErp">
      <i class="icon iconfont icon-wenjian"></i>
      <span>EIP</span>
    </el-menu-item>
    <!-- <el-menu-item index="3">
      <i class="fa fa-home fa-lg"></i>流程
    </el-menu-item>
    <el-menu-item index="4">
      <i class="fa fa-home fa-lg"></i>报表
    </el-menu-item>
    <el-menu-item index="4">
      <i class="fa fa-home fa-lg"></i>绩效
    </el-menu-item>
    <el-menu-item index="/hr">
      <i class="fa fa-home fa-lg"></i>人事
    </el-menu-item>
    <el-menu-item index="4">
      <i class="fa fa-home fa-lg"></i>系统
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">更多</template>
      <el-menu-item index="/system/menu">菜单管理</el-menu-item>
      <el-menu-item index="/system/permission">权限管理</el-menu-item>
      <el-menu-item index="/system/role">角色管理</el-menu-item>
      <el-submenu index="2-4">
        <template slot="title">选项4</template>
        <el-menu-item index="2-4-1">选项1</el-menu-item>
        <el-menu-item index="2-4-2">选项2</el-menu-item>
        <el-menu-item index="2-4-3">选项3</el-menu-item>
      </el-submenu>
    </el-submenu>-->
  </el-menu>
</template>

<script>
import { mapState } from "vuex";
import {returnEip} from '@/utils/index'
export default {
  data() {
    return {
      activeIndex: ""
    };
  },
  computed: {
    // ...mapState({
    //   menuList: state => state.app.menuList.menu
    // })
  },
  watch:{
    // $route(){
    //   this.activeIndex = this.$route["matched"][0].path;
    //   this.handleSelect(this.activeIndex);
    // }
  },
  methods: {
    // handleSelect(key, keyPath) {
    //   const { id } = this.menuList.find(item => item.url == key) || {};
    //   this.$store.commit("updateCurrentMenu", id);
    // }
    toErp() {
      window.open(returnEip(), '_blank')
    }
  },
  created() {
    // this.activeIndex = this.$route["matched"][0].path;
    // this.handleSelect(this.activeIndex);
  }
};
</script>

<style lang="scss" scoped>
.nav-menu-wrap {
  display: flex;
  padding-left: 20px;
  a {
    display: inline-block;
    color: #fff;
    font-size: 18px;
    padding: 0 30px;
    &:hover {
      background: #02a692;
    }
    &.active {
      background: #02a692;
    }
  }
}

.el-menu-navMenu {
  background: transparent;
  /deep/ .el-menu-item,
  /deep/ .el-submenu,
  /deep/ .el-submenu__title {
    height: 60px !important;
    line-height: 60px !important;
    color: #fff !important;
  }
}
</style>

<style lang="scss">
.el-menu-navMenu {
  &.el-menu.el-menu--horizontal {
    border-bottom: none;
  }

  &.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
  &.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
  &.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
    @include themify($themes) {
      background-color: themed("navMenuActive") !important;
    }
  }
  &.el-menu--horizontal > .el-menu-item.is-active {
    @include themify($themes) {
      background-color: themed("navMenuActive") !important;
      border-bottom: none;
    }

    // background-color: #02a692 !important;
    border-bottom: none;
  }
  &.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
    @include themify($themes) {
      background-color: themed("navMenuActive") !important;
      border-bottom: none;
    }
  }
  .el-submenu__title i,
  .el-menu-item i {
    color: #fff !important;
    padding-right: 4px;
  }
}
</style>


