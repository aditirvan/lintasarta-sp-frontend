import axios from '@/lib/axios'
import externalSubDomain from "@/lib/externalSubDomain"
import {ActionContext, Module} from 'vuex'
interface State{
    members: Array<any>,
    creators: Array<any>,
    pagination: any,
    paginationC: any
}
const store: Module<State,any>= {
    namespaced: true,
    state:{
        creators:[],
        members:[],
        pagination:{},
        paginationC:{},
    },
    mutations:{
        setmembers:(state:State, payload:any)=>state.members = payload,
        setpagination:(state:State, payload:any)=>state.pagination = payload,
        setcreator:(state:State, payload:any)=>state.creators = payload,
        setpaginationC:(state:State, payload:any)=>state.paginationC = payload,
        
    },
    actions:{
        addmember: async(context: ActionContext<State, any>, payload: any)=>{
            const externalSubdomain = externalSubDomain.getSubDomain();
            payload.external_subdomain = externalSubdomain
            const host = window.location.host;
            payload.host = host;
            return await axios.instance.post('/godmode/manageadmin', payload).then(response=>{
                console.log(response)
            })
        },
        fetchmembers:async(context: ActionContext<State, any>, payload: any={page:1,itemsPerPage:10})=>{
            return await axios.instance.get('/godmode/manageadmin',{params:{page:payload.page,limit:payload.itemsPerPage, search:payload.search}}).then(response=>{
                const data = response.data.data
                const {user, paginate} = data
                context.commit('setmembers', user)
                context.commit('setpagination', paginate)
            })
        },

        // fetchcreator:async(context: ActionContext<State, any>, payload: any={page:1,itemsPerPage:5})=>{
        //     return await axios.instance.get('/superadmin/manageuser/creator',{params:{page:payload.page,limit:payload.itemsPerPage, search:payload.search, organization_id: payload.organization_id}}).then(response=>{
        //         const data = response.data.data
        //         const {users, pagination} = data
        //         context.commit('setcreator', users)
        //         context.commit('setpaginationC', pagination)
        //     })
        // },

        editmember: async(context:ActionContext<any, any>, payload:any)=>{
            return await axios.instance.put(`/godmode/manageadmin`, payload).then((response)=>{
                context.dispatch('fetchmembers')
            })
        },

        // tfcreator: async(context:ActionContext<any, any>, payload:any)=>{
        //     return await axios.instance.put(`/superadmin/manageuser/set-creator/${payload.id}`, payload).then((response)=>{   
        //         //context.dispatch('fetchmembers')
        //     })
        // },

        deletemember:async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.delete(`/godmode/manageadmin/${payload.id}`).then(response=>{
                console.log(response)
            })
        },

        resendemail:async(context: ActionContext<State, any>, payload: any)=>{
            const externalSubdomain = externalSubDomain.getSubDomain();
            const host = window.location.host;
            const json = {
                external_subdomain: externalSubdomain,
                host
            }
            return await axios.instance.post(`/godmode/manageadmin/resend-verified/${payload.id}`, json).then(response=>{
                console.log(response)
            })
        },

        changestatus: async(context:ActionContext<any, any>, payload:any)=>{
            if(payload.status == 'active'){
                return await axios.instance.put(`/godmode/manageadmin/${payload.id}/deactive`, payload)
            }else{
                return await axios.instance.put(`/godmode/manageadmin/${payload.id}/active`, payload)
            }
        }
    }
}

export default store