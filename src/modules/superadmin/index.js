import sidemenu from './sidemenu'
import leftnavmenu from './leftnavmenu'
import {SUPERADMIN} from './namespace'
import {store} from './store'
export default {
    install(Vue,{VueEvent}){
        Vue.component('SUPERADMIN-leftnavmenu',leftnavmenu)
        Vue.component('SUPERADMIN-sidemenu',sidemenu)
        Vue.addModules({[SUPERADMIN]:store})
        VueEvent.listen('after-store-created',(store)=>{
            store.commit('ROLEPERMISSION/addcustommenu',
                {
                    component: 'SUPERADMIN-sidemenu',
                    permission: ['superadmin-sidemenu']
                }
            )
            store.commit('ROLEPERMISSION/addLeftNavMenu',
                {
                    component: 'SUPERADMIN-leftnavmenu',
                    permission: ['superadmin-sidemenu']
                }
            )
        })
    }
}