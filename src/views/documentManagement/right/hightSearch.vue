<template>
    <el-dialog
        title="高级查询"
        :visible="show"
        width="60%"
        @close="close"
    >
        <div>
          <el-button circle @click="add"><i class="icon iconfont icon-tianjia" /></el-button>
        </div>

        <div class="flex" v-for="(items, index) in option" :key="index">
          <el-select v-model="optionValue[index]" class="mar" @change="set(optionValue[index], index)">
            <el-option
              v-for="(item, i) in items"
              :key="i"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
              >
            </el-option>
          </el-select>
          <el-select v-if="rules1_target.includes(optionValue[index])" v-model="lowOptionValue[index]" class="mar">
            <el-option
              v-for="(item, index) in rules1"
              :key="index"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
          <el-select v-if="rules2_target.includes(optionValue[index])" v-model="lowOptionValue[index]" class="mar">
            <el-option
              v-for="(item, index) in rules2"
              :key="index"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
          <el-date-picker
            class="mar"
            v-if="optionValue[index] && !(rules1_target.includes(optionValue[index])) && !(rules2_target.includes(optionValue[index]))"
            v-model="query[index]"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            data-locale='{"format":"yyyy-MM-dd HH:mm:ss"}'
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>

          <el-input 
            v-if="(rules1_target.includes(optionValue[index])) || (rules2_target.includes(optionValue[index]))"
            class="inp mar"
            v-model="query[index]"
            :placeholder="holder(optionValue[index])"
            ></el-input>
          <el-button v-if="option.length > 1" circle @click="reduce(index)"><i class="icon iconfont icon-guanbi2" /></el-button>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="clear">清除</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>

    </el-dialog>
</template>>

<script>

import qs from 'qs'
import axios from 'axios'

export default {
    name: 'addDoc',
    props: {
        selectGroup: {
          type: Object,
          default: {}
        },
        show: {
          type: Boolean,
          default: true
        }
    },
    mounted() {
      this.set()
    },
    data() {
        return {
            option: [this.selectGroup.option],
            lowOption: [{
              label: '等于',
              value: 0
            },{
              label: '包含',
              value: 1
            }],
            optionValue: [],
            lowOptionValue: [],
            query: [],
            mapOption: [],
            createTimeFrom: '',
            createTimeEnd: '',
            pushTimeFrom: '',
            pushTimeEnd: '',
            rules1_target: ['doc_num', 'user_name', 'version', 'nam', 'sta', 'position', 'dep_name'],
            rules1: [
              { value: 'like', label: '包含' },
              { value: '=', label: '等于' },
            ],
            rules2_target: ['lev'],
            rules2: [
              { value: '=', label: '等于' },
              { value: '>=', label: '大于等于' },
              { value: '<=', label: '小于等于' },
              { value: '>', label: '大于' },
              { value: '<', label: '小于' },
            ]
        }
    },
    methods: {
        test(data) {
          console.log(data)
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
          return year + "-" + this.formatTen(month) + "-" + this.formatTen(day)+ " " + this.formatTen(hour)+ ":" + this.formatTen(minute)+ ":" + this.formatTen(second)
        },
        set(val, index) {
          this.option.forEach((i, d) => {
            i.forEach((it, ind) => {
              this.$set(this.option[d][ind], 'disabled', false)
            })
          })
          this.optionValue.forEach(value => {
            this.option.forEach((i, d) => {
              i.forEach((it, ind) => {
                console.log(this.option[d][ind])

                it.value === value ? this.$set(this.option[d][ind], 'disabled', true) : null
              })
            })
          })
          this.query[index] = ''
          this.lowOptionValue[index] = null
        },
        close() {
            this.$emit('closeDia')
        },
        add() {
          console.log(this.option)
          if (this.option.length < this.selectGroup.option.length) {
            this.option.push(this.selectGroup.option)
            this.optionValue.push()
            this.lowOptionValue.push()
            this.query.push()
          }
          
        },
        reduce(index) {
          this.optionValue.splice(index, 1)
          console.log(this.optionValue)

          this.lowOptionValue.splice(index, 1)
          this.query.splice(index, 1)
          this.option.splice(index, 1)
          this.set()
          // 处理搜索数据
          this.handleData(false)
        },
        clear(index) {
          this.optionValue = []
          this.lowOptionValue = []
          this.query = []
          this.option.forEach((i, d) => {
            i.forEach((it, ind) => {
              this.$set(this.option[d][ind], 'disabled', false)
            })
          })
          this.option = []
          // 处理搜索数据
          this.handleData(false)

        },
        // 处理数据
        handleData(act = true) {
          let obj = {}
          this.optionValue.forEach((item, index) => {
            if (item !== 'create_time' && item !== 'push_time') {
              obj[item] = this.query[index]
              obj[item + '_symbol'] = this.lowOptionValue[index]
            } else if (item === 'create_time') {
              obj['create_time_from'] = this.timeDormat(this.query[index][0])
              obj['create_time_end'] = this.timeDormat(this.query[index][1])
            } else {
              obj['push_time_from'] = this.timeDormat(this.query[index][0])
              obj['push_time_end'] = this.timeDormat(this.query[index][1])
            }
          })
          this.$emit('req', obj, act)
        },
        confirm() {
          this.handleData()
          this.close()
        },
        holder(val) {
          let obj = {
            'lev': '请用数字1，2，3，4代替一二三四级文件'
          }
          if (val in obj) {
            return obj[val]
          }
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
/deep/ .el-dialog {
  width: 950px !important;
}
</style>