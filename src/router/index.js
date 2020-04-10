import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/login',
      name:'login',
      component: resolve =>{ require(['@/views/login'],resolve)}
    },
    {
      path: '/',
      component: resolve =>{ require(['@/views/index'],resolve)},
      children:[
        {
          path: '',
          name:'home',
          component: resolve =>{ require(['@/views/components/home'],resolve)},
          children:[
            {
              path: 'chatList',
              name:'chatList',
              component: resolve => { require(['@/views/components/pages/chatList.vue'], resolve);},
            },
            {
              path: 'contactList',
              name:'contactList',
              component: resolve => { require(['@/views/components/pages/contactList.vue'], resolve);},
            },
            {
              path: 'groupList',
              name:'groupList',
              component: resolve => { require(['@/views/components/pages/groupList.vue'], resolve);},
            }
          ]
        },
        {
          path: 'chat',
          name:'chat',
          component: resolve => { require(['@/views/components/chat.vue'], resolve);}
        },
        {
          path: 'personalInfo',
          name:'personalInfo',
          component: resolve => { require(['@/views/components/personalInfo.vue'], resolve);}
        },
        {
          path: 'groupInfo',
          name:'groupInfo',
          component: resolve => { require(['@/views/components/groupInfo.vue'], resolve);}
        },
        {
          path: 'mine',
          name:'mine',
          component: resolve => { require(['@/views/components/mine.vue'], resolve);}
        }
      ]
    }

  ]
})
router.beforeEach((to,from,next) =>{
  let loginInfo = store.state.loginInfo;
   if (to.name !== 'login' && !loginInfo.loginName) {  // 判断是否已经登录且前往的是登录页
    next({
      name:'login'
    })
  }else if (to.name === 'login' && loginInfo.loginName){
     next({
       name:'chatList'
     })
   } else if(to.path ==='/') {
     next({
       name:'login'
     })
   } else{
    next()
  }
})
export default router
