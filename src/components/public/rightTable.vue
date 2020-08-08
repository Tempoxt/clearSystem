<template>
  <el-col v-if="table && showList.length" ref="wrap" class="table">
    <el-row v-if="'header' in table" ref="wrapHead" class="table-head">
      <div v-for="(item, index) in table.header" :key="index">
        <div v-for="(item, index) in item" :key="index" class="leftItem">
          <el-button-group v-if="item.type === 'buttonGroup'">
            <template
              v-for="(i, d) in item.data"
              >
              <el-button
                v-if="!('type' in i) && d < 4"
                :key="d"
                :size="table.size"
                :disabled="i.isSelect && table.selectArr.length === 0"
                @click="handlerCb(i.func)"
              >
                <i v-if="i.icon" class="icon iconfont" :class="[i.icon]"></i>
                {{ i.text ? i.text : null}}
              </el-button>
              <el-popover
                v-if="i.type === 'list' && d < 4"
                :key="d"
                placement="bottom"
                width="200"
                trigger="click"
                class="list"
               >
                <div v-for="(item, num) in table.main.head" :key="num">
                  <el-checkbox v-model="showList[num].check">{{ item.title }}</el-checkbox>
                </div>
                <el-button
                  slot="reference"
                  :size="table.size"
                  :disabled="i.isSelect && table.selectArr.length === 0"
                >
                  <i v-if="i.icon" class="icon iconfont" :class="[i.icon]"></i>
                  {{ i.text ? i.text : null}}
                </el-button>
              </el-popover>
              <el-dropdown v-if="item.data.length > 4 && d === 4">
                <el-button class="more_wrap" type="primary":size="table.size">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <template
                    v-for="(i, d) in item.data"
                  >
                    <el-button
                      v-if="d > 3"
                      class="more"
                      :key="d"
                      :size="table.size"
                      :disabled="i.isSelect && table.selectArr.length === 0"
                      @click="handlerCb(i.func)"
                    >
                      <i v-if="i.icon" class="icon iconfont" :class="[i.icon]"></i>
                      {{ i.text ? i.text : null}}
                    </el-button>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-button-group>

          <el-button
            v-if="item.type === 'btn'"
            :type="item.color"
            @click="handlerCb(item.func, item.select.value)"
          >{{item.text}}</el-button>

          <el-input
            v-if="item.type === 'inputSearch'"
            suffix-icon="el-icon-search"
            :placeholder="item.holder"
            @blur="handlerSearch(item.tag, item.value)"
            @keypress.enter.native="handlerSearch(item.tag, item.value)"
            v-model="item.value"
          ></el-input>

          <div class="selectWith" v-if="item.type === 'selectWith'">
            <!--<el-select
              class="selectWith_select"
              v-model="item.select.value"
              :placeholder="item.select.holder"
              :size="table.size"
            >
              <el-option
                v-for="(i, index) in item.select.options"
                :key="index"
                :label="i.label"
                :value="i.value"
              ></el-option>
            </el-select>
            <el-date-picker
              :size="table.size"
              :type="item.date.type[item.select.value]"
              v-model="item.value"
              class="selectDate"
              @change="handlerSearch(item.tag, item.value)"
              @keypress.enter.native="handlerSearch(item.tag, item.value)"
            ></el-date-picker>-->
            <el-date-picker
              class="timePicker"
              :size="table.size"
              v-model="item.value"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="handlerSearch(item.tag, item.value)"
              @keypress.enter.native="handlerSearch(item.tag, item.value)"
            >
            </el-date-picker>
          </div>
          <div v-if="item.type === 'slot'">
            <slot :name="item.slotName" :data="item"></slot>
          </div>
        </div>
      </div>
    </el-row>
    <!-- <vxe-toolbar>
      <template v-slot:buttons>
        <vxe-input v-model="filterName" type="search" placeholder="试试全表搜索"></vxe-input>
      </template>
    </vxe-toolbar> -->
    <div
      ref="wrapMain"
      class="table-main"
      :class="['header' in table ? 'headerPadding' : '', 'footer' in table ? 'footerPadding' : '']"
    >
      <vxe-table
        border
        show-header-overflow
        show-overflow
        highlight-hover-row
        height="400"
        :data="table.main.body"
        @checkbox-all="selectChange"
        @checkbox-change="selectChange"
      >
        <vxe-table-column v-if="table.check" type="checkbox" width="60" />
        <template v-for="(column, num) of table.main.head">
          <vxe-table-column
            v-if="column.type === 'index'"
            type="seq"
            title="#"
            :width="column.width ? column.width : ''" />

          <vxe-table-column
            v-if="column.type === 'text'"
            :field="column.keys" 
            :title="column.title"
            :width="column.width ? column.width : ''"  />

          <vxe-table-column
            v-if="column.type === 'checkbox'"
            :field="column.keys" 
            :title="column.title"
            :width="column.width ? column.width : ''" >
            <template v-slot:header>
              <el-checkbox
                class="checkbox"
                v-model="column.all"
                @change="checkAllItem(column.all, column.keys, column)"
              >{{column.title}}</el-checkbox>
            </template>
            <template v-slot="{ row, rowIndex }">
              <el-checkbox
                @change="isAll(column.keys, row[column.keys], rowIndex) ? column.all = true : column.all = false"
                v-model="row[column.keys]"
              ></el-checkbox>
            </template>
          </vxe-table-column>
        </template>
      </vxe-table>
    </div>
  </el-col>
