<template>
  <el-dialog title="审核文档" :visible="show" width="860px" @close="close">
    <div class="flex justifyCenter">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文档名称" v-if="selectArr.length === 1">
          <span>{{ selectArr[0].doc_nam }}</span>
        </el-form-item>
        <el-form-item label="文档版本" v-if="selectArr.length === 1">
          <span>{{ selectArr[0].version }}</span>
        </el-form-item>
        <el-form-item label="文件级别" v-if="selectArr.length === 1">
          <span>{{ selectArr[0].lev }}</span>
        </el-form-item>
        <el-form-item label="文件编号" v-if="selectArr.length === 1">
          <span>{{ selectArr[0].doc_num }}</span>
        </el-form-item>
        <el-form-item label="是否公开" v-if="selectArr.length === 1">
          <span>{{ isPub[selectArr[0].publictype] }}</span>
        </el-form-item>
        <el-form-item v-if="selectArr[0].dep_names !== ''" label="公开部门">
          <span>{{ selectArr[0].dep_names }}</span>
        </el-form-item>

        <el-form-item label="受控级别" v-if="selectArr.length === 1" prop="control">
          <el-select v-model="form.control" placeholder="请选择">
            <el-option v-for="item in controlOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核结果" prop="result">
          <el-radio-group v-model="form.result">
            <el-radio :label="1">通过并发布</el-radio>
            <el-radio :label="3">退回</el-radio>
            <el-radio :label="2">通过并发送其他人审批</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.result === 2" label="审核人" prop="uid">
          <el-select v-model="form.uid" filterable remote reserve-keyword :remote-method="search" :loading="loading"
            @change="handleChange(form.uid)">
            <el-option v-for="(it, ind) in searchOptions" :key="ind" :label="it.label" :value="it.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" placeholder="请输入"></el-input>
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
      }
    },
    mounted() {
      console.log(this.selectArr)
      // 计算新版本
      let ver = this.selectArr[0].version.replace(/[0-9]/ig, "")
      let num = Number(this.selectArr[0].version.replace(/[^0-9]/ig, ""))
      this.version = (num + 1) > 4 ? this.wordAdd(ver) + 0 : ver + (num + 1)

      this.form.remark = this.selectArr[0].remark
    },
    data() {
      return {
        version: '',
        remark: this.selectArr[0].remark,
        loading: false,
        form: {
          control: null,
          result: null,
          remark: '',
          uid: null,
          sta: ''
        },
        isPub: {
          1: '不公开',
          2: '全公司公开',
          3: '本部门公开',
          4: '指定部门公开'
        },
        rules: {
          control: [
            { required: true, trigger: 'change', message: '请选择受控级别' }
          ],
          result: [
            { required: true, trigger: 'change', message: '请选择审核结果' }
          ],
          uid: [
            { required: true, trigger: 'change', message: '请选择审批人' }
          ]
        },
        controlOptions: [
          { label: '公司内部受控', value: 2 },
          { label: '部门内部受控', value: 1 },
          { label: '不需要受控', value: 0 }
        ],
        searchOptions: []

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
        this.$refs.form.resetFields()
        this.$emit('close', act)
      },
      solveFile(f) {
        console.log(f)
        this.uploadData.fileList = [f]
        this.$set(this.form, 'new_siz', this.uploadData.fileList[0].size < 1024 ? this.uploadData.fileList[0].size + 'Byte' : this.uploadData.fileList[0].size / 1024 < 1024 ? (this.uploadData.fileList[0].size / 1024).toFixed(2) + 'Kb' : (this.uploadData.fileList[0].size / 1024 / 1024 < 1024) ? (this.uploadData.fileList[0].size / 1024 / 1024).toFixed(2) + 'Mb' : (this.uploadData.fileList[0].size / 1024 / 1024 / 1024).toFixed(2) + 'Gb')
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
      search(v) {
        if (v === '') {
          this.searchOptions = []
          return
        }
        let obj = {}
        this.searchOptions = []
        this.loading = true
        if (/^[0-9]+$/.test(v)) { obj.sta = v }
        else { obj.nam = v }
        this.$request.get('/doc/get/user/', {
          params: Object.assign({
            dep_id: 0, type: 2
          }, obj)
        }).then(data => {
          this.searchOptions = []
          if (data.data.data_list.length === 0) return
          data.data.data_list.forEach((item, index) => {
            let obj = {
              label: item.nam,
              uid: item.uid,
              value: item.sta,
              position: item.position
            }
            this.searchOptions.push(obj)
          })
          this.loading = false
        })
      },
      handleChange(val) {
        for (let i in this.searchOptions) {
          console.log(i)
          if (this.searchOptions[i].uid === val) {
            this.form.sta = this.searchOptions[i].value
            break
          }
        }
      },
      async confirm() {
        this.$refs.form.validate(val => {
          if (val) {
            let obj = new FormData()
            obj.append('doc_id', this.selectArr[0].doc_id)
            obj.append('version', this.selectArr[0].version)
            obj.append('types', this.form.result)
            obj.append('doc_nam', this.selectArr[0].doc_nam)
            obj.append('control', this.form.control)
            obj.append('remark', this.form.remark)


            if (this.form.result === 2) {
              obj.append('other_sta', this.form.sta)
              obj.append('other_uid', this.form.uid)
            }
            console.log(obj)
            const res = this.link(obj)
            console.log(res)
            res.then(res => {
              if (res.code !== 0) return this.$message({ type: 'error', message: res.msg })
              else {
                this.close(1)
                this.$message({ type: 'success', message: res.msg })
              }
            })

          }
        })
      },
      async link(obj) {
        return await this.$request.post('/doc/audit/', obj, { headers: { 'Content-Type': 'multipart/form-data' } })
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

  .justifyCenter {
    justify-content: center;
  }

  .newVersion {
    color: #FF8000;
  }

  /deep/ .el-dialog__body,
  /deep/ .el-form-item__content {
    font-size: 12px !important;
    font-family: Microsoft YaHei !important;
    font-weight: 400 !important;
  }

  /deep/ .el-dialog__header {
    background: #F5FAFB;
  }
</style>