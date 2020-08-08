<template>
  <el-dialog title="分享文档" :visible="show" width="60%" class="overflow" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="文档名称">
        {{ doc.doc_nam }}
      </el-form-item>
      <el-form-item label="有效期" prop="end_times">
        <el-radio-group v-model="form.end_times">
          <el-radio label="永久">永久</el-radio>
          <el-radio label="1w">1周</el-radio>
          <el-radio label="1m">1个月</el-radio>
          <el-radio label="3m">3个月</el-radio>
          <el-radio label="自定义">
            自定义截止日期
            <el-date-picker class="picker" v-model="date" size="mini" type="datetime" format="yyyy-MM-dd HH:mm:ss"
              :disabled="form.end_times !== '自定义'"></el-date-picker>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限设置">
        <el-radio value="查看" label="查看">查看</el-radio>
      </el-form-item>
    </el-form>

    <!--<el-tabs v-model="act">
        <el-tab-pane label="同部门" name="1">
          <el-col :span="6">
            <org :option="treeOption" @handlerCb="handlerCb">
              <template #treeSlot="{data}">
                <div>
                  <i v-if="data.node" class="icon iconfont icon-daibanshixiang"></i>
                  &nbsp;
                  <span>{{ data.node.label }}</span>
                </div>
                <div>
                </div>
              </template>
            </org>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="组织结构" name="2">配置管理</el-tab-pane>
      </el-tabs> -->

    <div class="main-wrap">
      <el-col :span="6">
        <org :option="treeOption" @handlerCb="handlerCb">
          <template #treeSlot="{data}">
            <div>
              <i v-if="data.data.dep_id === 0" class="icon iconfont icon-zonggongsi"></i>
              <i v-else class="icon iconfont icon-fengongsi"></i>
              &nbsp;
              <span>{{ data.node.label }}</span>
            </div>
          </template>
        </org>
      </el-col>
      <el-col :span="18">
        <!-- <employeeTable ref="table" :table="table" @handlerCb="handlerCb" @selectChange="selectChange" @currentChange="currentChange"
          @search="tableSearch">

        </employeeTable> -->
        <right-table ref="table" :table="table" @handlerCb="handlerCb" @selectChange="selectChange" @currentChange="currentChange"
        @search="tableSearch" />
      </el-col>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button :disabled="!isSelect" type="primary" @click="confirm">确 定</el-button>
    </span>


  </el-dialog>
</template>>

