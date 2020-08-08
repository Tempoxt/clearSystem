import request from '@/plugins/request'


export function get(params) {
    return request.get('/actionsheet', { params })
}
