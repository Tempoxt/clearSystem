export default [
    {
        name: 'AvoidDuplication',
        component: () => import ('@/views/product/productrecheck/productrecheck'),
        meta: {
            title: '产品防重'
        }
    },
    {
        name: 'GMScanRecord',
        component: () => import ('@/views/product/gm/gm'),
        meta: {
            title: 'GM19015'
        }
    },
    {
        name: 'OperateList',
        component: () => import ('@/views/product/operate/operate'),
        meta: {
            title: '操作名单'
        }
    },
    {
        name: 'ErrorPproofQuery',
        component: () =>
            import ('@/views/product/errorPproofQuery/index'),
        meta: {
            title: '防错记录查询'
        }
    },
    {
        name: 'productionHoursForm',
        component: () => import ('@/views/product/productionHours'),
        meta: {
            title: '生产工时登记'
        }
    },
    {
        name: 'prod_promotion',
        component: () => import ('@/views/product/productPlan/index'),
        meta: {
            title: '生产推进计划'
        }
    },
 ]