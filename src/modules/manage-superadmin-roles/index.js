import roles from './roles'
import main from './main.vue'
import detail from './detail.vue'
import {GODMODEMANAGEROLES} from './namespace'
import store from './store'
export default{
    install(Vue){
        Vue.addModules({[GODMODEMANAGEROLES]:store})
        Vue.addRoutetoDashboard({
            path: "manage-superadmin-roles",
            component: main,
            meta:{
                breadcrumb: {
                    text: 'Manage Admin Roles',
                    to: '/manage-superadmin-roles',
                },
            },
            children:[
                {
                    path:'',
                    name: "superadmin-managesuperadmin-roles",
                    component: roles
                },
                {
                    path:'create',
                    name: "superadmin-managesuperadmin-roles-create",
                    component: detail
                },
                {
                    path:':id',
                    name: "superadmin-managesuperadmin-roles-detail",
                    component: detail
                }
            ]
        })
    }
}