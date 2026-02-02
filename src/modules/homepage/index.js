import loginbutton from './loginbutton'
import signupbutton from './signupbutton'
import homepage from './homepage'

import store from './store'
import {HOMEPAGE} from './namespace'
export default {
    // called by Vue.use(FirstPlugin)
    install(Vue, {VueEvent}) {
        Vue.component('HOMEPAGE',homepage)
        Vue;
        Vue.component("homepage-landingpage",homepage)
        Vue.component("homepage-loginbutton",loginbutton)
        Vue.component("homepage-signupbutton",signupbutton)
        
        // Vue.addRoutes({path: "/", name:'home', component: homepage})
        Vue.addModules({[HOMEPAGE]:store})
        VueEvent.listen('after-store-created', (store) => {
            VueEvent.listen('after-check-login', (user) => {
                if(user.privilages)store.commit("HOMEPAGE/setprivilages", user.privilages)
            })
        })
        
    }
 }