<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- :include="cachedViews" -->
      <keep-alive >
        <router-view :key="key" />
      </keep-alive>
    </transition>
    
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.fullPath;
    }
  },methods: {
    test(data) {
      console.log(data)
    }
  }
};
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  /* min-height: calc(100vh - 84px); */
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid transparent;
  background: #F4F9FA;
  /* overflow: hidden; */
}
</style>

