<template>
  <div class="app-container">
    <el-slider v-model="range" :max="20" :min="1" :step="1">
    </el-slider>
    <div ref="gantt" class="left-container" />
  </div>
</template>
<script>
  import gantt from 'dhtmlx-gantt'  // 引入模块
  import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
  // import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css'
  // import 'dhtmlx-gantt/codebase/locale/locale_cn'  // 本地化
  export default {
    name: 'DhtmlxGantt',
    data() {
      return {
        range: 1,
        tasks: {
          data: [
            { id: 1, text: 'Task #1', start_date: '15-04-2017', personName: '张总', duration: 3, progress: 0.6, color:"red" },
            { id: 2, text: 'Task #2', start_date: '18-05-2017', personName: '李总', duration: 3, progress: 0.4 },
            { id: 3, text: 'Task #2-1', start_date: '20-06-2017', personName: '赵总', duration: 3, progress: 0.5, parent: 2, color:"#e7643d" },
            { id: 4, text: 'Task #2-2', start_date: '20-06-2017', personName: '赵总', duration: 3, progress: 0.8, parent: 2, color:"blue" },
            { id: 6, text: 'Task #2-2-6', start_date: '22-06-2017', personName: '赵总', duration: 3, progress: 0.8, parent: 4, color:"yellow" },
            { id: 5, text: 'Task #2', start_date: '20-05-2017', personName: '章总', duration: 3, progress: 0.4 },
          ],
        },
        Mon: {
          ['Jan']: 1,
          ['Feb']: 2,
          ['Mar']: 3,
          ['Apr']: 4,
          ['May']: 5,
          ['Jun']: 6,
          ['Jul']: 7,
          ['Aug']: 8,
          ['Sep']: 9,
          ['Oct']: 10,
          ['Nov']: 11,
          ['Dec']: 12
        }
      }
    },
    watch: {
      range(val) {
        if (val < 16) {
          gantt.config.scales = [
            { unit: "month", step: 1, format: this.monthScaleTemplate },
            { unit: "day", step: val, format: "%j" }
          ];
        } else if (15 < val && val < 20) {
          gantt.config.scales = [
            {
              unit: "month", step: (val - 14),
              format: (date) => {
                let YearToStr = gantt.date.date_to_str("%Y");
                let dateToStr = gantt.date.date_to_str("%M");
                return this.handleMoon(this.Mon[dateToStr(date)]) + '月至' + this.handleMoon(this.Mon[dateToStr(date)] + (val - 15)) + '月' + YearToStr(date)
              }
            },
          ];
        } else {
          gantt.config.scales = [
            { unit: "year", step: 1, format: "%Y" },
          ];
        }
        gantt.render()
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      monthScaleTemplate(date) {
        let YearToStr = gantt.date.date_to_str("%Y");
        let dateToStr = gantt.date.date_to_str("%M");
        // let endDate = gantt.date.add(date, 2, "month");
        return this.Mon[dateToStr(date)] + '月' + YearToStr(date)
      },
      // 处理月份计算问题
      handleMoon(val) {
        if (val > 12) {
          return (val - 12)
        } else {
          return val
        }
      },
      init() {
        // 自定义配置灯箱  业务不需要  关闭 返回空
        gantt.showLightbox = (id) => {
          return
        }
        // 设置父项图标
        gantt.templates.grid_folder = function(item) {
          return "<div class='gantt_tree_icon gantt_folder_" +
          (item.$open ? "open" : "closed") + "'></div>";
        };
        // 全局布局
        gantt.config.layout = {
          css: "gantt_container",
          cols: [
            {
              width: 500, // 左边网格宽度
              min_width: 300,

              // adding horizontal scrollbar to the grid via the scrollX attribute
              rows: [
                { view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer" },
                { view: "scrollbar", id: "gridScroll" }
              ]
            },
            { resizer: true, width: 1 },
            {
              rows: [
                { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
                { view: "scrollbar", id: "scrollHor" }
              ]
            },
            { view: "scrollbar", id: "scrollVer" }
          ]
        };

        // 只读
        gantt.config.readonly = true;
        // 隐藏添加按钮
        gantt.templates.grid_row_class = (start, end, task) => {
          return "nested_task"
        };
        // 配置缩放
        gantt.config.scales = [
          { unit: "month", step: 1, format: this.monthScaleTemplate },
          { unit: "day", step: 5, format: "%j" }
        ];

        // 图例初始化
        gantt.config.columns = [
          { name: "text", label: "任务名称", width: "*", tree: true, width: 200 },
          { name: "start_date", label: "开始时间", align: "center", width: 200 },
          { name: "duration", label: "持续时间", align: "center", width: 200 },
          { name: "add", label: "", width: 100 }
        ];
        gantt.init(this.$refs.gantt)
        // 数据解析
        gantt.parse(this.tasks)

        // 重绘
        // gantt.render()
      }
    },
  }
</script>
<style lang="scss" scoped>
  .left-container {
    height: 600px;
  }

  .gantt_add {
    display: none !important;
  }

  .gantt_grid_head_add {
    display: none !important;
  }
</style>
<style>
  .gantt_add,
  .gantt_grid_head_add,
  .gantt_task_progress_drag,
  .gantt_link_point {
    display: none !important;
  }
</style>