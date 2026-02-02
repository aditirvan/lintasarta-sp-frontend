import axios from "axios";
import { Module } from "vuex";

function makeHeaders() {
  const params = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${params}` },
  };
}

interface state {
  defaultSnapshotPrice: any
  defaultBackupPrice: any
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    defaultSnapshotPrice: {},
    defaultBackupPrice: {},
  },
  getters: {
    defaultSnapshotPrice: (state) => {
      return state.defaultSnapshotPrice;
    },
    defaultBackupPrice: (state) => {
      return state.defaultBackupPrice;
    },
  },
  mutations: {
    setDefaultSnapshotPrice: (state: state, payload) => {
      state.defaultSnapshotPrice = payload;
    },
    setDefaultBackupPrice: (state: state, payload) => {
      state.defaultBackupPrice = payload;
    },
  },
  actions: {
    getDefaultSnapshotPrice: async ({ commit }) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/snapshot/default`, makeHeaders());
        commit("setDefaultSnapshotPrice", response.data.data);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getDefaultBackupPrice: async ({ commit }) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/backup/default`, makeHeaders());
        commit("setDefaultBackupPrice", response.data.data);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
  },
};

export default store;
