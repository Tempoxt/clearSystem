<template>
  <div class="flex">
    <div class="left">
      <div class="title bottom">
        <div>
          <div class="doc_nam">文档名称：{{docData.doc_nam}}</div>
        </div>
        <div>
          <el-tag class="status" :type="color">{{status}}</el-tag>
          <el-button class="btn" type="primary" @click="lookOrigin" size="mini">查看原文档</el-button>
        </div>
        
      </div>


      <div class="tipgroup bottom">
        <span class="tip">文件编号：{{docData.doc_num}}</span>
        <span class="tip">文件级别：{{docData.lev}}</span>
        <span class="tip">版本号：{{docData.version}}</span>
        <span class="tip">创建时间： {{docData.cr_time}}</span>
        <span class="tip">发布时间： {{docData.push_time}}</span>
        <span class="tip">备注： {{docData.remark}}</span>
        <span class="tip">创建人： {{docData.nam}}</span>
      </div>

       <!-- :class="[full? 'fullScreen' : '']"-->
      <div class="doc" :class="[full? 'fullScreen' : '']">
        <div class="doc-tool">
          <span>文档系统</span>
          <!-- <span>1/8</span> -->
          <span>
            <i class="operator icon iconfont" :class="[full? 'icon-xiaoping' : 'icon-quanping']" @click="fullScreen"></i>
            <i class="operator icon iconfont icon-shuaxin" @click="refresh"></i>
            <i class="operator icon iconfont icon-xiazai" @click="download"></i>
          </span>
        </div>
        <!-- <div class="doc-main" @scroll="scroll">
          <div class="doc-main_wrap">
            <img src="../../assets/imgs/company.png" :width="sizeObj[size].width" :height="sizeObj[size].height" alt="">
            <img src="../../assets/imgs/company.png" :width="sizeObj[size].width" :height="sizeObj[size].height" alt="">
            <img src="../../assets/imgs/company.png" :width="sizeObj[size].width" :height="sizeObj[size].height" alt="">

          </div>


          <div class="img-operate">
            <span class="circle"><i class="icon iconfont icon-tianjia" /></span>
            <span class="circle" @click="smaller"><i class="icon iconfont icon-tianjia" /></span>
            <span class="circle" @click="bigger"><i class="icon iconfont icon-tianjia" /></span>
          </div>
          
        </div>-->
        <div v-if="frameShow" v-loading="loading" style="height: 100%; flex: 1;" element-loading-text="拼命加载中">
          <iframe
            id="frame"
            :src="frameUrl"
            frameborder="0"
            height="100%"
            style="width: 100%;padding: 20px"
          ></iframe>
        </div>
      </div>
    </div>
    <div class="right">
      <div v-if="frameShow">
        <el-tabs v-model="activeName">
          <el-tab-pane label="文档生命周期" name="1">
            <div class="life-tip">
              <!--<div class="life-tip_dot green"></div>
          <span class="life-tip_text" @click="filt('2')">审批流</span>
          <div class="life-tip_dot orange"></div>
          <span class="life-tip_text" @click="filt('3')">更新版本</span>
          <div class="life-tip_dot blue"></div>
              <span class="life-tip_text" @click="filt('4')">操作日志</span>-->
              <div class="el-icon-sort" @click="reverse"></div>
              <el-radio-group v-model="radio" @change="filt(radio)">
                <el-radio class="green" label="2">审批流</el-radio>
                <el-radio class="orange" label="3">更新版本</el-radio>
                <el-radio class="blue" label="4">操作日志</el-radio>
                <el-radio label="1">全部记录</el-radio>
              </el-radio-group>
            </div>

            <div @scroll="scroll" class="life-main">
              <div>
                <el-timeline v-if="docData.lifeData.list.length">
                  <el-timeline-item
                    v-for="(item, index) in docData.lifeData.list"
                    :key="index"
                    :timestamp="item.cr_time"
                    placement="top"
                    :color="item.status === '1' ? '#00C261' : item.status === '2' ? '#FF8000' : '#0BB2D4'"
                  >
                    <el-card>
                      <div class="item">
                        <div style="width: 210px">
                          <div
                            class="life-name"
                            :style="{color: item.status === '1' ? '#00C261' : item.status === '2' ? '#FF8000' : '#0BB2D4'} "
                          >{{item.nodename}} {{item.status === '2' ? '(' + computeVersion(item.version) + ')' : ''}}</div>
                          <div class="between statu">
                            <span>操作人： {{item.nam}}</span>
                            <span v-if="item.nodename === '发布成功'">状态： 已提交</span>
                          </div>
                        </div>
                        <div v-if="item.status === '2'" class="sign">
                          <el-button
                            class="look"
                            size="mini"
                            type="info"
                            plain
                            @click="look(item)"
                          >查看</el-button>
                        </div>
                      </div>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="附件资料" name="2">
            <employeeTable :table="table" @handlerCb="handlerCb">
              <template #download="{scope}">
                <a @click.prevent="downFile(scope.row)">下载</a>
              </template>
            </employeeTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import employeeTable from "@/components/public/employeeTable";
