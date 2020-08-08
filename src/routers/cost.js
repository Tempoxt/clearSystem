export default [
    {
        name: 'standardcost/list',
        component: () => import ('@/views/standardcost/list'),
        meta: {
            title: '存货标准成本'
        }
    },
    {
        name: 'standardcost/record',
        component: () => import ('@/views/standardcost/record'),
        meta: {
            title: '存货标准成本维护'
        }
    }
 ]