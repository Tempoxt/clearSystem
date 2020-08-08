<template>
  <el-row class="h-full public-table-container">
    <el-tabs v-model="activeName" @tab-click="clearMerge">
      <el-tab-pane label="常看的" name="1"></el-tab-pane>
      <el-tab-pane label="查看过的" name="2"></el-tab-pane>
    </el-tabs>
    <el-col class="mainwrap">
      <employeeTable :table="table" @handlerCb="handlerCb" @selectChange="selectChange" @currentChange="currentChange"
        @search="docSearch">
        <template #status="{scope}">
          <span v-if="scope.row.status === '未生效'" style="color: #FF8000">{{scope.row.status}}</span>
          <span v-if="scope.row.status === '已作废'" style="color: #F2353C">{{scope.row.status}}</span>
          <span v-if="scope.row.status === '失效'" style="color: #A3AFB7">{{scope.row.status}}</span>
          <span v-if="scope.row.status === '生效中'" style="color: #18CC72">{{scope.row.status}}</span>
        </template>
      </employeeTable>
    </el-col>

    <high v-if="activeName === '1'" :key="1" :show="searchShow" :selectGroup="highSearch" @req="mergeHigh"
      @closeDia="closeSearch"></high>
    <high v-if="activeName === '2'" :key="2" :show="searchShow" :selectGroup="highSearch" @req="mergeHigh"
      @closeDia="closeSearch"></high>

    <share v-if="shareShow" :show="shareShow" :treeData="addRightTreeData" :doc="table.selectArr[0]"
      @close="closeShare" />
  </el-row>
