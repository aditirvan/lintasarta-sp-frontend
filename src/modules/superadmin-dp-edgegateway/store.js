import axios from 'axios'

function makeHeaders() {
  const token = localStorage.getItem('token') || "{}"
  return {
      headers: { 'Superadmin-Authorization': `Bearer ${token}` }
  }
}

const store = {
  namespaced: true,
  state: {
    isLoading: false,
    listEdgeGateway: [],
    TotalRowsEdgeGateway: 0,
    listEdgeCluster: [],
    TotalRowsEdgeCluster: 0,
    listAvailableIp: [],
    TRRowsAvailableIp: 0,
    edgeGatewayById: {},
    isLoadingBtn: false,
    vdcProject: {}
  },
  getters: {
    listEdgeGateway: state => state.listEdgeGateway,
    TotalRowsEdgeGateway: state => state.TotalRowsEdgeGateway,
    isLoading: state => state.isLoading,
    isLoadingBtn: state => state.isLoadingBtn,
    listEdgeCluster: state => state.listEdgeCluster,
    TotalRowsEdgeCluster: state => state.TotalRowsEdgeCluster,
    listAvailableIp: state => state.listAvailableIp,
    TRRowsAvailableIp: state => state.TRRowsAvailableIp,
    edgeGatewayById: state => state.edgeGatewayById,
    vdcProject: state => state.vdcProject
  },
  mutations: {
		setIsLoading: (state, loading) => state.isLoading = loading,
		setIsLoadingBtn: (state, loading) => state.isLoadingBtn = loading,
    setListEdgeGateway: (state, data) => state.listEdgeGateway = data,
    setTotalRowsEdgeGateway: (state, data) => state.TotalRowsEdgeGateway = data,
    setListEdgeCluster: (state, data) => state.listEdgeCluster = data,
    setTotalRowsEdgeCluster: (state, data) => state.TotalRowsEdgeCluster = data,
    setListAvailableIp: (state, data) => state.listAvailableIp = data,
    setTRRowsAvailableIp: (state, data) => state.TRRowsAvailableIp = data,
    setEdgeGatewayById: (state, data) => state.edgeGatewayById = data,
    setVdcProject: (state, data) => state.vdcProject = data,

  },
  actions: {
    fetchEdgeGateway: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setListEdgeGateway', [])
        context.commit('setTotalRowsEdgeGateway', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        payload.search ? params.append("filter", `name==*${payload.search}*`) : ''
        payload.vdc ? params.append("filter", `vdc==${payload.vdc}`) : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/edgegateway/page?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setListEdgeGateway', data.record)
        context.commit('setTotalRowsEdgeGateway', data.total)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchEdgeGatewayByIdV: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setEdgeGatewayById', [])

        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/edgegateway/nsxv/${payload.id}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setEdgeGatewayById', data)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchEdgeGatewayByIdT: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setEdgeGatewayById', [])

        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/edgegateway/nsxt/${payload.id}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setEdgeGatewayById', data)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchEdgeCluster: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setListEdgeCluster', [])
        context.commit('setTotalRowsEdgeCluster', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        payload.providerId ? params.append("filter", `orgVdcId==urn:vcloud:vdc:${payload.providerId}`) : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/edgecluster/page?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setListEdgeCluster', data.values)
        // context.commit('setTotalRowsEdgeCluster', data.total)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchAvailableIp: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setListAvailableIp', [])
        context.commit('setTRRowsAvailableIp', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/externalnetwork/${payload.externalNetworkId}/available-ip-address?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        data = data.values.map((x,i) => {
          return{
            ...x,
            ipRangesInput:[]
          }
        })
        context.commit('setListAvailableIp', data)
        // context.commit('setTotalRowsEdgeCluster', data.total)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    dekaprimeVdcByProject: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setVdcProject', [])

        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/vdc/dekaprime/${payload.projectDPId}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setIsLoading', false)      
        context.commit('setVdcProject', data)
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    createEdgeGatewayV: async(context, payloadCreate) => {
			try{
        context.commit('setIsLoadingBtn', true)
        const { orgId, payload } = payloadCreate
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/vdc/${orgId}/edgegateway`

        const resp = await axios.post(`${API}`, payload ,makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data
      }
		},
    createEdgeGatewayT: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        // const { organization, payload } = payloadCreate
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/edgegateway/nsxt`

        const resp = await axios.post(`${API}`, payload ,makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data
      }
		},
    updateEdgeGatewayV: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        // const { organization, payload } = payloadCreate
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/edgegateway/nsxv/${payload.id}`

        const resp = await axios.put(`${API}`, payload.value ,makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data
      }
		},
    updateEdgeGatewayT: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        // const { organization, payload } = payloadCreate
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/edgegateway/nsxt/${payload.id}`

        const resp = await axios.put(`${API}`, payload.value ,makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data
      }
		},
    deleteEdgeGatewayV: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        // const { organization, payload } = payloadCreate
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/edgegateway/nsxv/${payload.id}`

        const resp = await axios.delete(`${API}`,makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data
      }
		},
    deleteEdgeGatewayT: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        // const { organization, payload } = payloadCreate
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/edgegateway/nsxt/${payload.id}`

        const resp = await axios.delete(`${API}`,makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data
      }
		},
  }
}

export default store