<template>
  <view-box class="login clearfix">
    <div class="loginPic">
      <img :src="icon.login" alt="">
    </div>
    <div class="loginTitle">登录</div>
    <group class="loginForm" style="float:left;">
      <x-input ref="companyCode" type="text" @on-focus="handleFocus(1)" @on-blur="handleBlur(1)" @on-change="handleChage(1)" v-model="loginForm.companyCode" :show-clear="false" :should-toast-error="false" placeholder="请输入企业标识码">
        <img slot="label" :src="icon.companyCode" alt="">
        <div slot="right" v-if="showClearCompanyCode">
          <icon type="clear" @click.native="handleClear(1)"></icon>
        </div>
      </x-input>
      <x-input ref="loginName" type="text" @on-focus="handleFocus(2)" @on-blur="handleBlur(2)" @on-change="handleChage(2)" v-model="loginForm.loginName" :show-clear="false" :should-toast-error="false" placeholder="请输入用户名">
        <img slot="label" :src="icon.userName" alt="">
        <div slot="right" v-if="showClearLoginName">
          <icon type="clear" @click.native="handleClear(2)"></icon>
        </div>
      </x-input>
      <x-input ref="loginPass" type="password" @on-focus="handleFocus(3)" @on-blur="handleBlur(3)" @on-change="handleChage(3)" v-model="loginForm.loginPass" :show-clear="false" :should-toast-error="false" placeholder="请输入登录密码">
        <img slot="label" :src="icon.password" alt="">
        <div slot="right" v-if="showClearLoginPass">
          <icon type="clear" @click.native="handleClear(3)"></icon>
        </div>
      </x-input>
      <div style="color: red;padding-left: 15px" v-if="showError">{{ errorTip }}</div>
    </group>
    <div class="submitBtn">
      <x-button @click.native="loginSubmit" style="border-radius: 99px;" type="primary">立即登录</x-button>
    </div>
    <loading :show="showLoading" text="loading"></loading>
  </view-box>
</template>

<script>
  import { ViewBox,XInput,Group,XButton,Loading,Icon } from 'vux'
    export default {
        name: "login",
        components: {
          XInput,
          Group,
          XButton,
          ViewBox,
          Loading,
          Icon
        },
      data() {
          return {
              loginForm:{
                companyCode:'',
                loginName:'',
                loginPass:''
              },
              showLoading:false,
              errorTip:'',
              showError:false,
              showClearCompanyCode:false,
              showClearLoginName:false,
              showClearLoginPass:false
          }
      },
      methods:{
        handleFocus(n) {
            if (n === 1) {
                if (this.loginForm.companyCode) {
                    this.showClearCompanyCode = true
                } else {
                    this.showClearCompanyCode = false
                }
            } else if (n === 2) {
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
                      this.showClearCompanyCode = false
                  },100)

              } else if (n === 2) {
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
            let arr=['标识码','用户名','密码']
            if (this.loginForm.companyCode) {
                arr = arr.filter(item=>{
                    return item !=='标识码'
                })
            }
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
              let loginInfo ={
                loginName:this.loginForm.loginName,
                companyCode:this.loginForm.companyCode
              };
              this.$store.commit('setLoginInfo',loginInfo);
              this.$router.push({
                name:'chatList'
              })
            } else {
                return false
            }
        },
          handleChage(n) {
              if (n === 1) {
                  if (this.loginForm.companyCode) {
                      this.showClearCompanyCode = true
                  } else {
                      this.showClearCompanyCode = false
                  }
              } else if (n === 2) {
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
                this.loginForm.companyCode = ''
                this.$refs['companyCode'].focus()
            } else if (n === 2) {
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
    }

  }
</style>
