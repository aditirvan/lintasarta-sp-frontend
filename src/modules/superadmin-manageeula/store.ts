import { ActionContext, Module } from 'vuex'
interface State {
    listeula: [],
    pagination: any,
    idEula: string,
}
import axios from '@/lib/axios'
const store: Module<State,any>= {
    namespaced: true,
    state:{
        listeula: [],
        pagination:{},
        idEula: ''
    },
    mutations:{
        setpagination:(state:State,payload:any)=>state.pagination=payload,
        setlisteula:(state:State,payload:any)=>state.listeula=payload,
        setIdEula:(state:State,idEula:any)=>state.idEula=idEula
    },
    getters: {
        getIdEula: (state: any) => {
            return state.idEula
        },
    },
    actions:{
        fetcheula:async(context: ActionContext<State, any>,payload:any={page:1,limit:10})=>{
            return await axios.instance.post('/superadmin/eula', payload).then((response)=>{
                const data = response.data.data
                console.log('eula')
                console.log(response)
                console.log('eula')
                // const {image, pagination} = data
                // console.log('image')
                // console.log(image)
                // console.log('image')
                var tes = {
                    count : 12,
                    page : 1
                }
                context.commit('setlisteula',data)
                context.commit('setpagination',tes)
                return data
            })
        },
    }
}

export default store