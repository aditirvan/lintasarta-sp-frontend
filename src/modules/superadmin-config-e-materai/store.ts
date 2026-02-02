import axios from "@/lib/axios";
import { ActionContext, Module } from "vuex";
import moement from "moment";
import moment from "moment";
interface State {
  stamps: any;
  pagination: any;
  isLoading: Boolean;
}

const store: Module<State, any> = {
  namespaced: true,
  state: {
    stamps: [],
    pagination: {},
    isLoading: false,
  },
  mutations: {
    setIsLoading: (state: State, payload: any) => (state.isLoading = payload),
    setStamps: (state: State, payload: any) => (state.stamps = payload),
    setPagination: (state: State, payload: any) => (state.pagination = payload),
  },
  getters: {
    getStamps: (state: State, getter: any) => {
      return state.stamps.map((value: any) => {
        return {
          id: value.id,
          stamp_code: value.stamp_code,
          status: value.status,
          expired_at: moment(value.expired_at).format("DD/MM/YYYY"),
          created_at: value.created_at,
        };
      });
    },
    getPagination: (state: State, getter: any) => {
      return state.pagination;
    },
  },
  actions: {
    fetchStamps: async (
      context: ActionContext<State, any>,
      payload: any = { page: 1, itemsPerPage: 10 }
    ) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .get("/stamp/list", {
            params: {
              page: payload.page,
              limit: payload.itemsPerPage,
              search: payload.search,
              sortBy: payload.sortBy,
              sortDesc: payload.sortDesc,
            },
          })
          .then((res: any) => {
            resolve(res);
            const data = res.data.data;
            const { stamp, pagination } = data;
            context.commit("setStamps", stamp);
            context.commit("setPagination", pagination);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
            context.commit("setIsLoading", false);
          });
      });
    },
    createStamp: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .post("stamp/create", payload)
          .then((res: any) => {
            resolve(res);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
            context.commit("setIsLoading", false);
          });
      });
    },
    editStamp: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .put(`stamp/update`, payload)
          .then((res: any) => {
            resolve(res);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            context.commit("setIsLoading", false);
            reject(err);
          });
      });
    },
    editStatusStamp: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .put(`stamp/status`, payload)
          .then((res: any) => {
            resolve(res);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
            context.commit("setIsLoading", false);
          });
      });
    },
    deleteStamp: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      console.log(payload);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .delete(`stamp/delete/${payload}`)
          .then((res: any) => {
            resolve(res);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};

export default store;
