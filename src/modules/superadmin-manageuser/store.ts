import { AxiosResponse } from 'axios';
import axios from '@/lib/axios'
import externalSubDomain from '@/lib/externalSubDomain'
import {ActionContext, Module} from 'vuex'
interface State{
    creators: Array<any>,
    members: Array<any>,
    member: any,
    pagination: any,
    paginationC: any
}
const store: Module<State,any>= {
    namespaced: true,
    state:{
        creators:[],
        members:[],
        member:{},
        pagination:{},
        paginationC:{},
    },
    mutations:{
        setmembers:(state:State, payload:any)=>state.members = payload,
        setmember:(state:State, payload:any)=>state.member = payload,
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
            return await axios.instance.post('/superadmin/manageuser', payload).then(response=>{
                console.log(response)
            })
        },
        fetchmembers:async(context: ActionContext<State, any>, payload: any={page:1,itemsPerPage:10})=>{
            return await axios.instance.get('/superadmin/manageuser',{params:{page:payload.page,limit:payload.itemsPerPage, search:payload.search, organization_id: payload.organization_id, role_id:payload.role_id, sortBy:payload.sortBy, sortDesc:payload.sortDesc, is_creator: payload.role_id !== 0 ? false : true}}).then(response=>{
                const data = response.data.data
                const {users, pagination} = data
                context.commit('setmembers', users)
                context.commit('setpagination', pagination)
            })
        },

        fetchmember:async(contex: ActionContext<State, any>, payload: any) => {
            return await axios.instance.get(`/superadmin/manageuser/${payload}`).then((response) => {
                const data = response.data.data
                console.log(data)
                contex.commit('setmember', data)
            })
        },

        fetchcreator:async(context: ActionContext<State, any>, payload: any={page:1,itemsPerPage:10})=>{
            return await axios.instance.get('/superadmin/manageuser/creator',{params:{page:payload.page,limit:payload.itemsPerPage, search:payload.search, organization_id: payload.organization_id}}).then(response=>{
                const data = response.data.data
                const {users, pagination} = data
                context.commit('setcreator', users)
                context.commit('setpaginationC', pagination)
            })
        },

        editmember: async(context:ActionContext<any, any>, payload:any)=>{
            return await axios.instance.put(`/superadmin/manageuser/edit/${payload.id}`, payload).then((response)=>{
                context.dispatch('fetchmembers')
            })
        },

        tfcreator: async(context:ActionContext<any, any>, payload:any)=>{
            return await axios.instance.put(`/superadmin/manageuser/set-creator/${payload.id}`, payload).then((response)=>{   
                //context.dispatch('fetchmembers')
            })
        },

        rejectnpwpktp:async(context: ActionContext<State, any>, payload: any)=>{
            console.log("payloadreject", payload);
            const externalSubdomain = externalSubDomain.getSubDomain();
            payload.external_subdomain = externalSubdomain
            const res = await axios.instance.put(`/superadmin/manageuser/reject/${payload.id}`, {reason: payload.reason, external_subdomain: payload.external_subdomain}).then(response=>{
                console.log(response)
                return response;
            })
            return res;
        },

        verifynpwpktp:async(context: ActionContext<State, any>, payload: any)=>{
            console.log("payloadverif", payload);
            const externalSubdomain = externalSubDomain.getSubDomain();
            payload.external_subdomain = externalSubdomain
            const res = await axios.instance.put(`/superadmin/manageuser/approve/${payload.id}`, payload).then(response=>{
                console.log(response)
                return response
            })
            return res;
        },

        deletemember:async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.delete(`/superadmin/manageuser/delete/${payload.id}`).then(response=>{
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
            return await axios.instance.post(`/superadmin/manageuser/resend-verified/${payload.id}`, json).then(response=>{
                console.log(response)
            })
        },

        changestatus: async(context:ActionContext<any, any>, payload:any)=>{
            const externalSubdomain = externalSubDomain.getSubDomain();
            payload.external_subdomain = externalSubdomain
            let message: string = ''
            try {
                let response: AxiosResponse = null
                if(payload.status == 'active'){
                    message = 'deactivate'
                    response = await axios.instance.put(`/superadmin/manageuser/deactive/${payload.id}`, payload)
                    
                }else{
                    message = 'activate'
                    response = await axios.instance.put(`/superadmin/manageuser/active/${payload.id}`, payload)
                }
                context.dispatch('HOMEPAGE/showSuccessToast', `Successfully to ${message} user`, { root: true }) 
                return response
            } catch (e) {
                const backendErr = e.response.data.data
                let errorMessage = `A problem encountered while ${message} this user`
                if (backendErr.includes('user is not verified yet')) errorMessage = 'User is not verified yet'
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
                return e.response
            }
        }
    }
}

export default store