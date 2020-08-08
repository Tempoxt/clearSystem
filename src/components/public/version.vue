<template>
    <el-dialog
        title="更新版本"
        :visible="show"
        width="860px"
        @close="close"
    >
        <div class="flex justifyCenter">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="文档名称" v-if="selectArr.length === 1">
              <span>{{ selectArr[0].doc_nam }}</span>
            </el-form-item>
            <el-form-item label="文件级别" v-if="selectArr.length === 1">
              <span>{{ selectArr[0].lev }}</span>
            </el-form-item>
            <el-form-item label="文件编号" v-if="selectArr.length === 1">
              <span>{{ selectArr[0].doc_num }}</span>
            </el-form-item>
            <el-form-item label="原版本" v-if="selectArr.length === 1">
              <span>{{ selectArr[0].version }}</span>
            </el-form-item>
            <el-form-item label="新版本" v-if="selectArr.length === 1">
              <span class="newVersion">{{ version }}</span>
            </el-form-item>
            <el-form-item label="所属文件夹">
              <el-input v-model="belongFile.fol_nam" disabled></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="remark"></el-input>
            </el-form-item>
            <el-form-item label="导入文档">
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
                <el-button size="mini">上传文件
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
import qs from 'qs'
import axios from 'axios'

export default {
    name: 'editDoc',
    props: {
        show: {
          type: Boolean,
          default: true
        },
        selectArr: {
          type: Array,
          default: []
        },
        
        belongFile: {
          type: Object,
          default: {}
        }
        
    },
    mounted() {
      console.log(this.selectArr)
      // 计算新版本
      let ver = this.selectArr[0].version.replace(/[0-9]/ig,"")
      let num = Number(this.selectArr[0].version.replace(/[^0-9]/ig,""))
      this.version = (num + 1) > 4 ? this.wordAdd(ver) + 0 : ver + (num + 1)

      this.form.remark = this.selectArr[0].remark
    },
    data() {
        return {
            version: '',
            remark: this.selectArr[0].remark,
            form: {
              doc_nam: '',
              fol_nam: '',
              version: '',
              doc_id: '',
              new_siz: '',
              new_format: '',
              doc_list: []
            },
            uploadData: {
              fileList: []
            }
            
        }
    },
    methods: {
      
        test(data) {
          console.log(data)
        },
        // 字母递增
        wordAdd(data) {
          return String.fromCharCode(data.charCodeAt() + 1)
        },
        close(act = false) {
            this.$emit('close', act)
        },
        solveFile(f) {
          console.log(f)
          this.uploadData.fileList = [f]
          this.$set(this.form, 'new_siz', this.uploadData.fileList[0].size < 1024 ? this.uploadData.fileList[0].size + 'Byte' : this.uploadData.fileList[0].size/1024 < 1024 ? (this.uploadData.fileList[0].size/1024).toFixed(2) + 'Kb': (this.uploadData.fileList[0].size/1024/1024 < 1024) ? (this.uploadData.fileList[0].size/1024/1024).toFixed(2) + 'Mb' : (this.uploadData.fileList[0].size/1024/1024/1024).toFixed(2) + 'Gb')
          this.$set(this.form, 'new_format', this.uploadData.fileList[0].name.substring(this.uploadData.fileList[0].name.lastIndexOf(".")))
          this.$set(this.form, 'new_nam', this.uploadData.fileList[0].name)
          console.log(this.form)
        },
        remove() {
          this.uploadData.fileList = []
        },
        handleExceed() {
            return this.$message({
                type: 'warning',
                message: '仅可上传一份文档'
            })
        },
        async confirm() {
          if (this.uploadData.fileList.length === 0) return this.$message({ type: 'warning', message: '请选择上传文件' })
          console.log(this.uploadData.fileList)
          let f = new FormData()
          f.append('old_version', this.selectArr[0].version)
          f.append('doc_id', this.selectArr[0].doc_id)
          f.append('new_version', this.version)
          f.append('fol_id', this.selectArr[0].fol_id)
          f.append('remark', this.remark)
          f.append('files', this.uploadData.fileList[0].raw)
          f.append('new_siz', this.form.new_siz)
          f.append('new_nam', this.form.new_nam)
          f.append('new_format', this.form.new_format)
          f.append('name', this.selectArr[0].doc_nam)
          const res = await this.$request.post('/doc/update/', f, { headers: {'Content-Type':'multipart/form-data'}})
          if (res.code === 0) {
            this.$message({type: 'success', message: '更版成功'})
            this.close(true)
          }
          else {this.$message({type: 'error', message: res.msg})}
          
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

.upload-demo {
    display: inline-block;
}

.flex {
  display: flex;
  margin: 10px 0;
}
.mar {
  margin-right: 50px;
}

.justifyCenter  { 
  justify-content: center;
}
.newVersion {
  color: #FF8000;
}
/deep/ .el-dialog__body, /deep/ .el-form-item__content{
  font-size: 12px !important;
  font-family:Microsoft YaHei !important;
  font-weight:400 !important;
}
/deep/ .el-dialog__header{
  background: #F5FAFB;
}
</style>