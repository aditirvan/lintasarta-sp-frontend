import axios from '@/lib/axios'
import localstorage from "@/lib/localstorage";
const projObj = JSON.parse(localstorage.getItem("currentProj"));
const storeServerGroup = {
    namespaced: true,
    state: {        
        servergroupByProject:[],
        servergroup: {},
        isServerGroupLoading: false,
        servergroupPaginator: {
            count: 1,
            totalpage: 1,
            page: 1,
            limit: 10,
        },
    },
    mutations: {        
        setServerGroup: (state, payload) => state.servergroup = payload,
        setIsServerGroupLoading: (state, payload) => state.isServerGroupLoading = payload,
        setServerGroupByProject: (state, payload) => state.servergroupByProject = payload,
    },
    actions: {
        createServerGroup: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsServerGroupLoading', true)
                const response = await axios.instance.post(`/servergroup/create`, payload)
                dispatch('fetchServerGroupByProject')

                dispatch('HOMEPAGE/showSuccessToast', 'New Server Group has been successfully created', { root: true })
                commit('setIsServerGroupLoading', false)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to create new server group'
                if (err.includes('servergroup name has already exist')) errorMessage = 'Server Group name is already exists.'
                else if (err.includes('server group is out of limit.')) errorMessage = 'Server Group is out of limit. Please contact the administrator.'
                commit('setIsServerGroupLoading', false)
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                return e.response
            }
        },                   
        deleteServerGroup: async ({ commit, dispatch }, servergrouID) => {
            try {
                commit('setIsServerGroupLoading', true)
                const response = await axios.instance.delete(`/servergroup/delete/${servergrouID}`)
                commit('setIsServerGroupLoading', false)
                dispatch('fetchServerGroupByProject')

                dispatch('HOMEPAGE/showSuccessToast', 'Server Group has been successfully deleted', { root: true })
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to delete servergroup'
                if (err.includes('can\'t delete servergroup, there are instances still using this servergroup')) errorMessage = 'Unable to delete. There are active resources in this servergroup.'
                else if (err.includes('servergroup used by instance')) errorMessage = 'Please remove the attached instance before deleting the server group.'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsServerGroupLoading', false)
                return e.response
            }
        },
        fetchServerGroupByProject: async ({ commit, dispatch, rootState }, payload = {page: 0, limit: 0, order_by: '', project_id: ''}) => {
            try {                
                if (payload.limit == 0) payload.limit = rootState['SERVERGROUP'].servergroupPaginator.limit
                if (payload.page == 0) payload.page = rootState['SERVERGROUP'].servergroupPaginator.page
                if (payload.order_by == '') payload.order_by = 'asc'
                if (payload.project_id == '') payload.project_id = projObj.id  
                commit('setIsServerGroupLoading', true)
                const response = await axios.instance.get(`/servergroup/list`, {
                    params: { ...payload }
                })
                if (response.data.data == null){
                    commit('setIsServerGroupLoading', false)
                    commit('setServerGroupByProject', [])
                }else{          
                    let policyName = ''
                    const data = response.data.data.map(x => {                        
                        if(x.policy == 'affinity'){
                            policyName = 'Affinity'
                        }else if(x.policy == 'anti-affinity'){
                            policyName = 'Anti Affinity'
                        }else if(x.policy == 'soft-affinity'){
                            policyName = 'Soft Affinity'
                        }else if(x.policy == 'soft-anti-affinity'){
                            policyName = 'Soft Anti Affinity'
                        }
                        return {
                            id: x.id,
                            name: x.name,
                            policy: x.policy,
                            policy_name: policyName,
                            instances: x.instances,
                        }
                    })
                    commit('setIsServerGroupLoading', false)
                    commit('setServerGroupByProject', data)
                    return response
                }                                
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to get list of servergroups'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsServerGroupLoading', false)
                return e.response
            }
        },               
    }
}
export default storeServerGroup