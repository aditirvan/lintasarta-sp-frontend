import {iVue} from '../type'
import manageaudit from './manageaudit.vue'
import {store} from "./store"
import {MANAGEAUDITLOG} from "./namespace"
export default {
    install(Vue: iVue){
        Vue.addModules({[MANAGEAUDITLOG]:store})
        Vue.addRoutetoDashboard({
            path: '/manage-audit',
            component: manageaudit,
            meta:{
                breadcrumb: {
                    text: 'Manage Audit',
                    to: '/manage-audit',
                },
            }
        })
    }
}