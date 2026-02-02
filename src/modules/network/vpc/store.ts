import axios from "@/lib/axios";
import { ActionContext, Module } from "vuex";
import { isLimitError, createLimitErrorMsg } from "@/lib/validator";
import libProject from "@/lib/project";
import axios2 from 'axios'
interface State {
  vpcs: [];
  vpcList: [];
  vpc: {};
  isLoading: Boolean;
  vpcdetailPaginator: {};
  instances: [];
  isLoadingBtn: Boolean,
  staticRoutings: [],
  totalRowsSR: Number
  natGateways: [],
  totalRowsNG: Number,
  networks: [],
  totalRowsNetwork: Number,
  interfaces: [],
  totalRowsInterfaces: Number,
  detailVyos: Object,
  isLoadingSwitch: Boolean,
  subnets: [],
  totalRowsSubnets: Number,
  ports: [],
  totalRowsPorts: Number,
  isLoadingInterfaces: boolean,
  isLoadingSR: boolean,
  isLoadingNat: boolean,
  limitRouter:{},
}

function sortByName(a: any, b: any) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

const store: Module<State, any> = {
  namespaced: true,
  state: {
    vpcs: [],
    vpcList: [],
    vpc: {},
    isLoading: false,
    vpcdetailPaginator: {
      count: 1,
      totalpage: 1,
      page: 1,
    },
    instances: [],
    isLoadingBtn: false,
    staticRoutings: [],
    totalRowsSR: 0,
    natGateways: [],
    totalRowsNG: 0,
    networks: [],
    totalRowsNetwork: 0,
    interfaces: [],
    totalRowsInterfaces: 0,
    detailVyos: {},
    isLoadingSwitch: false,
    subnets: [],
    totalRowsSubnets: 0,
    ports: [],
    totalRowsPorts: 0,
    isLoadingInterfaces: false,
    isLoadingSR: false,
    isLoadingNat: false,
    limitRouter: {},
  },
  getters:{
    isLoading: state => state.isLoading,
    isLoadingBtn: state => state.isLoadingBtn,
    isLoadingInterfaces: state => state.isLoadingInterfaces,
    isLoadingSR: state => state.isLoadingSR,
    isLoadingNat: state => state.isLoadingNat,
    getLimitRouter: state => state.limitRouter,
  },
  mutations: {
    setvpcs: (state: State, payload: any) => (state.vpcs = payload),
    setVpcList: (state: State, payload: any) => (state.vpcList = payload),
    setVPC: (state: State, payload: any) => (state.vpc = payload),
    setIsLoading: (state: State, payload: any) => (state.isLoading = payload),
    setVPCDetailPaginator: (state, payload) => state.vpcdetailPaginator = payload,
    setInstances: (state: State, payload: any) => (state.instances = payload),
    setIsLoadingBtn: (state, loading) => state.isLoadingBtn = loading,
    setStaticRoutings: (state, staticRoutings) => state.staticRoutings = staticRoutings,
    setTotalRowsSR: (state, totalRows) => state.totalRowsSR = totalRows,
    setNatGateways: (state, natGateway) => state.natGateways = natGateway,
    setTotalRowsNG: (state, totalRows) => state.totalRowsNG = totalRows,
    setNetworks: (state, network) => state.networks = network,
    setTotalRowsNetwork: (state, totalRows) => state.totalRowsNetwork = totalRows,
    setInterfaces: (state, interfaces) => state.interfaces = interfaces,
    setTotalRowsInterfaces: (state, totalRows) => state.totalRowsInterfaces = totalRows,
    setDetailVyos: (state, vyos) => state.detailVyos = vyos,
    setIsLoadingSwitch: (state, loading) => state.isLoadingSwitch = loading,
    setSubnets: (state, subnets) => state.subnets = subnets,
    setTotalRowsSubnets: (state, totalRows) => state.totalRowsSubnets = totalRows,
    setPorts: (state, port) => state.ports = port,
    setTotalRowsPorts: (state, totalRows) => state.totalRowsPorts = totalRows,
    setIsLoadingInterfaces: (state: State, payload: any) => (state.isLoadingInterfaces = payload),
    setIsLoadingSR: (state: State, payload: any) => (state.isLoadingSR = payload),
    setIsLoadingNat: (state: State, payload: any) => (state.isLoadingNat = payload),
    // setRouterLimit: (state: State, payload: any) => (state.getRouterLimit = payload),
    setLimitRouter: (state, data) => state.limitRouter = data,
  },
  actions: {
    CREATE_VPC: async (context: ActionContext<State, any>, payload: any) => {
      try {
        context.commit("setIsLoading", true);
        const activeProjectID = await libProject.getActiveProjectID();
        if (!activeProjectID) {
          context.commit("setIsLoading", false);
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "Could not find project data.",
            { root: true }
          );
        }
        payload.project_id = activeProjectID;
        const response = await axios.instance.post("/network/vpc", payload);
        context.commit("setIsLoading", false);
        return response.data;
      } catch (e) {
        let errorMessage = "A problem encountered while creating VPC";

        const error = e.response.data.data;
        if (error && (error.includes("Please contact") || error.includes("Service activation"))) errorMessage = error;
        else if (error && error.includes("OverQuota")) errorMessage = "VPC quota has been exceeded the limit. Please contact the administrator.";
        else if (error && error.includes("Network has exceeded the limit")) errorMessage = "Network has exceeded the limit. Please contact administrator.";
        else if (error && error.includes("vpc voucher has reached limit")) errorMessage = "Router quota of trial voucher has reached the limit";
        else if (error && error.includes('voucher has already expired')) errorMessage = "This voucher is expired."
        else if (error && error.includes('total VPC voucher has reached limit')) errorMessage = "VPC quota has reached the limit!"
        else if (error && error.includes("Please contact")) errorMessage = error;
        else if (error && isLimitError(error)) errorMessage = createLimitErrorMsg(error);
        else if (error && error.includes("message")) errorMessage = e.response.data.messageErr;
        else if (e.response.data.message) errorMessage = e.response.data.message;
        
        context.commit("setIsLoading", false);
        context.dispatch("HOMEPAGE/showErrorToast", errorMessage, {
          root: true,
        });
      }
    },
    CREATE_VPC_ADVANCED: async(context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setIsLoading", true);
        context.commit("setIsLoadingBtn", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        const response = await axios.instance.post(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/vpc`, payload, { headers })
        context.commit("setIsLoadingBtn", false);
        if (store.getters.isLoading) {
          context.dispatch('HOMEPAGE/showProcessToastWS', 'Creating NAT Gateway', { root: true })
        }
        return response
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.commit("setIsLoadingBtn", false);
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0]: e.response.statusText, { root: true })
          return e.response.data ? e.response.data : e.response.statusText
      }
    },
    DELETE_VPC_ADVANCED: async (context: ActionContext<State, any>, payload) => {
      try{
        // context.commit("setIsLoading", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        const response = await axios.instance.delete(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/vpc/${payload.id_vpc}`, { headers })
        // if(payload.status == 'CREATED'){
          if (store.getters.isLoading) {
            context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the VPC', { root: true })
          }
        // }else{
        //   context.dispatch('HOMEPAGE/showSuccessToast', 'VPC has been successfully deleted' , { root: true })
        // }
        // if(payload.vyos){
        //   console.log(payload.vyos)
        //   if (store.getters.isLoading) {
        //     context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the VPC', { root: true })
        //   }
        // }else{
        //   console.log(payload.vyos)
        //   context.commit("setIsLoading", false);
        //   context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
        // }
        return response
      }catch(e){
        // if(e.response){
        //   // console.log(e.response)
        //   context.commit('setIsLoading', false)
        //   context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0] : e.response.statusText, { root: true })
        //   return e.response.data ? e.response.data.errors[0] : e.response.statusText
        // }else{
        //   context.commit('setIsLoading', false)
        //   context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
        //   return e.message
        // }

        const errorMessage = e.response.data.data;
        if(e.response.data.message)
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            e.response.data.message,
            { root: true }
          );
        else if (errorMessage.includes("VPC is being used by instance"))
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "VPC Network is being used. Destroy all resources within first and please try again.",
            { root: true }
          );
        else
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "Failed to delete VPC Network",
            { root: true }
          );
        context.commit("setIsLoading", false);
      }
    },
    //VPC Advanced
    FETCH_VPC: async (context: ActionContext<State, any>, payload: any) => {
      try{
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        const activeProjectID = await libProject.getActiveProjectID();
        if (!activeProjectID)
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "Could not find project data.",
            { root: true }
          );
        const params = new URLSearchParams();
        payload?.page ? params.append("page", payload.page) : '';
        payload?.itemsPerPage ? params.append("limit", payload.itemsPerPage) : '';
        params.append('project_id.equals', activeProjectID)
        payload?.type ? params.append("type.in", payload.type) : '' 
        
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/vpc?${params}`, { headers })
        const resp = response.data.data.rows
        context.commit("setVpcList", resp);
      }catch(e){
        if(e.response){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0] : e.response.statusText, { root: true })
          return e.response.data ? e.response.data.errors[0] : e.response.statusText
        }else{
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    DETAIL_VPC2: async (context: ActionContext<State, any>, payload: any) => {
      const token = localStorage.getItem('token')
      const headers = {
        Authorization: `Bearer ${token} `
      }
      const { id }: any = payload;
      let params = {}      
      params = {
        id: id,
        page: 1,
        limit: 10
      }
      params = { ...params, ...payload }
      const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/vpc/detail/${id}`, { headers })
      if (response.status === 200) {
        context.commit("setVPC", response.data.data);
        // context.commit("setVPCDetailPaginator", response.data.data.paginate);
        context.commit("setInstances", response.data.data.instance);
        return response.data;
      } else
        return context.dispatch(
          "HOMEPAGE/showErrorToast",
          "Failed to get VPC Network data",
          { root: true }
        );
    },
    ATTACH_INTERFACE: async (context: ActionContext<State, any>, payload: any) => {
      try{
        let body = {
          instance_name: payload.instance_name,
          instance_port_ip: payload.instance_port_ip,
          openstack_project_id: payload.openstack_project_id,
          organization_id: payload.organization_id,
          project_id: payload.project_id,
          user_id: payload.user_id,
        }
        let id_vpc = payload.id_vpc
        // console.log(body)

        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        const response = await axios.instance.post(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/vpc/${id_vpc}/attach-interface`, body, { headers })
        return response.data
      }catch(e){
        if(e.response){
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0] : e.response.statusText, { root: true })
          return e.response.data ? e.response.data.errors[0] : e.response.statusText
        }else{
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
          return e.message
        }
      }
    },
    UPDATE_VPC: async (context: ActionContext<State, any>, payload: any) => {
      try {
        context.commit("setIsLoading", true); 
        const response = await axios.instance.put(
          `/network/vpc/${payload.id}`,
          payload
        );
        context.dispatch(
          "HOMEPAGE/showSuccessToast",
          "VPC Network has been successfully updated.",
          { root: true }
        );
        context.commit("setIsLoading", false);
        return response.data;
      } catch (e) {
        let error = e.response.data.message

        if(error.includes('VPC name is already exist')) {
          context.commit("setIsLoading", false);
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            error,
            { root: true }
          );
        }else if (isLimitError(error)) {
          context.commit("setIsLoading", false);
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            createLimitErrorMsg(error),
            { root: true }
          );
        }else{
          context.commit("setIsLoading", false);
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "VPC Network failed to update.",
            { root: true }
          );
        }
      }
    },
    fetchInterfaces: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setInterfaces", []);
        context.commit("setTotalRowsInterfaces", 0);
        context.commit("setIsLoadingInterfaces", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        // const activeProjectID = await libProject.getActiveProjectID();
        // if (!activeProjectID)
        //   context.dispatch(
        //     "HOMEPAGE/showErrorToast",
        //     "Could not find project data.",
        //     { root: true }
        //   );
        let API = `${process.env.VUE_APP_API_BASE_URL}/router/api/v1/interface`
        payload.itemsPerPage ? API += `?limit=${payload.itemsPerPage}` : ''
        payload.page ? API += `&page=${payload.page}` : ''
        payload.instance_id ? API += `&instance_id.equals=${payload.instance_id}` : ''
        // const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/interface?limit=${payload.itemsPerPage}&page=${payload.page}&instance_id.equals=${payload.instance_id}`, { headers })
        const response = await axios.instance.get(`${API}`, { headers })
        let resp = response.data.data
        context.commit("setInterfaces", resp.rows);
        context.commit("setTotalRowsInterfaces", resp.total_rows);
        context.commit("setIsLoadingInterfaces", false);
        return response
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoadingInterfaces', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0] : e.response.statusText, { root: true })
          return e.response.data ? e.response.data : e.response.statusText
      }
    },
    createInterface: async(context:ActionContext<State, any>, payload:any) => {
      try{
        context.commit("setIsLoading", true);
        context.commit("setIsLoadingBtn", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        const response = await axios.instance.post(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/interface`, payload, { headers })
        context.commit("setIsLoadingBtn", false);
        if (store.getters.isLoading) {
          context.dispatch('HOMEPAGE/showProcessToastWS', 'Creating the floating ip', { root: true })
        }
        // context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
        return response
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.commit("setIsLoadingBtn", false);
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0] : e.response.statusText, { root: true })
          return e.response.data ? e.response.data : e.response.statusText
      }
    },
    deleteInterface: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setIsLoading", true);
        context.commit("setIsLoadingBtn", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/router/api/v1/interface`
          
        const resp = await axios.instance.delete(`${API}/${payload.id}`,{ headers })
        // context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
        context.commit("setIsLoadingBtn", false);
        if (store.getters.isLoading) {
          context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the floating ip', { root: true })
        }
        return resp
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.commit("setIsLoadingBtn", false);
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.errors[0], { root: true })
          return e.response.data
      }
    },
    fetchStaticRouting: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setIsLoadingSR", true);
        context.commit("setStaticRoutings", []);
        context.commit("setTotalRowsSR", 0);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        // const activeProjectID = await libProject.getActiveProjectID();
        // if (!activeProjectID)
        //   context.dispatch(
        //     "HOMEPAGE/showErrorToast",
        //     "Could not find project data.",
        //     { root: true }
        //   );
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/static-routing?limit=${payload.itemsPerPage}&page=${payload.page}&instance_id.equals=${payload.instance_id}`, { headers })
        let resp = response.data.data
        context.commit("setStaticRoutings", resp.rows);
        context.commit("setTotalRowsSR", resp.total_rows);
        context.commit("setIsLoadingSR", false);
        return response
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoadingSR', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0] : e.response.statusText, { root: true })
          return e.response.data ? e.response.data : e.response.statusText
      }
    },
    createStaticRouting: async(context:ActionContext<State, any>, payload:any) => {
      try{
        context.commit("setIsLoading", true);
        context.commit("setIsLoadingBtn", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        const response = await axios.instance.post(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/static-routing`, payload, { headers })
        // context.commit("setIsLoading", false);
        context.commit("setIsLoadingBtn", false);
        if (store.getters.isLoading) {
          context.dispatch('HOMEPAGE/showProcessToastWS', 'Creating the routing', { root: true })
        }
        // context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
        return response
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.commit("setIsLoadingBtn", false);
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0] : e.response.statusText, { root: true })
          return e.response.data ? e.response.data : e.response.statusText
      }
    },
    deleteStaticRouting: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setIsLoading", true);
        context.commit("setIsLoadingBtn", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/router/api/v1/static-routing`
          
        const resp = await axios.instance.delete(`${API}/${payload.id}`,{ headers })
        // context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
        context.commit("setIsLoadingBtn", false);
        if (store.getters.isLoading) {
          context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the routing', { root: true })
        }
        return resp
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.commit("setIsLoadingBtn", false);
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.errors[0], { root: true })
          return e.response.data
      }
    },
    fetchNatGateway: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setIsLoadingNat", true);
        context.commit("setNatGateways", []);
        context.commit("setTotalRowsNG", 0);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        // const activeProjectID = await libProject.getActiveProjectID();
        // if (!activeProjectID)
        //   context.dispatch(
        //     "HOMEPAGE/showErrorToast",
        //     "Could not find project data.",
        //     { root: true }
        //   );
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/nat-gateway?limit=${payload.itemsPerPage}&page=${payload.page}&instance_id.equals=${payload.instance_id}`, { headers })
        let resp = response.data.data
        context.commit("setNatGateways", resp.rows);
        context.commit("setTotalRowsNG", resp.total_rows);
        context.commit("setIsLoadingNat", false);
        return response
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoadingNat', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0] : e.response.statusText, { root: true })
          return e.response.data ? e.response.data : e.response.statusText
      }
    },
    createNatGateway: async(context:ActionContext<State, any>, payload:any) => {
      try{
        context.commit("setIsLoading", true);
        context.commit("setIsLoadingBtn", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        const response = await axios.instance.post(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/nat-gateway`, payload, { headers })
        // context.commit("setIsLoading", false);
        context.commit("setIsLoadingBtn", false);
        if (store.getters.isLoading) {
          context.dispatch('HOMEPAGE/showProcessToastWS', 'Creating the nat', { root: true })
        }
        // context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
        return response
      }catch(e){
        // console.log(e.response)
          context.commit('setIsLoading', false)
          context.commit("setIsLoadingBtn", false);
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0] : e.response.statusText, { root: true })
          return e.response.data ? e.response.data : e.response.statusText
      }
    },    
    deleteNat: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setIsLoading", true);
        context.commit("setIsLoadingBtn", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/router/api/v1/nat-gateway`
          
        const resp = await axios.instance.delete(`${API}/${payload.id}`,{ headers })
        // context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
        context.commit("setIsLoadingBtn", false);
        if (store.getters.isLoading) {
          context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the nat', { root: true })
        }
        return resp
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.commit("setIsLoadingBtn", false);
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.errors[0], { root: true })
          return e.response.data
      }
    },
    fetchNetwork: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setNetworks", []);
        context.commit("setIsLoading", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        const activeProjectID = await libProject.getActiveProjectID();
        if (!activeProjectID)
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "Could not find project data.",
            { root: true }
          );
        let API = `${process.env.VUE_APP_API_BASE_URL}/router/api/v1/vyos`
        API += `?page=${payload.page}&limit=${payload.itemsPerPage}`
        payload.vpc_id ? API += `&vpc_id.equals=${payload.vpc_id}` : ''
        activeProjectID ? API += `&project_id.equals=${activeProjectID}` : ''
        const response = await axios.instance.get(`${API}`, { headers })
        let resp = response.data.data
        context.commit("setNetworks", resp.rows);
        context.commit("setTotalRowsNetwork", resp.total_rows);
        context.commit("setIsLoading", false);
        return response
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0] : e.response.statusText, { root: true })
          return e.response.data ? e.response.data : e.response.statusText
      }
    },
    deleteNetwork: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setIsLoading", true);
        context.commit("setIsLoadingBtn", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/router/api/v1/vyos`
          
        const resp = await axios.instance.delete(`${API}/${payload.id}`,{ headers })
        // context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
        context.commit("setIsLoadingBtn", false);
        if (store.getters.isLoading) {
          context.dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the VPC advanced', { root: true })
        }
        return resp
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.commit("setIsLoadingBtn", false);
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.errors[0], { root: true })
          return e.response.data
      }
    },
    setDeleteGateway: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit('setIsLoading', true)
        context.commit('setIsLoadingSwitch', true)
        context.commit("setIsLoadingBtn", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/router/api/v1/router`
        let resp = null
        let act = ''
        if(!payload.header){
          resp = await axios.instance.post(`${API}/${payload.id}`,{ headers })
          act = 'Setting the gateway'
        }else if(payload.header){
          resp = await axios.instance.delete(`${API}/${payload.id}`,{ headers })
          act = 'Clearing the gateway'
        }
        // context.dispatch('HOMEPAGE/showSuccessToast', resp.data.message , { root: true })
        context.commit("setIsLoadingBtn", false);
        if (store.getters.isLoading) {
          context.dispatch('HOMEPAGE/showProcessToastWS', `${act}`, { root: true })
        }
        return resp
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
          return e.response.data
      }
    },
    fetchSubnet: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setSubnets", []);
        context.commit("setTotalRowsSubnets", 0);
        // context.commit("setMarkerNextSubnet", '');
        // context.commit("setMarkerPreviousSubnet", '');
        context.commit("setIsLoading", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        const ActiveProject = await libProject.getActiveProject();
        if (!ActiveProject)
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "Could not find project data.",
            { root: true }
          );
        let API = `${process.env.VUE_APP_API_BASE_URL}/router/api/v1/network/subnet/`+ActiveProject.openstack_project_id
        API += `?page=${payload.page}&limit=${payload.itemsPerPage}`
        payload.project_id ? API += `&project_id.equals=${payload.project_id}` : ''
        payload.network_id ? API += `&network_id.equals=${payload.network_id}` : ''
        // payload.marker_next ? API += `&marker_next=${payload.marker_next}` : ''
        // payload.marker_previous ? API += `&marker_previous=${payload.marker_previous}` : ''
        const response = await axios.instance.get(`${API}`, { headers })
        let resp = response.data.data
        context.commit("setSubnets", resp.rows);
        context.commit("setTotalRowsSubnets", resp.total_rows);
        context.commit("setIsLoading", false);
        return response
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.message : e.response.statusText, { root: true })
          return e.response.data ? e.response.data : e.response.statusText
      }
    },
    fetchPorts: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setPorts", []);
        context.commit("setTotalRowsPorts", 0);
        context.commit("setIsLoading", true);
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        const ActiveProject = await libProject.getActiveProject();
        if (!ActiveProject)
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "Could not find project data.",
            { root: true }
          );
        let API = `${process.env.VUE_APP_API_BASE_URL}/router/api/v1/network/port/`+ActiveProject.openstack_project_id
        API += `?page=${payload.page}&limit=${payload.itemsPerPage}`
        payload.project_id ? API += `&project_id.equals=${payload.project_id}` : ''
        payload.network_id ? API += `&network_id.equals=${payload.network_id}` : ''
        const response = await axios.instance.get(`${API}`, { headers })
        let resp = response.data.data
        context.commit("setPorts", resp.rows);
        context.commit("setTotalRowsPorts", resp.total_rows);
        context.commit("setIsLoading", false);
        return response
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.message : e.response.statusText, { root: true })
          return e.response.data ? e.response.data : e.response.statusText
      }
    },
    DETAIL_VYOS: async (context: ActionContext<State, any>, payload: any) => {
      try{
        context.commit("setIsLoading", true);
        context.commit("setDetailVyos", {});
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        let API = `${process.env.VUE_APP_API_BASE_URL}/router/api/v1/vyos/${payload.vyosid}`
        const response = await axios.instance.get(`${API}`, { headers })
        let resp = response.data.data
        context.commit("setDetailVyos", resp);
        context.commit("setIsLoading", false);
        return response
      }catch(e){
          // console.log(e.response)
          context.commit('setIsLoading', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data ? e.response.data.errors[0] : e.response.statusText, { root: true })
          return e.response.data ? e.response.data : e.response.statusText

      }
    },
    fetchvpcs: async (context: ActionContext<State, any>, payload: any) => {
      let data: any = [];
      const activeProjectID = await libProject.getActiveProjectID();
      if (!activeProjectID)
        context.dispatch(
          "HOMEPAGE/showErrorToast",
          "Could not find project data.",
          { root: true }
        );

      const response: any = await axios.instance.get(
        `/network/vpc/project/${activeProjectID}`
      );
      if (response.status === 200) {
        response.data.data.map((item: any) => data.push(item));
        data.sort(sortByName);
        context.commit("setvpcs", data);
      }
      return data;
    },
    DELETE_VPC: async (context: ActionContext<State, any>, payload: any) => {
      try {
        context.commit("setIsLoading", true);
        const { id, resources }: any = payload;
        if (resources > 0){
          return context.dispatch(
            "HOMEPAGE/showErrorToast",
            "VPC Network is being used. Destroy all resources within first and please try again.",
            { root: true }
          );
        }
        const response: any = await axios.instance.delete(
          `/network/vpc/delete/${id}`
        );
        if (response.status === 200) {
          // context.dispatch("fetchvpcs");
          context.dispatch("FETCH_VPC");
          context.dispatch(
            "HOMEPAGE/showSuccessToast",
            "VPC Network has been successfully deleted",
            { root: true }
          );
          context.commit("setIsLoading", false);
        }
        context.commit("setIsLoading", false);
        return response.data;
      } catch (e) {
        const errorMessage = e.response.data.data;   
        if(e.response.data.message){
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            e.response.data.message,
            { root: true }
          );
        }else  if (errorMessage.includes("SubnetInUse")){
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "VPC Network is being used. Destroy all resources within first and please try again.",
            { root: true }
          );
        }else if (errorMessage.includes("vpc attached on instance")){
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "Unable to delete VPC as it is currently attached to the Instance.",
            { root: true }
          );
        }else{
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "Failed to delete VPC Network",
            { root: true }
          );
        }
        context.commit("setIsLoading", false);
      }
    },
    // DETAIL_VPC: async (context: ActionContext<State, any>, payload: any) => {
    //   const { id }: any = payload;
    //   const response: any = await axios.instance.get(
    //     `/network/vpc/detail/${id}`
    //   );
    //   if (response.status === 200) {
    //     context.commit("setVPC", response.data.data);
    //     return response.data;
    //   } else
    //     return context.dispatch(
    //       "HOMEPAGE/showErrorToast",
    //       "Failed to get VPC Network data",
    //       { root: true }
    //     );
    // },
    DETAIL_VPC: async (context: ActionContext<State, any>, payload: any) => {
      const { id }: any = payload;
      let params = {}      
      params = {
        id: id,
        page: 1,
        limit: 10
      }
      params = { ...params, ...payload }
      const response: any = await axios.instance.get(
        // `/network/vpc/detail/${id}`
        `/network/vpc/detail/paginated`,{
          params
        }
      );
      if (response.status === 200) {
        context.commit("setVPC", response.data.data);
        context.commit("setVPCDetailPaginator", response.data.data.paginate);
        context.commit("setInstances", response.data.data.instances);
        localStorage.setItem('vpc', JSON.stringify(response.data.data))
        return response.data;
      } else
        return context.dispatch(
          "HOMEPAGE/showErrorToast",
          "Failed to get VPC Network data",
          { root: true }
        );
    },
    createVPCPort: async ({ commit, dispatch }, {payload, vpcid}) => {
      try {
          commit('setIsLoading', true)
          commit("setIsLoadingBtn", true);
          const activeProjectID = await libProject.getActiveProjectID();
          if (!activeProjectID) {
            commit("setIsLoading", false);
            dispatch(
              "HOMEPAGE/showErrorToast",
              "Could not find project data.",
              { root: true }
            );
          }
          payload.project_id = activeProjectID;
          const response = await axios.instance.post(`/network/vpc/port`, payload)
          dispatch('DETAIL_VPC', { id: vpcid})
          dispatch('HOMEPAGE/showSuccessToast', 'VPC Port has been successfully added', { root: true })
          commit('setIsLoading', false)
          return response
      } catch (e) {
          const err = e.response.data.data
          let errorMessage = 'A problem encountered while trying to create new vpc port'
          if (err.includes('vpc port name has already exist')) errorMessage = 'VPC Port name already exists.'
          else if (isLimitError(err)) errorMessage = createLimitErrorMsg(err)
          else if (err.includes('OverQuota')) errorMessage = 'Port has reached out the limit. Please contact the administrator'
          else if (err.includes('is not a valid IP for any of the subnets on the specified network')) errorMessage = 'IP Address is out of the specified network range!'          
          else if (err.includes('already allocated in subnet')) errorMessage = 'IP Address has already allocated to VPC Port!'          
          else if (err.includes('is not a valid MAC address')) errorMessage = 'Mac Address format is incorrect. Please use the correct format for input!'                    
          else if (err.includes('is in use')) errorMessage = 'Mac Address is already in use by another port!'

          commit('setIsLoading', false)          
          dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
          return e.response
      }
    },
    updateVPCPort: async ({ commit, dispatch }, {payload, vpcid}) => {
      try {          
          commit('setIsLoading', true)
          commit("setIsLoadingBtn", true);
          const activeProjectID = await libProject.getActiveProjectID();
          if (!activeProjectID) {
            commit("setIsLoading", false);
            dispatch(
              "HOMEPAGE/showErrorToast",
              "Could not find project data.",
              { root: true }
            );
          }
          payload.project_id = activeProjectID;
          const response = await axios.instance.post(`/network/vpc/port/edit`, payload)
          commit('setIsLoading', false)
          dispatch('DETAIL_VPC', { id: vpcid})
          // dispatch('fetchRegionByProject')
          dispatch('HOMEPAGE/showSuccessToast', 'VPC Port has been successfully updated', { root: true })
          return response
      } catch (e) {
          const err = e.response.data.data
          let errorMessage = 'A problem encountered while trying to update vpc port'
          dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
          commit('setIsLoading', false)
          return e.response
      }
    },
    deleteVPCPort: async ({ commit, dispatch }, {vpcPortID, vpcid}) => {
      try {
          commit('setIsLoading', true)
          commit("setIsLoadingBtn", true);          
          const response = await axios.instance.delete(`/network/vpc/port/delete/${vpcPortID}`)
          commit('setIsLoading', false)
          dispatch('DETAIL_VPC', { id: vpcid})
          // dispatch('fetchRegionByProject')
          dispatch('HOMEPAGE/showSuccessToast', 'VPC Port has been successfully deleted', { root: true })
          return response
      } catch (e) {
          const err = e.response.data.data
          let errorMessage = 'A problem encountered while trying to delete vpc port'          
          dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
          commit('setIsLoading', false)
          return e.response
      }
    },
    fetchRouterLimit: async(context: ActionContext<State, any>, payload: any) => {
      try{
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        const activeProjectID = await libProject.getActiveProjectID();
        if (!activeProjectID)
          context.dispatch(
            "HOMEPAGE/showErrorToast",
            "Could not find project data.",
            { root: true }
          );
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/service-limit/${activeProjectID}`, { headers })
        const resp = response.data.data
        context.commit("setLimitRouter", resp);
        return resp
      }catch(e){
          context.commit('setIsLoading', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
    },
    saveLimitRouter: async (context: ActionContext<State, any>, payload: any) => {
      try{
        const activeProjectID = await libProject.getActiveProjectID();
        payload.body.project_id = activeProjectID
        const token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${token} `
        }
        context.commit('setIsLoadingBtn', true)
        const response = await axios.instance.post(`${process.env.VUE_APP_API_BASE_URL}/router/api/v1/service-limit`, payload.body, { headers })

        context.commit('setIsLoadingBtn', false)
        context.dispatch('HOMEPAGE/showSuccessToast', response.data.message, { root: true })
        return response
      }catch(e){
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
          return e.response.data.responseMessage
      }
    },
    createVPCSubnet: async ({ commit, dispatch }, {payload, vpcid}) => {
      try {
          commit('setIsLoading', true)
          commit("setIsLoadingBtn", true);
          const activeProjectID = await libProject.getActiveProjectID();
          if (!activeProjectID) {
            commit("setIsLoading", false);
            dispatch(
              "HOMEPAGE/showErrorToast",
              "Could not find project data.",
              { root: true }
            );
          }
          payload.project_id = activeProjectID;
          const response = await axios.instance.post(`/network/subnet`, payload)
          dispatch('DETAIL_VPC', { id: vpcid})
          dispatch('HOMEPAGE/showSuccessToast', 'VPC Subnet has been successfully added', { root: true })
          commit('setIsLoading', false)
          return response
      } catch (e) {
          const err = e.response.data.message
          let errorMessage = 'A problem encountered while trying to create new vpc subnet'
          if (err) errorMessage = e.response.data.message                
          commit('setIsLoading', false)          
          dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
          return e.response
      }
    },
    updateVPCSubnet: async ({ commit, dispatch }, {payload, vpcid}) => {
      try {          
          commit('setIsLoading', true)
          commit("setIsLoadingBtn", true);
          const activeProjectID = await libProject.getActiveProjectID();
          if (!activeProjectID) {
            commit("setIsLoading", false);
            dispatch(
              "HOMEPAGE/showErrorToast",
              "Could not find project data.",
              { root: true }
            );
          }
          payload.project_id = activeProjectID;
          const response = await axios.instance.put(`/network/subnet/${payload.id}`, payload)
          commit('setIsLoading', false)
          dispatch('DETAIL_VPC', { id: vpcid})
          dispatch('HOMEPAGE/showSuccessToast', 'VPC Subnet has been successfully updated', { root: true })
          return response
      } catch (e) {
        const err = e.response.data.message
        let errorMessage = 'A problem encountered while trying to update vpc subnet'
        if (err) errorMessage = e.response.data.message                
        commit('setIsLoading', false)          
        dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
        return e.response
      }
    },
    deleteVPCSubnet: async ({ commit, dispatch }, {vpcSubnetID, vpcid, routerid}) => {
      try {
          commit('setIsLoading', true)
          commit("setIsLoadingBtn", true);          
          const response = await axios.instance.delete(`/network/subnet/${vpcSubnetID}?router_id=${routerid.value}`)
          commit('setIsLoading', false)
          dispatch('DETAIL_VPC', { id: vpcid})
          dispatch('HOMEPAGE/showSuccessToast', 'VPC Subnet has been successfully deleted', { root: true })
          return response
      } catch (e) {
          const err = e.response.data.message
          let errorMessage = 'A problem encountered while trying to delete vpc subnet'   
          if (err) errorMessage = e.response.data.message           
          dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
          commit('setIsLoading', false)
          return e.response
      }
    },
    syncVPC: async ({dispatch}, payload) => {
      try {
        const projectid = localStorage.getItem('projectid');
        const networkID = payload.networkID;
        const response = await axios.instance.get(`/network/vpc/sync?project_id=${projectid}&network_id=${networkID}`);
        
        dispatch("HOMEPAGE/showSuccessToast", `${response.data.message}`, { root: true });

        return response;
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
        return error.response.data;
      }
      
    }
  },
};
export default store;
