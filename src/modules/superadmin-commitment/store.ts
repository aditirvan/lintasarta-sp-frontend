import axios from '@/lib/axios'
import { async } from 'rxjs'
import {ActionContext, Module} from 'vuex'

interface State {
    commitment: Object,
    commitments: Array<any>,
    pagination: any,
    isLoading: Boolean,
    optionsProject: Array<any>,
}

const store: Module<State,any>= {
    namespaced: true,
    state:{
        commitment: {},
        commitments: [],
        pagination: {},
        isLoading: false,
        optionsProject: [],
    },
    mutations:{
        SET_COMMITMENT: (state:State, payload:any) => state.commitment = payload,
        SET_COMMITMENTS: (state:State, payload:any) => state.commitments = payload,
        SET_PAGINATION: (state:State, payload:any) => state.pagination = payload,
        SET_IS_LOADING: (state:State, payload:any) => state.isLoading = payload,
        SET_OPTIONS_PROJECT: (state:State, payload:any) => state.optionsProject = payload
    },
    actions:{
        SELECT_COMMITMENT: async ({ commit, dispatch }, payload) => {
            commit('SET_COMMITMENT', payload)
        },
        FETCH_PROJECTS: async(context: ActionContext<State, any>, payload)=>{
            const { organization_id }  = payload
            if(!organization_id) return context.commit('SET_OPTIONS_PROJECT', [])
            const response = await axios.instance.get(`/superadmin/manageorg/${organization_id}/projects`)               
            const { projects } = response.data.data
            context.commit('SET_OPTIONS_PROJECT', projects)
            return projects
        },
        CREATE_COMMITMENT: async(context: ActionContext<State, any>, payload:any) => {
            try {
                context.commit('SET_IS_LOADING', true)
                const response = await axios.instance.post('/commitment/create', payload)
                context.commit('SET_IS_LOADING', false) 
                context.dispatch('HOMEPAGE/showSuccessToast', 'Commitment has been successfully created!', { root: true }) 
                context.dispatch('GET_ALL_COMMITMENTS') 
                return response.data
            } catch (e) { 
                context.commit('SET_IS_LOADING', false) 
                context.dispatch('HOMEPAGE/showErrorToast', 'Failed to create new commitment.', { root: true }) 
            }
        },
        APPROVE_COMMITMENT: async(context: ActionContext<State, any>, payload:any) => {
            try {
                const { id } = payload
                context.commit('SET_IS_LOADING', true)
                const response = await axios.instance.post(`/commitment/approve/${id}`, payload)
                context.commit('SET_IS_LOADING', false) 
                context.dispatch('HOMEPAGE/showSuccessToast', 'Commitment has been successfully approved!', { root: true }) 
                context.dispatch('GET_ALL_COMMITMENTS') 
                return response.data
            } catch (e) { 
                context.commit('SET_IS_LOADING', false) 
                context.dispatch('HOMEPAGE/showErrorToast', 'Failed to approve commitment.', { root: true }) 
            }
        },
        DECLINE_COMMITMENT: async(context: ActionContext<State, any>, payload:any) => {
            try {
                const { id } = payload
                context.commit('SET_IS_LOADING', true)
                const response = await axios.instance.get(`/commitment/decline/${id}`)
                context.commit('SET_IS_LOADING', false) 
                context.dispatch('HOMEPAGE/showSuccessToast', 'Commitment has been successfully declined!', { root: true }) 
                context.dispatch('GET_ALL_COMMITMENTS') 
                return response.data
            } catch (e) { 
                context.commit('SET_IS_LOADING', false) 
                context.dispatch('HOMEPAGE/showErrorToast', 'Failed to decline commitment.', { root: true }) 
            }
        },
        UPDATE_COMMITMENT: async(context: ActionContext<State, any>, payload:any) => {
            try {
                context.commit('SET_IS_LOADING', true)
                const { id } = payload
                console.log(payload)
                const response = await axios.instance.put(`/network/vpc/${id}`, payload)
                context.dispatch('HOMEPAGE/showSuccessToast', 'VPC Network has been successfully updated.', { root: true })
                context.commit('SET_IS_LOADING', false)
                return response.data
            } catch (e) { 
                context.commit('SET_IS_LOADING', false) 
                context.dispatch('HOMEPAGE/showErrorToast', 'VPC Network failed to update.', { root: true })
            }
        },
        GET_ALL_COMMITMENTS: async(context: ActionContext<State, any>, payload:any)=>{
            let data : any = []
            const response:any = await axios.instance.get('/commitment/')
            if(response.status === 200) {
                response.data.data.map((item:any) => data.push(item))
                context.commit('SET_COMMITMENTS', data)
            } 
            return data
        },
        DELETE_COMMITMENT: async(context: ActionContext<State, any>, payload:any)=>{
            try {
                context.commit('SET_IS_LOADING', true)
                const { id }:any = payload
                const response:any = await axios.instance.delete(`/network/vpc/delete/${id}`)
                if(response.status === 200) {
                    context.dispatch('fetchvpcs')
                    context.dispatch('HOMEPAGE/showSuccessToast', 'VPC Network has been successfully deleted', {root: true})
                } else { 
                    context.dispatch('HOMEPAGE/showErrorToast', 'Failed to delete VPC Network', {root: true})
                }
                context.commit('SET_IS_LOADING', false)
            } catch (e) { 
                const errorMessage = e.response.data.data;
                if (errorMessage.includes("SubnetInUse")){        
                    context.dispatch(
                      "HOMEPAGE/showErrorToast",
                      "VPC Network is being used. Destroy all resources within first and please try again.",
                      { root: true }
                    );
                  } else if (errorMessage.includes("vpc attached on instance")) {
                    context.dispatch(
                      "HOMEPAGE/showErrorToast",
                      "Unable to delete VPC as it is currently attached to the Instance.",
                      { root: true }
                    );
                  } else {
                    context.dispatch(
                      "HOMEPAGE/showErrorToast",
                      "Failed to delete VPC Network",
                      { root: true }
                    );
                  }
                context.commit('SET_IS_LOADING', false) 
            }
        },
        DETAIL_COMMITMENT: async(context: ActionContext<State, any>, payload:any)=>{
            const { id }:any = payload
            const response:any = await axios.instance.get(`/network/vpc/detail/${id}`)
            if(response.status === 200) {
                context.commit('setVPC', response.data.data)
                return response.data
            } else return context.dispatch('HOMEPAGE/showErrorToast', 'Failed to get VPC Network data', {root: true})
        },
    }
}

export default store