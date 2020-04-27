<template>
    <div class="home">
      <x-header :left-options="leftOptions" :title="title"  :right-options="{showMore: false}">
        <img v-if="$route.name ==='contactList'" slot="right" :src="icon.refresh" alt="" @click="refresh">
      </x-header>
      <div class="search">
        <img class="searchIcon" :src="icon.search" alt="">
        <input class="searchText" v-model="searchKey" :placeholder="placeholder" @input="searchChange" type="text">
        <img v-show="searchKey" @click="clearSearch" class="searchClean" :src="icon.close" alt="">
      </div>
      <view-box class="main" :style="{height:showTab?'calc(100% - 146px)':'calc(100% - 96px)'}">
        <router-view :search-key="searchKey" :clickNum="clickNum" @handleEvent="getChatList"></router-view>
      </view-box>
      <tabbar v-if="showTab" @on-index-change = 'menuChange'>
        <template v-if="badge!== '0'">
          <tabbar-item link="/chatList" :selected="$route.name ==='chatList'" :badge="badge>99?'99+':badge">
            <img slot="icon" :src="$route.name ==='chatList'?icon.menuMessageActive:icon.menuMessageDefault" alt="">
            <span slot="label">消息</span>
          </tabbar-item>
        </template>
        <template v-else>
          <tabbar-item link="/chatList" :selected="$route.name ==='chatList'">
            <img slot="icon" :src="$route.name ==='chatList'?icon.menuMessageActive:icon.menuMessageDefault" alt="">
            <span slot="label">消息</span>
          </tabbar-item>
        </template>
        <tabbar-item link="/contactList" :selected="$route.name ==='contactList'">
          <img slot="icon" :src="$route.name ==='contactList'?icon.menuAdressActive:icon.menuAdressDefault" alt="">
          <span slot="label">通讯录</span>
        </tabbar-item>
        <tabbar-item link="/mine" :selected="$route.name ==='mine'">
          <img slot="icon" :src="$route.name ==='mine'?icon.menuMineActive:icon.menuMineDefault" alt="">
          <span slot="label">我的</span>
        </tabbar-item>
      </tabbar>
    </div>
</template>

<script>
  import { ViewBox,Tabbar, TabbarItem,Icon, XHeader } from 'vux'

  export default {
      components: {
        ViewBox,
        Tabbar,
        TabbarItem,
        Icon,
        XHeader
      },
      data() {
        return {
            searchKey:'',
            leftOptions:{
                backText:'',
                showBack:false
            },
            showTab:true,
            title:'消息',
            clickNum:0,
            badge:'0',
            placeholder:'搜索姓名',
          data:[
            {
              id:1,
              createTime:'2020-04-10 10:21:45',
              unread:0,
              nickName:'妮妮',
              headPic:'',
              contentType:1,
              chatContent:'测试'
            }
          ]
        }
      },
      methods:{
          getChatList() {
            this.$store.commit('setChatList',this.data);
          },
          searchChange(e) {
          },
          menuChange(val) {
          },
          clearSearch() {
              this.searchKey = ''
          },
          refresh() {
              this.clickNum +=1
          }

      },
      watch:{
          $route:function(to) {
              switch (to.name) {
                  case 'chatList':
                      this.leftOptions.showBack = false;
                      this.title = '消息';
                      this.placeholder='搜索姓名'
                      this.showTab = true
                      this.getChatList(); // 获取最近联系人列表
                      break;
                  case 'contactList':
                      this.leftOptions.showBack = false;
                      this.title = '通讯录';
                      this.placeholder='搜索好友姓名'
                      this.showTab = true
                      break;
                  case 'groupList':
                      this.leftOptions.showBack = true;
                      this.title = '群聊';
                      this.showTab = false;
                      this.placeholder='搜索群名称'
                      break;
                  default:
                  break;
              }
              this.searchKey = ''
          },
          searchKey:function () {
              this.getChatList()
          },
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
      computed:{
        loginInfo() {
            return this.$store.state.loginInfo
        },
        chatList() {
            return this.$store.state.chatList
        }
      },
      mounted() {
          switch (this.$route.name) {
              case 'chatList':
                  this.leftOptions.showBack = false;
                  this.title = '消息';
                  this.showTab = true
                  this.placeholder='搜索姓名'
                  this.getChatList();
                  break;
              case 'contactList':
                  this.leftOptions.showBack = false;
                  this.title = '通讯录';
                  this.showTab = true
                  this.placeholder='搜索好友姓名'
                  break;
              case 'groupList':
                  this.leftOptions.showBack = true;
                  this.title = '群聊';
                  this.showTab = false
                  this.placeholder='搜索群名称'
                  break;
              default:
                  break;
          }
      }
  }
</script>

<style lang="less">
  .home {
    height: 100%;
    .vux-header {

    }
    .search {
      padding: 10px;
      box-sizing: border-box;
      height: 50px;
      background: @default-grey-color;
      position: relative;
      .searchIcon {
        position: absolute;
        left: 20px;
        top: 1.1em;
        height: 1em;
      }
      .searchClean {
        position: absolute;
        right: 20px;
        top: 16px;
      }
      .searchText {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        box-sizing: border-box;
        font-size: 1em;
        border: 0;
        outline:none;
        padding-left: 30px;
        &::-webkit-input-placeholder { /* WebKit, Blink, Edge */
          color:   @search-placeholder-font-color;
        }
        &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: @search-placeholder-font-color;
        }
        &::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: @search-placeholder-font-color;
        }
        &:-ms-input-placeholder { /* Internet Explorer 10-11 */
          color: @search-placeholder-font-color;
        }
      }
    }
    .main {
      height: calc(100% - 149px);
      .weui-tab__panel {
        padding-bottom: 0;
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
  }
</style>
