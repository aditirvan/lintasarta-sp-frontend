import navmenu from './navmenu'
import profile from './profile'
import {PROFILE} from './namespace'
import store from './store'
export default{
    install(Vue,{VueEvent}){
        Vue.component('PROFILE-navmenu',navmenu)
        VueEvent.listen('after-store-created',(store)=>{
            store.commit('ROLEPERMISSION/addNavCustomMenu',{name: 'PROFILE-navmenu', sort:1,permission:['profile-view']})
        })
        Vue.addRoutetoDashboard({
            path: 'profile',
            component: profile,
            beforeEnter: (to, from, next) => {
                const userpermissions = Vue.store._modules.root._children.ROLEPERMISSION.state.userpermissions
                if(userpermissions.includes('profile-view')){
                    next()
                }else if(from.name != 'main' && from.path ==  '/'){
                    next('/')
                }
            },
        })
        Vue.addModules({[PROFILE]: store})
    }
}