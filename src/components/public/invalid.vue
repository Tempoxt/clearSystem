<template>
  <el-dialog
    title="提示"
    :visible="show"
    width="520px"
    class="dialog"
    @close="close">
    <div class="alarm">确定要作废这份文档？作废后其他人将无法看到此文档！</div>
    <div class="tip">文档名称: {{ data.doc_nam }}</div>
    <div class="tip">文档版本: {{ data.version }}</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
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
        data: {
          type: Object,
          default: {}
        }
    },
    mounted() {
      console.log(this.selectArr)
      
    },
    data() {
        return {
            
        }
    },
    methods: {
      
        test(data) {
          console.log(data)
        },
        close() {
            this.$emit('close')
        },
        confirm() {
          let data = {
            doc_id: this.data.doc_id,
            version: this.data.version,
            doc_nam: this.data.doc_nam
          }
          this.$emit('req', data)
          // this.$request.post('/doc/cancellation/', data).then(res => {
          //   console.log(res)
          //   if (res.msg !== "成功") return this.$message({ type: 'error', message: res.msg })
          //   this.close()
          // })
        }
    }
}
</script>

<style lang="scss" scoped>

/deep/ .el-dialog {
  border-radius: 15px !important;
}
/deep/ .el-dialog__body {
  padding: 15px 20px !important;
}
.alarm {
  color: #4C5D66;
  font-size:14px;
  font-family:Microsoft YaHei;
  font-weight:400;
  margin-bottom: 10px;
}
.tip {
  color: #A3AFB7;
  font-size:12px;
  font-family:Microsoft YaHei;
  font-weight:400;
  line-height:24px;
  margin-bottom: 5px;
}
</style>