export default  [
  {
    name: 'basicData',
    component: () => import('@/views/setting/sysdic'),
    meta:{
      title:'数据字典'
    }
  },{
    name: 'RemoteFileManger',
    component: () => import('@/views/setting/filemanageTable'),
    meta:{
      title:'远程文件管理'
    }
  },{
    name: 'IPList',
    component: () => import('@/views/setting/ipListTable'),
    meta:{
      title:'IP列表'
    }
  },
]
