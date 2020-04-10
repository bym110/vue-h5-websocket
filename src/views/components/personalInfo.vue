<template>
  <div class="personalInfo">
    <x-header :left-options="leftOptions" title="个人资料" :right-options="{showMore: false}"></x-header>
    <group v-if="Object.keys(targetInfo).length">
      <cell>
        <div slot="title">
          <img class="avatar" :src="$avatarFormatter(targetInfo.contactImAppHeaderPic)" alt="">
          <span class="allTitle">
              <span class="title">{{ targetInfo.contactImAppNickName }}</span>
              <span class="subTitle">备注：{{ targetInfo.contacImAppNote }}</span>
              <span class="subTitle">所属微信：{{ targetInfo.staffImNickName }}</span>
              <span class="subTitle">地区：{{ targetInfo.contactArea }}</span>
            </span>
        </div>
      </cell>
    </group>
    <x-button v-if="Object.keys(targetInfo).length" type="primary" @click.native="sendMessage" style="border-radius:99px;">发消息</x-button>
  </div>
</template>

<script>
    import { XHeader,Group,Cell,XButton  } from 'vux'
    export default {
        name: "personalInfo",
        components:{
            XHeader,
            Group,
            Cell,
            XButton
        },
        data() {
            return {
                leftOptions:{
                    backText:'',
                    showBack:true
                },
                targetInfo:{},
                chatTargetInfo:{}
            }
        },
        methods:{
            getTargetFriendInfo () { // 个人信息
                let params ={

                }
                this.$store.dispatch('get',{url:'',params}).then(res=>{
                    if (res.result) {
                        this.targetInfo = res.result[0];

                    }
                });
            },
            sendMessage() {
                this.targetInfo.targetType = 1;
                this.$router.push({
                    name:'chat',
                    query:this.chatTargetInfo
                })
            }
        },
        mounted() {
            let params= this.$route.query;
            this.chatTargetInfo = params;
            this.getTargetFriendInfo(params.targetId)
        }
    }
</script>

<style lang="less">
  .personalInfo {
    height: 100%;
    background: @default-grey-color;
    .weui-cells {
      margin-top: 0;
      &:before,&:after {
        height: 0;
        border-bottom: 0;
        border-top: 0;
      }
      .weui-cell {
        margin-top: 0;
        &:before {
          right: 15px;
          border-color: @default-grey-color;
        }
        .weui-cell__ft {
          font-size: 0.8em;
          position: absolute;
          right: 15px;
          top: 13px;
        }
      }

    }
    .vux-label {
      float: left;
      .avatar {
        position: relative;
        display: inline-block;
        margin-right: 1.5em;
        float: left;
        width: 4.5em;
        margin-top: 1em;
      }
      .allTitle {
        display: inline-block;
        float: left;
        margin-top: 1em;
        .title {
          display: block;
          font-size: 1.2em;
          color: @nick-name-color;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          width: 10em;
          height: 1.4em;
          font-weight: 600;
        }
        .subTitle {
          display: block;
          font-size: .95em;
          color: @subNick-name-color;
        }
      }
    }
    .weui-btn {
      margin-top: 2em;
      width: 85%;
      border: 0;
      &:after {
        border: 0;
      }
    }
  }

</style>
