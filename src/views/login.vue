<template>
  <view-box class="login clearfix">
    <div class="loginPic">
      <img :src="icon.login" alt="">
    </div>
    <div class="loginTitle">登录</div>
    <group class="loginForm" style="float:left;">
      <x-input ref="loginName" type="text" @on-focus="handleFocus(1)" @on-blur="handleBlur(1)" @on-change="handleChage(1)" v-model="loginForm.loginName" :show-clear="false" :should-toast-error="false" placeholder="请输入用户名">
        <img slot="label" :src="icon.userName" alt="">
        <div slot="right" v-if="showClearLoginName">
          <icon type="clear" @click.native="handleClear(2)"></icon>
        </div>
      </x-input>
      <x-input ref="loginPass" type="password" @on-focus="handleFocus(2)" @on-blur="handleBlur(2)" @on-change="handleChage(2)" v-model="loginForm.loginPass" :show-clear="false" :should-toast-error="false" placeholder="请输入登录密码">
        <img slot="label" :src="icon.password" alt="">
        <div slot="right" v-if="showClearLoginPass">
          <icon type="clear" @click.native="handleClear(3)"></icon>
        </div>
      </x-input>
      <div style="color: red;padding-left: 15px" v-if="showError">{{ errorTip }}</div>
    </group>
    <div class="submitBtn">
      <x-button @click.native="loginSubmit" style="border-radius: 99px;" type="primary">立即登录</x-button>
      <a class="register" href="javascript:;" @click="showRegister=true">注册</a>
    </div>
    <loading :show="showLoading" text="loading"></loading>
    <div v-transfer-dom>
      <x-dialog v-model="showRegister" hide-on-blur class="dialog-demo">
        <div style="padding:15px;">
          <div>
            <x-input ref="loginName" type="text" @on-focus="handleFocus(1)" @on-blur="handleBlur(1)" @on-change="handleChage(1)" v-model="loginForm.loginName" :show-clear="false" :should-toast-error="false" placeholder="请输入用户名">
              <img slot="label" :src="icon.userName" alt="">
              <div slot="right" v-if="showClearLoginName">
                <icon type="clear" @click.native="handleClear(2)"></icon>
              </div>
            </x-input>
            <x-input ref="loginPass" type="password" @on-focus="handleFocus(2)" @on-blur="handleBlur(2)" @on-change="handleChage(2)" v-model="loginForm.loginPass" :show-clear="false" :should-toast-error="false" placeholder="请输入登录密码">
              <img slot="label" :src="icon.password" alt="">
              <div slot="right" v-if="showClearLoginPass">
                <icon type="clear" @click.native="handleClear(3)"></icon>
              </div>
            </x-input>
            <div style="color: red;padding-left: 15px;text-align: left" v-if="showError">{{ errorTip }}</div>
            <x-button @click.native="register" style="border-radius: 99px;margin-top: 2em;" type="primary">立即注册</x-button>
          </div>
        </div>

      </x-dialog>
    </div>
  </view-box>
</template>

