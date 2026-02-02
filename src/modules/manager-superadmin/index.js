import managesuperadmin from './managesuperadmin'
import main from './main.vue'
import {GODMODEMANAGEUSER} from './namespace'
import store from './store'
export default{
    install(Vue){
        Vue.addModules({[GODMODEMANAGEUSER]:store})
        Vue.addRoutetoDashboard({
            path: "manage-superadmin",
            component: main,
            meta:{
                breadcrumb: {
                    text: 'Manage Super Admin',
                    to: '/manage-superadmin',
                },
            },
            children:[
                {
                    path:'',
                    name: "superadmin-managesuperadmin",
                    component: managesuperadmin
                },
              
            ]
        })
    }
}