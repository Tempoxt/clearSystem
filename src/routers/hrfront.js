export default [{
        path: '',
        name: '/hrfront',
        component: () =>
            import ('@/views/hrfront/dashboard'),
        meta: {
            title: '人事'
        }
    },
    {
        name: 'addAccidentIns',
        component: () =>
            import ('@/views/hrfront/staffinsure/addAccide'),
        meta: {
            title: '意外险名单新增'
        }
    },
    {
        name: 'cancelAccidentIns',
        component: () =>
            import ('@/views/hrfront/staffinsure/cancelAccide'),
        meta: {
            title: '意外险名单减少'
        }
    },{
        name: 'accidentInsRecord',
        component: () =>
            import ('@/views/hrfront/staffinsure/accideRecord'),
        meta: {
            title: '意外险扣费记录'
        }
    },
    {
        name: 'addSocialIns',
        component: () =>
            import ('@/views/hrfront/socialFund/socialSecurity/addSecurity'),
        meta: {
            title: '社保名单新增'
        }
    },
    {
        name: 'cancelSocialIns',
        component: () =>
            import ('@/views/hrfront/socialFund/socialSecurity/cancelSecurity'),
        meta: {
            title: '社保名单注销'
        }
    },
    {
        name: 'securitylist',
        component: () =>
            import ('@/views/hrfront/socialFund/socialSecurity/securitylist'),
        meta: {
            title: '社保缴费记录'
        }
    },
    {
        name: 'addReserveFund',
        component: () =>
            import ('@/views/hrfront/socialFund/provideFund/addProfund'),
        meta: {
            title: '公积金名单新增'
        }
    },
    {
        name: 'cancelReserveFund',
        component: () =>
            import ('@/views/hrfront/socialFund/provideFund/cancelProfund'),
        meta: {
            title: '公积金名单注销'
        }
    },
    {
        name: 'fundlist',
        component: () =>
            import ('@/views/hrfront/socialFund/provideFund/profundlist'),
        meta: {
            title: '公积金缴费记录'
        }
    },
    {
        name: 'reserveFundPayRatio',
        component: () =>
            import ('@/views/hrfront/socialFund/provideFund/profundRadio'),
        meta: {
            title: '公积金缴纳比例'
        }
    }, 
    {
        name: 'hrmplan/staffplan',
        component: () =>
            import ('@/views/hrfront/hrmplan/staffPlan/staffPlan'),
        meta: {
            title: '人员编制规划'
        }
    },
    {
        name: 'employeeShift',
        component: () =>
            import ('@/views/hrfront/employeeTurnover/employee'),
        meta: {
            title: '员工转正'
        }
    },
    {
        name: 'employeeDoc',
        component: () =>
            import ('@/views/hrfront/personnelmanagement/personnelmanagement-employee'),
        meta: {
            title: '员工档案'
        }
    },
    {
        name: 'transfer/record',
        component: () =>
            import ('@/views/hrfront/personnelmanagement/transfer'),
        meta: {
            title: '人员调动'
        }
    },
    {
        name: 'hrmblacklist/record',
        component: () =>
            import ('@/views/hrfront/personnelmanagement/hrmblacklist'),
        meta: {
            title: '人员黑名单'
        }
    },
    {
        name: 'clothesList',
        component: () =>
            import ('@/views/hrfront/workclothes/list'),
        meta: {
            title: '工衣清单'
        }
    },
    {
        name: 'clothesRetrieval',
        component: () =>
            import ('@/views/hrfront/workclothes/retrievalist'),
        meta: {
            title: '工衣领用'
        }
    },
    {
        name: 'clothesIssue',
        component: () =>
            import ('@/views/hrfront/workclothes/issue'),
        meta: {
            title: '工衣发放'
        }
    },
    {
        name: 'clothesReport',
        component: () =>
            import ('@/views/hrfront/workclothes/report'),
        meta: {
            title: '工衣报表'
        }
    },
    {
        name: 'outDutyLog',
        component: () =>
            import ('@/views/hrfront/personnelmanagement/outDutyLog'),
        meta: {
            title: '离职登记'
        }
    },
    {
        name: 'recruitDoc',
        component: () =>
            import ('@/views/hrfront/recruitment/recruitment'),
        meta: {
            title: '招聘档案'
        }
    },
    {
        name: 'Onboarding',
        component: () =>
            import ('@/views/hrfront/recruitment/backgroundCheck'),
        meta: {
            title: '新入职登记'
        }
    },{
        name: 'applyResume',
        component: () =>
            import ('@/views/hrfront/recruitment/applyResume'),
        meta: {
            title: '应聘履历表'
        }
    },
    {
        name: 'workwechatContact',
        component: () =>
            import ('@/views/hrfront/recruitment/workContract'),
        meta: {
            title: '电子合同'
        }
    },
    {
        name: 'FieldParams',
        component: () =>
            import ('@/views/hrfront/recruitment/fieldParams'),
        meta: {
            title: '招聘字段设置'
        }
    },{
        name: 'InterviewMsg',
        component: () =>
            import ('@/views/hrfront/recruitment/interview'),
        meta: {
            title: '部门岗位面试设置'
        }
    },
    {
        name: 'introducercost',
        component: () =>
            import ('@/views/hrfront/introducercost/introlist'),
        meta: {
            title: '介绍费汇总'
        }
    }, 
    {
        name: 'frontGateManage',
        component: () =>
            import ('@/views/hrfront/devicemanager/devicelistmanage'),
        meta: {
            title: '考勤门禁设置'
        }
    },
    {
        name: 'attendanceDetail',
        component: () =>
            import ('@/views/hrfront/attendance/recordlist'),
        meta: {
            title: '考勤明细'
        }
    },
    {
        name: 'attendaceList',
        component: () =>
            import ('@/views/hrfront/attendance/countlist'),
        meta: {
            title: '考勤总汇'
        }
    },
    {
        name: 'refakelist',
        component: () =>
            import ('@/views/hrfront/attendance/openDisplay/recordlist'),
        meta: {
            title: '考勤明细1'
        }
    },
    {
        name: 'cofakelist',
        component: () =>
            import ('@/views/hrfront/attendance/openDisplay/countlist'),
        meta: {
            title: '考勤总汇1'
        }
    },
    {
        name: 'yearHolidayManager',
        component: () =>
            import ('@/views/attendanceSystem/annualLeave'),
        meta: {
            title: '年假管理'
        }
    },
    {
        name: 'unusualManager',
        component: () =>
            import ('@/views/attendanceSystem/exceptionManage'),
        meta: {
            title: '异常管理'
        }
    },
    {
        name: 'overtimeApply',
        component: () =>
            import ('@/views/attendanceSystem/overtimeRecord'),
        meta: {
            title: '加班记录'
        }
    },{
        name: 'HolidaySet',
        component: () =>
            import ('@/views/attendanceSystem/holidaySetting'),
        meta: {
            title: '假日设定'
        }
    },{
        name: 'classset',
        component: () =>
            import ('@/views/attendanceSystem/shiftSetting'),
        meta: {
            title: '班次设定'
        }
    },{
        name: 'intelligentteam',
        component: () =>
            import ('@/views/attendanceSystem/intellTeam'),
        meta: {
            title: '智能班组'
        }
    },{
        name: 'shiftManagement',
        component: () =>
            import ('@/views/attendanceSystem/temporary'),
        meta: {
            title: '调休管理'
        }
    },{
        name: 'classesManager',
        component: () =>
            import ('@/views/attendanceSystem/classManage'),
        meta: {
            title: '排班管理'
        }
    },{
        name: 'attRecordSheet',
        component: () =>
            import ('@/views/attendanceSystem/attendanceRecord'),
        meta: {
            title: '考勤记录'
        }
    },{
        name: 'monthot',
        component: () =>
            import ('@/views/attendanceSystem/monthot'),
        meta: {
            title: '额外加班工时'
        }
    },
]