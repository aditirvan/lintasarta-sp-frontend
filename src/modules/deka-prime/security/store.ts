import { Module } from "vuex";
import axios from "axios";
import router from "@/lib/router";

function makeHeaders() {
  const params = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
  return {
    headers: { Authorization: `Bearer ${params.token}` },
  };
}

interface state {
  listEdge: Array<any>;
  loadingEdge: Boolean;
  detailAllEdge: Object;
  detailAllEdgeNsxt: Object;
  orgVdc: Object;
  orgRef: Object;
  dataVdcEdge: Object;
  listRuleNatNsxv: Array<any>;
  listRuleNatNsxt: Array<any>;
  listRuleFirewallNsxv: Array<any>;
  listRuleFirewallNsxt: Array<any>;
  payloadRuleFirewallNsxv: Object;
  payloadRuleFirewallNsxt: Object;
  loadingRule: Boolean;
  listStaticRoute: Array<any>;
  listObject: Array<any>;
  loadingObject: Boolean;
  payloadRuleNat: Object;
  payloadStaticRoute: Object;
  loadingNat: Boolean;
  loadingRoute: Boolean;
  detailFirewall: Object;
  loadFirewall: Boolean;
  loadUpdate: Boolean;
  listIpObject: Array<any>;
  statusRoute: Boolean;
  rowFirewallNsxt: Object;
  listApplications: Array<any>;
  rowsApplication: Number;
  isLoadingApplications: Boolean;
  listSummary: Array<any>;
  rowsSummary: Number;
  isLoadingSummary: Boolean;
  isLoadingBtn: Boolean;
  listIpset: Array<any>;
  rowsIpset: Number;
  isLoadingIpset: Boolean;
  listIpsetById: Object;
  listIpUsage: Array<any>;
  totalIpUsage: Number;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    listEdge: [],
    loadingEdge: false,
    detailAllEdge: {},
    detailAllEdgeNsxt: {},
    orgVdc: {},
    orgRef: {},
    dataVdcEdge: {},
    listRuleNatNsxv: [],
    listRuleNatNsxt: [],
    listRuleFirewallNsxv: [],
    listRuleFirewallNsxt: [],
    payloadRuleFirewallNsxv: {},
    payloadRuleFirewallNsxt: {},
    loadingRule: false,
    listStaticRoute: [],
    listObject: [],
    loadingObject: false,
    payloadRuleNat: {},
    loadingNat: false,
    loadingRoute: false,
    payloadStaticRoute: {},
    detailFirewall: {},
    loadFirewall: false,
    loadUpdate: false,
    listIpObject: [],
    statusRoute: false,
    rowFirewallNsxt: {},
    listApplications: [],
    rowsApplication: 0,
    isLoadingApplications: false,
    listSummary: [],
    rowsSummary: 0,
    isLoadingSummary: false,
    isLoadingBtn: false,
    listIpset: [],
    rowsIpset: 0,
    isLoadingIpset: false,
    listIpsetById: {},
    listIpUsage: [],
    totalIpUsage: 0,
  },
  getters: {
    listEdge: (state) => {
      return state.listEdge;
    },
    loadingEdge: (state) => {
      return state.loadingEdge;
    },
    detailAllEdge: (state) => {
      return state.detailAllEdge;
    },
    detailAllEdgeNsxt: (state) => {
      return state.detailAllEdgeNsxt;
    },
    dataVdcEdge: (state) => {
      return state.dataVdcEdge;
    },
    listRuleNatNsxv: (state) => {
      return state.listRuleNatNsxv;
    },
    listRuleNatNsxt: (state) => {
      return state.listRuleNatNsxt;
    },
    listRuleFirewallNsxv: (state) => {
      return state.listRuleFirewallNsxv;
    },
    listRuleFirewallNsxt: (state) => {
      return state.listRuleFirewallNsxt;
    },
    payloadRuleFirewallNsxv: (state) => {
      return state.payloadRuleFirewallNsxv;
    },
    payloadRuleFirewallNsxt: (state) => {
      return state.payloadRuleFirewallNsxt;
    },
    loadingRule: (state) => {
      return state.loadingRule;
    },
    listStaticRoute: (state) => {
      return state.listStaticRoute;
    },
    orgVdc: (state) => {
      return state.orgVdc;
    },
    orgRef: (state) => {
      return state.orgRef;
    },
    listObject: (state) => {
      return state.listObject;
    },
    loadingObject: (state) => {
      return state.loadingObject;
    },
    payloadRuleNat: (state) => {
      return state.payloadRuleNat;
    },
    loadingNat: (state) => {
      return state.loadingNat;
    },
    loadingRoute: (state) => {
      return state.loadingRoute;
    },
    payloadStaticRoute: (state) => {
      return state.payloadStaticRoute;
    },
    detailFirewall: (state) => {
      return state.detailFirewall;
    },
    loadFirewall: (state) => {
      return state.loadFirewall;
    },
    loadUpdate: (state) => {
      return state.loadUpdate;
    },
    listIpObject: (state) => {
      return state.listIpObject;
    },
    statusRoute: (state) => {
      return state.statusRoute;
    },
    rowFirewallNsxt: state => state.rowFirewallNsxt,
    listApplications: state => state.listApplications,
    rowsApplications: state => state.rowsApplication,
    isLoadingApplications: state => state.isLoadingApplications,
    listSummary: state => state.listSummary,
    rowsSummary: state => state.rowsSummary,
    isLoadingSummary: state => state.isLoadingSummary,
    isLoadingBtn: state => state.isLoadingBtn,
    listIpset: state => state.listIpset,
    rowsIpset: state => state.rowsIpset,
    isLoadingIpset: state => state.isLoadingIpset,
    listIpsetById: state => state.listIpsetById,
    listIpUsage: state => state.listIpUsage,
    totalIpUsage: state => state.totalIpUsage,
  },
  mutations: {
    setListEdge: (state: state, payload) => {
      state.listEdge = payload;
    },
    setLoadingEdge: (state: state, payload) => {
      state.loadingEdge = payload;
    },
    setDetailAllEdge: (state: state, payload) => {
      state.detailAllEdge = payload;
    },
    setDetailAllEdgeNsxt: (state: state, payload) => {
      state.detailAllEdgeNsxt = payload;
    },
    setDataVdcEdge: (state: state, payload) => {
      state.dataVdcEdge = payload;
    },
    setListRuleNat: (state: state, payload) => {
      state.listRuleNatNsxv = payload;
    },
    setListRuleNatNsxt: (state: state, payload) => {
      state.listRuleNatNsxt = payload;
    },
    setListRuleFirewall: (state: state, payload) => {
      state.listRuleFirewallNsxv = payload;
    },
    setListRuleFirewallNsxt: (state: state, payload) => {
      state.listRuleFirewallNsxt = payload;
    },
    setPayloadRuleFirewall: (state: state, payload) => {
      state.payloadRuleFirewallNsxv = payload;
    },
    setPayloadRuleFirewallNsxt: (state: state, payload) => {
      state.payloadRuleFirewallNsxt = payload;
    },
    setLoadingRule: (state: state, payload) => {
      state.loadingRule = payload;
    },
    setListStaticRoute: (state: state, payload) => {
      state.listStaticRoute = payload;
    },
    setOrgVdc: (state: state, payload) => {
      state.orgVdc = payload;
    },
    setOrgRef: (state: state, payload) => {
      state.orgRef = payload;
    },
    setListObject: (state: state, payload) => {
      state.listObject = payload;
    },
    setLoadingObject: (state: state, payload) => {
      state.loadingObject = payload;
    },
    setPayloadRuleNat: (state: state, payload) => {
      state.payloadRuleNat = payload;
    },
    setLoadingNat: (state: state, payload) => {
      state.loadingNat = payload;
    },
    setLoadingRoute: (state: state, payload) => {
      state.loadingRoute = payload;
    },
    setPayloadStaticRoute: (state: state, payload) => {
      state.payloadStaticRoute = payload;
    },
    setDetailFirewall: (state: state, payload) => {
      state.detailFirewall = payload;
    },
    setLoadFirewall: (state: state, payload) => {
      state.loadFirewall = payload;
    },
    setLoadUpdate: (state: state, payload) => {
      state.loadUpdate = payload;
    },
    setListIpObject: (state: state, payload) => {
      state.listIpObject = payload;
    },
    setStatusRoute: (state: state, payload) => {
      state.statusRoute = payload;
    },
    setRowFirewallNsxt: (state: state, payload) => {
      state.rowFirewallNsxt = payload
    },
    setlistApplications: (state: state, payload) => {
      state.listApplications = payload
    },
    setRowsApplication: (state: state, payload) => {
      state.rowsApplication = payload
    },
    setIsLoadingApplications: (state: state, payload) => {
      state.isLoadingApplications = payload
    },
    setlistSummary: (state: state, payload) => {
      state.listSummary = payload
    },
    setRowsSummary: (state: state, payload) => {
      state.rowsSummary = payload
    },
    setIsLoadingSummary: (state: state, payload) => {
      state.isLoadingSummary = payload
    },
    setisLoadingBtn: (state: state, payload) => {
      state.isLoadingBtn = payload
    },
    setListIpset: (state: state, payload) => {
      state.listIpset = payload
    },
    setListIpsetById: (state: state, payload) => {
      state.listIpsetById = payload
    },
    setRowsIpset: (state: state, payload) => {
      state.rowsIpset = payload
    },
    setIsLoadingIpset: (state: state, payload) => {
      state.isLoadingIpset = payload
    },
    setListIpUsage: (state: state, payload) => {
      state.listIpUsage = payload
    },
    setTotalIpUsage: (state: state, payload) => {
      state.totalIpUsage = payload
    },
  },
  actions: {
    getListEdge: async ({ commit, dispatch }) => {
      const payload = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      const params = new URLSearchParams();
      params.append("pageSize", "10");
      params.append("page", "1");
      try {
        commit("setLoadingEdge", true);
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.vmwareProjectId}/edgegateway/page?${params}`,
          makeHeaders()
        );
        commit("setListEdge", response.data.payload.values);
        commit("setLoadingEdge", false);
      } catch (error) {
        commit("setListEdge", []);
        commit("setLoadingEdge", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getAllDetailEdgeNsxv: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/vdc/${payload.idVdc}/edgegateway/nsxv/${payload.idEdge}`, makeHeaders());
        commit("setDetailAllEdge", response.data.payload.EdgeGateway);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    // NSXT
    getAllDetailEdgeNsxt: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${payload.idEdge}`, makeHeaders());
        commit("setDetailAllEdgeNsxt", response.data.payload);
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
        commit("setDataVdcEdge", Object.assign({}, ...response.data.payload.values));
        commit("setOrgVdc", Object.assign({}, ...response.data.payload.values).orgVdc);
        commit("setOrgRef", Object.assign({}, ...response.data.payload.values).orgRef);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListNatRuleNsxv: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingNat", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxv/${payload}/nat/config`, makeHeaders());
        commit("setListRuleNat", response.data.payload.rules.natRulesDtos ? response.data.payload.rules.natRulesDtos : []);
        commit("setPayloadRuleNat", response.data.payload);
        commit("setLoadingNat", false);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setLoadingNat", false);
      }
    },
    // NSXT
    getListNatRuleNsxt: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingNat", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${payload}/nat/rules`, makeHeaders());
        commit("setListRuleNatNsxt", response.data.payload.values);
        commit("setPayloadRuleNat", response.data.payload);
        commit("setLoadingNat", false);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setLoadingNat", false);
      }
    },
    getListFirewallRuleNsxv: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingRule", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxv/${payload}/firewall/config`, makeHeaders());
        commit("setListRuleFirewall", response.data.payload.firewallRules.firewallRules);
        commit("setPayloadRuleFirewall", response.data.payload);
        commit("setLoadingRule", false);
      } catch (error) {
        commit("setLoadingRule", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    // NSXT
    getListFirewallRuleNsxt: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingRule", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${payload}/firewall/rules`, makeHeaders());
        let dataRules = []
        dataRules = response.data.payload.userDefinedRules ? response.data.payload.userDefinedRules : []
        dataRules.push(...response.data.payload.defaultRules)
        commit("setListRuleFirewallNsxt", dataRules);
        commit("setPayloadRuleFirewallNsxt", response.data.payload);
        commit("setLoadingRule", false);
      } catch (error) {
        commit("setLoadingRule", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListStaticRouteNsxv: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingRoute", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxv/${payload}/routing/config`, makeHeaders());
        commit("setListStaticRoute", response.data.payload.staticRouting.staticRoutes.staticRoutes);
        commit("setPayloadStaticRoute", response.data.payload.staticRouting);
        commit("setLoadingRoute", false);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setLoadingRoute", false);
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
    getListIpUsage: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingRule", true);
        commit("setListIpUsage", []);
        commit("setTotalIpUsage", 0);

        const params = new URLSearchParams();
        params.append("page", payload.page);
        params.append("pageSize", payload.itemsPerPage);
        payload.idEdge ? params.append("filter", `(gatewayId==${payload.idEdge})`) : ''
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/query/gateway-uplinks/page?${params}`, makeHeaders());
        commit("setListIpUsage", response.data.payload.record ? response.data.payload.record : []);
        commit("setTotalIpUsage", response.data.payload.total);
        // setTotalIpUsage
        commit("setLoadingRule", false);
      } catch (error) {
        commit("setLoadingRule", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    updateRuleFirewallNsxv: async ({ dispatch }, payload) => {
      try {
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxv/${payload.id}/firewall/config`,
          payload.params,
          makeHeaders()
        );
        if (response.data.status == true) {
          setTimeout(() => {
            dispatch("getListFirewallRuleNsxv", payload.id);
            // dispatch("HOMEPAGE/showSuccessToast", `Successfully update Rule`, { root: true });
            dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          }, 2000);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    // NSXT
    updateRuleFirewallNsxt: async ({ commit, dispatch }, payload) => {
      try {
        commit('setisLoadingBtn', true)
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${payload.id}/firewall/rules`,
          payload.params,
          makeHeaders()
        );
        if (response.data.status == true) {
          commit('setisLoadingBtn', false)
          setTimeout(() => {
            dispatch("getListFirewallRuleNsxt", payload.id);
            // dispatch("HOMEPAGE/showSuccessToast", `Successfully update Rule`, { root: true });
            dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          }, 2000);
        }
      } catch (error) {
        commit('setisLoadingBtn', false)
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    updateRuleNatNsxv: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingNat", true);
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxv/${payload.id}/nat/config`, payload.params, makeHeaders());
        if (response.data.status == true) {
          setTimeout(() => {
            dispatch("getListNatRuleNsxv", payload.id);
            // dispatch("HOMEPAGE/showSuccessToast", `Successfully update Nat Rule`, { root: true });
            dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          }, 3500);
          commit("setLoadingNat", false);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setLoadingNat", false);
      }
    },
    // NSXT
    createRuleNatNsxt: async ({ commit, dispatch }, payload) => {
      try {
        commit("setisLoadingBtn", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${payload.id}/nat/rules`, payload.params, makeHeaders());
        if (response.data.status == true) {
          setTimeout(() => {
            dispatch("getListNatRuleNsxt", payload.id);
            // dispatch("HOMEPAGE/showSuccessToast", `Successfully Add Nat Rule`, { root: true });
            dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          }, 3500);
          commit("setisLoadingBtn", false);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setisLoadingBtn", false);
      }
    },
    // NSXT
    deleteRuleNatNsxt: async ({ commit, dispatch }, payload) => {
      try {
        commit("setisLoadingBtn", true);
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${payload.edgeId}/nat/rules/${payload.ruleId}`, makeHeaders());
        if (response.data.status == true) {
          setTimeout(() => {
            dispatch("getListNatRuleNsxt", payload.edgeId);
            // dispatch("HOMEPAGE/showSuccessToast", `Successfully Delete Nat Rule`, { root: true });
            dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          }, 3500);
          commit("setisLoadingBtn", false);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setisLoadingBtn", false);
      }
    },
    // NSXT
    updateRuleNatNsxt: async ({ commit, dispatch }, payload) => {
      try {
        commit("setisLoadingBtn", true);
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${payload.edgeId}/nat/rules/${payload.ruleId}`, payload.params, makeHeaders());
        if (response.data.status == true) {
          setTimeout(() => {
            dispatch("getListNatRuleNsxt", payload.edgeId);
            // dispatch("HOMEPAGE/showSuccessToast", `Successfully Update Nat Rule`, { root: true });
            dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          }, 3500);
          commit("setisLoadingBtn", false);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setisLoadingBtn", false);
      }
    },
    // NSXT
    fetchIpset: async ({ commit, dispatch }, payload) => {
      // const payload = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      const { page, itemsPerPage, idEdge } = payload;
      try {
        commit("setIsLoadingIpset", true);
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${idEdge}/ipset?pageSize=${itemsPerPage ?? 10}&page=${page ?? 1}`,
          makeHeaders()
        );
        commit("setListIpset", response.data.payload.values);
        commit("setRowsIpset", response.data.payload.resultTotal)
        commit("setIsLoadingIpset", false);
      } catch (error) {
        commit("setListIpset", []);
        commit("setIsLoadingIpset", false)
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    fetchIpsetById: async ({ commit, dispatch }, payload) => {
      // const payload = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      const { idEdge, ipsetId } = payload;
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${idEdge}/ipset/${ipsetId}`,
          makeHeaders()
        );
        commit("setListIpsetById", response.data.payload);
      } catch (error) {
        commit("setListIpsetById", []);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    // NSXT
    createIpsetNsxt: async ({ commit, dispatch }, payload) => {
      try {
        commit("setisLoadingBtn", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${payload.idEdge}/ipset`, payload.params, makeHeaders());
        if (response.data.status == true) {
          setTimeout(() => {
            dispatch("fetchIpset", { page: 1, itemsPerPage: 10, idEdge: payload.idEdge });
            // dispatch("HOMEPAGE/showSuccessToast", `Successfully Add IP Set`, { root: true });
            dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          }, 3500);
          commit("setisLoadingBtn", false);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setisLoadingBtn", false);
      }
    },
    // NSXT
    deleteIpsetNsxt: async ({ commit, dispatch }, payload) => {
      try {
        commit("setisLoadingBtn", true);
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${payload.edgeId}/ipset/${payload.ipsetId}`, makeHeaders());
        if (response.data.status == true) {
          let r
          let status
          commit("setisLoadingBtn", false);
          let proces = setInterval(async () => {
            r = await axios.get(
              `${process.env.VUE_APP_API_BASE_URL}/dekaprime/task/page?page=1&pageSize=50`,
              makeHeaders()
            );
            status = r.data.status
            if (status) {
              if (r.data.payload.record.length == 0) {
                clearInterval(proces)
              } else {
                let a = r.data.payload.record.find((x) => x.operationFull.includes(payload.ipsetId))
                if (a.status != 'running') {
                  if (a.status == 'error') {
                    const message = a.message.split(']')
                    dispatch("fetchIpset", { page: 1, itemsPerPage: 10, idEdge: payload.idEdge });
                    dispatch("HOMEPAGE/showErrorToast", message.length === 2 ? message[1] : a.message, { root: true });
                  } else if (a.status == 'success') {
                    dispatch("fetchIpset", { page: 1, itemsPerPage: 10, idEdge: payload.idEdge });
                    dispatch("HOMEPAGE/showSuccessToast", `Successfully Delete IP Set`, { root: true });
                  }
                  clearInterval(proces)
                }
              }
            }
          }, 2000)
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setisLoadingBtn", false);
      }
    },
    // NSXT
    updateIpsetNsxt: async ({ commit, dispatch }, payload) => {
      try {
        commit("setisLoadingBtn", true);
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${payload.idEdge}/ipset/${payload.ipsetId}`, payload.params, makeHeaders());
        if (response.data.status == true) {
          setTimeout(() => {
            dispatch("fetchIpset", { page: 1, itemsPerPage: 10, idEdge: payload.idEdge });
            // dispatch("HOMEPAGE/showSuccessToast", `Successfully Update IP Set`, { root: true });
            dispatch("HOMEPAGE/showSuccessToast", `response.data.responseMessage`, { root: true });
          }, 3500);
          commit("setisLoadingBtn", false);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setisLoadingBtn", false);
      }
    },
    updateStaticRoutesNsxv: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingRoute", true);
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxv/${payload.id}/routing/config/static`,
          payload.params,
          makeHeaders()
        );
        if (response.data.status == true) {
          setTimeout(() => {
            commit("setStatusRoute", response.data.status);
            // dispatch("HOMEPAGE/showSuccessToast", `Successfully update Static Routes`, { root: true });
            dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
            dispatch("getListStaticRouteNsxv", payload.id);
          }, 2000);
          commit("setLoadingRoute", false);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setLoadingRoute", false);
      }
    },

    getDetailFirewallNsxv: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadFirewall", true);
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxv/${payload.idEdge}/firewall/config/rules/${payload.idRule}`,
          makeHeaders()
        );

        let destination =  {
          vnicGroupId: [],
          groupingObjectId: [],
          ipAddress: [],
        }
        let source = {
          vnicGroupId: [],
          groupingObjectId: [],
          ipAddress: [],
        }
        let service = {
          service: []
        }
        let application = service

        if(response.data.payload.destination){
          if(response.data.payload.destination.vnicGroupId){
            destination.vnicGroupId = response.data.payload.destination.vnicGroupId 
          }
          if(response.data.payload.destination.groupingObjectId){
            destination.groupingObjectId = response.data.payload.destination.groupingObjectId
          }
          if(response.data.payload.destination.ipAddress){
            destination.ipAddress = response.data.payload.destination.ipAddress
          }
          // destination = { ...response.data.payload.destination }
        }
        if(response.data.payload.source){
          if(response.data.payload.source.vnicGroupId){
            source.vnicGroupId = response.data.payload.source.vnicGroupId 
          }
          if(response.data.payload.source.groupingObjectId){
            source.groupingObjectId = response.data.payload.source.groupingObjectId
          }
          if(response.data.payload.source.ipAddress){
            source.ipAddress = response.data.payload.source.ipAddress
          }
          // source = { ...response.data.payload.source }
        }
        if(response.data.payload.application){
          application = { ...response.data.payload.application  }
        }

        commit("setDetailFirewall", 
          {
            ...response.data.payload,
            destination,
            source,
            application
          }
        );
        commit("setLoadFirewall", false);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setLoadFirewall", false);
      }
    },

    updateDetailRuleNsxv: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadUpdate", true);
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxv/${payload.id.idEdge}/firewall/config/rules/${payload.id.idRule}`,
          payload.body,
          makeHeaders()
        );
        if (response.status == 200) {
          // dispatch("HOMEPAGE/showSuccessToast", `Successfully update Firewall`, { root: true });
          dispatch("HOMEPAGE/showSuccessToast", response.data.responseMessage, { root: true });
          commit("setLoadUpdate", false);
          // router.go(-1);
        }
        // console.log("respon update", response);
        // dispatch("HOMEPAGE/showSuccessToast", `Successfully update Firewall`, { root: true });
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        commit("setLoadFirewall", false);
        commit("setLoadUpdate", false);
      }
    },
    // https://pre-deploy.cmd.cloudeka.id/core/dekaprime/objectbrowser/edges/d45b8ec3-eb0d-4e27-8fb1-83d56afef1cf/vdcnetwork
    getIpObject: async ({ commit, dispatch }, payload) => {
      try {
        // commit("setLoadFirewall", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/objectbrowser/edges/${payload}/vdcnetwork`, makeHeaders());
        commit("setListIpObject", response.data.payload.edgeInterfaces);
        // commit("setLoadFirewall", false);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
        // commit("setLoadFirewall", false);
      }
    },
    fetchApplications: async ({ commit, dispatch }, payload) => {
      // const payload = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      const { page, pageSize } = payload;
      try {
        commit("setIsLoadingApplications", true);
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/firewall/application?pageSize=${pageSize ?? 10}&page=${page ?? 1}`,
          makeHeaders()
        );
        commit("setlistApplications", response.data.payload.values);
        commit("setRowsApplication", response.data.payload.resultTotal)
        commit("setIsLoadingApplications", false);
      } catch (error) {
        commit("setListEdge", []);
        commit("setIsLoadingApplications", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    fetchSummary: async ({ commit, dispatch }, payload) => {
      // const payload = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      const { page, pageSize, idEdge } = payload;
      try {
        commit("setIsLoadingSummary", true);
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekaprime/edgegateway/nsxt/${idEdge}/firewall/summary?pageSize=${pageSize ?? 10}&page=${page ?? 1}`,
          makeHeaders()
        );
        commit("setlistSummary", response.data.payload.values);
        commit("setRowsSummary", response.data.payload.resultTotal)
        commit("setIsLoadingSummary", false);
      } catch (error) {
        commit("setListEdge", []);
        commit("setIsLoadingSummary", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
  },
};

export default store;
