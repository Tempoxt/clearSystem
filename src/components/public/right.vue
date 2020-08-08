<template>
  <el-dialog title="权限设置" :visible="show" width="60%" class="overflow" @close="close">
    <div class="flex-vertical">
      <div class="bottom scroll">
        <el-tag v-for="(item, index) in tagData" class="tag" type="info" :key="index" :closable="tagData.length > 1"
          @close="closeTag(index)"><el-radio v-model="targetId" :label="item.doc_id" @change="checkDoc(item)"><i class="incon iconfont icon-rizhi" />{{item.doc_nam + '&nbsp;&nbsp;' + item.version}}</el-radio></el-tag>
      </div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="已有权限人员" name="1">
        </el-tab-pane>
        
        <el-tab-pane label="新增权限人员" name="2">
        </el-tab-pane>
        <div class="table-wrap">
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
          <el-col class="table" :span="18">
            <right-table :table="table"@handlerCb="handlerCb" @selectChange="selectChange"
            @currentChange="currentChange" @search="tableSearch" @checkBoxClick="checkBoxClick" @checkAllItem="checkAllItem" />
          </el-col>
        </div>
      </el-tabs>
      


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
      tagData: {
        type: Array,
        default: []
      },
      treeData: {
        type: Array,
        default: []
      },

    },
    components: {
      org,
      employeeTable,
      rightTable
    },
    created() {
      this.test(this.tagData)
      this.targetDoc = this.tagData[0]
      this.targetId = this.tagData[0].doc_id
      this.treeOption.treeData.data = this.treeData
    },
    mounted() {
      this.test(this.tagData)

      this.req({ dep_id: this.depId })

      this.treeOption.treeData.data = this.treeData
    },
    data() {
      return {
        depId: 0,
        record: [], // 记录操作数据
        activeName: '1',
        targetDoc: null, // 选中文件标记
        targetId: null,
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
            // 开启表格内容勾选回调进行业务逻辑编写
            checkOnClick: false,
            nodeClick: (() => {
              let req = this.req
              return (val, node, req) => {
                this.depId = val.dep_id
                this.req({ dep_id: val.dep_id })
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
          size: 'mini',
          loading: true,
          // total: 0,
          selectArr: [],
          height: '300px',
          checkBoxClick: true,
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
              { type: 'index', title: '#', width: '60px' },
              { type: 'text', keys: 'sta', title: '工号', func: 'cons', width: '60px' },
              { type: 'text', keys: 'nam', title: '姓名' },
              { type: 'text', keys: 'position', title: '职位' },
              // {type: 'text', keys: 'size', title: '部门'},
              { type: 'checkbox', keys: 'q', title: '查看', all: false },
              { type: 'checkbox', keys: 'd', title: '下载', all: false },
              { type: 'checkbox', keys: 's', title: '分享', all: false },
              { type: 'checkbox', keys: 'h', title: '历史版本', all: false },
            ],
            body: [],

          }
          // footer: {
          //   rangeValue: 20,
          //   holder: '',
          //   func: 'sizeChange',
          //   range: [
          //     { label: 10, value: 10 },
          //     { label: 20, value: 20 }
          //   ]
          // }
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
        this.$emit('closeRight')
      },
      getIds() {
        let arr = []
        // this.tagData.forEach(item => {
        //   arr.push(item.doc_id + '&' + item.version)
        // })
        arr.push(this.targetDoc.doc_id + '&' + this.targetDoc.version)
        return arr
      },
      checkDoc(item) {
        this.targetDoc = item
        this.req({dep_id: this.depId})
      },
      handlerCb(func, data, table) {
        this[func](data, table)
      },
      tabClick() {
        this.req({ dep_id: this.depId })
      },
      currentChange(val) {
        this.req({ page: val, size: this.table.footer.rangeValue }, true)
      },
      selectChange(val) {
        console.log(val)
        this.table.selectArr = val
      },
      closeTag(index) {
        this.tagData.splice(index, 1)
        this.targetDoc = this.tagData[0]
        this.targetId = this.tagData[0].doc_id
        // this.$emit('closeTag', index)
      },
      tableSearch(tag, value) {
        if (/^[0-9]+$/.test(tag.sta)) { return this.req({ dep_id: this.depId, dim_sta: tag.sta }) }
        else if (tag.sta === '') { return this.req({ dep_id: this.depId }) }
        else { return this.req({ dep_id: this.depId, dim_nam: tag.sta }) }
      },
      async req(query, current) {
        let url
        this.record = []
        if (this.activeName === '2') {
          url = '/doc/permission/'
        } else {
          url = '/doc/havaddper/'
        }
        // 需要强制刷新底部分页器达到重置页数的目的
        // if (current !== true) {
        //   const footer = this.table.footer
        //   this.table.footer = false
        //   this.$nextTick(() => {
        //     this.table.footer = footer
        //   })
        // }
        this.table.loading = true
        let obj = Object.assign(query, { dep_id: this.depId, doc_ids: this.getIds() })
        console.log(obj)
        this.$request.get(url, { params: obj }).then(data => {
          if ('data_list' in data.data) {
            this.$set(this.table.main, 'body', data.data.data_list)
          } else {
            this.$set(this.table.main, 'body', [])
          }
          // this.table.pagesize = data.data.page_size
          // this.table.total = data.data.total
          // this.table.pageindex = data.data.page_index
          if (this.activeName === '2' && data.data.data_list) {
            this.table.main.head.forEach((item, index) => {
              if ('all' in item) {
                this.table.main.head[index].all = false
              }
            })
            this.table.main.body.forEach((item, index) => {
              this.table.main.head.forEach((i, d) => {
                if (i.type === 'checkbox') this.$set(this.table.main.body[index], i.keys, false)
              })
            })
          } else {
            this.table.main.body.forEach((item, index) => {
              this.table.main.head.forEach((i, d) => {
                if (i.type === 'checkbox' && item[i['keys']]) this.$set(this.table.main.body[index], i.keys, true)
                else if (i.type === 'checkbox' && item[i['keys']] === 0) this.$set(this.table.main.body[index], i.keys, false)
              })
            })
            this.headCheck('q', 4)
            this.headCheck('d', 5)
            this.headCheck('s', 6)
            this.headCheck('h', 7)
          }
          // this.$set(this.table.header.left[0], 'value', '')
          this.table.loading = false
          
        })
      },
      async timeOut(loading) {
        let res = await this.$request.get('/doc/permissionres/')
        if (res.code === 0) {
          this.afterConfirm()
          loading.close()
          this.$message({type: 'success', message: res.msg})
        } else if (res.code === 60001) {
          this.$message({type: 'warning', message: res.msg})
           setTimeout(() => {this.timeOut(loading)}, 30000)
        } else {
          this.afterConfirm()
          loading.close()
          this.$message({type: 'success', message: res.msg})
        }
      },
      afterConfirm() {
        this.table.main.body.forEach((item, index) => {
          this.$set(this.table.main.body[index], 'q', 0)
          this.$set(this.table.main.body[index], 'd', 0)
          this.$set(this.table.main.body[index], 's', 0)
          this.$set(this.table.main.body[index], 'h', 0)
        })
        this.req({ dep_id: this.depId })
      },
      async confirm() {
        let arr = []
        if (this.activeName === '2') {
          if (this.table.main.body === undefined || this.table.main.body.length === 0) return
          this.tagData.forEach((i, d) => {
            this.table.main.body.forEach((item, index) => {
              if (item.q || item.d || item.s || item.h) {
                let obj = {}
                obj.q = item.q ? 1 : 0
                obj.d = item.d ? 1 : 0
                obj.s = item.s ? 1 : 0
                obj.h = item.h ? 1 : 0
                obj.uid = item.uid
                obj.doc_id = i.doc_id
                obj.version = i.version
                arr.push(obj)
              }
            })
          })
        } else {
          if (this.table.main.body === undefined || this.table.main.body.length === 0) return
          this.tagData.forEach((i, d) => {
            this.table.main.body.forEach((item, index) => {
              if (this.record.includes(index) === false) return
              let obj = {}
              obj.q = item.q ? 1 : 0
              obj.d = item.d ? 1 : 0
              obj.s = item.s ? 1 : 0
              obj.h = item.h ? 1 : 0
              obj.uid = item.uid
              obj.doc_id = i.doc_id
              obj.version = i.version
              arr.push(obj)
            })
          })
        }
        console.log(arr)
        if (arr.length === 0) return this.$message({ type: 'error', message: '请设置权限' })
        let f = new FormData()
        f.append('data_list', JSON.stringify(arr))
        const loading = this.$loading({
          lock: true,
          text: '分配权限中，请稍等',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const res = await this.$request.post('/doc/permission/', f, { headers: { 'Content-Type': 'multipart/form-data' } })
        setTimeout(() => this.timeOut(loading), 3000)
      },
      sizeChange(size) {
        this.table.footer.rangeValue = size
        this.req({ size: size, dep_id: this.depId })
      },
      // 表格列全选
      checkAllItem(arr) {
        console.log(arr)
        this.table.main.body.forEach((item, index) => {
          this.table.main.body[index][arr[2].keys] = arr[0]
        })
        if (arr[0]) {
          if (arr[2].keys !== 'q') {
            this.table.main.head[4].all = true
            this.table.main.body = this.table.main.body.map(item => {
              item.q = true
              return item
            })
          }
          // if (this.table.main.body.every(item => {
          //   return item.d && item.s && item.h
          // })) {
          //     this.table.main.head[5].all = true
          //     this.table.main.body = this.table.main.body.map(item => {
          //     item.q = true
          //   })
          // }
        } else {
          if (arr[2].keys === 'q') {
            this.table.main.head[5].all = false
            this.table.main.head[6].all = false
            this.table.main.head[7].all = false
            this.table.main.body = this.table.main.body.map(item => {
              item.d = false
              item.s = false
              item.h = false
              return item
            })
          } else {

            this.table.main.body.map(item => {
              if (item.d || item.s || item.h) {
                item.q = true
                return item
              } else {
                item.q = false
                return item
              }
            })
            if (this.table.main.body.some(item => {
              return item.q === false
            })) {
              this.table.main.head[4].all = false
            } else {
              this.table.main.head[4].all = true
            }
          }
        }
        console.log(this.table.main.body)
      },
      // 表格单选
      checkBoxClick(key, val, index) {
        console.log(index)
        this.setRecord(index)
        if (val) {
          if (key === 'q') return
          else {
            this.table.main.body[index]['q'] = true
            // 设置表头全选
            this.headCheck('q', 4)
          }
        } else {
          if (key === 'q') {
            this.table.main.body[index]['d'] = false
            this.table.main.body[index]['s'] = false
            this.table.main.body[index]['h'] = false
            this.table.main.head[5].all = false
            this.table.main.head[6].all = false
            this.table.main.head[7].all = false
          } else {
            this.table.main.body[index]['d'] || this.table.main.body[index]['s'] || this.table.main.body[index]['h'] ? this.table.main.body[index]['q'] = true : this.table.main.body[index]['q'] = false
            this.headCheck('q', 4)
          }
        }
      },
      setRecord(index) {
        if (this.activeName !== '1' || this.record.includes(index)) return
        this.record.push(index)
      },
      // 设置表格头部
      headCheck(key, index) {
        let arr = this.table.main.body.filter(item => {
          return item[key] === false;
        });
        // let sta = this.filt(this.table.main.body, (item) => {
        //   return item[key] === false
        // })
        if (arr.length === 0) this.table.main.head[index].all = false
        else this.table.main.head[index].all = true
      },
      // 过滤
      filt(arr, func) {
        let statu = false
        for (let i = 0; i < arr.length; i++) {
          if (func(arr[i], i)) {
            statu = true
            break
          }
        }
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
    margin-top: 11vh !important;
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

  /deep/ .el-dialog__body {
    overflow: scroll !important;
  }


  .tag {
    margin: 0 10px 10px 0;
  }

  .tag i {
    margin-right: 10px;
  }

  .overflow {}

  .flex-vertical {
    display: flex;
    flex-direction: column;
    height: 550px;
  }

  // /deep/.el-tree__empty-block {
  //   overflow: hidden !important;
  // }
  /deep/.el-dialog {}

  /deep/.el-scrollbar__wrap {
    height: 320px;
    overflow-y: scroll;
  }

  /deep/ .el-col-18 {
    height: 100% !important;
  }

  .table-wrap {
    height: 470px !important;
  }
  /deep/ .el-radio {
    margin-right: unset;
  }
</style>