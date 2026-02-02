import axios from "axios";
import { Module } from "vuex";

function makeHeaders() {
  const params = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${params}` },
  };
}

interface state {
  listFlavorSlb: Array<any>;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    listFlavorSlb: [],
  },
  getters: {
    listFlavorSlb: (state) => {
      return state.listFlavorSlb;
    },
  },
  mutations: {
    setListFlavorSlb: (state: state, payload) => {
      state.listFlavorSlb = payload;
    },
  },
  actions: {
    getFlavorSlb: async ({ commit }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/deka-slb?${payload}`, makeHeaders());
        commit("setListFlavorSlb", response.data.data);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
  },
};

export default store;
