import {iVue} from '../type'
import manageos from './manageos.vue'
import managetype from './managetype/managetype.vue'
import {SUPERADMINMANAGEOS,SUPERADMINMANAGEOSTYPE} from './namespace'
import main from './main.vue'
import store from './store'
import storeType from './managetype/storeType'
export default{
    install(Vue){
        Vue.addModules({[SUPERADMINMANAGEOS]: store})
        Vue.addModules({[SUPERADMINMANAGEOSTYPE]: storeType})
        Vue.addRoutetoDashboard({
            path: "manage-os",
            component: main,
            meta:{
                breadcrumb: {
                    text: 'Manage Image',
                    to: '/manage-os',
                },
            },
            children:[
                {
                    path:'',
                    component: manageos,
                    name: "superadmin-manageos",

                },
               
                {
                    path:'manage-type-os',
                    component: managetype,
                    meta:{
                        breadcrumb: {
                            text: 'Manage Type Operating System',
                            to: '',
                        },
                    },
                },
            ]
        })
    }
}