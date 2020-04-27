import Vue from 'vue'
import Vuex from 'vuex'
import ajax from '../libs/axios'
import CreatePersistedState from 'vuex-persistedstate'
import vue from '../main'
Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    loginInfo:{},
    chatMessageList:[],
    chatList:[],
    badge:'0',
    webSocketUrl:'',
    websocket:null,
    chatTargetInfo:{},
    lockReconnect: false,//是否真正建立连接
    timeout: 28*1000,//30秒一次心跳
    timeoutObj: null,//心跳心跳倒计时
    serverTimeoutObj: null,//心跳倒计时
    timeoutnum: null,//断开 重连倒计时
    timer:null
  },
  mutations:{
    websocketclose(state) {
      state.websocket.close();
    },
    reconnect(state) {//重新连接
      if(state.lockReconnect) {
        return;
      };
      //没连接上会一直重连，设置延迟避免请求过多
      state.timeoutnum && clearTimeout(state.timeoutnum);
      state.timeoutnum = setTimeout(()=> {
        //新连接
        store.commit('initWebSocket');
      },5000);
    },
    reset(state){//重置心跳
      //清除时间
      clearTimeout(state.timeoutObj);
      clearTimeout(state.serverTimeoutObj);
      //重启心跳
      store.commit('start');
    },
    start(state){//开启心跳
      state.timeoutObj && clearTimeout(state.timeoutObj);
      state.serverTimeoutObj && clearTimeout(state.serverTimeoutObj);
      state.timeoutObj = setTimeout(function(){
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (state.websocket.readyState == 1) {//如果连接正常
          console.log('连接正常')
         // micro_customer_service_app_object.onPrintLog('连接正常')
          state.websocket.send("heartCheck");
          state.lockReconnect = true;
          store.commit('reset');
        }else{//否则重连
          console.log('重新连接')
         // micro_customer_service_app_object.onPrintLog('重新连接')
          state.lockReconnect = false;
          store.commit('reconnect');
        }
        state.serverTimeoutObj = setTimeout(function() {
          //超时关闭
          state.websocket.close();
        }, state.timeout);

      }, state.timeout)
    },
    initWebSocket(state){ //初始化weosocket
     // micro_customer_service_app_object.onPrintLog('state',state)
      const wsuri =state.webSocketUrl;
     // micro_customer_service_app_object.onPrintLog('url',wsuri)
      state.websocket = new WebSocket(wsuri);
     // micro_customer_service_app_object.onPrintLog('socket',state.websocket)
      state.websocket.onopen =()=>{ // 连接成功
       // micro_customer_service_app_object.onPrintLog('WebSocket连接成功')
        console.log('WebSocket连接成功！');
        store.state.lockReconnect = true;
        //开启心跳
        store.commit('start');
      }
      state.websocket.onerror=()=>{ // 连接失败
        state.websocket=null
        //错误
        console.log('WebSocket连接发生错误！');
       // micro_customer_service_app_object.onPrintLog('WebSocket连接发生错误')
        store.state.lockReconnect = false;
        //重连
        store.commit('reconnect');
      }
      state.websocket.onclose=(e)=>{ // 连接关闭
        console.log("connection closed (" + e.code + ")");
       // micro_customer_service_app_object.onPrintLog('WebSocket连接关闭')
        store.state.lockReconnect = false;
        store.state.websocket = null
        //重连
        if  (Object.keys(state.loginInfo).length) {
          store.commit('reconnect');
        }
      }
    },
    websocketSend(state,data){//数据发送
      try {
        state.websocket.send(JSON.stringify(data));
      } catch (e) {
       // micro_customer_service_app_object.onPrintLog('socket发送消息错误',e)
      }

    },
    setLoginInfo(state,loginInfo) {
      state.loginInfo = loginInfo;
    },
    setChatMessageList(state,messageList) {
      state.chatMessageList = messageList
    },
    updateMessage (state, message) {// 更新消息
      try {
        if (message.esId) {
          state.chatMessageList = state.chatMessageList.filter(val=>{ // 消息去重
            return message.esId !== val.esId
          })
        }
        state.chatMessageList.push(message);
      }catch (e) {
       // micro_customer_service_app_object.onPrintLog('更新消息错误',e)
      }

    },
    delMessage(state,reqId) {
      state.chatMessageList = state.chatMessageList.filter(val=>{
        return val.reqId !== reqId
      })
    },
    logout(state) {
      state.loginInfo = {}
      store.commit('websocketclose')
    },
    setChatList(state,chatList) {
      state.chatList = chatList
    },
    updateChatList(state,message) {
      state.chatList.map(val=>{
        if (val.targetImAppId === message.targetImAppId && val.staffIdInApp === message.staffIdInApp && val.staffId === message.staffId) {
          val.unread+=1;
          val.chatContent = message.chatContent;
          val.contentType = message.contentType;
          val.createTime = message.createTime
        }
      })
      state.chatList = JSON.parse(JSON.stringify(state.chatList))
    },
    setRetryStatus (state,reqId) {// 显示重新发送
      state.chatMessageList.map(val => {
        if (val.reqId === reqId) {
          vue.$set(val,'isShowRetry',true);
        }
      })
    },
    initUnreadMessage(state,row) {
      state.chatList.forEach(item=>{
        if (item.staffIdInApp === row.staffIdInApp && item.targetImAppId === row.targetImAppId) {
          vue.$set(item,'unread',0)
        }
      })
    }
  },
  actions:{
    get (state ,options) {
      return ajax.get(options.url,{ params: options.params});
    },
    post(state,options) {
      return ajax.post(options.url,{},{ data: options.data})

    }
  },
  getters:{
  },
  plugins: [new CreatePersistedState({
    storage: window.localStorage
  })]
});
export default store
