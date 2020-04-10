import CryptoJS from 'crypto-js'
import store from "../store";
import icon from './img';
import loadingMoreComponent from "../views/components/pages/loadingMore";
export default {
  install(Vue, options) {// 加密
    Vue.prototype.$encrypt = function (msg,key) {
      const keyHex = CryptoJS.enc.Utf8.parse(key)
      const encrypted = CryptoJS.TripleDES.encrypt(msg, keyHex, {
        iv: CryptoJS.enc.Utf8.parse('01234567'),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      return encrypted.toString()
    };
    Vue.prototype.$getAuthorization = function (token, userID, orgCode) {
      const lastLoginTime = new Date().getTime();
      if (!token) {
        token = "";
      }
      if (!userID) {
        userID = store.state.loginInfo.userId
      }
      if (!orgCode) {
        orgCode = store.state.loginInfo.companyCode
      }
      const message = `${userID}|WEB|deviceId|${token}|${lastLoginTime}|appVer|${orgCode}`
      const key = 'uusafeuusafeuusafeuusafe'
      return this.$encrypt(message, key)
    };
    Vue.prototype.$avatarFormatter = function (src,targetType) {
      if (src) {
        if (src.substring(src.length-8)=='notFound' ||src.substring(src.length-6)=='media/') {
          if (targetType) {
            return icon.groupAvatar;
          } else {
            return icon.personAvatar;
          }
        }else {
          return src
        }
      } else {

        if (targetType) {
          return icon.groupAvatar;
        } else {
          return icon.personAvatar;
        }
      }
    };
    Vue.component('loadingMore',loadingMoreComponent)
  }
}
