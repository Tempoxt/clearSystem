
export default [
  {
    name: 'dormitory/dorm',
    component: () => import('@/views/hr/dormitory/dorm'),
    meta:{
      title:'宿舍管理'
    }
  },
  {
    path: 'information',
    name:'information',
    component: () => import('@/views/hr/personnel-information')
  },
  {
    
    name: 'restaurant',
    component: () => import('@/views/hr/restaurant'),
    meta:{
      title:'餐厅设置'
    }
  },
  {

    name: 'mealType',
    component: () => import('@/views/hr/restaurant-meallevel'),
    meta:{
      title:'餐次类型'
    }
  },
  {
    path:'restaurant-meal',
    name: 'meal',
    component: () => import('@/views/hr/restaurant-meal'),
    meta:{
      title:'餐次设置'
    }
  },
  {
    path:'restaurant-restaurantmeal',
    name: 'restaurantmeal',
    component: () => import('@/views/hr/restaurant-restaurantmeal'),
    meta:{
      title:'餐厅餐次设置'
    }
  },
  {
    path:'officeaddress',
    name: 'officeaddress',
    component: () => import('@/views/hr/officeaddress'),
    meta:{
      title:'办公地点'
    }
  },
  {
    path:'basicdata/jobtitle',
    name: 'jobtitle',
    component: () => import('@/views/hr/basicdata/jobtitle'),
    meta:{
      title:'职位管理'
    }
  },


]
