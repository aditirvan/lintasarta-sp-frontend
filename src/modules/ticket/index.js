import navmenu from './navmenu'
export default{
    install(Vue,{VueEvent}){
        Vue.component('TICKET-navmenu',navmenu)
        // VueEvent.listen('after-store-created',(store)=>{
        //     store.commit('ROLEPERMISSION/addmenumodulepermission',
        //         {
        //             header: 'TICKET', headerno: 3,
        //             name: 'Ticketing', link: 'ticket', icon: 'managetiketIcon', sort: 1, permission: ['ticket-sidemenu']
        //         }
        //     )
        //     // store.commit('ROLEPERMISSION/addNavCustomMenu',{name: 'TICKET-navmenu', sort:4,permission:['ticket-view']})
        // })


       
    }
}