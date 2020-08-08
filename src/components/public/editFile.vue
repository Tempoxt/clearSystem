<template>
  <el-dialog
    title="修改文件夹"
    :visible="show"
    width="600px"
    @close="close">
    <div class="wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="原文件夹名称">
          <span>{{ target.fol_nam }}</span>
        </el-form-item>
        <el-form-item label="原上级文件夹">
          <span>{{ belong.fol_nam }}</span>
        </el-form-item>
        <el-form-item label="文件夹名称" prop="fol_nam">
          <el-input v-model="form.fol_nam"></el-input>
        </el-form-item>
        <el-form-item label="上级文件夹" prop="pl_nam">
          <el-popover
            placement="buttom"
            width="400"
            trigger="click">
            <el-tree
              ref="tree2"
              :data="dataCopy"
              :props="optionRules"
              :node-key="nodeKey"
              highlight-current
              :default-expanded-keys="[0]"
              :filter-node-method="filterNode"
              @node-click="nodeClick"
              >
              <div  class="flexBetween" slot-scope="{ node, data }">
                <div>
                  <!-- <i v-if="data.lock === 1 && data.p1 !== 0 || data.lock === 0" class="icon iconfont icon-wenjian1"></i> -->
                  <i class="icon iconfont icon-bumenwendang"></i>
                  &nbsp;
                  <span>{{data.fol_nam}}</span>
                </div>
              </div>
            </el-tree>
            <el-input slot="reference" v-model="form.pl_nam"></el-input>
          </el-popover>
        </el-form-item>
      </el-form>
    </div>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>>

<script>
import qs from 'qs'
import auth from '@/utils/auth'
import axios from 'axios'
// import selectTree from '@/components/public/selectTree' 

export default {
    name: 'editFile',
    props: {
        show: {
          type: Boolean,
          default: false
        },
        data: {
          type: Array,
          default: []
        },
        target: {
          type: Object,
          default: {}
        },
        belong: {
          type: Object,
          default: {}
        }
        // selectFile: {
        //   type: Object,
        //   default: {}
        // }
    },
    // components: {
    //   selectTree
    // },
    data() {
        return {
            // 树默认展开
            flatArr: [],
            nodeKey: 'fol_id',
            optionRules: { children: 'children', label: 'fol_nam' },
            dataCopy: this.data,
            form: {
              fol_nam: '',
              fol_id: this.target.fol_id,
              p1: '',
              dep_id: '',
              pl_nam: ''
            },
            rules: {
              fol_nam: [
                { required: true, trigger: 'blur', message: '请输入文件夹名称' }
              ],
              pl_nam: [
                { required: true, trigger: 'input', message: '请选择上级文件夹' }
              ]
            }
        }
    },
    watch:{
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    computed: {
      filterText: {
        get(val) {
          return this.form.pl_nam
        },
        set(val) {
          return val
        }
      }
    },
    methods: {
      
        test(data) {
          console.log(data)
        },
        close() {
            this.$emit('close')
        },
        confirm() {
          this.req()
        },
        setVal(val) {
          this.form.pl_id = val
        },
        nodeClick(data) {
          console.log(data)
          if (data.lock === 1 && data.p1 !== 0 || data.lock === 0) {
             this.$set(this.form, 'pl_nam', data.fol_nam)
            this.$set(this.form, 'p1', data.fol_id)
            this.$set(this.form, 'dep_id', data.dep_id)
            this.$set(this.form, 'fol_id', this.target.fol_id)
          } else if (data.p1 === 0) {
            this.$message({type: 'warning', message: '该文件夹不可被添加'})
          }
        },
        setNam(data) {

        },
        req() {
          this.$refs.form.validate((val) => {
            if (val) {
              let { fol_nam, fol_id,  dep_id, p1 } = this.form
              let obj = { fol_nam, fol_id, dep_id, p1 }
              obj.token = auth.getToken()
              this.$request.put('/doc/docufolder/', obj).then(data => {
                this.$emit('init')
                this.$emit('close')
              })
            }
          })
            
        },
        filterNode(value, data) {
          if (!value) return true;
          return data.fol_nam && data.fol_nam.indexOf(value) !== -1;
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/.el-popover {
    position: fixed;
    margin-top: 38px;
    width: 300px !important;
}
/deep/ .el-dialog {
  border-radius: 15px !important;
}
/deep/ .el-dialog__body {
  padding: 15px 20px !important;
}
.alarm {
  color: #4C5D66;
  font-size:14px;
  font-family:Microsoft YaHei;
  font-weight:400;
  margin-bottom: 10px;
}
.tip {
  color: #A3AFB7;
  font-size:12px;
  font-family: Microsoft YaHei;
  font-weight:400;
  line-height:24px;
  margin-bottom: 5px;
}
.wrap {
  width:350px;
  margin: 0 auto;
}
/deep/ .el-popover {
  max-height: 400px !important;
  overflow-y: scroll;
  width: 270px !important
}
/deep/ .el-form-item__label {
  width: 86px !important;
}
/deep/.el-form-item__content {
  margin-left: 95px !important;
}
/deep/ .el-dialog {
  width: 500px !important;
}
</style>