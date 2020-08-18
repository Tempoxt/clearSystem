<template>
  <!-- <div v-if="!item.hidden" class="menu-wrapper" v-once> -->
  <div class="menu-wrapper">
    <!-- <template
      v-if="hasOneShowingChild(item.subs,item) && (item.tabs||!onlyOneChild.subs||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
    >
      <el-menu-item :index="resolvePath(item.url)+(item.isTabs?`?menuid=${item.id}`:'')" :class="{'submenu-title-noDropdown':!isNest}">
        <i :class="onlyOneChild.icon" style="margin-right:10px" :title="resolvePath(item.url)"></i>
        <span slot="title">{{onlyOneChild.name}}</span>
      </el-menu-item>
    </template> -->
    <!-- <el-menu-item>
      <span slot="title">文档</span>
    </el-menu-item> -->
    <template>
      <router-link  v-for="(item, index) in menusList" :key="index" :to="item.route" >
          <el-menu-item :index="item.route">
            <i class="icon iconfont" :class="[item.icon]" style="margin-right:10px" ></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
      </router-link>
       <!-- <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
      <el-menu-item index="2-3">选项3</el-menu-item> -->
    </template>
    <!-- <el-submenu v-else ref="submenu" :index="resolvePath(item.url)">
      <template slot="title">
        <item v-if="item" :icon="item.icon" :title="item.name"/>
      </template>

      <template v-for="child in item.subs" v-if="!child.hidden&&item.subs">
       
        <sidebar-item
          v-if="child.subs&&child.subs.length>0"
          :is-nest="true"
          :item="child"
          :key="child.url"
          :base-path="$route['matched'][0].path"
          class="nest-menu"
          :parentRoute="!!$route"
        />
        
        <app-link v-else :to="resolvePath(child.url)" :key="child.name">
          <el-menu-item :index="resolvePath(child.url)">
            <item v-if="child" :icon="child.icon" :title="child.name"/>
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu> -->
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";
import auth from '@/utils/auth'
import qs from 'qs'

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    // item: {
    //   type: Object,
    //   required: true
    // },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    },
    parentRoute:{}
  },
  data() {
    return {
      onlyOneChild: null,
      // menusLists: [
      //   { icon: 'icon-bumenwendang', title: '我的文档', act: false, route: '/myDoc' },
      //   { icon: 'icon-wenjian', title: '我的创建', act: false, route: '/create' },
      //   { icon: 'icon-fenxiang', title: '我的共享', act: false, route: '/share' },
      //   { icon: 'icon-shenhe', title: '我的审核', act: false, route: '/verify' },
      //   { icon: 'icon-shijian', title: '历史查看', act: false, route: '/history' },
      //   { icon: 'icon-quanxian', title: '权限设置', act: false, route: '/right' }
      // ]
      menusLists: [
      ]
    };
  },
  created() {
    console.log(qs.parse(auth.getLogInfo()))
  },
  computed: {
    // menusList() {
    //   let data = qs.parse(auth.getLogInfo()).route_msg
    //   let arr = []
    //   data.forEach((item, index) => {
    //     this.menusLists.forEach((i, d) => {
    //       if (i.route.indexOf(item) !== -1) arr.push(i)
    //     })
    //   })
    //   return arr
    // }
  },
  // methods: {
  //   hasOneShowingChild(children = [], parent) {
  //     if(parent.subs.some(item=>item.menutype===3)){
  //       this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
  //       parent.isTabs = true
  //       return true
  //     }
  //     const showingChildren = children.filter(item => {

  //       if (item.hidden) {
  //         return false;
  //       } else {
  //         // Temp set(will be used if only has one showing child)
  //         this.onlyOneChild = item;
  //         return true;
  //       }
  //     });
  //     // When there is only one child router, the child router is displayed by default
  //     if (showingChildren.length === 1) {
  //       return true;
  //     }

  //     // Show parent if there are no child router to display
  //     if (showingChildren.length === 0) {
  //       this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
  //       return true;
  //     }

  //     return false;
  //   },
  //   resolvePath(routePath) {
  //     if (!routePath) {
  //       routePath = "/";
  //     }
  //     if (this.isExternalLink(routePath)) {
  //       return routePath;
  //     }
  //     return this.parentRoute?path.resolve(this.basePath || "/", routePath):this.basePath
  //   },
  //   isExternalLink(routePath) {
  //     return isExternal(routePath);
  //   }
  // }
};
</script>
