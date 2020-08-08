<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form vivify delay-200 popIn"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <span class="icon iconfont icon-logo"></span>
        <h3 class="title">{{appName}}</h3>
        <!-- <lang-select class="set-language"/> -->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="icon iconfont icon-geren" style="color:#fff"></i>
        </span>
        <el-input
          v-model="loginForm.username"
          placeholder="请输入工号"
          name="username"
          type="text"
          size="large"
          class="form-input"
          @blur="queryCode(loginForm.username)"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="icon iconfont icon-suoding" style="color:#fff"></i>
        </span>
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          placeholder="密码"
          name="password"
          @keyup.enter.native="handleLogin"
          size="large"
          class="form-input"
        />
        <span class="show-pwd" @click="showPwd">
          <!-- <svg-icon icon-class="eye"/> -->
        </span>
      </el-form-item>
      <el-form-item v-if="codeUrl !== ''"  prop="code">
        <span class="svg-container">
          <i class="icon iconfont icon-suoding" style="color:#fff"></i>
        </span>
        <el-input
          v-model="loginForm.code"
          placeholder="请输入验证码"
          maxlength="4"
          name="code"
          @keyup.enter.native="handleLogin"
          size="large"
          class="form-input-code"
        />
        <img class="code" :src="codeUrl" @click="queryCode(loginForm.username)"/>
        <span class="show-pwd" @click="showPwd">
          <!-- <svg-icon icon-class="eye"/> -->
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;height:48px"
        size="large"
        @click.native.prevent="handleLogin"
      >
        <i class="icon iconfont icon-queding"></i>
      </el-button>
    </el-form>

    <canvas id="space"></canvas>
  </div>
</template>

<script>
import * as api_account from "@/api/account";
import auth from '@/utils/auth'
const debugForm =
  process.env.NODE_ENV === "production"
    ? {}
    : {
        username: '',//'zhaowei3',//'1746',
        password: ''//'hgw@2018'//'shc6590436'
      };
