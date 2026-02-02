import {iVue} from '../type'
import Commitment from './Commitment.vue'
import { SUPERADMINCOMMITMENT } from './namespace'
import store from './store'


export default {
    install(Vue: iVue){
        // Vue.addRoutetoDashboard({
        //     path: '/commitment-fee',
        //     component: Commitment,
        //     meta:{
        //         breadcrumb: {
        //             text: 'Commitment Fee',
        //             to: '/commitment-fee',
        //         },
        //     }
        // })
        Vue.addModules({[SUPERADMINCOMMITMENT]:store})
    }
}