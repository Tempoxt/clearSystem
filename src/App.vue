<template>
  <div id="app">
    <!-- <el-radio-group v-model="theme" style="  position: absolute;right:0;bottom:0;z-index:999">
      <el-radio label="0BB2D4">备选项</el-radio>
      <el-radio label="F2353C">红色</el-radio>
      <el-radio label="DC5D03">橙色</el-radio>
    </el-radio-group>-->
    <keep-alive >
        <router-view v-if="isRouterAlive"/>
    </keep-alive>
   
  </div>
</template>


<script>
import { toggleClass } from "@/utils";
import { mapState } from "vuex";
export default {
  // data() {
  //   return {
  //     theme: "0BB2D4"
  //   };
  // },
  watch: {
    theme: {
      handler() {
        document.body.className = "";
        toggleClass(document.body, `theme-${this.theme}`);
      },
      immediate: true
    }
  },
  // provide() {
  //   return {
  //     reload: this.reload
  //   }
  // },
  computed: {
    ...mapState({
      theme: state => state.app.theme
    }),
    themeClass() {
      return `theme-${this.theme}`;
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    // reload() {
    //   this.isReouterAlive = false
    //   this.$nextTick(() => {
    //     this.isRouterAlive = true
    //   })
    // }
  }
};
</script>


<style lang="scss">
#app {
  height: 100%;
}
.el-radio__label,.el-form-item__label,.el-select-dropdown__item,.el-popover{
  font-size: 12px!important;
}
.hide {
  display: none;
}
</style>
