<template>
  <div id="home">
    <div class="outside">
      <!-- <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"> -->
          
          <!-- <el-row style="padding-bottom:30px;">
            <el-col :span="12">
              <accident></accident>
            </el-col>
            <el-col :span="12" v-if="personnel.length>0">
              <personnel :datas="personnel" title="待转正员工"></personnel>
            </el-col>
            <el-col :span="12" v-if="payAdjust.length>0">
              <payAdjust :datas="payAdjust" title="调薪员工"></payAdjust>
            </el-col>
          </el-row> -->
      <!-- </el-scrollbar> -->
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
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

    }
  },
  components: {
    HelloWorld
    // quickEntry,
    // backlog,
    // attendanceManagement,
    // systemMessages,
    // stickyNote,
    // weater,
    // workSchedule,
  }
}
</script>

<style lang="scss">
.outside{
  height: 100%;
	background: #F5FAFB;
}
// .maxheight{
// 	height: 500px;
// }

#home{
  .iconfont{
    margin-right: 10px;
    margin-top: -2px;
  }
  .box-card{
    margin-bottom: 15px;
    .box-card-header{
      padding: 10px 0;
      border-bottom: 1px solid #CCD5DB;
    }
  }
  .cardName{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    color: #37474F;
    font-size: 16px;
    font-weight: bold
  }
  .el-card__header{
    padding: 0 20px;
    border-bottom: 0;
  }
  .el-card__body{
    padding: 0 20px;
  }
  .selectdate{
    .el-date-editor{
      width: 120px;
    }
  }
  .el-calendar-table{
    .el-calendar-day {
      height: 31px;
    }
    thead th {
      padding: 6px 0;
    }
  }
  .el-calendar__body {
    padding: 20px 0px 32px;
  }
  .el-calendar__header {
    padding: 0px;
  }
  // .el-card__body {
  // 	height: 360px;
  // }
  .speech-mode .el-card__body{
    height: 100%;
    .box-card-c{
      height: 100%;
    }
  }
  .el-row .el-col:nth-child(n) .dateLap{
    right: 20px!important;
  }
}

</style>

<style lang="scss" scoped>
.box-card {
	width: 100%;
	padding-top: 15px;
	margin-top: 10px;
	.box-card-c.box-card-c2{
		height: 100%;
	}
	.box-card-c {
		height: 350px;
	}
}
 .el-popper{
	height: 500px!important;
}
.scroll {
  height: calc(100% - 30px);
	/deep/ .scrollbar-wrapper {
		overflow-x: hidden;
	}
	/deep/ .el-scrollbar__view{
		width: calc(100% - 5px);
	}
}
#home{
	background: #F5FAFB;
	height: 100%;
	padding: 20px 20px 0 20px;
	.selectdate{
		display: inline-block;
		margin-left: 60px;
	}
	.operating-btn{
		text-align: right;
	}
	.padding-left-10{
		padding-left: 10px
	}
	.speech-mode{
		position: fixed;
		top: 0;
		left: 0;
		margin-top: 0;
		z-index: 99;
		width: 100%;
		height: 100%;
	}
	.dateLap{
		position: absolute;
		top: 23px;
	}
	.absoSelect{
		position: absolute;
		top: 23px;
		right: 240px;
		width: 20%;
		.el-input__inner{
			border-radius: 0;
		}
	}
	.relative{
		position: relative;
	}
	.totalR{
		font-size: 16px;
		font-weight: bold;
		position: absolute;
		bottom: 40px;
		left: 0;
		right: 0;
		height: 0;
		display: flex;
		justify-content: center;
	}
}
	
</style>