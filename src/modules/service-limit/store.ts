import axios from "@/lib/axios";
import { async } from "rxjs";
import { ActionContext, Module } from "vuex";
interface State {
  limitservices: any;
  isLoading: Boolean;
}
const store: Module<State, any> = {
  namespaced: true,
  state: {
    limitservices: {},
    isLoading: false,
  },
  getters: {},
  mutations: {
    setServiceLimit: (state: State, payload: any) =>
      (state.limitservices = payload),
    setIsLoading: (state: State, payload: any) => (state.isLoading = payload),
  },
  actions: {
    fetchServiceLimit: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .get(`/project/${payload}/service-limits`)
          .then((res: any) => {
            resolve(res);
            const data = res.data.data;
            context.commit("setServiceLimit", data);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
            context.commit("setIsLoading", false);
          });
      });
    },
    updateServiceLimit: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .put(`/project/${payload.id}/service-limits`, payload.data)
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
    getObjectStorageLimit: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .get(`/project/${payload}/service-limits/object-storage`)
          .then((res: any) => {
            resolve(res);
            const data = res.data.data;
            context.commit("setServiceLimit", data);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
            context.commit("setIsLoading", false);
          });
      });
    },
    updateObjectStorageLimit: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .put(`/project/${payload.id}/service-limits/object-storage`, payload.data)
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
    // fetchDbaasLimit: async(
    //   context: ActionContext<State, any>,
    //   payload: any
    // ) => {

    // }
  },
};

export default store;
