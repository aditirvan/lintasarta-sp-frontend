import axios from '@/lib/axios'
import { async } from 'rxjs'
import {ActionContext, Module} from 'vuex'
interface State{

}
const store: Module<State,any>= {
    namespaced: true,
    actions:{
        verifyemail:async(context: ActionContext<State, any>, token:any)=>{
            return await axios.instance.get('/user/verify',{params:{token:token}})
        }
    }
}
export default store