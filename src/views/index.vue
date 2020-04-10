<template>
    <div class="index">
        <router-view ref="index"></router-view>
    </div>
</template>

<script>
    export default {
        name: "index",
        computed:{
            chatTargetInfo() {
                return this.$store.state.chatTargetInfo
            }

        },
        data() {
          return {
          }
        },
        methods:{
            websocketOnmessage() { //websocket 接收发送消息
                this.$store.state.websocket.onmessage =  (e) =>{
                    try {
                        let obj =JSON.parse(e.data);
                        this.$store.commit('reset');
                        if (obj.type === 'message') { // 当接收消息时
                            if (this.$route.name === 'chat' && this.chatTargetInfo.targetId === obj.data.targetImAppId && this.chatTargetInfo.staffIdInApp === obj.data.staffIdInApp && Number(this.chatTargetInfo.staffId) === Number(obj.data.staffId)) { //是当前聊天窗口的时候
                                if (Number(obj.data.contentType) === 3) { // 消息为音频时
                                    this.audioChange(obj.data.chatContent); // 音频解码
                                    this.timer = setInterval(()=>{ // 5秒一次请求判断解码是否完成
                                        this.$store.dispatch('post',{url:'uusafe/mmba/rest/ffmpeg/check',data:{source:obj.data.chatContent}}).then(res=>{
                                            if (res.code === 200) {
                                                clearInterval(this.timer);
                                                this.$store.commit('updateMessage',obj.data);//解码成功后添加信息
                                                this.$refs.index.scrollToBottom()
                                            }
                                        });
                                    },5000);
                                } else {
                                    if (Number(obj.data.contentType) === 2) {
                                        obj.data.chatContentUrl = obj.data.chatContent.substring(obj.data.chatContent.lastIndexOf('.')) !== '.jpg'?obj.data.chatContent+'.jpg':obj.data.chatContent
                                    }
                                    this.$store.commit('updateMessage',obj.data);//不是音频消息直接更新
                                    this.$refs.index.scrollToBottom()
                                }
                                if (Number(obj.data.direction)=== 0) { // 从客户端的发送消息
                                    if (obj.data.reqId) {
                                        if (Number(obj.data.contentType) === 2) {
                                            obj.data.chatContentUrl = obj.data.chatContent.substring(obj.data.chatContent.lastIndexOf('.')) !== '.jpg'?obj.data.chatContent+'.jpg':obj.data.chatContent
                                        }
                                        this.$store.commit('delMessage',obj.data.reqId); //删除本地添加的消息
                                        this.$store.commit('updateMessage',obj.data);
                                        this.$refs.index.scrollToBottom()
                                    }
                                }
                            } else {
                                this.$store.commit('updateChatList',obj.data)
                            }

                        }else if (obj.type === 'reply') { // 发送消息失败的回执
                            this.$store.commit('setRetryStatus',obj.data.reqId);
                        } else if (obj.type === 'logout') {
                            this.$vux.toast.text('账号已在其他地方登录', 'middle')
                            setTimeout(()=>{
                                this.$store.commit('logout')
                                this.$router.push({
                                    name:'login'
                                })
                            },1000)

                        }
                    } catch (e) {

                    }
                }
            },
            // 音频解码
            audioChange (source) {
                let data ={
                    source:source,
                    type:'mp3'
                }
                this.$store.dispatch('post',{url:'uusafe/mmba/rest/ffmpeg/audioChange',data}).then(res=>{
                });
            }
        },
        mounted() {
            // console.log(this.$store, '-------------')
            // alert(this.$store)
            //micro_customer_service_app_object.onReload(true)
            this.$store.commit('initWebSocket');
            this.websocketOnmessage();
        }
    }
</script>

<style scoped lang="less">
.index {
  height: 100%;
  width: 100%;
}
</style>
