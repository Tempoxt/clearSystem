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
    <div
      ref="wrapMain"
      class="table-main"
      :class="['header' in table ? 'headerPadding' : '', 'footer' in table ? 'footerPadding' : '']"
      :style="tableHeight"
    >
      <el-table
        :data="table.main.body"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="table.loading"
        height="100%"
        ref="tab"
        @selection-change="selectChange"
        @sort-change="sortChange"
      >
        <el-table-column v-if="table.check" type="selection" align="center" />

        <template v-for="(column, num) of table.main.head">
          <el-table-column
            v-if="column.type === 'text' && showList[num].check"
            :prop="column.keys"
            :label="column.title"
            :key="column.title"
            :sortable="column.sort ? true : false"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :disabled="scope.row[column.keys] === '' || scope.row[column.keys] === null || showTip"
                :content="scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : String(scope.row[column.keys])"
                placement="bottom"
              >
                <span
                  @mousemove="isOverFlow"
                >{{scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : scope.row[column.keys]}}</span>
              </el-tooltip>
              <!-- <span>{{scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : scope.row[column.keys]}}</span> -->
            </template>
          </el-table-column>
          <el-table-column
            v-if="column.type === 'textRules' && showList[num].check"
            :prop="column.keys"
            :label="column.title"
            :key="column.title"
            :sortable="column.sort ? true : false"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :disabled="scope.row[column.keys] === '' || scope.row[column.keys] === null"
                :content="scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : String(column.rules[scope.row[column.keys]])"
                placement="bottom"
              >
                <span
                  @click="test([scope.row, column])"
                >{{scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : column.rules[scope.row[column.keys]]}}</span>
              </el-tooltip>
              <!-- <span>{{scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : scope.row[column.keys]}}</span> -->
            </template>
          </el-table-column>

          <el-table-column
            :key="column.title"
            v-if="column.type === 'index' && showList[num].check"
            :label="column.title"
            :fixed="column.fixed"
            type="index"
            width="50"
          />

          <el-table-column
            v-if="column.type === 'slot'"
            :label="column.title"
            :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"  
          >
            <template slot-scope="scope">
              <slot :name="column.slotName" :scope="scope"></slot>
              <!-- <span>{{scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : scope.row[column.keys]}}</span> -->
            </template>
          </el-table-column>
          <!-- 业务逻辑 -->
          <el-table-column
            v-if="column.type === 'link' && showList[num].check"
            :label="column.title" :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                placement="bottom-start"
                :disabled="scope.row[column.keys] === '' || scope.row[column.keys] === null || showTip"
                :content="scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : String(scope.row[column.keys])"
              >
                <span
                  @mousemove="isOverFlow"
                  @click="handlerCb(column.func, scope.row)"
                  class="linkword"
                >{{scope.row[column.keys]}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-if="column.type === 'input' && showList[num].check"
            :label="column.title" :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"  
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row[column.keys]"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            v-if="column.type === 'select' && showList[num].check"
            :label="column.title"
            :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row[column.keys]"
                @change="column.func ? handlerCb(column.func, scope) : null"
              >
                <el-option
                  v-for="(it, ind) in column.options"
                  :key="ind"
                  :label="it.label"
                  :value="it.value"
                  :disabled="'optionDisableRule' in column ? typeof column.optionDisableRule === 'function' ? column.optionDisableRule(scope, it.value) : column.optionDisableRule : false"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            v-if="column.type === 'selectlazy' && showList[num].check"
            :label="column.title"
            :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <el-select
                :placeholder="column.holder"
                v-model="scope.row[column.keys]"
                @change="column.func ? handlerCb(column.func, scope) : ''"
                filterable
                remote
                :disabled="'disableRule' in column ? typeof column.disableRule === 'function' ? column.disableRule(scope) : column.disableRule : false"
                :remote-method="column.methods"
                :loading="column.loading"
              >
                <el-option
                  v-for="(it, ind) in column.options"
                  :key="it.value"
                  :label="it.label"
                  :value="it.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            v-if="column.type === 'selectDoubleItem' && showList[num].check"
            :label="column.title"
            :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row[column.keys]" @select="test(scope.row[column.keys])">
                <el-option
                  v-for="(it, ind) in column.options"
                  :key="ind"
                  :label="it.label"
                  :value="it.value"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            v-if="column.type === 'icon' && showList[num].check"
            :label="column.title"
            :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <i
                class="icon iconfont"
                :class="[scope.row[column.keys] in column.rules ? column.rules[scope.row[column.keys]].icon : 'icon-baoyangjilu']"
                :style="{color: scope.row[column.keys] in column.rules ? column.rules[scope.row[column.keys]].color : '#24ccff', fontSize: '20px'}"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="column.type === 'cascader' && showList[num].check"
            :label="column.title"
            :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <el-cascader
                :options="column.options"
                :props="column.props"
                :disabled="'disableRule' in column ? typeof column.disableRule === 'function' ? column.disableRule(scope) : column.disableRule : false"
                v-model="scope.row[column.keys]"
                collapse-tags
                clearable></el-cascader>
            </template>
          </el-table-column>
          <el-table-column
            v-if="column.type === 'upload' && showList[num].check"
            :label="column.title"
            :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <el-upload
                class="upload-demo"
                action="#"
                multiple
                :auto-upload="false"
                :limit="column.limit"
                :on-exceed="() => handleExceed(column.limit)"
                :on-change="(file, fileList) => column.handleFile(file, fileList, scope)"
                >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </template>
          </el-table-column>
          <!-- 业务逻辑 -->
          <el-table-column
            v-if="column.type === 'tag' && showList[num].check"
            :label="column.title"
            :key="column.title" 
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
            >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row[column.keys] === '已通过'"
                size="medium"
                type="success"
              >{{scope.row[column.keys]}}</el-tag>
              <el-tag
                v-if="scope.row[column.keys] === '审核中'"
                size="medium"
                type="warning"
              >{{scope.row[column.keys]}}</el-tag>
              <el-tag
                v-if="scope.row[column.keys] === '待审核'"
                size="medium"
                type="info"
              >{{scope.row[column.keys]}}</el-tag>
              <el-tag
                v-if="scope.row[column.keys] === '免审核'"
                size="medium"
                type="primary"
              >{{scope.row[column.keys]}}</el-tag>
              <el-tag
                v-if="scope.row[column.keys] === '已退回'"
                size="medium"
                type="danger"
              >{{scope.row[column.keys]}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="column.type === 'tags' && showList[num].check"
            :label="column.title"
            :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <el-tag
                size="medium"
                :type="column.options[scope.row[column.keys]].color"
              >{{column.options[scope.row[column.keys]].tip}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="column.type === 'checkbox' && showList[num].check"
            :label="column.title"
            :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed"
          >
            <template slot="header" slot-scope="scope">
              <el-checkbox
                class="checkbox"
                v-model="column.all"
                @change="checkAllItem(column.all, scope, column)"
              >{{column.title}}</el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox
                @change="isAll(column.keys, scope.row[column.keys], scope.$index) ? column.all = true : column.all = false"
                v-model="scope.row[column.keys]"
              ></el-checkbox>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <el-row ref="wrapFooter" class="table-footer" v-if="table.footer">
      <div>
        每页显示
        <el-select
          :size="table.size"
          v-model="table.footer.rangeValue"
          :placeholder="table.footer.holder"
          class="pagerange"
          @change="handlerCb(table.footer.func, table.footer.rangeValue)"
          style="width: 80px;"
        >
          <el-option
            v-for="it in table.footer.range"
            :key="it.label"
            :label="it.label"
            :value="it.value"
          />
        </el-select>
        共 {{table.total ? table.total : 0}} 条
      </div>
      <div>
        <el-pagination
          :size="table.footer.rangeValue"
          background
          :page-size="table.footer.rangeValue"
          :current-page="table.currentPage"
          layout="prev, pager, next"
          :total="table.total"
          @current-change="handlerCurrentChange"
        ></el-pagination>
      </div>
    </el-row>
  </el-col>
</template>
<script>
export default {
  props: {
    table: {
      type: Object,
      default: []
    }
  },
  data() {
    return {
      showTip: false,
      showList: [],
      tableHeight: this.table.height ? this.table.height : "100%"
    };
  },
  mounted() {
    let tag = false;
    this.table.main.head.forEach((item, index) => {
      this.showList.push({index: index, check: true})
    })
    // if (this.table.height) return
    // setTimeout(() => {
    //     this.controlHeight()
    // },1000)
    // window.onresize = () => {
    //     if (tag === false) {
    //         tag = true

    //         setTimeout(() => {
    //             tag = false
    //             this.controlHeight()
    //     }, 100)
    //     }
    //  }
    setTimeout(() => {
      this.$refs.tab.doLayout()
    })
  },
  destroyed() {
    //  this.show = false
  },
  computed: {},
  methods: {
    test(data) {
      console.log(data);
    },
    isOverFlow(e) {
      if (e.target.parentNode.scrollWidth > e.target.parentNode.offsetWidth) return this.showTip = false
      else return this.showTip = true
    },
    // controlHeight() {
    //     console.log(this.$refs['wrapHead'])
    //     let headHeigth = 'header' in this.table ? this.$refs['wrapHead'].$el.offsetHeight : 0
    //     let footerHeight = 'footer' in this.table ? this.$refs['wrapFooter'].$el.offsetHeight : 0
    //     let tableHeight = this.$refs['wrap'].$el.offsetHeight - headHeigth - footerHeight - 50
    //     // this.tableHeight = this.table.pagesize < this.table.total ? tableHeight : this.table.pagesize * 28
    //     // this.tableHeight = this.tableHeight > tableHeight ? tableHeight.toString() : this.tableHeight.toString()
    //     // console.log(tableHeight)
    //     console.log(headHeigth, footerHeight, tableHeight)
    //     this.tableHeight = tableHeight
    //     // this.tableHeight < 500 ? this.tableHeight = 500 : this.tableHeight

    //     document.getElementsByClassName('table-main')[0].style.height = this.tableHeight + 'px'
    // },
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
    selectChange(val) {
      this.$emit("selectChange", val);
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
        // let arr = this.table.main.body.filter(item => {
        //   return item[key] === false;
        // });
        let sta = this.filt(this.table.main.body, (item) => {
          console.log(item[key])
          return item[key] === false
        })
        // console.log(arr.length);

        if (sta) return false
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
    },
    // 上传文件超出回调
    handleExceed(v) {
      this.$message({type: 'warning', message: '最多只能上传' + v + '个文件'})
    }
  }
};
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
/deep/ .el-upload-list__item-name {
  max-width: 180px;
}
/deep/ .el-upload-list {
  width: 220px;
}
</style>
