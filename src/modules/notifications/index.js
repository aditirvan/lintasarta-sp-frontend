import navmenu from './navmenu'
import store from './store'
import { NOTIFICATION } from './namespace'

export default {
    install(Vue,{VueEvent}){
        Vue.addModules({
            [NOTIFICATION]:store
        })
        Vue.component('NOTIFICATIONS-navmenu',navmenu)
        VueEvent.listen('after-store-created',(store)=>{
            store.commit('ROLEPERMISSION/addNavCustomMenu',{name: 'NOTIFICATIONS-navmenu', sort:2, permission:['notification-view']})
        })
    }
}