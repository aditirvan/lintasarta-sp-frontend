import _ from 'lodash'
export const lodash = _
export default{
    install(Vue){
        Vue.prototype.$lodash  = _
    }
}