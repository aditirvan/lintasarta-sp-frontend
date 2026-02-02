import eulaContent from './eulaContent'
export default {
    install(Vue){
        Vue.addRoutes({
            path: '/eula-content',
            component: eulaContent,
        })
        
    }
}