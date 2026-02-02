import { Module } from "vuex";
import axios from "axios";

function makeHeaders() {
  const params = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${params}` },
  };
}

interface state {
  listFlavorObjectStorage: Array<any>;
  defaultFlavorObjectStorage: Object;
  isLoadingFlavor: boolean;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    listFlavorObjectStorage: [],
    defaultFlavorObjectStorage: {},
    isLoadingFlavor: false,
  },
  getters: {
    listFlavorObjectStorage: (state) => state.listFlavorObjectStorage,
    defaultFlavorObjectStorage: (state) => state.defaultFlavorObjectStorage,
    isLoadingFlavor: (state) => state.isLoadingFlavor,
  },
  mutations: {
    setListFlavorObjectStorage: (state: state, payload) => {
      state.listFlavorObjectStorage = payload;
    },
    setDefaultFlavorObjectStorage: (state: state, payload) => {
      state.defaultFlavorObjectStorage = payload;
    },
    setIsLoadingFlavor: (state: state, payload) => {
      state.isLoadingFlavor = payload;
    },
  },
  actions: {
    getFlavorObjectStorage: async ({ commit }) => {
      commit("setIsLoadingFlavor", true);
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/object-storage`, makeHeaders());
        commit("setListFlavorObjectStorage", response.data.data);
      } catch (error) {
        // Handle the error appropriately here
        console.error("Error fetching flavor object storage:", error);
      } finally {
        commit("setIsLoadingFlavor", false);
      }
    },
    getDefaultObjectStorage: async ({ commit }) => {
      commit("setIsLoadingFlavor", true);
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/object-storage/default`, makeHeaders());
        commit("setDefaultFlavorObjectStorage", response.data.data);
      } catch (error) {
        // Handle the error appropriately here
        console.error("Error fetching default object storage:", error);
      } finally {
        commit("setIsLoadingFlavor", false);
      }
    },
    getFlavorObjectStorageByRegion: async ({ commit }, regionName) => {
      // commit("setIsLoadingFlavor", true);
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/object-storage-region/${regionName}`,
          makeHeaders()
        );
        commit("setIsLoadingFlavor", false);
        commit("setListFlavorObjectStorage", response.data.data);
      } catch (error) {
        // Handle the error appropriately here
        commit("setIsLoadingFlavor", false);
        console.error("Error fetching flavor object storage by region:", error);
      } finally {
        commit("setIsLoadingFlavor", false);
      }
    },
    getDefaultObjectStorageByRegion: async ({ commit }, regionName) => {
      commit("setIsLoadingFlavor", true);
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/object-storage-region/default/${regionName}`,
          makeHeaders()
        );
        commit("setIsLoadingFlavor", false);
        commit("setDefaultFlavorObjectStorage", response.data.data);
      } catch (error) {
        // Handle the error appropriately here
        commit("setIsLoadingFlavor", false);
        console.error("Error fetching default object storage by region:", error);
      } finally {
        commit("setIsLoadingFlavor", false);
      }
    },

  

  },
};

export default store;
