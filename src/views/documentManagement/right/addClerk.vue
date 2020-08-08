<template>
    <el-dialog
        title="添加文员管理权限"
        :visible="show"
        width="60%"
        class="overflow"
        @close="close"
    >
      
      <div class="table-wrap">
        <el-col :span="6">
          <org
            :option="treeOption"
            @handlerCb="handlerCb"
            
          >
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
          <employeeTable
            :table="table"
            @handlerCb="handlerCb"
            @selectChange="selectChange"
            @currentChange="currentChange" 
            @search="tableSearch"
          >
            
          </employeeTable>
        </el-col>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
        

    </el-dialog>
</template>>

<script>

import org from '@/components/public/org'
import employeeTable from '@/components/public/employeeTable'
import qs from 'qs'
import axios from 'axios'


export default {
    name: 'addClerk',
    props: {
        show: {
          type: Boolean,
          default: false
        },
        treeData: {
          type: Array,
          default: []
        }
    },
    components: {
      org,
      employeeTable
    },
    created() {
      
    },
    mounted() {
      console.log(this.treeData)
      this.treeOption.treeData.data = this.treeData
      this.req({ dep_id: this.depId })
      this.isChange = false
    },
    data() {
      return {
        isChange: false,
        act: '1',
        form:{
          end_times: null,
          right: null
        },
        rules: {
          end_times: [
            { required: true, trigger: 'blur', message: '请选择有效期' }
          ],
          right: [
            { required: true, trigger: 'blur', message: '请选择权限' }
          ]
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
              treeProps: { children: 'children', label: 'dep_nam' },
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
                    this.req({dep_id: val.dep_id})
                }
              })(),
              expandOnClick: false
            }
          },
          table: {
            check: true,
            size: 'mini',
            loading: true,
            total: 0,
            selectArr: [],
            height: '300px',
            header: {
              left: [
                {
                  type: 'inputSearch',
                  holder: '请输入工号或姓名',
                  value: '',
                  tag: 'sta'
                }
              ]
            },
            main: {
              head: [
                {type: 'index', title: '#'},
                {type: 'text', keys: 'sta', title: '工号', func: 'cons'},
                {type: 'text', keys: 'nam', title: '姓名'},
                {type: 'text', keys: 'position', title: '职位'},
              ],
              body: null,
              
            },
            footer: {
              rangeValue: 20,
              holder: '',
              func: 'sizeChange',
              range: [
                { label: 10, value: 10 },
                { label: 20, value: 20 }
              ]
            }
          }
        }
    },
    methods: {
      
        test(data) {
          console.log(data)
        },
        init() {
          
        },
        close() {
            this.$emit('close', this.isChange)
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
          return year + "-" + this.formatTen(month) + "-" + this.formatTen(day)+ " " + this.formatTen(hour)+ ":" + this.formatTen(minute)+ ":" + this.formatTen(second)
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
        handlerCb(func, data, table){
          this[func](data, table)
        },
        currentChange(val) {
          this.req({page: val, size: this.table.footer.rangeValue}, true)
        },
        selectChange(val) {
          console.log(val)
          this.table.selectArr = val
        },
        tableSearch(e) {
          if (/^[0-9]+$/.test(e.sta)) { return this.req({ dep_id: this.depId, sta: e.sta }) }
          else if (e.sta === '') { return this.req({ dep_id: this.depId }) }
          else { return this.req({ dep_id: this.depId,nam: e.sta }) }
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
          let obj = Object.assign(query, {dep_id: this.depId})
          this.$request.get('/doc/get/user/', { params: obj }).then(data => {
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
          this.req({ size: size, dep_id: this.depId })
        },
        async confirm() {
          let uids = []
          console.log(this.table.selectArr)
          this.table.selectArr.forEach(item => {
            uids.push(item.uid)
          })
          const res = await this.$request.post('/doc/filemanager/', {uids: uids}, {headers: {
            'Content-Type': 'application/json'
          }})
          if (res.code !== 0) return this.$message({ type: 'error', message: res.msg })
          else {
            this.isChange = true
            this.$message({ type: 'success', message: res.msg })
          }
          // this.$refs.form.validate((val) => {
          //   if(val) {
          //     let obj = new FormData()
          //     let arr = []
          //     if (this.form.end_times !== 99) {
          //       obj.end_times = this.form.end_times
          //       let date = new Date().getTime()+(Number(this.form.end_times)*1000*60*60*24)
          //       // obj.end_times = this.timeDormat(date, Number(this.form.end_times))
          //       console.log(date)
          //       obj.append('end_times', this.timeDormat(new Date(date)))
          //     }
          //     else {
          //       if (this.date === '') return this.$message({ type: 'warning', message: '请设置日期'})
          //       // obj.end_times = this.timeDormat(this.date)
          //       obj.append('end_times', this.timeDormat(this.date))
          //     }
          //     this.table.selectArr.forEach(item => {
          //       arr.push(item.uid)
          //     })
          //     obj.sta_list = arr
          //     obj.append('sta_list', arr)
          //     this.$request.post('/doc/share/', obj, { headers: {'Content-Type':'multipart/form-data'}}).then(data => {
          //       if (data.code === 0 ) {
          //         this.$message({type: 'success', message: data.msg})
          //         this.close()
          //       } else this.$message({type: 'error', message: data.msg})
          //     })
          //   }
          // })
          
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
/deep/ .el-dialog {
  margin-top: 14vh !important;
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
.justifyCenter  { 
  justify-content: center;
}
/deep/ .el-dialog__body {
  overflow: scroll !important;
}
.scroll {
}
.tag {
  margin: 0 10px 10px 0;
}
.tag i {
  margin-right: 10px;
}
.overflow {
}
.flex-vertical {
  display: flex;
  flex-direction: column;
  height: 490px;
}
// /deep/.el-tree__empty-block {
//   overflow: hidden !important;
// }
/deep/.el-dialog {
  height: 700px;
}
/deep/.el-scrollbar__wrap{
  height: 320px;
  overflow-y: scroll ;
}
 /deep/ .el-col-18 {
    height: 100% !important;
 }
.table-wrap {
    height: 470px !important;
}
</style>