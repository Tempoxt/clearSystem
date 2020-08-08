<template>
  <el-row class="h-full public-table-container">
    <el-col :span="4" class="h-full">
      <div class=" h-full">
        <org v-if="treeShow" :option="treeOption" :operate="true" v-model="orgid" @handlerCb="handlerCb">
          <template #treeSlot="{data}">
            <div>
              <i v-if="data.node" class="icon iconfont icon-wenjian1"></i>
              &nbsp;
              <span>{{ data.node.label }}</span>
            </div>
            <div>
              <template v-if="data.option.treeData.operate.length && data.data.lock === 0">
                <i v-for="(item, i) in data.option.treeData.operate" :key="i" class="icon iconfont  tree_operate"
                  :class="[item.icon]" @click.stop="handlerCb(item.func, data.data)"></i>
              </template>
            </div>
          </template>
        </org>
      </div>
    </el-col>
    <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232); height: 100%">
      <employeeTable v-if="treeOption.treeData.data" :table="table" @handlerCb="handlerCb" @selectChange="selectChange"
        @currentChange="currentChange" @search="docSearch">
        <template #status="{scope}">
          <span v-if="scope.row.status === '未生效'" style="color: #FF8000">{{scope.row.status}}</span>
          <span v-if="scope.row.status === '已作废'" style="color: #F2353C">{{scope.row.status}}</span>
          <span v-if="scope.row.status === '失效'" style="color: #A3AFB7">{{scope.row.status}}</span>
          <span v-if="scope.row.status === '生效中'" style="color: #18CC72">{{scope.row.status}}</span>
        </template>
      </employeeTable>

      <!--  && addDocTreeData.length -->
      <add-doc v-if="addDocShow" :show="addDocShow" :treeOption="addDocTreeData" :selectFile="selectFile"
        @closeAddDoc="closeAddDoc" @req="getTable"></add-doc>

      <high :show="searchShow" :selectGroup="highSearch" @req="mergeHigh" @closeDia="closeSearch"></high>

      <edit-doc v-if="addDocTreeData.length > 0 && editShow" :show="editShow" :treeOption="addDocTreeData"
        :docData="table.selectArr" :selectFile="selectFile" @close="closeEditDoc" @req="req"></edit-doc>

      <right v-if="addRightTreeData.length && rightShow" :show="rightShow" :treeData="addRightTreeData"
        :tagData="table.selectArr" @closeRight="closeRight" @closeTag="closeTag"></right>

      <publish v-if="publishShow" :show="publishShow" :selectArr="table.selectArr" :treeData="addRightTreeData" @closePublish="closePublish"
        @req="getTable({page: currentPage})" />

      <version v-if="versionShow" :show="versionShow" :selectArr="table.selectArr" :belongFile="belongFile"
        @close="closeVersion"></version>

      <invalid v-if="cancelShow" :show="cancelShow" :data="table.selectArr[0]" @req="cancelReq" @close="closeCancel">
      </invalid>
      <share v-if="shareShow && addDocTreeData.length" :show="shareShow" :treeData="addRightTreeData"
        :doc="table.selectArr[0]" @close="closeShare" />

      <file-change v-if="addDocTreeData.length && fileShow" :data="addDocTreeData" :show="fileShow"
        @close="closeFileChange" @init="getTree" />

      <edit-file v-if="addDocTreeData.length && editFileShow" :show="editFileShow" :data="addDocTreeData"
        :target="target" :belong="belongFile" @close="closeEdit" @init="getTree" />
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
  import org from '@/components/public/org'
  import employeeTable from '@/components/public/employeeTable'
  import addDoc from '@/components/public/addDoc'
  import high from '@/components/public/hightSearch'
  import editDoc from '@/components/public/editDoc'
  import right from '@/components/public/right'
  import publish from '@/components/public/publish'
  import share from '@/components/public/share'
  import version from '@/components/public/version'
  import invalid from '@/components/public/invalid'
  import fileChange from '@/components/public/fileChange'
  import editFile from '@/components/public/editFile'
  import axios from 'axios'

  export default {
    name: 'create',
    // mixins: [table_mixin],
    components: {
      employeeTable,
      org,
      addDoc,
      high,
      editDoc,
      right,
      publish,
      share,
      version,
      invalid,
      fileChange,
      editFile
    },
    data() {
      return {
        // view_activeName:'',
        // menu:[],
        flatArr: [], // 扁平化树
        searchOption: {},
        highSearchOption: {},
        selectFile: {},
        activeName: 'first',
        orgid: 0,
        treeShow: true,
        currentPage: 1,
        //主页表格
        table: {
          check: true,
          size: 'mini',
          loading: false,
          total: 0,
          currentPage: 1,
          selectArr: [],
          header: {
            left: [{
              type: 'buttonGroup',
              data: [{
                text: '添加',
                icon: 'icon-tianjia',
                func: 'addDocShows'
              },
              {
                text: '更版',
                icon: 'icon-banben',
                func: 'versionShows',
                isSelect: true
              },
              {
                text: '查询',
                icon: 'icon-chaxun',
                func: 'searchShows'
              },
              {
                text: '修改',
                icon: 'icon-bianji',
                func: 'editDocShows',
                isSelect: true
              },
              {
                text: '下载',
                icon: 'icon-wenjian',
                func: 'download',
                isSelect: true
              },
              {
                text: '权限',
                icon: 'icon-quanxian',
                func: 'rightShows',
                isSelect: true
              },
              {
                text: '发布',
                icon: 'icon-wenjian',
                func: 'publishShows',
                isSelect: true
              },
              {
                text: '作废',
                icon: 'icon-zuofei1',
                func: 'cancelShows',
                isSelect: true
              },
              {
                text: "分享",
                icon: "icon-fenxiang",
                func: "shareShows",
                isSelect: true,
              }
                // { text: '分享', icon: 'icon-fenxiang', func: 'shareShows' }
              ]
            },
            {
              type: 'selectWith',
              tag: 'create_time_end',
              select: {
                value: 0,
                holder: '',
                options: [{
                  label: '年',
                  value: 0
                },
                {
                  label: '月',
                  value: 1
                },
                {
                  label: '日',
                  value: 2
                }
                ]
              },
              date: {
                type: ['year', 'month', 'date']
              },
              value: ''
            },

            {
              type: 'slot',
              color: 'success',
              slotName: 'but'
            }
            ],
            right: [{
              type: 'inputSearch',
              holder: '请输入文档名称关键词搜索',
              value: '',
              tag: 'dim_doc_name'
            },
            {
              type: 'buttonGroup',
              data: [{
                icon: 'icon-xingzhuang',
                func: 'full'
              },
              {
                icon: 'icon-shuaxin',
                func: 'getTable'
              },
              {
                icon: 'icon-lie',
                type: 'list'
              }
              ]
            },
            ]
          },
          main: {
            head: [{
              type: 'index',
              title: '#',
              fixed: true,
            },
            {
              type: 'link',
              keys: 'doc_nam',
              title: '文档名称',
              func: 'seek',
              width: 220,
              fixed: true,
            },
            {
              type: 'text',
              keys: 'version',
              title: '版本号'
            },
            {
              type: 'text',
              keys: 'lev',
              title: '文件级别'
            },
            { type: "text", keys: "doc_route", title: "文件夹", width: 160 },
            {
              type: 'text',
              keys: 'doc_num',
              title: '文件编号'
            },
            {
              type: 'text',
              keys: 'size',
              title: '文件大小'
            },
            {
              type: 'icon',
              keys: 'format',
              title: '文件格式',
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
            {
              type: 'text',
              keys: 'remark',
              title: '备注',
              width: 160,
            },
            {
              type: 'text',
              keys: 'control',
              title: '受控级别'
            },
            {
              type: 'text',
              keys: 'nam',
              title: '创建人'
            },
            {
              type: 'text',
              keys: 'cr_time',
              title: '创建时间',
              sort: true
            },
            {
              type: 'text',
              keys: 'push_time',
              title: '发布时间',
              sort: true
            },
            {
              type: "text",
              keys: "doc_expir",
              title: "文档有效期",
              width: 160,
            },
            {
              type: 'slot',
              keys: 'status',
              title: '文档状态',
              slotName: 'status'
            },
            {
              type: 'tag',
              keys: 'audit',
              title: '审核状态'
            }
            ],
            body: null,

          },
          footer: {
            rangeValue: 20,
            holder: '',
            func: 'sizeChange',
            range: [{
              label: 10,
              value: 10
            },
            {
              label: 20,
              value: 20
            }
            ]
          }
        },

        // 主页树
        fol_id: 0,
        treeOption: {
          show: true,
          showSearch: true,
          search: {
            text: '',
            add: {
              func: 'fileChangeShows'
            }
          },
          treeData: {
            data: [],
            mainIconRules: [],
            operate: [{
              icon: 'icon-lajitong',
              func: 'del'
            },
            {
              icon: 'icon-bianji',
              func: 'edit'
            }
            ],
            expandedArr: [0], //默认展开
            treeProps: {
              children: 'children',
              label: 'fol_nam'
            },
            defaultKey: 0,
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
                this.currentPage = 1
                this.fol_id = val.fol_id
                this.req({
                  fol_id: val.fol_id
                })
                this.selectFile = val
              }
            })(),
            // nodeClick(val,node) {
            //   if (val['p1'] !== 0) {
            //     this.req({fol_id: val.fol_id})
            //   }
            //   console.log(val, node)

            // },
            expandOnClick: false
          }
        },

        addRight: {
          addRightShow: false,
          part: '同部门'
        },
        addDocShow: false,
        // dia添加文档表格
        // addDocTab: {
        //   check: true,
        //   size: 'mini',
        //   loading: false,
        //   total: 0,
        //   pagesize: 1,
        //   pageindex: 1,
        //   header: {
        //     left: [
        //         {
        //           type: 'buttonGroup',
        //           data: [
        //               { text: '添加', icon: 'icon-wenjian', func: 'cons' },
        //               { text: '更版', icon: 'icon-wenjian', func: 'cons' },
        //               { text: '查询', icon: 'icon-wenjian', func: 'cons' },
        //               { text: '修改', icon: 'icon-wenjian', func: 'cons' },
        //               { text: '下载', icon: 'icon-wenjian', func: 'cons' },
        //               { text: '权限', icon: 'icon-wenjian', func: 'cons' },
        //               { text: '发布', icon: 'icon-wenjian', func: 'cons' },
        //               { text: '作废', icon: 'icon-wenjian', func: 'cons' },
        //               { text: '分享', icon: 'icon-wenjian', func: 'cons' }
        //           ]
        //         },
        //         {
        //           type: 'selectWith',
        //           select: {
        //               value: 0,
        //               holder: '',
        //               func: 'cos',
        //               options: [
        //                   { label: '年', value: 0 },
        //                   { label: '月', value: 1 },
        //                   { label: '日', value: 2 }
        //               ]
        //             },
        //             date: {
        //               func: 'cos',
        //               value: null,
        //               type: ['year', 'month', 'dates']
        //             }
        //         },
        //         {
        //           type: 'slot',
        //           color: 'success',
        //           slotName: 'but'
        //         }
        //     ],
        //     right: [
        //         {
        //           type: 'buttonGroup',
        //           data: [
        //               {  icon: 'icon-wenjian', func: 'cons' },
        //               {  icon: 'icon-wenjian', func: 'cons' },
        //               {  icon: 'icon-wenjian', func: 'cons' },
        //           ]
        //         },
        //     ]
        //   },
        //   main: {
        //     head: [
        //       {type: 'index', title: '#'},
        //       {type: 'link', keys: 'doc_nam', title: '文档名称', func: 'cons'},
        //       {type: 'text', keys: 'version', title: '版本号'},
        //       {type: 'text', keys: 'lev', title: '文档级别'},
        //       {type: 'text', keys: 'doc_num', title: '文件编号'},
        //       {type: 'text', keys: 'size', title: '文件大小'},
        //       // {type: 'icon', keys: 'format', title: '文件格式',
        //       //   rules: {
        //       //     '.jpg': {
        //       //       icon: 'icon-ppt',
        //       //       color: '#F2353C'
        //       //     },
        //       //     '.ppt': {
        //       //       icon: 'icon-ppt',
        //       //       color: '#F2353C'
        //       //     },
        //       //     '.doc': {
        //       //       icon: 'icon-Word',
        //       //       color: '#0BB2D4'
        //       //     },
        //       //     '.py': {
        //       //       icon: 'icon-Word',
        //       //       color: '#0BB2D4'
        //       //     },
        //       //     '.pdf': {
        //       //       icon: 'icon-Word',
        //       //       color: '#0BB2D4'
        //       //     }
        //       //   }
        //       // },
        //       {type: 'text', keys: 'remark', title: '备注'},
        //       {type: 'text', keys: 'control', title: '受控级别'},
        //       {type: 'text', keys: 'nam', title: '创建人'},
        //       {type: 'text', keys: 'cr_time', title: '创建时间'},
        //       {type: 'text', keys: 'push_time', title: '发布时间'},
        //       {type: 'slot', keys: 'status', title: '文档状态',slotName: 'status'},
        //       {type: 'tag', keys: 'audit', title: '审核状态'}
        //     ],
        //     body: null,

        //   },
        //   footer: {
        //     rangeValue: '',
        //     holder: '',
        //     func: 'cons',
        //     range: [
        //       { label: 10, value: '10' },
        //       { label: 20, value: '20' },
        //       { label: 30, value: '30' }
        //     ]
        //   }
        // },
        // 高级搜索
        searchShow: false,
        highSearch: {
          option: [{
            value: 'lev',
            label: '文件级别',
            disabled: false
          },
          {
            value: 'doc_num',
            label: '文件编号',
            disabled: false
          },
          {
            value: 'create_time',
            label: '创建时间',
            disabled: false
          },
          {
            value: 'push_time',
            label: '发布时间',
            disabled: false
          },
          {
            value: 'version',
            label: '版本号',
            disabled: false
          }
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
      }

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
        this.pagereq({
          fol_id: this.fol_id,
          page: val,
          size: this.table.footer.rangeValue
        })
      },
      selectChange(val) {
        this.$set(this.table, 'selectArr', val)
        // this.table.selectArr = val
        console.log(this.table.selectArr)
      },
      sizeChange(size) {
        this.table.footer.rangeValue = size
        this.req({
          size: size
        })
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
        if (res.code !== 0) return this.$message({
          type: 'error',
          message: res.msg
        })
        if (res.code === 0) {
          console.log(qs.parse(auth.getLogInfo()))
          let Base64 = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
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
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                  u = a = 64
                } else if (isNaN(i)) {
                  a = 64
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(
                  a)
              }
              return t
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
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                  t = t + String.fromCharCode(r)
                }
                if (a != 64) {
                  t = t + String.fromCharCode(i)
                }
              }
              t = Base64._utf8_decode(t);
              return t
            },
            _utf8_encode: function (e) {
              e = e.replace(/rn/g, "n");
              var t = "";
              for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) {
                  t += String.fromCharCode(r)
                } else if (r > 127 && r < 2048) {
                  t += String.fromCharCode(r >> 6 | 192);
                  t += String.fromCharCode(r & 63 | 128)
                } else {
                  t += String.fromCharCode(r >> 12 | 224);
                  t += String.fromCharCode(r >> 6 & 63 | 128);
                  t += String.fromCharCode(r & 63 | 128)
                }
              }
              return t
            },
            _utf8_decode: function (e) {
              var t = "";
              var n = 0;
              var r = c1 = c2 = 0;
              while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                  t += String.fromCharCode(r);
                  n++
                } else if (r > 191 && r < 224) {
                  c2 = e.charCodeAt(n + 1);
                  t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                  n += 2
                } else {
                  c2 = e.charCodeAt(n + 1);
                  c3 = e.charCodeAt(n + 2);
                  t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                  n += 3
                }
              }
              return t
            }
          }
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
          let obj = Object.assign(res.data, data, {
            url: 'http://192.168.0.36/apps/editor/openPreview?data=' + bisheng
          }, lifeData)
          await auth.setDoc(obj)
          this.$router.push('/seek?date=' + new Date().getTime())
        }
      },
      // 请求
      async req(query) {
        let obj = Object.assign(this.searchMerge(), {
          size: this.table.footer.rangeValue
        }, query)
        this.table.loading = true
        let data = await this.$request.get('/doc/credocushow/', {
          params: obj
        })
        const footer = this.table.footer
        this.table.footer = false
        this.$nextTick(() => {
          this.table.footer = footer
        })
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
      async pagereq(query) {
        let obj = Object.assign(this.searchMerge(), {
          size: this.table.footer.rangeValue
        }, query)
        this.table.loading = true
        let data = await this.$request.get('/doc/credocushow/', {
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

      // 添加文档
      addDocShows() {
        this.addDocShow = true
      },
      closeAddDoc() {
        this.addDocShow = false
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
        if (this.table.selectArr.length === 0) return this.$message({
          message: '请选择需要修改的文档',
          type: 'warning'
        })
        if (this.table.selectArr.length > 1) return this.$message({
          message: '仅支持单份文档选择修改',
          type: 'warning'
        })
        // this.table.selectArr.length[0].fol_id

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
        if (this.table.selectArr.length === 0) return this.$message({
          message: '请选择需要设置权限的文档',
          type: 'warning'
        })
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
        if (this.table.selectArr.length === 0) return this.$message({
          message: '请选择需要发布的文档',
          type: 'warning'
        })
        this.publishShow = true
      },
      closePublish() {
        this.publishShow = false
      },

      // 更新版本
      versionShows() {
        if (this.table.selectArr.length === 0) return this.$message({
          message: '请选择需要更新的文档',
          type: 'warning'
        })
        if (this.table.selectArr.length > 1) return this.$message({
          message: '单次操作仅支持对单份文档进行更新呢',
          type: 'warning'
        })
        this.flatten(this.addDocTreeData)
        console.log(this.table.selectArr[0])
        let obj = this.flatArr.filter(item => {
          return item.fol_id === this.table.selectArr[0].fol_id
        })
        this.belongFile = obj[0]
        console.log(this.flatArr, obj, this.belongFile)
        this.versionShow = true
      },
      closeVersion(act) {
        this.versionShow = false
        if (act) this.getTable({
          page: this.currentPage
        })
      },

      // 下载
      download() {
        if (this.table.selectArr.length === 0) return this.$message({
          message: '请选择需要下载的文档',
          type: 'warning'
        })
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
          if (data.msg !== '成功') return this.$message({
            type: 'error',
            message: data.msg
          })
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
        const data = await this.$request.post('/doc/downloads/', {
          data_list: arr
        }, {
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

      // 作废
      cancelShows() {
        if (this.table.selectArr.length === 0) return this.$message({
          message: '请选择需要作废的文档',
          type: 'warning'
        })
        if (this.table.selectArr.length > 1) return this.$message({
          message: '单次操作仅支持对单份文档进行作废呢',
          type: 'warning'
        })
        this.cancelShow = true
      },
      closeCancel() {
        this.cancelShow = false
      },
      cancelReq(data) {
        this.$request.post('/doc/cancellation/', data).then(res => {
          console.log(res)
          if (res.msg !== "成功") return this.$message({
            type: 'error',
            message: res.msg
          })
          this.closeCancel()
          this.getTable({
            page: this.currentPage
          })
        })
      },

      // 分享
      shareShows() {
        if (this.table.selectArr.length === 0) return this.$message({
          message: '请选择需要分享的文档',
          type: 'warning'
        })
        if (this.table.selectArr.length > 1) return this.$message({
          message: '单次操作仅支持对单份文档进行分享呢',
          type: 'warning'
        })
        this.shareShow = true
      },
      closeShare(act) {
        this.shareShow = false
        if (act) this.getTable({
          page: this.currentPage
        })
      },

      // 文件夹变动
      fileChangeShows() {
        console.log(432)
        this.fileShow = true
        console.log(this.fileShow)
      },
      closeFileChange() {
        this.fileShow = false
      },
      edit(data) {
        this.target = data
        this.flatten(this.addDocTreeData)
        let obj = this.flatArr.filter(item => {
          return item.fol_id === data.p1
        })
        this.belongFile = obj[0]
        this.editFileShow = true
      },
      closeEdit() {
        this.editFileShow = false
        this.target = []
      },
      del(data) {
        let obj = {
          fol_id: data.fol_id,
          token: auth.getToken()
        }
        this.$alert('删除文件夹将同步删除文件夹内文件，请谨慎操作！', {
          confirmButtonText: '确定',
          callback: (action) => {
            if (action === 'confirm') {
              this.$request.delete('/doc/docufolder/', {
                params: obj
              }).then(data => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: data.msg
                  })
                  this.init()
                } else {
                  this.$message({
                    type: 'error',
                    message: data.msg
                  })
                }
              })
            }
          }
        })

      },

      async getTable({
        page = 1
      } = {}) {
        let obj = Object.assign(this.searchMerge(), {
          size: this.table.footer.rangeValue
        })
        obj.page = page
        if (page === 1) {
          const footer = this.table.footer
          this.table.footer = false
          this.$nextTick(() => {
            this.table.footer = footer
          })
        }
        this.table.loading = true
        try {
          const data = await this.$request.get('/doc/credocushow/', {
            params: obj
          })
          this.table.loading = false
          this.table.main.body = data.data.data_list
          this.table.pagesize = data.data.page_size
          this.table.total = data.data.total
          this.table.pageindex = data.data.page_index
        } catch (error) {
          this.table.loading = false
          console.log(error)
        }

      },
      async init() {
        this.getTree()
        this.getTable()
        this.departmentReq()
      },
      async getTree() {
        this.treeShow = false
        const tData = await this.$request.get('/doc/docufolder/', {
          params: {
            nosys: 0
          }
        })
        this.addDocTreeData = this.treeOption.treeData.data = tData.data
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
        return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + " " + this.formatTen(hour) + ":" + this
          .formatTen(minute) + ":" + this.formatTen(second)
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
        return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + " " + this.formatTen(hour) + ":" + this
          .formatTen(minute) + ":" + this.formatTen(second)
      },
      searchMerge() {
        let obj = {}
        this.table.header.left[1].value !== '' && this.table.header.left[1].value !== null ? (obj.create_time_from =
          this.table.header.left[1].value[0]) && (obj.create_time_end = this.table.header.left[1].value[1]) : (obj.create_time_from =
            '') && (obj.create_time_end = '')
        obj.dim_doc_name = this.table.header.right[0].value
        obj.page = 1
        obj.fol_id = this.fol_id
        this.$set(this.table, 'currentPage', 1)
        return Object.assign(obj, this.highSearchOption)
      },
      mergeHigh(query, act = true) {
        this.highSearchOption = query
        if (act) this.getTable()
      },
      docSearch(val) {
        this.getTable()
      }
    },

    async created() {
      this.init()
      console.log(this.addDocTreeData)
      // const { menu } = await getTabs(this.$route.query.menuid)
      // this.menu = menu
      // this.view_activeName = menu[0].name;
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