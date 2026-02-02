import navmenu from './navmenu'
export default{
    install(Vue,{VueEvent}){
        Vue.component('DOCS-navmenu',navmenu)
        VueEvent.listen('after-store-created',(store)=>{
            // store.commit('ROLEPERMISSION/addNavCustomMenu',{name: 'DOCS-navmenu', sort:5, permission:['docs-view']})
        })
    }
}