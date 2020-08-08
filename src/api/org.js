import request from '@/plugins/request'
export function getOrgUser (org_id) {
  return request.get('/user/smalluser', { params: { org_id } })
}

export function category (parent_org) {
  return request.get('/org/orgtype', { params: { parent_org } })
}
