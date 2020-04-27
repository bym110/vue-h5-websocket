<template>
<div class="mine">
  <div class="info">
    <div class="title">我的</div>
    <div class="mineInfo">
      <img :src="icon.mineAvatar" alt="">
      <div>{{ loginInfo.loginName }}</div>
    </div>

  </div>
  <group>
    <cell :title="loginInfo.loginName" is-link>
      <img slot="icon" style="display:block;margin-right:5px;" :src="icon.mineAccount">
      <div slot @click="logoutShow">退出账号</div>
    </cell>
  </group>
  <tabbar>
    <template v-if="badge !== '0'">
      <tabbar-item link="/chatList" :badge="badge>99?'99+':badge">
        <img slot="icon" :src="icon.menuMessageDefault" alt="">
        <span slot="label">消息</span>
      </tabbar-item>
    </template>
    <template v-else>
      <tabbar-item link="/chatList">
        <img slot="icon" :src="icon.menuMessageDefault" alt="">
        <span slot="label">聊天</span>
      </tabbar-item>
    </template>
    <tabbar-item link="/contactList">
      <img slot="icon" :src="icon.menuAdressDefault" alt="">
      <span slot="label">通讯录</span>
    </tabbar-item>
    <tabbar-item link="/mine" selected>
      <img slot="icon" :src="icon.menuMineActive" alt="">
      <span slot="label">我的</span>
    </tabbar-item>
  </tabbar>
  <actionsheet v-model="showNotice" :menus="menus" @on-click-menu="handleMenuClick" show-cancel>
    <p slot="header">退出后，您将不能接受到消息</p>
  </actionsheet>
</div>
</template>

<script>
    import { Tabbar, TabbarItem,Icon, XHeader,Group,Cell,Actionsheet  } from 'vux'
    export default {
        name: "mine",
        components:{
            Tabbar,
            TabbarItem,
            Icon,
            XHeader,
            Group,
            Cell,
            Actionsheet
        },
        data() {
            return {
                showNotice:false,
                menus:{
                    menu1:'<span style="color:#FF5F5F">确认</span>',
                },
                newLoginInfo:{}
            }
        },
        computed:{
            loginInfo() {
                return this.$store.state.loginInfo
            },
            badge() {
                return this.$store.state.badge
            },
            chatList() {
                return this.$store.state.chatList
            }
        },
        watch:{
            chatList:{
                handler: function(chatList, oldVal) {
                    let arr = [];
                    if (chatList.length) {
                        chatList.map(val=>{
                            arr.push(val.unread)
                        });
                        this.badge = arr.reduce((total, num) =>{
                            return total + num
                        }); // 所有的未读消息求和
                    }

                    this.badge = this.badge.toString()
                    this.$store.state.badge = this.badge;
                },
                deep: true
            }
        },
        methods:{
            handleMenuClick(val) {
                if (val === 'menu1') {
                    this.$store.commit('logout');
                    this.$router.push({
                        name:'login'
                    })
                }
            },
            logoutShow() {
                this.showNotice = true
            },

        },
        mounted() {
        }
    }
</script>

<style lang="less">
  .mine {
    height: 100%;
    background: @default-grey-color;
    .info {
      background: url('../../assets/images/mineBg.svg');
      padding-bottom: 1.5em;
      .title {
        text-align: center;
        font-size: 18px;
        line-height: 46px;
        color: @button-global-font-color;
      }
      .mineInfo {
        text-align: center;
        color: @button-global-font-color;
        margin-top: 1em;
        font-size: 1.2em;
        img {
          margin-bottom: 2px;
          width: 3.5em;
          border-radius: 2em;
        }
      }

    }
    .weui-cells {
      width: 95%;
      border-radius: 2px;
      margin:1em auto 0;
      box-shadow:0px 2px 3px 1px rgba(0,0,0,0.05);
      &:before {
        height: 0;
        border-top: 0;
      }
      &:after {
        height: 0;
        border-bottom: 0;
      }
      .weui-cell__hd {
        img {
          width: 1.5em;
        }
      }
      .vux-label {
        color: #494B57;
      }
      .weui-cell_access {
        .weui-cell__ft {
          color: #939CB8;
          padding-top: 3px;
          &:after {
            border-color: @cell-default-arrow-color;
            width: 10px;
            height: 10px;
            border-width:1px 1px 0 0;
          }
        }
      }
    }
    .weui-tabbar {
      background: @tabbar-background-color;
      box-shadow:1px 1px 4px 0px rgba(0,0,0,0.18);
      &:before {
        height: 0;
        border-top: 0;
      }
    }
    .weui-actionsheet {
      background: transparent;
      width: 95%;
      left: 2.5%;
      .weui-actionsheet__menu {
        border-radius: 6px;
        .weui-actionsheet__cell p {
          color: #939CB8;
          font-size: .8em;
        }
      }
      .weui-actionsheet__action {
        border-radius: 6px;
        margin: 10px 0;
      }
    }
  }
</style>
