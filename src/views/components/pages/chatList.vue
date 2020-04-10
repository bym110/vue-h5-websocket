<template>
<div class="chatList">
  <template v-if="chatList.length">
    <loading-more className="linkmanList" text="下拉刷新" @moveEvent="handleEvent">
      <cell v-for="(item,i) in chatList" :class="i ===0?'firstCell':''" :key="i" :value="timeFormatter(item.createTime)" @click.native ='handleClick(item)'>
        <div slot="title">
          <span class="avatar">
            <img  :src="Number(item.targetType) === 1?$avatarFormatter(item.headPic):$avatarFormatter(item.headPic,true)" alt="">
            <badge v-if="item.unread" :text="item.unread>99?'99+':item.unread"></badge>
          </span>
          <span class="allTitle">
            <span class="title" v-html="item.nickName"></span>
            <span class="subTitle" v-html="messageFormatter(item)"></span>
          </span>
        </div>
      </cell>
    </loading-more>
  </template>
  <template v-else>
    <template v-if="searchKey">
      <div class="showNull" style="margin-top: 0;" v-html="showNullText"></div>
    </template>
    <template v-else>
      <loading-more className="linkmanList" text="下拉刷新" @moveEvent="handleEvent">
        <div class="listNull">
          <img :src="icon.nothing" alt="">
          <div class="nullText">暂无数据~</div>
        </div>
      </loading-more>
    </template>
  </template>
</div>
</template>

<script>
    import { Group, Cell,Badge,LoadMore } from 'vux'
    import emojilist from '../../../libs/emojiList'
    export default {
        name: "chatList",
        props:{
            searchKey:String
        },
        components:{
            Group,
            Cell,
            Badge,
            LoadMore
        },
        data() {
          return {
              showNullText:'',
              initMessageInfo:{}
          }
        },
        computed:{
            chatList() {
                return this.$store.state.chatList
            }
        },
        watch:{
            chatList:{
                handler: function(chatList, oldVal) {
                    if (!chatList.length) {
                        this.showNullText = '未找到“<span style="color:#f5a623">'+this.searchKey+'</span>”关键字的结果'
                    } else {
                        //this.$store.commit('initUnreadMessage',this.initMessageInfo)
                    }
                },
                deep: true
            }
        },
        methods:{
            handleClick (row,flag) {// 点击重置未读消息
              this.$router.push({
                name:'chat',
                query:row
              })
            },
            messageFormatter(item) {
              if (Number(item.contentType) === 1|| Number(item.contentType) === 114|| Number(item.contentType) === 115|| Number(item.contentType) === 116 || Number(item.contentType) === 352) {
                if (Number(item.unread)!== 0) {
                    return '<span style="margin-left: 2px;">[未读]</span>'+item.chatContent.replace(/\[[^\]]+\]/g,this.emotion)
                } else {
                    return item.chatContent.replace(/\[[^\]]+\]/g,this.emotion)
                }
              } else if (Number(item.contentType) === 2) {
                  if (Number(item.unread)!== 0) {
                      return '<span style="margin-left: 2px;">[未读]</span>[图片]'
                  } else {
                      return '[图片]'
                  }
              } else if (Number(item.contentType) === 3) {
                  if (Number(item.unread)!== 0) {
                      return '<span style="margin-left: 2px;">[未读]</span>[语音]'
                  } else {
                      return '[语音]'
                  }
              }else if (Number(item.contentType) === 7 || Number(item.contentType) === 113) {
                  if (Number(item.unread)!== 0) {
                      return '<span style="margin-left: 2px;">[未读]</span>[语音通话]'
                  } else {
                      return '[语音通话]'
                  }
              } else if (Number(item.contentType) === 4) {
                  if (Number(item.unread)!== 0) {
                      return '<span style="margin-left: 2px;">[未读]</span>[视频]'
                  } else {
                      return '[视频]'
                  }
              } else if (Number(item.contentType) === 5) {
                  if (Number(item.unread)!== 0) {
                      return '<span style="margin-left: 2px;">[未读]</span>[文件]'
                  } else {
                      return '[文件]'
                  }
              } else if (Number(item.contentType) === 384) {
                  if (Number(item.unread)!== 0) {
                      return '<span style="margin-left: 2px;">[未读]</span>[位置]'
                  } else {
                      return '[位置]'
                  }
              } else if (Number(item.contentType) === 32) {
                  if (Number(item.unread)!== 0) {
                      return '<span style="margin-left: 2px;">[未读]</span>[名片]'
                  } else {
                      return '[名片]'
                  }
              } else if (Number(item.contentType) === 273) {
                  if (Number(item.unread)!== 0) {
                      return '<span style="margin-left: 2px;">[未读]</span>[链接]'
                  } else {
                      return '[链接]'
                  }
              } else if (Number(item.contentType) === 272) {
                  if (Number(item.unread)!== 0) {
                      return '<span style="margin-left: 2px;">[未读]</span>[红包]'
                  } else {
                      return '[红包]'
                  }
              }
            },
            // 将匹配结果替换表情图片
            emotion (res) {
                let word = res.replace(/\[|\]/gi,'');
                let index = emojilist.indexOf(word);
                if (index >= 0) {
                    return `<img src=`+require(`../../../assets/wx/${index}.png`)+` style="width:1.1em;margin-top:-8px;" align="middle" alt="">`
                } else {
                    return ''
                }
            },
            handleEvent() {
                this.$emit('handleEvent')
            },
            timeFormatter(time) {
                console.log()
                let date = (new Date());    //当前时间
                let today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
                let yestday = new Date(today - 24*3600*1000).getTime();
                if (new Date(time).getTime() >= today) {
                    return time.split(' ')[1].split(':')[0]+':'+time.split(' ')[1].split(':')[1]
                } else if (new Date(time).getTime() < today && yestday <= new Date(time).getTime()) {
                    return '昨天'
                } else if(new Date(time).getTime() < yestday ){
                    return time.split(' ')[0].split('-')[0]+'/'+time.split(' ')[0].split('-')[1]+'/'+time.split(' ')[0].split('-')[2]
                }

            }
        },
        mounted() {
            this.initMessageInfo = this.$route.params
            if (Object.keys(this.initMessageInfo).length) {
                this.handleClick(this.initMessageInfo,true)
            }
        }
    }
</script>

<style lang="less">
.chatList {
  height: 100%;
  .linkmanList {
    height: calc(100% + 4em);
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
        .weui-cell__ft {
          font-size: 0.8em;
          position: absolute;
          right: 15px;
          top: 13px;
        }
        &.firstCell {
          &:before {
            border-top: 0;
          }
        }
      }

    }
  }
  .vux-label {
    float: left;
    .avatar {
      position: relative;
      display: inline-block;
      margin-right: 12px;
      border-radius: 2px;
      float: left;
      .vux-badge {
        position: absolute;
        right: -7px;
        top: -4px;
      }
      img {
        width: 2.7em;
      }
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
        width: 11em;
        height: 1.4em;
      }
      .subTitle {
        display: block;
        font-size: 0.8em;
        color: @subNick-name-color;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        width: 17.6em;
        height: 1.4em;
      }
    }
  }
  .listNull {
    box-sizing: border-box;
    padding: 6em 2em 0;
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
}
</style>
