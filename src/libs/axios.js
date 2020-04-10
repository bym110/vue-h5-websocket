import axios from 'axios'
import qs from 'qs'
import vue from '../main'
import store from "../store";

const ajax = axios.create({
  timeout:30000
});

ajax.interceptors.request.use((req)=>{ // 请求拦截器
  vue.$vux.loading.show({
    text: 'Loading'
  })
  let extra={ // 添加额外参数
    currentPage:1,
    pageSize:1000
  };
  if (req.url !='uusafe/ucp/auth/rest/authByLoginName') {
    if (req.url =='uusafe/ucp/chat/rest/queryForChatHistory') {
      req.headers.Authorization = vue.$getAuthorization('',store.state.loginInfo.staffId,'');
    }else {
      req.headers.Authorization = vue.$getAuthorization();
    }
  }
  switch (req.method) {
    case 'get':
      if (req.params) {
        if (req.params.currentPage) {
          extra.currentPage = req.params.currentPage
          extra.pageSize = req.params.pageSize
        };
      }

      req.params = Object.assign({},extra,req.params);

      break;
    case 'post':
      if (req.data) {
        if (req.data.currentPage) {
          extra.currentPage = req.data.currentPage
          extra.pageSize = req.data.pageSize
        };
      }

      if (req.url =='uusafe/ucp/auth/rest/authByLoginName') {
        extra ={}
      }

      if (req.url =='uusafe/ucp/file/rest/fileUpload') {
        req.headers['Content-Type'] = 'multipart/form-data'
        let formData = new FormData()
        formData.append('file', req.data.file);
        formData.append('name', req.data.name);
        req.data = formData
      } else {
        let obj = Object.assign({},extra,req.data);
        req.data = qs.stringify(obj);// 转换formdata格式
      }

      break;
    default:
      break;
  }
  return req;
});
ajax.interceptors.response.use((res)=>{ // 响应拦截器
    vue.$vux.loading.hide()
  if (res.status ==200) {
    if (res.data.data) {
      try {
        if (typeof res.data.data =='string') {
          return JSON.parse(res.data.data)
        }else {
          return res.data.data
        }
      }catch (e) {

      }

    } else {
      return res.data
    }
  } else {
    vue.$vux.toast.text(' 当前网络不可用，请检查您的网络设置', 'middle');
    // setTimeout(()=>{
    //   store.commit('logout');
    //   router.push({
    //     name:'login'
    //   })
    // },1000)
  }

},
  error =>{
    vue.$vux.loading.hide()
    vue.$vux.toast.text(' 当前网络不可用，请检查您的网络设置', 'middle')
    // setTimeout(()=>{
    //   store.commit('logout');
    //   router.push({
    //     name:'login'
    //   })
    // },1000)

    return Promise.reject(error);
  })

export default ajax
