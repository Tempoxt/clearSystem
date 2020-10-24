<template>
  <div id="home">
    <div class="outside">
                <rich-text @handlerCb="handlerCb">
                </rich-text>
    </div>
    
  </div>
</template>

<script>
  // @ is an alias to /src
  import richText from '@/components/public/richText'
  // import backlog from "@/views/hrfront/workbench/backlog"
  // import attendanceManagement from "@/views/hrfront/workbench/attendanceManagement"
  // import stickyNote from "@/views/hrfront/workbench/stickyNote"
  // import systemMessages from "@/views/hrfront/workbench/systemMessages"
  // import weater from "@/views/hrfront/workbench/weater"
  // import quickEntry from "@/views/hrfront/workbench/quickEntry"
  // import workSchedule from "@/views/hrfront/workbench/workSchedule"

  export default {
    name: 'rich',
    data() {
      return {}
    },
    components: {
      richText
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