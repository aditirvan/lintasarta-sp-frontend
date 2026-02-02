import { Module, ActionContext } from 'vuex'
import axios from '@/lib/axios'
export interface State {
    flavorstype: [],
    paginationtype: any,

}
const storeType: Module<State, any> = {
    namespaced: true,
    state: {
        flavorstype: [],
        paginationtype: {},
        
    },
    mutations: {
        setpaginationtype: (state: State, payload: any) => state.paginationtype = payload,
        setflavorstype: (state: State, payload: any) => state.flavorstype = payload,
     

    },
    actions: {
       
        //type
        fetchflavorstype: async (context: ActionContext<State, any>, payload: any = { page: 1, itemsPerPage: 10, search: '' }) => {
            return await axios.instance.get('/flavor/type',
                {
                    params: {
                        page: payload.page,
                        limit: payload.itemsPerPage,
                        search: payload.search,
                    }
                }).then(response => {
                    const data = response.data.data
                    const { types, pagination } = data
                    context.commit('setflavorstype', types)
                    context.commit('setpaginationtype', pagination)
                })
        },

        addFlavortype: async (context: ActionContext<State, any>, payload: any) => {
            return axios.instance.post('/flavor/type', payload).then(response => {
                
            }).catch((e) => {
                if (e.response.data.data) {
                    return Promise.reject(e)
                } else {
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                    return Promise.reject("error")
                }
            })
        },
        editFlavortype: async (context: ActionContext<State, any>, payload: any) => {
            return axios.instance.put(`/flavor/type`, payload).then(response => {
                
            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                return Promise.reject(e)
            })
        },
        deleteFlavortype: async (context: ActionContext<State, any>, payload: any) => {
            return await axios.instance.delete(`/flavor/type/delete/${payload.id}`).then(response => {
                
            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            })
        },
        
       
        

    }
}
export default storeType