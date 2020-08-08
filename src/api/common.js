import request from '@/plugins/request'

export function menuInit (type, parameter, catolog) {
  return request.get('/menuinit', {
    params: {
      type,
      parameter,
      catolog
    }
  })
}
export function getTabs(pk){
  return request.get('/menusheet/menutree/' + pk)
}
export function getMenu (position, pk = 0,power=1) {
  return request.get('/menusheet/menutree/' + pk, {
    params: {
      position,
      power
    }
  })
}
export function getOrg () {
  return request.get('/org')
}

export function  getTag(tag){
    return new Promise(async (resolve)=>{
      let data =  await request.get('/basicdata/dtl?tag='+tag)
        resolve(data.map(o=>{
          return {
            label:o.title,
            value:o.id
          }
      }))
  })
}
export function resource (url) {
  return {
    export (params,config) {
      let p = Object.assign({},params)
      delete p.pagesize
      delete p.currentpage
      return request.get(`/${url}/export`, {
        params:p,
        ...config
      })
    },
    get (params) {
      return request.get(`/${url}`, {
        params
      })
    },
    create (data,config) {
      return request.post(`${url}`, data,config)
    },
    update (pk, data,config) {
      return request.put(`/${url}/` + pk, data,config)
    },
    remove (ids,parmas) {
      return request.delete(`/${url}/bluk`, {
        params: {
          ids,
          ...parmas
        }
      })
    },
    action(action,ids){
      return request.put(`/${url}/bluk`, {
        action
      },{
        params:{
          ids
        },
      })
    },
    find(id,params){
      return request.get(`/${url}/${id}`, {
        params
      })
    },
    getSelect(parmas = {}){
      return request.get(`/${url}/select`, {
        params: parmas
      })
      
    }

  }
}
