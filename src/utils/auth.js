
import qs from 'qs'
const TokenKey = 'zw'
const LogInfo = 'logInfo'
const Doc = 'doc'
const originDoc = 'originDoc'
const auth = {
  getToken() {
    return sessionStorage.getItem(TokenKey)
  },
  setToken(token) {
    return sessionStorage.setItem(TokenKey, token)
  },
  removeToken() {
    return sessionStorage.removeItem(TokenKey)
  },
  setLogInfo(info) {
    return sessionStorage.setItem(LogInfo, qs.stringify(info))
  },
  getLogInfo() {
    return sessionStorage.getItem(LogInfo)
  },
  removeLogInfo() {
    return sessionStorage.removeItem(LogInfo)
  },
  setDoc(data) {
    return sessionStorage.setItem(Doc, qs.stringify(data))
  },
  getDoc() {
    return sessionStorage.getItem(Doc)
  },
  removeDoc() {
    return sessionStorage.removeItem(Doc)
  },
  setOriginDoc(info) {
    return sessionStorage.setItem(originDoc, qs.stringify(info))
  },
  getOriginDoc() {
    return sessionStorage.getItem(originDoc)
  }
}

export default auth
