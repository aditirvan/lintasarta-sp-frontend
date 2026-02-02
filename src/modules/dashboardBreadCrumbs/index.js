import breadcrumbs from './breadcrumbs'
export default {
    install(Vue, {VueEvent}){
        Vue.component('dashboardBreadCrumbs-breadcrumbs',breadcrumbs)
        VueEvent.listen('after-store-created',(store)=>{
            store.commit('DASHBOARD/setDashboardBreadcrumb','dashboardBreadCrumbs-breadcrumbs')
        })
    }
}