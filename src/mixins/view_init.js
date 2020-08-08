import { getTabs } from '@/api/common'
export default {
    data(){
        return {
          view_menu:[],
          view_activeName:''
        }
      },
    methods:{
        getViewData(url){
            return this.view_menu.find(view=>view.url==url)
        },
        async initTabs(){
            const { menu } = await getTabs(this.$route.query.menuid)
            this.view_menu = menu
            this.view_activeName = menu[0].url
            return menu
        }
    }
}