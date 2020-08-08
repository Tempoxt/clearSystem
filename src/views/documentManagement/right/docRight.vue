<template>
    <el-dialog
        title="文档权限设置"
        :visible="show"
        width="60%"
        class="overflow"
        @close="close"
    >
      <div class="flex-vertical">
        <div class="bottom scroll">
          <el-tag
            v-for="(item, index) in tagData"
            class="tag"
            type="info"
            :key="index"
            :closable="tagData.length > 1"
            @close="closeTag(index)"
            ><i

              class="incon iconfont icon-rizhi" />{{item.nam}}</el-tag>
        </div>
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
                  <span>{{ data.data.fol_nam }}</span>
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
              @checkBoxClick="checkBoxClick"
              @checkAllItem="checkAllItem"
            >

            </employeeTable>
          </el-col>
        </div>
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
      employeeTable
    },
    created() {
      this.test(this.tagData)
      this.treeOption.treeData.data = this.treeData
    },
    mounted() {
      this.test(this.tagData)

      this.req({ fol_id: this.fol_id })

      this.treeOption.treeData.data = this.treeData
    },
    data() {
        return {
            fol_id: 0,

          treeOption: {
            show: true,
            showSearch: true,
            search: {
              text: '',
            },
            treeData: {
              data: [],
              expandedArr: [0],
              defaultKey: 0,
              treeProps: { children: 'children', label: 'fol_nam' },
              nodeKey: 'fol_id',
              filterMethod(value, data) {
                  if (!value) return true;
                  return data.fol_nam && data.fol_nam.indexOf(value) !== -1;

              },
              highlightCurrent: true,
              checkOnClick: false,
              nodeClick: (() => {
                let req = this.req
                return (val, node, req) => {
                    this.fol_id = val.fol_id
                    this.req({fol_id: val.fol_id})
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
            total: 0,
            selectArr: [],
            height: '300px',
            // 开启表格内容勾选回调进行业务逻辑编写
            checkBoxClick: true,
            header: {
              left: [
                {
                  type: 'inputSearch',
                  holder: '请输入文档名称',
                  value: '',
                  tag: 'doc_nam'
                }
              ]
            },
            main: {
              head: [
                {type: 'index', title: '#'},
                {type: 'text', keys: 'doc_nam', title: '文档名称', func: 'cons'},
                {type: 'text', keys: 'version', title: '文档版本'},
                {type: 'text', keys: 'route', title: '文件夹路径'},
                {type: 'checkbox', keys: 'q', title: '查看', all: false},
                {type: 'checkbox', keys: 'd', title: '下载', all: false},
                {type: 'checkbox', keys: 's', title: '分享', all: false},
                {type: 'checkbox', keys: 'h', title: '历史版本', all: false},
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
            this.$emit('closeRight')
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
        closeTag(index) {
          this.tagData.splice(index, 1)
          // this.$emit('closeTag', index)
        },
        tableSearch(tag, value) {
          console.log(tag)
          if (tag.doc_nam !== '' && tag.doc_nam !== null) { return this.req({ fol_id: this.fol_id, doc_name: tag.doc_nam }) }
          else if (tag.doc_nam === '') { return this.req({ fol_id: this.fol_id }) }
        },
        req(query, current) {
          // 需要强制刷新底部分页器达到重置页数的目的
          if (current !== true) {
            const footer = this.table.footer
            this.table.footer = false
            this.$nextTick(() => {
              this.table.footer = footer
            })
          }

          this.table.loading = true
          console.log(query)
          let obj = Object.assign(query, {fol_id: this.fol_id})
          this.$request.get('/doc/mycrepershow/', { params: obj }).then(data => {
            this.$set(this.table.main, 'body', data.data.data_list)
            this.table.pagesize = data.data.page_size
            this.table.total = data.data.total
            this.table.pageindex = data.data.page_index
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
        async confirm() {
          let arr = []
          this.tagData.forEach((i, d) => {
            this.table.main.body.forEach((item, index) => {
              if (item.q || item.d || item.s || item.h) {
                let obj = {}
                obj.q = item.q ? 1 : 0
                obj.d = item.d ? 1 : 0
                obj.s = item.s ? 1 : 0
                obj.h = item.h ? 1 : 0
                obj.uid = i.uid
                obj.doc_id = item.doc_id
                obj.version = item.version
                arr.push(obj)
              }
            })
          })
          if (!arr.length) return this.$message({type: 'error', message: '请设置权限'})
          let f = new FormData()
          f.append('data_list', JSON.stringify(arr))
          const res = await this.$request.post('/doc/permission/',  f, { headers: {'Content-Type':'multipart/form-data'}})
          if (res.code === 0) this.$message({type: 'success', message: '设置成功'})
          else return this.$message({type: 'error', message: res.msg})
          this.table.main.body.forEach((item, index) => {
            this.$set(this.table.main.body[index], 'q', 0)
            this.$set(this.table.main.body[index], 'd', 0)
            this.$set(this.table.main.body[index], 's', 0)
            this.$set(this.table.main.body[index], 'h', 0)
          })
          // this.close()
        },
        sizeChange(size) {
          this.table.footer.rangeValue = size
          this.req({ size: size, fol_id: this.fol_id })
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
        },
        // 表格单选
        checkBoxClick(key, val, index) {
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
        // 设置表格头部
        headCheck(key, index) {
          let arr = this.table.main.body.filter(item => {
            return item[key] === false;
          });

          if (arr.length) this.table.main.head[index].all = false
          else this.table.main.head[index].all = true
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
