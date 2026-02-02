import axiosDbaas from "@/lib/axiosDbaas";
import axios from "@/lib/axios";
import { ActionContext, Module } from "vuex";
import moment from "moment";

interface State {
  userStatus: any;
  resRdbms: any;
  isLoading: Boolean;
  dbaasLimit: any;
}

const store: Module<State, any> = {
  namespaced: true,
  state: {
    userStatus: {},
    resRdbms: {},
    isLoading: false,
    dbaasLimit: {}

  },
  mutations: {
    setIsLoading: (state: State, payload: any) => (state.isLoading = payload),
    setUserStatus: (state: State, payload: any) => (state.userStatus = payload),
    setResRdbms: (state: State, payload: any) => (state.resRdbms = payload),
    setDbaasLimit: (state: State, payload: any) => (state.dbaasLimit = payload),
  },
  actions: {
    checkUserRDBMS: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .post("/dbaas/verified", payload)
          .then((res: any) => {
            resolve(res);
            const data = res.data.data;
            context.commit("setUserStatus", data);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    loginRDBMS: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .post("/dbaas/login", payload)
          .then((res: any) => {
            resolve(res);
            const data = res.data.data;
            context.commit("setResRdbms", data);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    fetchDbaasLimit: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axiosDbaas.instance
          .get("/dbaas-connector/project/get-limit")
          .then((res: any) => {
            resolve(res);
            const data = res.data;
            context.commit("setDbaasLimit", data);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            context.commit("setIsLoading", false);
            reject(err);
          });
      });
    },
    updateDbaasLimit: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axiosDbaas.instance
          .post("/dbaas-connector/project/set-limit", payload)
          .then((res: any) => {
            resolve(res);
            const data = res.data;
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            context.commit("setIsLoading", false);
            reject(err);
          });
      });
    }
  },
};

export default store;
