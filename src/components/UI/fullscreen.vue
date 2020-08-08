<template>
    <div :class="[{ 'isFull': value },'full']">
        <slot />
    </div>
</template>
<script>
export default {
  props: {
    value: {
      default: false
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.isFull {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
  background: #fff;
  z-index: 2;
}
.full {
  height: 100%;
}
</style>

