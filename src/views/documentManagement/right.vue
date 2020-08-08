<template>
  <el-row class="h-full public-table-container">
    <el-col :span="4" class="h-full">
      <div class="right_title">角色管理</div>
      <el-tree v-if="treeShow" ref="tree" :data="rightTree" :props="defaultProps" highlight-current node-key="roleid"
        @node-click="nodeClick">
        <div class="flexBetween" slot-scope="{ node, data }">
          <i class="icon iconfont icon-geren"></i>
          &nbsp;
          <span>{{ data.role_nam }}</span>
        </div>
      </el-tree>
    </el-col>
    <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232); height: 100%">
      <employeeTable v-if="table" :table="table" @handlerCb="handlerCb" @selectChange="selectChange"
        @currentChange="currentChange" @search="getTable">
        <template #status="{scope}">
          <span v-if="scope.row.status === '未生效'" style="color: #FF8000">{{scope.row.status}}</span>
          <span v-if="scope.row.status === '已作废'" style="color: #F2353C">{{scope.row.status}}</span>
          <span v-if="scope.row.status === '失效'" style="color: #A3AFB7">{{scope.row.status}}</span>
          <span v-if="scope.row.status === '生效中'" style="color: #18CC72">{{scope.row.status}}</span>
        </template>
      </employeeTable>

      <!--  && addDocTreeData.length -->

      <high v-if="searchShow" :show="searchShow" :selectGroup="highSearch" @req="mergeHigh" @closeDia="closeSearch">
      </high>


      <doc-right v-if="docRightTreeData.length && rightShow" :show="rightShow" :treeData="docRightTreeData"
        :tagData="table.selectArr" @closeRight="closeRight" @closeTag="closeTag"></doc-right>
      <add-clerk v-if="addRightTreeData.length && addClerkShow" :show="addClerkShow" :treeData="addRightTreeData"
        @close="closeAdd"></add-clerk>
    </el-col>
  </el-row>


