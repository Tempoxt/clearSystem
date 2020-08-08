export default [
    {
        path: '',
        name: '/cw',
        component: () =>
            import ('@/views/finance/finance'),
        meta: {
            title: '财务'
        }
    },
    {
        name: 'basicwageList',
        component: () =>
            import ('@/views/finance/salary/basicwage'),
        meta: {
            title: '薪资基础资料'
        }
    },
    {
        name: 'salary',
        component: () =>
            import ('@/views/finance/salary/salaryslip'),
        meta: {
            title: '员工薪资记录'
        }
    },
    {
        name: 'applywageList',
        component: () =>
            import ('@/views/finance/salary/basicwageApplysheet'),
        meta: {
            title: '薪资调整记录'
        }
    },
    {
        name: 'applybasic',
        component: () =>
            import ('@/views/finance/salary/applybasic'),
        meta: {
            title: '工薪确认记录'
        }
    },
    {
        name: 'deduction',
        component: () =>
            import ('@/views/finance/deduction/deduction'),
        meta: {
            title: '补扣款管理'
        }
    },
    {
        name: 'deductionlist',
        component: () =>
            import ('@/views/finance/security/deductionlist'),
        meta: {
            title: '专项扣除'
        }
    },
    {
        name: 'salary/achievement',
        component: () =>
            import ('@/views/finance/salary/achievement'),
        meta: {
            title: '月份绩效考核'
        }
    },
    {
        name: 'staffSalary',
        component: () =>
            import ('@/views/finance/salary/staffSalary'),
        meta: {
            title: '月份绩效考核'
        }
    },
    {
        name: 'invoicerecheck',
        component: () =>
            import ('@/views/finance/productrecheck/invoicerecheck'),
        meta: {
            title: '发票查重管理'
        }
    },
    {
        name: 'lfMemberManager',
        component: () =>
            import ('@/views/finance/lovefoundation/member'),
        meta: {
            title: '会员管理'
        }
    },
    {
        name: 'lfManager',
        component: () =>
            import ('@/views/finance/lovefoundation/debitcredit'),
        meta: {
            title: '基金管理'
        }
    },
    {
        name: 'lfStatistic',
        component: () =>
            import ('@/views/finance/countsheet/countsheet'),
        meta: {
            title: '统计报表'
        }
    },
    {
        name: 'basedataset',
        component: () =>
            import ('@/views/hrfront/comissManage/baseDataSet'),
        meta: {
            title: '基础参数设置'
        }
    },{
        name: 'customerprofile',
        component: () =>
            import ('@/views/hrfront/comissManage/customerProfile'),
        meta: {
            title: '客户档案'
        }
    },
    {
        name: 'commFactor',
        component: () =>
            import ('@/views/hrfront/comissManage/comissionFactor'),
        meta: {
            title: '业务提成系数'
        }
    },
    {
        name: 'commGetcom',
        component: () =>
            import ('@/views/hrfront/comissManage/comissionFactor1'),
        meta: {
            title: '业务提成系数1'
        }
    },
    {
        name: 'productAddRatio',
        component: () =>
            import ('@/views/hrfront/comissManage/proAppreRate'),
        meta: {
            title: '产品增值率'
        }
    },
    {
        name: 'commRecord',
        component: () =>
            import ('@/views/hrfront/comissManage/comissionRecord'),
        meta: {
            title: '业务提成记录'
        }
    },{
        name: 'businessCommisson_v2',
        component: () =>
            import ('@/views/hrfront/comissManage/comissionRecord1'),
        meta: {
            title: '业务提成记录(新)'
        }
    },
    {
        name: 'dispatchCollection',
        component: () =>
            import ('@/views/hrfront/comissManage/dispatchCollRecord'),
        meta: {
            title: '出货收款记录'
        }
    },
    {
        name: 'commissionDemo',
        component: () =>
            import ('@/views/hrfront/comissManage/commissionDemo'),
        meta: {
            title: '数据模拟'
        }
    },
    {
        name: 'prodPropelPlan',
        component: () =>
            import ('@/views/finance/financialSheet/productPlan'),
        meta: {
            title: '生产推进计划'
        }
    },
    {
        name: 'prodBaseLaborHour',
        component: () =>
            import ('@/views/finance/financialSheet/productHours'),
        meta: {
            title: '组件产品基准工时'
        }
    },
    {
        name: 'ExWare',
        component: () =>
            import ('@/views/finance/financialSheet/outboundOrder'),
        meta: {
            title: '出库单'
        }
    },
    {
        name: 'budget',
        component: () =>
            import ('@/views/finance/financialSheet/budgeReport'),
        meta: {
            title: '部门预算明细'
        }
    },
    {
        name: 'moldrate',
        component: () =>
            import ('@/views/finance/financialSheet/moldrate'),
        meta: {
            title: '模具关系制造费用'
        }
    },
    {
        name: 'ExtraOvertime',
        component: () =>
            import ('@/views/finance/salary/extraOver'),
        meta: {
            title: '额外加班费'
        }
    },{
        name: 'salaryquestion',
        component: () =>
            import ('@/views/finance/salary/salaryquestion'),
        meta: {
            title: '工薪疑问单'
        }
    },{
        name: 'guaranteed',
        component: () =>
            import ('@/views/finance/salary/guaranteed'),
        meta: {
            title: '保底名单'
        }
    },{
        name: 'taxs',
        component: () =>
            import ('@/views/finance/salary/tax'),
        meta: {
            title: '个税缴纳累计'
        }
    },{
        name: 'salary/bonus',
        component: () =>
            import ('@/views/finance/salary/bonus'),
        meta: {
            title: '年度奖金'
        }
    },{
        name: 'CostBreakdown',
        component: () =>
            import ('@/views/finance/budgetControl/chargeDetail'),
        meta: {
            title: '费用明细'
        }
    },{
        name: 'StatisticAnalysis',
        component: () =>
            import ('@/views/finance/budgetControl/statisAnalysis'),
        meta: {
            title: '统计分析'
        }
    },{
        name: 'personalincometaxe',
        component: () =>
            import ('@/views/finance/salary/taxNotice'),
        meta: {
            title: '个税通知签名'
        }
    },{
        name: 'monthAward',
        component: () =>
            import ('@/views/finance/salary/monthAward'),
        meta: {
            title: '月度绩效'
        }
    },
    
]