import {Module, Store} from 'vuex'
import VueRouter, {RouteConfig} from 'vue-router'
interface ModuleConfig<S,R> {
    [key:string]:Module<S,R>
}
export interface iVue {
    addModules: <S,R>(M:ModuleConfig<S,R>)=>{},
    addRoutes: (R:RouteConfig)=>{},
    addRoutetoDashboard: (R:RouteConfig)=>{}
    store: Store<any>,
    router: VueRouter
}