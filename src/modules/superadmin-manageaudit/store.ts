import { ActionContext, Module } from 'vuex'
import axios from '@/lib/axios'


interface State {
    activities: Array<any>,
    pagination: any
}

export const store: Module<State, any> = {
    namespaced: true,
    state: {
        activities: [],
        pagination: {}
    },
    mutations: {
        setactivities: (state: State, payload: any) => state.activities = payload,
        setpagination: (state: State, payload: any) => state.pagination = payload
    },
    actions: {
        
        fetchactivities: async (context: ActionContext<State, any>, payload: any = { page: 1, itemsPerPage: 10 }) => {
            console.log(payload);
            const params: { page: any, limit: any, sortBy: any, sortDesc: any, organization?: any, project?: any } = { page: payload.page, limit: payload.itemsPerPage, sortBy:payload.sortBy, sortDesc:payload.sortDesc }
            if (payload.organization) {
                params.organization = payload.organization
            }
            if (payload.project) {
                params.project = payload.project
            }
            console.log(params);
            axios.instance.get('/api/v1.1/user/activity/sp/get-auditlog',
                { params }
            ).then((response) => {
                const data = response.data.data
                const { auditlog, pagination } = data
                context.commit('setactivities', auditlog),
                    context.commit('setpagination', pagination)
            }).catch((e) => {
                console.log(e)
            })
        },

        downloadauditlog: async(context: ActionContext<State, any>, payload: any)=>{
            console.log(payload);
            if(payload.org=="" && payload.project==""){
                return await axios.instance.get('api/v1.1/superadmin/auditlog', {params:{days:payload.days}}).then((response)=>{
                    return response.data.data
                })
            }else{
                return await axios.instance.get('api/v1.1/superadmin/auditlog', {params: {organization:payload.org,project:payload.project,days:payload.days}}).then((response)=>{
                    return response.data.data
                })
            }
           
        }
    }
}