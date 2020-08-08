<template>
  <!-- <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"> -->
  <div style="padding:20px" class="h-full">
    <div v-if="'showSearch' in option" class="side-header">
      <el-input size="mini" placeholder="快速查找" v-model="option.search.text" class="input">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>

      <el-button v-if="operate" circle size="mini" class="circle" @click="handlerCb(option.search.add.func)">
        <i class="icon iconfont icon-tianjia" style="font-size: 12px;"></i>
      </el-button>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
      <el-tree v-if="treeShow" ref="tree2" class="tree" :data="option.treeData.data" :props="option.treeData.treeProps"
        :show-checkbox="option.treeData.checkbox" :default-expanded-keys="option.treeData.expandedArr" :node-key="option.treeData.nodeKey"
        :filter-node-method="option.treeData.filterMethod" :highlight-current="option.treeData.highlightCurrent"
        :check-on-click-node="option.treeData.checkOnClick" @node-click="option.treeData.nodeClick" @check="checkFunc"
        :expand-on-click-node="option.treeData.expandOnClick">
        <!-- @check="option.treeData.checkChange ? option.treeData.checkChange : null"
                -->
        <div class="flexBetween" slot-scope="{ node, data }">
          <!-- <div class="flexBetween"> -->
          <slot name="treeSlot" :data="{ node, data, option }"></slot>
          <!-- <div>
                    <i v-if="node" class="icon iconfont icon-daibanshixiang"></i>
                    <span v-if="data.org_type === 1" class="icon iconfont icon-zonggongsi"></span>
                    <span v-if="data.org_type === 2" class="icon iconfont icon-fengongsi"></span>
                    <span v-if="data.org_type === 3" class="icon iconfont icon-fenbumen"></span>
                    &nbsp;
                    <span>{{ node.label }}</span>
                  </div>
                  <div>
                    <template v-if="option.treeData.operate.length">
                      <i v-for="(item, i) in option.treeData.operate" :key="i" class="icon iconfont  tree_operate" :class="[item.icon]"></i>
                    </template>
                  </div> -->
          <!-- </div> -->

        </div>
      </el-tree>

    </el-scrollbar>
  </div>
  <!-- </el-scrollbar> -->
</template>
<script>
  import * as api_common from "@/api/common";
  export default {
    props: {
      showteam: {
        default: ''
      },
      option: {
        default: {},
        type: Object
      },
      operate: {
        type: Boolean,
        default: false
      },
      treeShow: {
        type: Boolean,
        default: true
      },
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    computed: {
      filterText: {
        get(val) {
          if (this.option.showSearch) return this.option.search.text
          return val
        },
        set(val) {
          return val
        }
      }
    },
    methods: {
      test(...data) {
        console.log(data)
      },
      checkFunc(...data) {
        if ('checkFunc' in this.option.treeData) {
          this.option.treeData.checkFunc(data)
        }
      },
      handlerCb(func, data, table) {
        console.log(12)
        console.log(func)
        this.$emit('handlerCb', func, data, this.table)
      },
      handleChangeNode(val, node) {
        console.log(val)
        // this.$emit('input',val.dep_id,val.fol_id,val.fol_nam)
        // this.$emit('change',val.dep_id,fol_.id,val.fol_nam)
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.fol_nam && data.fol_nam.indexOf(value) !== -1;
      }
    },
    data() {
      return {
        data2: {}
      }
    },
    async created() {

    },
    mounted() {
      console.log(this.option)
      if ('defaultKey' in this.option.treeData) {
        setTimeout(() => {
          this.$refs.tree2.setCurrentKey(this.option.treeData.defaultKey)
        }, 200)
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .el-tree-node__content {
    width: 100% !important;
  }

  .flexBetween {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .tree_operate {
    display: none;
    margin-left: 10px;
  }

  .flexBetween:hover .tree_operate {
    display: inline-block !important;
  }

  .scroll {
    height: calc(100% - 30px);
    width: 100%;

    /deep/ .scrollbar-wrapper {
      overflow-x: hidden;
    }
  }

  .input {
    width: 200px;
  }

  .side-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
</style>
