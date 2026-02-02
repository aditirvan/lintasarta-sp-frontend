import { Module } from "vuex";
import axios from "axios";

function makeHeaders() {
  const params = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${params}` },
  };
}

interface state {
  loadingCreateFlavor: Boolean;
  listManageFlavor: Array<any>;
  loadingGetFlavor: Boolean;
  totalFlavor: Number;
  detailManageFlavor: Object;
  loadingUpdateFlavor: Boolean;
  loadingDeleteFlavor: Boolean;
  listTypeFlavor: Array<any>;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    loadingCreateFlavor: false,
    listManageFlavor: [],
    loadingGetFlavor: false,
    totalFlavor: 0,
    detailManageFlavor: {},
    loadingUpdateFlavor: false,
    loadingDeleteFlavor: false,
    listTypeFlavor: [],
  },
  getters: {
    loadingCreateFlavor: (state) => {
      return state.loadingCreateFlavor;
    },
    listManageFlavor: (state) => {
      return state.listManageFlavor;
    },
    loadingGetFlavor: (state) => {
      return state.loadingGetFlavor;
    },
    totalFlavor: (state) => {
      return state.totalFlavor;
    },
    detailManageFlavor: (state) => {
      return state.detailManageFlavor;
    },
    loadingUpdateFlavor: (state) => {
      return state.loadingUpdateFlavor;
    },
    loadingDeleteFlavor: (state) => {
      return state.loadingDeleteFlavor;
    },
    listTypeFlavor: (state) => {
      return state.listTypeFlavor;
    },
  },
  mutations: {
    setLoadingCreateFlavor: (state: state, payload) => {
      state.loadingCreateFlavor = payload;
    },
    setListManageFlavor: (state: state, payload) => {
      state.listManageFlavor = payload;
    },
    setLoadingGetFlavor: (state: state, payload) => {
      state.loadingGetFlavor = payload;
    },
    setTotalFlavor: (state: state, payload) => {
      state.totalFlavor = payload;
    },
    setDetailManageFlavor: (state: state, payload) => {
      state.detailManageFlavor = payload;
    },
    setLoadingUpdateFlavor: (state: state, payload) => {
      state.loadingUpdateFlavor = payload;
    },
    setLoadingDeleteFlavor: (state: state, payload) => {
      state.loadingDeleteFlavor = payload;
    },
    setListTypeFlavor: (state: state, payload) => {
      state.listTypeFlavor = payload;
    },
  },
  actions: {
    postCreateFlavor: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCreateFlavor", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/flavor/instance`, payload, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingCreateFlavor", false);
          dispatch("HOMEPAGE/showSuccessToast", `Flavor has successfully created!`, { root: true });
          setTimeout(() => {
            window.location.href = "/manage-flavor";
          }, 1000);
        }
      } catch (error) {
        commit("setLoadingCreateFlavor", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    getListManageFlavor: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingGetFlavor", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/manage-flavor/list?${payload}`, makeHeaders());
        commit("setListManageFlavor", response.data.data.rows);
        commit("setTotalFlavor", response.data.data.total_rows);
        commit("setLoadingGetFlavor", false);
      } catch (error) {
        commit("setLoadingGetFlavor", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    getDetailManageFlavor: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/manage-flavor/detail/${payload}`, makeHeaders());
        commit("setDetailManageFlavor", response.data.data);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    updateFlavor: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingUpdateFlavor", true);
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/flavor/instance/update-description/${payload.id}`, payload.body, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingUpdateFlavor", false);
          dispatch("HOMEPAGE/showSuccessToast", `Flavor has successfully updated!`, { root: true });
          const params = new URLSearchParams();
          params.append("limit", "10");
          params.append("page", "1");
          dispatch("fetchManageInstanceFlavors", params);
        }
        return response;
      } catch (error) {
        commit("setLoadingUpdateFlavor", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    deleteFlavor: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingDeleteFlavor", true);
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/flavor/instance/delete/${payload}`, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingDeleteFlavor", false);
          dispatch("HOMEPAGE/showSuccessToast", `Flavor has successfully deleted!`, { root: true });
          const params = new URLSearchParams();
          params.append("limit", "10");
          params.append("page", "1");
          dispatch("fetchManageInstanceFlavors", params);
        }
        return response;
      } catch (error) {
        commit("setLoadingDeleteFlavor", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    fetchManageInstanceFlavors: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingGetFlavor", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/flavor/instance?${payload}`, makeHeaders());
        commit("setListManageFlavor", response.data.data.instance);
        commit("setTotalFlavor", response.data.data.pagination);
        commit("setLoadingGetFlavor", false);
      } catch (error) {
        commit("setLoadingGetFlavor", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    getTypeFlavors: async ({ commit, dispatch }) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/flavor/instance/type`, makeHeaders());
        commit("setListTypeFlavor", response.data.data);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    activateFlavor: async ({ dispatch }, payload) => {
      try {
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/flavor/instance/${payload.status}/${payload.id}`, payload.status, makeHeaders());
        if (response.status == 200) {
          dispatch("HOMEPAGE/showSuccessToast", `Flavor has successfully updated!`, { root: true });
          const params = new URLSearchParams();
          params.append("limit", "10");
          params.append("page", "1");
          dispatch("fetchManageInstanceFlavors", params);
        }

        return response;
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
  },
};

export default store;
