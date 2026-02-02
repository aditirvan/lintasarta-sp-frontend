import axios from '@/lib/axios'
import {ActionContext, Module} from 'vuex'
interface State{
    roles: Array<any>,
    admins: any,
    roles_pagination: any,
    isLoading: boolean
}
const store: Module<State,any>= {
    namespaced: true,
    state:{
        isLoading: false,
        roles:[],
        roles_pagination:{},
        admins: {
            pagination: {},
            data: []
        },
    },
    actions: {
        getAdminsOfARole: async(context: ActionContext<State, any>, payload: any)=>{
            context.commit("setIsLoading", true);
            let params = {}
            if (payload && payload.params) {
                params = payload.params
            }
            return await axios.instance.get(`/super-admin-role/${payload.id}/admins`,{
                params : params
            }).then(response=>{
                context.commit('setAdmins', response.data)
                if (response.status === 200){
                    return response.data;
                }
            }).catch(e => {
                if (e.response.status >= 500){
                    context.dispatch('HOMEPAGE/showErrorToast', 'Internal Server Error', { root: true })
                }else if (e.response.status >= 400){
                    context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
                }
            })
        },
        signAdminOfARole: async(context: ActionContext<State, any>, payload: any)=>{
            context.commit("setIsLoading", true);
            return await axios.instance.post(`/super-admin-role/${payload.id}/admin/${payload.admin_id}`).then(response=>{
                context.dispatch('HOMEPAGE/showSuccessToast', 'Admin has been successfully assigned!', { root: true })
                return response
            }).catch(e => {
                if (e.response.status >= 500){
                    context.dispatch('HOMEPAGE/showErrorToast', 'Internal Server Error', { root: true })
                }else if (e.response.status >= 400){
                    context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
                }
                return e.response
            })
        },
        removeAdminOfARole: async(context: ActionContext<State, any>, payload: any)=>{
            context.commit("setIsLoading", true);
            return await axios.instance.delete(`/super-admin-role/${payload.id}/admin/${payload.admin_id}`).then(response=>{
                context.dispatch('HOMEPAGE/showSuccessToast', 'Admin has been successfully removed!', { root: true })
                return response
            }).catch(e => {
                if (e.response.status >= 500){
                    context.dispatch('HOMEPAGE/showErrorToast', 'Internal Server Error', { root: true })
                }else if (e.response.status >= 400){
                    context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
                }
                return e.response
            })
        },


        getSuperAdminRole: async(context: ActionContext<State, any>, payload: any)=>{
            context.commit("setIsLoading", true);
            let params = {}
            if (payload && payload.params) {
                params = payload.params
            }
            return await axios.instance.get('/super-admin-role',{
                params : params
            }).then(response=>{
                context.commit('setRoles', response.data.data)
                context.commit('setPagination', response.data.paginate)
                return response
            }).catch(e => {
                return e.response
            })
        },
        getSuperAdminRoleDetail: async(context: ActionContext<State, any>, id: any)=>{
            context.commit("setIsLoading", true);
            return await axios.instance.get('/super-admin-role/'+id).then(response=>{
                if (response.status === 200){
                    return JSON.parse(JSON.stringify(response.data.data))
                }
            }).catch(e => {
                if (e.response.status >= 500){
                    context.dispatch('HOMEPAGE/showErrorToast', 'Internal Server Error', { root: true })
                }else if (e.response.status >= 400){
                    context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
                }
            })
        },
        updateSuperAdminRole: async(context: ActionContext<State, any>, payload: any)=>{
            context.commit("setIsLoading", true);
            return await axios.instance.put(`/super-admin-role/${payload.id}`, payload).then(response=>{
                context.dispatch('HOMEPAGE/showSuccessToast', 'Role has been succesfully updated', { root: true })
                return response
            }).catch(e => {
                if (e.response.status >= 500){
                    context.dispatch('HOMEPAGE/showErrorToast', 'Internal Server Error', { root: true })
                }else if (e.response.status >= 400){
                    context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
                }
                return e.response
            })
        },
        addSuperAdminRole: async(context: ActionContext<State, any>, payload: any)=>{
            context.commit("setIsLoading", true);
            return await axios.instance.post('/super-admin-role', payload).then(response=>{
                context.dispatch('HOMEPAGE/showSuccessToast', 'Role has been succesfully created', { root: true })
                return response
            }).catch(e => {
                if (e.response.status >= 500){
                    context.dispatch('HOMEPAGE/showErrorToast', 'Internal Server Error', { root: true })
                }else if (e.response.status >= 400){
                    context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
                }
                return e.response
            })
        },
        deleteSuperAdminRole: async(context: ActionContext<State, any>, payload: any)=>{
            context.commit("setIsLoading", true);
            return await axios.instance.delete(`/super-admin-role/${payload.id}`, ).then(response=>{
                context.dispatch('HOMEPAGE/showSuccessToast', 'Role has been succesfully deleted', { root: true })
                return response
            }).catch(e => {
                if (e.response.status >= 500){
                    context.dispatch('HOMEPAGE/showErrorToast', 'Internal Server Error', { root: true })
                }else if (e.response.status >= 400){
                    context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
                }
                return e.response
            })
        },
    },
    mutations:{
        setPagination:(state:State, payload:any)=>state.roles_pagination = payload,
        setRoles(state, roles) {
            state.roles = roles
        },
        setAdmins(state, admins) {
            state.admins = admins
        },
        setIsLoading(state, flag) {
            state.isLoading = flag
        },
    }
}

export default store