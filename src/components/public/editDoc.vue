<template>
  <el-dialog title="修改文档" :visible="show" width="60%" @close="close">
    <div class="flex justifyCenter">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="文档名称">
          <el-input v-model="form.doc_nam" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属文件夹">
              <el-popover
                placement="buttom"
                width="400"
                trigger="click">
                <org :option="addDocTree">
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
                <el-input slot="reference" v-model="form.fol_nam"></el-input>
              </el-popover>
        </el-form-item>-->
        <el-form-item label="所属文件夹">
          <el-popover placement="buttom" width="400" trigger="click">
            <el-tree
              ref="tree2"
              :data="treeOption"
              :props="optionRules"
              :node-key="nodeKey"
              highlight-current
              :default-expanded-keys="[0]"
              :filter-node-method="filterNode"
              @node-click="nodeClick"
            >
              <div class="flexBetween" slot-scope="{ node, data }">
                <div>
                  <i class="icon iconfont icon-wenjian1"></i>
                  &nbsp;
                  <span>{{data.fol_nam}}</span>
                </div>
              </div>
            </el-tree>
            <el-input slot="reference" v-model="form.fol_nam"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label>
          <el-upload
            ref="up"
            class="upload-demo mar"
            action="#"
            :limit="1"
            :auto-upload="false"
            :on-change="solveFile"
            :on-remove="remove"
            :on-exceed="handleExceed"
          >
            <!-- accept=".jpg,.jpeg,.png,.gif,.pdf,.JPG,.JPEG,.GIF,.PDF, .ppt, .doc" -->
            <!-- :before-upload="beforeUpload" -->
            <el-button size="mini">
              替换文件
              <!-- <input type="file" id="filePick" name="fileList" multiple @change="fileChange" style="height: 0; width: 0;"> -->
            </el-button>
          </el-upload>
          <el-button
            v-if="form.status === '未生效' || form.audit === '已退回'"
            type="primary"
            size="mini"
            @click="seek(docData[0])"
          >在线编辑</el-button>
        </el-form-item>

        <el-form-item label="附件资料">
          <el-upload
            ref="up"
            class="upload-demo mar"
            action="#"
            multiple
            :limit="5"
            :auto-upload="false"
            :file-list="appendixOld"
            :on-change="(file, fileList) => handleFile(file, fileList)"
            :on-remove="(file, fileList) => handleFile(file, fileList)"
            :on-exceed="() => handleExceed(5)"
          >
            <!-- accept=".jpg,.jpeg,.png,.gif,.pdf,.JPG,.JPEG,.GIF,.PDF, .ppt, .doc" -->
            <!-- :before-upload="beforeUpload" -->
            <el-button size="mini">
              添加附件
              <!-- <input type="file" id="filePick" name="fileList" multiple @change="fileChange" style="height: 0; width: 0;"> -->
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>>

<script>
import qs from "qs";
import axios from "axios";
import auth from "@/utils/auth";

