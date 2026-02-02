import signup from './signup'
import {SIGNUP} from './namespace'
import store from './store'
export default {
    install(Vue){
        Vue.addModules({[SIGNUP]:store})
        Vue.addRoutes({
            path : '/signup',
            component : signup,
        })
}
}