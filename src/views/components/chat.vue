<template>
  <div class="chat">
    <view-box ref="viewBox" :style="{height:emojiShow?'calc(100% - 200px)':'100%'}">
      <x-header :left-options="leftOptions" :title="chatTargetInfo.title" @on-click-back="goBack" :right-options="{showMore: false}">
        <img slot="right" :src="icon.more" alt="" @click="showDetail">
      </x-header>
      <div class="chat-parent" :style="{height:'calc(100% - '+(currentHeight+102)+'px)'}">
<!--        <vue-scroll ref="vueScroll" :ops="options">-->
        <loading-more :text="loadingText" @moveEvent="scrollEvent" :page-size="pageSize" v-if="!chatMessageList.length">
          <div class="noMessage">
            <img :src="icon.noContent" alt="">
            <div class="nullContent">暂无内容~</div>
          </div>
        </loading-more>
        <loading-more ref="message" :text="loadingText" @moveEvent="scrollEvent" :page-size="pageSize" className="chat-children" v-else>
          <template v-for="(item,i) in chatMessageList">
            <template v-if="Number(item.isSelf) === 1 && Number(item.contentType) === 1">
              <div class="sysTime" v-html="item.chatContent"></div><!--显示系统消息-->
            </template>
            <template v-else>
              <Cell class="messageCell" :border-intent="false" :value-align="Number(item.direction) === 0?'right':'left'">
                <img class="avatar" :src="Number(item.direction) === 1?$avatarFormatter(item.targetheadImage):$avatarFormatter(detailInfo.header_image)" alt="">
                <div style="padding-left: 50px;margin-bottom: 5px;font-size: .8em" v-if="Number(item.direction) ===1 && Number(item.targetType) === 0">{{item.targetImAppNickName}}</div><!--群组聊天显示昵称-->
                <template v-if="Number(item.contentType) === 1 || Number(item.contentType) === 114 || Number(item.contentType) === 115 || Number(item.contentType) === 116"> <!--聊天内容文本-->
                  <div :class="Number(item.direction) === 0?'me-message':'other-message'" v-html="item.chatContent.replace(/\[[^\]]+\]/g,emotion)"></div>
                </template>
                <template v-else-if="Number(item.contentType) === 2"> <!--聊天内容图片-->
                  <div :class="Number(item.direction) === 0?'me-message':'other-message'" class="picMessage">
                    <img class="previewer-demo-img" :src="item.chatContentUrl" @click="previewPic(item.chatContentUrl)">
                  </div>
                </template>
                <template v-else-if="Number(item.contentType) === 3"> <!--聊天内容语音-->
                  <div :class="Number(item.direction) === 0?'me-message':'other-message'" style="padding: 3px 12px">
                    <m-audio :src="item.chatContent.replace(/\.\w+$/,'')+'.mp3'" text="" :show-duration="true"></m-audio>
                  </div>
                </template>
                <template v-else-if="Number(item.contentType) === 4"> <!--聊天内容视频-->
                  <div :class="Number(item.direction) ===0 ?'me-message':'other-message'" style="padding: 0;background: transparent;">
                    <img :src="icon.video" @click="videoShow(item.chatContent)" height="80" style="border-radius: 2px;cursor: pointer;" alt="">
                  </div>
                </template>
                <template v-else-if="Number(item.contentType) === 5"><!--聊天内容文件-->
                  <div :class="Number(item.direction) === 0?'me-message':'other-message'">
                    <template v-if="item.chatContent.substring(item.chatContent.length-8)=== 'notFound'"><!--收到文件未下载-->
                      <div :style="{color:Number(item.direction) === 0?'#fff':'#434349'}">对方给你发送一个文件，该版本不支持查看</div>
                    </template>
                    <template v-else>
                      <div class="file">
                    <span class="clearfix fileName">
                      <img :src="icon.download" alt="">
                      <span :style="{color:Number(item.direction) === 0?'#fff':'#434349'}">{{ fileFormatter(item.chatContent,1) }}</span>
                    </span>
                        <a target="_blank" class="downloadBtn" :style="{color:Number(item.direction) === 0?'#fff':'#434349'}" :href="fileFormatter(item.chatContent,2)">下载</a>
                      </div>
                    </template>
                  </div>
                </template>
                <template v-else-if="Number(item.contentType) === 7 || Number(item.contentType) === 113"> <!--聊天内容语音电话-->
                  <div :class="Number(item.direction) === 0?'me-message':'other-message'">语音电话:已结束</div>
                </template>
                <template v-else-if="Number(item.contentType) === 32"><!--聊天内容名片-->
                  <div :class="Number(item.direction) === 0?'me-message':'other-message'" class="businessCard">
                    <div class="businessCardTitle" :style="{color:Number(item.direction) === 0?'#fff':'#959CB6',borderColor:Number(item.direction) === 0?'#535353':'#979797'}">
                      <span>名片</span>
                    </div>
                    <div class="businessCardContent">
                      <div><span>微信号：</span><span style="word-break: break-all">{{ item.chatContent[0] }}</span></div>
                      <div><span>昵称：</span><span>{{ item.chatContent[1] }}</span></div>
                      <div><span>性别：</span><span>{{ Number(item.chatContent[4]) === 1?'男':'女' }}</span></div>
                      <div><span>地区：</span><span>{{ item.chatContent[3] }}</span></div>
                    </div>
                  </div>
                </template>
                <template v-else-if="Number(item.contentType) === 272"><!--聊天信息红包-->
                  <div :class="Number(item.direction) === 0?'me-message':'other-message'" style="padding: 0">
                    <div class="redPackage">
                      <div class="redPackage_1 clearfix" :style="{background: item.bgColor}">
                        <img style="float: left;" :src="item.icon" alt="">
                        <div style="float: left;margin-left: 9px;font-size: 12px;" :style="{marginTop:item.isOpen?'0':'8px'}">
                          <div>
                            {{ item.showContent }}
                          </div>
                          <div v-if="item.isOpen">
                            已被领完
                          </div>
                        </div>
                      </div>
                      <div class="redPackage_2">红包</div>
                    </div>
                  </div>
                </template>
                <template v-else-if="Number(item.contentType) === 273"><!--聊天内容链接-->
                  <div :class="Number(item.direction) === 0?'me-message':'other-message'" style="background: #fff;">
                    <template v-if="typeof item.chatContent == 'string'">
                      <a class="linkContent clearfix" target="_blank" :href="linkFormatter(JSON.parse(item.chatContent)[1])">
                        <span>{{ JSON.parse(item.chatContent)[0].length<=12?JSON.parse(item.chatContent)[0]:JSON.parse(item.chatContent)[0].substr(0,12)+'......' }}</span>
                        <img :src="icon.link" width="36" alt="">
                      </a>
                    </template>
                    <template v-else>
                      <a class="linkContent clearfix" target="_blank" :href="linkFormatter(item.chatContent[1])">
                        <span>{{ item.chatContent[0].length<=12?item.chatContent[0]:item.chatContent[0].substr(0,12)+'......' }}</span>
                        <img :src="icon.link" width="36" alt="">
                      </a>
                    </template>

                  </div>
                </template>
                <template v-else-if="Number(item.contentType) === 352 "><!--聊天内容转账-->
                  <div :class="Number(item.direction) === 0?'me-message':'other-message'" style="padding: 0">
                    <div class="redPackage" v-if="Number(item.direction) === 0 && item.chatContent.match(/转账金额(\S*)元/) ">
                      <div class="redPackage_1 clearfix" :style="{background:'rgba(241,94,72,1)'}">
                        <img :src="icon.transfer" style="float: left;" alt="">
                        <div class="transferText">
                          <div>{{ item.chatContent }}</div>
                        </div>
                      </div>
                      <div class="redPackage_2">转账</div>
                    </div>
                    <div class="redPackage" v-else>
                      <div class="redPackage_1 clearfix" :style="{background:item.chatContent.match(/转账给你(\S*)元/)?'rgba(241,94,72,1)':'rgba(241,94,72,.5)'}">
                        <img :src="item.chatContent.match(/转账给你(\S*)元/)?icon.transfer:icon.transferOpen" style="float: left;" alt="">
                        <div v-if="item.chatContent.match(/转账给你(\S*)元/)" class="transferText">
                          <div>{{ '￥'+item.chatContent.match(/转账给你(\S*)元/)[1] }}</div>
                          <div>{{ item.chatContent.match(/转账给你/)[0] }}</div>
                        </div>
                        <div v-else class="transferText">
                          <div>{{ item.chatContent }}</div>
                          <div>已被领取</div>
                        </div>
                      </div>
                      <div class="redPackage_2">转账</div>
                    </div>
                  </div>
                </template>
                <template v-else-if="Number(item.contentType) === 384"> <!--聊天内容位置-->
                  <div :class="Number(item.direction) === 0?'me-message':'other-message'" style="font-size: .8em"  @click="showMap(item.chatContent)">
                    <span v-if="item.chatContent[0]">{{item.chatContent[0]}}：</span>
                    <span>{{item.chatContent[1]}}</span>
                    <img style="margin-bottom: -3px;margin-left: 3px;" :src="icon.location" alt="">
                  </div>
                </template>
                <img :src="icon.warning"  v-if ="item.isShowRetry || Number(item.status) === 1" style="width: 16px;margin:12px 10px;"/><!--显示重发图标-->
              </Cell>
              <template v-if="showTime(item.createTime,i)">
                <div class="sysTime">{{ showTimeFormatter(item.createTime) }}</div> <!--时间长无聊天显示时间间隔-->
              </template>
            </template>
          </template>
        </loading-more>
