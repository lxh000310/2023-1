<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
    </div>
    <div
      class="page-login--layer page-login--layer-time"
      flex="main:center cross:center">
      {{time}}
    </div>
    <div class="page-login--layer">
      <div
        class="page-login--content"
        flex="dir:top main:justify cross:stretch box:justify">
        <div class="page-login--content-header">
        </div>
        <div
          class="page-login--content-main"
          flex="dir:top main:center cross:center">
          <div class="page-login--form" style="width: 400px;">
            <el-card shadow="never">
              <el-form
                ref="loginForm"
                label-position="top"
                :model="formLogin"
                size="default">
                <el-form-item prop="username">
                  <el-input
                    type="text"
                    v-model="formLogin.username"
                    placeholder="用户名">
                    <i slot="prepend" class="fa fa-user-circle-o">用户名</i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="formLogin.password"
                    placeholder="密码">
                    <i slot="prepend" class="fa fa-keyboard-o">密 码</i>
                  </el-input>
                </el-form-item>

                <!-- <el-form-item prop="code">
                  <el-input
                    type="text"
                    v-model="formLogin.code"
                    placeholder="验证码"
                    style="width:200px;">
                    <i slot="prepend" class="fa fa-keyboard-o">验证码</i>
                  </el-input>
                  <img :src="codeUrl" @click="getnewCode" alt="" style="position: absolute;top: 0;width: 120px;right: 0;">
                </el-form-item> -->


                <el-button
                  size="default"
                  @click="submit"
                  type="primary"
                  class="button-login">
                  登录
                </el-button>
              </el-form>
            </el-card>
          </div>
        </div>
        <div class="page-login--content-footer">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import  dayjs  from 'dayjs'
import JSEncrypt from 'jsencrypt'
import { mapActions } from 'vuex'
import {exMessage, changeEx, getNewKey , exLongMessage} from '@/libs/exJSE.js'
import { Login , AboutKey , getPermitList , getUserInfoS , getPathList , getCap , getInfo} from '@/api/Login.js'
import util from '@/libs/util.js'
import store from '@/store/index'


export default {
  data () {
    return {
      timeInterval: null,
      codeUrl:'http://192.168.3.36:8081/volvo/oms/api/oms-login/sys/admin/getCaptcha',
      time: dayjs().format('HH:mm:ss'),
      uuid:'',
      // 表单
      formLogin: {
        username: '',
        password: '',
        // code:''
      }
    }
  },
  mounted () {
    /*this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000);
    getNewKey();
    this.uuid=this.guid();
    this.getnewCode();*/
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },
  methods: {
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },

    submit(){
      /*var date = new Date();
      if(util.cookies.get('expire') > date.getTime()){
        console.log("未过期");
        this.dosubmit()
      }else{
        getNewKey();
        setTimeout(function () {
          this.dosubmit()
        },1000)
      }*/
      this.dosubmit();
    },

    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    getnewCode(){
      this.codeUrl = "http://192.168.3.36:8081/volvo/oms/api/oms-login/sys/admin/getCaptcha?uuid="+this.uuid+'&m='+ Math.random();
    },

    dosubmit () {
      if(this.formLogin.username == ""){
        this.$message({
          type: 'error',
          message: '请先输入账号'
        })
      }else if(this.formLogin.password == ""){
        this.$message({
          type: 'error',
          message: '请先输入密码'
        })
      }else{
        const obj = {
          account: this.formLogin.username,
          password: this.formLogin.password,
          // captcha:this.formLogin.code,
          // uuid:this.uuid
        };
        Login(obj).then(res => {
          // console.log(1, res);
          if(res.code == 0){
            const token = res.data;
            console.log(1, token);
            util.cookies.set("name", this.formLogin.username);
            util.cookies.set("token", token);
            this.$router.push({name: 'index'}); // 登录完成跳转到首页
          }else{
            if(res.code===503) {
              this.formLogin.password = "";
            }
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      }
    },

    //获取按钮级别权限
    /*getPathList(){
      getPathList().then(res => {
        console.log(res.pathList);
        if(res.code == 0){
          for(var i = 0;i < res.pathList.length; i++){
            UserRole.push(res.pathList[i].url);
          }
//          this.$store.dispatch('d2admin/page/closeAll')
          getInfo().then(res => {
            if(res.code == 0){
              util.cookies.set("name",res.userVo.name);
              var nowDate = new Date();
              var changeDate = new Date(res.userVo.passwordUpdated.split(" ")[0]);
              var times = 85 * 86400000//85天提示改密码
              if(nowDate.getTime() < changeDate.getTime()+times){
                this.$router.push({path:"/page1"});
              }else{
                this.$router.push({path:'/updatePassword'})
              }
            }
          })
        }else if(res.code == 503){
          this.$router.push({path:'/updatePassword'})
        }
      })
    }*/
  }
}
</script>

<style lang="scss">
.page-login {
  @extend %unable-select;
  $backgroundColor: #F0F2F5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
    }
  }
  // main
  .page-login--logo {
    width: 240px;
    margin-bottom: 2em;
    margin-top: -2em;
  }
  // 登录表单
  .page-login--form {
    width: 280px;
    // 卡片
    .el-card {
      margin-bottom: 15px;
    }
    // 登录按钮
    .button-login {
      width: 100%;
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }
    .login-code {
      height: 40px - 2px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
    }
    .page-login--quick {
      width: 100%;
    }
  }
  // 快速选择用户面板
  .page-login--quick-user {
    @extend %flex-center-col;
    padding: 10px 0px;
    border-radius: 4px;
    &:hover {
      background-color: $color-bg;
      i {
        color: $color-text-normal;
      }
      span {
        color: $color-text-normal;
      }
    }
    i {
      font-size: 36px;
      color: $color-text-sub;
    }
    span {
      font-size: 12px;
      margin-top: 10px;
      color: $color-text-sub;
    }
  }
  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-locales {
      padding: 0px;
      margin: 0px;
      margin-bottom: 15px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
        margin: 0 .5em;
        &:hover {
          color: $color-text-main;
        }
      }
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #FFF;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0%{
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100%{
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