<script>
  import org from '@/components/public/org'
  import employeeTable from '@/components/public/employeeTable'
  import rightTable from '@/components/public/rightTable'
  import qs from 'qs'
  import axios from 'axios'


  export default {
    name: 'editDoc',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      treeData: {
        type: Array,
        default: []
      },
      doc: {
        type: Object,
        default: {}
      }
    },
    components: {
      org,
      employeeTable,
      rightTable
    },
    created() {

    },
    computed: {
      isSelect() {
        return this.table.selectArr.length
      }
    },
    mounted() {
      this.treeOption.treeData.data = this.treeData
      this.req({
        dep_id: this.depId
      })
    },
    data() {
      return {
        act: false,
        form: {
          end_times: null,
          right: null
        },
        rules: {
          end_times: [{
            required: true,
            trigger: 'blur',
            message: '请选择有效期'
          }],
          right: [{
            required: true,
            trigger: 'blur',
            message: '请选择权限'
          }]
        },
        samePart: [],
        date: '',
        depId: 0,
        treeOption: {
          show: true,
          showSearch: true,
          search: {
            text: '',
          },
          treeData: {
            data: [],
            treeProps: {
              children: 'children',
              label: 'dep_nam'
            },
            expandedArr: [0],
            defaultKey: 0,
            nodeKey: 'dep_id',
            filterMethod(value, data) {
              if (!value) return true;
              return data.dep_nam && data.dep_nam.indexOf(value) !== -1;

            },
            highlightCurrent: true,
            checkOnClick: false,
            nodeClick: (() => {
              let req = this.req
              return (val, node, req) => {
                this.depId = val.dep_id
                this.req({
                  dep_id: val.dep_id
                })
              }
            })(),
            // nodeClick: (() => {
            //   let req = this.req
            //   return (val, node, req) => {
            //     if (val['p1'] !== 0) {
            //       this.req({fol_id: val.fol_id})
            //     }
            //   }
            // })(),
            expandOnClick: false
          }
        },
        table: {
          check: true,
          size: 'mini',
          loading: true,
          // total: 0,
          selectArr: [],
          height: '300px',
          header: {
            left: [{
              type: 'inputSearch',
              holder: '请输入工号或姓名',
              value: '',
              tag: 'sta'
            }]
          },
          main: {
            head: [{
                type: 'index',
                title: '#',
                width: 60
              },
              {
                type: 'text',
                keys: 'sta',
                title: '工号',
                func: 'cons'
              },
              {
                type: 'text',
                keys: 'nam',
                title: '姓名'
              },
              {
                type: 'text',
                keys: 'position',
                title: '职位'
              },
            ],
            body: null,

          },
          // footer: {
          //   rangeValue: 20,
          //   holder: '',
          //   func: 'sizeChange',
          //   range: [{
          //       label: 10,
          //       value: 10
          //     },
          //     {
          //       label: 20,
          //       value: 20
          //     }
          //   ]
          // }
        }
        // treeData: {
        //   data: this.treeArr,
        //   checkbox: true,
        //   treeProps: { children: 'children', label: 'fol_nam' },
        //   nodeKey: 'fol_id',
        //   filterMethod(value, data) {
        //       if (!value) return true;
        //       return data.fol_nam && data.fol_nam.indexOf(value) !== -1;

        //   },
        //   highlightCurrent: true,
        //   checkOnClick: false,
        //   nodeClick: (() => {
        //     let req = this.req
        //     return (val, node, req) => {
        //       // if (val['p1'] !== 0) {
        //       //   this.req({fol_id: val.fol_id})
        //       // }
        //       console.log(78)
        //     }
        //   })(),
        //   checkFunc: (() => {
        //     let that = this
        //     return (data) => {
        //       // if (val['p1'] !== 0) {
        //       //   this.req({fol_id: val.fol_id})
        //       // }
        //       console.log(that.filterMan(data[1]))
        //       let arr = that.filterMan(data[1])
        //       that.samePart = arr
        //       console.log(that.samePart)

        //     }
        //   })(),
        //   // nodeClick(val,node) {
        //     //   if (val['p1'] !== 0) {
        //     //     this.req({fol_id: val.fol_id})
        //     //   }
        //     //   console.log(val, node)

        //     // },
        //     expandOnClick: false
        //   }
        // },
      }
    },
    methods: {

      test(data) {
        console.log(data)
      },
      init() {

      },
      close() {
        this.$emit('close', this.act)
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
      // stampDormat() {
      //   let year = date/1000/60/60/24/; 
      //   let month = date.getMonth() + 1; 
      //   let day = date.getDate(); 
      //   let hour = date.getHours(); 
      //   let minute = date.getMinutes(); 
      //   let second = date.getSeconds(); 
      //   return year + "-" + this.formatTen(month) + "-" + this.formatTen(day)+ " " + this.formatTen(hour)+ ":" + this.formatTen(minute)+ ":" + this.formatTen(second)
      // },
      filterMan(data) {
        console.log(data)
        return data.checkedNodes.filter((item, index) => {
          console.log('children' in item === false)
          return 'children' in item === false
        })
      },
      handlerCb(func, data, table) {
        this[func](data, table)
      },
      currentChange(val) {
        this.req({
          page: val,
          size: this.table.footer.rangeValue
        }, true)
      },
      selectChange(val) {
        console.log(val)
        this.table.selectArr = val
      },
      closeTag(index) {
        this.tagData.splice(index, 1)
        // this.$emit('closeTag', index)
      },
      tableSearch(e) {
        if (/^[0-9]+$/.test(e.sta)) {
          return this.req({
            dep_id: this.depId,
            sta: e.sta
          })
        } else if (e.sta === '') {
          return this.req({
            dep_id: this.depId
          })
        } else {
          return this.req({
            dep_id: this.depId,
            nam: e.sta
          })
        }
      },
      req(query, current) {
        console.log(query)
        if (current !== true) {
          const footer = this.table.footer
          this.table.footer = false
          this.$nextTick(() => {
            this.table.footer = footer
          })
        }
        this.table.loading = true
        let obj = Object.assign(query, {
          dep_id: this.depId
        })
        this.$request.get('/doc/get/user/', {
          params: obj
        }).then(data => {
          console.log(data)
          this.$set(this.table.main, 'body', data.data.data_list)
          this.table.pagesize = data.data.page_size
          this.table.total = data.data.total
          this.table.pageindex = data.data.page_index
          console.log(this.table.main.body)
          if (data.data.data_list) {
            this.table.main.body.forEach((item, index) => {
              this.table.main.head.forEach((i, d) => {
                if (i.type === 'checkbox') this.$set(this.table.main.body[index], i.keys, false)
              })
            })
          }
          // this.$set(this.table.header.left[0], 'value', '')
          this.table.loading = false
        })
      },
      sizeChange(size) {
        this.table.footer.rangeValue = size
        this.req({
          size: size,
          dep_id: this.depId
        })
      },
      confirm() {
        this.$refs.form.validate((val) => {
          if (val) {
            let obj = new FormData()
            let arr = []
            if (this.form.end_times !== '自定义') {
              // let date = new Date().getTime() + (Number(this.form.end_times) * 1000 * 60 * 60 * 24)
              // // obj.end_times = this.timeDormat(date, Number(this.form.end_times))
              // console.log(date)
              obj.append('period', this.form.end_times)
            } else {
              if (this.date === '') return this.$message({
                type: 'warning',
                message: '请设置日期'
              })
              // obj.end_times = this.timeDormat(this.date)
              // obj.append('end_times', this.timeDormat(this.date))
              obj.append('period', this.timeDormat(this.date))
            }
            // obj.doc_id = this.doc.doc_id
            // obj.version = this.doc.version
            this.table.selectArr.forEach(item => {
              arr.push(item.uid)
            })
            obj.sta_list = arr
            obj.append('doc_id', this.doc.doc_id)
            obj.append('version', this.doc.version)
            obj.append('sta_list', arr)
            const loading = this.$loading({
              lock: true,
              text: '分享中，请稍等',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$request.post('/doc/share/', obj, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(data => {
              if (data.code === 0) {
                this.$message({
                  type: 'success',
                  message: data.msg
                })
                // this.close(true)
                this.act = true
                loading.close()
              } else {
                this.$message({
                  type: 'error',
                  message: data.msg
                })
                loading.close()
              }
            })
          }
        })
        // ToDo...
        // const that = this.$refs.table.$children[0].$children[1]
        // console.log(that)
        // this.table.main.body.forEach((item, index) => {
        //   that.toggleRowSelection(this.table.main.body[index], false)
        // })
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog {
    height: 810px !important;
    width: 1000px !important;
    margin-top: 8vh !important;
  }

  /deep/ .el-scrollbar {
    height: 300px;
    overflow: hidden;
  }

  /* /deep/ .el-input {
    width: 100% !important;
  } */

  .picker {
    width: 235px;
    margin-left: 20px;
  }

  .main-wrap {
    height: 470px !important;
  }

  /deep/ .el-col-18 {
    height: 100% !important;
  }

  // /deep/.el-dialog__header {
  //     height: 50px;
  //     background: #FFF5FAFB;
  //     padding: 14px;
  //     .el-dialog__title {
  //         font-size: 14px;
  //     }
  // }
  // /deep/.el-popover {
  //     position: fixed;
  //     margin-top: 38px;
  //     width: 300px !important;
  // }
</style>
