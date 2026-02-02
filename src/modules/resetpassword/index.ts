import { iVue } from "../type"
import resetpassword from './resetpassword.vue'
export default {
    install(Vue: iVue){
        Vue.addRoutes({
            path : '/reset-password',
            component : resetpassword,
        }),
        Vue.addRoutes({
            path : '/user-verification',
            component : resetpassword,
        })
    }
    
}