<template>
  <el-dialog title="发布文档" :visible="show" width="90%" class="overflow" @close="close">

    <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="有效期" prop="effect">
          <el-radio-group v-model="form.effect" style="margin-right: 10px;">
            <el-radio :label="'永久'">永久</el-radio>
            <el-radio :label="'自定义'">
              自定义截止日期

            </el-radio>
          </el-radio-group>
          <el-date-picker v-model="diyDate" size="mini" type="datetime" format="yyyy-MM-dd HH:mm:ss"
            :disabled="form.effect !== '自定义'">
          </el-date-picker>
        </el-form-item>
      </el-form>

    </div>
    <div class="table-wrap">
      <employeeTable v-if="table.main.body.length" :table="table" @handlerCb="handlerCb">
        <template #attachfiles="{scope}" >
          <template v-if="scope.row['attachfiles'].length">
            <div v-for="(item, index) in scope.row['attachfiles']" class="appendix">{{item.doc_nam + item.format}}</div>
          </template>
          <div v-else>无附件</div>
          <!-- <div @click="test(scope)"></div> -->
        </template>
      </employeeTable>
    </div>

    <span slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>


  </el-dialog>
</template>>

<script>

  import employeeTable from '@/components/public/employeeTable'
  import qs from 'qs'
  import axios from 'axios'
  import auth from '@/utils/auth'

  export default {
    name: 'editDoc',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      selectArr: {
        type: Array,
        default: []
      },
      treeData: {
        type: Array,
        default: () => []
      }

    },
    components: {
      employeeTable
    },
    created() {
      // this.req({ dep_id: 40 })
    },
    mounted() {
      window.addEventListener('click', () => {
      })
      this.table.main.body = JSON.parse(JSON.stringify(this.selectArr))
      this.$set(this.table.main.head[8], 'options', this.depArr)
      this.selectArr.forEach((item, index) => {
        this.$set(this.table.main.body[index], 'flow', 0)
        this.$set(this.table.main.body[index], 'au_sta', '')
        this.$set(this.table.main.body[index], 'appendixList', [])
        this.$set(this.table.main.body[index], 'type', 1)
      })
    },
    computed: {
      depArr() {
        let arr = this.treeData[0].children
        this.handleDepTree(arr)
        return arr
      }
    },
    data() {
      return {
        disabled: false,
        optionArr: [],
        auditArr: [],
        optionLoading: false,
        table: {
          size: 'mini',
          loading: false,
          total: 0,
          height: '300px',
          // selectArr: [],
          main: {
            head: [
              { type: 'index', title: '#' },
              { type: 'text', keys: 'doc_nam', title: '文档名称', width: 160 },
              { type: 'text', keys: 'version', title: '文档版本', width: 160 },
              {
                type: 'select', keys: 'lev', title: '文件级别', width: 160,
                options: [
                  { label: '一级文件', value: '一级文件' },
                  { label: '二级文件', value: '二级文件' },
                  { label: '三级文件', value: '三级文件' },
                  { label: '四级文件', value: '四级文件' },
                  { label: '其他文件', value: '其他文件' }
                ],
                func: 'changeLev'
              },
              { type: 'input', keys: 'doc_num', title: '文件编码', width: 160 },
              {
                type: 'select', keys: 'flow', title: '审批流程', func: 'audit', width: 160,
                options: [
                  { label: '指定人审批', value: 1 },
                  { label: '一、二级文件审核流程', value: 2 },
                  { label: '三、四级文件审核流程', value: 3 },
                  { label: '不审批', value: 0 },
                ],
                optionDisableRule: (() => {
                  let that = this
                  return (scope, val) => {
                    if (scope.row.lev === '其他文件' && (val === 2 || val === 3)) {
                      return true
                    } else {
                      return false
                    }
                  }
                })()
              },
              {
                type: 'selectlazy', keys: 'sta', title: '审批人', func: 'changeAudit', loading: this.optionLoading, holder: '请输入', width: 160,
                disableRule: (() => {
                  let that = this
                  return (scope) => {
                    if (scope.row.flow !== 1) {
                      scope.row.sta = null
                      return true
                    } else {
                      return false
                    }
                  }
                })(),
                methods: (() => {

                  let that = this
                  return (v) => {
                    if (v === '') {
                      that.$set(that.table.main.head[6], 'options', [])
                      return
                    }
                    let obj = {}
                    that.$set(that.table.main.head[6], 'options', [])
                    that.optionLoading = true
                    if (/^[0-9]+$/.test(v)) { obj.sta = v }
                    else { obj.nam = v }
                    that.$request.get('/doc/get/user/', {
                      params: Object.assign({
                        dep_id: 0, type: 2
                      }, obj)
                    }).then(data => {
                      that.optionArr = []
                      that.auditArr = data.data.data_list
                      that.auditArr.forEach((item, index) => {
                        let obj = {
                          label: item.nam,
                          uid: item.uid,
                          value: item.sta,
                          position: item.position
                        }
                        that.optionArr.push(obj)
                      })
                      that.$set(that.table.main.head[6], 'options', that.optionArr)
                      that.optionLoading = false
                    })
                  }
                })(),
                options: []
              },
              {
                type: 'select', keys: 'type', title: '是否公开', width: 160,
                options: [
                  { label: '全公司公开', value: 1 },
                  { label: '本部门公开', value: 2 },
                  { label: '指定部门公开', value: 3 },
                  { label: '不公开', value: 4 }
                ],
                func: 'changePublish'
              },
              {
                type: 'cascader', keys: 'dep', title: '选择公开部门', width: 160,
                props: {
                  multiple: true,
                  checkStrictly: true,
                  value: 'dep_id',
                  label: 'dep_nam'
                },
                options: [],
                disableRule: (() => {
                  let that = this
                  return (scope) => {
                    if (scope.row.type !== 3) {
                      scope.row.dep = ''
                      return true
                    } else {
                      return false
                    }
                  }
                })()
              },
              // {
              //   type: 'upload', keys: 'appendixList', title: '附件', width: 240, limit: 5,
              //   handleFile: (() => {
              //     let that = this
              //     return (file, fileList, scope) => {
              //       // that.table.main.body[scope.$index].appendixList = fileList
              //       that.$set(that.table.main.body[scope.$index], 'appendixList', fileList)
              //     }
              //   })()
              // },
              {
                type: "slot",
                keys: "attachfiles",
                title: "附件",
                slotName: "attachfiles",
                width: '160px'
              }, // 自定义slot
              { type: 'input', keys: 'remark', title: '备注', width: 160 }
            ],
            body: [],

          }
        },
        form: {
          effect: '永久'
        },
        rules: {
          effect: [
            { required: true, message: '请设置有效期', trigger: 'blur' }
          ]
        },
        diyDate: ''

      }
    },
    methods: {

      test(data) {
        console.log(data)
      },
      init() {

      },
      close() {
        this.$emit('closePublish')
      },
      // 处理部门树
      handleDepTree(arr) {
        arr.forEach((item, index) => {
          if ('children' in item === false) return
          if (item.children.length) this.handleDepTree(item.children)
          else delete arr[index].children
        })
      },
      formatTen(num) {
        return num > 9 ? (num + "") : ("0" + num);
      },
      timeDormat(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + " " + this.formatTen(hour) + ":" + this.formatTen(minute) + ":" + this.formatTen(second)
      },
      async confirm() {
        await this.$refs['form'].validate(val => {
          let status = true
          if (val) {
            for (let i of this.table.main.body) {
              if (i.lev === '' || i.lev === undefined || i.lev === null) {
                this.$message({ type: 'warning', message: '请选择文件级别' })
                status = false
                break
              }
              // else if (i.doc_num === '' || i.doc_num === undefined || i.doc_num === null) {
              //   this.$message({ type: 'warning', message: '请输入文件编码' })
              //   status = false
              //   break
              // } 
              else if (i.flow === '' || i.flow === undefined || i.flow === null) {
                this.$message({ type: 'warning', message: '请选择审批流程' })
                status = false
                break
              } else if (i.flow === 1 && (i.sta === undefined || i.sta === null || i.sta === '')) {
                this.$message({ type: 'warning', message: '请指定审批人' })
                status = false
                break
              }
            }
            if (!status) return
            // this.disabled = true
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });

            let obj = {}
            let f = new FormData()


            obj.data_list = JSON.parse(JSON.stringify(this.table.main.body))

            let lev = {
              '一级文件': 1,
              '二级文件': 2,
              '三级文件': 3,
              '四级文件': 4,
              '其他文件': 5
            }
            if (this.form.effect === '自定义') {
              obj.data_list.forEach((item, index) => {
                obj.data_list[index].lev = lev[obj.data_list[index].lev]
                obj.data_list[index].end_time = this.timeDormat(this.diyDate)
                if (obj.data_list[index].type === 3) obj.data_list[index].dep = obj.data_list[index].dep.flat()
                delete obj.data_list[index].link
                delete obj.data_list[index].fol_id
                delete obj.data_list[index].size
                delete obj.data_list[index].format
                delete obj.data_list[index].control
                delete obj.data_list[index].status
                delete obj.data_list[index].audit
                delete obj.data_list[index].cr_time
                delete obj.data_list[index].push_time
                delete obj.data_list[index].sta
                delete obj.data_list[index].appendixList
                delete obj.data_list[index].attachfiles
              })
            } else {
              obj.data_list.forEach((item, index) => {
                obj.data_list[index].lev = lev[obj.data_list[index].lev]
                obj.data_list[index].end_time = '2099-12-12 23:23:23'
                if (obj.data_list[index].type === 3) obj.data_list[index].dep = obj.data_list[index].dep.flat()
                delete obj.data_list[index].link
                delete obj.data_list[index].fol_id
                delete obj.data_list[index].size
                delete obj.data_list[index].format
                delete obj.data_list[index].control
                delete obj.data_list[index].status
                delete obj.data_list[index].audit
                delete obj.data_list[index].cr_time
                delete obj.data_list[index].push_time
                delete obj.data_list[index].sta
                delete obj.data_list[index].appendixList
                delete obj.data_list[index].attachfiles
              })
            }
            obj.sta = qs.parse(auth.getLogInfo()).sta
            console.log(typeof f)
            f.append('data_list', JSON.stringify(obj.data_list))
            f.append('sta', obj.sta)
            // this.$request.post('/doc/issue/', f, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
            //   if (res.code === 0) {
            //     this.$emit('req')
            //     this.$message({ type: 'success', message: res.msg })
            //     this.close()
            //     loading.close()

            //   } else {
            //     this.$message({ type: 'error', message: res.msg })
            //     loading.close()
            //   }
            // }).catch(() => {
            //   loading.close()
            // })
            this.$nextTick(async () => {
              try {
                const res = await this.$request.post('/doc/issue/', f, { headers: { 'Content-Type': 'multipart/form-data' } })
                if (res.code === 0) {
                  this.$emit('req')
                  this.$message({ type: 'success', message: res.msg })
                  this.close()
                  loading.close()

                } else {
                  this.$message({ type: 'error', message: res.msg })
                  loading.close()
                }
              } catch(err) {
                loading.close()
              }
            })
            
          }
        })

      },
      handlerCb(func, data, table) {
        this[func](data, table)
      },
      audit(...val) {
      },
      // req(query) {
      //   // this.table.loading = true
      //   this.$request.get('/doc/get/user/', { params: query}).then(data => {
      //     console.log(data)
      //     this.optionArr = []
      //     this.auditArr = data.data.data_list
      //     this.auditArr.forEach((item, index) => {
      //       let obj = {
      //         label: item.nam,
      //         uid: item.uid,
      //         value: item.sta,
      //         position: item.position
      //       }
      //       this.optionArr.push(obj)
      //     })
      //     this.$set(this.table.main.head[6], 'options', this.optionArr)
      //     console.log(this.optionArr, this.table.main.head[6])
      //   })
      // },
      changeAudit(scope) {
        let obj = {}
        this.optionArr.forEach(item => {
          if (item.value === scope.row.sta) return obj = item
        })
        this.$set(this.table.main.body[scope.$index], 'uid', obj.uid)
        this.$set(this.table.main.body[scope.$index], 'au_sta', obj.value)
        // this.table.main.body[scope.$index]
      },
      changeLev(scope) {
        if (scope.row.lev === '一级文件' || scope.row.lev === '二级文件') {
          scope.row.flow = 2
        } else if (scope.row.lev === '三级文件' || scope.row.lev === '四级文件') {
          scope.row.flow = 3
        } else {
          scope.row.flow = 0
        }
      },
      changePublish(scope) {

      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog__headerbtn {
    top: 14px;
  }

  /deep/.el-dialog__header {
    height: 50px;
    background: #FFF5FAFB;
    padding: 14px;

    .el-dialog__title {
      font-size: 14px;
    }
  }

  /deep/.el-popover {
    position: fixed;
    margin-top: 38px;
    width: 300px !important;
  }

  .bottom {
    margin-bottom: 10px;
  }

  .upload-demo {
    display: inline-block;
  }

  .mar {
    margin-right: 10px;
  }

  /deep/.scrollbar-wrapper {
    margin-bottom: 0 !important;
  }

  .flex {
    display: flex;
    margin: 10px 0;
  }

  .mar {
    margin-right: 50px;
  }

  .inp {
    width: 300px;
  }

  .justifyCenter {
    justify-content: center;
  }

  .scroll {
    overflow-x: scroll;
  }

  .tag {
    margin-right: 10px;
  }

  .tag i {
    margin-right: 10px;
  }

  .flex-vertical {
    display: flex;
    flex-direction: column;
    height: 450px;
  }

  /* // /deep/.el-tree__empty-block {
//   overflow: hidden !important;
// }
// .overflow {
//   height: 700px;
// } */
  /deep/.el-dialog {
    margin-top: 9vh !important;
  }

  /deep/.el-scrollbar__wrap {
    height: 320px;
    overflow-y: scroll;
  }

  .table-wrap {
    height: 420px;
  }

  .appendix {
    width: 140px;
    word-break: break-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>