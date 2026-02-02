import { Action, ActionContext, Module } from "vuex";
import axios from 'axios'

function makeHeaders() {
  const token = localStorage.getItem('token') || "{}"
  return {
      headers: { Authorization: `Bearer ${token}` }
  }
}

interface State {
  isLoading: Boolean,
  isLoadingBtn: Boolean,
  listSlb: [],
  totalRowsSlb: number,
  beConfigure: [],
  totalRowsBe: number,
  feConfigure: [],
  totalRowsFe: number,
  vpcSlb: [],
  instanceSlb: [],
  flavorSlb: [],
  listSlbById: [],
  limitSlb: [],
  limitGlb:[],
}

const store : Module<State, any> = {
  namespaced: true,
  state: {
    isLoading: false,
    isLoadingBtn: false,
    listSlb: [],
    totalRowsSlb: 0,
    beConfigure: [],
    totalRowsBe: 0,
    feConfigure: [],
    totalRowsFe: 0,
    vpcSlb: [],
    instanceSlb: [],
    flavorSlb: [],
    listSlbById: [],
    limitSlb: [],
    limitGlb:[],
  },
  getters: {
    getLoading: state => { return state.isLoading },
    getListSlb: state => state.listSlb,
    getTotalRowsSlb: state => state.totalRowsSlb,
    getListBe: state => state.beConfigure,
    getTotalRowsBe: state => state.totalRowsBe,
    getListFe: state => state.feConfigure,
    getTotalRowsFe: state => state.totalRowsFe,
    isLoading: state => state.isLoading,
    isLoadingBtn: state => state.isLoadingBtn,
    getvpcSlb: state => state.vpcSlb,
    getinstanceSlb: state => state.instanceSlb,
    getFlavorSlb: state => state.flavorSlb,
    getListSlbById: state => state.listSlbById,
    getLimitSlb: state => state.limitSlb,
    getLimitGlb: state => state.limitGlb,
  },
  mutations: {
    setListSlb: (state, listSlb) => state.listSlb = listSlb,
    setTotalRowsSlb: (state, totalRows) => state.totalRowsSlb = totalRows,
    setListBe: (state, be) => state.beConfigure = be,
    setTotalRowsBe: (state, totalRows) => state.totalRowsBe = totalRows,
    setListFe: (state, fe) => state.feConfigure = fe,
    setTotalRowsFe: (state, totalRows) => state.totalRowsFe = totalRows,
    setIsLoading: (state, loading) => state.isLoading = loading,
    setIsLoadingBtn: (state, loading) => state.isLoadingBtn = loading,
    setvpcSlb: (state, vpcSlb) => state.vpcSlb = vpcSlb,
    setinstanceSlb: (state, instanceSlb) => state.instanceSlb = instanceSlb,
    setFlavorSlb: (state, data) => state.flavorSlb = data,
    setListSlbById: (state, listSlb) => state.listSlbById = listSlb,
    setLimitSlb: (state, data) => state.limitSlb = data,
    setLimitGlb: (state, data) => state.limitGlb = data,
  },
  actions: {
    fetchSlb: async (context: ActionContext<State, any>, payload: any ) => {
      try{
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb`
        API +=`?limit=${payload.itemsPerPage}&page=${payload.page}&origin=sp`
        payload.projek ? API += `&project_id=${payload.projek}` : ''
        
        const resp = await axios.get(`${API}`, { headers })
        if(resp.status == 200){
          let data = resp.data.data
          context.commit('setListSlb', data.rows)
          context.commit('setTotalRowsSlb', data.total_rows)        
        }
      }catch(e){
        if(e.response){
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
        }else{
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    fetchSlbById: async (context: ActionContext<State, any>, payload: any ) => {
      try{
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/${payload.slb_id}`
        
        const resp = await axios.get(`${API}`, { headers })
        if(resp.status == 200){
          let data = resp.data.data
          context.commit('setListSlbById', [data])
        }
      }catch(e){
        if(e.response){
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
        }else{
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    createSlb: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoading', true)
        context.commit('setIsLoadingBtn', true)
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/create-slb`, payload, { headers })
        context.commit('setIsLoadingBtn', false)
        if (store.getters.isLoading) {
            context.dispatch('HOMEPAGE/showProcessToastWS', 'Creating the Load Balancer', { root: true })
        }
        return response
      }catch(e){
        if(e.response){
          context.commit('setIsLoading', false)
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
        }else{
          context.commit('setIsLoading', false)
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    deleteSlb: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoading', true)
        context.commit('setIsLoadingBtn', true)
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb`

        const resp = await axios.delete(`${API}/${payload.id}`, { headers })
        context.commit('setIsLoadingBtn', false)
          if (store.getters.isLoading) {
              context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the Load Balancer', { root: true })
          }
        return resp
      }catch(e){
        if(e.response){
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
        }else{
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    fetchBe: async (context: ActionContext<State, any>, payload: any ) => {
      try{
        const {page = 1, itemsPerPage = 10 } = payload
        // context.commit('setIsLoading', true)
        context.commit('setListBe',[])
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/config/backend`
        API +=`?limit=${itemsPerPage}&page=${page}`
        payload.slb_id ? API += `&slb_id=${payload.slb_id}` : ''
        payload.mode ? API += `&mode=${payload.mode}` : ''
        
        const resp = await axios.get(`${API}`, { headers })
        // context.commit('setIsLoading', false)
        let data = resp.data.data
        context.commit('setListBe', data.rows.length ? data.rows : [])
        context.commit('setTotalRowsBe', data.total_rows)        
      }catch(e){
        if(e.response){
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
        }else{
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    createBe: async (context: ActionContext<State, any>, payload: any) => {
      try{
        // context.commit('setIsLoading', true)
        context.commit('setIsLoadingBtn', true)
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/config/backend`, payload, { headers })
        context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
        context.commit('setIsLoadingBtn', false)
        return response
      }catch(e){
        if(e.response){
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          context.commit('setIsLoadingBtn', false)
          return e.response.data.responseMessage
        }else{
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          context.commit('setIsLoadingBtn', false)
          return e.message
        }
      }
    },
    updateBe: async (context: ActionContext<State, any>, payload: any) => {
      try{
        // context.commit('setIsLoading', true)
        context.commit('setIsLoadingBtn', true)
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }

        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/config/replace-backend`, payload, { headers })
        context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
        context.commit('setIsLoadingBtn', false)
        return response
      }catch(e){
        if(e.response){
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          context.commit('setIsLoadingBtn', false)
          return e.response.data.responseMessage
        }else{
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          context.commit('setIsLoadingBtn', false)
          return e.message
        }
      }
    },
    deleteBe: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoading', true)
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/config/delete-backend`
        
        const resp = await axios.delete(`${API}?slb_id=${payload.slb_id}&config_name=${payload.config_name}`,{ headers })
        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
        // context.commit('setIsLoading', false)
        return resp
      }catch(e){
        if(e.response){
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
        }else{
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    fetchFe: async (context: ActionContext<State, any>, payload: any  ) => {
      try{
        const { page, itemsPerPage } = payload;
        // context.commit('setIsLoading', true)
        context.commit('setListFe',[])
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/config/frontend`
        API +=`?limit=${itemsPerPage ?? 10}&page=${page ?? 1}`
        payload.slb_id ? API += `&slb_id=${payload.slb_id}` : ''
        
        const resp = await axios.get(`${API}`, { headers })
        // context.commit('setIsLoading', false)
        let data = resp.data.data
        context.commit('setListFe', data.rows.length ? data.rows : [])
        context.commit('setTotalRowsFe', data.total_rows)        
      }catch(e){
        if(e.response){
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
        }else{
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    createFe: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoadingBtn', true)
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/config/frontend`, payload, { headers })
        context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
        context.commit('setIsLoadingBtn', false)
        return response
      }catch(e){
        if(e.response){
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          context.commit('setIsLoadingBtn', false)
          return e.response.data.responseMessage
        }else{
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          context.commit('setIsLoadingBtn', false)
          return e.message
        }
      }
    },
    updateFe: async (context: ActionContext<State, any>, payload: any) => {
      try{
        // context.commit('setIsLoading', true)
        context.commit('setIsLoadingBtn', true)
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }

        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/config/replace-frontend`, payload, { headers })
        context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
        // context.commit('setIsLoading', false)
        context.commit('setIsLoadingBtn', false)
        return response
      }catch(e){
        if(e.response){
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          context.commit('setIsLoadingBtn', false)
          return e.response.data.responseMessage
        }else{
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          context.commit('setIsLoadingBtn', false)
          return e.message
        }
      }
    },
    deleteFe: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoading', true)
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/config/delete-frontend`
          
        const resp = await axios.delete(`${API}?slb_id=${payload.slb_id}&config_name=${payload.config_name}`,{ headers })
        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
        return resp
      }catch(e){
        if(e.response){
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
        }else{
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    fetchVpc: async (context: ActionContext<State, any>, payload: any ) => {
      try{
        context.commit('setvpcSlb',[])
        const token = localStorage.getItem('token')
        const projek = JSON.parse(localStorage.getItem('currentProj'))
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/vpc/not-trial/`
        API += projek.id
        const resp = await axios.get(`${API}`, { headers })
        let data = resp.data.data
        // console.log(data)
        context.commit('setvpcSlb', data ? data : [])
      }catch(e){
        if(e.response){
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
        }else{
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    fetchInstance: async (context: ActionContext<State, any>, payload: any ) => {
      try{
        context.commit('setinstanceSlb',[])
        const token = localStorage.getItem('token')
        const projek = JSON.parse(localStorage.getItem('currentProj'))
        const slb = JSON.parse(localStorage.getItem('slb'))
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/instance/not-trial?`
        API += 'project_id=' + projek.id + '&'
        API += 'vpc_id=' + slb.vm_vpc_network_id + '&'
        API += 'lb_id=' + slb.id 
        const resp = await axios.get(`${API}`, { headers })
        let data = resp.data.data
        // console.log(data)
        context.commit('setinstanceSlb', data ? data : [])
      }catch(e){
        if(e.response){
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
        }else{
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    fetchLimitSlb: async(context: ActionContext<State, any>, payload: any) => {
			try{
        context.commit('setIsLoading', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/service-limit`
        API += `?openstack_project_id=${payload.openstack_id}`
        API += `&tier=${payload.tier}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        if(resp.status == 200){
          let data = resp.data.data
          context.commit('setLimitSlb', data)
          context.commit('setIsLoading', false)      
        }
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    saveLimitSlb: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoadingBtn', true)
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/service-limit/${payload.openstack_id}`, payload.body, makeHeaders())
        context.commit('setIsLoadingBtn', false)
        context.dispatch('HOMEPAGE/showSuccessToast', response.data.message, { root: true })
        return response
      }catch(e){
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
    },
    fetchLimitGlb: async(context: ActionContext<State, any>, payload: any) => {
			try{
        context.commit('setIsLoading', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/service-limit`
        API += `?openstack_project_id=${payload.openstack_id}`
        API += `&tier=${payload.tier}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        if(resp.status == 200){
          let data = resp.data.data
          context.commit('setLimitGlb', data)
          context.commit('setIsLoading', false)      
        }
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    saveLimitGlb: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoadingBtn', true)
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/service-limit/${payload.openstack_id}`, payload.body, makeHeaders())
        context.commit('setIsLoadingBtn', false)
        context.dispatch('HOMEPAGE/showSuccessToast', response.data.message, { root: true })
        return response
      }catch(e){
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
    },
    fetchFlavorSlb: async(context: ActionContext<State, any>, payload: any) => {
			try{
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/slb-services/v1/slb/flavor`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, { headers })
        let data = resp.data.data
        context.commit('setFlavorSlb', data)
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
  }
}

export default store
