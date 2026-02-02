import { iVue } from "@/modules/type";

export default (Vue: iVue) =>{
    return async ()=>{
        const currentOrg = localStorage.getItem('currentOrg')
        const currentProj =  localStorage.getItem('currentProj')
        if(currentOrg && currentProj){
            return Promise.resolve()
        }else{
            if(Vue.router.currentRoute.name != 'main'){
                Vue.router.replace('/')
            }
            Vue.store.commit('PROJECT/setopendialogselectfirst', true)
            return Promise.reject()
        }
    }

}