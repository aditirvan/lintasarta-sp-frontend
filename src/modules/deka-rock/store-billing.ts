import axios from "axios";
import { Module } from "vuex";

function makeHeaders() {
  const params = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${params}` },
  };
}

interface state {
  listFlavorDekaRock: Array<any>;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    listFlavorDekaRock: [],
  },
  getters: {
    listFlavorDekaRock: (state) => {
      return state.listFlavorDekaRock;
    },
  },
  mutations: {
    setListFlavorDekaRock: (state: state, payload) => {
      state.listFlavorDekaRock = payload;
    },
  },
  actions: {
    getFlavorDekaRock: async ({ commit }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/deka-rock?${payload}`, makeHeaders());
        commit("setListFlavorDekaRock", response.data.data);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
  },
};

export default store;
