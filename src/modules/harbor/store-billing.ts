import axios, { AxiosRequestConfig } from "axios";
import { Module } from "vuex";

function makeHeaders(params?: any): AxiosRequestConfig {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
    params
  };
}

interface state {
  listFlavorDekaHarbor: Array<any>;
  listFlavorLoadBalancer: Array<any>;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    listFlavorDekaHarbor: [],
    listFlavorLoadBalancer: [],
  },
  getters: {
    listFlavorDekaHarbor: (state) => {
      return state.listFlavorDekaHarbor;
    },
    listFlavorLoadBalancer: (state) => {
      return state.listFlavorLoadBalancer;
    },
  },
  mutations: {
    setListFlavorDekaHarbor: (state: state, payload) => {
      state.listFlavorDekaHarbor = payload;
    },
    setlistFlavorLoadBalancer: (state: state, payload) => {
      state.listFlavorLoadBalancer = payload;
    },
  },
  actions: {
    getFlavorDekaHarbor: async ({ commit }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/deka-harbor?${payload}`, makeHeaders());
        commit("setListFlavorDekaHarbor", response.data.data);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getFlavorLoadBalancer: async ({ commit }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/deka-harbor?${payload}`, makeHeaders());
        commit("setlistFlavorLoadBalancer", response.data.data);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
  },
};

export default store;
