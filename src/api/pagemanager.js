import request from '@/plugins/request'

// export function getAction (params) {
//   return request.get('/pagemanager/menuaction', { params })
// }
// export function createAction (data) {
//   return request.post('/pagemanager/menuaction', data)
// }

// export function removeActions (ids) {
//   return request.delete('/pagemanager/menuaction/bluk', { params: { ids } })
// }

// export function getField (params) {
//   return request.get('/pagemanager/field', { params })
// }

export function create (data) {
  return request.post('/menusheet', data)
}
export function update (pk, data) {
  return request.put('/menusheet/' + pk, data)
}
export function remove (ids) {
  return request.delete('/menusheet/bluk', { params: { ids } })
}