<script>
  import { ViewBox,XInput,Group,XButton,Loading,Icon,XDialog,TransferDomDirective as TransferDom } from 'vux'
    export default {
        name: "login",
        directives: {
          TransferDom
        },
        components: {
          XInput,
          Group,
          XButton,
          ViewBox,
          Loading,
          Icon,
          XDialog
        },
      data() {
          return {
            loginForm:{
              loginName:'',
              loginPass:''
            },
            showLoading:false,
            errorTip:'',
            showError:false,
            showClearLoginName:false,
            showClearLoginPass:false,
            showRegister:false
          }
      },
      methods:{
        handleFocus(n) {
            if (n === 1) {
              if (this.loginForm.loginName) {
                  this.showClearLoginName = true
              } else {
                  this.showClearLoginName = false
              }
            } else {
                if (this.loginForm.loginPass) {
                    this.showClearLoginPass = true
                } else {
                    this.showClearLoginPass = false
                }
            }
            this.showError = false
        },
          handleBlur(n) {
             if (n === 1) {
                setTimeout(()=>{
                    this.showClearLoginName = false
                },100)
              } else {
                  setTimeout(()=>{
                      this.showClearLoginPass = false
                  },100)

              }
          },
        valideForm() {
            let arr=['用户名','密码']
            if (this.loginForm.loginName) {
                arr = arr.filter(item=>{
                    return item !=='用户名'
                })
            }
            if (this.loginForm.loginPass) {
                arr = arr.filter(item=>{
                    return item !=='密码'
                })
            }
            if (arr.length) {
                this.errorTip = arr.join('/')+'未输入';
                this.showError = true
                return false
            } else {
                this.showError = false
                return true
            }
        },
        loginSubmit() {
            if (this.valideForm()) {
              let data = JSON.parse(JSON.stringify(this.loginForm))
              this.$store.dispatch('post',{url:'chat/login',data:data}).then((res)=>{
                console.log(res)
                if (res.code === 0) {
                  let loginInfo ={
                    loginName:res.data.login_name,
                    staffId:res.data.id
                  };
                  this.$store.commit('setLoginInfo',loginInfo);
                  this.$router.push({
                    name:'chatList'
                  })
                } else if (res.code === 3) {
                  this.showError = true
                  this.errorTip='用户不存在'
                } else if (res.code === 4) {
                  this.showError = true
                  this.errorTip='密码不正确'
                }
              })
            } else {
                return false
            }
        },
        register() {
          if (this.valideForm()) {
            let data = JSON.parse(JSON.stringify(this.loginForm))
            this.$store.dispatch('post',{url:'chat/register',data:data}).then((res)=>{
              if (Number(res.code) === 0) {
                this.showRegister = false
              }
            })
          } else {
            return false
          }
        },
        handleChage(n) {
            if (n === 1) {
                if (this.loginForm.loginName) {
                    this.showClearLoginName = true
                } else {
                    this.showClearLoginName = false
                }
            } else {
                if (this.loginForm.loginPass) {
                    this.showClearLoginPass = true
                } else {
                    this.showClearLoginPass = false
                }
            }
        },
        handleClear(n) {
          if (n === 1) {
              this.loginForm.loginName = ''
              this.$refs['loginName'].focus()
          } else {
              this.loginForm.loginPass = ''
              this.$refs['loginPass'].focus()
          }
        }
      }
    }
</script>
<style lang="less">
  .login {
    width: 100%;
    height: 100%;
    .weui-tab__panel {
      padding-bottom: 0;
    }
    .loginPic {
      float: left;
      width: 100%;
      margin-top: 5em;
      margin-bottom: 2em;
      text-align: center;
    }
    .loginTitle {
      color: #494B57;
      font-weight:600;
      font-size:1.5em;
      padding-left: 2em;
    }
    .loginForm {
      float: left;
      width: 100%;
      box-sizing: border-box;
      padding:0 2em;
      margin-bottom: 2em;
      .weui-cells {
        margin-top: .8em;
        &:before {
          height: 0;
          border-top: 0;
        }
        &:after {
          border-bottom: 0;
        }
        .weui-cell {
          padding-bottom: 5px;
          margin-bottom: .75em;
          &:before {
            border-top: 0;
          }
          &:after {
            content: '';
            width: calc(100% - 30px);
            border-bottom: 1px solid #B6BACD;
            position: absolute;
            left: 15px;
            /* top: 0; */
            /* right: 0; */
            bottom: 0;
            height: 1px;
            color: #D9D9D9;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
          }
          .weui-cell__hd {
            img {
              float: left;
              width: 1.7em;
            }
          }
        }

      }
      .weui-input {
        font-size: 1em;
        &::-webkit-input-placeholder { /* WebKit, Blink, Edge */
          color: @search-placeholder-login-color;
        }

        &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: @search-placeholder-login-color;
        }

        &::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: @search-placeholder-login-color;
        }

        &:-ms-input-placeholder { /* Internet Explorer 10-11 */
          color: @search-placeholder-login-color;
        }
      }
      .weui-icon-warn {
          &:before {
            font-size: 21px;
          }
      }
    }
    .submitBtn {
      float: left;
      box-sizing: border-box;
      width: 100%;
      padding: 0 3em;
      .weui-btn {
        font-size: 1.2em;
        &:after {
          border: 0;
        }
      }
      .changeBtn {
        text-align: center;
        margin-top: 1em;
        a {
          color: @nick-name-color;
          font-size: 1em;
        }
      }
      .register {
        color: @button-primary-bg-color;
        float: right;
        margin-top: 1em;
      }
    }

  }
</style>
