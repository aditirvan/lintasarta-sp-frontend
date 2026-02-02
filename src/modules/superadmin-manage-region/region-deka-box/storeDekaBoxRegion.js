import axios from "@/lib/axios";

const storeObjectStorageRegion = {
  namespaced: true,
  state: {
    regions: [],
    region: {},
    isRegionLoading: false,
    regionPaginator: {
      count: 1,
      totalpage: 1,
      page: 1,
      limit: 10,
    },
    listRegionDekabox:{},
    isBucketLoading:false,
    buckets:[],
    bucket:{},
  },
  mutations: {
    setRegions: (state, payload) => (state.regions = payload),
    setRegion: (state, payload) => (state.region = payload),
    setIsRegionLoading: (state, payload) => (state.isRegionLoading = payload),
    setListRegionDekabox: (state, payload) => (state.listRegionDekabox = payload),
    setIsBucketLoading:(state, payload) => (state.isBucketLoading = payload),
    setBuckets:(state,payload)=>(state.buckets=payload),
    setBucket:(state,payload)=>(state.bucket=payload)
  },
  actions: {
    createRegion: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsRegionLoading", true);
        const response = await axios.instance.post(`/object-storage-region/create`, payload);
        dispatch("fetchRegions");
        dispatch("HOMEPAGE/showSuccessToast", "New region has been successfully created", { root: true });
        commit("setIsRegionLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to create new region";

        if (err.includes("s3 region name already exist")) errorMessage = "S3 Region name already exists.";
        else if (err && err.includes("region name already exist")) errorMessage = "Region Name already exists";
        commit("setIsRegionLoading", false);
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        return e.response;
      }
    },
    updateRegion: async ({ commit, dispatch }, payload) => {
      try {
        const { ID } = payload;
        delete payload.ID;
        commit("setIsRegionLoading", true);
        const response = await axios.instance.put(`/object-storage-region/update/${ID}`, payload);
        commit("setIsRegionLoading", false);
        dispatch("fetchRegions");
        dispatch("HOMEPAGE/showSuccessToast", "Region has been successfully updated", { root: true });
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to update region";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsRegionLoading", false);
        return e.response;
      }
    },
    fetchRegions: async ({ commit, dispatch, rootState }, payload = { page: 1, search: "", order_column: null, order_by: null }) => {
      try {
        if (payload.limit) payload.limit = rootState["DEKAFLEXIREGION"].regionPaginator.limit;
        commit("setIsRegionLoading", true);
        const response = await axios.instance.get(`/object-storage-region/list`, {
          params: { ...payload },
        });
        commit("setIsRegionLoading", false);
        commit("setRegions", response.data.data);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get list of regions";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsRegionLoading", false);
        return e.response;
      }
    },
    fetchRegionByID: async ({ commit, dispatch }, regionID) => {
      try {
        commit("setIsRegionLoading", true);
        const response = await axios.instance.get(`/object-storage-region/detail/${regionID}`);
        commit("setRegion", response.data.data);
        commit("setIsRegionLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get region detail";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsRegionLoading", false);
        return e.response;
      }
    },
    deleteRegionByID: async ({ commit, dispatch }, regionID) => {
      try {
        commit("setIsRegionLoading", true);
        const response = await axios.instance.delete(`/object-storage-region/delete/${regionID}`);
        commit("setIsRegionLoading", false);
        dispatch("fetchRegions");
        dispatch("HOMEPAGE/showSuccessToast", "Region has been successfully deleted", { root: true });
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to delete region";
        if (err.includes("please detach deka box before delete object storage region"))
          errorMessage = "Please detach dekabox before delete the region!";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsRegionLoading", false);
        return e.response;
      }
    },
    updateStatus: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsRegionLoading", true);
        const response = await axios.instance.put(`/object-storage-region/${payload.status}/${payload.id}`);
        if (response.status == 200) {
          commit("setIsRegionLoading", false);
          dispatch("fetchRegions");
          dispatch("HOMEPAGE/showSuccessToast", "Status has been successfully updated", { root: true });
        }
        return response;
      } catch (e) {
        const err = e.response.data.data;
        // let errorMessage = "A problem encountered while trying to update region";
        dispatch("HOMEPAGE/showErrorToast", err, { root: true });
        commit("setIsRegionLoading", false);
        return e.response;
      }
    },

    fetchListRegion: async ({ commit, dispatch }, regionID) => {
      try {
        commit("setIsRegionLoading", true);
        const response = await axios.instance.get(`/object-storage-region/list-region/${regionID}`);
        commit("setListRegionDekabox", response.data.data);
        commit("setIsRegionLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get region detail";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsRegionLoading", false);
        return e.response;
      }
    },

    updateRegionDekabox: async ({ commit, dispatch }, payload) => {
      try {
        const { ID } = payload;
        delete payload.ID;
        commit("setIsRegionLoading", true);
        const response = await axios.instance.put(`/object-storage-region/list-region`, payload);
        commit("setIsRegionLoading", false);
        dispatch("fetchRegions");
        dispatch("HOMEPAGE/showSuccessToast", "List Region has been successfully updated", { root: true });
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to update region";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsRegionLoading", false);
        return e.response;
      }
    },
    fetchBuckets: async ({ commit, dispatch }, id) => {
      try {
        commit("setIsBucketLoading", true);
        const response = await axios.instance.get(`/object-storage-region/manage-bucket/${id}`);
        commit("setBuckets", response.data.data);
        commit("setIsBucketLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get buckets detail";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsBucketLoading", false);
        return e.response;
      }
    },
    fetchBucketById: async ({ commit, dispatch }, id) => {
      try {
        commit("setIsBucketLoading", true);
        const response = await axios.instance.get(`/object-storage-region/manage-bucket-detail/${id}`);
        commit("setBucket", response.data.data);
        commit("setIsBucketLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get buckets detail";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsBucketLoading", false);
        return e.response;
      }
    },
    createBucketRegion: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsBucketLoading", true);
        const response = await axios.instance.post(`/object-storage-region/manage-bucket-create`, payload);
        dispatch("HOMEPAGE/showSuccessToast", "New bucket has been successfully created", { root: true });
        commit("setIsBucketLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to create new bucket";
        commit("setIsBucketLoading", false);
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        return e.response;
      }
    },

    deletehBucketById: async ({ commit, dispatch }, id) => {
      try {
        commit("setIsBucketLoading", true);
        const response = await axios.instance.delete(`/object-storage-region/manage-bucket/${id}`);
        // commit("setBucket", response.data.data);
        commit("setIsBucketLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get buckets detail";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsBucketLoading", false);
        return e.response;
      }
    },
    updateBucketRegion: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsBucketLoading", true);
        const response = await axios.instance.post(`/object-storage-region/manage-bucket-update`, payload);
        dispatch("HOMEPAGE/showSuccessToast", "Bucket has been successfully update", { root: true });
        commit("setIsBucketLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to create new region";
        commit("setIsBucketLoading", false);
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        return e.response;
      }
    },
    fetchBucketRegionByActiveObjectStorage: async ({ commit, dispatch }) => {
      try {
        commit("setIsBucketLoading", true);
        const response = await axios.instance.get(`/object-storage-region/manage-bucket-active`);
        commit("setBuckets", response.data.data);
        commit("setIsBucketLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get buckets detail";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsBucketLoading", false);
        return e.response;
      }
    },
    getActiveRegionById: async ({ commit, dispatch }, payload) => {
      try {
        console.log("getActiveRegionById ", payload);
        // user/object-storages-bucket/8d89964d-b7f3-4691-b662-25e3d7134cb9/vandy-karang-testing-predeploy
        const response = await axios.instance.get(`/object-storage-region/list-active`);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage = "A problem encountered while trying to get buckets detail";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        return e.response;
      }
    },



  },
};
export default storeObjectStorageRegion;