export default {
  name: "editDoc",
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    treeOption: {
      type: [Array, Object],
      default: [],
    },
    docData: {
      type: Array,
      default: [],
    },
    selectFile: {
      type: Object,
      default: {},
    },
  },
  // components: {
  //   org
  // },
  async mounted() {
    const data = this.getAppendix();
    this.$nextTick(() => {
      this.form = this.docData[0];
      console.log(this.docData[0]["doc_route"].split('/'))
      // this.form.fol_nam = ((this.docData[0]["doc_route"].split('/')).splice(-1, 1))[0];
      // this.form.fol_id = this.docData["fol_id"];
      console.log(((this.docData[0]["doc_route"].split('/')).splice(-1, 1))[0])
      this.$set(this.form, "fol_nam", ((this.docData[0]["doc_route"].split('/')).splice(-1, 1))[0]);
        this.$set(this.form, "fol_id", this.docData["fol_id"]);
    });
  },
  data() {
    return {
      form: {
        doc_nam: "",
        fol_id: "",
        fol_nam: "",
      },
      optionRules: { children: "children", label: "fol_nam" },
      nodeKey: "fol_id",
      uploadData: {
        fileList: [],
      },
      appendixOld: [],
      appendixNew: [],
      appendixList: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
  },
  computed: {
    filterText: {
      get(val) {
        return this.form.fol_nam;
      },
      set(val) {
        return val;
      },
    },
  },
  methods: {
    test(data) {
      console.log(data);
    },
    init() {
      this.form = {
        doc_nam: "",
        fol_id: "",
        fol_nam: "",
      };
    },
    close() {
      this.appendixOld = [];
      this.$emit("close");
    },
    async confirm() {
      let file = new FormData();
      console.log(this.form.fol_nam);
      if (this.form.fol_nam === "" || this.form.fol_nam === undefined)
        return this.$message({ type: "warning", message: "请选择文件夹" });
      if (
        this.uploadData.fileList.length === 0 &&
        this.form.status !== "未生效" &&
        this.form.audit !== "已退回"
      )
        return this.$message({
          type: "warning",
          message: "请选择上传所需的文件",
        });
      if (this.uploadData.fileList.length !== 0) {
        file.append("files", this.uploadData.fileList[0].raw)
        file.append("new_siz", this.form.new_siz);
        file.append("new_format", this.form.new_format);
        file.append("new_nam", this.form.new_nam);
      }
      let arr = []
      this.appendixList.forEach(item => {
        if ('raw' in item) file.append('attchfiles', item.raw)
        else arr.push(item)
      })
      // 处理之前已有的附件
      if (arr.length) file.append('attach_data', JSON.stringify(arr))
      else if (this.appendixOld.length) file.append('attach_data', JSON.stringify(this.appendixOld))
      
      file.append("fol_id", this.form.fol_id);
      file.append("version", this.form.version);
      file.append("doc_id", this.form.doc_id);
      
      const res = await this.$request.post("/doc/alter/", file, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.code === 0) {
        this.$message({ type: "success", message: "修改成功" });
        this.close();
        this.$emit("req", file);
      } else {
        this.$message({ type: "error", message: res.msg });
      }
    },
    // addDocNodeClick(val, node) {
    //   if ('dep_id' in val)  {
    //       console.log(val)
    //       this.$set(this.form, 'fol_nam', val.fol_nam)
    //       this.$set(this.form, 'fol_id', val.fol_id)
    //     }
    // },
    nodeClick(data) {
      if ((data.lock === 1 && data.p1 !== 0) || data.lock === 0) {
        this.$set(this.form, "fol_nam", data.fol_nam);
        this.$set(this.form, "fol_id", data.fol_id);
      console.log(data.fol_id, data.fol_nam);
      } else if (data.p1 === 0) {
        this.$message({ type: "warning", message: "该文件夹不可被添加" });
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.fol_nam && data.fol_nam.indexOf(value) !== -1;
    },
    handleExceed() {
      return this.$message({
        type: "warning",
        message: "仅可上传一份文档",
      });
    },
    solveFile(f) {
      this.uploadData.fileList = [f];
      this.$set(
        this.form,
        "new_siz",
        this.uploadData.fileList[0].size < 1024
          ? this.uploadData.fileList[0].size + "Byte"
          : this.uploadData.fileList[0].size / 1024 < 1024
          ? (this.uploadData.fileList[0].size / 1024).toFixed(2) + "Kb"
          : this.uploadData.fileList[0].size / 1024 / 1024 < 1024
          ? (this.uploadData.fileList[0].size / 1024 / 1024).toFixed(2) + "Mb"
          : (this.uploadData.fileList[0].size / 1024 / 1024 / 1024).toFixed(2) +
            "Gb"
      );
      this.$set(
        this.form,
        "new_format",
        this.uploadData.fileList[0].name.substring(
          this.uploadData.fileList[0].name.lastIndexOf(".")
        )
      );
      this.$set(this.form, "new_nam", this.uploadData.fileList[0].name);
    },
    remove() {
      this.uploadData.fileList = [];
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
      console.log(newData);
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
          store_id: data.store_id,
        },
      });
      console.log(res);
      if (res.code !== 0)
        return this.$message({
          type: "error",
          message: res.msg,
        });
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
          },
        };
        let docData = {
          version: data.version,
          token: qs.parse(auth.getLogInfo()).token,
        };
        let rightArr = this.returnRight(res);
        console.log(res.cb);
        let bisheng = {
          doc: {
            docId: data.doc_id + "&" + data.version,
            title: data.doc_nam + data.format,
            version: data.version,
            fetchUrl: decodeURIComponent(res.data[0].data),
            callback: res.cb + "?" + this.transObj(docData),
          },
          user: {
            uid: qs.parse(auth.getLogInfo()).dep_id,
            nickName: qs.parse(auth.getLogInfo()).nam,
            avatar: "",
          },
        };
        bisheng = this.encode64(JSON.stringify(bisheng));
        // window.open('http://192.168.0.36/apps/editor/openPreview?data=' + bisheng)
        // window.open('http://192.168.0.36/apps/editor/openEditor?data=' + bisheng)
        let life = await this.$request.get("/doc/get/life/", {
          params: {
            version: data.version,
            doc_id: data.doc_id,
            type: 1,
          },
        });
        let lifeData = {
          lifeData: life.data,
        };
        let obj = Object.assign(
          res.data,
          data,
          {
            url: "http://192.168.0.36/apps/editor/openEditor?data=" + bisheng,
          },
          lifeData
        );
        await auth.setDoc(obj);
        this.close();
        this.$router.push("/seek?date=" + new Date().getTime());
      }
    },
    handleExceed(v) {
      this.$message({
        type: "warning",
        message: "最多只能上传" + v + "个附件",
      });
    },
    handleFile(file, fileList) {
      // this.handleAppendix(fileList)
      this.appendixList = fileList;
      console.log(this.appendixOld)
    },
    // handleAppendix(fileList) {
    //   this.appendixNew = fileList.filter((item, index) => {
    //     return "raw" in item === true;
    //   });
    //   this.appendixOld = fileList.filter((item, index) => {
    //     return "raw" in item === false;
    //   });
    // },
    async getAppendix() {
      let res = await this.$request.get("/doc/attachfileop/", {
        params: {
          doc_id: this.docData[0].doc_id,
          version: this.docData[0].version,
        },
      });
      res.data.forEach((item, index) => {
        res.data[index].name = item.doc_nam + item.format;
      });
      if (res.code === 0) this.appendixOld = res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__headerbtn {
  top: 14px;
}

/deep/.el-dialog__header {
  height: 50px;
  background: #fff5fafb;
  padding: 14px;
  .el-dialog__title {
    font-size: 14px;
  }
}
/deep/ .el-dialog {
  width: 700px !important;
}
/deep/ .el-form {
  width: 500px !important;
}
/deep/ .upload-demo {
  max-width: 500px !important;
}
/deep/.el-popover {
  position: fixed;
  margin-top: 38px;
  width: 300px !important;
}
.head {
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
/deep/ .el-popover {
  max-height: 400px !important;
  overflow-y: scroll;
}
</style>