import { mapGetters } from "vuex";
export default {
  name: "Login",
  computed: {
    ...mapGetters(["appName"])
    // logUserName() 
    //   return this.loginForm.username
    // }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (String(value).length < 1) {
        callback(new Error("请输入工号"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (String(value).length < 1) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      switch (value) {
        case value.split('').length < 1:
          callback(new Error('请输入验证码'));
          break;
        default:
          callback();
      }
    }
    
    return {
      timer: null,
      codeUrl: '',
      code: undefined,
      loginForm: {
        username: debugForm.username,
        password: debugForm.password,
        code: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        code: [
          { required: true, trigger: 'blur', validator: validateCode}
        ]
      },
      passwordType: "password",
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
    
  },
  created() {
 
    if(this.$store.state.app.status == 2){
  
      this.$store.commit("toggleStatus",1);
    }
     
  },
  // inject: ['reload'],
  mounted() {
    auth.removeToken()
    var imgs_url = require("@/assets/beijing1.jpg");
    var imgs = new Image();
    imgs.src = imgs_url;
    var flag = false;
    imgs.onload = function() {
      flag = true;
    };
    //based on an Example by @curran
    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame;
    })();
    var canvas = document.getElementById("space");
    var c = canvas.getContext("2d");

    var numStars = 1900;
    var radius = "0." + Math.floor(Math.random() * 9) + 1;
    var focalLength = canvas.width * 2;
    var warp = 0;
    var centerX, centerY;

    var stars = [],
      star;
    var i;

    var animate = true;

    initializeStars();

    function executeFrame() {
      if (animate) requestAnimFrame(executeFrame);
      moveStars();
      drawStars();
    }

    function initializeStars() {
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;

      stars = [];
      for (i = 0; i < numStars; i++) {
        star = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * canvas.width,
          o: "0." + Math.floor(Math.random() * 99) + 1
        };
        stars.push(star);
      }
    }

    function moveStars() {
      for (i = 0; i < numStars; i++) {
        star = stars[i];
        star.z--;

        if (star.z <= 0) {
          star.z = canvas.width;
        }
      }
    }

    function drawStars() {
      var pixelX, pixelY, pixelRadius;

      // Resize to the screen
      if (
        canvas.width != window.innerWidth ||
        canvas.width != window.innerWidth
      ) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeStars();
      }
      if (warp == 0) {
        c.fillStyle = "rgba(0,10,20,1)";
        // c.fillRect(0, 0, canvas.width, canvas.height);
        // c.fillRect(0, 0,300, 300);
      }
      if (flag) {
        c.drawImage(imgs, 0, 0, canvas.width, canvas.height);
      }

      c.fillStyle = "rgba(209, 255, 255, " + radius + ")";
      for (i = 0; i < numStars; i++) {
        star = stars[i];
        pixelX = (star.x - centerX) * (focalLength / star.z);
        pixelX += centerX;
        pixelY = (star.y - centerY) * (focalLength / star.z);
        pixelY += centerY;
        pixelRadius = 1 * (focalLength / star.z);
        c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
        c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
        c.fill();
      }
    }
    executeFrame();
  },

  methods: {
    requestCode(sta) {
      this.$request.get('/doc/get/auth/code/', {
        params: {sta: sta}
      }).then(
        data => {
          console.log(typeof data)
          if (typeof data === 'object') {
            this.codeUrl = ''
            this.loginForm.username.length > 0

          } else {
            this.codeUrl = process.env.VUE_APP_BASEAPI + '/server/doc/get/auth/code/?sta=' + sta + '&time=' + Math.random()
          }
        }
      )
    },
    queryCode(val) {
      if(this.timer){
          clearTimeout(this.timer) 
          this.timer = setTimeout(() => {this.requestCode(val)})
        }else{
          this.timer = setTimeout(() => {this.requestCode(val)})
        }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    async handleLogin() {
      this.loading = true;

      this.$refs['loginForm'].validate((val) => {
        if (!val) {
          this.loading = false;
          return
        } else {
          this.loading = false;
        }
      })
      try {
        const userInfo = await api_account.login(this.loginForm)
        if (userInfo.code !== 0) return this.$message({ type: 'error', message: userInfo.msg })
        else {this.$message({ type: 'success', message: userInfo.msg })}
        const { token } = userInfo.data;
        auth.removeLogInfo()
        this.$store.commit("user/SET_LOGINFO", userInfo.data);
        this.$store.commit("user/login", token);
        // this.$request.get('/doc/mydoc/',{params: {}})
        // this.reload()
        // this.$router.push({ path: "/myDoc"})
        window.location.href = '/myDoc'
      } catch (error) {
      } finally {
        this.loading = false;
      }

    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
#space {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 30px !important;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.form-input {
  font-size: 16px;
}
/deep/ .form-input-code {
  width: 70% !important ;
}
/deep/ .el-input {
  width: auto !important;
}
/deep/ .code {
  float: right !important;
  margin: 12px 10px 0 0 !important;
}
.code{
  width: 20%;
  height: 23px;
  vertical-align: middle

}
.bg {
  width: 100%;
  height: 300px;
  // background: url("~@/assets/xkbg.png") no-repeat center bottom;
  position: absolute;
  bottom: 0;
}
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  // background-color: $bg;
  // background: url("~@/assets/logo.png") no-repeat center bottom;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 480px;
    max-width: 100%;
    padding: 45px 40px 25px 40px;
    height: auto;
  
    margin: 0 auto;
    background: rgba(11, 178, 212, 0.35);
    // border-radius: 6px;
    border: 1px solid #0bb2d4;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    text-align: center;
    .title {
      font-size: 20px;
      color: $light_gray;
      margin: 20px auto 30px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
/deep/.v-modal {
  display: none !important;
}
</style>
<style lang="scss" scoped>
.icon-logo {
  color: #fff;
  font-size: 42px;
  text-align: center;
}

</style>
