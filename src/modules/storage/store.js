import axios from "../../lib/axios";
import { isLimitError, createLimitErrorMsg } from "@/lib/validator";
import libProject from "@/lib/project";

function sortBySize(a, b) {
  if (a.volume_size < b.volume_size) return -1;
  return 1;
}

function makeHeaders() {
  const params = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${params}` },
  };
}

export const store = {
  namespaced: true,
  state: {
    storages: [],
    volumeSize: [],
    isLoading: false,
    listStorageTypeBilling: [],
    listInstanceRootDisk: [],
    defaultPriceStorage: {},
  },
  getters: {
    listStorageTypeBilling: (state) => state.listStorageTypeBilling,
    listInstanceRootDisk: (state) => state.listInstanceRootDisk,
    defaultPriceStorage: (state) => state.defaultPriceStorage,
  },
  mutations: {
    setstorages(state, storages) {
      state.storages = storages;
    },
    setVolumeSize(state, payload) {
      state.volumeSize = payload;
    },
    setIsLoading(state, flag) {
      state.isLoading = flag;
    },
    setListStorageTypeBilling(state, payload) {
      state.listStorageTypeBilling = payload;
    },
    setListInstanceRootDisk(state, payload) {
      state.listInstanceRootDisk = payload;
    },
    setDefaultPriceStorage(state, payload) {
      state.defaultPriceStorage = payload;
    },
  },
  actions: {
    fetchVolumeSize: async (context, payload = { limit: 10, page: 1, search: "", organization_id: null }) => {
      // if(!payload.organization_id) payload.organization_id = await libProject.getCurrentOrgID()
      let data = await axios.instance.get("/flavor/storage", { params: { ...payload } });
      const result = data.data.data.storage.filter((x) => x.status === "active" && !x.is_default && x.volume_size).sort(sortBySize);
      context.commit("setVolumeSize", result);
      return result;
    },
    fetchstorages: async (context, payload = {}) => {
      const currentProj = context.rootState.SUPERADMIN.currentProj;
      const { instance_id } = payload;
      let params = {};
      if (currentProj) {
        params = {
          pro_id: currentProj.id,
        };
      }
      if (instance_id) {
        params = {
          instance_id,
        };
      }
      context.commit("setstorages", []);
      context.commit("setIsLoading", true);
      return await axios.instance
        .get("/user/storages", { params })
        .then((response) => {
          const data = response.data.data.map((x) => ({
            id: x.id,
            createdate: x.created_at,
            createdateymd: x.created_date,
            billing_type: x.billing_type,
            instance: x.instance
              ? {
                  id: x.instance ? x.instance.id : null,
                  instanceName: x.instance ? x.instance.name : null,
                  instanceType: "4 GB",
                  openstack_vm_uuid: x.instance ? x.instance.openstack_vm_uuid : null,
                  region: {
                    regionid: x.instance ? x.instance.region : null,
                  },
                }
              : null,
            project: x.project,
            path: x.path,
            region: {
              city: x.instance ? x.instance.region : "-",
              regionid: x.instance ? x.instance.region : "-",
            },
            proj_region: x.region,
            size: x.size + " GB",
            name: x.name,
            storage_type: x.package_storage && x.package_storage.type && x.package_storage.type.name ? x.package_storage.type.name : "-",
            zone_name: x.zone_name,
            package_storage: x.package_storage,
          }));
          context.commit("setstorages", data);
          context.commit("setIsLoading", false);
        })
        .catch((e) => {
          context.commit("setIsLoading", false);
          context.dispatch("HOMEPAGE/showErrorToast", e.message, { root: true });
        });
    },

    storagesfetch: async (context, payload = {}) => {
      const currentProj = localStorage.getItem("projectid");
      const { instance_id } = payload;
      let params = {};
      if (currentProj) {
        params = {
          pro_id: currentProj,
        };
      }
      if (instance_id) {
        params = {
          instance_id,
        };
      }

      return await axios.instance
        .get("/user/storages", { params })
        .then((response) => {
          const data = response.data.data.map((x) => ({
            id: x.id,
            createdate: x.created_at,
            createdateymd: x.created_date,
            instance: x.instance
              ? {
                  id: x.instance ? x.instance.id : null,
                  instanceName: x.instance ? x.instance.name : null,
                  instanceType: "4 GB",
                  openstack_vm_uuid: x.instance ? x.instance.openstack_vm_uuid : null,
                  region: {
                    regionid: x.instance ? x.instance.region : null,
                  },
                }
              : null,
            project: x.instance && x.instance.project ? x.instance.project.name : null,
            region: {
              city: x.instance ? x.instance.region : "-",
              regionid: x.instance ? x.instance.region : "-",
            },
            storage_type: x.package_storage ? x.package_storage.type.name : "-",
            size: x.size + " GB",
            name: x.name,
            zone_name: x.zone_name,
            package_storage: x.package_storage,
            path: x.path,
          }));
          context.commit("setstorages", data);
        })
        .catch((e) => {
          context.dispatch("HOMEPAGE/showErrorToast", e.message, { root: true });
        });
    },

    createstorage: async ({ commit, dispatch, rootState }, payload) => {
      try {
        commit("setIsLoading", true);
        const user_role = rootState.ROLEPERMISSION.userrole;
        if (user_role == "Superadmin") {
          const currentOrg = rootState.SUPERADMIN.currentOrg;
          let data = await axios.instance.post(`/superadmin/storages/${currentOrg.id}`, payload);
          commit("setIsLoading", false);
          dispatch("HOMEPAGE/showSuccessToast", "Storage has been successfully created.", { root: true });
          dispatch("fetchstorages");
          return data;
        }

        let response = await axios.instance.post("/user/storages", payload);

        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showSuccessToast", "Storage has been successfully created.", { root: true });
        dispatch("fetchstorages");
        return response;
      } catch (e) {
        const errorMessage = e.response.data.data;
        commit("setIsLoading", false);
        if (errorMessage.includes("Please upgrade your organization")) {
          commit("DASHBOARD/setopendialogreachlimit", true, { root: true });
          return;
        } else if (errorMessage.includes("Please contact")) dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        else if (errorMessage.includes("Service activation")) dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        else if (errorMessage.includes("storage name must be unique")) dispatch("HOMEPAGE/showErrorToast", "Storage name already exists.", { root: true });
        else if (errorMessage.includes("total volume voucher has reached limit"))
          dispatch("HOMEPAGE/showErrorToast", "Storage quota has reached the limit!", { root: true });
        else if (errorMessage.includes("total volume size voucher has reached limit"))
          dispatch("HOMEPAGE/showErrorToast", "Storage size has reached the limit!", { root: true });
        else if (errorMessage.includes("Storage has exceeded the limit"))
          dispatch("HOMEPAGE/showErrorToast", "Storages has exceeded the limit. Please contact administrator.", { root: true });
        else if (errorMessage.includes("Storage sizes has exceeded the limit"))
          dispatch("HOMEPAGE/showErrorToast", "Storage sizes has exceeded the limit. Please contact administrator.", { root: true });
        else if (errorMessage.includes("cannot attach basic resource to trial resource"))
          dispatch("HOMEPAGE/showErrorToast", "Cannot attach basic resource to trial resource.", { root: true });
        else if (errorMessage.includes("voucher has already expired")) dispatch("HOMEPAGE/showErrorToast", "This voucher is expired.", { root: true });
        else if (e && e.response && e.response.data && e.response.data.data.includes("Your balance not enough")) {
          commit("DASHBOARD/setopendialogbalance", true, { root: true });
          commit("DASHBOARD/setopendialogbalancemsg", e.response.data.data, { root: true });
        } else if (e && e.response && e.response.data && e.response.data.data.includes("Maximal limit for attached storage")) {
          dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
        } else if(isLimitError(e.response.data.data))
          dispatch("HOMEPAGE/showErrorToast", createLimitErrorMsg(e.response.data.data), { root: true });
        else dispatch("HOMEPAGE/showErrorToast", "Failed to create storage.", { root: true });
      }
    },
    attachStorage: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        let data = await axios.instance.post("/user/storages/attach", payload);
        dispatch("fetchstorages");
        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showSuccessToast", "Storage has been successfully attached.", { root: true });
        return data;
      } catch (e) {
        commit("setIsLoading", false);
        let errmsg = "Sorry, there was an error while submitting data";
        const error = e.response.data.data;
        if (e.response && e.response.data) {
          errmsg = e.response.data.message || e.response.data.data;
        }

        if (error.includes("cannot attach basic resource to trial resource")) {
          errmsg = "Cannot attach trial resource into paid resources";
        } else if (isLimitError(error)) {
            errmsg = createLimitErrorMsg(error);
        }

        dispatch("HOMEPAGE/showErrorToast", errmsg, { root: true });
      }
    },
    deletestorage: async ({ commit, dispatch }, id) => {
      try {
        commit("setIsLoading", true);
        let data = await axios.instance.delete("/user/storages/delete/" + id);
        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showSuccessToast", "Storage has been successfully deleted.", { root: true });
        dispatch("fetchstorages");
        return data;
      } catch (e) {
        const errorMessage = e.response.data.data;
        commit("setIsLoading", false);
        if (errorMessage.includes("Volume status must be available"))
          dispatch(
            "HOMEPAGE/showErrorToast",
            "Ensure to detach your storage from the instance and delete all snapshot attached to this storage, then please try again.",
            { root: true }
          );
        else dispatch("HOMEPAGE/showErrorToast", "Failed to delete storage.", { root: true });
      }
    },
    detachfrominstance: async ({ commit, dispatch }, payload) => {
      let input = {
        openstack_vm_uuid: payload.instance.openstack_vm_uuid,
        storage_id: payload.id,
      };

      try {
        commit("setIsLoading", true);
        let data = await axios.instance.post("/user/storages/detach", input);
        if (payload.filterByInstance) dispatch("fetchstorages", { instance_id: payload.instance.id });
        else dispatch("fetchstorages");
        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showSuccessToast", "Storage has been successfully detached.", { root: true });
        return data;
      } catch (e) {
        dispatch("HOMEPAGE/showErrorToast", "Failed to detach storage.", { root: true });
        commit("setIsLoading", false);
      }
    },
    RESIZE_VOLUME: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        const response = await axios.instance.post("/user/storages/resize", payload);
        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showSuccessToast", "Storage size has been successfully increased.", { root: true });
        dispatch("fetchstorages");
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to increase storage size";

        if (e && e.response && e.response.data && e.response.data.data.includes("Your balance is not enough")) {
          commit("DASHBOARD/setopendialogbalance", true, { root: true });
          commit("DASHBOARD/setopendialogbalancemsg", e.response.data.data, { root: true });
        } else if (err.includes("Storage sizes has exceeded the limit"))
          errorMessage = "Storage sizes has exceeded the limit. Please contact the administrator.";
          else if (err.includes("apologies, but due to system limitations, resizing your old storage is not possible"))
          errorMessage = "Apologies, but due to system limitations, resizing your old storage is not possible."
          else if (isLimitError(err))
          errorMessage = createLimitErrorMsg(err);

        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsLoading", false);
      }
    },
    getListStorageType: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/storage/type?${payload}`);
        commit("setListStorageTypeBilling", response.data.data);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListInstanceRootDisk: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/storage?${payload}`);
        commit("setListInstanceRootDisk", response.data.data ? response.data.data : []);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getDefaultInstanceDataDisk: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/storage?${payload}`);
        commit("setDefaultInstanceDataDisk", response.data.data ? response.data.data : []);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getDefaultPriceStorage: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/storage/default?${payload}`);
        commit("setDefaultPriceStorage", response.data.data);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getDefaultInstancePriceDataDisk: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/storage/default?${payload}`);
        commit("setDefaultInstancePriceDataDisk", response.data.data);
        return response;
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    syncStorage: async ({dispatch}, payload) => {
      try {
        const projectid = localStorage.getItem('projectid');
        const storageID = payload.storageID;
        const response = await axios.instance.get(`/user/storages/sync?project_id=${projectid}&storage_id=${storageID}`);
        
        dispatch("HOMEPAGE/showSuccessToast", `${response.data.message}`, { root: true });

        return response;
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
        return error.response.data;
      }
      
    }
  },
};
