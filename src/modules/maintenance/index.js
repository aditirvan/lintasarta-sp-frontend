import maintenance from './maintenance'
export default {
    install(Vue){
        Vue.addRoutes({
            path: '/maintenance',
            component: maintenance,
        })
        
    }
}