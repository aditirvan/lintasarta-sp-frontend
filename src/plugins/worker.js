import {worker} from "../lib/worker"
export default{
    install(Vue){
        Vue.prototype.$worker  = worker
    }
}