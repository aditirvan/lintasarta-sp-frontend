import axios from "axios";
import { Module } from "vuex";

function makeHeaders() {
  const params = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${params}` },
  };
}

interface state {
    defaultPriceRegistry: any
  }

const store: Module<state, any> = {
    namespaced: true,
    state: {
      defaultPriceRegistry: {},
    },
    getters: {
        defaultPriceRegistry: (state) => {
            return state.defaultPriceRegistry;
        },
    },
    mutations: {
        setDefaultPriceRegistry: (state: state, payload) => {
            state.defaultPriceRegistry = payload;
          },
    },
    actions: {
        getDefaultPriceRegistry: async ({ commit }) => {
          try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/deka-registry/default`, makeHeaders());
            // const response = await axios.get(`${'http://localhost:1323'}/flavor/deka-registry/default`, makeHeaders());
            commit("setDefaultPriceRegistry", response.data.data);
          } catch (error) {
            // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
          }
        },
    },
  };
  
  export default store;