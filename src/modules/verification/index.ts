import { iVue } from "../type"
import verification from './verification.vue'
export default {
    install(Vue: iVue){
        Vue.addRoutes({
            path : '/verification',
            component : verification,
        })
}
}