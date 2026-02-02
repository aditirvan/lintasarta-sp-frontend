import { ActionContext, Module } from 'vuex'
import { isLimitError, createLimitErrorMsg } from "@/lib/validator";
import findProjectByName from '../../project/findprojectbyname'
import libProject from '@/lib/project'
interface State {
    floatingips: Array<any>,
    isLoading: Boolean,
    availableInstances: Array<any>,
    listFloatingIp: Array<any>,
}

import axios from '@/lib/axios'
const store: Module<State, any> = {
    namespaced: true,
    state: {
        floatingips: [],
        isLoading: false,
        availableInstances: [],
        listFloatingIp: [],
    },
    getters: {
        activeProject(state, getters, rootState, rootGetters) {
            return rootGetters['PROJECT/getprojectname']
        },
        getIsFloatingIPLoading: state => state.isLoading,
        listFloatingIp: state => state.listFloatingIp,
    },
    mutations: {
        setfloatingips: (state: State, payload: any) => { state.floatingips = payload },
        setIsLoading: (state: State, payload: any) => { state.isLoading = payload },
        setAvailableInstances: (state: State, payload: any) => { state.availableInstances = payload },
        setListFloatingIp: (state: State, payload: any) => { state.listFloatingIp = payload },
    },
    actions: {
        addfloatingip: async ({ commit, dispatch }, payload: any) => {
            const activeProjectID = await libProject.getActiveProjectID()
            if (!activeProjectID) dispatch('HOMEPAGE/showErrorToast', 'Could not find project data.', { root: true })
            try {
                commit('setIsLoading', true)
                const { id, voucher_id, billing_type, ip_type, vpc_id, port_id } = payload
                const response = await axios.instance.post('/network/floating-ip', {
                    project_id: activeProjectID,
                    instance_id: id,
                    voucher_id,
                    billing_type,
                    ip_type,
                    vpc_id,
                    port_id
                })

                if (response.status === 200) {
                    dispatch('fetchfloatingips')
                    dispatch('fetchAvailableInstances')
                    dispatch('HOMEPAGE/showSuccessToast', 'Floating IP has been successfully assigned!', { root: true })
                    commit('setIsLoading', false)
                    return response
                }
                commit('setIsLoading', false)
            } catch (err) {
                const error = err.response.data.data ?? err.response.data.message
                let errorMessage = 'A problem encountered while tring to assign floating IP'

                if (error.includes('instance has already attached with floating ip')) errorMessage = 'Selected Instance already has Floating IP attached.'
                else if (error.includes('Postpaid')) errorMessage = error
                else if (isLimitError(error)) errorMessage = createLimitErrorMsg(error)
                else if (error.includes('floating ip voucher has reached limit')) errorMessage = 'Floating IP quota has reached the limit!'
                else if (error.includes('Floating IP has exceeded the limit')) errorMessage = 'Floating IP has exceeded the limit. Please contact the administrator.'
                else if (error.includes('voucher has already expired')) errorMessage = 'Voucher has already expired.'
                else if (error.includes('trial floating ip can only assign to trial instance')) errorMessage = 'Cannot attach basic resource to trial resource!'
                else if (error.includes(' cannot sign to trial instance')) errorMessage = 'Floating IP with this billing type is not allowed to use Trial Instance'
                else if (error.includes('Service activation')) errorMessage = error
                else if (error.includes('Floating IP has been added in network configuration')) errorMessage = err.response.data.message
                else if (error.includes('the choosed network not attached on this instance')) errorMessage = 'Please ensure that the instance has a network interface before attempting to attach a Floating IP.'
                else if (error.includes('The Floating IP you are attempting to attach has a different gateway')) errorMessage = 'The Floating IP you are attempting to attach has a different gateway than the current network interface.'                
                else if (error.includes('fixed IP already has a floating IP')) errorMessage = 'The VPC Port you are attempting to attach already has Floating IP attached.'                                 
                
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsLoading', false)
                if (error.includes('Your balance is not enough')) {
                    commit('DASHBOARD/setopendialogbalance', true, { root: true })
                    commit('DASHBOARD/setopendialogbalancemsg', error, { root: true })
                }
            }
        },
        fetchfloatingips: async (context: ActionContext<State, any>, payload: any) => {
            const activeProjectID = await libProject.getActiveProjectID()
            if (!activeProjectID) context.dispatch('HOMEPAGE/showErrorToast', 'Could not find project data.', { root: true })
            context.commit('setIsLoading', true)
            const response = await axios.instance.get(`/network/floating-ip/project/${activeProjectID}`)
            if (response.status === 200) {
                context.commit('setfloatingips', response.data.data.sort((x: any) => x.instance_id ? -1 : 1))
                context.commit('setIsLoading', false)
                return response.data.data
            } else {
                context.dispatch('HOMEPAGE/showErrorToast', 'Could not get Floating IP data.', { root: true })
                context.commit('setIsLoading', false)
                return []
            }
        },
        fetchAvailableInstances: async (context: ActionContext<State, any>, payload: any) => {
            const projectID = await libProject.getActiveProjectID()
            if (!projectID) context.dispatch('HOMEPAGE/showErrorToast', 'Could not find project data.', { root: true })
            const response = await axios.instance.get(`/network/floating-ip/available-instances/${projectID}`)
            if (response.status === 200) {
                context.commit('setAvailableInstances', response.data.data)
                return response.data.data
            } else {
                context.dispatch('HOMEPAGE/showErrorToast', 'Could not get available instances data.', { root: true })
                return []
            }
        },
        DELETE_FLOATING_IP: async (context: ActionContext<State, any>, payload: any) => {
            try {
                const { id }: any = payload
                const response: any = await axios.instance.delete(`/network/floating-ip/delete/${id}`)
                if (response.status === 200) {
                    context.dispatch('fetchfloatingips')
                    context.dispatch('fetchAvailableInstances')
                    context.dispatch('HOMEPAGE/showSuccessToast', 'Floating IP has been successfully deleted', { root: true })
                }
            } catch (e) {
                const errorMessage = e.response.data.data
                if (errorMessage === 'make sure to detach floating ip from instance before deleting floating ip') {
                    context.dispatch('HOMEPAGE/showErrorToast', 'Please detach selected Floating IP from the Instance and try again.', { root: true })
                } else {
                    context.dispatch('HOMEPAGE/showErrorToast', 'Failed to delete Floating IP', { root: true })
                }
            }
        },
        REASSIGN_FLOATING_IP: async (context: ActionContext<State, any>, payload: any) => {
            try {
                context.commit('setIsLoading', true)
                const response = await axios.instance.post('/network/floating-ip/reassign', payload)
                if (response.status === 200) {
                    context.dispatch('fetchfloatingips')
                    context.dispatch('fetchAvailableInstances')
                    context.dispatch('HOMEPAGE/showSuccessToast', 'Floating IP has been successfully reassigned!', { root: true })
                    context.commit('setIsLoading', false)
                }
            } catch (err) {
                const errorMessage = err.response.data.data
                if(errorMessage.includes('already has a floating IP on external')) context.dispatch('HOMEPAGE/showErrorToast', 'Selected instance already has Floating IP attached.', { root: true })
                else if (isLimitError(errorMessage)) context.dispatch('HOMEPAGE/showErrorToast', createLimitErrorMsg(errorMessage), { root: true })
                else if (errorMessage.includes('trial floating ip can only assign to trial instance')) context.dispatch('HOMEPAGE/showErrorToast', 'Cannot attach basic resource to trial resource!', { root: true })
                else if (errorMessage.includes(' cannot sign to trial instance'))  context.dispatch('HOMEPAGE/showErrorToast', 'Floating IP with this billing type is not allowed to use Trial Instance', { root: true })                
                else if (errorMessage.includes('failed reassign floating ip'))  context.dispatch('HOMEPAGE/showErrorToast', 'The Floating IP you are attempting to attach has a different gateway than the current network interface.', { root: true })
                else if (errorMessage.includes('failed get vpc port'))  context.dispatch('HOMEPAGE/showErrorToast', 'The Floating IP you are attempting to attach has a different gateway than the current network interface.', { root: true })
                else if (errorMessage.includes('failed get data vpc port by instance and vpc id'))  context.dispatch('HOMEPAGE/showErrorToast', 'Unable to attach IP from a different gateway.', { root: true })                
                else if (errorMessage.includes('selected port already has floating ip'))  context.dispatch('HOMEPAGE/showErrorToast', 'Selected VPC Port already has Floating IP attached.', { root: true })                
                else context.dispatch('HOMEPAGE/showErrorToast', 'Failed to assign Floating IP.', { root: true })
                context.commit('setIsLoading', false)
            }
        },
        UNASSIGN_FLOATING_IP: async ({ commit, dispatch }, payload: any) => {
            try {
                commit('setIsLoading', true)
                const response = await axios.instance.post('/network/floating-ip/unassign', { floating_ip_id: payload })
                if (response.status === 200) {
                    dispatch('fetchfloatingips')
                    dispatch('fetchAvailableInstances')
                    dispatch('HOMEPAGE/showSuccessToast', 'Floating IP has been successfully unassigned!', { root: true })
                    return response
                } else dispatch('HOMEPAGE/showErrorToast', 'Failed to unassign Floating IP!', { root: true })
                commit('setIsLoading', false)
            } catch (err) {
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', 'Failed to unassign Floating IP.', { root: true })
            }
        },
        confirmFloatingIp: async ({ commit, dispatch }, payload: any) => {
            try {
                const activeProjectID = await libProject.getActiveProjectID()
                payload.project_id = activeProjectID
                commit('setIsLoading', true)
                const response = await axios.instance.post('/network/floating-ip/confirm', payload)
                if (response.status === 200) {
                    commit('setIsLoading', false)
                    return response
                }
                commit('setIsLoading', false)
            } catch (err) {
                commit('setIsLoading', false)
                const error = err.response.data.data
                let errorMsg = 'Failed to confirm Floating IP.'
                if (error.includes("total floating ip voucher has reached limit")){
                    errorMsg = "Total Floating IP voucher has reached limit"
                }
                dispatch('HOMEPAGE/showErrorToast', errorMsg, { root: true })
            }
        },
        getFlavorFloatingIp: async ({ commit }) => {
            try {
              const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/floating-ip/type`);
              commit("setListFloatingIp", response.data.data);
            } catch (error) {
              // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true }); 
            }
          },
        validateVPCPortFloatingIp: async ({ commit, dispatch }, payload: any) => {
            try {
              commit("setIsLoading", true);
              const response = await axios.instance.post(
                "/network/floating-ip/validate-port",
                payload
              );
              if (response.status === 200) {
                commit("setIsLoading", false);
                return response;
              }
              commit("setIsLoading", false);
            } catch (err) {
              commit("setIsLoading", false);
              const error = err.response.data.data;
              dispatch("HOMEPAGE/showErrorToast", error, { root: true });
              return err.response.data;
            }
          },
    }
}
export default store