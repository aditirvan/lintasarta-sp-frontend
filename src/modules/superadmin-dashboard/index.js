import dashboard from './superadmin-dashboard'
export default{
    install(Vue){
        Vue.addRoutetoDashboard({
            path: "superadmin-dashboard",
            component: dashboard,
            name: "superadmin-dashboard",
            meta:{
                breadcrumb: {
                    text: 'Dashboard',
                    to: '/superadmin-dashboard',
                },
            }
        })
    }
}