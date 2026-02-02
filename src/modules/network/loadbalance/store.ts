import { ActionContext, Module} from 'vuex'
import axios from '@/lib/axios'
import { async } from 'rxjs'

interface State {
    loadBalancer: any,
    loadBalancers: [],
    certificate: any,
    certificates: [],
    isLoading: Boolean,
}
const store: Module<State,any>= {
    namespaced: true,
    state: {
        loadBalancers: [],
        loadBalancer: {},
        certificates: [],
        certificate: {},
        isLoading: false,
    },
    mutations: {
        setLoadBalancers: (state:State, payload:any) => state.loadBalancers = payload,
        setLoadBalancer: (state:State, payload:any) => state.loadBalancer = payload,
        setCertificates: (state:State, payload:any) => state.certificates = payload,
        setCertificate: (state:State, payload:any) => state.certificate = payload,
        setIsLoading: (state, payload) => state.isLoading = payload, 
    },
    actions: {
        createLoadBalancer: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoading', true)
                const response = await axios.instance.post('/user/load-balancer', payload)
                await dispatch('fetchCertificates')
                // dispatch('HOMEPAGE/showProcessToastWS', 'Building load balancer', { root: true })
                commit('setIsLoading', false)
                return response
            } catch (e) {
                const error = e.response.data.data
                let errorMessage = 'A problem encountered while creating load balancer'
                if (error.includes('already exist')) errorMessage = 'Load balancer name is already exists!'
                else if (error.includes('Service activation')) errorMessage = error
                else if (error.includes('Postpaid')) errorMessage = error
                else if (error.includes('load balancer voucher has reached limit')) errorMessage = 'Load balancer quota has reached the limit!'
                else if (
                    error.includes('trial load balancer can only assign to trial instance') ||
                    (error.includes('load balancer with billing type ') && error.includes('cannot sign to trial instance'))
                ) errorMessage = 'Cannot attach basic resource to trial resource!'
                else if (error.includes('voucher has already expired')) errorMessage = "This voucher is expired."

                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsLoading', false)
                return e.response
            }
        },
        updateLoadBalancer: async ({ commit, dispatch }, payload) => {
            try {
                const { id } = payload
                delete payload.id
                
                commit('setIsLoading', true)
                const response = await axios.instance.put(`/user/load-balancer/${id}`, payload)
                commit('setIsLoading', false)
                dispatch('fetchLoadBalancerByID', id)
                // dispatch('HOMEPAGE/showProcessToastWS', 'Updating load balancer', { root: true })
                return response
            } catch (e) {
                const error = e.response.data.data
                let errorMessage = 'A problem encountered while updating load balancer'
                if (error.includes('already exist')) errorMessage = 'Load balancer name is already exists'

                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsLoading', false)
                return e.response
            }
        },
        deleteLoadBalancer: async ({ commit, dispatch }, id) => {
            try {
                commit('setIsLoading', true)
                const response = await axios.instance.delete(`/user/load-balancer/${id}`)
                dispatch('fetchLoadBalancers')
                dispatch('HOMEPAGE/showSuccessToast', 'Load balancer has been successfully deleted', { root: true })
                commit('setIsLoading', false)
                return response
            } catch (e) {
                let errorMessage = 'A problem encountered while deleting load balancer'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsLoading', false)
            }
        },
        fetchLoadBalancers: async ({ commit, dispatch }, payload) => {
            commit('setIsLoading', true)
            const project = localStorage.getItem('currentProj')
            const projectID = project ? JSON.parse(project).id : null
            const response = await axios.instance.get(`/service/project/${projectID}/load-balancer`)
            if (response.status === 200) commit('setLoadBalancers', response.data.data)
            commit('setIsLoading', false)
        },
        fetchLoadBalancerByID: async ({ commit, dispatch }, id) => {
            try {
                const response = await axios.instance.get(`/user/load-balancer/${id}`)
                if (response.status === 200) {
                    commit('setLoadBalancer', response.data.data)
                    return response
                }
            } catch (e) {
                dispatch('HOMEPAGE/showErrorToast', 'Data not found!', { root: true })
                return e.response
            }
        },
        assignFloatingIP: async ({ commit, dispatch }, payload) => {
            try {
                const { id, voucher_id } = payload
                const response = await axios.instance.post(`/user/load-balancer/assign-floating-ip/${id}`, {
                    voucher_id
                })
                if (response.status === 200) {
                    dispatch('fetchLoadBalancerByID', id)
                    dispatch('NETWORKFLOATINGIP/fetchfloatingips', null, { root : true })
                    dispatch('HOMEPAGE/showSuccessToast', 'Floating IP has been succesfully enabled!', { root: true })
                    return response
                }
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to assign floating IP!'
                if (err.includes('Floating IP has exceeded the limit')) errorMessage = 'Floating IP has exceeded the limit. Please contact the administrator.'
                else if (
                    err.includes('trial floating ip can only assign to trial load balancer') ||
                    (err.includes('floating ip with billing type ') && err.includes(' cannot sign to trial load balancer'))) errorMessage = 'Cannot attach basic resource to trial resource!'
                else if (err.includes('voucher has already expired')) errorMessage = "This voucher is expired."
                if (err.includes('Service activation')) errorMessage = err
                if (err.includes('Postpaid')) errorMessage = err
                if (err.includes('Your balance is not enough')) {
                    commit('DASHBOARD/setopendialogbalance', true, { root: true })
                    commit('DASHBOARD/setopendialogbalancemsg', err, { root: true })
                    return
                }
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                return e.response
            }
        },
        fetchCertificates: async ({ commit, dispatch }, payload) => {
            const organisation = localStorage.getItem('currentOrg')
            const organisationID = organisation ? JSON.parse(organisation).id : null
            const response = await axios.instance.get(`/certificate/organization/${organisationID}`)
            if (response.status === 200) commit('setCertificates', response.data.data)
        },
        fetchCertificateByID: async ({ commit, dispatch }, payload) => {
            commit('setIsLoading', true)
            const { id } = payload
            const response = await axios.instance.get(`/certificate/detail/${id}`)
            if (response.status === 200) commit('setCertificate', response.data.data)
            commit('setIsLoading', false)
        },
        createCertificate: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoading', true)
                const organisation = localStorage.getItem('currentOrg')
                const organisationID = organisation ? JSON.parse(organisation).id : null
                if (!organisationID) return dispatch('HOMEPAGE/showErrorToast', 'Unauthorized Request!', { root: true }) 
                
                payload.organization_id = organisationID
                const response = await axios.instance.post('/certificate/create', payload)
                await dispatch('fetchCertificates')
                dispatch('HOMEPAGE/showSuccessToast', 'New certificate has been successfully created', { root: true })
                commit('setIsLoading', false)
                return response
            } catch (e) {
                const error = e.response.data.data
                let errorMessage = 'A problem encountered while creating new certificate'
                if (error.includes('already exist')) errorMessage = 'Certificate name is already exists'

                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsLoading', false)
                return e.response
            }
        }
    }
}
export default store