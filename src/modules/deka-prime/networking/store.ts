import { ActionContext, Module } from "vuex";
import axios from "axios";
import router from "@/lib/router";

function makeHeaders() {
  const params = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
  return {
    headers: { Authorization: `Bearer ${params.token}` },
  };
}

interface state {
  listNetwork: Array<any>;
  edgeConnection: Array<any>;
  listEdge: Array<any>;
  isLoadingNetwork: Boolean;
  totalNetwork: Number;
  isLoadingCreate: Boolean;
  loadingObject: Boolean;
  statusCreate: Boolean;
  loadingEdge: Boolean;
  detailAllEdge: Object;
  dataVdcEdge: Array<any>;
  listRuleFirewall: Array<any>;
  listRuleNat: Array<any>;
  listStaticRoute: Array<any>;
  listObject: Array<any>;
  payloadRuleFirewall: Object;
  loadingRule: Boolean;
  detailNetwork: Object;
  detailSubnets: Object;
  detailVdc: Object;
  detailOrg: Object;
  detailConnection: Object;
  connectionRef: Object;
  loadingUpdate: Boolean;
  detailInstance: Object;
  isLoadingDelete: Boolean;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    listNetwork: [],
    isLoadingNetwork: false,
    totalNetwork: 0,
    edgeConnection: [],
    isLoadingCreate: false,
    loadingObject: false,
    statusCreate: false,
    listEdge: [],
    loadingEdge: false,
    detailAllEdge: {},
    dataVdcEdge: [],
    listRuleFirewall: [],
    listRuleNat: [],
    listStaticRoute: [],
    listObject: [],
    payloadRuleFirewall: [],
    loadingRule: false,
    detailNetwork: {},
    detailSubnets: {},
    detailVdc: {},
    detailOrg: {},
    detailConnection: {},
    connectionRef: {},
    loadingUpdate: false,
    detailInstance: {},
    isLoadingDelete: false,
  },
  getters: {
    listNetwork: (state) => {
      return state.listNetwork;
    },
    isLoadingNetwork: (state) => {
      return state.isLoadingNetwork;
    },
    totalNetwork: (state) => {
      return state.totalNetwork;
    },
    edgeConnection: (state) => {
      return state.edgeConnection;
    },
    isLoadingCreate: (state) => {
      return state.isLoadingCreate;
    },
    isLoadingDelete: (state) => {
      return state.isLoadingDelete;
    },
    loadingObject: (state) => {
      return state.loadingObject;
    },
    statusCreate: (state) => {
      return state.statusCreate;
    },
    listEdge: (state) => {
      return state.listEdge;
    },
    loadingEdge: (state) => {
      return state.loadingEdge;
    },
    detailAllEdge: (state) => {
      return state.detailAllEdge;
    },
    dataVdcEdge: (state) => {
      return state.dataVdcEdge;
    },
    listRuleFirewall: (state) => {
      return state.listRuleFirewall;
    },
    listRuleNat: (state) => {
      return state.listRuleNat;
    },
    listStaticRoute: (state) => {
      return state.listStaticRoute;
    },
    listObject: (state) => {
      return state.listObject;
    },
    payloadRuleFirewall: (state) => {
      return state.payloadRuleFirewall;
    },
    loadingRule: (state) => {
      return state.loadingRule;
    },
    detailNetwork: (state) => {
      return state.detailNetwork;
    },
    detailSubnets: (state) => {
      return state.detailSubnets;
    },
    detailVdc: (state) => {
      return state.detailVdc;
    },
    detailOrg: (state) => {
      return state.detailOrg;
    },
    detailConnection: (state) => {
      return state.detailConnection;
    },
    connectionRef: (state) => {
      return state.connectionRef;
    },
    loadingUpdate: (state) => {
      return state.loadingUpdate;
    },
    detailInstance: (state) => {
      return state.detailInstance;
    },
  },
  mutations: {
    setListNetwork: (state: state, payload) => {
      state.listNetwork = payload;
    },
    setIsLoadingNetwork: (state: state, payload) => {
      state.isLoadingNetwork = payload;
    },
    setTotalNetwork: (state: state, payload) => {
      state.totalNetwork = payload;
    },
    setEdgeConnection: (state: state, payload) => {
      state.edgeConnection = payload;
    },
    setIsLoadingCreate: (state: state, payload) => {
      state.isLoadingCreate = payload;
    },
    setLoadingObject: (state: state, payload) => {
      state.loadingObject = payload;
    },
    setStatusCreate: (state: state, payload) => {
      state.statusCreate = payload;
    },
    setListEdge: (state: state, payload) => {
      state.listEdge = payload;
    },
    setLoadingEdge: (state: state, payload) => {
      state.loadingEdge = payload;
    },
    setDetailAllEdge: (state: state, payload) => {
      state.detailAllEdge = payload;
    },
    setDataVdcEdge: (state: state, payload) => {
      state.dataVdcEdge = payload;
    },
    setListRuleFirewall: (state: state, payload) => {
      state.listRuleFirewall = payload;
    },
    setListRuleNat: (state: state, payload) => {
      state.listRuleNat = payload;
    },
    setListStaticRoute: (state: state, payload) => {
      state.listStaticRoute = payload;
    },
    setListObject: (state: state, payload) => {
      state.listObject = payload;
    },
    setPayloadRuleFirewall: (state: state, payload) => {
      state.payloadRuleFirewall = payload;
    },
    setLoadingRule: (state: state, payload) => {
      state.loadingRule = payload;
    },
    setLoadingDelete: (state: state, payload) => {
      state.isLoadingDelete = payload;
    },
    setDetailNetwork: (state: state, payload) => {
      state.detailNetwork = payload;
    },
    setDetailSubnets: (state: state, payload) => {
      state.detailSubnets = payload;
    },
    setDetailVdc: (state: state, payload) => {
      state.detailVdc = payload;
    },
    setDetailOrg: (state: state, payload) => {
      state.detailOrg = payload;
    },
    setDetailConnection: (state: state, payload) => {
      state.detailConnection = payload;
    },
    setConnectionRef: (state: state, payload) => {
      state.connectionRef = payload;
    },
    setLoadingUpdate: (state: state, payload) => {
      state.loadingUpdate = payload;
    },
    setDetailInstance: (state: state, payload) => {
      state.detailInstance = payload;
    },
  },
  actions: {
    refresh: async ({ dispatch }) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/refresh-token`, makeHeaders());
        localStorage.setItem("dekaPrime", JSON.stringify(response.data.payload));
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListNetwork: async ({ commit, dispatch }) => {
      const payload = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      const params = new URLSearchParams();
      params.append("pageSize", "10");
      params.append("page", "1");
      try {
        commit("setIsLoadingNetwork", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.vmwareProjectId}/network/page?${params}`, makeHeaders());
        if (response.data.status == true) {
          commit("setListNetwork", response.data.payload.values);
          commit("setTotalNetwork", response.data.payload.resultTotal);
          commit("setIsLoadingNetwork", false);
        }
      } catch (error) {
        commit("setListNetwork", []);
        commit("setIsLoadingNetwork", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    fetchListNetwork: async ({ commit, dispatch }, payload) => {
      const id = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      try {
        commit("setIsLoadingNetwork", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${id.vmwareProjectId}/network/page?${payload}`, makeHeaders());
        if (response.data.status == true) {
          commit("setListNetwork", response.data.payload.values);
          commit("setTotalNetwork", response.data.payload.resultTotal);
          commit("setIsLoadingNetwork", false);
        }
      } catch (error) {
        commit("setListNetwork", []);
        commit("setIsLoadingNetwork", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getEdgeConnection: async ({ commit, dispatch }, payload) => {
      const params = new URLSearchParams();
      params.append("pageSize", "10");
      params.append("page", "1");
      try {
        commit("setEdgeConnection", []);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/page?${params}`, makeHeaders());
        if (response.data.status == true) {
          const hasil = response.data.payload.Results.EdgeGatewayRecord;
          const newEdge = hasil.filter((elem: any) => {
            return elem.OrgVdcName == payload;
          });
          commit("setEdgeConnection", newEdge);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    postCreateNetwork: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadingCreate", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/network`, payload, makeHeaders());
        if (response.data.status == true) {
          commit("setStatusCreate", response.data.status);
          // dispatch("HOMEPAGE/showSuccessToast", `Successfully create Network`, { root: true });
          dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          commit("setIsLoadingCreate", false);
          router.push("networking");
          router.go(0);
        }
      } catch (error) {
        commit("setIsLoadingCreate", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },

    getListEdge: async ({ commit, dispatch }) => {
      const params = new URLSearchParams();
      params.append("pageSize", "10");
      params.append("page", "1");
      try {
        commit("setLoadingEdge", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/page?${params}`, makeHeaders());
        commit("setListEdge", response.data.payload.Results.EdgeGatewayRecord);
        commit("setLoadingEdge", false);
      } catch (error) {
        commit("setLoadingEdge", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getAllDetailEdge: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.idVdc}/edgegateway/${payload.idEdge}`, makeHeaders());
        commit("setDetailAllEdge", response.data.payload.EdgeGateway);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getVdcEdge: async ({ commit, dispatch }, payload) => {
      const params = new URLSearchParams();
      params.append("pageSize", "10");
      params.append("page", "1");
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload}/edgegateway/page?${params}`, makeHeaders());
        commit("setDataVdcEdge", response.data.payload.values);
        console.log("setDataVdcEdge", response.data.payload.values);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListFirewallRule: async ({ commit, dispatch }, payload) => {
      console.log("get list rule", payload);
      try {
        // commit("setListRuleFirewall", []);
        commit("setLoadingRule", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/${payload}/firewall/config`, makeHeaders());
        commit("setListRuleFirewall", response.data.payload.firewallRules.firewallRules);
        commit("setPayloadRuleFirewall", response.data.payload);
        commit("setLoadingRule", false);
      } catch (error) {
        commit("setLoadingRule", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    updateRuleFirewall: async ({ dispatch }, payload) => {
      try {
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/${payload.id}/firewall/config`,
          payload.params,
          makeHeaders()
        );
        if (response.data.status == true) {
          setTimeout(() => {
            dispatch("getListFirewallRule", payload.id);
            // dispatch("HOMEPAGE/showSuccessToast", `Successfully add Rule`, { root: true });
            dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          }, 2000);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListNatRule: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/${payload}/nat/config`, makeHeaders());
        commit("setListRuleNat", response.data.payload.rules.natRulesDtos);
        console.log("setNat", response.data.payload.rules.natRulesDtos);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },

    getListStaticRoute: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/${payload}/routing/config`, makeHeaders());
        commit("setListStaticRoute", response.data.payload.staticRouting.staticRoutes.staticRoutes);
        console.log("list routing", response.data.payload.staticRouting.staticRoutes.staticRoutes);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getObjectBrowser: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingObject", true);
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/objectbrowser/edges/${payload.idEdge}/${payload.object}/page`,
          makeHeaders()
        );
        commit("setListObject", response.data.payload.results);
        commit("setLoadingObject", false);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setLoadingObject", false);
      }
    },
    getDetailNetwork: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingObject", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/network/${payload}`, makeHeaders());
        commit("setDetailNetwork", response.data.payload);
        commit("setDetailSubnets", Object.assign({}, ...response.data.payload.subnets.values));
        commit("setDetailVdc", response.data.payload.orgVdc);
        commit("setDetailOrg", response.data.payload.orgRef);
        commit("setDetailConnection", response.data.payload.connection ? response.data.payload.connection : {});
        commit("setConnectionRef", response.data.payload.connection.routerRef);
        commit("setLoadingObject", false);
      } catch (error) {
        commit("setLoadingObject", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    updateNetwork: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingUpdate", true);
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/network/${payload.id}`, payload, makeHeaders());
        if (response.data.status == true) {
          // dispatch("HOMEPAGE/showSuccessToast", `Successfully update Network`, { root: true });
          dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          commit("setLoadingUpdate", false);
          router.push("/networking");
          router.go(0);
        }
      } catch (error) {
        commit("setLoadingUpdate", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getDetailInstance: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload}`, makeHeaders());
        commit("setDetailInstance", response.data.payload.Vdc);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    deleteNetwork: async(context, payload) => {
			try{
        context.commit('setLoadingDelete', true)
        let API = `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.id_vdc}/network/${payload.id_network}`

        const response = await axios.delete(`${API}`, makeHeaders())
        // console.log(resp)
        if (response.data.status == true) {
          context.commit("setLoadingDelete", false);
          // context.dispatch("HOMEPAGE/showSuccessToast", `Network has successfully deleted`, { root: true });
          context.dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          setTimeout(() => {
            context.dispatch("getListNetwork");
            router.go(0);
          }, 4000);
        }     
				return response.data
      }catch(e){
          context.commit('setLoadingDelete', false)  
          context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
          return e.response.data.responseMessage
      }
		},
  },
};

export default store;
