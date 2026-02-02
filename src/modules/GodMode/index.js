// import sidemenu from './sidemenu'
// import leftnavmenu from './leftnavmenu'
import sidemenu from '../superadmin/sidemenu'
import leftnavmenu from '../superadmin/leftnavmenu'
import {GODMOD} from './namespace'
import {store} from '@/modules/GodMode/store'
export default {
    install(Vue,{VueEvent}){
        Vue.component('GODMOD-leftnavmenu',leftnavmenu)
        Vue.component('GODMOD-sidemenu',sidemenu)
        Vue.addModules({[GODMOD]:store})
        VueEvent.listen('after-store-created',(store)=>{
            store.commit('ROLEPERMISSION/addcustommenu',
                {
                    component: 'GODMOD-sidemenu',
                    permission: ['godmod-sidemenu']
                }
            )
            store.commit('ROLEPERMISSION/addLeftNavMenu',
                {
                    component: 'GODMOD-leftnavmenu',
                    permission: ['godmod-sidemenu']
                }
            )
        })
    }
}