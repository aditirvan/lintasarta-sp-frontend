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
    listOrgVdc: [],
    TotalRowsOrgVdc: 0,
    listOrgVdcStep: [],
    TotalRowsOrgVdcStep: 0,
    listProviderVdc: [],
    TotalRowsProviderVdc: 0,
    listEksternalNetwork: [],
    TotalRowsEksternalNetwork: 0,
    listStoragePolice: [],
    TotalRowsStoragePolice: 0,
    listNetworkPool: [],
    TotalRowslistNetworkPool: 0,
    orgVdcById: {},
  },
  getters: {
    listOrgVdc: state => state.listOrgVdc,
    TotalRowsOrgVdc: state => state.TotalRowsOrgVdc,
    isLoading: state => state.isLoading,
    isLoadingBtn: state => state.isLoadingBtn,
    listOrgVdcStep: state => state.listOrgVdcStep,
    TotalRowsOrgVdcStep: state => state.TotalRowsOrgVdcStep,
    listProviderVdc: state => state.listProviderVdc,
    TotalRowsProviderVdc: state => state.TotalRowsProviderVdc,
    listEksternalNetwork: state => state.listEksternalNetwork,
    TotalRowsEksternalNetwork: state => state.TotalRowsEksternalNetwork,
    listStoragePolice: state => state.listStoragePolice,
    TotalRowsStoragePolice: state => state.TotalRowsStoragePolice,
    listNetworkPool: state => state.listNetworkPool,
    TotalRowslistNetworkPool: state => state.TotalRowslistNetworkPool,
    orgVdcById: state => state.orgVdcById
  },
  mutations: {
		setIsLoading: (state, loading) => state.isLoading = loading,
		setIsLoadingBtn: (state, loading) => state.isLoadingBtn = loading,
    setListOrgVdc: (state, data) => state.listOrgVdc = data,
    setTotalRowsOrgVdc: (state, data) => state.TotalRowsOrgVdc = data,
    setListOrgVdcStep: (state, data) => state.listOrgVdcStep = data,
    setTotalRowsOrgVdcStep: (state, data) => state.TotalRowsOrgVdcStep = data,
    setListProviderVdc: (state, data) => state.listProviderVdc = data,
    setTotalRowsProviderVdc: (state, data) => state.TotalRowsProviderVdc = data,
    setListEksternalNetwork: (state, data) => state.listEksternalNetwork = data,
    setTotalRowsEksternalNetwork: (state, data) => state.TotalRowsEksternalNetwork = data,
    setListStoragePolice: (state, data) => state.listStoragePolice = data,
    setTotalRowsStoragePolice: (state, data) => state.TotalRowsStoragePolice = data,
    setListNetworkPool: (state, data) => state.listNetworkPool = data,
    setTotalRowsNetworkPool: (state, data) => state.TotalRowslistNetworkPool = data,
    setOrgVdcById: (state, data) => state.orgVdcById = data,

  },
  actions: {
    fetchOrgVdc: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setListOrgVdc', [])
        context.commit('setTotalRowsOrgVdc', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        payload.id ? params.append("filter", `id==${payload.id}`) : ''
        payload.search ? params.append("filter", `name==*${payload.search}*`) : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/vdc/page?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setListOrgVdc', data.record)
        context.commit('setTotalRowsOrgVdc', data.total)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchOrgVdcById: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setOrgVdcById', {})

        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/vdc/${payload.id}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setOrgVdcById', data)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchOrgVdcStep: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setListOrgVdcStep', [])
        context.commit('setTotalRowsOrgVdcStep', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        payload.search ? params.append("filter", `name==*${payload.search}*`) : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/page?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setListOrgVdcStep', data.values)
        context.commit('setTotalRowsOrgVdcStep', data.resultTotal)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchProviderVdc: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setListProviderVdc', [])
        context.commit('setTotalRowsProviderVdc', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        payload.search ? params.append("filter", `(isEnabled==true)`) : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/providervdc/page?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setListProviderVdc', data.record)
        context.commit('setTotalRowsProviderVdc', data.total)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchEksternalNetwork: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setListEksternalNetwork', [])
        context.commit('setTotalRowsEksternalNetwork', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        params.append("sortAsc", 'name');
        payload.providerId && payload.type == 'createOrgVdcStep3' ? params.append("filter", `((networkBackings.values.backingTypeValue!=NSXT_TIER0;networkBackings.values.backingTypeValue!=NSXT_VRF_TIER0);_context==urn:vcloud:providervdc:${payload.providerId})`) : ''
        payload.providerId && payload.type == 'createEdgeExNetwork' ? params.append("filter", `(_context==urn:vcloud:vdc:${payload.providerId};_context==standaloneEdgeDeployment)`) : ''
        payload.providerId && payload.type == 'createEdgeTier' && !payload.enabledDedicate ? params.append("filter", `(_context==urn:vcloud:vdc:${payload.providerId};dedicatedEdgeGateway.id==null;networkBackings.values.backingTypeValue==NSXT_TIER0,networkBackings.values.backingTypeValue==NSXT_VRF_TIER0)`) : ''
        payload.providerId && payload.type == 'createEdgeTier' && payload.enabledDedicate ? params.append("filter", `(_context==urn:vcloud:vdc:${payload.providerId};_context==dedicatable;networkBackings.values.backingTypeValue==NSXT_TIER0,networkBackings.values.backingTypeValue==NSXT_VRF_TIER0)`) : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/externalnetwork/page?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        let mapData
        if(data.values){
          mapData = data.values.map((el1) => {
            return {
              ...el1,
              subnets: el1.subnets.map((el2) =>  { 
                return { 
                  ...el2,
                  idNetwork: el1.id,
                  rowNetwork: el1,
                  inputIpRanges: {
                    input: '',
                    value: []
                  },
                  // ipRangesInput: []
                  }
                }
              )
            }
          })
        }
        context.commit('setListEksternalNetwork', data.values ? mapData : [])
        // }else{
          // context.commit('setListEksternalNetwork', data.values ? data.values : [])
        // }

        context.commit('setTotalRowsEksternalNetwork', data.resultTotal)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
        // console.log(e.response)
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchStoragePolice: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setListStoragePolice', [])
        context.commit('setTotalRowsStoragePolice', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        // params.append("sortAsc", 'name');
        payload.providerId ? params.append("filter", `isEnabled==true;providerVdc==${payload.providerId}`) : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/query/storage-police/page?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setListStoragePolice', data.record.map((val) => { return { ...val, allocatedStorage: 100 } }))
        context.commit('setTotalRowsStoragePolice', data.total)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchNetworkPool: async(context, payload) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setListNetworkPool', [])
        context.commit('setTotalRowsNetworkPool', 0)
        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        // params.append("sortAsc", 'name');
        payload.providerId ? params.append("filter", `((_context==urn:vcloud:providervdc:${payload.providerId}))`) : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/networkpool/page?${params}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        let data = resp.data.payload
        context.commit('setListNetworkPool', data.values)
        context.commit('setTotalRowsNetworkPool', data.resultTotal)
        context.commit('setIsLoading', false)      
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},

    createOrgVdc: async(context, payloadCreate) => {
			try{
        context.commit('setIsLoadingBtn', true)
        const { organization, payload, spOrgId } = payloadCreate
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        // let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/${organization.id}/vdcsparams`
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/backend/${spOrgId}/vdc`

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
    updateOrgVdc: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/vdc/${payload.orgVdcId}`

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
    deleteOrgVdc: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/vdc/${payload.orgVdcId}`

        const resp = await axios.delete(`${API}`,makeHeaders())
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
    enableOrgVdc: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/vdc/${payload.orgVdcId}/action/${payload.value.isEnabled ? 'disable' : 'enable'}`

        const resp = await axios.post(`${API}`, null ,makeHeaders())
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