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
  listCatalog: Array<any>;
  allCatalog: Array<any>;
  loadingCatalog: Boolean;
  detailCatalog: Object;
  totalCatalog: Number;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    listCatalog: [],
    loadingCatalog: false,
    detailCatalog: {},
    allCatalog: [],
    totalCatalog: 0,
  },
  getters: {
    listCatalog: (state) => {
      return state.listCatalog;
    },
    loadingCatalog: (state) => {
      return state.loadingCatalog;
    },
    detailCatalog: (state) => {
      return state.detailCatalog;
    },
    allCatalog: (state) => {
      return state.allCatalog;
    },
    totalCatalog: (state) => {
      return state.totalCatalog;
    },
  },
  mutations: {
    setListCatalog: (state: state, payload) => {
      state.listCatalog = payload;
    },
    setLoadingCatalog: (state: state, payload) => {
      state.loadingCatalog = payload;
    },
    setDetailCatalog: (state: state, payload) => {
      state.detailCatalog = payload;
    },
    setAllCatalog: (state: state, payload) => {
      state.allCatalog = payload;
    },
    setTotalCatalog: (state: state, payload) => {
      state.totalCatalog = payload;
    },
  },
  actions: {
    getListCatalog: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCatalog", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/catalog/${payload}`, makeHeaders());
        commit("setListCatalog", response.data.payload.Catalog.CatalogItems[0].CatalogItem);
        commit("setDetailCatalog", response.data.payload.Catalog);
        commit("setLoadingCatalog", false);
      } catch (error) {
        commit("setDetailCatalog", {});
        commit("setListCatalog", []);
        commit("setLoadingCatalog", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getAllCatalog: async ({ commit, dispatch }) => {
      try {
        commit("setLoadingCatalog", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/catalog/page`, makeHeaders());
        commit("setAllCatalog", response.data.payload.Results.CatalogRecord);
        commit("setTotalCatalog", response.data.payload.Results.Total);
        commit("setLoadingCatalog", false);
      } catch (error) {
        commit("setAllCatalog", []);
        commit("setLoadingCatalog", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },

    fetchAllCatalog: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCatalog", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaprime/catalog/page?${payload}`, makeHeaders());
        commit("setAllCatalog", response.data.payload.Results.CatalogRecord);
        commit("setTotalCatalog", response.data.payload.Results.Total);
        commit("setLoadingCatalog", false);
      } catch (error) {
        commit("setAllCatalog", []);
        commit("setLoadingCatalog", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
  },
};

export default store;
