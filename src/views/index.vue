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
                        console.log(obj)
                        this.$store.commit('reset');
                        if (obj.type === 'message') { // 当接收消息时
                          this.$store.commit('updateMessage',obj.data);
                          this.$refs.index.scrollToBottom()

                        }else if (obj.type === 'list') { // 发送消息失败的回执
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