import qs from "qs";
import axios from "axios";
import auth from "@/utils/auth";

export default {
  name: "seek",
  created() {
    this.originDoc = JSON.parse(JSON.stringify(qs.parse(auth.getOriginDoc())))
  },
  mounted() {
    console.log(this.originDoc)
    this.refresh();
    this.$nextTick(() => {
      if (this.docData.attachfiles) this.table.main.body = JSON.parse(JSON.stringify(this.docData.attachfiles))
    })
  },
  data() {
    return {
      frameUrl: "",
      originDoc: {},
      full: false,
      frameHeight: '686px',
      docData: qs.parse(auth.getDoc()),
      frameShow: false,
      loading: true,
      url: "../../assets/imgs/company.png",
      page: 1,
      type: 1,
      size: 1,
      status: "",
      radio: "1",
      activeName: "1",
      sizeObj: {
        "1": {
          width: "860px",
          height: "686px",
        },
        "2": {
          width: "1290px",
          height: "1029px",
        },
        "3": {
          width: "1720px",
          height: "1372px",
        },
      },
      // color: {
      //   [1]: "colorgreen",
      //   [2]: "colororange",
      //   [3]: "colorblue",
      // },
      color: "",
      table: {
        size: "mini",
        loading: false,
        total: 0,
        height: "300px",
        // selectArr: [],
        main: {
          head: [
            { type: "index", title: "#" },
            {
              type: "link",
              keys: "doc_nam",
              title: "附件名称",
              width: "160px",
              func: 'look'
            },
            {
              type: "slot", 
              title: "操作",
              slotName: "download",
              width: "160px",
            } // 自定义slot
          ],
          body: []
        },
      },
    };
  },
  components: {
      employeeTable
    },
  methods: {
    test(data) {
      console.log(data)
    },
    fullScreen() {
      if (this.full) {
        this.full = !this.full
        this.frameHeight = '686px'
      } else {
        this.full = !this.full
        this.frameHeight = '100%'
      }
    },
    computeStatus(status) {
      let obj = {};
      obj["1"] = obj["未生效"] = { status: "未生效", color: "warning" };
      obj["2"] = obj["生效中"] = { status: "生效中", color: "success" };
      obj["3"] = obj["已作废"] = { status: "已作废", color: "danger" };
      obj["4"] = obj["未生效"] = { status: "未生效", color: "warning" };
      obj["5"] = obj["失效"] = { status: "失效", color: "info" };

      this.status = obj[status].status;
      this.color = obj[status].color;
    },
    scroll(e) {
      if (
        e.target.offsetHeight + e.target.scrollTop + 20 <
        e.target.scrollHeight
      )
        return;
      if (
        Number(this.docData.lifeData.page_size) * this.page <
          Number(this.docData.lifeData.total) &&
        this.page * Number(this.docData.lifeData.page_size) -
          this.docData.lifeData.list.length <=
          Number(this.docData.lifeData.page_size)
      ) {
        ++this.page;
        this.rollReq(this.page);
      }
    },
    reverse() {
      console.log(this.docData.lifeData);
      if (
        Number(this.docData.lifeData.total) !==
        this.docData.lifeData.list.length
      )
        return this.$message({
          type: "warning",
          message: "请下拉列表，当前还有剩余内容未加载，不可倒序显示",
        });
      this.docData.lifeData.list = this.docData.lifeData.list.reverse();
    },
    handlerCb(func, data, table) {
      this[func](data, table);
    },
    lookOrigin() {
      this.docData = this.originDoc
      this.look(this.docData)
    },
    downFile(data) {
      let obj = {
        doc_id: data.doc_id,
        version: data.version,
        doc_nam: data.doc_nam,
        store_id: data.store_id,
      };
      this.$request.post("/doc/downloads/", obj).then((data) => {
        if (data.msg !== "成功")
          return this.$message({
            type: "error",
            message: data.msg,
          });
        this.downloading(data.data, obj.doc_nam);
      });
    },
    downloading(data, name) {
      console.log(name)
      let a = document.createElement("a");
      a.href = data[0].data;
      a.download = '体检注意事项(2)(A0).docx';
      a.target = "_blank";
      a.click();
    },
    // getSize(size) {
    //   this.size = sizeObj[size];
    // },
    // 移动
    // move() {
    //   setTimeout(() => {
    //     document.getElementsByClassName("doc-main")[0].scrollLeft =
    //       (document.getElementsByClassName("doc-main")[0].scrollWidth - 860) /
    //       2;
    //   });
    // },
    // 放大
    // bigger() {
    //   if (this.size >= 1 && this.size < 3) this.size++;
    //   this.move();
    //   return;
    // },
    // 缩小
    // smaller() {
    //   if (this.size > 1 && this.size <= 3) this.size--;
    //   if (this.size > 1) this.move();
    //   return;
    // },
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
    //返回权限
    returnRight(obj) {
      let arr = ["FILE_READ"];
      obj.downloads ? (arr = ["FILE_PRINT", ...arr]) : "";
      obj.edit ? (arr = ["FILE_WRITE", ...arr]) : "";
      return arr;
    },
    // 计算版本号
    computeVersion(version) {
      if (version === "A0") return version;
      let ver = version.replace(/[0-9]/gi, "");
      let num = Number(version.replace(/[^0-9]/gi, ""));
      let v = num === 0 ? this.wordReduce(ver) + 4 : ver + (num - 1);
      return v + "-" + version;
    },
    // 字母递减
    wordReduce(data) {
      return String.fromCharCode(data.charCodeAt() - 1);
    },
    async look(datas) {
      console.log(datas)
      const data = JSON.parse(JSON.stringify(datas))
      this.frameShow = false;
      this.loading = true;
      this.page = 1;
      const res = await this.$request.get("/doc/get/data/", {
        params: {
          version: this.docData.version,
          doc_id: data.doc_id,
          store_id: data.store_id,
        },
      });

      if (res.code !== 0)
        return this.$message({ type: "error", message: res.msg });
      if (res.code === 0) {
        // window.open('http://192.168.0.32:8012/onlinePreview?url=' + encodeURIComponent(res.data[0].data))
        let life = await this.$request.get("/doc/get/life/", {
          params: {
            version: data.version,
            doc_id: data.doc_id,
            type: this.type,
          },
        });
        let lifeData = {
          lifeData: life.data,
        };
        data.store_id = res.data[0].store_id;
        data.doc_nam = data.doc_nam + data.format;
        data.lev = res.data[0].lev;
        data.remark = res.data[0].remark;
        data.doc_num = res.data[0].doc_num;
        data.push_time = res.data[0].push_time;
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
        let bisheng = {
          doc: {
            docId: data.doc_id + "&" + data.version, // id + 版本
            title: data.doc_nam, // 文档名
            version: data.version, // 版本
            fetchUrl: decodeURIComponent(res.data[0].data), // URI解码后的文档资源地址
            callback: res.cb + "?" + this.transObj(docData), // 回调地址 和 自定义参数拼接
          },
          user: {
            uid: qs.parse(auth.getLogInfo()).dep_id, // 用户id
            nickName: qs.parse(auth.getLogInfo()).nam, // 用户名称
            avatar: "https://www.baidu.com/img/flexible/logo/pc/result.png", // 用户头像图片地址
            privilege: rightArr, // 权限（只读）
          },
        };
        bisheng = this.encode64(JSON.stringify(bisheng));
        let obj = Object.assign(
          res.data[0],
          data,
          {
            url: "http://192.168.0.36/apps/editor/openPreview?data=" + bisheng,
          },
          lifeData
        );
        await auth.removeDoc();
        await auth.setDoc(obj);
        this.docData = obj;
        console.log(obj)
        this.refresh();
        // let imgData = await axios({
        //   url: 'http://192.168.0.32:8012/onlinePreview',
        //   method: 'get',
        //   data: {
        //     url: encodeURIComponent(res.data[0].data)
        //   }
        // })
        // this.$router.push('/seek')
      }
    },
    async filt(d) {
      this.type = d;
      this.page = 1;
      const data = await this.$request.get("/doc/get/life/", {
        params: {
          doc_id: this.docData.doc_id,
          version: this.docData.version,
          type: this.type,
        },
      });
      console.log(data);
      let lifeData = {
        lifeData: data.data,
      };
      this.$nextTick(() => {
        console.log(this.docData, lifeData);
        let obj = Object.assign(this.docData, lifeData);
        auth.setDoc(obj);
        // this.$set(this.docData, 'lifeData', data.data)
      });

      // this.docData = obj
    },
    print() {
      console.log(document.getElementById("frame"));
      document.getElementById("frame").contentWindow.foucs();
      document.getElementById("frame").contentWindow.print();
    },
    rollReq(page) {
      this.$request
        .get("/doc/get/life/", {
          params: {
            doc_id: this.docData.doc_id,
            version: this.docData.version,
            type: this.type,
            page: page,
          },
        })
        .then((data) => {
          this.$set(this.docData.lifeData, "list", [
            ...this.docData.lifeData.list,
            ...data.data.list,
          ]);
        });
    },
    download() {
      let obj = {
        doc_id: this.docData.doc_id,
        version: this.docData.version,
        doc_nam: this.docData.doc_nam,
        store_id: this.docData.store_id,
      };
      this.$request.post("/doc/downloads/", obj).then((data) => {
        if (data.msg !== "成功") return;
        let a = document.createElement("a");
        a.href = data.data[0].data;
        a.download = data.data[0].name;
        a.click();
      });
    },
    refresh() {
      this.frameShow = false;
      this.loading = true;
      this.frameUrl = "";
      this.$nextTick(() => {
        this.frameShow = true;
        setTimeout(() => {
          this.frameUrl = String(this.docData.url);
          document.getElementById("frame").onload = () => {
            this.loading = false;
          };
        });
      });
      if (this.docData.status) this.computeStatus(this.docData.status);
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  background-origin: border-box;
  height: calc(100% - 20px);
  margin: 10px;
  padding: 10px 10px 10px;
  background: #fff;
}
.tipgroup {
  display: flex;
  justify-content: space-between;
}
.left {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 40px;
}
.title {
  display: flex;
  // justify-content: space-between;
  height: 30px;
  color: #4c5d66;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 30px;
}
.bottom {
  margin-bottom: 10px;
}
.btn {
  margin-left: 10px;
}
.doc {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  background: rgba(82, 86, 89, 1);
  border: 1px solid rgba(228, 228, 228, 1);
}
.fullScreen {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 9999999;
}
.doc-tool {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  height: 44px;
  line-height: 44px;
  font-size: 12px;
  color: #fff;
  font-family: Microsoft YaHei;
  background: rgba(50, 54, 57, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.operator {
  margin-left: 20px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
}
.doc-main {
  position: relative;
  height: 686px;
  padding: 10px;
  overflow: scroll;
}
.doc-main_wrap {
  min-height: 686px;
}
.img-normal {
  width: 860px;
  height: 686px;
}
.img-operate {
  position: fixed;
  left: 1020px;
  top: 740px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 104px;
  .circle {
    width: 28px;
    height: 28px;
    line-height: 28px;
    font-size: 16px;
    text-align: center;
    color: #8c939c;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
    border-radius: 50%;
    cursor: pointer;
  }
}
.right {
  width: 400px;
  padding-top: 74px;
}
.life-title {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 19px;
  margin-bottom: 30px;
}
.life-tip {
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  color: #4c5d66;
  margin-bottom: 5px;
}
.life-tip_dot {
  display: inline-block;
  height: 5px;
  width: 5px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 10px;
}
.life-tip_text {
  margin-right: 64px;
  cursor: pointer;
}
.tipwrap {
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  color: #4c5d66;
}
.life-main {
  height: 640px;
  overflow-y: scroll;
  padding-right: 20px;
}
.life-name {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 19px;
}
.item {
  display: flex;
  justify-content: space-between;
}
.sign img {
  margin-top: 10px;
}
.between {
  display: flex;
  justify-content: space-between;
}
.statu {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 20px;
  color: rgba(142, 153, 159, 1);
  margin-left: 10px;
}
// .status {
//   font-size: 12px;
//   font-family: Microsoft YaHei;
//   font-weight: 400;
//   line-height: 16px;
//   color: rgba(142, 153, 159, 1);
//   margin-top: 10px;
// }
.green,
.green /deep/.el-radio__input.is-checked + .el-radio__label {
  color: #00c261 !important;
}
.orange,
.orange /deep/.el-radio__input.is-checked + .el-radio__label {
  color: #ff8000 !important;
}
.blue,
.blue /deep/.el-radio__input.is-checked + .el-radio__label {
  color: #0bb2d4 !important;
}
.green /deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #00c261 !important;
  background: #00c261 !important;
}
.orange /deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff8000 !important;
  background: #ff8000 !important;
}
.blue /deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #0bb2d4 !important;
  background: #0bb2d4 !important;
}
.colorgreen {
  color: #00c261;
}
.colororange {
  color: #ff8000;
}
.colorblue {
  color: #0bb2d4;
}
/deep/ .el-timeline-item__node--normal {
  left: 0px;
}
.look {
  margin-top: 5px;
}
/deep/ .el-radio {
  margin-right: unset;
}
.el-icon-sort {
  font-size: 16px;
  cursor: pointer;
}
/deep/ .el-tabs__content, /deep/ .el-tabs--top, .right > div, /deep/ .el-tab-pane {
  height: 100% !important;
}
/deep/ .el-icon-sort {
  font-size: 14px !important;
}
.doc_nam {
  margin-right: 10px;
}
.status {
  font-weight: 400;
  font-family: "Microsoft YaHei";
}
.statu {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 16px;
  color: rgba(142, 153, 159, 1);
  margin-top: 10px;
}
</style>