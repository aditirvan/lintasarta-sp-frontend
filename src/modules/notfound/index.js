import notfound from './notfound'
export default {
    install(Vue){
        Vue.addRoutetoDashboard({
            path: 'notfound',
            component: notfound,
        })
        
    }
}