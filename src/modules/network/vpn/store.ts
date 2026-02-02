import axios from "axios";
import { async } from "rxjs";
import { ActionContext, Module } from "vuex";
import libProject from "@/lib/project";

function makeHeaders() {
  const token = localStorage.getItem('token') || "{}"
  return {
      headers: { Authorization: `Bearer ${token}` }
  }
}

interface State {
  isLoading: Boolean,
  isLoadingBtn: Boolean,
  isLoadingBtnWds: Boolean,
  isLoadingBtnMac: Boolean,
  isLoadingConfig: Boolean,
  listPfsense: [],
  listIpsec: [],
  listOpenVpn: [],
  totalRowsPfsense: number,
  totalRowsIpsec: number,
  totalRowsOpenvpn: number,
  psk: null,
  listStatusOpenvpn: Array<any>,
  isLoadingStatusVpn: Boolean,
  limitVpn:{},
  ipsecById: [],
  isLoadingConn: Boolean,
  listUserOpenvpn: Array<any>,
  TotalRowsUserOpenvpn: number,
  isLoadingUserVpn: Boolean,
  listStatusIpsec: [],
  totalRowsStatusIpsec: number,
  isLoadingStatusIpsec: boolean,
  isLoadingPhase: boolean,
}

const store : Module<State, any> = {
    namespaced: true,
    state: {
      isLoading: false,
      isLoadingBtn: false,
      isLoadingBtnWds: false,
      isLoadingBtnMac: false,
      isLoadingConfig: false,
      listPfsense: [],
      listIpsec: [],
      listOpenVpn: [],
      totalRowsPfsense: 0,
      totalRowsIpsec: 0,
      totalRowsOpenvpn: 0,
      psk: null,
      listStatusOpenvpn: [],
      isLoadingStatusVpn: false,
      limitVpn: {},
      ipsecById: [],
      isLoadingConn: false,
      listUserOpenvpn: [],
      TotalRowsUserOpenvpn: 0,
      isLoadingUserVpn: false,
      listStatusIpsec: [],
      totalRowsStatusIpsec: 0,
      isLoadingStatusIpsec: false,
      isLoadingPhase: false,
    },
    mutations: {
      setIsLoading:(state, isLoading) => state.isLoading = isLoading,
      setIsLoadingBtnWds:(state, isLoading) => state.isLoadingBtnWds = isLoading,
      setIsLoadingBtnMac:(state, isLoading) => state.isLoadingBtnMac = isLoading,
      setIsLoadingBtn:(state, isLoading) => state.isLoadingBtn = isLoading,
      setIsLoadingBtnConn:(state, isLoading) => state.isLoadingConn = isLoading,
      setIsLoadingConfig:(state, isLoading) => state.isLoadingConfig = isLoading,
      setIsLoadingUserVpn:(state, isLoading) => state.isLoadingUserVpn = isLoading,
      setListPfsense:(state, pfsense) => state.listPfsense = pfsense,
      setListIpsec:(state, ipsec) => state.listIpsec = ipsec,
      setListOpenVpn:(state, openVpn) => state.listOpenVpn = openVpn,
      setTotalRowsPfsense:(state, total) => state.totalRowsPfsense = total,
      setTotalRowsIpsec:(state, total) => state.totalRowsIpsec = total,
      setTotalRowsOpenvpn:(state, total) => state.totalRowsOpenvpn = total,
      setPsk: (state, psk) => state.psk = psk,
      setListStatusOpenvpn: (state, statusOpenvpn) => state.listStatusOpenvpn = statusOpenvpn,
      setIsLoadingStatusVpn:(state, isLoading) => state.isLoadingStatusVpn = isLoading,
      setLimitVpn: (state, data) => state.limitVpn = data,
      setIpsecById:(state, ipsec) => state.ipsecById = ipsec,
      setListUserOpenvpn: (state, user) => state.listUserOpenvpn = user,
      setTotalRowsUserOpenvpn:(state, total) => state.TotalRowsUserOpenvpn = total,
      setListStatusIpsec: (state, list) => state.listStatusIpsec = list,
      setTotalRowsStatusIpsec:(state, rows) => state.totalRowsStatusIpsec = rows,
      setIsLoadingStatusIpsec:(state, isLoading) => state.isLoadingStatusIpsec = isLoading,
      setIsLoadingPhase:(state, isLoadingPhase) => state.isLoadingPhase = isLoadingPhase,
    },
    getters:{
      getListPfsense: state => state.listPfsense,
      getListIpsec: state => state.listIpsec,
      getListOpenVpn: state => state.listOpenVpn,
      getListStatusOpenvpn: state => state.listStatusOpenvpn,
      getTotalRowsPfsense: state => state.totalRowsPfsense,
      getTotalRowsIpsec: state => state.totalRowsIpsec,
      getTotalRowsOpenvpn: state => state.totalRowsOpenvpn,
      isLoading: state => state.isLoading,
      isLoadingBtn: state => state.isLoadingBtn,
      isLoadingConn: state => state.isLoadingConn,
      isLoadingBtnWds: state => state.isLoadingBtnWds,
      isLoadingBtnMac: state => state.isLoadingBtnMac,
      isLoadingConfig: state => state.isLoadingConfig,
      isLoadingUserVpn: state => state.isLoadingUserVpn,
      isLoadingStatusVpn: state => state.isLoadingStatusVpn,
      getPsk: state => state.psk,
      getLimitVpn: state => state.limitVpn,
      ipsecById: state => state.ipsecById,
      getUserOpenvpn: state => state.listUserOpenvpn,
      getTRUserOpenvpn: state => state.TotalRowsUserOpenvpn,
      listStatusIpsec: state => state.listStatusIpsec,
      totalRowsStatusIpsec: state => state.totalRowsStatusIpsec,
      isLoadingStatusIpsec: state => state.isLoadingStatusIpsec,
      isLoadingPhase: state => state.isLoadingPhase,
    },
    actions: {
      fetchPfsense: async (context: ActionContext<State, any>, payload: any ) => {
        try{
          context.commit('setIsLoading', true)
          context.commit('setListPfsense', [])
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/vpn/instances`
          API +=`?limit=${payload.itemsPerPage}&page=${payload.page}`
          payload.projek ? API += `&project_id=${payload.projek}` : ''

          const resp = await axios.get(`${API}`, makeHeaders())
          context.commit('setIsLoading', false)
          let data = resp.data.data.rows
          context.commit('setListPfsense', data)
          context.commit('setTotalRowsPfsense', resp.data.data.total_row)
          return resp        
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      createPfsense: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoading', true)
          context.commit('setIsLoadingBtn', true)
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/pfsense/instance/deploys`, payload, makeHeaders())
          context.commit('setIsLoadingBtn', false)
          if (store.getters.isLoading) {
              context.dispatch('HOMEPAGE/showProcessToastWS', 'Creating the VPN', { root: true })
          }
          // context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
          // context.commit('setIsLoading', false)
          return response
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      deletePfsense: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoading', true)
          context.commit('setIsLoadingBtn', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/pfsense/instance/deletes`
          const resp = await axios.delete(`${API}/${payload.id}`, makeHeaders() )
          context.commit('setIsLoadingBtn', false)
          // context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          // if(payload.status == 'CREATE - SUCCESS'){
            if (store.getters.isLoading) {
                context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the VPN', { root: true })
            }
          // }
          // context.commit('setIsLoading', false)
          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      fetchIpsecById: async (context: ActionContext<State, any>, payload: any ) => {
        try{
          context.commit('setIpsecById', [])
          context.commit('setIsLoadingBtnConn', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/instance/${payload.id_ipsec}`
          
          const resp = await axios.get(`${API}`, makeHeaders())
          // console.log(resp)
          let data = resp.data.data
          context.commit('setIpsecById', [data])
          context.commit('setIsLoadingBtnConn', false)
          return resp        
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoadingBtnConn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingBtnConn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.statu
          }
        }
      },
      fetchIpsec: async (context: ActionContext<State, any>, payload: any ) => {
        try{
          context.commit('setIsLoading', true)
          context.commit('setListIpsec', [])
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/instances`
          API +=`?limit=${payload.itemsPerPage}&page=${payload.page}`
          payload.projek ? API += `&project_id=${payload.projek}` : ''
          payload.instance_name ? API += `&instance_name=${payload.instance_name}` : ''
          
          const resp = await axios.get(`${API}`, makeHeaders())
          context.commit('setIsLoading', false)
          let data = resp.data.data.rows
          localStorage.setItem('ipsec', JSON.stringify(data))
          context.commit('setListIpsec', data)
          context.commit('setTotalRowsIpsec', resp.data.data.total_row)
          return resp        
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.statu
          }
        }
      },
      fetchIpsecStatus: async (context: ActionContext<State, any>, payload: any ) => {
        try{
          context.commit('setIsLoadingBtnConn', true)
          context.commit('setListStatusIpsec', [])
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/status/${payload.instance_name}`
          // payload.instance_name ? API += `&instance_name=${payload.instance_name}` : ''
          API +=`?limit=${payload.itemsPerPage}&page=${payload.page}`
          // payload.projek ? API += `&project_id=${payload.projek}` : ''
          
          const resp = await axios.get(`${API}`, makeHeaders())
          // console.log(resp)
          context.commit('setIsLoadingBtnConn', false)
          let data = resp.data.data
          context.commit('setListStatusIpsec', data)
          context.commit('setTotalRowsStatusIpsec', resp.data.total_row)
          return resp        
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoadingBtnConn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingBtnConn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.statu
          }
        }
      },
      createIpsec: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoading', true)
          context.commit('setIsLoadingBtn', true)
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/instance/create`, payload, makeHeaders())
          // context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
          context.commit('setIsLoadingBtn', false)
          if (store.getters.isLoading) {
            context.dispatch('HOMEPAGE/showProcessToastWS', 'Creating IPsec configuration', { root: true })
          }
          // context.commit('setIsLoading', false)
          return response
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      deleteIpsec: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoading', true)
          context.commit('setIsLoadingBtn', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/instance/delete`
          const resp = await axios.delete(`${API}/${payload.id}`, makeHeaders())
          context.commit('setIsLoadingBtn', false)
          // context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          if (store.getters.isLoading) {
            context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting IPsec configuration', { root: true })
          }

          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      fetchOpenVpn: async (context: ActionContext<State, any>, payload: any ) => {
        try{
          context.commit('setIsLoading', true)
          context.commit('setListOpenVpn', [])
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/instances`
          API +=`?limit=${payload.itemsPerPage}&page=${payload.page}`
          payload.projek ? API += `&project_id=${payload.projek}` : ''
          payload.instance_name ? API += `&instance_name=${payload.instance_name}` : ''
          
          const resp = await axios.get(`${API}`, makeHeaders())
          context.commit('setIsLoading', false)
          let data = resp.data.data.rows
          localStorage.setItem('openvpn', JSON.stringify(data))
          context.commit('setListOpenVpn', data)
          context.commit('setTotalRowsOpenvpn', resp.data.data.total_row)
          return resp        
        }catch(e){
          console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      createOpenVpn: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoading', true)
          context.commit('setIsLoadingBtn', true)
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/instance/create`, payload, makeHeaders())
          // context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
          context.commit('setIsLoadingBtn', false)
          // context.commit('setIsLoading', false)
          if (store.getters.isLoading) {
            context.dispatch('HOMEPAGE/showProcessToastWS', 'Creating configuration OpenVPN', { root: true })
          }
          // context.commit('setIsLoading', false)
          return response
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      deleteOpenvpn: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoading', true)
          context.commit('setIsLoadingBtn', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/instance/delete`
          const resp = await axios.delete(`${API}/${payload.id}`, makeHeaders())
          context.commit('setIsLoadingBtn', false)
          if (store.getters.isLoading) {
            context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting OpenVPN configuration', { root: true })
          }
          // context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })

          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      fetchStatusOpenVpn: async(context: ActionContext<State, any>, payload: any) =>{
        try{
          context.commit('setIsLoadingStatusVpn', true)
          context.commit('setListStatusOpenvpn', [])
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/status/${payload.vpnname}`
          // API +=`?limit=${payload.itemsPerPage}&page=${payload.page}`
          
          const resp = await axios.get(`${API}`, makeHeaders())
          context.commit('setIsLoadingStatusVpn', false)
          let data = resp.data.data.servers
          context.commit('setListStatusOpenvpn', data)
          // context.commit('setTotalRowsOpenvpn', resp.data.data.total_row)
          return resp        
        }catch(e){
          // console.log(e.response)
          context.commit('setIsLoadingStatusVpn', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message ?? "OpenVPN status unable to contact daemon" , { root: true })
          return e.response.data
        }
      },
      updateUserOpenVpn: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoadingBtn', true)
          const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/update/user`, payload, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
          context.commit('setIsLoadingBtn', false)
          return response
        }catch(e){
          if(e.response){
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      addUserOpenVpn: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoadingBtn', true)
          let payloadAdd = {
            username: payload.username,
            password: payload.password,
            expires: payload.expires
          }
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/add-user/${payload.instance_vpn}`, payloadAdd, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
          context.commit('setIsLoadingBtn', false)
          return response
        }catch(e){
          if(e.response){
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      updateUserOpenVpnNew: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoadingBtn', true)
          let sendPayload = {
            username: payload.username,
            password: payload.password,
            expires:  payload.expires
          }
          const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/update-users/${payload.id_user}`, sendPayload, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
          context.commit('setIsLoadingBtn', false)
          return response
        }catch(e){
          if(e.response){
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      fetchUserOpenVpn: async (context: ActionContext<State, any>, payload: any ) => {
        try{
          context.commit('setIsLoadingUserVpn', true)
          context.commit('setListUserOpenvpn', [])
          let openvpn = JSON.parse(localStorage.getItem('openvpn'))
          if(openvpn){
            let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/list-users`
            // payload.instance_name ? API += `${payload.instance_name}` : ''
            API +=`?limit=${payload.itemsPerPage}&page=${payload.page}`
            // payload.openvpn_id ? API += `&open_vpn_id=${payload.openvpn_id}` : ''
            API += `&open_vpn_id=${openvpn[0].id}`
            
            const resp = await axios.get(`${API}`, makeHeaders())
            // console.log(resp)
            context.commit('setIsLoadingUserVpn', false)
            let data = resp.data.data.rows
            context.commit('setListUserOpenvpn', data)
            context.commit('setTotalRowsUserOpenvpn', resp.data.data.total_row)
            return resp        
          }
          else{
            return
          }
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoadingUserVpn', false)
            // context.dispatch('HOMEPAGE/showErrorToast', e.response.data, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingUserVpn', false)
            // context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response
          }
        }
      },
      deleteUserOpenvpn: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoadingBtn', true)
          // let sendPayload = {
          //   username: payload.username
          // }
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/delete-users`
          const resp = await axios.delete(`${API}/${payload.id_user}`, makeHeaders())
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })

          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      downloadWindows: async (context: ActionContext<State, any>, payload: any ) => {
        try{
          context.commit('setIsLoadingBtnWds', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/download/ovpn`
          window.location.href = API;
          
          let APIVERSION = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/version`
          const resp = await axios.get(`${APIVERSION}` )
          context.commit('setIsLoadingBtnWds', false)
          context.dispatch('HOMEPAGE/showSuccessToast', 'Installer windows has been successfully downloaded', { root: true })
          return resp        
        }catch(e){
            context.commit('setIsLoadingBtnWds', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data, { root: true })
            return e.response.data
        }
      },
      downloadMacos: async (context: ActionContext<State, any>, payload: any ) => {
        try{
          context.commit('setIsLoadingBtnMac', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/download/tunnelblick`
          window.location.href = API;

          let APIVERSION = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/version`
          const resp = await axios.get(`${APIVERSION}` )
          context.commit('setIsLoadingBtnMac', false)
          context.dispatch('HOMEPAGE/showSuccessToast', 'Installer Mac os has been successfully downloaded', { root: true })
          return resp        
        }catch(e){
            context.commit('setIsLoadingBtnMac', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data, { root: true })
            return e.response.data
        }
      },
      downloadViscosityconfig: async (context: ActionContext<State, any>, payload: any ) => {
        try{
          const vpn = JSON.parse(localStorage.getItem('vpn'))
          context.commit('setIsLoadingConfig', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/openvpn/download/viscosityconfig/${vpn.instance_name}`
          window.location.href = API;
          
          const resp = await axios.get(`${API}` )
          context.commit('setIsLoadingConfig', false)
          context.dispatch('HOMEPAGE/showSuccessToast', ' Viscosity inline config  has been successfully downloaded', { root: true })
          return resp        
        }catch(e){
            context.commit('setIsLoadingConfig', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data, { root: true })
            return e.response.data
        }
      },
      tesWs: async (context: ActionContext<State, any>, payload: any ) => {
        try{
          // context.commit('setIsLoadingBtn', true)
          // context.commit('setPsk', [])
          const token = localStorage.getItem('token')
          // const makeHeaders() = {
          //   Authorization: `Bearer ${token} `
          // }
          // const proj = JSON.parse(localStorage.getItem('currentProj'))
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/testws/create_openvpn`
          
          const resp = await axios.get(`${API}`)
          // context.commit('setIsLoadingBtn', false)
          let data = resp.data.data
          // context.commit('setPsk', data)
            // context.commit('setTotalRowsSlb', data.total_rowsq)
          return resp        
        }catch(e){
          // console.log(e.response)
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
      generatePSK: async (context: ActionContext<State, any>, payload: any ) => {
        try{
          context.commit('setIsLoading', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/generate/presharekey`
          const resp = await axios.get(`${API}`, makeHeaders())
          let data = resp.data.data
          context.commit('setPsk', data)
          return resp        
        }catch(e){
          // console.log(e.response)
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
      fetchVpnLimit: async(context: ActionContext<State, any>, payload: any) => {
        try{
          const activeProjectID = await libProject.getActiveProjectID();
          if (!activeProjectID)
            context.dispatch(
              "HOMEPAGE/showErrorToast",
              "Could not find project data.",
              { root: true }
            );
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/service-limit/${activeProjectID}`, makeHeaders())
          const resp = response.data.data
          context.commit("setLimitVpn", resp);
          return resp
        }catch(e){
            console.log("loading error");
            console.log(e);
            context.commit('setIsLoading', false)  
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
            return e.response.data.responseMessage
        }
      },

      saveLimitVpn: async (context: ActionContext<State, any>, payload: any) => {
        try{
          const activeProjectID = await libProject.getActiveProjectID();
          payload.body.project_id = activeProjectID
          context.commit('setIsLoadingBtn', true)
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/service-limit`, payload.body, makeHeaders())
          
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showSuccessToast', 'Custom VPN limit has been successfully updated', { root: true })
          return response
        }catch(e){
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data.responseMessage
        }
      },
      connectIPsec: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoading', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/connect/${payload.id}`
          payload.org_id ? API += `?org_id=${payload.org_id}` : ''
          payload.project_id ? API += `&project_id=${payload.project_id}` : ''
          payload.user_id ? API += `&user_id=${payload.user_id}` : ''
          const resp = await axios.get(`${API}`, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.status
          }
        }
      },
      disconnectIPsec: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoading', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/disconnect/${payload.id}`
          payload.org_id ? API += `?org_id=${payload.org_id}` : ''
          payload.project_id ? API += `&project_id=${payload.project_id}` : ''
          payload.user_id ? API += `&user_id=${payload.user_id}` : ''
          const resp = await axios.get(`${API}`, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.status
          }
        }
      },
      enableIPsec: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoading', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/enable/${payload.id}`
          //payload.user_id ? API += `&user_id=${payload.user_id}` : ''
          const resp = await axios.get(`${API}`, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.status
          }
        }
      },
      disableIPsec: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoading', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/disable/${payload.id}`
          //payload.user_id ? API += `&user_id=${payload.user_id}` : ''
          const resp = await axios.get(`${API}`, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.status
          }
        }
      },
      restartIPsec: async(context: ActionContext<State, any>, payload: any) => {
        try{
          const vpn = JSON.parse(localStorage.getItem('vpn'))
          context.commit('setIsLoading', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/vpn/${vpn.instance_name}/ipsec`
          const resp = await axios.get(`${API}`, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          console.log(e.status)
          if(e.response){
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
          console.log("masuk sini")
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', 'Service Not Found. Please contact the administrator.', { root: true })
            return e.response.status
          }
        }
      },
      restartOpenvpn: async(context: ActionContext<State, any>, payload: any) => {
        try{
          const vpn = JSON.parse(localStorage.getItem('vpn'))
          context.commit('setIsLoading', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/vpn/${vpn.instance_name}/openvpn`
          const resp = await axios.get(`${API}`, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', 'Service Not Found. Please contact the administrator.', { root: true })
            return e.response.status
          }
        }
      },
      stopServiceIpsec: async(context: ActionContext<State, any>, payload: any) => {
        try{
          const vpn = JSON.parse(localStorage.getItem('vpn'))
          context.commit('setIsLoading', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/vpn/stopservice/ipsec/${vpn.instance_name}`
          const resp = await axios.get(`${API}`, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', 'Service Not Found. Please contact the administrator.', { root: true })
            return e.response.status
          }
        }
      },
      stopServiceOpenvpn: async(context: ActionContext<State, any>, payload: any) => {
        try{
          const vpn = JSON.parse(localStorage.getItem('vpn'))
          context.commit('setIsLoading', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/vpn/stopservice/openvpn/${vpn.instance_name}`
          const resp = await axios.get(`${API}`, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', 'Service Not Found. Please contact the administrator.', { root: true })
            return e.response.status
          }
        }
      },
      createIpsecPhaseTwo: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoadingBtn', true)
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/phasetwo/create`, payload, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
          context.commit('setIsLoadingBtn', false)
          return response
        }catch(e){
          if(e.response){
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.status, { root: true })
            return e.response.status
          }
        }
      },
      deletePhaseTwo: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoadingPhase', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/phasetwo/delete`
          const resp = await axios.delete(`${API}/${payload.id}`, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoadingPhase', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingPhase', false)
            context.dispatch('HOMEPAGE/showErrorToast', 'Service Not Found. Please contact the administrator.', { root: true })
            return e.response.status
          }
        }
      },
      enableIPsecPhaseTwo: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoadingPhase', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/phasetwo/enable/${payload.id}`
          //payload.user_id ? API += `&user_id=${payload.user_id}` : ''
          const resp = await axios.get(`${API}`, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoadingPhase', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingPhase', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.status
          }
        }
      },
      disableIPsecPhaseTwo: async(context: ActionContext<State, any>, payload: any) => {
        try{
          context.commit('setIsLoadingPhase', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/phasetwo/disable/${payload.id}`
          //payload.user_id ? API += `&user_id=${payload.user_id}` : ''
          const resp = await axios.get(`${API}`, makeHeaders())
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          // console.log(e.response)
          if(e.response){
            context.commit('setIsLoadingPhase', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            context.commit('setIsLoadingPhase', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.status
          }
        }
      },
      refreshIPsec: async(context: ActionContext<State, any>, payload: any) => {
        try{
          //context.commit('setIsLoading', true)
          let API = `${process.env.VUE_APP_API_BASE_URL}/vpn-services/api/v1/VPNaaS/ipsec/status/refresh/${payload.vpnname}`
          payload.org_id ? API += `?org_id=${payload.org_id}` : ''
          payload.project_id ? API += `&project_id=${payload.project_id}` : ''
          payload.user_id ? API += `&user_id=${payload.user_id}` : ''
          const resp = await axios.get(`${API}`, makeHeaders())
          if(resp.status == 404){
            context.dispatch('HOMEPAGE/showErrorToast', "endpoint refresh IPsec not found ... contact administrator", { root: true })
          }
          context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
          
          return resp
        }catch(e){
          console.log(e.response)
          if(e.response){
            //context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data
          }else{
            //context.commit('setIsLoading', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.status
          }
        }
      },
    }
}

export default store
