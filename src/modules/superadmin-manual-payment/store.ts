import axios from "@/lib/axios";
import { ActionContext, Module } from "vuex";
import moment from "moment";
interface State {
  manualPayment: any;
  pagination: any;
  isLoading: Boolean;
}

const store: Module<State, any> = {
  namespaced: true,
  state: {
    manualPayment: [],
    pagination: {},
    isLoading: false,
  },
  mutations: {
    setIsLoading: (state: State, payload: any) => (state.isLoading = payload),
    setManualPayment: (state: State, payload: any) =>
      (state.manualPayment = payload),
    setPagination: (state: State, payload: any) => (state.pagination = payload),
  },
  getters: {
    getManualPayment: (state: State, getter: any) => {
      return state.manualPayment.map((value: any) => {
        return {
          id: value.id,
          organization_id: value.organization_id,
          organization_name: value.organization.name,
          project_name: value.project.name,
          total: value.amount,
          date: moment(value.date).format("DD/MM/YYYY"),
          description: value.description,
          payment_method: value.payment_type,
          status: value.status,
        };
      });
    },
    getPagination: (state: State, getter: any) => {
      return state.pagination;
    },
  },
  actions: {
    fetchManualPayment: async (
      context: ActionContext<State, any>,
      payload: any = { page: 1, itemsPerPage: 10 }
    ) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .get("/manual-payment/list", {
            params: {
              paginate: true,
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
            const { manual_payment, pagination } = data;
            context.commit("setManualPayment", manual_payment);
            context.commit("setPagination", pagination);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
            context.commit("setIsLoading", false);
          });
      });
    },
    createManualPayment: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .post("manual-payment/create", payload)
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
    editManualPayment: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .put(`manual-payment/update/${payload.id}`, payload.data)
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
  },
};

export default store;
