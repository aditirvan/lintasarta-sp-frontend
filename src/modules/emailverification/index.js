import verify from './verify.vue'
import {VERIFYEMAIL} from './namespace'
import store from './store'
export default {
    install(Vue){
        Vue.addRoutes({
            path : '/verify',
            component : verify,
        })
        Vue.addModules({[VERIFYEMAIL]:store})
}
}