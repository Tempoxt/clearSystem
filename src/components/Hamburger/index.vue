<template>
  <div>
    <span :class="`icon iconfont icon-caidanqiehuan white hamburger ${isActive?'is-active':''}`"
      @click="toggleClick"></span>
  </div>
</template>

<script>
export default {
  name: "Hamburger",
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
};
</script>

<style scoped>
.icon-caidanqiehuan:before{
  position: relative;
  top: -22px;
  left: 2px;
}
.hamburger {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 13px;
  transform: rotate(90deg);
  transition: 0.38s;
  transform-origin: 50% 50%;
}

.hamburger.is-active {
  transform: rotate(0deg);
}
</style>
