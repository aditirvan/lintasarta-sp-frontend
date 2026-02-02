import axios from "@/lib/axios";
import localstorage from "@/lib/localstorage";
const projJson = localstorage.getItem("currentProj");
const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};
const userId = localStorage.getItem("userId");
const storeZone = {
  namespaced: true,
  state: {
    zones: [],
    zoneByRegion: [],
    zoneByProject: [],
    zone: {},
    isZoneLoading: false,
    zonePaginator: {
      count: 1,
      totalpage: 1,
      page: 1,
      limit: 10,
    },
    zoneByStatus: [],
    zoneOS: [],
  },
  mutations: {
    setZones: (state, payload) => (state.zones = payload),
    setZone: (state, payload) => (state.zone = payload),
    setIsZoneLoading: (state, payload) => (state.isZoneLoading = payload),
    setZoneByRegion: (state, payload) => (state.zoneByRegion = payload),
    setZoneByProject: (state, payload) => (state.zoneByProject = payload),
    setZoneByStatus: (state, payload) => (state.zoneByStatus = payload),
    setZoneOS: (state, payload) => (state.zoneOS = payload),
  },
  actions: {
    createZone: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsZoneLoading", true);
        const response = await axios.instance.post(`/zone/create`, payload);
        // dispatch('fetchZones')
        dispatch("fetchZoneByRegion", {
          region_id: payload.region_id,
        });
        dispatch("HOMEPAGE/showSuccessToast", "New zone has been successfully created", { root: true });
        commit("setIsZoneLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to create new zone";
        if (err.includes("zone name has already exist")) errorMessage = "Zone name already exists.";
        commit("setIsZoneLoading", false);
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        return e.response;
      }
    },
    updateZone: async ({ commit, dispatch }, payload) => {
      try {
        const { sourceName } = payload;
        delete payload.sourceName;
        commit("setIsZoneLoading", true);
        const response = await axios.instance.put(`/zone/update/${payload.id}`, payload);
        commit("setIsZoneLoading", false);
        // dispatch('fetchZones')
        dispatch("fetchZoneByRegion", {
          region_id: payload.region_id,
        });
        dispatch("HOMEPAGE/showSuccessToast", "Zone has been successfully updated", { root: true });
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to update zone";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsZoneLoading", false);
        return e.response;
      }
    },
    fetchZones: async ({ commit, dispatch, rootState }, payload = { page: 1, search: "", order_column: null, order_by: null }) => {
      try {
        if (payload.limit) payload.limit = rootState["MANAGEZONE"].zonePaginator.limit;
        commit("setIsZoneLoading", true);
        const response = await axios.instance.get(`/zone/list`, {
          params: { ...payload },
        });
        commit("setIsZoneLoading", false);
        commit("setZones", response.data.data);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get list of zones";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsZoneLoading", false);
        return e.response;
      }
    },
    fetchZoneById: async ({ commit, dispatch }, id) => {
      try {
        commit("setIsZoneLoading", true);
        const response = await axios.instance.get(`/zone/detail/${id}`);
        commit("setZone", response.data.data);
        commit("setIsZoneLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get zone detail";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsZoneLoading", false);
        return e.response;
      }
    },
    deleteZoneById: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsZoneLoading", true);
        const response = await axios.instance.delete(`/zone/delete/${payload.id}`);
        commit("setIsZoneLoading", false);
        // dispatch('fetchZones')
        dispatch("fetchZoneByRegion", {
          region_id: payload.region_id,
        });
        dispatch("HOMEPAGE/showSuccessToast", "Zone has been successfully deleted", { root: true });
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to delete zone";
        if (err.includes("can't delete zone, there are instances still using this zone"))
          errorMessage = "Unable to delete. There are active resources in this zone.";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsZoneLoading", false);
        return e.response;
      }
    },
    fetchZoneByRegion: async (
      { commit, dispatch, rootState },
      payload = { page: 1, search: "", order_column: null, order_by: null, project_id: projObj.id }
    ) => {
      try {
        if (payload.limit) payload.limit = rootState["MANAGEZONE"].zonePaginator.limit;
        commit("setIsZoneLoading", true);
        const response = await axios.instance.get(`/zone/list-by-region/${payload.region_id}`, {
          params: { ...payload },
        });
        commit("setIsZoneLoading", false);
        commit("setZoneByRegion", response.data.data);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get list of zones";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsZoneLoading", false);
        return e.response;
      }
    },
    fetchZoneByProject: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsZoneLoading", true);
        const response = await axios.instance.get(`/zone/list-by-project/${payload.project_id}`);
        commit("setIsZoneLoading", false);
        commit("setZoneByProject", response.data.data);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get list of projects";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsZoneLoading", false);
        return e.response;
      }
    },
    fetchZoneByStatus: async (
      { commit, dispatch, rootState },
      payload = { page: 1, search: "", order_column: null, order_by: null, project_id: projObj.id }
    ) => {
      try {
        if (payload.limit) payload.limit = rootState["MANAGEZONE"].zonePaginator.limit;
        commit("setIsZoneLoading", true);
        const response = await axios.instance.get(`/zone/filter-by-status`, {
          params: { ...payload },
        });
        commit("setIsZoneLoading", false);
        commit("setZoneByStatus", response.data.data);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get list of zones";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsZoneLoading", false);
        return e.response;
      }
    },
    fetchZoneOS: async ({ commit, dispatch, rootState }, payload) => {
      try {
        if (payload.limit) payload.limit = rootState["MANAGEZONE"].zonePaginator.limit;
        commit("setIsZoneLoading", true);
        const response = await axios.instance.get(`/zone/os-availability-zone/${payload.region_id}`); //{params: { ...payload }}
        commit("setIsZoneLoading", false);
        commit("setZoneOS", response.data.data);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get list of zones";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsZoneLoading", false);
        return e.response;
      }
    },
  },
};
export default storeZone;
