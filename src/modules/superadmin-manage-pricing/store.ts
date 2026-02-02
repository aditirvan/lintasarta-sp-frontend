import { Module } from "vuex";
import axios from "axios";

function makeHeaders() {
  const params = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${params}` },
  };
}

interface state {
  loadingCreateProduct: Boolean;
  listProduct: Array<any>;
  detailProduct: Object;
  statusDelete: Number;
  loadingListProduct: Boolean;
  listItems: Array<any>;
  listTags: Array<any>;
  listService: Array<any>;
  loadingListItems: Boolean;
  loadingListTags: Boolean;
  loadingCreateTags: Boolean;
  loadingDetail: Boolean;
  loadingUpdate: Boolean;
  loadingGet: Boolean;
  detailTags: Object;
  detailItem: Object;
  detailService: Object;
  detailServiceTag: Array<any>;
  defaultServiceTag: Array<any>;
  listServiceProduct: Array<any>;
  listFlavor: Array<any>;
  totalProduct: Number;
  totalTags: Number;
  totalItems: Number;
  totalListServiceProduct: Number;
  totalFlavor: Number;
  detailFlavor: Object;
  listServiceUseFlavor: Array<any>;
  listActivity: Object;
  loadingActivity: Boolean;
}

const store: Module<state, any> = {
  namespaced: true,
  state: {
    loadingCreateProduct: false,
    listProduct: [],
    detailProduct: {},
    statusDelete: 0,
    loadingListProduct: false,
    listItems: [],
    listTags: [],
    listService: [],
    loadingListItems: false,
    loadingListTags: false,
    loadingCreateTags: false,
    loadingDetail: false,
    loadingGet: false,
    loadingUpdate: false,
    detailTags: {},
    detailItem: {},
    detailService: {},
    detailServiceTag: [],
    defaultServiceTag: [],
    listServiceProduct: [],
    listFlavor: [],
    totalProduct: 0,
    totalTags: 0,
    totalItems: 0,
    totalListServiceProduct: 0,
    totalFlavor: 0,
    detailFlavor: {},
    listServiceUseFlavor: [],
    listActivity: {},
    loadingActivity: false,
  },
  getters: {
    loadingCreateProduct: (state) => {
      return state.loadingCreateProduct;
    },
    listProduct: (state) => {
      return state.listProduct;
    },
    detailProduct: (state) => {
      return state.detailProduct;
    },
    statusDelete: (state) => {
      return state.statusDelete;
    },
    loadingListProduct: (state) => {
      return state.loadingListProduct;
    },
    listItems: (state) => {
      return state.listItems;
    },
    listTags: (state) => {
      return state.listTags;
    },
    loadingListItems: (state) => {
      return state.loadingListItems;
    },
    loadingListTags: (state) => {
      return state.loadingListTags;
    },
    loadingCreateTags: (state) => {
      return state.loadingCreateTags;
    },
    detailTags: (state) => {
      return state.detailTags;
    },
    detailItem: (state) => {
      return state.detailItem;
    },
    listService: (state) => {
      return state.listService;
    },
    loadingDetail: (state) => {
      return state.loadingDetail;
    },
    detailService: (state) => {
      return state.detailService;
    },
    detailServiceTag: (state) => {
      return state.detailServiceTag;
    },
    defaultServiceTag: (state) => {
      return state.defaultServiceTag;
    },
    totalProduct: (state) => {
      return state.totalProduct;
    },
    totalTags: (state) => {
      return state.totalTags;
    },
    totalItems: (state) => {
      return state.totalItems;
    },
    totalListServiceProduct: (state) => {
      return state.totalListServiceProduct;
    },
    listServiceProduct: (state) => {
      return state.listServiceProduct;
    },
    listFlavor: (state) => {
      return state.listFlavor;
    },
    totalFlavor: (state) => {
      return state.totalFlavor;
    },
    loadingGet: (state) => {
      return state.loadingGet;
    },
    detailFlavor: (state) => {
      return state.detailFlavor;
    },
    loadingUpdate: (state) => {
      return state.loadingUpdate;
    },
    listServiceUseFlavor: (state) => {
      return state.listServiceUseFlavor;
    },
    listActivity: (state) => {
      return state.listActivity;
    },
    loadingActivity: (state) => {
      return state.loadingActivity;
    },
  },
  mutations: {
    setLoadingCreateProduct: (state: state, payload) => {
      state.loadingCreateProduct = payload;
    },
    setListProduct: (state: state, payload) => {
      state.listProduct = payload;
    },
    setDetailProduct: (state: state, payload) => {
      state.detailProduct = payload;
    },
    setStatusDelete: (state: state, payload) => {
      state.statusDelete = payload;
    },
    setLoadingListProduct: (state: state, payload) => {
      state.loadingListProduct = payload;
    },
    setListItems: (state: state, payload) => {
      state.listItems = payload;
    },
    setListTags: (state: state, payload) => {
      state.listTags = payload;
    },
    setLoadingListItems: (state: state, payload) => {
      state.loadingListItems = payload;
    },
    setLoadingListTags: (state: state, payload) => {
      state.loadingListTags = payload;
    },
    setLoadingCreateTags: (state: state, payload) => {
      state.loadingCreateTags = payload;
    },
    setDetailTags: (state: state, payload) => {
      state.detailTags = payload;
    },
    setListService: (state: state, payload) => {
      state.listService = payload;
    },
    setDetailItem: (state: state, payload) => {
      state.detailItem = payload;
    },
    setLoadingDetail: (state: state, payload) => {
      state.loadingDetail = payload;
    },
    setDetailService: (state: state, payload) => {
      state.detailService = payload;
    },
    setDetailServiceTag: (state: state, payload) => {
      state.detailServiceTag = payload;
    },
    setDefaultServiceTag: (state: state, payload) => {
      state.defaultServiceTag = payload;
    },
    setTotalProduct: (state: state, payload) => {
      state.totalProduct = payload;
    },
    setTotalTags: (state: state, payload) => {
      state.totalTags = payload;
    },
    setTotalItems: (state: state, payload) => {
      state.totalItems = payload;
    },
    setTotalListServiceProduct: (state: state, payload) => {
      state.totalListServiceProduct = payload;
    },
    setListServiceProduct: (state: state, payload) => {
      state.listServiceProduct = payload;
    },
    setListFlavor: (state: state, payload) => {
      state.listFlavor = payload;
    },
    setTotalFlavor: (state: state, payload) => {
      state.totalFlavor = payload;
    },
    setLoadingGet: (state: state, payload) => {
      state.loadingGet = payload;
    },
    setDetailFlavor: (state: state, payload) => {
      state.detailFlavor = payload;
    },
    setLoadingUpdate: (state: state, payload) => {
      state.loadingUpdate = payload;
    },
    setListServiceUseFlavor: (state: state, payload) => {
      state.listServiceUseFlavor = payload;
    },
    setListActivity: (state: state, payload) => {
      state.listActivity = payload;
    },
    setLoadingActivity: (state: state, payload) => {
      state.loadingActivity = payload;
    },
  },
  actions: {
    postCreateProduct: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCreateProduct", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_BILLING}/product/create`, payload, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingCreateProduct", false);
          dispatch("HOMEPAGE/showSuccessToast", `Product has successfully created!`, { root: true });
          setTimeout(() => {
            window.location.href = "/manage-pricing/product";
          }, 1000);
        }
      } catch (error) {
        commit("setLoadingCreateProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    getListProduct: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingListProduct", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/product/list?${payload}`, makeHeaders());
        commit("setLoadingListProduct", false);
        commit("setListProduct", response.data.data.rows);
        commit("setTotalProduct", response.data.data.total_rows);
      } catch (error) {
        commit("setLoadingListProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    getDetailProduct: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/product/detail/${payload}`, makeHeaders());
        commit("setDetailProduct", response.data.data);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    updateProduct: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCreateProduct", true);
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL_BILLING}/product/update/${payload.id}`, payload.body, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingCreateProduct", false);
          dispatch("HOMEPAGE/showSuccessToast", `Product has successfully updated!`, { root: true });
          const params = new URLSearchParams();
          params.append("limit", "10");
          params.append("page", "1");
          dispatch("getListProduct", params);
        }
        return response;
      } catch (error) {
        commit("setLoadingCreateProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    deleteProduct: async ({ commit, dispatch }, payload) => {
      commit("setStatusDelete", 0);
      try {
        commit("setLoadingCreateProduct", true);
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL_BILLING}/product/delete/${payload}`, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingCreateProduct", false);
          dispatch("HOMEPAGE/showSuccessToast", `Product has successfully deleted!`, { root: true });
          commit("setStatusDelete", response.status);
          const params = new URLSearchParams();
          params.append("limit", "10");
          params.append("page", "1");
          dispatch("getListProduct", params);
        }
      } catch (error) {
        commit("setLoadingCreateProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    getListItems: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingListItems", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/item/list?${payload}`, makeHeaders());
        commit("setLoadingListItems", false);
        commit("setListItems", response.data.data.rows);
        commit("setTotalItems", response.data.data.total_rows);
        return response;
      } catch (error) {
        commit("setLoadingListItems", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    getListTags: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingListTags", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/tag/list?${payload}`, makeHeaders());
        commit("setLoadingListTags", false);
        commit("setListTags", response.data.data.rows ? response.data.data.rows : []);
        commit("setTotalTags", response.data.data.total_rows);
      } catch (error) {
        commit("setLoadingListTags", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    getDetailTags: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/tag/detail/${payload}`, makeHeaders());
        commit("setDetailTags", response.data.data);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    postCreateTags: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCreateTags", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_BILLING}/tag/create`, payload, makeHeaders());
        commit("setLoadingListTags", false);
        if (response.status == 200) {
          commit("setLoadingCreateTags", false);
          dispatch("HOMEPAGE/showSuccessToast", `Tags has successfully created!`, { root: true });
          setTimeout(() => {
            window.location.href = "/manage-pricing/tags";
          }, 1000);
        }
      } catch (error) {
        commit("setLoadingCreateTags", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    updateTags: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCreateTags", true);
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL_BILLING}/tag/update/${payload.id}`, payload.body, makeHeaders());
        commit("setLoadingListTags", false);
        if (response.status == 200) {
          commit("setLoadingCreateTags", false);
          dispatch("HOMEPAGE/showSuccessToast", `Tags has successfully updated!`, { root: true });
          const params = new URLSearchParams();
          params.append("limit", "10");
          params.append("page", "1");
          dispatch("getListTags", params);
        }
        return response;
      } catch (error) {
        commit("setLoadingCreateTags", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    deleteTags: async ({ commit, dispatch }, payload) => {
      commit("setStatusDelete", 0);
      try {
        commit("setLoadingCreateProduct", true);
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL_BILLING}/tag/delete/${payload}`, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingCreateProduct", false);
          dispatch("HOMEPAGE/showSuccessToast", `Tags has successfully deleted!`, { root: true });
          commit("setStatusDelete", response.status);
          const params = new URLSearchParams();
          params.append("limit", "10");
          params.append("page", "1");
          dispatch("getListTags", params);
        }
      } catch (error) {
        commit("setLoadingCreateProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    getListService: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingListProduct", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/service/list`, makeHeaders());
        commit("setLoadingListProduct", false);
        commit("setListService", response.data.data);
      } catch (error) {
        commit("setLoadingListProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    getListServiceProduct: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingListProduct", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/service/product/list/${payload.id}?${payload.params}`, makeHeaders());
        commit("setLoadingListProduct", false);
        commit("setListServiceProduct", response.data.data.rows);
        commit("setTotalListServiceProduct", response.data.data.total_rows);
      } catch (error) {
        commit("setLoadingListProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    postCreateItem: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCreateTags", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_BILLING}/item/create`, payload, makeHeaders());
        commit("setLoadingListTags", false);
        if (response.status == 200) {
          commit("setLoadingCreateTags", false);
          dispatch("HOMEPAGE/showSuccessToast", `Item has successfully created!`, { root: true });
          setTimeout(() => {
            window.location.href = "/manage-pricing/items";
          }, 1000);
        }
      } catch (error) {
        commit("setLoadingCreateTags", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    getDetailItem: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingDetail", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/item/detail/${payload}`, makeHeaders());
        commit("setDetailItem", response.data.data);
        // commit("setDetailItem", response.data.data.service.service_tag);
        commit("setLoadingDetail", false);
      } catch (error) {
        commit("setLoadingDetail", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    updateItem: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCreateProduct", true);
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL_BILLING}/item/update/${payload.id}`, payload.body, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingCreateProduct", false);
          dispatch("HOMEPAGE/showSuccessToast", `Items has successfully updated!`, { root: true });
          setTimeout(() => {
            window.location.href = "/manage-pricing/items";
          }, 1000);
        }
      } catch (error) {
        commit("setLoadingCreateProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    deleteItem: async ({ commit, dispatch }, payload) => {
      commit("setStatusDelete", 0);
      try {
        commit("setLoadingCreateProduct", true);
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL_BILLING}/item/delete/${payload}`, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingCreateProduct", false);
          dispatch("HOMEPAGE/showSuccessToast", `Item has successfully deleted!`, { root: true });
          commit("setStatusDelete", response.status);
          const params = new URLSearchParams();
          params.append("limit", "10");
          params.append("page", "1");
          dispatch("getListItems", params);
        }
      } catch (error) {
        commit("setLoadingCreateProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    getDetailService: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/service/detail/${payload}`, makeHeaders());
        commit("setDetailService", response.data.data);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    postCreateService: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCreateProduct", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_BILLING}/service/create`, payload.body, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingCreateProduct", false);
          dispatch("HOMEPAGE/showSuccessToast", `Service has successfully created!`, { root: true });
          setTimeout(() => {
            window.location.href = `/manage-pricing/detail-product/${payload.name}/${payload.id}`;
          }, 1000);
        }
      } catch (error) {
        commit("setLoadingCreateProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    getDetaiServiceTag: async ({ commit, dispatch }, payload) => {
      try {
        if (payload.status == true) {
          commit("setDetailServiceTag", []);
        }
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/service/tag/${payload.id}`, makeHeaders());
        commit("setDetailServiceTag", response.data.data);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    getDefaultServiceTag: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/service/tag/${payload}`, makeHeaders());
        commit("setDefaultServiceTag", response.data.data);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    deleteService: async ({ commit, dispatch }, payload) => {
      commit("setStatusDelete", 0);
      try {
        commit("setLoadingCreateProduct", true);
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL_BILLING}/service/delete/${payload.id.idService}`, makeHeaders());
        if (response.status == 200) {
          const xxx = {
            params: payload.params,
            id: payload.id.idProduct,
          };
          commit("setLoadingCreateProduct", false);
          dispatch("HOMEPAGE/showSuccessToast", `Service has successfully deleted!`, { root: true });
          commit("setStatusDelete", response.status);
          dispatch("getListServiceProduct", xxx);
        }
      } catch (error) {
        commit("setLoadingCreateProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    updateService: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCreateProduct", true);
        const response = await axios.put(
          `${process.env.VUE_APP_API_BASE_URL_BILLING}/service/update/${payload.params.service_id}`,
          payload.body,
          makeHeaders()
        );
        if (response.status == 200) {
          commit("setLoadingCreateProduct", false);
          dispatch("HOMEPAGE/showSuccessToast", `Service has successfully updated!`, { root: true });
          setTimeout(() => {
            window.location.href = `/manage-pricing/detail-product/${payload.params.nameProduct}/${payload.params.idProduct}`;
          }, 1000);
        }
      } catch (error) {
        commit("setLoadingCreateProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    postCreateFlavor: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingCreateProduct", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavortype/create`, payload, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingCreateProduct", false);
          dispatch("HOMEPAGE/showSuccessToast", `Flavor has successfully created!`, { root: true });
          setTimeout(() => {
            window.location.href = "/manage-pricing/flavor-type";
          }, 1000);
        }
      } catch (error) {
        commit("setLoadingCreateProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    getListFlavor: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingGet", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavortype/list?${payload}`, makeHeaders());
        commit("setListFlavor", response.data.data.rows);
        commit("setTotalFlavor", response.data.data.total_rows);
        commit("setLoadingGet", false);
      } catch (error) {
        commit("setLoadingGet", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    getDetailFlavor: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingDetail", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavortype/detail/${payload}`, makeHeaders());
        commit("setDetailFlavor", response.data.data);
        commit("setLoadingDetail", false);
      } catch (error) {
        commit("setLoadingDetail", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    deleteFlavor: async ({ commit, dispatch }, payload) => {
      commit("setStatusDelete", 0);
      try {
        commit("setLoadingCreateProduct", true);
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavortype/delete/${payload}`, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingCreateProduct", false);
          dispatch("HOMEPAGE/showSuccessToast", `Flavor has successfully deleted!`, { root: true });
          commit("setStatusDelete", response.status);
          const params = new URLSearchParams();
          params.append("limit", "10");
          params.append("page", "1");
          dispatch("getListFlavor", params);
        }
      } catch (error) {
        commit("setLoadingCreateProduct", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    updateFlavor: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingUpdate", true);
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavortype/update/${payload.id}`, payload.body, makeHeaders());
        if (response.status == 200) {
          commit("setLoadingUpdate", false);
          dispatch("HOMEPAGE/showSuccessToast", `Flavor has successfully updated!`, { root: true });
          setTimeout(() => {
            window.location.href = "/manage-pricing/flavor-type";
          }, 1000);
        }
      } catch (error) {
        commit("setLoadingUpdate", false);
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    getServiceUseFlavor: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/service/use-flavor/list`, makeHeaders());
        commit("setListServiceUseFlavor", response.data.data.value);
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },
    geListActivity: async ({ commit, dispatch }, payload) => {
      try {
        commit("setLoadingActivity", true);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/superadmin/manageuser/pricing/activity?${payload}`, makeHeaders());
        commit("setListActivity", response.data.data);
        commit("setLoadingActivity", false);
        return response;
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
        commit("setLoadingActivity", false);
      }
    },
  },
};

export default store;
