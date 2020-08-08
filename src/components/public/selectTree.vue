<template>
  <el-popover
    placement="buttom"
    width="400"
    trigger="click">
    <el-tree
      ref="tree2"
      :data="data"
      :props="optionRules"
      :node-key="nodeKey"
      highlight-current
      :default-expanded-keys="[0]"
      @node-click="nodeClick"
      >
      <div  class="flexBetween" slot-scope="{ node, data }">
        <div>
          <i v-if="data.node" class="icon iconfont icon-daibanshixiang"></i>
          &nbsp;
          <span>{{ data.node.label }}</span>
        </div>
      </div>
    </el-tree>
    <el-input slot="reference" v-model="selectValue"></el-input>
  </el-popover>
</template>

<script>
import * as api_common from "@/api/common";
import auth from '@/utils/auth'
import org from '@/components/public/org'

export default {
  components: {
    org
  },
  prop: {
    data: {
      type: Array,
      default: []
    },
    optionRules: {
      type: Object,
      default: {}
    },
    nodeClick: {
      type: Function,
      default: () => {}
    },
    nodeKey: {
      type: [String, Number],
      default: ''
    }
  },
  created() {
    console.log(this.nodeClick)
  },
  data() {
    return {
    //   addDocTree: {
    //     show: true,
    //     treeData: {
    //         data: this.data,
    //         mainIconRules: [],
    //         // { children: 'children', label: 'fol_nam' }
    //         treeProps: this.optionRules,
    //         nodeKey: 'fol_id',
    //         highlightCurrent: true,
            
    //         checkOnClick: false,
    //         nodeClick: this.nodeClick,
    //         expandOnClick: false
    //     }
    // }
    }
  },
  computed: {
    selectValue: {
      get() {
        return this.val
      },
      set(val) {
        return this.$emit('setVal', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-popover {
  position: fixed;
  margin-top: 38px;
  width: 280px !important;
}
</style>