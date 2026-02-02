import manageuser from './manageuser'
import main from './main.vue'
import detailuser from './detailuser.vue'
import {SUPERADMINMANAGEUSER} from './namespace'
import store from './store'
export default{
    install(Vue){
        Vue.addModules({[SUPERADMINMANAGEUSER]:store})
        Vue.addRoutetoDashboard({
            path: "manage-user",
            component: main,
            meta:{
                breadcrumb: {
                    text: 'Manage User',
                    to: '/manage-user',
                },
            },
            children:[
                {
                    path:'',
                    name: "superadmin-manageuser",
                    component: manageuser
                },
                {
                    path:':userdetailid',
                    component: detailuser,
                    meta:{
                        breadcrumb: {
                            text: 'Detail User',
                            to: '/manage-user/:userdetailid',
                        },
                    },
                }
            ]
        })
    }
}