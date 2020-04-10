<template>
<div class="groupInfo">
  <x-header :left-options="leftOptions" :title="'群名称('+groupMemberList.length+')'"  :right-options="{showMore: false}"></x-header>
  <div class="member" v-if="groupMemberList.length">
    <grid :cols="5" :show-vertical-dividers="false" :show-lr-borders="false">
      <grid-item v-for="(item,i) in groupMemberList" :key="i">
        <img slot="icon" :src="$avatarFormatter(item.headerPic)">
        <span slot="label">{{ item.nickName }}</span>
      </grid-item>
    </grid>
    <div v-if="showMoreBtn" class="moreBtn" @click="getGroupMemberList(true)">
      <span>查看更多群成员</span>
      <x-icon type="ios-arrow-right" size="20"></x-icon>
    </div>
  </div>
  <group v-if="Object.keys(groupData).length">
    <cell title="群名称" class="groupName">
      <slot>{{ groupData.groupName }}</slot>
    </cell>
    <cell title="群公告"></cell>
    <div class="groupNotice">
      {{ groupData.notice }}
    </div>
    <cell title="我在本群中的昵称">
      <slot>{{ groupData.nick_name }}</slot>
    </cell>
    <cell title="所属微信">
      <slot>{{ groupData.staffImNickName }}</slot>
    </cell>
  </group>
</div>
</template>

<script>
    import { XHeader,Grid, GridItem,Group,Cell  } from 'vux'
    export default {
        name: "groupInfo",
        components:{
            XHeader,
            Grid,
            GridItem,
            Group,
            Cell
        },
        data() {
            return {
                leftOptions:{
                    backText:'',
                    showBack:true
                },
                groupMemberList:[],
                groupInfo:{},
                groupData:{},// 群信息
                showMoreBtn:false,
            }
        },
        methods:{
            getGroupMemberList (flag) {// 群成员列表
              let params
              this.$store.dispatch('get',{url:'',params}).then(res=>{
                if (res.result) {
                  this.groupMemberList = res.result
                  if (params.pageSize >= res.totalRecord) {
                    this.showMoreBtn = false
                  } else {
                    this.showMoreBtn = true
                  }
                  resolve(res.result)
                }
              });

            },
            getGroupDetail () { //获取群信息
              let params={

              }
              this.$store.dispatch('get',{url:'',params}).then(res=>{
                if (res) {
                  resolve(res.result[0]);
                }
              });

            },
        },
        mounted() {
            let query = this.$route.query;
            this.groupInfo = query;
            this.getGroupMemberList().then(()=>{
                this.getGroupDetail()
            })
        }
    }
</script>

<style lang="less">
  .groupInfo {
    height: 100%;
    background: @default-grey-color;
    .member {
      background: @globe-bg-color;
      padding-bottom: .5em;
      .weui-grid{
        padding: 10px;
        &:after {
          border-bottom: 0;
        }
        .weui-grid__icon {
          width: 3em;
          height: 3em;
          img {
            border-radius: 2px;
          }
        }
        .weui-grid__label {
          font-size: .75em;
        }
      }
      .moreBtn {
        margin-top: .5em;
        text-align: center;
        height: 1.6em;
        line-height: 1.6em;
        color: @nick-name-color;
        .vux-x-icon {
          display: inline-block;
          fill: #6C7293;
          margin-bottom: -4px;
        }
      }

    }
    .groupNotice {
        color: @cell-value-color;
      padding: 0 15px 10px;
    }
    .weui-cells {
      margin-top: 10px;
      &:before {
        border-top: 0;
      }
      .weui-cell {
        &:before {
          left: 15px;
          width: 92%;
        }
        &.groupName {
          position: relative;
          .vux-cell-bd {
            position: absolute;
            top: 10px;
            min-width: 4em;
            .vux-label {
              font-size: .95em;
            }
          }
          .weui-cell__ft {
            width: calc(100% - 4em);
            padding-left: 4em;
            color: #6C7293;
            font-size: .95em;
          }
        }
        .vux-cell-bd {
          .vux-label {
            font-size: .95em;
          }
        }
        .weui-cell__ft {
          font-size: .95em;
        }
      }

    }
  }

</style>
