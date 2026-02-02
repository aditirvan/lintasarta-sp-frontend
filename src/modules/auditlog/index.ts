import {iVue} from '../type'
import {AUDITLOG} from './namespace'
import store from './store'
import auditlog from './auditlog.vue'
export default {
    install(Vue: iVue){
        Vue.addModules({
            [AUDITLOG]:store
        })
        Vue.addRoutetoDashboard({
            path: 'audit-log',
            component: auditlog,
        })
    }
}