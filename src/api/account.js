import request from '@/plugins/request'
import JsEncrypt from 'jsencrypt'
import crypto from 'crypto'
const publicString = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAlJM2wv1EAp9gid8qQpJrFVji/+yrIwpnqCv4MxkB2FHf8RQVoa27SdxqLSttMhcy0I33GCDIyx8VvBIKKJi7nDVKPjB+0MF7dDEQTn+eI/xGH2jqVybRhuXsLZx3C/RDRf+Rq/WPlMnvz2rzIR2qT8oaH/B29nf9/xldDTtYDwIDAQAB-----END PUBLIC KEY-----"
const jsen = JsEncrypt
let jse = new jsen()
jse.setPublicKey(publicString)
export function login(data) {
    let password = jse.encrypt(data.password)
    let timestamp = Date.parse(new Date())/1000 - 30
    let md5 = crypto.createHash("md5");
    md5.update(timestamp + '_b6k$$mrfou(+*eapw1$cry91a=8kjf(1v__qo-io5b9z_he%7');
    let sign = md5.digest('hex');
    let query = {
        pwd: password,
        sta: data.username,
        code: data.code,
        sign: sign,
        timestamp: timestamp
    }
    return request.post('/doc/login/', query, {headers: {
        'content-type': 'multipart/form-data'
     }})
}
