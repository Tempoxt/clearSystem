<template>
  <el-dialog
    title="添加文件夹"
    :visible="show"
    width="600px"
    @close="close">
    <div class="wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件夹名称" prop="fol_name">
          <el-input v-model="form.fol_name"></el-input>
        </el-form-item>
        <el-form-item label="上级文件夹" prop="pl_nam">
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
              :filter-node-method="filterNode"
              @node-click="nodeClick"
              >
              <div  class="flexBetween" slot-scope="{ node, data }">
                <div>
                  <i class="icon iconfont icon-wenjian1"></i>
                  &nbsp;
                  <span>{{data.fol_nam}}</span>
                </div>
              </div>
            </el-tree>
            <el-input slot="reference" @input="inputSearch" v-model="form.pl_nam"></el-input>
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
import axios from 'axios'
// import selectTree from '@/components/public/selectTree' 

export default {
    name: 'editDoc',
    props: {
        show: {
          type: Boolean,
          default: false
        },
        data: {
          type: [Array, Object],
          default: []
        },
        selectFile: {
          type: Object,
          default: {}
        }
    },
    // components: {
    //   selectTree
    // },
    mounted() {
      console.log(this.data)
      this.init()
      
    },
    methods: {
      test(data) {
        console.log(data)
      }
    },
    data() {
        return {
            flatArr: [],
            nodeKey: 'fol_id',
            optionRules: { children: 'children', label: 'fol_nam' },
            form: {
              fol_name: '',
              fol_id: '',
              p1: '',
              dep_id: '',
              pl_nam: ''
            },
            rules: {
              fol_name: [
                { required: true, trigger: 'blur', message: '请输入文件夹名称' }
              ],
              pl_nam: [
                { required: true, trigger: 'input', message: '请选择上级文件夹' }
              ]
            }
        }
    },
    watch:{
      // filterText(val) {
      //   this.$refs.tree2.filter(val);
      // },
      show() {
        this.init()
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
        inputSearch(v) {
          this.$refs['tree2'].filter(v);
        },
        init() {
          console.log(this.selectFile)
          this.$set(this.form, 'fol_name', '')
          
          this.$set(this.form, 'p1', '')
          
          if (this.selectFile['lock'] === 0 || this.selectFile['p1'] || this.selectFile['dep_id'] === 36 || this.selectFile['dep_id'] === 47) {
            this.$set(this.form, 'pl_nam', this.selectFile.fol_nam)
            this.$set(this.form, 'dep_id', this.selectFile._id)
            this.$set(this.form, 'fol_id', this.selectFile.fol_id)
            this.$set(this.form, 'type', this.selectFile.type)
          } else {
            this.$set(this.form, 'fol_id', '')
            this.$set(this.form, 'dep_id', '')
            this.$set(this.form, 'pl_nam', '')
          }
          
          // this.form = {
          //   fol_name: '',
          //   fol_id: '',
          //   p1: '',
          //   dep_id: '',
          //   pl_nam: ''
          // }
        },
        test(data) {
          console.log(data)
        },
        close() {
            this.init()
            this.$refs.form.clearValidate()
            this.$emit('close')
        },
        confirm() {
          this.req()
        },
        setVal(val) {
          this.form.pl_id = val
        },
        nodeClick(data) {
          if (data.lock === 1 && data.p1 !== 0 || data.lock === 0) {
            this.$set(this.form, 'pl_nam', data.fol_nam)

            this.$set(this.form, 'dep_id', data.dep_id)
            this.$set(this.form, 'fol_id', data.fol_id)
            this.$set(this.form, 'type', data.type)
          } else if (data.p1 === 0) {
            this.$message({type: 'warning', message: '该文件夹不可被添加'})
          }
        },
        setNam(data) {

        },
        req() {
          this.$refs.form.validate((val) => {
            if (val) {
              // let { fol_name, fol_id,  dep_id } = this.form
              // let obj = { fol_name, fol_id, dep_id }
              let f = new FormData()
              f.append('fol_name', this.form.fol_name)
              f.append('fol_id', this.form.fol_id)
              f.append('dep_id', this.form.dep_id)
              f.append('type', this.form.type)
              this.$request.post('/doc/docufolder/', f, { headers: {'Content-Type':'multipart/form-data'}}).then(data => {
                if (data.code !== 0) return this.$message({type: 'error', message: data.msg})
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

</style>