import { ActionContext, Module } from "vuex";
import libProject from "@/lib/project";
import axios from "@/lib/axios";
import { async } from "rxjs";
import { AxiosResponse } from "axios";
interface State {
  sshkeys: Array<any>;
  pagination: any;
  isLoading: Boolean;
}
const store: Module<State, any> = {
  namespaced: true,
  state: {
    sshkeys: [],
    pagination: {},
    isLoading: false,
  },
  mutations: {
    setsshkeys: (state: State, payload: any) => (state.sshkeys = payload),
    setIsLoading: (state: State, payload: any) => (state.isLoading = payload),
    setPagination: (state: State, payload: any) => (state.pagination = payload),
  },
  getters: {
    userProfile(state, getters, rootState, rootGetters) {
      return rootState["ROLEPERMISSION/getUserProfile"];
    },
  },
  actions: {
    changepassword: async (context, payload) => {
      return await axios.instance.post("/user/change-password", payload);
    },
    updateprofile: async (context: ActionContext<State, any>, payload: any) => {
      return await axios.instance.put(
        `/user/organization/profile/member/${payload.id}`,
        payload
      );
    },
    deletesshkey: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        return axios.instance
          .delete(`/user/keypair/${payload}`)
          .then((res) => {
            resolve();
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    updatesshkey: async (context: ActionContext<State, any>, payload: any) => {
      return new Promise<void>((resolve, reject) => {
        context.commit("setIsLoading", true);
        return axios.instance
          .put(`/user/keypair/${payload.id}`, payload)
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
    fetchsshkeys: async (
      context: ActionContext<State, any>,
      payload: any = { page: 1 }
    ) => {
      context.commit("setIsLoading", true);
      const profileid = context.rootState.ROLEPERMISSION.userprofile.id;
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .get(`/user/keypair/user/${profileid}`, {
            params: {
              page: payload.page,
              limit: payload.itemsPerPage || 10,
              paginate: true,
            },
          })
          .then((res: any) => {
            resolve(res);
            const data = res.data.data;
            const { keypair, pagination } = data;
            context.commit("setsshkeys", keypair);
            context.commit("setPagination", pagination);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
            context.commit("setIsLoading", false);
          });
      });
    },
    createsshkey: async (context: ActionContext<State, any>, payload: any) => {
      // const projectID = await libProject.getActiveProjectID()
      // payload.project_id = projectID;
      payload.content = payload.sshkey;
      // payload.project_id = projectID;
      delete payload.sshkey;

      return new Promise<void>((resolve, reject) => {
        context.commit("setIsLoading", true);
        return axios.instance
          .post("/user/keypair", payload)
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
  },
};

export default store;
