import {ActionContext, Module} from 'vuex'
import axios from '@/lib/axios'
interface State {
    notifs: [],
    // pagination: any
}
const store: Module<State,any>= {
    namespaced: true,
    state:{
        notifs: [],
        
        // pagination: {}
    },
    mutations:{
        setnotifs:(state:State,payload:any)=>state.notifs = payload,
        // setpagination: (state:State, payload:any)=>state.pagination = payload
    },
    actions:{
        fetchnotifs: async(context: ActionContext<State, any>, payload: any={})=>{
           
            axios.instance.get('/user/notifications',{params:{}}).then((response)=>{
                const data = response.data.data
                const {notification} = data
                context.commit('setnotifs', data)
            }).catch((e)=>{
                // console.log(e)
            })
        },
            
    }
    
}
export default store