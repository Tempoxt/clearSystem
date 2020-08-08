export default [
    {
        name: 'invitation_',
        component: () => import('@/views/nh/annualmeeting/invitationcheck'),
        meta:{
            title:'邀请函名单'
        }
    },{
        name: 'winning_list',
        component: () => import('@/views/nh/annualmeeting/winningrecord'),
        meta:{
            title:'中奖名单'
        }
    },{
        name: 'siteSet',
        component: () => import('@/views/nh/annualmeeting/siteManager/siteManager'),
        meta:{
            title:'排位管理'
        }
    },{
        name: 'drawSort',
        component: () => import('@/views/nh/annualmeeting/siteManager/drawOrder'),
        meta:{
            title:'抽签顺序'
        }
    },{
        name: 'programvote',
        component: () => import('@/views/nh/annualmeeting/programSelection/programSelection'),
        meta:{
            title:'节目评选'
        }
    },{
        name: 'allSiteSet',
        component: () => import('@/views/nh/annualmeeting/siteManager/rank'),
        meta:{
            title:'员工排位'
        }
    },
 ]