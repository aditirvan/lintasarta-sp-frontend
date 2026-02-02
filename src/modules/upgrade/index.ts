import {iVue} from '../type'
import upgrade from './upgrade.vue'
export default{
    install(Vue: iVue){
        Vue.addRoutetoDashboard({
            path : '/upgrade',
            component : upgrade,
            meta: {
                breadcrumb: {
                    text: 'Upgrade Basic to Premium',
                    to: '/upgrade',
                  },
                },
        })
    }
}