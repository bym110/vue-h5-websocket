import axios from 'axios'
import qs from 'qs'
import vue from '../main'

const ajax = axios.create({
  timeout:30000
});

ajax.interceptors.request.use((req)=>{ // 请求拦截器
  vue.$vux.loading.show({
    text: 'Loading'
  })
  switch (req.method) {
    case 'get':
      req.params = Object.assign({},req.params);

      break;
    case 'post':
      let obj = Object.assign({},req.data);
      req.data = qs.stringify(obj);// 转换formdata格式
      break;
    default:
      break;
  }
  return req;
});
ajax.interceptors.response.use((res)=>{ // 响应拦截器
    vue.$vux.loading.hide()
  if (res.status === 200) {
    return res.data
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
