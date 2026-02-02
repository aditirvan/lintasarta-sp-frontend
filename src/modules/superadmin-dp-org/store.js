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
    isLoadingBtn: false,
    listOrgDP: [],
    TotalRowsOrgDP: 0,
    orgById: {},
    listUsers: [],
    TRUsers: 0,
    roles: [],
    TRRoles: 0,
    userById: {},
    orgDPById: {},
  },
  getters: {
    listOrgDP: state => state.listOrgDP,
    TotalRowsOrgDP: state => state.TotalRowsOrgDP,
    isLoading: state => state.isLoading,
    isLoadingBtn: state => state.isLoadingBtn,
    orgById: state => state.orgById,
    listUsers: state => state.listUsers,
    TRUsers: state => state.TRUsers,
    roles: state => state.roles,
    TRRoles: state => state.TRRoles,
    userById: state => state.userById,
    orgDPById: state => state.orgDPById,
  },
  mutations: {
		setIsLoading: (state, loading) => state.isLoading = loading,
		setIsLoadingBtn: (state, loading) => state.isLoadingBtn = loading,
    setListOrgDP: (state, data) => state.listOrgDP = data,
    setOrgById: (state, data) => state.orgById = data,
    setTotalRowsOrgDP: (state, data) => state.TotalRowsOrgDP = data,
    setListUsers: (state, data) => state.listUsers = data,
    setTRUsers: (state, data) => state.TRUsers = data,
    setRoles: (state, data) => state.roles = data,
    setTRRoles: (state, data) => state.TRRoles = data,
    setUserById: (state, data) => state.userById = data,
    setOrgDPById: (state, data) => state.orgDPById = data,
  },
  actions: {
    fetchOrgDP: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setListOrgDP', [])
        context.commit('setTotalRowsOrgDP', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        payload.search ? params.append("filter", `displayName==*${payload.search}*`) : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/page?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setListOrgDP', data.values)
        context.commit('setTotalRowsOrgDP', data.resultTotal)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchOrgDPById: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setOrgById', {})

        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/${payload.id}`
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setOrgById', data)
        // context.commit('setTotalRowsOrgDP', data.resultTotal)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchUsers: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setListUsers', [])
        context.commit('setTRUsers', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        payload.search ? params.append("filter", `((name==*${payload.search}*))`) : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/${payload.idOrg}/user/page?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setListUsers', data.record)
        context.commit('setTRUsers', data.total)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data
      }
		},
    fetchUserById: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setUserById', {})

        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/${payload.idOrg}/user/${payload.idUser}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setUserById', data)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data
      }
		},
    fetchRoles: async(context, payload) => {
			try{
        // context.commit('setIsLoading', true)
        context.commit('setRoles', [])
        context.commit('setTRRoles', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", 100);
        // payload.search ? params.append("filter", `((name==*${payload.search}*))`) : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/${payload.idOrg}/user/role/page?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setRoles', data.record)
        context.commit('setTRRoles', data.total)
        // context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data
      }
		},
    getNewDP: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        // params.append("sortAsc", 'name');
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/backend/link-organization/${payload.spOrgId}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        // let data = resp.data.payload
        context.commit('setIsLoading', false)  
        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })    
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    organizationDPById: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setOrgDPById', {})
        // params.append("sortAsc", 'name');
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/dekaprime/${payload.orgDpId}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setIsLoading', false)
        context.commit('setOrgDPById', data)
        // context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })    
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    createOrg: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization`

        const resp = await axios.post(`${API}`, payload ,makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    updateOrg: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/${payload.orgId}`

        const resp = await axios.put(`${API}`, payload.value ,makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    deleteOrg: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/${payload.orgId}`

        const resp = await axios.delete(`${API}`, makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    createUser: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/${payload.idOrg}/user`

        const resp = await axios.post(`${API}`, payload.value ,makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    updateUser: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/${payload.idOrg}/user/${payload.idUser}`

        const resp = await axios.put(`${API}`, payload.value ,makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    deleteUser: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/${payload.idOrg}/user/${payload.idUser}`

        const resp = await axios.delete(`${API}`, makeHeaders())
        // console.log(resp)

        context.dispatch('HOMEPAGE/showSuccessToast', resp.data.responseMessage , { root: true })
        context.commit('setIsLoadingBtn', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
  }
}

export default store