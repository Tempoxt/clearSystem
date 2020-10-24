<template>
  <div class="wrap">
    <div class="head">
      <template v-if="'head' in option">
        <div v-for="(item, index) in option.head" ::key="index" class="part">
          <template  v-for="(item, index) in item">
            <div v-if="item.type === 'title'" :key="index" class="title">{{item.value}}</div>

            <div v-if="item.type === 'operate'" :key="index" class="operate" @click="handlerCb(item.func)">{{item.value}}</div>

            <el-select
              v-if="item.type === 'select'" 
              v-model="item.value"
              @change="item.func ? handlerCb(item.func, item.value) : null"
              :size="option.size ? option.size : item.size ? item.size : 'mini'"
            >
              <el-option
                v-for="(it, ind) in item.options"
                :key="ind"
                :label="it.label"
                :value="it.value"
              ></el-option>
            </el-select>

            <template v-if="item.type === 'slot'">
              <slot :name="item.slotName" :data="item"></slot>
            </template>
          </template>
        </div>
      </template>
      
    </div>
    <div :id="option.id" class="main">
    </div>
  </div>
  
</template>

<script>
  // @ is an alias to /src
  import echarts from 'echarts'
  // import backlog from "@/views/hrfront/workbench/backlog"
  // import attendanceManagement from "@/views/hrfront/workbench/attendanceManagement"
  // import stickyNote from "@/views/hrfront/workbench/stickyNote"
  // import systemMessages from "@/views/hrfront/workbench/systemMessages"
  // import weater from "@/views/hrfront/workbench/weater"
  // import quickEntry from "@/views/hrfront/workbench/quickEntry"
  // import workSchedule from "@/views/hrfront/workbench/workSchedule"

  export default {
    name: 'home',
    props: {
      option: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        chart: null,
        tag: false
      }
    },
    mounted() {
      this.init()
    },
    computed: {
      chartData() {
        return this.option.chart
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(newVal,oldVal) {
          this.chart.setOption(newVal)
        }
      }
    },
    methods: {
      resize() {

        if (!this.tag) {
          this.tag = true
          setTimeout(async () => {
            this.chart.resize()
            this.tag = false
          }, 20)
        }
      },
      init() {
        let tag = false
        let t = document.getElementById(this.option.id)
        this.chart = echarts.init(t)
        this.chart.setOption(this.option.chart)
        window.addEventListener('resize', this.resize)
        // debugger
        // let myChart = echarts.init(document.getElementsByClassName('main'));
        // 绘制图表
      },
      handlerCb(func, data) {
        this.$emit("handlerCb", func, data);
      },
    },
    destroyed() {
      window.removeEventListener('resize', this.resize)
    },
  }
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 10px;

}
.head {
  display: flex;
  justify-content: space-between;
  height: 40px;
  border-bottom: 1px solid #999;
}
.part {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.part> div {
  margin-right: 10px;
}
.main {
  width: 100%;
  flex: 1;
}
.title {
  font-size: 16px;
}
.operate {
  cursor: pointer;
  color: #0BB2D4;
}
</style>
