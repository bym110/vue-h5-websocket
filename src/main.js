// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import img from './libs/img'
import local from './libs/local'
import axios from 'axios'
import ajax from './libs/axios'
import audio from 'vue-mobile-audio';
const FastClick = require('fastclick')
import '@/assets/less/index.less'
import  { ToastPlugin,LoadingPlugin } from 'vux'

Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
FastClick.attach(document.body)
Vue.use(audio)
axios.get('/static/config.json?random='+Math.random()).then((res) => {
  ajax.defaults.baseURL = process.env.NODE_ENV=='development'?process.env.API_ROOT:res.data.baseURL
  store.state.webSocketUrl = res.data.webSocketURL
}).catch((e)=>{
  console.log(e)
})
Vue.prototype.icon = img;

Vue.use(local) // 注册全局函数

/* eslint-disable no-new */
 export default new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