</template>

<script>
export default {
  name: 'rightTable',
  props: {
    table: {
      type: Object,
      default: []
    }
  },
  data () {
    return {
      showList: [],
    }
  },
  created () {
    console.log()
  },
  mounted() {
    this.table.main.head.forEach((item, index) => {
      this.showList.push({index: index, check: true})
    })
  },
  methods: {
    handlerCb(func, data, table) {
      this.$emit("handlerCb", func, data, this.table);
    },
    handlerCurrentChange(val) {
      console.log(val);
      this.$emit("currentChange", val);
    },
    handlerSearch(key, val) {
      let arr = [];
      let obj = {};
      if ("left" in this.table.header && this.table.header.left.length) {
        console.log(this.table);
        let a = this.table.header.left.filter(item => {
          return "tag" in item;
        });
        console.log(a);
        arr = [...arr, ...a];
      }
      if ("right" in this.table.header && this.table.header.right.length) {
        let a = this.table.header.right.filter(item => {
          return "tag" in item;
        });
        arr = [...arr, ...a];
      }
      console.log(arr);
      arr.forEach(item => {
        obj[item.tag] = item.value;
      });

      this.$emit("search", obj);
    },
    selectChange({ checked, records }) {
      // console.log(checked, records)
      this.$emit("selectChange", records);
    },
    sortChange(column, prop, order) {
      console.log(column, prop, order);
    },
    // 表格列全选
    checkAllItem(...arr) {
      // this.table.main.body.forEach((item, index) => {
      //   this.table.main.body[index][arr[2].keys] = arr[0];
      // });

      this.$emit('checkAllItem', arr)
    },
    isAll(key, val, index) {
      console.log(key);
      if (this.table.checkBoxClick) {
        this.$emit('checkBoxClick', key, val, index)
        let arr = this.table.main.body.filter(item => {
          return item[key] === false;
        });
        // let sta = this.filt(this.table.main.body, (item) => {
        //   console.log(item[key])
        //   return item[key] === false
        // })
        // console.log(arr.length);

        if (arr.length) return false
        else return true;
      }
    },
    // 过滤
    filt(arr, func) {
      let statu = false
      for (let i = 0; i < arr.length; i++) {
        console.log(i)
        if (func(arr[i], i)) {
          statu = true
          break
        }
      }
      return statu
    }
  },
}
</script>

<style lang="scss" scoped>
  /deep/ .has-gutter {
    background: #909399 !important;
  }
  
  .table {
    position: relative;
    padding: 15px;
    display: flex;
    height: 100%;
    flex-direction: column;
    .table-head::before,
    .table-footer::before,
    .table-head::after,
    .table-footer::after {
      display: none;
    }
    .table-head,
    .table-footer {
      display: flex;
      justify-content: space-between;
      .leftItem {
        display: inline-block;
        margin-right: 15px;
        margin-bottom: 10px;
      }
      .leftItem:last-of-type {
        margin-right: 0px;
      }
      .selectWith_select {
        width: 80px;
      }
    }
    .table-footer {
      bottom: 0px;
    }
    .table-main {
      box-sizing: border-box;
      height: 200px;
      flex: 1;
      margin-bottom: 10px;
    }
    .headerPadding {
      padding-top: 10px;
    }
  }
  .linkword {
    cursor: pointer;
    color: #0bb2d4;
  }
  .pagerange {
    width: 100px;
  }
  /deep/ .is-leaf {
    background: #f5f5f5 !important;
  }
  /deep/ .has-gutter tr {
    height: 40px !important;
  }
  /deep/ .el-table__row {
    height: 45px !important;
  }
  .selectDate {
    width: 160px;
  }
  /deep/ .el-checkbox__label {
      font-size: 12px;
      color: #909399;
      font-weight: bold;
      font-family: "PingFang SC";
  }
  .list {
    margin-top: 12px;
  }
  .selectWith, .selectWith /deep/ .el-input__inner {
    width: 320px !important;
    height: 30px !important;
  }
  .selectWith /deep/ .el-range-separator {
    padding: 0 2px;
  }
  .more_wrap {
    border-left: none;
    padding: 8px 15px;
  }
  .more {
    display: block;
    width: 100%;
    border: none;
    margin: 0px !important;
  }
  .more .iconfont {
    font-size: 14px;
  }
  </style>
  