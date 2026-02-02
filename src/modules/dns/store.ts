import { ActionContext, Module } from "vuex";
import libProject from "@/lib/project";
import axios from "axios";
import { async } from "rxjs";
import router from "@/lib/router";

function makeHeaders() {
  const params = JSON.parse(localStorage.getItem("loginDns") || "{}");
  return {
    headers: { Authorization: `Bearer ${params.token}` },
  };
}

function makeHeadersServiceLimit() {
  const token = localStorage.getItem('token') || "{}"
  return {
      headers: { Authorization: `Bearer ${token}` }
  }
}

// const params = JSON.parse(
//     localStorage.getItem("loginDns") || "{}"
// );
// const headers = {
//     Authorization: `Bearer ${params.token}`
// }

interface state {
  listData: Array<any>;
  isLoad: Boolean;
  isLoadUpdate: Boolean;
  detailDns: any;
  listRecords: Array<any>;
  listNameservers: Array<any>;
  dnsOverview: Array<any>;
  dnsOverviewExist: Array<any>;
  listDataTotal: Number;
  listRecordsTotal: Number;
  dataListType: Array<any>;
  alert: Boolean;
  deleteLoading: Boolean;
  loadingCancel: Boolean;
  limitDns:{};
  isLoading: Boolean;
  isLoadingBtn: Boolean;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    listData: [],
    isLoad: false,
    isLoadUpdate: false,
    detailDns: {},
    listRecords: [],
    listNameservers: [],
    dnsOverview: [],
    dnsOverviewExist: [],
    listDataTotal: 0,
    listRecordsTotal: 0,
    dataListType: [],
    alert: false,
    deleteLoading: false,
    loadingCancel: false,
    limitDns:{},
    isLoading: false,
    isLoadingBtn: false,
  },
  getters: {
    listData: (state) => {
      return state.listData;
    },
    isLoad: (state) => {
      return state.isLoad;
    },
    isLoadUpdate: (state) => {
      return state.isLoadUpdate;
    },
    detailDns: (state) => {
      return state.detailDns;
    },
    listRecords: (state) => {
      return state.listRecords;
    },
    listNameservers: (state) => {
      return state.listNameservers;
    },
    dnsOverview: (state) => {
      return state.dnsOverview;
    },
    dnsOverviewExist: (state) => {
      return state.dnsOverviewExist;
    },
    listDataTotal: (state) => {
      return state.listDataTotal;
    },
    dataListType: (state) => {
      return state.dataListType;
    },
    listRecordsTotal: (state) => {
      return state.listRecordsTotal;
    },
    alert: (state) => {
      return state.alert;
    },
    deleteLoading: (state) => {
      return state.deleteLoading;
    },
    loadingCancel: (state) => {
      return state.loadingCancel;
    },
    getLimitDns: state => state.limitDns,
  },
  mutations: {
    setlistData: (state: state, payload) => {
      state.listData = payload;
    },
    setDetailDns: (state: state, payload) => {
      state.detailDns = payload;
    },
    setIsLoading: (state: state, payload) => {
      state.isLoad = payload;
    },
    setIsLoadUpdate: (state: state, payload) => {
      state.isLoadUpdate = payload;
    },
    setListRecords: (state: state, payload) => {
      state.listRecords = payload;
    },
    setListNameservers: (state: state, payload) => {
      state.listNameservers = payload;
    },
    setDnsOverview: (state: state, payload) => {
      state.dnsOverview = payload;
    },
    setDnsOverviewExist: (state: state, payload) => {
      state.dnsOverviewExist = payload;
    },
    setlistDataTotal: (state: state, payload) => {
      state.listDataTotal = payload;
    },
    setDataListType: (state: state, payload) => {
      state.dataListType = payload;
    },
    setListRecordsTotal: (state: state, payload) => {
      state.listRecordsTotal = payload;
    },
    setAlert: (state: state, payload) => {
      state.alert = payload;
    },
    setDeleteLoading: (state: state, payload) => {
      state.deleteLoading = payload;
    },
    setLoadingCancel: (state: state, payload) => {
      state.loadingCancel = payload;
    },
    setLimitDns: (state, data) => state.limitDns = data,
    setIsLoading:(state, isLoading) => state.isLoading = isLoading,
    setIsLoadingBtn:(state, isLoading) => state.isLoadingBtn = isLoading,
  },
  actions: {
    getListType: async ({ commit, dispatch }) => {
      try {
        // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/type/list`, makeHeaders())
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/type/list`,
          makeHeaders()
        );
        commit(
          "setDataListType",
          JSON.parse(JSON.stringify(response.data.data))
        );
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `Failed to load data`, {
          root: true,
        });
      }
    },
    postConnect: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadUpdate", true);
        // const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/auth/connect`, payload)
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/auth/connect`,
          payload
        );
        localStorage.setItem("loginDns", JSON.stringify(response.data.data));
        commit("setIsLoadUpdate", false);
        window.location.reload();
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
      }
    },
    postRegister: async ({ commit, dispatch }, payload) => {
      try {
        // const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/auth/register`, payload)
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/auth/register`,
          payload
        );
      } catch (error) {
        console.log(error);
      }
    },
    postAuth: async ({ commit }, payload) => {
      // const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/auth/login`, payload)
      const response = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/auth/login`,
        payload
      );
      localStorage.setItem("loginDns", JSON.stringify(response.data.data));
    },
    getListData: async ({ commit, dispatch }) => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "0");
      params.append("sort", "created_at");
      try {
        commit("setIsLoading", true);
        // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/dns/list?${params}`, makeHeaders())
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/list?${params}`,
          makeHeaders()
        );
        commit("setlistData", response.data.data.rows);
        commit("setlistDataTotal", response.data.data.total_by_project);
        commit("setIsLoading", false);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
        commit("setIsLoading", false);
      }
    },
    fetchListData: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/dns/list?${payload}`, makeHeaders())
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/list?${payload}`,
          makeHeaders()
        );
        commit("setlistData", response.data.data.rows);
        commit("setlistDataTotal", response.data.data.total_by_project);
        commit("setIsLoading", false);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
        commit("setIsLoading", false);
      }
    },
    getDetailDns: async ({ commit, dispatch }, paylod) => {
      try {
        commit("setIsLoading", true);
        // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/dns/${paylod}`, makeHeaders())
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/${paylod}`,
          makeHeaders()
        );
        commit("setDetailDns", response.data.data);
        commit("setIsLoading", false);
      } catch (error) {
        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
      }
    },

    postCreateDns: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        // const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/dns/create`, payload, makeHeaders())
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/create`,
          payload,
          makeHeaders()
        );
        dispatch(
          "HOMEPAGE/showSuccessToast",
          `Successfully add site ${response.data.data.name}`,
          { root: true }
        );
        router.push(
          `dns/create-overview/${response.data.data.id}/${response.data.data.name}`
        );
        router.go(0);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
        commit("setIsLoading", false);
      }
    },

    updateDns: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadUpdate", true);
        // const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/dns/update/${payload.id}`, payload, makeHeaders())
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/update/${payload.id}`,
          payload,
          makeHeaders()
        );
        dispatch(
          "HOMEPAGE/showSuccessToast",
          "DNS has been successfully created",
          { root: true }
        );
        dispatch("getListData");
        router.go(0);
        commit("setIsLoadUpdate", false);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
        commit("setIsLoadUpdate", false);
      }
    },

    deleteDns: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadUpdate", true);
        // const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/dns/delete/${payload.id}`, makeHeaders())
        const response = await axios.delete(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/delete-v2/${payload.id}`,
          makeHeaders()
        );
        dispatch(
          "HOMEPAGE/showSuccessToast",
          `DNS has been successfully deleted ${payload.name}`,
          { root: true }
        );
        commit("setIsLoadUpdate", false);
        dispatch("getListData");
        router.go(0);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
        commit("setIsLoadUpdate", false);
      }
    },

    postCreateRecord: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        // const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/record/create`, payload, makeHeaders())
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/record/create`,
          payload,
          makeHeaders()
        );
        dispatch(
          "HOMEPAGE/showSuccessToast",
          `Record has been successfully created ${payload.name}`,
          { root: true }
        );
        commit("setIsLoading", false);
        // dispatch('getListRecords', payload.zone)
        dispatch("getDetailDns", payload.zone_id);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
        commit("setIsLoading", false);
      }
    },

    getListRecords: async ({ commit, dispatch }, payload) => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "0");
      params.append("sort", "created_at");
      params.append("zone.contains", payload);
      try {
        commit("setIsLoading", true);
        // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/record/list?${params}`, makeHeaders())
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/record/list?${params}`,
          makeHeaders()
        );
        commit("setIsLoading", false);
        commit("setListRecords", response.data.data.rows);
        commit("setListRecordsTotal", response.data.data.total_by_project);
      } catch (error) {
        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
      }
    },

    fetchListDataRecords: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/record/list?${payload}`, makeHeaders())
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/record/list?${payload}`,
          makeHeaders()
        );
        commit("setIsLoading", false);
        commit("setListRecords", response.data.data.rows);
        commit("setListRecordsTotal", response.data.data.total_by_project);
      } catch (error) {
        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
      }
    },

    updateRecords: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadUpdate", true);
        // const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/record/update/${payload.id}`, payload.params, makeHeaders())
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/record/update/${payload.id}`,
          payload.params,
          makeHeaders()
        );
        commit("setIsLoadUpdate", false);
        dispatch(
          "HOMEPAGE/showSuccessToast",
          "Record has been successfully updated",
          { root: true }
        );
        dispatch("getListRecords", payload.params.zone);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
        commit("setListRecords", []);
        dispatch("getListRecords", payload.params.zone);
        commit("setIsLoadUpdate", false);
      }
    },

    deleteRecords: async ({ commit, dispatch }, payload) => {
      try {
        commit("setDeleteLoading", true);
        // const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/record/delete/${payload.id}`, makeHeaders())
        const response = await axios.delete(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/record/delete/${payload.id}`,
          makeHeaders()
        );
        if (response.status == 200) {
          commit("setDeleteLoading", false);
          dispatch(
            "HOMEPAGE/showSuccessToast",
            `Record has been successfully deleted ${payload.name}`,
            { root: true }
          );
          dispatch("getListRecords", payload.zone);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
        commit("setDeleteLoading", false);
      }
    },

    getListNameservers: async ({ commit, dispatch }) => {
      try {
        // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/dns/nameserver/list`, makeHeaders())
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/nameserver/list`,
          makeHeaders()
        );
        commit(
          "setListNameservers",
          JSON.parse(JSON.stringify(response.data.data))
        );
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
      }
    },

    getDnsOverview: async ({ commit, dispatch }, payload) => {
      try {
        // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/dns/overview/${payload}`, makeHeaders())
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/overview/${payload}`,
          makeHeaders()
        );
        commit("setDnsOverview", response.data.data);
        commit("setDnsOverviewExist", response.data.Exist);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
      }
    },

    getCheckNameservers: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        // const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/dns/checknameserver`, payload, makeHeaders())
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/checknameserver`,
          payload,
          makeHeaders()
        );
        if (response.data.status == "Status Inactive") {
          dispatch(
            "HOMEPAGE/showErrorToast",
            `Oops! Your site not protecting by Cloudeka`,
            { root: true }
          );
        } else {
          dispatch(
            "HOMEPAGE/showSuccessToast",
            `Great news! ${payload.name} is now protecting your site`,
            { root: true }
          );
        }
        commit("setIsLoading", false);
      } catch (error) {
        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
      }
    },

    postCancelNameservers: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCancel", true);
        // const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/dns/cancelns/${payload.id.id_custom}/${payload.id.id_record}`, payload.data, makeHeaders())
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/cancelns/${payload.id.id_custom}/${payload.id.id_record}`,
          payload.data,
          makeHeaders()
        );
        commit("setLoadingCancel", false);
        dispatch(
          "HOMEPAGE/showSuccessToast",
          "Custom nameserver successfully canceled",
          { root: true }
        );
        router.go(0);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
        commit("setLoadingCancel", false);
      }
    },

    customNameserver: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoadUpdate", true);
        // const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/dns/customns`, payload, makeHeaders())
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/customns`,
          payload,
          makeHeaders()
        );
        commit("setIsLoadUpdate", false);
        if (response.data.status == true) {
          dispatch(
            "HOMEPAGE/showSuccessToast",
            "Custom nameserver successfully updated",
            { root: true }
          );
          router.go(0);
        }
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, {
          root: true,
        });
        commit("setIsLoadUpdate", false);
      }
    },

    fetchDnsLimit: async(context: ActionContext<State, any>, payload: any) => {
        try{
          const activeProjectID = await libProject.getActiveProjectID();
          if (!activeProjectID)
            context.dispatch(
              "HOMEPAGE/showErrorToast",
              "Could not find project data.",
              { root: true }
            );
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/service-limit/${activeProjectID}`, makeHeadersServiceLimit())
          const resp = response.data.data
          console.log("LIST LIMIT DNS ", resp);
          context.commit("setLimitDns", resp);
          return resp
        }catch(e){
            console.log("loading error bajingan");
            console.log(e);
            context.commit('setIsLoading', false)  
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.responseMessage, { root: true })
            return e.response.data.responseMessage
        }
      },
      saveLimitDns: async (context: ActionContext<State, any>, payload: any) => {
        try{
          const activeProjectID = await libProject.getActiveProjectID();
          payload.body.project_id = activeProjectID
          context.commit('setIsLoadingBtn', true)
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekadns/api/v1/dns/service-limit`, payload.body, makeHeadersServiceLimit())
          
          context.commit('setIsLoadingBtn', false)
          context.dispatch('HOMEPAGE/showSuccessToast', 'Custom Deka DNS limit has been successfully updated', { root: true })
          return response
        }catch(e){
            context.commit('setIsLoadingBtn', false)
            context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
            return e.response.data.responseMessage
        }
      },

    refreshRecords: async ({ commit, dispatch }, payload) => {
      commit("setListRecords", []);
      dispatch("getListRecords", payload);
    },
  },
};

export default store;
