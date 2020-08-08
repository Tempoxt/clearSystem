<template>
  <el-dialog
    v-loading="loading"
    element-loading-text="文件上传中，请稍等"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    title="添加文档" 
    :visible="show" 
    width="60%" 
    @close="close">
    <div class="head">
      <el-upload
        ref="up"
        class="upload-demo mar"
        action="#"
        multiple
        :limit="30"
        :auto-upload="false"
        :on-change="solveFile"
        :file-list="uploadData.fileList"
        :on-exceed="handleExceed"
        :show-file-list="false"
      >
        <!-- accept=".jpg,.jpeg,.png,.gif,.pdf,.JPG,.JPEG,.GIF,.PDF, .ppt, .doc" -->
        <!-- :before-upload="beforeUpload" -->
        <el-button size="mini">
          选择文件
          <!-- <input type="file" id="filePick" name="fileList" multiple @change="fileChange" style="height: 0; width: 0;"> -->
        </el-button>
      </el-upload>

      <el-button size="mini" @click="del">删除</el-button>
    </div>

    <div class="tab">
      <el-table
        :data="uploadData.fileList"
        max-height="400px"
        height="400px"
        fit
        @select="tabSelectChange"
        @select-all="tabSelectAll"
      >
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" label="#" :index="indexMethod"></el-table-column>
        <el-table-column prop="name" label="文档名称"></el-table-column>
        <el-table-column prop="format" label="文件格式"></el-table-column>
        <el-table-column prop="siz" label="文件大小"></el-table-column>

        <el-table-column label="所属文件夹">
          <template slot-scope="scope">
            <el-popover placement="buttom" width="400" trigger="click">
              <el-tree
                :ref="'tree' + scope.$index"
                class="treeSearch"
                :data="addDocTree.treeData.data"
                :props="addDocTree.treeData.treeProps"
                :node-key="addDocTree.treeData.nodeKey"
                highlight-current
                :default-expanded-keys="[0]"
                :filter-node-method="addDocTree.treeData.filterMethod"
                @node-click="addDocNodeClick"
              >
                <div class="flexBetween" slot-scope="{ node, data }">
                  <div>
                    <i class="icon iconfont icon-wenjian1"></i>
                    &nbsp;
                    <span>{{data.fol_nam}}</span>
                  </div>
                </div>
              </el-tree>
              <el-input
                @focus="focus(scope.$index)"
                @input="inputSearch(scope.row.belong, scope.$index)"
                slot="reference"
                v-model="scope.row.belong"
              ></el-input>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="文档版本"></el-table-column>
        <el-table-column label="附件" width="240px">
          <template slot-scope="scope">
            <el-upload
              class="upload-demo"
              action="#"
              multiple
              :auto-upload="false"
              :on-change="(file, fileList) => handleFile(file, fileList, scope)"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input slot="reference" v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <el-progress v-if="percentage" class="progress" type="circle" :percentage="percentage" status="success"></el-progress> -->
    <!-- <el-progress v-if="percentage" :percentage="percentage" :color="customColors"></el-progress> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="update">确 定</el-button>
    </span>
  </el-dialog>
</template>>

<script>
import org from "@/components/public/org";
import qs from "qs";
import axios from "axios";

