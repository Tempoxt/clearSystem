export default [
    {
        name: 'PerformanceScheme',
        component: () =>
            import ('@/views/performance/performanceScheme'),
        meta: {
            title: '考核方案公式设置'
        }
    },
    {
        name: 'performance_param',
        component: () =>
            import ('@/views/performance/paramsSet'),
        meta: {
            title: '考核方案参数设置'
        }
    },
    {
        name: 'PersonalPerformance',
        component: () =>
            import ('@/views/performance/personalPerform'),
        meta: {
            title: '员工考核方案设置'
        }
    },{
        name: 'YearParameterValue',
        component: () =>
            import ('@/views/performance/yearParams'),
        meta: {
            title: '年度考核目标数据'
        }
    },{
        name: 'personal_param',
        component: () =>
            import ('@/views/performance/personalParams'),
        meta: {
            title: '员工绩效数据录入'
        }
    },{
        name: 'performance_count',
        component: () =>
            import ('@/views/performance/performanceCount'),
        meta: {
            title: '绩效统计'
        }
    },
]