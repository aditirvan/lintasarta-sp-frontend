import { ActionContext, Module } from "vuex";
import libProject from "@/lib/project";
import axios from "axios";
import router from "@/lib/router";

function makeHeaders() {
  const params = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
  return {
    headers: { Authorization: `Bearer ${params.token}` },
  };
}
function makeHeadersSuper() {
  const token = localStorage.getItem('token') || "{}"
  return {
      headers: { 'Superadmin-Authorization': `Bearer ${token}` }
  }
}

interface state {
  listVdc: Array<any>;
  listVm: Array<any>;
  isLoadingVdc: Boolean;
  isLoadingTable: Boolean;
  isLoadingBtn: Boolean;
  totalListVdc: Number;
  totalListVm: Number;
  listTemplatesVm: Array<any>;
  totalTemplatesVm: Number;
  detailTemplates: Array<any>;
  listStorage: Array<any>;
  responseStatus: Boolean;
  loadingCreate: Boolean;
  detailVm: Object;
  loginPrime: Object;
  dataTicket: Object;
  loadingOff: Boolean;
  loadingOn: Boolean;
  detailGuest: Object;
  updateCustomization: Boolean;
  statusUpdate: Boolean;
  networkNics: Array<any>;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    listVdc: [],
    listVm: [],
    isLoadingVdc: false,
    isLoadingTable: false,
    isLoadingBtn: false,
    totalListVdc: 0,
    totalListVm: 0,
    listTemplatesVm: [],
    totalTemplatesVm: 0,
    detailTemplates: [],
    listStorage: [],
    responseStatus: false,
    loadingCreate: false,
    detailVm: {},
    loginPrime: {},
    dataTicket: {},
    loadingOff: false,
    loadingOn: false,
    detailGuest: {},
    updateCustomization: false,
    statusUpdate: false,
    networkNics: [],
  },
  getters: {
    listVdc: (state) => {
      return state.listVdc;
    },
    listVm: (state) => {
      return state.listVm;
    },
    isLoadingVdc: (state) => {
      return state.isLoadingVdc;
    },
    isLoadingTable: (state) => {
      return state.isLoadingTable;
    },
    isLoadingBtn: (state) => {
      return state.isLoadingBtn;
    },
    totalListVdc: (state) => {
      return state.totalListVdc;
    },
    listTemplatesVm: (state) => {
      return state.listTemplatesVm;
    },
    totalListVm: (state) => {
      return state.totalListVm;
    },
    totalTemplatesVm: (state) => {
      return state.totalTemplatesVm;
    },
    detailTemplates: (state) => {
      return state.detailTemplates;
    },
    listStorage: (state) => {
      return state.listStorage;
    },
    responseStatus: (state) => {
      return state.responseStatus;
    },
    loadingCreate: (state) => {
      return state.loadingCreate;
    },
    detailVm: (state) => {
      return state.detailVm;
    },
    loginPrime: (state) => {
      return state.loginPrime;
    },
    dataTicket: (state) => {
      return state.dataTicket;
    },
    loadingOff: (state) => {
      return state.loadingOff;
    },
    loadingOn: (state) => {
      return state.loadingOn;
    },
    detailGuest: (state) => {
      return state.detailGuest;
    },
    updateCustomization: (state) => {
      return state.updateCustomization;
    },
    statusUpdate: (state) => {
      return state.statusUpdate;
    },
    networkNics: state => state.networkNics,
  },
  mutations: {
    setListVdc: (state: state, payload) => {
      state.listVdc = payload;
    },
    setListVm: (state: state, payload) => {
      state.listVm = payload;
    },
    setIsLoadingVdc: (state: state, payload) => {
      state.isLoadingVdc = payload;
    },
    setIsLoadingTable: (state: state, payload) => {
      state.isLoadingTable = payload;
    },
    setIsLoadingBtn: (state: state, payload) => {
      state.isLoadingBtn = payload;
    },
    setTotalListVdc: (state: state, payload) => {
      state.totalListVdc = payload;
    },
    setTotalListVm: (state: state, payload) => {
      state.totalListVm = payload;
    },
    setListTemplatesVm: (state: state, payload) => {
      state.listTemplatesVm = payload;
    },
    setTotalTemplatesVm: (state: state, payload) => {
      state.totalTemplatesVm = payload;
    },
    setDetailTemplates: (state: state, payload) => {
      state.detailTemplates = payload;
    },
    setListStorage: (state: state, payload) => {
      state.listStorage = payload;
    },
    setResponseStatus: (state: state, payload) => {
      state.responseStatus = payload;
    },
    setLoadingCreate: (state: state, payload) => {
      state.loadingCreate = payload;
    },
    setDetailVm: (state: state, payload) => {
      state.detailVm = payload;
    },
    setLoginPrime: (state: state, payload) => {
      state.loginPrime = payload;
    },
    setDataTicket: (state: state, payload) => {
      state.dataTicket = payload;
    },
    setLoadingOff: (state: state, payload) => {
      state.loadingOff = payload;
    },
    setLoadingOn: (state: state, payload) => {
      state.loadingOn = payload;
    },
    setDetailGuest: (state: state, payload) => {
      state.detailGuest = payload;
    },
    setUpdateCustomization: (state: state, payload) => {
      state.updateCustomization = payload;
    },
    setStatusUpdate: (state: state, payload) => {
      state.statusUpdate = payload;
    },
    setNetworkNics: (state: state, payload) => {
      state.networkNics = payload;
    },
  },
  actions: {
    loginDP: async ({ commit }, payload) => {
      try {
        if (payload.dekaprimeProjectId) {
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/login`, payload);
          localStorage.setItem("dekaPrime", JSON.stringify(response.data.payload));
          commit("setLoginPrime", response.data.payload);
          
          return response
        } else {
          localStorage.removeItem("dekaPrime");
          commit("setLoginPrime", {});  
        }
      } catch (error) {
        localStorage.removeItem("dekaPrime");
        commit("setLoginPrime", {});
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListVdc: async ({ commit, dispatch}, payload) => {
      try {
        commit("setIsLoadingVdc", true);
        const dataHeaders = makeHeaders()
        const response = await axios.request({
          url: `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/page`,
          method: "GET",
          headers: dataHeaders.headers,
          params: payload
        });
        if (response.data.status == true) {
          commit("setListVdc", response.data.payload.Results.OrgVdcRecord);
          commit("setTotalListVdc", response.data.payload.Results.Total);
          commit("setIsLoadingVdc", false);
        }
      } catch (error) {
        commit("setIsLoadingVdc", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListVm: async ({ commit, dispatch }, payload) => {
      const params = new URLSearchParams();
      params.append("pageSize", "10");
      params.append("page", "1");
      commit("setListVm", []);
      try {
        commit("setIsLoadingTable", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload}/vm/page?${params}`, makeHeaders());
        commit("setListVm", response.data.payload.Results.VMRecord ? response.data.payload.Results.VMRecord : []);
        commit("setTotalListVm", response.data.payload.Results.Total);
        commit("setIsLoadingTable", false);
      } catch (error) {
        commit("setListVm", []);
        commit("setIsLoadingTable", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    fetchListVm: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadingTable", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.id}/vm/page?${payload.params}`, makeHeaders());
        commit("setListVm", response.data.payload.Results.VMRecord);
        commit("setTotalListVm", response.data.payload.Results.Total);
        commit("setIsLoadingTable", false);
      } catch (error) {
        commit("setIsLoadingTable", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListTemplateVm: async ({ commit, dispatch }) => {
      const params = new URLSearchParams();
      params.append("pageSize", "10");
      params.append("page", "1");
      try {
        commit("setIsLoadingTable", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/template/vm/page?${params}`, makeHeaders());
        commit("setListTemplatesVm", response.data.payload.Results.VMRecord);
        commit("setTotalTemplatesVm", response.data.payload.Results.Total);
        commit("setIsLoadingTable", false);
      } catch (error) {
        commit("setIsLoadingTable", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    fetchListTemplateVm: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadingTable", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/template/vm/page?${payload}`, makeHeaders());
        commit("setListTemplatesVm", response.data.payload.Results.VMRecord);
        commit("setTotalTemplatesVm", response.data.payload.Results.Total);
        commit("setIsLoadingTable", false);
      } catch (error) {
        commit("setIsLoadingTable", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getDetailTemplates: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/template/vm/${payload.catalog}/${payload.id}`, makeHeaders());
        if (response.data.payload.VAppTemplate.NetworkConnectionSection.NetworkConnection == null) {
          commit("setDetailTemplates", []);
        } else {
          commit("setDetailTemplates", response.data.payload.VAppTemplate.NetworkConnectionSection.NetworkConnection);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getNetworkNics: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.idVdc}`, makeHeaders());
        let mapResp = []
        let respNet = response.data.payload?.Vdc?.AvailableNetworks[0]
        if(respNet.Network){
          mapResp = respNet.Network.map((a) => {
            return{
              text: a.Name,
              value: a.Name,
            }
          })
        }
        let net = [
          {text: 'NONE', value: 'none'},
          ...mapResp
        ]
        commit("setNetworkNics", net);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    createVm: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCreate", true);
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.id}/action/instantiateVmFromTemplate`,
          payload.body,
          makeHeaders()
        );
        commit("setResponseStatus", response.data.status);
        commit("setLoadingCreate", false);
        // dispatch("HOMEPAGE/showSuccessToast", `Instance has successfully created!`, { root: true });
        dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
        // dispatch("getListVm", payload.id);
        router.push("dp-instance");
        router.go(0);
      } catch (error) {
        commit("setLoadingCreate", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListStorage: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/api/org/${payload.org_id}/vdc/${payload.vdc_id}/orgVdcStoragePolicies/page`,
          makeHeaders()
        );
        commit("setListStorage", response.data.payload.values);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getDetailVm: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadingVdc", true);
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.id_vdc}/vapp/${payload.id_vapp}/vm/${payload.id_vm}`,
          makeHeaders()
        );
        commit("setIsLoadingVdc", false);
        commit("setDetailVm", response.data.payload.VM);
        commit("setDetailGuest", response.data.payload.VM.GuestCustomizationSection);
      } catch (error) {
        commit("setIsLoadingVdc", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },

    postTicket: async ({ commit, dispatch }, payload) => {
      try {
        // commit("setIsLoadingVdc", true);
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.id_vdc}/vm/${payload.id_vm}/acquire-mks-ticket`,
          payload,
          makeHeaders()
        );
        // commit("setIsLoadingVdc", false);
        commit("setDataTicket", response.data.payload);
        localStorage.setItem("ticketWs", JSON.stringify(response.data.payload));
      } catch (error) {
        localStorage.removeItem("ticketWs");
        commit("setDataTicket", {});
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },

    powerOff: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadingTable", true);
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.id_vdc}/vapp/${payload.id_vapp}/vm/${payload.id_vm}/power-off`,
          makeHeaders()
        );
        if (response.data.status == true) {
          commit("setIsLoadingTable", false);
          // dispatch("HOMEPAGE/showSuccessToast", `Instance has successfully turned off!`, { root: true });
          dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          setTimeout(() => {
            dispatch("getListVm", payload.id_vdc);
            router.go(0);
          }, 4000);
        }
      } catch (error) {
        commit("setIsLoadingTable", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },

    powerOn: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadingTable", true);
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.id_vdc}/vapp/${payload.id_vapp}/vm/${payload.id_vm}/power-on`,
          makeHeaders()
        );
        if (response.data.status == true) {
          commit("setIsLoadingTable", false);
          // dispatch("HOMEPAGE/showSuccessToast", `Instance has successfully turned on!`, { root: true });
          dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          setTimeout(() => {
            dispatch("getListVm", payload.id_vdc);
            router.go(0);
          }, 4000);
        }
      } catch (error) {
        commit("setIsLoadingTable", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    powerOnForce: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadingTable", true);
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.id_vdc}/vapp/${payload.id_vapp}/vm/${payload.id_vm}/power-on-and-force-customization`,
          makeHeaders()
        );
        if (response.data.status == true) {
          commit("setIsLoadingTable", false);
          // dispatch("HOMEPAGE/showSuccessToast", `Instance has successfully turned on with force recustomization!`, { root: true });
          dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          setTimeout(() => {
            dispatch("getListVm", payload.id_vdc);
            router.go(0);
          }, 4000);
        }
      } catch (error) {
        commit("setIsLoadingTable", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    deleteInstance: async(context, payload) => {
			try{
        context.commit('setIsLoadingTable', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.id_vdc}/vapp/${payload.id_vapp}/vm/${payload.id_vm}`

        const response = await axios.delete(`${API}`, makeHeaders())
        // console.log(resp)
        if (response.data.status == true) {
          context.commit("setIsLoadingTable", false);
          // context.dispatch("HOMEPAGE/showSuccessToast", `Instance has successfully deleted`, { root: true });
          context.dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          setTimeout(() => {
            context.dispatch("getListVm", payload.id_vdc);
            router.go(0);
          }, 4000);
        }     
				return response.data
      }catch(e){
          context.commit('setIsLoadingTable', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    deleteVM: async(context, payload) => {
			try{
        context.commit('setIsLoadingBtn', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/provider/organization/${payload.id_org}/vm/${payload.id_vm}`

        const response = await axios.delete(`${API}`, makeHeadersSuper())
        // console.log(resp)
        if (response.data.status == true) {
          setTimeout(() => {
            context.commit("setIsLoadingBtn", false);
            // context.dispatch("HOMEPAGE/showSuccessToast", `Instance has successfully deleted`, { root: true });
            context.dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
            context.dispatch("getListVm", payload.id_vdc);
            // router.go(0);
          }, 4000);
        }     
				return response.data
      }catch(e){
          context.commit('setIsLoadingBtn', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
    setGuestCustomization: async ({ commit, dispatch }, payload) => {
      try {
        commit("setUpdateCustomization", true);
        commit("setStatusUpdate", false);
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.id.id_vdc}/vapp/${payload.id.id_vapp}/vm/${payload.id.id_vm}/set-guest-customization-section`,
          payload.body,
          makeHeaders()
        );
        if (response.data.status == true) {
          commit("setStatusUpdate", response.data.status);
          commit("setUpdateCustomization", false);
          // dispatch("HOMEPAGE/showSuccessToast", `Guest properties has successfully updated!`, { root: true });
          dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          dispatch("getDetailVm", payload.id);
        }
      } catch (error) {
        commit("setUpdateCustomization", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    updateNics: async ({ commit, dispatch }, payload) => {
      try {
        commit('setIsLoadingBtn', true)
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.id.id_vdc}/vapp/${payload.id.id_vapp}/vm/${payload.id.id_vm}/update-network-connection-section`,
          payload.body,
          makeHeaders()
        );
        if (response.data.status == true) {
          commit('setIsLoadingBtn', false)
          // dispatch("HOMEPAGE/showSuccessToast", `Update NICs on Proccess`, { root: true });
          dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          dispatch("getDetailVm", payload.id);
        }
      } catch (error) {
        commit('setIsLoadingBtn', false)
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getDialogPermissionDekaPrime: async ({ commit }) => {
      commit("DASHBOARD/setOpenDialogDekaPrime", true, { root: true });
    },
  },
};

export default store;
