<template>
  <el-col v-if="table && showList.length" ref="wrap" class="table">
    <el-row v-if="'header' in table" ref="wrapHead" class="table-head">
      <div v-for="(item, index) in table.header" :key="index">
        <div v-for="(item, index) in item" :key="index" class="leftItem">
          <el-button-group v-if="item.type === 'buttonGroup'">
            <template v-for="(i, d) in item.data">
              <el-button v-if="!('type' in i) && d < 6" :key="d" :size="table.size"
                :disabled="(i.isSelect && table.selectArr.length === 0) || (i.isSelects && (table.selectArr.length === 0 || table.selectArr.length > 1))"
                @click="handlerCb(i.func)">
                <i v-if="i.icon" class="icon iconfont" :class="[i.icon]"></i>
                {{ i.text ? i.text : null}}
              </el-button>
              <el-popover v-if="i.type === 'list' && d < 6" :key="d" placement="bottom" width="200" trigger="click"
                class="list">
                <div v-for="(item, num) in table.main.head" :key="num">
                  <el-checkbox v-model="showList[num].check" @change="resizeTable">{{ item.title }}</el-checkbox>
                </div>
                <el-button slot="reference" :size="table.size"
                  :disabled="(i.isSelect && table.selectArr.length === 0) || (i.isSelects && (table.selectArr.length === 0 || table.selectArr.length > 1))">
                  <i v-if="i.icon" class="icon iconfont" :class="[i.icon]"></i>
                  {{ i.text ? i.text : null}}
                </el-button>
              </el-popover>
              <el-dropdown v-if="item.data.length > 6 && d === 6">
                <el-button class="more_wrap" type="primary" :size="table.size">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <template v-for="(i, d) in item.data">
                    <el-button v-if="d > 5" class="more" :key="d" :size="table.size"
                      :disabled="(i.isSelect && table.selectArr.length === 0) || (i.isSelects && (table.selectArr.length === 0 || table.selectArr.length > 1))"
                      @click="handlerCb(i.func)">
                      <i v-if="i.icon" class="icon iconfont" :class="[i.icon]"></i>
                      {{ i.text ? i.text : null}}
                    </el-button>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-button-group>

          <el-button v-if="item.type === 'btn'" :type="item.color" @click="handlerCb(item.func, item.select.value)">
            {{item.text}}</el-button>

          <el-input v-if="item.type === 'inputSearch'" suffix-icon="el-icon-search" :placeholder="item.holder"
            @blur="handlerSearch(item.tag, item.value)" @keypress.enter.native="$event.target.blur()"
            v-model="item.value"></el-input>

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
            <el-date-picker class="timePicker" :size="table.size" v-model="item.value" type="datetimerange"
              range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" @change="handlerSearch(item.tag, item.value)"
              @keypress.enter.native="handlerSearch(item.tag, item.value)">
            </el-date-picker>
          </div>
          <div v-if="item.type === 'manySearch'">
            <el-input :placeholder="item.holder" v-model="item.value" class="input-with-select"
            @blur="search(item.optionValue, item.value)" @keypress.enter.native="$event.target.blur()">
              <el-select v-model="item.optionValue" slot="prepend" placeholder="请选择"
                class="many_input"
              >
                <el-option v-for="(i, n) in item.option" :key="n" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-input>
            
          </div>
          <div v-if="item.type === 'slot'">
            <slot :name="item.slotName" :data="item"></slot>
          </div>
        </div>
      </div>
    </el-row>
    <div ref="wrapMain" class="table-main"
      :class="['header' in table ? 'headerPadding' : '', 'footer' in table ? 'footerPadding' : '']"
      :style="tableHeight">
      <el-table :data="table.main.body" :row-class-name="table.main.rowClass" tooltip-effect="dark" style="width: 100%"
        v-loading="table.loading" height="100%" ref="tab" @selection-change="selectChange" @sort-change="sortChange">
        <el-table-column v-if="table.check" type="selection" align="center" />

        <template v-for="(column, num) of table.main.head">
          <el-table-column v-if="column.type === 'text' && showList[num].check" :prop="column.keys"
            :label="column.title" :key="column.title" :sortable="column.sort ? column.sort : false"
            :width="column.width ? column.width : table.width ? table.width : ''" :fixed="column.fixed">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark"
                :disabled="scope.row[column.keys] === '' || scope.row[column.keys] === null || showTip"
                :content="scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : String(scope.row[column.keys])"
                placement="bottom">
                <span
                  @mousemove="isOverFlow">{{scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : scope.row[column.keys]}}</span>
              </el-tooltip>
              <!-- <span>{{scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : scope.row[column.keys]}}</span> -->
            </template>
          </el-table-column>
          <el-table-column v-if="column.type === 'textRules' && showList[num].check" :prop="column.keys"
            :label="column.title" :key="column.title" :sortable="column.sort ? true : false"
            :width="column.width ? column.width : table.width ? table.width : ''" :fixed="column.fixed">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark"
                :disabled="scope.row[column.keys] === '' || scope.row[column.keys] === null"
                :content="scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : String(column.rules[scope.row[column.keys]])"
                placement="bottom">
                <span
                  @click="test([scope.row, column])">{{scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : column.rules[scope.row[column.keys]]}}</span>
              </el-tooltip>
              <!-- <span>{{scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : scope.row[column.keys]}}</span> -->
            </template>
          </el-table-column>

          <el-table-column :key="column.title" v-if="column.type === 'index' && showList[num].check"
            :label="column.title" :fixed="column.fixed" type="index" width="50" />

          <el-table-column v-if="column.type === 'slot'" :label="column.title" :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''" :fixed="column.fixed">
            <template slot-scope="scope">
              <slot :name="column.slotName" :scope="scope"></slot>
              <!-- <span>{{scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : scope.row[column.keys]}}</span> -->
            </template>
          </el-table-column>
          <!-- 业务逻辑 -->
          <el-table-column v-if="column.type === 'link' && showList[num].check" :label="column.title"
            :key="column.title" :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="bottom-start"
                :disabled="scope.row[column.keys] === '' || scope.row[column.keys] === null || showTip"
                :content="scope.row[column.keys] === '' || scope.row[column.keys] === null ? '-' : String(scope.row[column.keys])">
                <span @mousemove="isOverFlow" @click="handlerCb(column.func, scope.row)"
                  class="linkword">{{scope.row[column.keys]}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="column.type === 'input' && showList[num].check" :label="column.title"
            :key="column.title" :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed">
            <template slot-scope="scope">

              <el-input v-model="scope.row[column.keys]"
                :disabled="'disabled' in column ? typeof column.disabled === 'function' ? column.disabled(scope) : column.disabled : false"
                @blur="column.blur ? handlerCb(column.blur, scope.row) : ''"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="column.type === 'inputTip' && showList[num].check" :label="column.title"
            :key="column.title" :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="column.tip" placement="right"
                :disabled="'tipDisabled' in column ? typeof column.tipDisabled === 'function' ? column.tipDisabled(scope) : column.tipDisabled : false">
                <el-input v-model="scope.row[column.keys]"
                  :disabled="'disabled' in column ? typeof column.disabled === 'function' ? column.disabled(scope) : column.disabled : false"
                  @blur="column.blur ? handlerCb(column.blur, scope.row) : ''"></el-input>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="column.type === 'select' && showList[num].check" :label="column.title"
            :key="column.title" :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed">
            <template slot-scope="scope">
              <el-select v-model="scope.row[column.keys]" :filterable="column.filter" :multiple="column.multiple"
                :collapse-tags="column.multiple" :placeholder="column.holder" :loading="column.loading"
                :filter-method="column.filterMethods ? column.filterMethods : null"
                :disabled="'disableRule' in column ? typeof column.disableRule === 'function' ? column.disableRule(scope) : column.disableRule : false"
                @change="column.func ? handlerCb(column.func, scope) : null">
                <el-option v-for="(it, ind) in column.options" :key="ind" :label="it.label" :value="it.value"
                  :disabled="'optionDisableRule' in column ? typeof column.optionDisableRule === 'function' ? column.optionDisableRule(scope, it.value) : column.optionDisableRule : false">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column v-if="column.type === 'selectlazy' && showList[num].check" :label="column.title"
            :key="column.title" :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed">
            <template slot-scope="scope">
              <el-select :placeholder="column.holder" v-model="scope.row[column.keys]"
                @change="column.func ? handlerCb(column.func, scope) : ''" filterable remote
                :disabled="'disableRule' in column ? typeof column.disableRule === 'function' ? column.disableRule(scope) : column.disableRule : false"
                :remote-method="column.methods" :loading="column.loading" collapse-tags :multiple="column.multiple">
                <el-option v-for="(it, ind) in column.options" :key="it.value" :label="it.label" :value="it.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column v-if="column.type === 'selectDoubleItem' && showList[num].check" :label="column.title"
            :key="column.title" :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed">
            <template slot-scope="scope">
              <el-select v-model="scope.row[column.keys]" @select="test(scope.row[column.keys])">
                <el-option v-for="(it, ind) in column.options" :key="ind" :label="it.label" :value="it.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column v-if="column.type === 'icon' && showList[num].check" :label="column.title"
            :key="column.title" :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed">
            <template slot-scope="scope">
              <i class="icon iconfont"
                :class="[(scope.row[column.keys] in column.rules && scope.row[column.keys] !== null) ? column.rules[scope.row[column.keys]].icon : 'icon-baoyangjilu']"
                :style="{color: (scope.row[column.keys] in column.rules && scope.row[column.keys] !== null) ? column.rules[scope.row[column.keys]].color : '#24ccff', fontSize: '20px'}" />
            </template>
          </el-table-column>
          <el-table-column v-if="column.type === 'cascader' && showList[num].check" :label="column.title"
            :key="column.title" :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed">
            <template slot-scope="scope">
              <el-cascader :options="column.options" :props="column.props"
                :disabled="'disableRule' in column ? typeof column.disableRule === 'function' ? column.disableRule(scope) : column.disableRule : false"
                v-model="scope.row[column.keys]" collapse-tags clearable></el-cascader>
            </template>
          </el-table-column>
          <el-table-column v-if="column.type === 'upload' && showList[num].check" :label="column.title"
            :key="column.title" :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed">
            <template slot-scope="scope">
              <el-upload class="upload-demo" action="#" multiple :auto-upload="false" :limit="column.limit"
                :on-exceed="() => handleExceed(column.limit)"
                :on-change="(file, fileList) => column.handleFile(file, fileList, scope)">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </template>
          </el-table-column>
          <!-- 业务逻辑 -->
          <el-table-column v-if="column.type === 'tag' && showList[num].check" :label="column.title" :key="column.title"
            :width="column.width ? column.width : table.width ? table.width : ''" :fixed="column.fixed">
            <template slot-scope="scope">
              <el-tag v-if="scope.row[column.keys] === '已通过'" size="medium" type="success">{{scope.row[column.keys]}}
              </el-tag>
              <el-tag v-if="scope.row[column.keys] === '审核中'" size="medium" type="warning">{{scope.row[column.keys]}}
              </el-tag>
              <el-tag v-if="scope.row[column.keys] === '待审核'" size="medium" type="info">{{scope.row[column.keys]}}
              </el-tag>
              <el-tag v-if="scope.row[column.keys] === '免审核'" size="medium" type="primary">{{scope.row[column.keys]}}
              </el-tag>
              <el-tag v-if="scope.row[column.keys] === '已退回'" size="medium" type="danger">{{scope.row[column.keys]}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="column.type === 'tags' && showList[num].check" :label="column.title"
            :key="column.title" :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed">
            <template slot-scope="scope">
              <el-tag size="medium"
                :type="scope.row[column.keys] !== null ? scope.row[column.keys] in column.options ? column.options[scope.row[column.keys]].color : '' : ''">
                {{scope.row[column.keys] !== null ? scope.row[column.keys] in column.options ? column.options[scope.row[column.keys]].tip : '--' : '--'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="column.type === 'checkbox' && showList[num].check" :label="column.title"
            :key="column.title" :width="column.width ? column.width : table.width ? table.width : ''"
            :fixed="column.fixed">
            <template slot="header" slot-scope="scope">
              <el-checkbox class="checkbox" v-model="column.all" @change="checkAllItem(column.all, scope, column)">
                {{column.title}}</el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox :disabled="column.disabled ? column.disabled(scope.row): false"
                @change="isAll(column.keys, scope.row[column.keys], scope.$index) ? column.all = true : column.all = false"
                v-model="scope.row[column.keys]"></el-checkbox>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <el-row ref="wrapFooter" class="table-footer" v-if="table.footer">
      <div>
        每页显示
        <el-select :size="table.size" v-model="table.footer.rangeValue" :placeholder="table.footer.holder"
          class="pagerange" @change="handlerCb(table.footer.func, table.footer.rangeValue)" style="width: 80px;">
          <el-option v-for="it in table.footer.range" :key="it.label" :label="it.label" :value="it.value" />
        </el-select>
        共 {{table.total ? table.total : 0}} 条
      </div>
      <div>
        <el-pagination :size="table.footer.rangeValue" background :page-size="table.footer.rangeValue"
          :current-page="table.currentPage" layout="prev, pager, next" :total="table.total"
          @current-change="handlerCurrentChange"></el-pagination>
      </div>
    </el-row>
  </el-col>
</template>
<script>
  export default {
    props: {
      table: {
        type: Object,
        default: {}
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
        this.showList.push({ index: index, check: true })
      })
      this.resizeTable()
    },
    destroyed() {
    },
    computed: {},
    methods: {
      test(data) {
        console.log(data);
      },
      resizeTable() {
        setTimeout(() => {
          this.$refs.tab.doLayout()
        }, 2000)
      },
      isOverFlow(e) {
        if (e.target.parentNode.scrollWidth > e.target.parentNode.offsetWidth) return this.showTip = false
        else return this.showTip = true
      },
      handlerCb(func, data, table) {
        if (func) this.$emit("handlerCb", func, data, this.table);
      },
      handlerCurrentChange(val) {
        console.log(val);
        this.$emit("currentChange", val);
      },
      //优化后的模糊搜索
      async search(key, val) {
        let table = JSON.parse(JSON.stringify(this.table))
        if (key && val) {
          table.search_obj = { [key]: val }
        } else {
          table.search_obj = {}
        }
        await Promise.resolve(this.$emit('update:table', table))
        this.$emit("search")
      },
      // todo 等待修改优化的模糊搜索
      handlerSearch(key, val) {
        let arr = [];
        let obj = {};
        if ("left" in this.table.header && this.table.header.left.length) {
          let a = this.table.header.left.filter(item => {
            return "tag" in item;
          });
          arr = [...arr, ...a];
        }
        if ("right" in this.table.header && this.table.header.right.length) {
          let a = this.table.header.right.filter(item => {
            return "tag" in item;
          });
          arr = [...arr, ...a];
        }
        arr.forEach(item => {
          obj[item.tag] = item.value;
        });

        this.$emit("search", obj);
      },
      selectChange(val) {
        this.$emit("selectChange", val);
      },
      sortChange(column, prop, order) {
        this.$emit("sortChange", column, prop, order)
      },
      // 表格列全选
      checkAllItem(...arr) {
        this.$emit('checkAllItem', arr)
      },
      isAll(key, val, index) {
        console.log(key);
        if (this.table.checkBoxClick) {
          this.$emit('checkBoxClick', key, val, index)
          let sta = this.filt(this.table.main.body, (item) => {
            return item[key] === false
          })

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
        this.$message({ type: 'warning', message: '最多只能上传' + v + '个文件' })
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
        vertical-align: top;

        /deep/ .el-input__inner {
          height: 30px;
          line-height: 30px;
        }
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

  .selectWith,
  .selectWith /deep/ .el-input__inner {
    width: 320px !important;
    height: 32px !important;
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

  .appendix {
    width: 140px;
    word-break: break-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  /deep/ .el-table .warning-row {
    background: #f9f8eb;
  }

  /deep/ .el-table .success-row {
    background: #f0f9eb;
  }

  /deep/ .el-table__fixed,
  /deep/ .el-table__fixed-right {
    z-index: 9;
  }

  /deep/ .el-table__fixed-right {
    height: calc(100% - 14px) !important;

    /deep/ .el-table__fixed-body-wrapper {
      bottom: 12px;
      max-height: none !important;
      height: unset !important;
    }
  }

  /deep/ .el-table__fixed {
    height: calc(100% - 14px) !important;

    /deep/ .el-table__fixed-body-wrapper {
      bottom: 12px;
      max-height: none !important;
      height: unset !important;
    }
  }
  /deep/ .el-table__fixed-body-wrapper {
    bottom: 0px !important
  }
  /deep/ .el-table__fixed::before,
  /deep/ .el-table__fixed-right::before {
    display: none;
  }
  .many_input /deep/.el-input {
    width: 130px;
  }
  /deep/.input-with-select /deep/.el-input-group__prepend {
    background-color: #fff;
  }
</style>