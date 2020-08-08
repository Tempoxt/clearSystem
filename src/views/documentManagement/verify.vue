<template>
  <el-row class="h-full public-table-container">
    <el-tabs v-model="activeName" @tab-click="getTable({page: table.currentPage})">
      <el-tab-pane label="我审核的" name="1">
      </el-tab-pane>
      <el-tab-pane label="我发布的" name="2">
      </el-tab-pane>
    </el-tabs>
    <el-col class="mainwrap">
      <employeeTable :table="table" @handlerCb="handlerCb" @selectChange="selectChange" @currentChange="currentChange"
        @search="docSearch">

      </employeeTable>

    </el-col>


    <verifys v-if="verifyShow" :show="verifyShow" :selectArr="table.selectArr" @close="closeVerify"></verifys>

  </el-row>


</template>
<script>
  import screenfull from 'screenfull'
  import qs from 'qs'
  import * as api_common from "@/api/common";
  import auth from '@/utils/auth'
  // import table_mixin from "@c/Table/table_mixin";
  // import { getTabs } from '@/api/common'
  import org from '@/components/public/org'
  import employeeTable from '@/components/public/employeeTable'
  import verifys from '@/components/public/verify'

  import axios from 'axios'

  export default {
    name: 'verify',
    // mixins: [table_mixin],
    components: {
      employeeTable,
      org,
      verifys
    },
    data() {
      return {
        flatArr: [], // 扁平化树
        searchOption: {},
        highSearchOption: {},
        selectFile: {},
        activeName: '',
        orgid: 0,
        treeShow: true,
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
                  { text: '审核', icon: 'icon-pandian', func: 'verifyShows', isSelect: true },
                  { text: '下载', icon: 'icon-wenjian', func: 'download', isSelect: true }
                ]
              },
              {
                type: 'selectWith',
                tag: 'create_time_end',
                select: {
                  value: 0,
                  holder: '',
                  options: [
                    { label: '年', value: 0 },
                    { label: '月', value: 1 },
                    { label: '日', value: 2 }
                  ]
                },
                date: {
                  type: ['year', 'month', 'date']
                },
                value: ''
              },
              {
                type: 'inputSearch',
                holder: '请输入文档名称关键词搜索',
                value: '',
                tag: 'dim_doc_name'
              }
            ],
            right: [
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
              { type: 'link', keys: 'doc_nam', title: '文档名称', func: 'seek', width: 220 },
              { type: 'text', keys: 'version', title: '版本号' },
              {
                type: 'textRules', keys: 'lev', title: '文件级别', rules: {
                  [1]: '一级文件',
                  [2]: '二级文件',
                  [3]: '三级文件',
                  [4]: '四级文件'
                }
              },
              { type: 'text', keys: 'doc_num', title: '文件编号' },
              { type: 'text', keys: 'size', title: '文件大小' },
              {
                type: 'icon', keys: 'format', title: '文件格式',
                rules: {
                  '.pptx': {
                    icon: 'icon-ppt',
                    color: '#F2353C'
                  },
                  '.ppt': {
                    icon: 'icon-ppt',
                    color: '#F2353C'
                  },
                  '.doc': {
                    icon: 'icon-Word',
                    color: '#1A85E4'
                  },
                  '.docx': {
                    icon: 'icon-Word',
                    color: '#1A85E4'
                  },
                  '.xlsx': {
                    icon: 'icon-excel',
                    color: '#18CC72'
                  },
                  '.xls': {
                    icon: 'icon-excel',
                    color: '#18CC72'
                  },
                  '.pdf': {
                    icon: 'icon-pdf1',
                    color: 'orange'
                  }
                }
              },
              { type: 'text', keys: 'remark', title: '备注' },
              { type: 'text', keys: 'nam', title: '创建人' },
              { type: 'text', keys: 'cr_time', title: '创建时间', sort: true, width: 160 },
              {
                type: "text",
                keys: "doc_expir",
                title: "文档有效期",
                width: 160,
              },
              {
                type: 'tags', keys: 'audit', title: '审核状态', options: {
                  1: { color: 'info', tip: '待审核' },
                  2: { color: 'warning', tip: '审核中' },
                  3: { color: 'warning', tip: '免审核' },
                  4: { color: 'danger', tip: '已退回' },
                  5: { color: 'success', tip: '已通过' }
                }
              }
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
                type: 'selectWith',
                tag: 'create_time_end',
                select: {
                  value: 0,
                  holder: '',
                  options: [
                    { label: '年', value: 0 },
                    { label: '月', value: 1 },
                    { label: '日', value: 2 }
                  ]
                },
                date: {
                  type: ['year', 'month', 'date']
                },
                value: ''
              },
              {
                type: 'inputSearch',
                holder: '请输入文档名称关键词搜索',
                value: '',
                tag: 'dim_doc_name'
              },
              {
                type: 'slot',
                color: 'success',
                slotName: 'but'
              }
            ],
            right: [
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
              { type: 'link', keys: 'doc_nam', title: '文档名称', func: 'seek', width: 220 },
              { type: 'text', keys: 'version', title: '版本号' },
              {
                type: 'textRules', keys: 'lev', title: '文件级别', rules: {
                  [1]: '一级文件',
                  [2]: '二级文件',
                  [3]: '三级文件',
                  [4]: '四级文件'
                }
              },
              { type: 'text', keys: 'doc_num', title: '文件编号' },
              { type: 'text', keys: 'size', title: '文件大小' },
              {
                type: 'icon', keys: 'format', title: '文件格式',
                rules: {
                  '.pptx': {
                    icon: 'icon-ppt',
                    color: '#F2353C'
                  },
                  '.ppt': {
                    icon: 'icon-ppt',
                    color: '#F2353C'
                  },
                  '.doc': {
                    icon: 'icon-Word',
                    color: '#1A85E4'
                  },
                  '.docx': {
                    icon: 'icon-Word',
                    color: '#1A85E4'
                  },
                  '.xlsx': {
                    icon: 'icon-excel',
                    color: '#18CC72'
                  },
                  '.xls': {
                    icon: 'icon-excel',
                    color: '#18CC72'
                  },
                  '.pdf': {
                    icon: 'icon-pdf1',
                    color: 'orange'
                  }
                }
              },
              { type: 'text', keys: 'remark', title: '备注' },
              { type: 'text', keys: 'control', title: '受控级别' },
              { type: 'text', keys: 'nam', title: '创建人' },
              { type: 'text', keys: 'cr_time', title: '创建时间', sort: true, width: 160 },
              {
                type: "text",
                keys: "doc_expir",
                title: "文档有效期",
                width: 160,
              },
              {
                type: 'tags', keys: 'audit', title: '审核状态', options: {
                  1: { color: 'info', tip: '待审核' },
                  2: { color: 'warning', tip: '审核中' },
                  3: { color: 'warning', tip: '免审核' },
                  4: { color: 'danger', tip: '已退回' },
                  5: { color: 'success', tip: '已通过' }
                }
              }
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

        // 审核
        verifyShow: false,
        // 高级搜索
        searchShow: false,
        highSearch: {
          option: [
            { value: 'lev', label: '文件级别', disabled: false },
            { value: 'doc_num', label: '文件编号', disabled: false },
            { value: 'user_name', label: '创建人', disabled: false },
            { value: 'create_time', label: '创建时间', disabled: false },
            { value: 'push_time', label: '发布时间', disabled: false },
            { value: 'version', label: '版本号', disabled: false }
          ]
        },

      }

    },
    mounted() {
      this.activeName = '1'
    },
    computed: {
      table() {
        if (this.activeName === '1') return this.table1
        else return this.table2
      }
    },
    // inject: ['el'],
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
      // 设置分页
      setPage(val) {
        if (this.activeName === '1') {
          this.$set(this.table1, 'currentPage', val)
        } else {
          this.$set(this.table2, 'currentPage', val)
        }
        console.log(this.table1.currentPage, this.table2.currentPage)
      },
      // 返回分页
      returnPage() {
        if (this.activeName === '1') {
          return this.table1.currentPage
        } else {
          return this.table2.currentPage
        }
      },
      currentChange(val) {
        console.log(val)
        this.setPage(val)
        this.pagereq({ fol_id: this.fol_id, page: val, size: this.table.footer.rangeValue })
      },
      selectChange(val) {
        this.$set(this.table, 'selectArr', val)
        console.log(this.table.selectArr)
      },
      sizeChange(size) {
        this.table.footer.rangeValue = size
        this.req({ size: size })
      },

      changeOrg(id) {
        this.orgid = id
      },
      cons(data, table) {
        console.log(data, table)
      },
      // 针对utf-8转base64
      _utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }

        }
        return utftext;
      },
      // base64转码
      encode64(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        input = this._utf8_encode(input);
        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
          output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
      },
      // 对象转换成连接符字符串
      transObj(data) {
        let newData = ''
        for (var i of Object.entries(data)) {
          newData += encodeURIComponent(i[0]) + '=' + encodeURIComponent(i[1]) + '&'
        }
        newData = newData.slice(0, -1)
        console.log(newData)
        return newData
      },
      returnRight(obj) {
        let arr = ['FILE_READ']
        obj.downloads ? arr = ['FILE_PRINT', ...arr] : ''
        obj.edit ? arr = ['FILE_WRITE', ...arr] : ''
        console.log(arr)
        return arr
      },
      // 查看文档
      async seek(data) {
        let res = await this.$request.get('/doc/get/data/', {
          params: {
            version: data.version,
            doc_id: data.doc_id,
            store_id: data.store_id
          }
        })
        if (res.code !== 0) return this.$message({ type: 'error', message: res.msg })
        if (res.code === 0) {
          let Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
          let docData = {
            version: data.version,
            token: qs.parse(auth.getLogInfo()).token
          }
          let rightArr = this.returnRight(res)
          let bisheng = {
            doc: {
              docId: data.doc_id + '&' + data.version,
              title: data.doc_nam + data.format,
              version: data.version,
              fetchUrl: decodeURIComponent(res.data[0].data),
              callback: res.cb + '?' + this.transObj(docData)
            },
            user: {
              uid: qs.parse(auth.getLogInfo()).dep_id,
              nickName: qs.parse(auth.getLogInfo()).nam,
              avatar: "https://www.baidu.com/img/flexible/logo/pc/result.png",
              privilege: rightArr
            }
          }
          bisheng = this.encode64(JSON.stringify(bisheng))
          // window.open('http://192.168.0.36/apps/editor/openPreview?data=' + bisheng)
          // window.open('http://192.168.0.36/apps/editor/openEditor?data=' + bisheng)
          let life = await this.$request.get('/doc/get/life/', {
            params: {
              version: data.version,
              doc_id: data.doc_id,
              type: 1
            }
          })
          let lifeData = {
            lifeData: life.data
          }
          let obj = Object.assign(res.data, data, { url: 'http://192.168.0.36/apps/editor/openPreview?data=' + bisheng }, lifeData)
          await auth.setDoc(obj)
          this.$router.push('/seek?date=' + new Date().getTime())
        }
      },
      // 请求
      async req(query) {
        let obj = Object.assign(this.searchMerge(), { size: this.table.footer.rangeValue }, query)
        this.table.loading = true
        let url = '/doc/audit/'
        if (this.activeName === '1') url = '/doc/audit/'
        else if (this.activeName === '2') url = '/doc/push/'
        let data = await this.$request.get(url, {
          params: obj
        })
        const footer = this.table.footer
        this.table.footer = false
        this.$nextTick(() => {
          this.table.footer = footer
        })
        this.setPage(1)
        this.table.loading = false
        this.table.pagesize = data.data.page_size
        this.table.total = data.data.total
        this.table.pageindex = data.data.page_index
        // this.table.main.body = data.data.data_list
        this.$set(this.table.main, 'body', data.data.data_list)
        this.initTable()
      },
      async pagereq(query) {
        let obj = Object.assign(this.searchMerge(), { size: this.table.footer.rangeValue }, query)
        this.table.loading = true
        let url = '/doc/audit/'
        if (this.activeName === '1') url = '/doc/audit/'
        else if (this.activeName === '2') url = '/doc/push/'
        let data = await this.$request.get(url, {
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
      async departmentReq() {
        let data = await this.$request.get('/doc/departfolder/')
        this.addRightTreeData = [data.data]
      },


      // 更新版本
      verifyShows() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要审核的文档', type: 'warning' })
        this.verifyShow = true
      },
      closeVerify(act) {
        this.verifyShow = false
        if (act) this.getTable({ page: this.table.currentPage })
      },

      // 下载
      download() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要下载的文档', type: 'warning' })
        this.table.selectArr.length === 1 ? this.oneFile() : this.mulFile()
      },
      oneFile() {
        let obj = {
          doc_id: this.table.selectArr[0].doc_id,
          version: this.table.selectArr[0].version,
          doc_nam: this.table.selectArr[0].doc_nam,
          store_id: this.table.selectArr[0].store_id
        }
        this.$request.post('/doc/downloads/', obj).then(data => {
          if (data.msg !== '成功') return this.$message({ type: 'error', message: data.msg })
          this.downloading(data.data)
        })
      },
      async mulFile() {
        let arr = []
        let formData = new FormData()
        this.table.selectArr.forEach(item => {
          let obj = {
            doc_id: item.doc_id,
            version: item.version,
            doc_nam: item.doc_nam,
            store_id: item.store_id
          }
          arr.push(obj)
        })
        const data = await this.$request.post('/doc/downloads/', { data_list: arr }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (data.msg !== '成功') return
        this.downloading(data.data)

      },
      downloading(data) {
        data.forEach(item => {
          let a = document.createElement('a')
          a.href = item.data
          a.download = ''
          a.target = '_blank'
          a.click()
        })
      },

      async getTable({ page = 1 } = {}) {
        let obj = Object.assign(this.searchMerge(), { size: this.table.footer.rangeValue })
        obj.page = page
        if (page === 1) {
          this.setPage(1)
        }
        this.table.loading = true
        try {
          let url = '/doc/audit/'
          if (this.activeName === '1') url = '/doc/audit/'
          else if (this.activeName === '2') url = '/doc/push/'
          const data = await this.$request.get(url, { params: obj })
          console.log(data)
          this.table2.loading = this.table.loading = false
          this.table2.main.body = this.table.main.body = data.data.data_list
          this.table2.pagesize = this.table.pagesize = data.data.page_size
          this.table2.total = this.table.total = data.data.total
          this.table2.pageindex = this.table.pageindex = data.data.page_index
        } catch (error) {
          this.table2.loading = this.table.loading = false
          console.log(error)
        }

      },
      async init() {
        this.getTable()
        this.departmentReq()
      },
      async getTree() {
        this.treeShow = false
        const tData = await this.$request.get('/doc/docufolder/')
        this.addDocTreeData = tData.data
        this.$nextTick(() => this.treeShow = true)
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

      // 搜索整合
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
      searchMerge() {
        let obj = {}
        console.log(this.table.header.left)
        if (this.activeName === '1') {
          this.table.header.left[1].value !== '' && this.table.header.left[1].value !== null ? (obj.create_time_from = this.table.header.left[1].value[0]) && (obj.create_time_end = this.table.header.left[1].value[1]) : (obj.create_time_from = '') && (obj.create_time_end = '')
          obj.dim_doc_name = this.table.header.left[2].value
        } else {
          this.table.header.left[0].value !== '' && this.table.header.left[0].value !== null ? (obj.create_time_from = this.table.header.left[0].value[0]) && (obj.create_time_end = this.table.header.left[0].value[1]) : (obj.create_time_from = '') && (obj.create_time_end = '')
          obj.dim_doc_name = this.table.header.left[1].value
        }

        obj.fol_id = 0
        console.log(obj)
        return Object.assign(obj, this.highSearchOption)
      },
      mergeHigh(query, act = true) {
        this.highSearchOption = query
        if (act) this.getTable()
      },
      docSearch(val) {
        this.getTable()
      },
      tabClick() {
        this.setPage(val)
        this.getTable({ page: this.returnPage() })
      },
      async cancelShows() {
        console.log(this.table.selectArr)
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要取消分享的文档', type: 'warning' })
        let data_list = []
        this.table.selectArr.forEach(item => {
          let obj = {}
          obj.doc_id = item.doc_id
          obj.version = item.version
          obj.share_time = item.share_time
          obj.by_uid = item.by_uid
          data_list.push(obj)
        })
        const data = await this.$request.post('/doc/audit/', { data_list: data_list })
        if (data.code === 0) {
          this.$message({ type: 'success', message: data.msg })
          this.getTable({ page: this.table.currentPage })
        }
        else {
          this.$message({ type: 'error', message: data.msg })
        }
      }
    },

    async created() {
      this.init()
      console.log(this.addDocTreeData)
      // const { menu } = await getTabs(this.$route.query.menuid)
      // this.menu = menu
    }
  };
</script>

<style lang="scss" scoped>
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

  .mainwrap {
    width: 100%;
    // padding: 20px;
    height: 100%;
  }

  /deep/ .el-tabs {
    position: absolute;
    top: 20px;
    left: 15px;
    right: 15px;
  }

  .table {
    position: relative;
    padding: 20px 15px;

  }

  .h-full {
    padding: 50px 0 0px
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