export default {
  name: "addDoc",
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    treeOption: {
      type: [Array, Object],
      default: [],
    },
    selectFile: {
      type: Object,
      default: {},
    },
  },
  components: {
    org,
  },
  mounted() {
    // setTimeout(() => {

    // }, 1000);
    this.addDocTree.treeData.data = this.treeOption;
  },
  data() {
    return {
      percentage: 0,
      loading: false,
      formData: "",
      focusIndex: "",
      selectItem: [],
      appendixList: [],
      uploadData: {
        status: false,
        fileList: [],
      },
      addDocTree: {
        show: true,
        // search: {
        //   text: '',
        //   add: {
        //     func: 'addRightShows'
        //   }
        // },
        treeData: {
          data: [],
          mainIconRules: [],
          treeProps: {
            children: "children",
            label: "fol_nam",
          },
          expandedArr: [0],
          nodeKey: "fol_id",
          filterMethod(value, data, node) {
            console.log(data, node);
            if (!value) return true;
            return data.fol_nam && data.fol_nam.indexOf(value) !== -1;
          },
          highlightCurrent: true,
          // slotVal: {
          //     belongValue: '',
          //     remarkValue: ''
          // },
          checkOnClick: false,
          nodeClick: this.addDocNodeClick,
          // nodeClick(val,node, el) {
          //   console.log(val, node, el)
          // },
          expandOnClick: false,
        },
      },
    };
  },
  methods: {
    test(data) {
      console.log(data);
    },
    focus(index) {
      let top = document.getElementsByClassName("el-table__body-wrapper")[1]
        .scrollTop;
      if (top !== "0px")
        document.getElementsByClassName("el-popover el-popper")[
          index + 1
        ].style.marginTop = 38 - top + "px";
      this.focusIndex = index;
    },

    handleClose() {},
    handleExceed() {
      return this.$message({
        type: "warning",
        message: "单次上传限制30个文件，您已超出限制",
      });
    },
    solveFile(file, fileList) {
      if (!this.uploadData.status) {
        this.uploadData.status = true;
        setTimeout(() => {
          this.fileArr(fileList);
        }, 100);
      }
    },
    handleFile(file, fileList, scope) {
      console.log(file, fileList);
      this.$set(this.uploadData.fileList[scope.$index], 'appendixList', fileList)
    },
    fileArr(fileList) {
      let arr = [];

      let newFile = fileList.filter((item) => {
        return "raw" in item;
      });
      newFile.forEach((item, index) => {
        // if (this.uploadData.fileList.length > 0 && this.uploadData.fileList.filter(it => item.name === it.name)) return
        console.log(this.selectFile);
        let obj = {};
        obj.name = item.name;
        obj.siz =
          item.size < 1024
            ? item.size + "Byte"
            : item.size / 1024 < 1024
            ? (item.size / 1024).toFixed(2) + "Kb"
            : item.size / 1024 / 1024 < 1024
            ? (item.size / 1024 / 1024).toFixed(2) + "Mb"
            : (item.size / 1024 / 1024 / 1024).toFixed(2) + "Gb";
        obj.version = "A0";
        obj.remark = "";
        obj.format = item.name.substring(item.name.lastIndexOf("."));
        obj.file = item.raw;
        obj.appendixList = [];
        if (
          this.selectFile["p1"] ||
          this.selectFile["dep_id"] === 36 ||
          this.selectFile["dep_id"] === 47
        ) {
          obj.belong = this.selectFile["fol_nam"];
          obj.fol_id = this.selectFile["fol_id"];
        } else {
          obj.belong = "";
        }
        this.uploadData.fileList.push(obj);
      });
      this.uploadData.status = false;
    },
    indexMethod(index) {
      return index + 1;
    },
    handlerCb(func, data, table) {
      this[func](data, table);
    },
    inputSearch(v, index) {
      this.$refs["tree" + index].filter(v);
    },
    addDocNodeClick(val, node) {
      if (val["p1"] || val["dep_id"] === 36 || val["dep_id"] === 47) {
        this.uploadData.fileList[this.focusIndex].belong = val.fol_nam;
        this.uploadData.fileList[this.focusIndex].fol_id = val.fol_id;
      } else {
        this.$message({
          type: "warning",
          message: "该文件夹无法被添加",
        });
      }
    },
    tabSelectChange(s) {
      this.selectItem = s;
    },
    tabSelectAll(s) {
      this.selectItem = s;
    },
    del() {
      if (this.uploadData.fileList.length === 0)
        return this.$message({
          type: "warning",
          message: "请选择需要删除的文件",
        });
      let indexArr = [];
      this.uploadData.fileList.forEach((item, index) => {
        let arr = this.selectItem.filter((i) => {
          return i.name === item.name;
        });
        if (arr.length === 0) indexArr.push(item);
      });
      this.uploadData.fileList = indexArr;
    },
    close() {
      this.uploadData.fileList = [];
      this.$emit("closeAddDoc");
    },
    add() {
      this.percentage += 10;
    },
    async update() {
      if (this.uploadData.fileList.length === 0)
        return this.$message({
          type: "warning",
          message: "请选择文件上传",
        });
      if (this.uploadData.fileList.filter((i) => i.belong === "").length > 0)
        return this.$message({
          type: "warning",
          message: "请选择文件夹",
        });
      let formData = new FormData();
      let arr = [];
      Array.prototype.slice.call(this.uploadData.fileList).forEach((item) => {
        let { siz, name, version, format, fol_id, remark } = item;
        arr.push({
          siz,
          name,
          version,
          format,
          fol_id,
          remark,
        });
      });
      formData.append("data_list", JSON.stringify(arr));
      console.log(this.uploadData.fileList);
      this.uploadData.fileList.forEach((item, index) => {
        formData.append("files", item.file);
        if (item.appendixList.length) {
          item.appendixList.forEach((i) => {
            formData.append("files" + index, i.raw);
          });
        }
      });
      let that = this;
      that.loading = true
      let res = await this.$request.post("/doc/mydoc/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress(data) {
          that.percentage = (data.loaded / data.total).toFixed(2) * 100;
          console.log(that.percentage)
          if (that.percentage === 100) {
            setTimeout(() => {
              that.percentage = 0;
            }, 10);
          }
        },
      });
      if (res.code !== 0) {
        this.$message({
          type: "error",
          message: res.msg,
        });
        that.loading = false
        return 
      }
      if (res.code === 0) {
        this.$message({
          type: "success",
          message: res.msg,
        });
        that.loading = false
        this.close();
      }
      this.$emit("req");
    },
    beforeUpload(f) {},
    choose() {
      document.getElementById("filePick").click();
    },
    fileChange(f) {},
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__headerbtn {
  top: 14px;
}

/deep/.el-dialog {
}

/deep/.el-dialog__header {
  height: 50px;
  background: #fff5fafb;
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

/deep/ .el-popover {
  max-height: 400px !important;
  overflow-y: scroll;
}

.progress {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -63px 0 0 -63px;
}
/deep/ .el-upload-list__item-name {
  max-width: 180px;
}
/deep/ .el-upload-list {
  width: 220px;
}
</style>