</template>
<script>
  import screenfull from 'screenfull'
  import qs from 'qs'
  import * as api_common from "@/api/common";
  import auth from '@/utils/auth'
  // import table_mixin from "@c/Table/table_mixin";
  // import { getTabs } from '@/api/common'
  import employeeTable from '@/components/public/employeeTable'
  import org from '@/components/public/org'
  import addClerk from './right/addClerk'
  import docRight from './right/docRight'
  import high from './right/hightSearch'
  import axios from 'axios'

  export default {
    name: 'create',
    // mixins: [table_mixin],
    components: {
      employeeTable,
      org,
      high,
      addClerk,
      docRight
    },
    computed: {
      table() {

        if (this.role_id === null || this.role_id === 3) return this.table1
        else if (this.role_id === 2) return this.table2
        else if (this.role_id === 1) return this.table3
        else if (this.role_id === 0) return this.table4
      }
    },
    watch: {
      table() {
        this.freshPage()
      }
    },
    data() {
      return {
        flatArr: [], // 扁平化树
        searchOption: {},
        highSearchOption: {},
        selectFile: {},
        orgid: 0,
        treeShow: true,
        role_id: null,
        sta: null,
        nam: null,
        currentPage: 1,
        //主页表格
        table1: {
          check: true,
          size: 'mini',
          loading: false,
          total: 0,
          currentPage: 1,
          selectArr: [],
          header: {
            left: [
              {
                type: 'buttonGroup',
                data: [
                  { text: '查询', icon: 'icon-chaxun', func: 'searchShows' }
                ]
              },
              {
                type: 'slot',
                color: 'success',
                slotName: 'but'
              }
            ],
            right: [
              {
                type: 'inputSearch',
                holder: '请输入工号或姓名',
                value: '',
                tag: 'sta'
              },
              {
                type: 'buttonGroup',
                data: [
                  { icon: 'icon-xingzhuang', func: 'full' },
                  { icon: 'icon-shuaxin', func: 'getTable' },
                  { icon: 'icon-lie', type: 'list' }
                ]
              },
            ]
          },
          main: {
            head: [
              { type: 'index', title: '#' },
              { type: 'text', keys: 'dep_nam', title: '部门' },
              { type: 'text', keys: 'sta', title: '工号' },
              { type: 'text', keys: 'nam', title: '姓名' },
              { type: 'text', keys: 'position', title: '职位' }

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
        },
        table2: {
          check: true,
          size: 'mini',
          loading: false,
          total: 0,
          currentPage: 1,
          selectArr: [],
          header: {
            left: [
              {
                type: 'buttonGroup',
                data: [
                  { text: '查询', icon: 'icon-chaxun', func: 'searchShows' }
                ]
              },
              {
                type: 'slot',
                color: 'success',
                slotName: 'but'
              }
            ],
            right: [
              {
                type: 'inputSearch',
                holder: '请输入工号或姓名',
                value: '',
                tag: 'sta'
              },
              {
                type: 'buttonGroup',
                data: [
                  { icon: 'icon-xingzhuang', func: 'full' },
                  { icon: 'icon-shuaxin', func: 'getTable' },
                  { icon: 'icon-lie', type: 'list' }
                ]
              },
            ]
          },
          main: {
            head: [
              { type: 'index', title: '#' },
              { type: 'text', keys: 'dep_nam', title: '部门' },
              { type: 'text', keys: 'sta', title: '工号' },
              { type: 'text', keys: 'nam', title: '姓名' },
              { type: 'text', keys: 'position', title: '职位' }

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
        },
        table3: {
          check: true,
          size: 'mini',
          loading: false,
          total: 0,
          currentPage: 1,
          selectArr: [],
          header: {
            left: [
              {
                type: 'buttonGroup',
                data: [
                  { text: '添加', icon: 'icon-tianjia', func: 'addClerkShows' },
                  { text: '删除', icon: 'icon-banben', func: 'del', isSelect: true },
                  { text: '查询', icon: 'icon-chaxun', func: 'searchShows' },
                  { text: '文档权限', icon: 'icon-bianji', func: 'rightShows', isSelect: true }
                ]
              },
              {
                type: 'slot',
                color: 'success',
                slotName: 'but'
              }
            ],
            right: [
              {
                type: 'inputSearch',
                holder: '请输入工号或姓名',
                value: '',
                tag: 'sta'
              },
              {
                type: 'buttonGroup',
                data: [
                  { icon: 'icon-xingzhuang', func: 'full' },
                  { icon: 'icon-shuaxin', func: 'getTable' }
                  // {  icon: 'icon-lie', func: 'cons' },
                ]
              },
            ]
          },
          main: {
            head: [
              { type: 'index', title: '#' },
              { type: 'text', keys: 'dep_nam', title: '部门' },
              { type: 'text', keys: 'sta', title: '工号' },
              { type: 'text', keys: 'nam', title: '姓名' },
              { type: 'text', keys: 'position', title: '职位' }

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
        },
        table4: {
          check: true,
          size: 'mini',
          loading: false,
          total: 0,
          currentPage: 1,
          selectArr: [],
          header: {
            left: [
              {
                type: 'buttonGroup',
                data: [
                  { text: '查询', icon: 'icon-chaxun', func: 'searchShows' },
                  { text: '文档权限', icon: 'icon-bianji', func: 'rightShows', isSelect: true }
                ]
              },
              {
                type: 'slot',
                color: 'success',
                slotName: 'but'
              }
            ],
            right: [
              {
                type: 'inputSearch',
                holder: '请输入工号或姓名',
                value: '',
                tag: 'sta'
              },
              {
                type: 'buttonGroup',
                data: [
                  { icon: 'icon-xingzhuang', func: 'full' },
                  { icon: 'icon-shuaxin', func: 'getTable' }
                  // {  icon: 'icon-lie', func: 'cons' },
                ]
              },
            ]
          },
          main: {
            head: [
              { type: 'index', title: '#' },
              { type: 'text', keys: 'dep_nam', title: '部门' },
              { type: 'text', keys: 'sta', title: '工号' },
              { type: 'text', keys: 'nam', title: '姓名' },
              { type: 'text', keys: 'position', title: '职位' }

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
        },
        rightTree: [],
        defaultProps: {
          children: 'children',
          label: 'role_nam'
        },
        addClerkShow: false,

        // 高级搜索
        searchShow: false,
        highSearch: {
          option: [
            { value: 'sta', label: '工号', disabled: false },
            { value: 'nam', label: '姓名', disabled: false },
            { value: 'dep_name', label: '部门名称', disabled: false },
            { value: 'position', label: '职位', disabled: false }
          ]
        },
        // 修改文档
        editShow: false,
        belongFile: {},

        // 添加权限
        rightShow: false,
        addRightTreeData: [],

        // 文档权限
        docRightShow: false,
        docRightTreeData: [],

        // 发布文档
        publishShow: false,

        // 更新版本
        versionShow: false,
        addDocTreeData: {},

        // 作废
        cancelShow: false,

        // 分享
        shareShow: false,

        // 文件夹变动
        fileShow: false,
        editFileShow: false,
        target: {}
      }

    },
    mounted() {

    },
    methods: {
      test(data) {
        console.log(data)
      },
      initTable() {
        this.table.selectArr = []
      },
      handlerCb(func, data, table) {
        console.log(func)
        this[func](data, table)
      },
      currentChange(val) {
        console.log(val)
        this.currentPage = val
        this.pagereq({ page: val, size: this.table.footer.rangeValue })
      },
      selectChange(val) {
        this.$set(this.table, 'selectArr', val)
        // this.table.selectArr = val
        console.log(this.table.selectArr)
      },
      sizeChange(size) {
        this.table.footer.rangeValue = size
        this.req({ size: size })
      },

      changeOrg(id) {
        this.orgid = id
      },
      nodeClick(val, node) {
        console.log(val)
        this.currentPage = 1
        this.role_id = val.roleid
        // 刷新高级查询
        // this.searchShow = false
        this.clearMerge()
        this.$refs.tree.setCurrentKey(val.roleid)
      },
      // 请求
      async req(query) {
        let obj = Object.assign(this.searchMerge(), { size: this.table.footer.rangeValue }, query)
        this.table.loading = true
        let data = await this.$request.get('/doc/filemanager/', {
          params: obj
        })
        this.freshPage()
        this.$set(this.table, 'currentPage', 1)
        // this.table.currentPage = 1
        this.table.loading = false
        this.table.pagesize = data.data.page_size
        this.table.total = data.data.total
        this.table.pageindex = data.data.page_index
        // this.table.main.body = data.data.data_list
        this.$set(this.table.main, 'body', data.data.data_list)
        this.initTable()
      },
      // 表格分页强制刷新
      async pagereq(query) {
        let obj = Object.assign(this.searchMerge(), { size: this.table.footer.rangeValue }, query)
        this.table.loading = true
        let data = await this.$request.get('/doc/filemanager/', {
          params: obj
        })
        this.table.loading = false
        this.table.pagesize = data.data.page_size
        this.table.total = data.data.total
        this.table.pageindex = data.data.page_index
        // this.table.main.body = data.data.data_list
        this.$set(this.table.main, 'body', data.data.data_list)
        this.initTable()
      },

      // 添加文档
      addClerkShows() {
        this.addClerkShow = true
      },
      closeAdd(tag = false) {
        this.addClerkShow = false
        if (tag) this.getTable({ type: 'table', page: this.currentPage })
      },

      // 删除
      async del() {
        this.$alert('是否确定将以下人员移除？', {
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              this.delConfirm()
            }
          }
        });
      },
      // 删除确认事件
      async delConfirm() {

        let obj = {
          uids: [],
          token: auth.getToken()
        }
        this.table.selectArr.forEach(item => {
          obj.uids.push(item.uid)
        })
        console.log(obj)
        // obj = JSON.stringify(obj)
        const res = await this.$request.post('/doc/defilemanager/', obj, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (res.code !== 0) return this.$message({ type: 'error', message: res.msg })
        else {
          this.$message({ type: 'success', message: res.msg })
          this.getTable({ type: 'table' })
        }
      },
      // 高级查询
      searchShows() {
        this.searchShow = true
      },
      closeSearch() {
        this.searchShow = false
      },

      closeEditDoc() {
        this.editShow = false
      },
      // 修改文档
      editDocShows() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要修改的文档', type: 'warning' })
        if (this.table.selectArr.length > 1) return this.$message({ message: '仅支持单份文档选择修改', type: 'warning' })

        this.editShow = true

      },
      closeEdit() {
        this.editShow = false
      },
      flatten(arr) {
        arr.forEach(item => {
          if (item.children) {
            this.flatArr.push(item)
            return this.flatten(item.children)
          }
          this.flatArr.push(item)
        })
      },

      // 权限设置
      rightShows() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要设置权限的文档', type: 'warning' })
        this.rightShow = true
      },
      closeRight() {
        this.rightShow = false
      },
      closeTag(index) {
        this.table.selectArr.splice(index, 1)
      },

      // 发布文档
      publishShows() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要发布的文档', type: 'warning' })
        this.publishShow = true
      },
      closePublish() {
        this.publishShow = false
      },
      // 刷新表格底部分页
      freshPage() {
        console.log(this.table)
        const footer = this.table.footer
        this.table.footer = false
        this.$nextTick(() => {
          this.table.footer = footer
        })
      },

      async getTree() {
        const tData = await this.$request.get('/doc/docufolder/', { params: { nosys: 0 } })
        this.docRightTreeData = tData.data
      },
      async getTable({ type = '', page = 1 } = {}) {
        let obj = Object.assign(this.searchMerge(), { size: this.table.footer.rangeValue })
        obj.page = page

        this.table.loading = true
        try {
          const data = await this.$request.get('/doc/filemanager/', { params: obj })
          if (type === '' || type === 'table') {
            console.log(data)
            if (page === 1) {
              const footer = this.table.footer
              this.table.footer = false
              this.$nextTick(() => {
                this.table.footer = footer
              })
            }
            this.table.loading = false
            this.table.main.body = data.data.data_list
            this.table.pagesize = data.data.page_size
            this.table.total = data.data.total
            this.table.pageindex = data.data.page_index
          }
          if (type === '' || type === 'tree') {
            this.treeShow = false
            this.rightTree = data.data.role_tree.reverse()
            this.$nextTick(() => this.treeShow = true)
          }
        } catch (error) {
          this.table.loading = false
          console.log(error)
        }

      },
      async departmentReq() {
        let data = await this.$request.get('/doc/departfolder/')
        this.addRightTreeData = [data.data]
      },
      async init() {
        this.getTree()
        this.getTable()
        this.departmentReq()
        setTimeout(() => {
          this.$refs.tree.setCurrentKey(this.rightTree[0].roleid)
        }, 200)
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

      full() {
        this.isFullScreen() ? screenfull.exit() : screenfull.request()
      },
      isFullScreen() {
        return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
      },

      // // 搜索整合
      // formatTen(num) {
      //     return num > 9 ? (num + "") : ("0" + num);
      // },
      // timeDormat(date) {
      //   let year = date.getFullYear(); 
      //   let month = date.getMonth() + 1; 
      //   let day = date.getDate(); 
      //   let hour = date.getHours(); 
      //   let minute = date.getMinutes(); 
      //   let second = date.getSeconds(); 
      //   return year + "-" + this.formatTen(month) + "-" + this.formatTen(day)+ " " + this.formatTen(hour)+ ":" + this.formatTen(minute)+ ":" + this.formatTen(second)
      // },
      searchMerge() {
        let obj = {}
        // this.table.header.left[1].value !== '' && this.table.header.left[1].value !== null ? obj.create_time_end = this.timeDormat(this.table.header.left[1].value) : obj.create_time_end = ''
        // obj.dim_doc_name = this.table.header.left[2].value
        obj.page = 1
        console.log(this.table, this.table.header.right[0].value)
        this.docSearch(this.table.header.right[0].value)
        obj.dim_sta = this.sta
        obj.dim_nam = this.nam
        console.log(this.role_id)
        obj.roleid = this.role_id
        this.$set(this.table, 'currentPage', 1)
        return Object.assign(obj, this.highSearchOption)
      },
      clearMerge() {
        this.highSearchOption = {}
        this.getTable({ type: 'table', page: this.table.currentPage })
      },
      mergeHigh(query, act = true) {
        this.highSearchOption = query
        if (act) this.getTable()
      },
      docSearch(val) {
        console.log(this.highSearchOption)
        if (/^[0-9]+$/.test(val)) this.sta = val
        else if (val === '') {
          //  && this.highSearchOption.sta !== '' || this.highSearchOption.nam !== ''
          'sta' in this.highSearchOption && this.highSearchOption.sta !== '' ? '' : this.sta = ''
          'nam' in this.highSearchOption && this.highSearchOption.nam !== '' ? '' : this.nam = ''
        }
        else this.nam = val
      }
    },

    async created() {
      this.init()
    }
  };
</script>

<style lang="scss" scoped>
  .right_title {
    font-size: 16px;
    padding: 25px;
    color: #4C5D66;
  }

  .tree_operate {
    display: none;
    margin: 0 5px;
  }

  .flexBetween:hover .tree_operate {
    display: inline-block !important;
  }

  /deep/ .flexBetween div:nth-child(1) {
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }

  /deep/.flexBetween {
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }

  /deep/ .el-table__fixed-right {
    height: 100% !important;

    /deep/ .el-table__fixed-body-wrapper {
      bottom: 12px;
      max-height: none !important;
      height: unset !important;
    }
  }

  /deep/ .el-table__fixed {
    height: 100% !important;

    /deep/ .el-table__fixed-body-wrapper {
      bottom: 12px;
      max-height: none !important;
      height: unset !important;
    }
  }

  /deep/ .el-table__fixed::before,
  /deep/ .el-table__fixed-right::before {
    display: none;
  }
</style>