<!--        </vue-scroll>-->
      </div>
      <div slot="bottom" class="footer clearfix" ref="footer" :style="{bottom:emojiShow?'200px':'0'}">
        <flexbox>
          <flexbox-item :span="3">
            <div class="flex-demo">
              <x-button type="primary" @click.native="expressionShow" text="常用语"></x-button>
            </div>
          </flexbox-item>
          <flexbox-item :span="message.length?5:7" :style="{flex:message.length?'0 0 41.6667%':'0 0 62%'}">
            <div class="flex-demo">
              <x-textarea @on-focus="focus" placeholder="请输入文字" ref="inputBox" :rows="1" @on-change="handleChange" autosize v-model="message"></x-textarea>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="flex-demo">
              <img :src="icon.emoji" @click="emotionShow" alt="">
              <x-button v-if="message.length" type="primary" @click.native="sendMessage" text="发送"></x-button>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
    </view-box>
    <div class="operate" @click="stopEvent()" v-show="emojiShow">
      <div class="operateImg">
        <span @click="clickSelect(1)" :class="selectActive === 1?'active':''"><img :src="icon.expression" alt=""></span>
        <span @click="clickSelect(2)" :class="selectActive === 2?'active':''"><img :src="icon.picture" alt=""></span>
        <span @click="clickSelect(3)" :class="selectActive === 3?'active':''"><img :src="icon.camera" alt=""></span>
        <span @click="clickSelect(4)" :class="selectActive === 4?'active':''"><img :src="icon.emoji" alt=""></span>
      </div>
      <template v-if="selectActive === 1">
        <div v-if="expressionList.length ===0" class="expressionNull">暂无常用语~</div>
        <ul v-else class="expression">
          <li v-for="(item,i) in expressionList" :key="i" :class="expressionId === i?'active':''" @click="selectExpression(i,item.book_content)">
            {{item.book_content}}
          </li>
        </ul>
      </template>
      <template v-else-if="selectActive === 2">
        <div class="expressionPic" v-if="showNullPic" style="text-align: center; padding-top: 4em;">
          <span style="color: #959CB6;">暂无常用语~</span>
        </div>
        <div class="expressionPic" v-else>
          <swiper v-model="picIndex" @on-index-change="changeSwiper" dots-position="center">
            <swiper-item v-for="(row,index) in pictureList" :key="index">
              <flexbox :gutter="0" wrap="wrap">
                <flexbox-item :span="1/4" v-for="item in row" :key="item.book_id">
                  <img  :src="item.book_content" @click="sendPicMessage(item.book_content)" alt="">
                </flexbox-item>
              </flexbox>
            </swiper-item>
          </swiper>
        </div>
      </template>
      <template v-else-if="selectActive === 3">
        <div class="uploadPic">
          <input type="file" class="addInput" accept="image/*" multiple @change="uploadPic">
          <img class="addPic" :src="icon.add" alt="">
          <div style="color: #959CB6;font-size: .9em">请选择你要上传的图片</div>
        </div>
      </template>
      <template v-else-if="selectActive === 4">
        <emotion class="emotionBox" @emotion="handleEmotion" ></emotion>
        <img class="delete" @click="deleteMessage()" :src="icon.delete" alt="">
      </template>
    </div>
    <div v-transfer-dom>
      <previewer :list="previewPicList" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
    </div>
    <div v-transfer-dom>
      <popup v-model="showMapPopup" position="bottom" height="60%"> <!--地图显示弹窗-->
        <div class="locationTitle">位置</div>
        <div class="map">
          <location-map id="chatMap" ref="mapLocation" :loaction="currentLoaction"></location-map>
        </div>
        <div style="padding: 15px;">
          <x-button @click.native="showMapPopup = false" type="primary">关闭</x-button>
        </div>
      </popup>
    </div>
    <div>
      <x-dialog v-model="videoModal" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '100%', 'background-color': 'transparent'}">
        <div class="video-box">
          <p class="closeBtn" style="color:#fff;text-align:right;" @click="videoModal = false; player.dispose()">
            <x-icon type="ios-close-empty" style="fill:#fff;"></x-icon>
          </p>
          <div  class="prism-player" id="J_prismPlayer"></div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import { ViewBox,XHeader,XTextarea,XButton,Group, Cell,Flexbox, FlexboxItem,Swiper,SwiperItem,Previewer, TransferDom, Popup,XDialog } from 'vux'
  import Emotion from './emotion/index'
  import locationMap from "./pages/locationMap";
  import $ from 'jquery'
  import emojilist from '../../libs/emojiList'
    export default {
      name: "chat",
      directives: {
          TransferDom
      },
      components: {
          XHeader,
          Emotion,
          XTextarea,
          XButton,
          Group,
          Cell,
          ViewBox,
          Flexbox,
          FlexboxItem,
          Swiper,
          SwiperItem,
          Previewer,
          locationMap,
          Popup,
          XDialog
      },
      data() {
          return {
              leftOptions:{
                  backText:'',
                  preventGoBack:true
              },
              innerHeight:0,
              emojiShow:false,
              message:'',
              endOffset:-1, // 光标位置
              selectActive:1,
              expressionList:[],
              expressionId:'',
              picIndex:0,
              pictureList:[],
              chatTargetInfo:{},
              pageSize:20,
              total:0,
              height:37,
              currentHeight:0,
              detailInfo:{},
              options: {
                  getThumbBoundsFn (index) {
                      // find thumbnail element
                      let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
                      // get window scroll Y
                      let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                      // optionally get horizontal scroll
                      // get position of element relative to viewport
                      let rect = thumbnail.getBoundingClientRect()
                      // w = width
                      return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
                      // Good guide on how to get element coordinates:
                      // http://javascript.info/tutorial/coordinates
                  }
              },
              previewPicList:[],
              showMapPopup:false,
              currentLoaction:[],
              videoModal:false,
              player:null,
              loadingText:'加载中',
              showNullPic:true
          }
      },
      computed: {
          chatMessageList() {
            return this.$store.state.chatMessageList
          },
          loginInfo() {
              return this.$store.state.loginInfo
          }
      },
      watch:{
          chatMessageList:function (val) {
              this.previewPicList = []
              val.map(item=>{
                  if (Number(item.contentType) === 2) {
                    this.previewPicList.push({
                        msrc: item.chatContentUrl,
                        src: item.chatContentUrl
                    })
                  }
              })
          },
          height:function () {
              if (this.height > 37) {
                  this.currentHeight = this.height - 37
              } else {
                  this.currentHeight = 0
              }
              this.scrollToBottom()
          }
      },
      methods:{
          uploadPic(e) {
              let fileName = e.target.files[0].name
              let index = fileName.lastIndexOf(".");
              let suffix = fileName.substr(index+1);
             if (suffix !== 'png' && suffix !== 'jpg' && suffix !== 'gif' && suffix !== 'jpeg') {
                 this.$vux.toast.text('仅支持jpg/png/gif/jpeg格式', 'middle')
                 return
             }
              let data ={
                  name:e.target.files[0].name,
                  file:e.target.files[0]
              }
              this.$store.dispatch('post',{url:'',data:data}).then((res)=>{
                  if (res.filePath) {
                      this.sendPicMessage(res.filePath)
                  } else {
                      this.$vux.toast.text('图片上传失败', 'middle')
                  }
              });
          },
          focus(e) {
              this.endOffset = -1; // 初始化光标位置
              setTimeout(()=>{
                  this.scrollToBottom()
              },200)
          },
          stopEvent() {
              // 阻止事件冒泡
              if (event && event.stopPropagation) {//非IE
                  event.stopPropagation();
              }
              else {//IE
                  window.event.cancelBubble = true;
              }
          },
          emotionShow() { // 显示表情
            this.stopEvent()
            // this.innerHeight = window.innerHeight;
            setTimeout(()=>{
              this.emojiShow = !this.emojiShow;
              this.clickSelect(4);
              this.scrollToBottom()
            },200)
          },
          expressionShow() { // 显示常用语
              this.stopEvent()
              // this.innerHeight = window.innerHeight;
              setTimeout(()=>{
                  this.emojiShow = !this.emojiShow;
                  this.clickSelect(1)
                  this.scrollToBottom()
              },200)
          },
          selectExpression(i,book_content) { // 常用语点击
            this.expressionId = i;
            this.message = book_content
          },
          handleEmotion(val) { // 表情点击事件
            this.stopEvent()
            if (this.endOffset === -1) {
              this.endOffset = this.$refs.inputBox.$refs.textarea.selectionEnd;
            }
            let start = this.message.substr(0,this.endOffset);
            let end = this.message.substr(this.endOffset,this.message.length-1)
            this.endOffset += val.length; // 光标位置向后移到表情后
            this.message = start + val + end; // 光标处添加表情
            this.$refs.inputBox.updateAutosize()
          },
          handleChange(val) {
              setTimeout(()=>{
                  this.height = this.$refs.inputBox.$el.offsetHeight
              },100)

          },
          // 将匹配结果替换表情图片
          emotion (res) {
            let word = res.replace(/\[|\]/gi,'');
            let index = emojilist.indexOf(word);
            if (index >= 0) {
                return `<img src=`+require(`../../assets/wx/${index}.png`)+` align="middle" alt="">`
            } else {
                return ''
            }
          },
          sendMessage() { // 发送消息
              try {
                  this.stopEvent()
                  let messageObj ={
                      direction:0,
                      contentType:1,
                      chatContent:this.message,
                  };
                  this.$store.commit('websocketSend',messageObj);
                  this.$store.commit('updateMessage',messageObj);
              } catch (e) {
                  //micro_customer_service_app_object.onPrintLog('发送信息错误',e)
              }

              this.message = '';
              setTimeout(()=>{
                  this.$refs.inputBox.updateAutosize();
              },100)

              if (this.emojiShow !== true) {
                  this.$refs.inputBox.focus()
              }
              this.scrollToBottom()
          },
          clickSelect(val) { // tab切换
            this.selectActive = val;
            if (val === 1 || val === 2) {
               // this.getExpression(val)
            }
          },
          changeSwiper(val) { // 图片滚动
            this.picIndex = val
          },
          sendPicMessage(path) { //点击发送图片
              let date = new Date().getTime();
              let messageObj ={
                  reqId:date+'_'+this.loginInfo.staffId,
                  direction:'0',
                  contentType:2,
                  chatContent:path,
                  targetType:1,
              };
              //this.$store.commit('websocketSend',messageObj);
              this.$store.commit('updateMessage',messageObj);
              setTimeout(()=>{
                  this.scrollToBottom()
              },100)
          },
          scrollToBottom() { // 滚动到底部
              this.$nextTick(() => {
                if (this.$refs.message) {
                  let container = this.$refs.message.$el;
                  container.scrollTop = container.scrollHeight;
                }
              });
          },
          scrollToSite() { // 滚动到指定位置
              this.$nextTick(() => {
                  setTimeout(()=>{
                      let container = this.$refs.message.$el;
                      let index =20;
                      if ($('.messageCell').length%20 !== 0) {
                          index = $('.messageCell').length%20
                      }
                      let scrollToContainer = $('.messageCell').eq(index)
                      container.scrollTop = scrollToContainer.offset().top - $(container).offset().top + $(container).scrollTop()-$(container).height()
                  },200)

              });
          },
          deleteMessage() { // 删除退格
                this.message =this.message.substring(0,this.message.length-1)
          },
          showDetail() {
              if (Number(this.chatTargetInfo.targetType) === 1) {
                  this.$router.push({
                      name:'personalInfo',
                      query:this.chatTargetInfo
                  })
              } else {
                  this.$router.push({
                      name:'groupInfo',
                      query:this.chatTargetInfo
                  })
              }

          },
          getExpression(type) {
              let params={
                  condition: '',
              };
              let arr=[
                  {name:"type",operation:"EQ",type:"string",value:1},
                  {name:"content_type",operation:"EQ",type:"string",value:type},
              ];
              params.condition = JSON.stringify(arr);
              this.$store.dispatch('get',{url:'phrasebook/list',params}).then(res=>{
                  if (res.result) {
                      if (type ===1) {
                          this.expressionList = res.result
                      } else {
                          if (res.result.length === 0) {
                              this.showNullPic = true
                          }else {
                              this.showNullPic = false
                              this.pictureList=[]
                              let page = Math.ceil(res.result.length/12);
                              let num = res.result.length%12;
                              for (let i=0;i<page;i++) {
                                  let arr=[]
                                  if (i === page-1) {
                                      if (num !== 0) {
                                          arr = res.result.splice(0,num)
                                      } else {
                                          arr = res.result.splice(0,12)
                                      }

                                  } else {
                                      arr = res.result.splice(0,12)
                                  }
                                  this.pictureList.push(arr)
                              }
                          }

                      }
                  }
              });
          },
          scrollEvent() {
              if (this.total > 20) {
                  this.pageSize += 20
              } else {
                  this.loadingText ='到顶啦'
              }
              if (this.pageSize <= this.total) {
                  this.getMessageList(true)
              } else {
                  if (this.pageSize - this.total < 20) {
                      this.getMessageList(true)
                  } else {
                      this.loadingText ='到顶啦'
                  }
              }
          },
          getMessageList (flag) {// 获取历史消息列表
              // if (!flag) {
              //     this.$store.state.chatMessageList = []
              // }

            this.total = 0
            this.$store.commit('setChatMessageList',this.chatMessageList);
            if (!flag) {
              this.scrollToBottom()
            } else {
              this.scrollToSite();
            }
          },
          logIndexChange (arg) {
              console.log(arg)
          },
          previewPic (path) {
              let showPic = this.previewPicList.filter(value => {
                  return value.src === path
              })[0];
              let index = this.previewPicList.indexOf(showPic);
              this.$refs.previewer.show(index)
          },
          goBack() {
             // this.$store.state.chatMessageList=[];
              this.$router.push({name:'chatList'})
              // let params ={
              //     entityName: 'AccBusinessCommunicateDetailClient',
              //     condition: {
              //         'staffIdInApp.keyword':this.chatTargetInfo.staffIdInApp,
              //         'targetImAppId.keyword':this.chatTargetInfo.targetId,
              //         isread:0
              //     }
              // }
              // this.$store.dispatch('get',{url:'business/updateReadStatus',params}).then(res=>{
              //     this.$store.state.chatMessageList=[];
              //     this.$router.push({name:'chatList'})
              // });
          },
          // 验证聊天列表时间是否显示
          showTime (time,index) {
              if (index>0)  {
                  var d1 = new Date(this.chatMessageList[index-1].createTime);
                  var d2 = new Date(time);

                  if (parseInt(d2 - d1)>300000) { // 验证两条信息时间间隔是否超过五分钟
                      return true
                  }else {
                      return false
                  }

              }
          },
          showTimeFormatter (time) {// 时间格式化
              let date =new Date();
              let year =date.getFullYear();
              let month = date.getMonth()+1;
              month = month<10?'0'+month:month;
              let day = date.getDate();
              day = day<10?'0'+day:day;
              let today = year+'-'+month+'-'+day;
              if (today == time.split(" ")[0]) {
                  let nowTime = new Date().getTime();
                  let chatTime = new Date(time).getTime();
                  let xTime = nowTime - chatTime
                  let hours = parseInt((xTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                  let minutes = parseInt((xTime % (1000 * 60 * 60)) / (1000 * 60));
                  if (hours) {
                      if (minutes) {
                          return hours + "小时" + minutes + "分钟前";
                      } else {
                          return hours + "小时前"
                      }
                  }else {
                      if (minutes>0) {
                          return minutes+'分钟前'
                      }else {
                          return '刚刚'
                      }
                  }


              }else {
                  return time
              }
          },
          showMap(row) {
              this.currentLoaction=row;
              this.$refs.mapLocation.initMap(row)
              this.showMapPopup = true;
          },
          fileFormatter (link,n) {// 文件格式化
              let name = link.match(/media\/(.*)_/)[1];// 匹配/media和_之间的内容
              let suffix = link.substr(link.lastIndexOf("."));// 获取文件后缀名
              let fullName = name+suffix; // 显示的文件名
              if (n==1) { // 页面显示的名称
                  return fullName;
              }else { // 链接地址
                  let linkDirectory =link.substring(0,link.lastIndexOf("/")+1);
                  return linkDirectory+fullName
              }
          },
          // 链接格式化
          linkFormatter (link) {
              let regExp = new RegExp('://', 'g');
              if (regExp.test(link)) {
                  return link
              }else {
                  return 'http://'+link // 没有协议的添加http协议
              }
          },
          // 显示视频查看弹窗
          videoShow (src) {
              this.videoModal = true;
              this.videoSrc = src
              this.player = new Aliplayer({
                  id: 'J_prismPlayer',
                  width: '100%',
                  autoplay: true,
                  //支持播放地址播放,此播放优先级最高
                  source : src,

              },function(player){
                  console.log('播放器创建好了。')
              });
          },
      },
      mounted() {
          let query= this.$route.query;
          query.title = query.nickName
        this.getMessageList();
          document.addEventListener('click',(e)=>{
              this.emojiShow = false;
          });
      },
      // destroyed() {
      //   this.$store.commit('websocketclose') //离开路由之后断开websocket连接
      // },
    }
</script>

<style lang="less">
  .chat {
    height: 100%;
    .weui-tab__panel {
      padding-bottom: 0;
    }
    .chat-parent {
      background: @default-grey-color;
      box-sizing: border-box;
      height: calc(100% - 102px);
      @keyframes mymove
      {
        from {margin-top:0;}
        to {margin-top:-4em;}
      }

      @-webkit-keyframes mymove /*Safari and Chrome*/
      {
        from {margin-top:0;}
        to {margin-top:-4em;}
      }
      .noMessage {
        text-align: center;
        margin-top: 50%;
        .nullContent {
          color: @nick-name-color;
          font-size: .9em;
        }
      }
      .weui-cells {
        background: transparent;
        margin-top: 0;
        &:before {
          height: 0;
          border-top: 0;
        }
        &:after {
          height: 0;
          border-bottom: 0;
        }
        .weui-cell:before {
          height: 0;
          border-top: 0;
        }
        .weui-cell__ft {
          width: 100%;
          position: relative;
          .avatar {
            float: right;
            width: 42px;
            height: 42px;
            border-radius: 2px;
          }
          .me-message {
            border-radius: 4px;
            text-align: left;
            position: relative;
            max-width: calc(100% - 124px);
            white-space:pre-wrap; /* css3.0 */
            white-space:-moz-pre-wrap; /* Firefox */
            white-space:-pre-wrap; /* Opera 4-6 */
            white-space:-o-pre-wrap; /* Opera 7 */
            word-wrap:break-word; /* Internet Explorer 5.5+ */
            color: #fff;
            padding: 8px 12px;
            background: #575858;
            margin: 0 10px 0 0;
            float: right;
            &::before {
              content: "";
              display: block;
              width: 0;
              height: 0;
              border-right: 6px solid transparent;
              border-left: 6px solid #575858;
              border-top: 6px solid transparent;
              border-bottom: 6px solid transparent;
              position: absolute;
              top: 14px;
              right: -12px;
            }
            &.picMessage {
              padding: 0;
              background: @default-grey-color;
              .previewer-demo-img {
                max-height: 4em;
              }
            }
            .x-audio-wrap{
              box-shadow: 0 0 0;
              position: relative;
              .x-time {
                margin-left: 35px;
                color: @globe-bg-color;
              }
              .x-sector {
                border-color: @globe-bg-color;
                position: absolute;
                right: 0;
                top: 12px;
                border-right: 0;
                border-top: 0;
                transform: rotate(-135deg);
                &:before {
                  right: -3px;
                  top: -3px;
                  height: 7px;
                  width: 7px;
                  border-color: @globe-bg-color;
                  border-radius: 1px 12px;
                }
                &:after {
                  right: -10px;
                  top: -10px;
                  border-color: @globe-bg-color;
                  border-radius: 1px 14px;
                }
                .x-dot {
                  top: 3px;
                  background: @globe-bg-color;
                }
              }
            }
          }
          &.vux-cell-align-left {
            .avatar {
              float: left;
            }
            .other-message {
              padding: 8px 12px;
              border-radius: 4px;
              position: relative;
              max-width: calc(100% - 124px);
              white-space:pre-wrap; /* css3.0 */
              white-space:-moz-pre-wrap; /* Firefox */
              white-space:-pre-wrap; /* Opera 4-6 */
              white-space:-o-pre-wrap; /* Opera 7 */
              word-wrap:break-word; /* Internet Explorer 5.5+ */
              color: #333333;
              background: #fff;
              margin: 0 0 0 10px;
              float: left;
              &::before {
                content: "";
                display: block;
                width: 0;
                height: 0;
                border-right: 6px solid #fff;
                border-left: 6px solid transparent;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                position: absolute;
                top: 14px;
                left: -12px;
              }
              &.picMessage {
                padding: 0;
                background: @default-grey-color;
                .previewer-demo-img {
                  max-height: 4em;
                }
              }
            }
            .x-audio-wrap{
              box-shadow: 0 0 0;
              .x-time {
                margin-right: 35px;
                color: @nick-name-color;
              }
              .x-sector {
                border-color: @nick-name-color;
                margin-left: 0;
                border-right: 0;
                border-top: 0;
                &:before {
                  right: -3px;
                  top: -3px;
                  height: 7px;
                  width: 7px;
                  border-color: @nick-name-color;
                  border-radius: 1px 12px;
                }
                &:after {
                  right: -10px;
                  top: -10px;
                  border-color: @nick-name-color;
                  border-radius: 1px 14px;
                }
                .x-dot {
                  top: 3px;
                  background: @nick-name-color;
                }
              }
            }
          }
          .businessCard {
            line-height: 0;
            .businessCardTitle {
              text-align: left;
              border-bottom: 1px solid;
              padding: 5px 7px 3px;
              font-size: .875em;
              line-height: initial;
            }
            .businessCardContent {
              padding: 0 7px 7px;
              font-size: .875em;
              div {
                line-height: initial;
                margin-top: 8px;
                span {
                  word-break: break-all;
                }
              }

            }
          }
          .linkContent {
            display: block;
            background: @globe-bg-color;
            span {
              display: inline-block;
              width: 8em;
              font-size: 0.75em;
              color: @nick-name-color;
              text-align: left;
              float: left;
            }
            img {
              margin-left: 8px;
              float: right!important;
            }
          }
          .file {
            line-height: 0;
            .fileName {
              display: block;
              padding-bottom: 10px;
              border-bottom: 1px solid @default-grey-color;
              line-height: initial;
              img {
                float: left;
              }
              span {
                float: left;
                margin: 8px 0 0 12px;
                color: @nick-name-color;
                max-width: 9em;
                font-size: .8em;
                word-break: break-all;
              }
            }
            .downloadBtn {
              display: block;
              text-align: center;
              padding-top: 10px;
              color: @nick-name-color;
              line-height: initial;
              font-size: .8em;
            }
          }
          .redPackage {
            white-space: normal;
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            border-radius: 2px;
            background: #fff;
            text-align: left;
            .redPackage_1 {
              background: #F15E48;
              padding: 12px 14px;
              color: #fff;
              border-radius:2px 2px 0px 0px;
              font-size: 12px;
              width: 14em;
              .transferText {
                display: inline-block;
                line-height: 15px;
                margin-left: 9px;
                float: left;
                max-width: calc(100% - 40px);
                margin-top: 7px;
              }
            }
            .redPackage_2 {
              padding: 5px 14px;
              color: #959CB6;
              font-size: 14px;
            }
          }
        }
        .sysTime {
          text-align: center;
          color: @nick-name-color;
          margin: 5px 0;
          font-size: .75em;
          padding: 0 20px;
        }
      }
    }
    .footer {
      width:100%;
      padding: .6em;
      box-sizing: border-box;
      position:absolute;
      left:0;
      bottom: 0 !important;
      z-index:100;
      background: #fff;
      .vux-x-textarea {
        box-sizing: border-box;
        display: block;
        max-height: 100px;
        resize:none;
        width: 100%;
        border: 1px solid @search-placeholder-font-color;
        float: left;
        font-size: 1em;
        padding:9px 8px;
        overflow: auto;
        border-radius: 4px;
        .weui-textarea {
          font-size: 1.08em;
          &::-webkit-input-placeholder{
            color: #C6C9D8;
          }    /* 使用webkit内核的浏览器 */
          &:-moz-placeholder{
            color: #C6C9D8;
          }                  /* Firefox版本4-18 */
          &::-moz-placeholder{
            color: #C6C9D8;
          }                  /* Firefox版本19+ */
          &:-ms-input-placeholder{
            color: #C6C9D8;
          }           /* IE浏览器 */
        }
      }
      img {
        float: left;
        width: 1.875em;
        margin-top: 2px;
      }
      .weui-btn_primary {
        height: 36px;
        display: inline-block;
        float: right;
        width: auto;
        font-size: 1em;
        line-height: 35px;
        &:first-child {
          float: left;
        }
      }
      .weui-btn:after {
        border: 0;
        border-radius: 2px;
      }
    }
    .operate {
      height: 12.5em;
      position: relative;
      padding:0 .6em;
      box-sizing: border-box;
      overflow: hidden;
      .operateImg {
        height: 1.875em;
        span {
          width: 1.875em;
          height: 1.875em;
          text-align: center;
          display: inline-block;
          margin-right: 1em;
          border-radius: 2px;
          &.active {
            background: @default-grey-color;
          }
          img {
            margin-top: 3.5px;
          }
        }
      }
      .expression {
        height: calc(100% - 1.875em);
        box-sizing: border-box;
        overflow: auto;
        padding-bottom: 0.625em;
        li {
          font-size: 1em;
          height: 1.875em;
          line-height: 1.875em;
          background: @default-grey-color;
          color: @nick-name-color;
          margin-top: 0.625em;
          padding-left: 0.4375em;
          &.active {
            background: @button-primary-active-bg-color;
            color: @button-global-font-color;
          }
        }
      }
      .expressionNull {
        height: 1.875em;
        line-height: 1.875em;
        margin-top: 0.625em;
        background: @default-grey-color;
        color: #959CB6;
        text-align: center;
      }
      .expressionPic {
        height: calc(100% - 1.875em);
        box-sizing: border-box;
        .vux-slider {
          height: 100%;
          .vux-flexbox {
            .vux-flexbox-item {
              margin-top: 10px;
              &:first-child {
                margin-top: 10px!important;
              }
              text-align: center;
              img {
                max-height: 2em;
              }
            }
          }
        }
        .vux-slider > .vux-indicator > a > .vux-icon-dot.active, .vux-slider .vux-indicator-right > a > .vux-icon-dot.active {
          width: 8px;
          height: 8px;
          border-radius: 4px;
        }
      }
      .uploadPic {
        height: calc(100% - 1.875em);
        box-sizing: border-box;
        text-align: center;
        position: relative;
        padding-top: 2em;
        .addInput {
          width: 6em;
          height: 6em;
          position: absolute;
          opacity: 0;
        }
        .addPic {
          width: 5em;
          height: 5em;
        }
      }
      .emotionBox {
        height: calc(100% - 1.875em);
        box-sizing: border-box;
        padding: .6em 0 0;
        overflow: auto;
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
      }
      .delete {
        position: absolute;
        bottom: 2.2em;
        right: 15px;
      }
    }
    .prism-fullscreen-btn {
      display: none;
    }
  }
  .locationTitle {
    background: @globe-bg-color;
    padding: 10px 15px;
    color: @nick-name-color;
  }
  .map {
    height: calc(100% - 113px);
  }
  .video-box {
    position: relative;
    height: 100%;
    .closeBtn {
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .prism-player {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
