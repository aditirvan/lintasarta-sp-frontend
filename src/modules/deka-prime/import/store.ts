import { Module } from "vuex";
import axios from "axios";

function makeHeaders() {
  const params = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
  return {
    headers: { Authorization: `Bearer ${params.token}` },
  };
}

interface state {
  loadingImport: Boolean;
  dialogImport: Boolean;
  dataResponse: Array<any>;
  statusImport: Boolean;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    loadingImport: false,
    dialogImport: false,
    dataResponse: [],
    statusImport: false,
  },
  getters: {
    loadingImport: (state) => {
      return state.loadingImport;
    },
    dialogImport: (state) => {
      return state.dialogImport;
    },
    dataResponse: (state) => {
      return state.dataResponse;
    },
    statusImport: (state) => {
      return state.statusImport;
    },
  },
  mutations: {
    setLoadingImport: (state: state, payload) => {
      state.loadingImport = payload;
    },
    setDialogImport: (state: state, payload) => {
      state.dialogImport = payload;
    },
    setDataResponse: (state: state, payload) => {
      state.dataResponse = payload;
    },
    setStatusImport: (state: state, payload) => {
      state.statusImport = payload;
    },
  },
  actions: {
    postImport: async ({ commit, dispatch }, payload) => {
      try {
        commit("setStatusImport", false);
        commit("setLoadingImport", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/import/useradmin`, payload);
        if (response.status == 200) {
          commit("setDataResponse", response.data.payload);
          commit("setLoadingImport", false);
          commit("setDialogImport", true);
          // const data = response.data.payload;
          // const alert = data.map((item: any) => {
          //   return " " + item.name + " " + item.message + " " + "Import";
          // });
          // commit("setLoadingImport", false);
          // dispatch("HOMEPAGE/showSuccessToast", `${alert}`, { root: true });
        }
      } catch (error) {
        commit("setStatusImport", true);
        commit("setLoadingImport", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    postImportSuperadmin: async ({ commit, dispatch }, payload) => {
      try {
        commit("setStatusImport", false);
        commit("setLoadingImport", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/import/superadmin`, payload);
        if (response.status == 200) {
          commit("setDataResponse", response.data.payload);
          commit("setLoadingImport", false);
          commit("setDialogImport", true);
          // dispatch("HOMEPAGE/showSuccessToast", `${alert}`, { root: true });
        }
      } catch (error) {
        commit("setStatusImport", true);
        commit("setLoadingImport", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
  },
};

export default store;
