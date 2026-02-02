import { Module, ActionContext } from 'vuex'
import axios from 'axios'

function makeHeaders() {
  const token = localStorage.getItem('token') || "{}"
  return {
      headers: { Authorization: `Bearer ${token}` }
  }
}

interface State {
	listCluster: [],
	totalRowsCluster: number,
	isLoading: boolean,
	isLoadingBtn: boolean,
	listVpcHarbor: [],
  listHarborInstance: [],
  totalRowsHarborInstance: number,
  maintWindows: [],
  limitHarbor: [],
  flavors: [],
  tokenDash: string,
  showToken: boolean,
  versions: [],
  zones: [],
  rowsDelete: [],
  listSG: [],
  totalRulesSG: number,
  totalRowsSG: number,
  SGRules: Object,
  inRules: [],
  outRules: [],
}

const store: Module<State, any> = {
	namespaced: true,
	state: {
		listCluster: [],
		totalRowsCluster: 0,
		isLoading: false,
		isLoadingBtn: false,
		listVpcHarbor: [],
    listHarborInstance: [],
    totalRowsHarborInstance: 0,
    maintWindows: [],
    limitHarbor: [],
    flavors: [],
    tokenDash: '',
    showToken: false,
    versions: [],
    zones: [],
    rowsDelete: [],
    listSG: [],
    totalRulesSG: 0,
    totalRowsSG: 0,
    SGRules: {},
    inRules: [],
    outRules: [],
	},
	getters: {
		getListCLuster: state => state.listCluster,
		getTRCluster: state => state.totalRowsCluster,
		getVpcHarbor: state => state.listVpcHarbor,
		isLoading: state => state.isLoading,
		isLoadingBtn: state => state.isLoadingBtn,
    getListHarborInstance: state => state.listHarborInstance,
    getTRHarborInstance: state => state.totalRowsHarborInstance,
    getMaintWindows: state => state.maintWindows,
    getLimitHarbor: state => state.limitHarbor,
    getFlavors: state => state.flavors,
    tokenDashboard: state => state.tokenDash,
    showToken: state => state.showToken,
    getVersions: state => state.versions,
    getZones: state => state.zones,
    rowsDelete: state => state.rowsDelete,
    listSG: state => state.listSG,
    totalRulesSG: state => state.totalRulesSG,
    getTotalRowsSG: state => state. totalRowsSG,
    SGRules: state => state.SGRules,
    inRules: state => state.inRules,
    outRules: state => state.outRules,
	},
	mutations: {
		setIsLoading: (state, loading) => state.isLoading = loading,
    setIsLoadingBtn: (state, loading) => state.isLoadingBtn = loading,
		setListCluster: (state, listCluster) => state.listCluster = listCluster,
		setTotalRowsCluster: (state, totalRows) => state.totalRowsCluster = totalRows,
		setListVpcHarbor: (state, listVpc) => state.listVpcHarbor = listVpc,
		setListHarborInstance: (state, listHarborInstance) => state.listHarborInstance = listHarborInstance,
		setTotalRowsHarborInstance: (state, totalRows) => state.totalRowsHarborInstance = totalRows,
    setMaintWindows: (state, data) => state.maintWindows = data,
    setLimitHarbor: (state, data) => state.limitHarbor = data,
    setFlavors: (state, data) => state.flavors = data,
    setTokenDash: (state, token) => state.tokenDash = token,
    setShowToken: (state, data) => state.showToken = data,
    setVersions: (state, data) => state.versions = data,
    setZones: (state, data) => state.zones = data,
    setSelectedRows: (state, data) => state.rowsDelete = data,
    setListSG: (state, SG) => state.listSG = SG,
    setTotalRulesSG: (state, rules) => state.totalRulesSG = rules, 
		setTotalRowsSG: (state, totalRows) => state.totalRowsSG = totalRows,
    setSGRules: (state, rules) => state.SGRules = rules,
    setInRules: (state, rules) => state.inRules = rules,
    setOutRules: (state, rules) => state.outRules = rules,
	},
	actions: {
		fetchCluster: async(context: ActionContext<State, any>, payload: any) => {
			try{
        context.commit('setIsLoading', true)
        let sort = null
        let sortBy
        let sorting
        if(payload.sortDesc.length){
            if(payload.sortDesc[0]){
                sort = 'desc'
            }else{
                sort = 'asc'
            }
        }else{
            sort = 'asc'
        }
        if(payload.sortBy.length){
          if(payload.sortBy[0] == 'master'){
            sortBy = 'flavor_master'
          }else if(payload.sortBy[0] == 'worker'){
            sortBy = 'total_worker'
          }else{
            sortBy = payload.sortBy[0]
          }
          sorting = sortBy + '%20' + sort
        }else{
          sorting = 'created_at%20desc'
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor?sort=${sorting}`
        API +=`&limit=${payload.itemsPerPage}&page=${payload.page}`
        payload.projek ? API += `&openstack_project_id=${payload.projek}` : ''
        
        const resp = await axios.get(`${API}`, makeHeaders())
				// console.log(resp)
        if(resp.status == 200){
          let data = resp.data.data
          context.commit('setListCluster', data.rows)
          context.commit('setTotalRowsCluster', data.total_rows)
          context.commit('setIsLoading', false)    
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
		createHarbor: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoading', true)
        context.commit('setIsLoadingBtn', true)

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/deploy-cluster`, payload, makeHeaders())
        context.commit('setIsLoadingBtn', false)
        if (store.getters.isLoading) {
            context.dispatch('HOMEPAGE/showProcessToastWS', 'Creating the Harbor', { root: true })
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
		fetchVpcHarbor: async(context: ActionContext<State, any>, payload: any) => {
			try{
        context.commit('setIsLoading', true)  
				const projek = JSON.parse(localStorage.getItem('currentProj'))
        let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/vpc/basic/`
        API += projek.id
        
        const resp = await axios.get(`${API}`, makeHeaders())
        if(resp.status == 200){
          let data = resp.data.data
          context.commit('setListVpcHarbor', data)
          context.commit('setIsLoading', false)  
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
		fetchHarborInstance: async(context: ActionContext<State, any>, payload: any) => {
			try{
        context.commit('setIsLoading', true)
        let sort = null
        let sortBy
        let sorting
        if(payload.sortDesc.length){
            if(payload.sortDesc[0]){
                sort = 'desc'
            }else{
                sort = 'asc'
            }
        }else{
            sort = 'asc'
        }
        if(payload.sortBy.length){
          if(payload.sortBy[0] == 'openstack_instance_name'){
            sortBy = 'open_stack_instance_name'
          }else if(payload.sortBy[0] == 'ip'){
            sortBy = 'ip_address_internal'
          }else{
            sortBy = payload.sortBy[0]
          }
          sorting = sortBy + '%20' + sort
        }else{
          sorting = 'open_stack_instance_name%20asc'
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/harbor-instance?sort=${sorting}`
        API +=`&limit=${payload.itemsPerPage}&page=${payload.page}`
        payload.harborid ? API += `&harbor_id=${payload.harborid}` : ''
        payload.type ? API += `&instance_type=${payload.type}` : ''
        
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        if(resp.status == 200){
          let data = resp.data.data
          context.commit('setListHarborInstance', data.rows)
          context.commit('setTotalRowsHarborInstance', data.total_rows)
          context.commit('setIsLoading', false)      
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
    fetchSecurityGroup: async(context: ActionContext<State, any>, payload: any) => {
			try{
        context.commit('setIsLoading', true)
        // let sort = null
        // let sortBy
        // let sorting
        // if(payload.sortDesc.length){
        //     if(payload.sortDesc[0]){
        //         sort = 'desc'
        //     }else{
        //         sort = 'asc'
        //     }
        // }else{
        //     sort = 'asc'
        // }
        // if(payload.sortBy.length){
        //   if(payload.sortBy[0] == 'master'){
        //     sortBy = 'flavor_master'
        //   }else if(payload.sortBy[0] == 'worker'){
        //     sortBy = 'total_worker'
        //   }else{
        //     sortBy = payload.sortBy[0]
        //   }
        //   sorting = sortBy + '%20' + sort
        // }else{
        //   sorting = 'created_at%20desc'
        // }
        // let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor?sort=${sorting}`
        // API +=`&limit=${payload.itemsPerPage}&page=${payload.page}`
        // payload.projek ? API += `&openstack_project_id=${payload.projek}` : ''
        let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/slb/security-groups/${payload.harbor_id}`
        const resp = await axios.get(`${API}`, makeHeaders())
				// console.log(resp)
        if(resp.status == 200){
          let data = resp.data.data
          context.commit('setListSG', data.security_groups.rows)
          context.commit('setTotalRulesSG', data.total_rules)
          context.commit('setTotalRowsSG', data.security_groups.total_rows)
          context.commit('setIsLoading', false)    
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
    fetchSecurityGroupRules: async(context: ActionContext<State, any>, payload: any) => {
			try{
        context.commit('setIsLoading', true)
        context.commit('setSGRules', [])
        context.commit('setInRules', [])
        context.commit('setOutRules', [])
        const { harborid, sg_id } = payload
        let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/slb/security-group-rules/${harborid}/${sg_id}`
        const resp = await axios.get(`${API}`, makeHeaders())
				// console.log(resp)
        if(resp.status == 200){
          let data = resp.data.data
          let inbound = []
          let outbound = []
          if(data.rows.length){
            inbound = data.rows.filter((x:any) => x.direction === 'ingress').map((x:any) => {
              return {
                type: x.type,
                ethertype: x.ethertype,
                protocol: x.type != '' ? x.protocol.toUpperCase() : 'Any',
                port_range_min: x.port_range_min,
                port_range_max: x.port_range_max,
                sources: x.remote_ip_prefix,
                direction: x.direction,
                description: x.description
              }
            })
            outbound = data.rows.filter((x:any) => x.direction === 'egress').map((x:any) => {
              return {
                type: x.type,
                ethertype: x.ethertype,
                protocol: x.type != '' ? x.protocol.toUpperCase() : 'Any',
                port_range_min: x.port_range_min,
                port_range_max: x.port_range_max,
                sources: x.remote_ip_prefix,
                direction: x.direction,
                description: x.description
              }
            });
          }
          context.commit('setSGRules', data)
          context.commit('setInRules', inbound)
          context.commit('setOutRules', outbound)
          context.commit('setIsLoading', false)    
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
    updateSGHarbor: async (context: ActionContext<State, any>, payload: any) => {
      try{
        const { harborid, body } = payload
        context.commit('setIsLoadingBtn', true)
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/slb/security-group-rules/${harborid}`, body, makeHeaders())
        context.commit('setIsLoadingBtn', false)
        // console.log(response)
        context.dispatch('HOMEPAGE/showSuccessToast', response.data.message, { root: true })
        return response
      }catch(e){
          console.log(e.response)
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
    },
    createWorker: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoading', true)
        context.commit('setIsLoadingBtn', true)

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/deploy-worker`, payload, makeHeaders())
        context.commit('setIsLoadingBtn', false)
        if (store.getters.isLoading) {
            context.dispatch('HOMEPAGE/showProcessToastWS', 'Creating the Worker', { root: true })
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
    deleteWorker: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoading', true)
        context.commit('setIsLoadingBtn', true)
        const { harbor_id, worker_id } = payload
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/delete-single-worker/${harbor_id}/${worker_id}`, makeHeaders())
        context.commit('setIsLoadingBtn', false)
        if (store.getters.isLoading) {
            context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the Worker', { root: true })
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
    deleteSelectedWorker: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoading', true)
        context.commit('setIsLoadingBtn', true)
        const { harbor_id, body } = payload[0]
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/bulk-delete-worker/${harbor_id}`, body, makeHeaders())
        context.commit('setIsLoadingBtn', false)
        if (store.getters.isLoading) {
            context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the Worker', { root: true })
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
    deleteCluster: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoading', true)
        context.commit('setIsLoadingBtn', true)
        const { harbor_id } = payload
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/delete-cluster/${harbor_id}`, makeHeaders())
        context.commit('setIsLoadingBtn', false)
        if (store.getters.isLoading) {
            context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the Harbor', { root: true })
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
    downloadConfig: async (context: ActionContext<State, any>, payload: any ) => {
      try{
        context.commit('setIsLoading', true)
        context.commit('setIsLoadingBtn', false)
          // Download Kubernates Config via confirm password
          // window.location.href = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/download-kubeconfig}`;
        const resp = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/download-kubeconfig`, payload, makeHeaders())
        const link = document.createElement('a');
        link.href = resp.data.data;
        // link.setAttribute('download', 'file.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        context.commit('setIsLoading', false)
        context.dispatch('HOMEPAGE/showSuccessToast', 'Kubernetes Config has been successfully downloaded', { root: true })
        return resp        
      }catch(e){
        context.commit('setIsLoadingBtn', false)
        context.commit('setIsLoading', false)
        context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
        return e.response.data
      }
    },
    fetchMaintWindows: async(context: ActionContext<State, any>, payload: any) => {
			try{
        context.commit('setIsLoading', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/maintenance-windows/${payload.harbor_id}`
        const resp = await axios.get(`${API}`, makeHeaders())
        // console.log(resp)
        if(resp.status == 200){
          let data = resp.data.data
          context.commit('setMaintWindows', data)
          context.commit('setIsLoading', false)      
        }
				return resp
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    saveMaintenanceWindows: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoadingBtn', true)
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/maintenance-windows/${payload.harborid}`, payload.body, makeHeaders())
        context.commit('setIsLoadingBtn', false)
        context.dispatch('HOMEPAGE/showSuccessToast', response.data.message, { root: true })
        return response
      }catch(e){
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
    },
    fetchLimitHarbor: async(context: ActionContext<State, any>, payload: any) => {
			try{
        context.commit('setIsLoading', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/service-limit/${payload.openstack_id}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        if(resp.status == 200){
          let data = resp.data.data
          context.commit('setLimitHarbor', data)
          context.commit('setIsLoading', false)      
        }
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    saveLimitHarbor: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoadingBtn', true)
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/service-limit/${payload.openstack_id}`, payload.body, makeHeaders())
        context.commit('setIsLoadingBtn', false)
        context.dispatch('HOMEPAGE/showSuccessToast', response.data.message, { root: true })
        return response
      }catch(e){
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
    },
    fetchFlavors: async(context: ActionContext<State, any>, payload: any) => {
			try{
        let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/flavor`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        let data = resp.data.data
        context.commit('setFlavors', data)
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    getToken: async(context: ActionContext<State, any>, payload: any) => {
			try{
        let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/get-token/${payload.harborid}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        let data = resp.data.data
        context.commit('setTokenDash', data)
        context.commit('setShowToken', true)
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    generateToken: async(context: ActionContext<State, any>, payload: any) => {
			try{
        context.commit('setIsLoadingBtn', true)
        context.commit('setShowToken', false)
        let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/generate-token/${payload.harborid}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.post(`${API}`, payload.body, makeHeaders())
        // let data = resp.data.data
        // context.commit('setTokenDash', data)
				return resp.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchVersion: async(context: ActionContext<State, any>, payload: any) => {
			try{
        let API = `${process.env.VUE_APP_API_BASE_URL}/harbor/v1/deka-harbor/version`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        let data = resp.data.data
        context.commit('setVersions', data)
				return resp.data
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    fetchZones: async(context: ActionContext<State, any>, payload: any) => {
			try{
        let API = `${process.env.VUE_APP_API_BASE_URL}/zone/list-by-project/${payload.project_id}`
        // payload.harbor_id ? API += `${payload.harbor_id}` : ''
        const resp = await axios.get(`${API}`, makeHeaders())
        let data = resp.data.data
        context.commit('setZones', data)
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