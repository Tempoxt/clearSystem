<template>
  <div id="home">
    <div class="outside">
      <el-tabs v-model="activeName">
        <el-tab-pane label="图例" name="2">
            <div class="chart">
              <div class="col" v-for="(item, index) in chartOption" ::key="index">
                <chart :option.sync="chartOption[index]" @handlerCb="handlerCb">
                  <template #time="{data}">
                    <div>
                      321
                    </div>
                  </template>
                </chart>
              </div>
            </div>
        </el-tab-pane>

        <el-tab-pane label="甘特图" name="1">
          <gant />
        </el-tab-pane>
      </el-tabs>
    </div>
    
  </div>
</template>

<script>
  // @ is an alias to /src
  import chart from '@/components/public/chart'
  import gant from '@/components/public/gant'
  // import backlog from "@/views/hrfront/workbench/backlog"
  // import attendanceManagement from "@/views/hrfront/workbench/attendanceManagement"
  // import stickyNote from "@/views/hrfront/workbench/stickyNote"
  // import systemMessages from "@/views/hrfront/workbench/systemMessages"
  // import weater from "@/views/hrfront/workbench/weater"
  // import quickEntry from "@/views/hrfront/workbench/quickEntry"
  // import workSchedule from "@/views/hrfront/workbench/workSchedule"

  export default {
    name: 'home',
    data() {
      return {
        activeName: '1',
        chartOption: [
          {
            id: '1',
            title: 'test',
            head: {
              left: [{
                type: 'title',
                value: 'test',
              },{
                type: 'operate',
                value: '查看明细',
                func: 'test'
              }],
              right: [{
                type: 'select',
                value: 1,
                options: [
                  {label: 'zhou', value: 0},
                  {label: 'ccc', value: 1},
                  {label: 'liang', value: 2}
                ]
              },{
                type: "slot", // slot类型的控件
                slotName: "time" // 自定义数据绑定slot-name
              }]
            },
            chart: {
              title: {
              text: '测试'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              color: ['#8378EA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
              xAxis: {
                type: 'category',
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
              },
              itemStyle: {

              },
              legend: {
                data: ['销量', '出生率', '死亡率']
              },
              yAxis: {},
              series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
              },{
                name: '出生率',
                type: 'bar',
                data: [15, 24, 32, 20, 40, 10]
              },
              {
                name: '死亡率',
                type: 'bar',
                data: [25, 22, 33, 40, 20, 30]
              },]
            }
          },
          {
            id: '2',
            head: {
              left: [{
                type: 'title',
                value: 'test',
              }]
            },
            chart: {
              title: {
              text: '测试'
              },
              tooltip: {},
              yAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
              },
              xAxis: {},
              series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
              }]
            }
          },
          {
            id: '3',
            head: {
              left: [{
                type: 'title',
                value: 'test',
              }]
            },
            chart: {
              title: {
              text: '测试'
              },
              tooltip: {},
              xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
              },
              yAxis: {},
              series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
              }]
            }
          }
        ]
      }
    },
    components: {
      chart,
      gant
      // quickEntry,
      // backlog,
      // attendanceManagement,
      // systemMessages,
      // stickyNote,
      // weater,
      // workSchedule,
    },
    mounted() {

    },
    methods: {
      handlerCb(func, data) {
        this[func](data);
      },
      test(data) {
        console.log(432)
        this.chartOption[0].chart.series = this.chartOption[0].chart.series.reverse()
        this.chartOption[0].chart.legend.data = this.chartOption[0].chart.legend.data.reverse()
        console.log(this.chartOption)
      }
    },
  }
</script>

<style lang="scss" scoped>
#home {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.outside {
  box-sizing: content-box;
  height: 100%;
  background: #FFF;
  margin: 0px !important;
}
.chart {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  align-content: flex-start;
}
.col {
  border: 1px solid #555;
  flex: 0 0 calc(50% - 10px);
  height: 300px;
  margin-bottom: 20px
}
</style>