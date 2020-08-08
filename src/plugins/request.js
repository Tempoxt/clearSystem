import axios from 'axios'
import qs from 'qs'
import auth from '@/utils/auth'
import { Message, MessageBox } from 'element-ui'
import crypto from 'crypto'

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

const turnTo = () => {
  window.location = process.env.VUE_APP_EIP
}

const getTag = () =>{
    return + window.location.port === 8999 ? 'labor' :'erp'
}
let isFormData = (v) => {
    return Object.prototype.toString.call(v) === '[object FormData]'
}
// let timeStamp = Date.parse(new Date())
let trans = (data) => {
    console.log(data)
    let newData = ''
    for(var i of data.entries()) {
        newData += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
    }
    
    newData = newData.slice(0, -1)
    console.log(newData)
    return newData
}
let transObj = (data) => {
    let newData = ''
    for(var i of Object.entries(data)) {
        newData += encodeURIComponent(i[0]) + '=' + encodeURIComponent(i[1]) + '&'
    }
    newData = newData.slice(0, -1)
    console.log(newData)
    return newData
}
const service = axios.create({
    baseURL: process.env.VUE_APP_BASEAPI + '/server',
    timeout: 30000, // 请求超时时间
    withCredentials: false,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    transformRequest: [function (data,config) {
        if (typeof data === 'string') return data
        // if(config['Content-Type']== "application/x-www-form-urlencoded")  return data
        if (isFormData(data)) return data
        return JSON.stringify(data)
        // return JSON.stringify(JSON.parse(JSON.stringify(data)))
        
        // if(isFormData(data))return data
    }]
    // validateStatus: function (status) {
    //     return [200, 201, 204, 422, 401, 404, 429, 403].indexOf(status) !== -1 // 默认的
    // }
})

service.interceptors.request.use(config => {
    // 'Authorization': 
    config.headers['Authorization'] = auth.getToken()
    if (config.headers['Content-Type'].indexOf('multipart/form-data') !== -1) {
        console.log(config.data)
        let md5 = crypto.createHash("md5")
        let obj = {}
        let timestamp = Date.parse(new Date())/1000 - 60
        md5.update(timestamp + '_b6k$$mrfou(+*eapw1$cry91a=8kjf(1v__qo-io5b9z_he%7')
        let sign = md5.digest('hex')
        config.data.append('token', auth.getToken())
        config.data.append('sign', sign)
        config.data.append('timestamp', timestamp)
        // config.data = trans(config.data)
        // for(var pair of config.data.entries()) {
        //     console.log(pair[0]+ ', '+ pair[1])
        // }
        return config
        

    }else if (config.method === 'post' && config.url.indexOf('/doc/login') === -1) {
        let md5 = crypto.createHash("md5")
        let obj = {}
        let timestamp = Date.parse(new Date())/1000 - 30
        md5.update(timestamp + '_b6k$$mrfou(+*eapw1$cry91a=8kjf(1v__qo-io5b9z_he%7')
        let sign = md5.digest('hex')
        obj.token = auth.getToken()
        obj.sign = sign
        obj.timestamp = timestamp
        config.data = Object.assign(obj, config.data)
    } else if (config.method === 'put') {
        // let obj = {}
        // obj.token = auth.getToken()
        // config.data = Object.assign(obj, config.data)
        console.log(config.data)
        config.data = transObj(config.data)

        return config
    }

    if (config.method === 'get' && config.url.indexOf('erp/login') === -1) {
        if ('params' in config) {
            config.params.token = auth.getToken()
        } else {
            let obj = {
                params: {
                    token: auth.getToken()
                }
            }
            config = Object.assign(obj, config)

        }
    }
    // config.headers['proxytag'] = getTag()
    return config
})

service.interceptors.response.use(response => {
    const { status, data,config ,headers } = response
    
    if (status === 201) {
        if(response.config.alert!==false){
            Message({
                type: 'success',
                message: '创建成功'
            })
        }
    }
    if (status === 204) {
        Message({
            type: 'success',
            message: '删除成功'
        })
    }
    

    if (status === 302) {
        turnTo()
    }
    if ([401].indexOf(status) !== -1) {
        Message({
            type: 'error',
            message: data.msg
        })
        // auth.removeToken()
        turnTo()
        return Promise.reject(response)
    }
    if(response.config.method==='put' && response.status===200){
        if(response.config.alert!==false && response.data.code === 0){
            Message({
                type: 'success',
                message: '修改成功'
            })
        } else {
            console.log(response)

            Message({
                type: 'error',
                message: response.data.msg
            })
        }
    }
    // if (response.status===200) {
    //     Message({
    //         type: 'success',
    //         message: response.data.msg
    //     })
    // }
    if(config.responseType==="arraybuffer"){
        let contentType = headers['content-type']
        let name    
        try {
            name =Base64.decode(headers['content-disposition'].split('?')[3]).split('=')[1]
        }catch(err){
            name = ''
        }
      
        return { data , name , contentType}
    }
    return data
}, error => {
    if (error) {
        // window.location.href = '/account/login'
    }
    // 表单错误
    if(error.response.status === 400 && typeof error.response.data === 'object'){ 
        return Promise.reject({field:error.response.data,error})
    } else if (error.response.status === 302) {
        turnTo()
    }
     else{
        if(error.response.config.alert!==false){
            Message({
                type: 'error',
                dangerouslyUseHTMLString: true,
                message: error.response.data
            })
        }
    }
  
    return Promise.reject(error)
})

export default service

