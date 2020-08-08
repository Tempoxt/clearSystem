import request from '@/plugins/request'
export function partuser (org_id) {
  return request.get('/user/partuser', { params: { org_id } })
}
export function getUserInfo (org_id) {
  return request.get('/user/user_detail')
}
export function logout () {
  return request.post('/user/logout',{zero:0})
}