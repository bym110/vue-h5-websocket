<template>
<div class="contactList" v-if="showPage">
  <template v-if="allTotal || groupTotal">
    <group class="groupCell">
      <cell is-link link="/groupList">
        <div slot="title">
          <img class="avatar" :src="icon.groupDefault" alt="">
          <span class="allTitle">
          <span class="title">群聊</span>
          <span class="subTitle">共{{ groupTotal }}个</span>
        </span>
        </div>
      </cell>
    </group>
    <template v-if="searchKey && !allTotal">
      <div class="showNull" v-html="showNullText"></div>
    </template>
    <template v-else>
      <group class="linkmanList">
        <template v-for="item in contactList">
          <cell @click.native="handleClick(item)">
            <div slot="title">
              <img class="avatar" :src="$avatarFormatter(item.contactImAppHeaderPic)" alt="">
              <div class="allTitle">
                <span class="title" v-html="item.contactImAppNickName"></span>
                <span class="subTitle">所属微信：{{item.staffImNickName}}</span>
              </div>
            </div>
          </cell>
        </template>
        <div class="totalTip">共{{ allTotal }}个微信好友</div>
      </group>
    </template>
  </template>
  <template v-else>
    <div style="background: #ffffff;height: 100%;">
      <div class="listNull">
        <img :src="icon.nothing" alt="">
        <div class="nullText">
          还没有能聊的对象，<br>
          需要登录PC扫码同步微信好友或联系管理员分配～
        </div>
        <x-button @click.native="refresh()" style="border-radius: 99px;" type="primary">立即同步</x-button>
      </div>
    </div>
  </template>
  <toast v-model="showToast" :width="allTotal || groupTotal?'7em':'13em'" position="bottom" type="text">
    <div slot v-if="allTotal || groupTotal">
      <img :src="icon.success" alt="">
      <span>同步成功</span>
    </div>
    <div slot v-else>
      <img :src="icon.error" alt="">
      <span>没找到可以同步的好友</span>
    </div>
  </toast>
</div>
</template>
<script>
  import { Group, Cell,XButton,Toast,Icon  } from 'vux'
    export default {
        name: "contactList",
        props:{
            searchKey: String,
            clickNum:Number
        },
        components:{
            Group,
            Cell,
            XButton,
            Toast,
            Icon
        },
        watch:{
            searchKey:function () {
                this.getContactList()
            },
            clickNum:function () {
                this.refresh()
            }
        },
        data() {
            return {
                contactList:[],
                searchObj:{
                    value:'',
                    name:"key",
                    operation:"LIKE",
                    type:"string"
                },
                groupTotal:0,
                showNullText:'',
                showToast:false,
                errorTip:'',
                showPage:true,
                allTotal:0,
            }
        },
        methods:{
            refresh() {
                this.getContactList().then(allTotal=>{
                    return this.getGroupTotal()
                }).then(groupTotal=>{
                    this.showToast = true;
                })
            },
            getContactList() { // 获取联系人列表
                return new Promise(resolve => {
                    let params={
                    };
                    this.$store.dispatch('get',{url:'',params}).then(res=>{
                        if (res.result) {
                            if (this.searchKey) {
                                this.contactList = res.result;
                                let regExp = new RegExp(this.searchObj.value, 'g');
                                this.contactList.map(val=>{
                                    val.contactImAppNickName =val.contactImAppNickName.replace(regExp, "<span style='color:#f5a623'>" + this.searchObj.value + '</span>');
                                });
                                if (!this.contactList.length) {
                                    this.showNullText = '未找到“<span style="color:#f5a623">'+this.searchKey+'</span>”关键字的结果'
                                }
                            } else {
                                this.contactList = res.result;
                            }
                            this.allTotal = res.totalRecord
                            resolve(res.totalRecord)
                        }
                    });
                })

            },
            getGroupTotal () {// 获取群总数
                return new Promise(resolve => {
                    let params={
                    };
                    this.$store.dispatch('get',{url:'',params}).then(res=>{
                        if (res) {
                            this.showPage =true;
                            this.groupTotal = res.totalRecord;
                            resolve(res.totalRecord)
                        }
                    });
                })

            },
            handleClick(row) {
                row.targetId=row.contactImIdInApp
                row.targetType=1
                this.$router.push({
                    name: 'personalInfo',
                    query:row
                })
            }
        },
        mounted() {
            this.showPage =false;
            this.getGroupTotal().then(()=>{
                this.getContactList();
            })
        }
    }
</script>

<style lang="less">
.contactList {
  height: 100%;
  background: @default-grey-color;
  .groupCell {
    .weui-cells {
      margin-top: 0;
      box-sizing: border-box;
      .weui-cell_access {
        .weui-cell__ft {
          &:after {
            border-color: @cell-default-arrow-color;
            width: 10px;
            height: 10px;
            border-width:1px 1px 0 0;
          }
        }
      }
      &:before,&:after {
        height: 0;
        border-bottom: 0;
        border-top: 0;
      }
    }
  }
  .linkmanList {
    height: calc(100% - 76px);
    margin-top: 10px;
    overflow: auto;
    .weui-cells {
      margin-top: 0;
      &:before,&:after {
        height: 0;
        border-bottom: 0;
        border-top: 0;
      }
      .weui-cell {
        &:before {
          right: 15px;
          border-color: @default-grey-color;
        }
      }
    }
    .totalTip {
      margin-top: 8px;
      font-size: .8em;
      text-align: center;
      color: @group-total-color;
      margin-bottom: 10px;
    }
  }
  .vux-label {
    float: left;
    .avatar {
      width: 2.7em;
      float: left;
      margin-right: 12px;
      border-radius: 2px;
    }
    .allTitle {
      display: inline-block;
      float: left;
      .title {
        display: block;
        font-size: 1em;
        color: @nick-name-color;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        width: 12em;
        height: 1.4em;
      }
      .subTitle {
        display: block;
        font-size: .8em;
        color: @subNick-name-color;
      }
    }
  }
  .listNull {
    box-sizing: border-box;
    padding: 5em 2em 0;
    text-align: center;
    img {
      width: 3em;
    }
    .nullText {
      margin: 10px 0 ;
      font-size: .8125em;
      color: #6C7293;
    }
    .weui-btn {
      font-size: 1em;
      &:after {
        border: 0;
      }
    }
  }
  .weui-toast.vux-toast-bottom {
    bottom: 60px;
    img {
      margin-bottom: -5px;
    }
  }
}
</style>