</template>
<script>
  import screenfull from "screenfull";
  import qs from "qs";
  import * as api_common from "@/api/common";
  import auth from "@/utils/auth";
  // import table_mixin from "@c/Table/table_mixin";
  // import { getTabs } from '@/api/common'
  import org from "@/components/public/org";
  import employeeTable from "@/components/public/employeeTable";
  import addDoc from "@/components/public/addDoc";
  import high from "@/components/public/hightSearch";
  import share from "@/components/public/share";
  import axios from "axios";

  export default {
    name: "history",
    // mixins: [table_mixin],
    components: {
      employeeTable,
      org,
      high,
      share
    },
    data() {
      return {
        flatArr: [], // 扁平化树
        searchOption: {},
        highSearchOption: {},
        selectFile: {},
        activeName: "",

        orgid: 0,
        treeShow: true,
        //主页表格
        table1: {
          check: true,
          size: "mini",
          loading: false,
          total: 0,
          currentPage: 1,
          selectArr: [],
          header: {
            left: [
              {
                type: "buttonGroup",
                data: [
                  { text: "查询", icon: "icon-chaxun", func: "searchShows" },
                  {
                    text: "下载",
                    icon: "icon-wenjian",
                    func: "download",
                    isSelect: true
                  },
                  {
                    text: "分享",
                    icon: "icon-fenxiang",
                    func: "shareShows",
                    isSelect: true
                  }
                ]
              },
              {
                type: "selectWith",
                tag: "create_time_end",
                select: {
                  value: 0,
                  holder: "",
                  options: [
                    { label: "年", value: 0 },
                    { label: "月", value: 1 },
                    { label: "日", value: 2 }
                  ]
                },
                date: {
                  type: ["year", "month", "date"]
                },
                value: ""
              },
              {
                type: "inputSearch",
                holder: "请输入文档名称关键词搜索",
                value: "",
                tag: "dim_doc_name"
              },
              {
                type: "slot",
                color: "success",
                slotName: "but"
              }
            ],
            right: [
              {
                type: "buttonGroup",
                data: [
                  { icon: "icon-xingzhuang", func: "full" },
                  { icon: "icon-shuaxin", func: "getTable" },
                  { icon: "icon-lie", type: "list" }
                ]
              }
            ]
          },
          main: {
            head: [
              { type: "index", title: "#" },
              { type: "link", keys: "doc_nam", title: "文档名称", func: "seek", width: 220 },
              { type: "text", keys: "type", title: "文件类型" },
              { type: "text", keys: "version", title: "版本号" },
              { type: "text", keys: "doc_num", title: "文件编号" },
              { type: "text", keys: "size", title: "文件大小" },
              {
                type: "icon",
                keys: "format",
                title: "文件格式",
                rules: {
                  ".pptx": {
                    icon: "icon-ppt",
                    color: "#F2353C"
                  },
                  ".ppt": {
                    icon: "icon-ppt",
                    color: "#F2353C"
                  },
                  ".doc": {
                    icon: "icon-Word",
                    color: "#1A85E4"
                  },
                  ".docx": {
                    icon: "icon-Word",
                    color: "#1A85E4"
                  },
                  ".xlsx": {
                    icon: "icon-excel",
                    color: "#18CC72"
                  },
                  ".xls": {
                    icon: "icon-excel",
                    color: "#18CC72"
                  },
                  ".pdf": {
                    icon: "icon-pdf1",
                    color: "orange"
                  }
                }
              },
              { type: "text", keys: "remark", title: "备注" },
              { type: "text", keys: "nam", title: "创建人" },
              { type: "text", keys: "cr_time", title: "创建时间", sort: true, width: 160 },
              { type: "text", keys: "push_time", title: "发布时间", sort: true, width: 160 },
              { type: "text", keys: "look_time", title: "最近查看时间", width: 160 },
              {
                type: "text",
                keys: "doc_expir",
                title: "文档有效期",
                width: 160,
              },
              {
                type: "slot",
                keys: "status",
                title: "文档状态",
                slotName: "status"
              }
              // {type: 'tags', keys: 'status', title: '文档状态', options: {
              //   1: {color: 'warning', tip: '未发布'},
              //   2: {color: 'success', tip: '生效中'},
              //   3: {color: 'danger', tip: '已作废'},
              //   4: {color: 'warning', tip: '发布后待审核'},
              //   5: {color: 'info', tip: '失效'}
              // }}
            ],
            body: null
          },
          footer: {
            rangeValue: 20,
            holder: "",
            func: "sizeChange",
            range: [
              { label: 10, value: 10 },
              { label: 20, value: 20 }
            ]
          }
        },
        table2: {
          check: true,
          size: "mini",
          loading: false,
          total: 0,
          currentPage: 1,
          selectArr: [],
          header: {
            left: [
              {
                type: "buttonGroup",
                data: [
                  { text: "查询", icon: "icon-chaxun", func: "searchShows" },
                  {
                    text: "下载",
                    icon: "icon-wenjian",
                    func: "download",
                    isSelect: true
                  },
                  {
                    text: "分享",
                    icon: "icon-fenxiang",
                    func: "shareShows",
                    isSelect: true
                  }
                ]
              },
              {
                type: "selectWith",
                tag: "create_time_end",
                select: {
                  value: 0,
                  holder: "",
                  options: [
                    { label: "年", value: 0 },
                    { label: "月", value: 1 },
                    { label: "日", value: 2 }
                  ]
                },
                date: {
                  type: ["year", "month", "date"]
                },
                value: ""
              },
              {
                type: "inputSearch",
                holder: "请输入文档名称关键词搜索",
                value: "",
                tag: "dim_doc_name"
              },
              {
                type: "slot",
                color: "success",
                slotName: "but"
              }
            ],
            right: [
              {
                type: "buttonGroup",
                data: [
                  { icon: "icon-xingzhuang", func: "full" },
                  { icon: "icon-shuaxin", func: "getTable" },
                  { icon: "icon-lie", type: "list" }
                ]
              }
            ]
          },
          main: {
            head: [
              { type: "index", title: "#" },
              { type: "link", keys: "doc_nam", title: "文档名称", func: "seek", width: 220 },
              { type: "text", keys: "type", title: "文件类型" },
              { type: "text", keys: "version", title: "版本号" },
              { type: "text", keys: "doc_num", title: "文件编号" },
              { type: "text", keys: "size", title: "文件大小" },
              {
                type: "icon",
                keys: "format",
                title: "文件格式",
                rules: {
                  ".pptx": {
                    icon: "icon-ppt",
                    color: "#F2353C"
                  },
                  ".ppt": {
                    icon: "icon-ppt",
                    color: "#F2353C"
                  },
                  ".doc": {
                    icon: "icon-Word",
                    color: "#1A85E4"
                  },
                  ".docx": {
                    icon: "icon-Word",
                    color: "#1A85E4"
                  },
                  ".xlsx": {
                    icon: "icon-excel",
                    color: "#18CC72"
                  },
                  ".xls": {
                    icon: "icon-excel",
                    color: "#18CC72"
                  },
                  ".pdf": {
                    icon: "icon-pdf1",
                    color: "orange"
                  }
                }
              },
              { type: "text", keys: "remark", title: "备注" },
              { type: "text", keys: "nam", title: "创建人" },
              { type: "text", keys: "cr_time", title: "创建时间", sort: true, width: 160 },
              { type: "text", keys: "push_time", title: "发布时间", sort: true, width: 160 },
              { type: "text", keys: "look_time", title: "最近查看时间", width: 160 },
              {
                type: "text",
                keys: "doc_expir",
                title: "文档有效期",
                width: 160,
              },
              {
                type: "slot",
                keys: "status",
                title: "文档状态",
                slotName: "status"
              }
              // {type: 'tags', keys: 'status', title: '文档状态', options: {
              //   1: {color: 'warning', tip: '未发布'},
              //   2: {color: 'success', tip: '生效中'},
              //   3: {color: 'danger', tip: '已作废'},
              //   4: {color: 'warning', tip: '发布后待审核'},
              //   5: {color: 'info', tip: '失效'}
              // }}
            ],
            body: null
          },
          footer: {
            rangeValue: 20,
            holder: "",
            func: "sizeChange",
            range: [
              { label: 10, value: 10 },
              { label: 20, value: 20 }
            ]
          }
        },

        addRight: {
          addRightShow: false,
          part: "同部门"
        },
        addDocShow: false,
        // 高级搜索
        searchShow: false,
        highSearch: {
          option: [
            // { value: 'lev', label: '文件级别', disabled: false },
            { value: "doc_num", label: "文件编号", disabled: false },
            { value: "user_name", label: "创建人", disabled: false },
            { value: "create_time", label: "创建时间", disabled: false },
            { value: "push_time", label: "发布时间", disabled: false },
            { value: "version", label: "版本号", disabled: false }
          ]
        },
        // 修改文档
        editShow: false,
        belongFile: {},

        // 添加权限
        rightShow: false,
        addRightTreeData: [],

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
      };
    },
    mounted() {
      this.activeName = "1";
    },
    computed: {
      table() {
        if (this.activeName === "1") return this.table1;
        else return this.table2;
      }
    },
    methods: {
      test(data) {
        console.log(data);
      },
      initTable() {
        this.table.selectArr = [];
      },
      handlerCb(func, data, table) {
        this[func](data, table);
      },
      // 设置分页
      setPage(val) {
        if (this.activeName === "1") {
          this.$set(this.table1, "currentPage", val);
        } else {
          this.$set(this.table2, "currentPage", val);
        }
      },
      // 返回分页
      returnPage() {
        if (this.activeName === "1") {
          return this.table1.currentPage;
        } else {
          return this.table2.currentPage;
        }
      },
      currentChange(val) {
        this.setPage(val);
        this.pagereq({
          fol_id: this.fol_id,
          page: val,
          size: this.table.footer.rangeValue
        });
      },
      selectChange(val) {
        this.$set(this.table, "selectArr", val);
      },
      sizeChange(size) {
        this.table.footer.rangeValue = size;
        this.req({ size: size });
      },

      changeOrg(id) {
        this.orgid = id;
      },

      // 针对utf-8转base64
      _utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if (c > 127 && c < 2048) {
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
        const _keyStr =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
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
          output =
            output +
            _keyStr.charAt(enc1) +
            _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) +
            _keyStr.charAt(enc4);
        }
        return output;
      },
      // 对象转换成连接符字符串
      transObj(data) {
        let newData = "";
        for (var i of Object.entries(data)) {
          newData +=
            encodeURIComponent(i[0]) + "=" + encodeURIComponent(i[1]) + "&";
        }
        newData = newData.slice(0, -1);
        return newData;
      },
      returnRight(obj) {
        let arr = ["FILE_READ"];
        obj.downloads ? (arr = ["FILE_PRINT", ...arr]) : "";
        obj.edit ? (arr = ["FILE_WRITE", ...arr]) : "";
        console.log(arr);
        return arr;
      },
      // 查看文档
      async seek(data) {
        let res = await this.$request.get("/doc/get/data/", {
          params: {
            version: data.version,
            doc_id: data.doc_id,
            store_id: data.store_id
          }
        });
        if (res.code !== 0)
          return this.$message({ type: "error", message: res.msg });
        if (res.code === 0) {
          let Base64 = {
            _keyStr:
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode: function (e) {
              var t = "";
              var n, r, i, s, o, u, a;
              var f = 0;
              e = Base64._utf8_encode(e);
              while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = ((n & 3) << 4) | (r >> 4);
                u = ((r & 15) << 2) | (i >> 6);
                a = i & 63;
                if (isNaN(r)) {
                  u = a = 64;
                } else if (isNaN(i)) {
                  a = 64;
                }
                t =
                  t +
                  this._keyStr.charAt(s) +
                  this._keyStr.charAt(o) +
                  this._keyStr.charAt(u) +
                  this._keyStr.charAt(a);
              }
              return t;
            },
            decode: function (e) {
              var t = "";
              var n, r, i;
              var s, o, u, a;
              var f = 0;
              e = e.replace(/[^A-Za-z0-9+/=]/g, "");
              while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = (s << 2) | (o >> 4);
                r = ((o & 15) << 4) | (u >> 2);
                i = ((u & 3) << 6) | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                  t = t + String.fromCharCode(r);
                }
                if (a != 64) {
                  t = t + String.fromCharCode(i);
                }
              }
              t = Base64._utf8_decode(t);
              return t;
            },
            _utf8_encode: function (e) {
              e = e.replace(/rn/g, "n");
              var t = "";
              for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) {
                  t += String.fromCharCode(r);
                } else if (r > 127 && r < 2048) {
                  t += String.fromCharCode((r >> 6) | 192);
                  t += String.fromCharCode((r & 63) | 128);
                } else {
                  t += String.fromCharCode((r >> 12) | 224);
                  t += String.fromCharCode(((r >> 6) & 63) | 128);
                  t += String.fromCharCode((r & 63) | 128);
                }
              }
              return t;
            },
            _utf8_decode: function (e) {
              var t = "";
              var n = 0;
              var r = (c1 = c2 = 0);
              while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                  t += String.fromCharCode(r);
                  n++;
                } else if (r > 191 && r < 224) {
                  c2 = e.charCodeAt(n + 1);
                  t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
                  n += 2;
                } else {
                  c2 = e.charCodeAt(n + 1);
                  c3 = e.charCodeAt(n + 2);
                  t += String.fromCharCode(
                    ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
                  );
                  n += 3;
                }
              }
              return t;
            }
          };
          let docData = {
            version: data.version,
            token: qs.parse(auth.getLogInfo()).token
          };
          let rightArr = this.returnRight(res);
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
          };
          bisheng = this.encode64(JSON.stringify(bisheng));
          // window.open('http://192.168.0.36/apps/editor/openPreview?data=' + bisheng)
          // window.open('http://192.168.0.36/apps/editor/openEditor?data=' + bisheng)
          let life = await this.$request.get("/doc/get/life/", {
            params: {
              version: data.version,
              doc_id: data.doc_id,
              type: 1
            }
          });
          let lifeData = {
            lifeData: life.data
          };
          let obj = Object.assign(
            res.data,
            data,
            {
              url: "http://192.168.0.36/apps/editor/openPreview?data=" + bisheng
            },
            lifeData
          );
          await auth.setDoc(obj);
          this.$router.push("/seek?date=" + new Date().getTime());
        }
      },
      // 请求
      async req(query) {
        let obj = Object.assign(
          this.searchMerge(),
          { size: this.table.footer.rangeValue },
          query
        );
        this.table.loading = true;
        let url = "/doc/fremyhistories/";
        if (this.activeName === "1") url = "/doc/fremyhistories/";
        else if (this.activeName === "2") url = "/doc/myhistories/";
        let data = await this.$request.get(url, {
          params: obj
        });
        const footer = this.table.footer;
        this.table.footer = false;
        this.$nextTick(() => {
          this.table.footer = footer;
        });
        this.setPage(1);
        this.table.loading = false;
        this.table.pagesize = data.data.page_size;
        this.table.total = data.data.total;
        this.table.pageindex = data.data.page_index;
        this.$set(this.table.main, "body", data.data.data_list);
        this.initTable();
      },
      async pagereq(query) {
        let obj = Object.assign(
          this.searchMerge(),
          { size: this.table.footer.rangeValue },
          query
        );
        this.table.loading = true;
        let url = "/doc/fremyhistories/";
        if (this.activeName === "1") url = "/doc/fremyhistories/";
        else if (this.activeName === "2") url = "/doc/myhistories/";
        let data = await this.$request.get(url, {
          params: obj
        });
        this.table.loading = false;
        this.table.pagesize = data.data.page_size;
        this.table.total = data.data.total;
        this.table.pageindex = data.data.page_index;
        // this.table.main.body = data.data.data_list
        this.$set(this.table.main, "body", data.data.data_list);
        this.initTable();
      },
      async departmentReq() {
        let data = await this.$request.get("/doc/departfolder/");
        this.addRightTreeData = [data.data];
      },

      // 添加文档
      addDocShows() {
        this.addDocShow = true;
      },
      closeAddDoc() {
        this.addDocShow = false;
      },

      // 高级查询
      searchShows() {
        this.searchShow = true;
      },
      closeSearch() {
        this.searchShow = false;
      },

      closeEditDoc() {
        this.editShow = false;
      },
      // 修改文档
      editDocShows() {
        if (this.table.selectArr.length === 0)
          return this.$message({
            message: "请选择需要修改的文档",
            type: "warning"
          });
        if (this.table.selectArr.length > 1)
          return this.$message({
            message: "仅支持单份文档选择修改",
            type: "warning"
          });
        // this.table.selectArr.length[0].fol_id

        this.editShow = true;
      },
      closeEdit() {
        this.editShow = false;
      },
      flatten(arr) {
        arr.forEach(item => {
          if (item.children) {
            this.flatArr.push(item);
            return this.flatten(item.children);
          }
          this.flatArr.push(item);
        });
      },

      // 权限设置
      rightShows() {
        if (this.table.selectArr.length === 0)
          return this.$message({
            message: "请选择需要设置权限的文档",
            type: "warning"
          });
        this.rightShow = true;
      },
      closeRight() {
        this.rightShow = false;
      },
      closeTag(index) {
        this.table.selectArr.splice(index, 1);
      },

      // 发布文档
      publishShows() {
        if (this.table.selectArr.length === 0)
          return this.$message({
            message: "请选择需要发布的文档",
            type: "warning"
          });
        this.publishShow = true;
      },
      closePublish() {
        this.publishShow = false;
      },

      // 更新版本
      versionShows() {
        if (this.table.selectArr.length === 0)
          return this.$message({
            message: "请选择需要更新的文档",
            type: "warning"
          });
        if (this.table.selectArr.length > 1)
          return this.$message({
            message: "单次操作仅支持对单份文档进行更新呢",
            type: "warning"
          });
        this.flatten(this.addDocTreeData);
        console.log(this.table.selectArr[0]);
        let obj = this.flatArr.filter(item => {
          return item.fol_id === this.table.selectArr[0].fol_id;
        });
        this.belongFile = obj[0];
        console.log(this.flatArr, obj, this.belongFile);
        this.versionShow = true;
      },
      closeVersion() {
        this.versionShow = false;
        this.getTable({ page: this.table.currentPage });
      },

      // 下载
      download() {
        if (this.table.selectArr.length === 0)
          return this.$message({
            message: "请选择需要下载的文档",
            type: "warning"
          });
        this.table.selectArr.length === 1 ? this.oneFile() : this.mulFile();
      },
      oneFile() {
        let obj = {
          doc_id: this.table.selectArr[0].doc_id,
          version: this.table.selectArr[0].version,
          doc_nam: this.table.selectArr[0].doc_nam,
          store_id: this.table.selectArr[0].store_id
        };
        this.$request.post("/doc/downloads/", obj).then(data => {
          if (data.msg !== "成功") return this.$message({ type: 'error', message: data.msg })
          this.downloading(data.data);
        });
      },
      async mulFile() {
        let arr = [];
        let formData = new FormData();
        this.table.selectArr.forEach(item => {
          let obj = {
            doc_id: item.doc_id,
            version: item.version,
            doc_nam: item.doc_nam,
            store_id: item.store_id
          };
          arr.push(obj);
        });
        const data = await this.$request.post(
          "/doc/downloads/",
          { data_list: arr },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        if (data.msg !== "成功") return;
        this.downloading(data.data);
      },
      downloading(data) {
        data.forEach(item => {
          let a = document.createElement("a");
          a.href = item.data;
          a.download = "";
          a.target = "_blank";
          a.click();
        });
      },

      // 作废
      cancelShows() {
        if (this.table.selectArr.length === 0)
          return this.$message({
            message: "请选择需要作废的文档",
            type: "warning"
          });
        if (this.table.selectArr.length > 1)
          return this.$message({
            message: "单次操作仅支持对单份文档进行作废呢",
            type: "warning"
          });
        this.cancelShow = true;
      },
      closeCancel() {
        this.cancelShow = false;
      },
      cancelReq(data) {
        this.$request.post("/doc/cancellation/", data).then(res => {
          if (res.msg !== "成功")
            return this.$message({ type: "error", message: res.msg });
          this.closeCancel();
          this.getTable({ page: this.table.currentPage });
        });
      },

      // 分享
      async shareShows() {
        if (this.table.selectArr.length === 0)
          return this.$message({
            message: "请选择需要分享的文档",
            type: "warning"
          });
        if (this.table.selectArr.length > 1)
          return this.$message({
            message: "单次操作仅支持对单份文档进行分享呢",
            type: "warning"
          });
        let res = await this.$request.get('/doc/share/', {
          params: {
            doc_id: this.table.selectArr[0].doc_id,
            version: this.table.selectArr[0].version
          }
        })
        if (res.code !== 0) return this.$message({ message: res.msg, type: 'error' })
        this.shareShow = true;
      },
      closeShare(act) {
        this.shareShow = false;
        if (act) this.getTable({ page: this.table.currentPage });
      },

      // 文件夹变动
      fileChangeShows() {
        this.fileShow = true;
      },
      closeFileChange() {
        this.fileShow = false;
      },
      edit(data) {
        this.target = data;
        this.editFileShow = true;
      },
      closeEdit() {
        this.editFileShow = false;
        this.target = [];
      },
      del(data) {
        let obj = {
          fol_id: data.fol_id,
          token: auth.getToken()
        };
        this.$alert("删除文件夹将同步删除文件夹内文件，请谨慎操作！", {
          confirmButtonText: "确定",
          callback: () => {
            this.$request.delete("/doc/docufolder/", { params: obj });
            this.init();
          }
        });
      },

      async getTable({ page = 1 } = {}) {
        let obj = Object.assign(this.searchMerge(), {
          size: this.table.footer.rangeValue
        });
        obj.page = page;
        if (page === 1) {
          this.setPage(1);
        }
        this.table.loading = true;
        try {
          let url = "/doc/fremyhistories/";
          if (this.activeName === "1") url = "/doc/fremyhistories/";
          else if (this.activeName === "2") url = "/doc/myhistories/";
          const data = await this.$request.get(url, { params: obj });
          this.table.loading = false;
          if (data.code !== 0)
            return this.$message({ type: "error", message: data.msg });
          this.table.main.body = data.data.data_list;
          this.table.pagesize = data.data.page_size;
          this.table.total = data.data.total;
          this.table.pageindex = data.data.page_index;
        } catch (error) {
          this.table.loading = false;
        }
      },
      async init() {
        this.getTable();
        this.departmentReq();
      },
      async getTree() {
        this.treeShow = false;
        const tData = await this.$request.get("/doc/docufolder/");
        this.addDocTreeData = tData.data;
        this.$nextTick(() => (this.treeShow = true));
      },
      formatTen(num) {
        return num > 9 ? num + "" : "0" + num;
      },
      timeDormat(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return (
          year +
          "-" +
          this.formatTen(month) +
          "-" +
          this.formatTen(day) +
          " " +
          this.formatTen(hour) +
          ":" +
          this.formatTen(minute) +
          ":" +
          this.formatTen(second)
        );
      },

      full() {
        this.isFullScreen() ? screenfull.exit() : screenfull.request();
      },
      isFullScreen() {
        return (
          document.isFullScreen ||
          document.mozIsFullScreen ||
          document.webkitIsFullScreen
        );
      },

      // 搜索整合
      formatTen(num) {
        return num > 9 ? num + "" : "0" + num;
      },
      timeDormat(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return (
          year +
          "-" +
          this.formatTen(month) +
          "-" +
          this.formatTen(day) +
          " " +
          this.formatTen(hour) +
          ":" +
          this.formatTen(minute) +
          ":" +
          this.formatTen(second)
        );
      },
      searchMerge() {
        let obj = {};
        this.table.header.left[1].value !== '' && this.table.header.left[1].value !== null ? (obj.create_time_from = this.table.header.left[1].value[0]) && (obj.create_time_end = this.table.header.left[1].value[1]) : (obj.create_time_from = '') && (obj.create_time_end = '')
        obj.dim_doc_name = this.table.header.left[2].value;
        obj.fol_id = 0;
        return Object.assign(obj, this.highSearchOption);
      },
      clearMerge() {
        this.highSearchOption = {}
        this.getTable({ page: this.table.currentPage })
      },
      mergeHigh(query, act = true) {
        this.highSearchOption = query;
        if (act) this.getTable();
      },
      docSearch(val) {
        this.getTable();
      },
      tabClick() {
        this.setPage(val);
        this.getTable({ page: this.returnPage() });
      },
      async cancelShows() {
        if (this.table.selectArr.length === 0)
          return this.$message({
            message: "请选择需要取消分享的文档",
            type: "warning"
          });
        let data_list = [];
        this.table.selectArr.forEach(item => {
          let obj = {};
          obj.doc_id = item.doc_id;
          obj.version = item.version;
          obj.share_time = item.share_time;
          obj.by_uid = item.by_uid;
          data_list.push(obj);
        });
        const data = await this.$request.post("/doc/myshare/", {
          data_list: data_list
        });
        if (data.code === 0) {
          this.$message({ type: "success", message: data.msg });
          this.getTable();
        } else {
          this.$message({ type: "error", message: data.msg });
        }
      }
    },

    async created() {
      this.init();
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
    padding: 50px 0 0px;
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