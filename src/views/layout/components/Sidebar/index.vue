<template>
  <div>
    <div class="logo">
      <router-link to="/" style="color:#fff">
        <span class="icon iconfont icon-logo" style="font-size: 18px;"></span>
      </router-link>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper" class="scrollbar">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        :router="true"
        :unique-opened="true"
      >
        <!-- <span style="display:block;height:40px;color:#A3AFB7;font-size:12px;line-height:40px;padding-left:23px;background:#2F3D43;">{{$route.meta.title}}</span> -->
         <!-- <transition-group name="el-fade-in"> -->
            <template>
                <sidebar-item
                />
              </template>
            <!-- </transition-group> -->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SidebarItem from "./SidebarItem";
import { setTimeout } from 'timers';

export default {
  components: { SidebarItem },
  watch:{
    $route(){
      this.basePath = null
      this.$nextTick(()=>{
        this.basePath = this.$route['matched'][0].path
      })
    },
    sideBarMenu:{
      deep:true,
      handler(){
        this.isShow = false
        
        setTimeout(()=>{
          this.isShow = true
          this.$forceUpdate()
        },200)
      }
    }
  },
  computed: {
    ...mapGetters(["sidebar", "sideBarMenu"]),
    isCollapse() {
      return !this.sidebar.opened;
    },
    ...mapState({})
  },
  created() {
  },
  data() {
    return {
      basePath:this.$route['matched'][0].path,
      isShow:true
    };
  }
};
</script>
<style lang="scss" scoped>
.logo {
  width: 100%;
  height: 59px;
  // background: $primary-color;
  @include themify($themes) {
    background: themed("primary");
  }
  font-size: 24px;
  text-align: center;
  line-height: 60px;
  color: #fff;
}
.scrollbar {
  height: calc(100% - 60px);
}
</style>
