import {ActionContext} from 'vuex'
import axios from '@/lib/axios'
import externalSubDomain from '@/lib/externalSubDomain'
interface State {
    members: Array<any>,
    memberpagination: any
}
export default {
    namespaced: true,
    state:{
        members:[],
        memberpagination: {}
    },
    mutations:{
        setmembers(state: any, members:any){
            state.members = members
        },
        setpagination:(state: State, payload: any)=>state.memberpagination = payload
    },
    actions:{
        addmember: async(context:ActionContext<any, any>, payload:any)=>{
            console.log(payload);
            payload.fullname = payload.full_name
            const externalSubdomain = externalSubDomain.getSubDomain();
            payload.external_subdomain = externalSubdomain
            const host = window.location.host;
            payload.host = host;
            return await axios.instance.post('/user/organization/member', payload).then((response)=>{
                context.dispatch('fetchmembers')
            })
        },
        editmember: async(context:ActionContext<any, any>, payload:any)=>{
            return await axios.instance.put(`/user/organization/member/${payload.id}`, payload).then((response)=>{
                context.dispatch('fetchmembers')
            })
        },

        resendemail:async(context:ActionContext<any, any>, payload:any)=>{
            const externalSubdomain = externalSubDomain.getSubDomain();
            const host = window.location.host;
            const json = {
                external_subdomain: externalSubdomain,
                host
            }
            return await axios.instance.post(`/superadmin/manageuser/resend-verified/${payload.id}`, json).then(response=>{
                context.dispatch('fetchmembers')
            })
        },

          
        deletemember: async(context:ActionContext<any, any>, payload:any)=>{
            return await axios.instance.delete(`/user/organization/member/${payload.id}`).then((response)=>{
                context.dispatch('fetchmembers')
            })
        },
        fetchmembers: async(context:ActionContext<any, any>, payload:any={page:1,itemsPerPage:10, search: ''})=>{
            if (payload.verified && payload.project_id) {
                return await axios.instance.get('/user/organization/member',{params:{page:payload.page,limit:payload.itemsPerPage, search: payload.search, verified: true, project_id: payload.project_id}}).then(response=>{
                    const data = response.data.data
                    const {members, pagination} = data
                    context.commit('setmembers', members)
                    context.commit('setpagination', pagination)
                })
            }
            else {
                return await axios.instance.get('/user/organization/member',{params:{page:payload.page,limit:payload.itemsPerPage, search: payload.search}}).then(response=>{
                    const data = response.data.data
                    const {members, pagination} = data
                    context.commit('setmembers', members)
                    context.commit('setpagination', pagination)
                })
            }
        },
        fetchMembersBySuperAdmin: async(context:ActionContext<any, any>, payload:any={page:1,itemsPerPage:10, search: '' })=>{
            if (payload.verified && payload.project_id) {
                return await axios.instance.get(`/superadmin/manageorg/${payload.organization_id}/member`,{params:{page:payload.page,limit:payload.itemsPerPage, search: payload.search, 'sortBy':payload.sortBy, 'sortDesc':payload.sortDesc, verified: true, project_id: payload.project_id}}).then(response=>{
                const data = response.data.data
                const {user, pagination} = data
                
                context.commit('setmembers', user)
                context.commit('setpagination', pagination)
            })
            } 
            else {
                return await axios.instance.get(`/superadmin/manageorg/${payload.organization_id}/member`,{params:{page:payload.page,limit:payload.itemsPerPage, search: payload.search, 'sortBy':payload.sortBy, 'sortDesc':payload.sortDesc}}).then(response=>{
                    const data = response.data.data
                    const {user, pagination} = data
                    
                    context.commit('setmembers', user)
                    context.commit('setpagination', pagination)
                })
            } 
        },
    }
}

export const namespace = "MEMBER"
export const MEMBER = namespace