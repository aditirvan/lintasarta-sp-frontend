import axios from "@/lib/axios";
import { ActionContext, Module } from "vuex";
interface State {
  listmailbox: Array<any>;
  listOrgMailbox: Array<any>;
  pagination: any;
  isLoading: Boolean;
}
const store: Module<State, any> = {
  namespaced: true,
  state: {
    listmailbox: [],
    listOrgMailbox: [],
    pagination: {},
    isLoading: false,
  },
  mutations: {
    setlistmailbox: (state: State, payload: any) =>
      (state.listmailbox = payload),
    setListOrgMailbox: (state: State, payload: any) =>
      (state.listOrgMailbox = payload),
    setpagination: (state: State, payload: any) => (state.pagination = payload),
    setIsLoading: (state: State, payload: any) => (state.isLoading = payload),
  },
  actions: {
    fetchlistmailbox: async (
      context: ActionContext<State, any>,
      payload: any = { page: 1, itemsPerPage: 10 }
    ) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .get("/emaillog/list", {
            params: {
              page: payload.page,
              limit: payload.itemsPerPage,
              status: payload.status,
              organization_id: payload.organization_id,
              startDate: payload.startDt,
              endDate: payload.endDt,
              sortBy: payload.sortBy,
              sortDesc: payload.sortDesc,
            },
          })
          .then((res: any) => {
            resolve(res);
            const data = res.data.data;
            const { email_logs, pagination } = data;
            context.commit("setlistmailbox", email_logs);
            context.commit("setpagination", pagination);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    resendemail: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .post("/superadmin/manageorg/resend-email", payload)
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

    fetchOrgMailbox: async (context: ActionContext<State, any>) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .get("/emaillog/orgs")
          .then((res: any) => {
            context.commit("setListOrgMailbox", res.data.data);
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
