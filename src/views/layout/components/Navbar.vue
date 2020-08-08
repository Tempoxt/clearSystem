<template>
<div>
	<div class="navbar">
   		<!-- <breadcrumb class="breadcrumb-container"/> -->
		<div class="nav-menu">
			<hamburger
				:toggle-click="toggleSideBar"
				:is-active="sidebar.opened"
				class="hamburger-container"
			/>
			<nav-menu/>
		</div>
		<div class="right-menu">
			<!-- <span class="right-menu-item">
				<el-tooltip class="item" effect="dark" content="搜索" placement="bottom">
					<i class="icon iconfont icon-sousuo1"></i>
				</el-tooltip>
			</span>
			<span class="right-menu-item message-item">
				<el-tooltip class="item" effect="dark" content="消息" placement="bottom">
					<i class="icon iconfont icon-xiaoxi"></i>
					<span class="count">99</span>
				</el-tooltip>
			</span>
			<span class="right-menu-item">
				<el-tooltip class="item" effect="dark" content="手机" placement="bottom">
					<i class="icon iconfont icon-shouji"></i>
				</el-tooltip>
			</span> -->
			<!-- <span class="right-menu-item" @click="openFile">
				<el-tooltip class="item" effect="dark" content="帮助" placement="bottom">
					<a style="color:#fff" target="_blank" :href="baseUrl+'使用说明.pdf'"><i class="icon iconfont icon-bangzhu"></i></a>
				</el-tooltip>
			</span> -->
			<span class="right-menu-item" @click="handleScreenfull">
				<el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
					<i class="icon iconfont icon-quanping"></i>
				</el-tooltip>
			</span>
			<template v-if="device!=='mobile'">
				<el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom"></el-tooltip>

				<el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom"></el-tooltip>
				<el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom"></el-tooltip>
			</template>

			<el-dropdown class="avatar-container right-menu-item" trigger="click">
				<div class="avatar-wrapper">
				<img src="http://cdn.admui.com/demo/pjax/2.0.0/images/avatar.svg" class="user-avatar">
				<!-- <span class="user-name">林夏</span> -->
				</div>
				<el-dropdown-menu slot="dropdown">
				<el-dropdown-item>{{userInfo.nam||'暂无名称'}}</el-dropdown-item>
				<!-- <el-dropdown-item @click.native="editPasswords">修改密码</el-dropdown-item> -->
				<!-- <router-link to="/">
					<el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
				</router-link>  @click="handleFormSubmit"-->
				<!-- <el-dropdown-item divided>
					<span style="display:block;" @click="logout">退出</span>
				</el-dropdown-item> -->
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
  
	<!-- <el-dialog
		title="修改密码"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		> -->
		<!-- <editPassword :showModal="dialogFormVisible" @close="close" /> -->

		<!-- <div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit">确 定</el-button>
		</div>
	</el-dialog> -->
</div>
 
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Hamburger from "@/components/Hamburger";
import NavMenu from "./NavMenu";
import screenfull from "screenfull";
// import editPassword from "../../account/editPassword.vue";
import auth from '@/utils/auth'
import qs from 'qs'
let baseUrl = process.env.VUE_APP_STATIC
export default {
	components: {
		Hamburger,
		NavMenu
		// editPassword
	},
	data(){
		return{
			// dialogFormVisible:false,
			showModal:false,
			form:{},
			baseUrl
		}
	},
	computed: {
		...mapGetters(["sidebar", "name", "device"]),
		...mapState({
		status: state => state.app.status,
		}),
		userInfo: {
			get() {
				return qs.parse(auth.getLogInfo())
			},
			set(val) {
				return val
			}
		}
	},
	created() {
		this.firstIn()
	},
	mounted() {
		console.log(qs.parse(auth.getLogInfo()))

		// if (qs.parse(auth.getLogInfo()).change_pwd === '0' || qs.parse(auth.getLogInfo()).change_pwd === 0) {
		// 	this.$nextTick(() => {
		// 		this.editPassword()
		// 	})
		// }
	},
	destroyed() {
		this.close()
	},
	// watch:{
	// 	$route(to,from){
	// 		console.log(to)
	// 		if (to.path === '/myDoc') {
	// 			this.userInfo = qs.parse(auth.getLogInfo())
	// 		}
	// 	}
	// },
	methods: {
		firstIn() {
			return setTimeout(() => {
				if (qs.parse(auth.getLogInfo()).change_pwd === '0' || qs.parse(auth.getLogInfo()).change_pwd === 0) {
					// this.editPasswords()
				}
			})
		},
		// close() {
		// 	this.dialogFormVisible = false
		// },
		openFile(){
		},
		// editPasswords(){
		// 	this.dialogFormVisible = true
		// },
		handleFormSubmit(){
			// console.log(this.form,'fff----')
		},
		handleScreenfull() {
			screenfull.toggle();
		},
		toggleSideBar() {
			this.$store.dispatch("toggleSideBar");
		},
		toggleStatus() {
			this.$store.commit("toggleStatus");
		},
		logout() {
			// this.$router.push("/account/login");
			auth.removeLogInfo()
			auth.removeToken()
			// this.$router.push({
			// 	path: '/account/login'
			// })
				window.location.href = '/account/login'
		}
	}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.nav-menu {
  display: flex;
}
.navbar {
  height: 60px;
  line-height: 60px;
  border-radius: 0px !important;
  @include themify($themes) {
    background: themed("primary");
    .el-menu {
      background: themed("primary");
    }
    .el-menu.el-menu--horizontal {
      border-bottom: none;
    }
  }

  // background: $primary-color;
  // border-left: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  .hamburger-container {
    line-height: 60px;
    height: 60px;
    padding: 0 10px;
    display: flex;
    align-items: center;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    height: 100%;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
      color: #fff;
      .iconfont {
		font-size:14px;
        cursor: pointer;
      }
    }
    .message-item {
      position: relative;
      margin-right: 18px;
      .count {
        display: inline-block;
        background: #fc316c;
        height: 13px;
        line-height: 15px;
        position: absolute;
        top: 15px;
        left: 15px;
        border-radius: 20px;
        padding: 0 5px;
      }
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 36px;
      padding: 0 16px;
      border-left: 1px solid #fff;
      // margin-right: 30px;
      display: flex;
      align-items: center;
      .avatar-wrapper {
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          vertical-align: middle;
        }
        .user-name {
          color: #fff;
          padding-left: 10px;
          cursor: pointer;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
