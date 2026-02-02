import { Module, ActionContext } from "vuex";
import axios from "@/lib/axios";
export interface State {
  ostype: [];
  paginationtype: any;
}
const storeType: Module<State, any> = {
  namespaced: true,
  state: {
    ostype: [],
    paginationtype: {},
  },
  mutations: {
    setpaginationtype: (state: State, payload: any) =>
      (state.paginationtype = payload),
    setostype: (state: State, payload: any) => (state.ostype = payload),
  },
  getters: {
    getostype: (state: State) => {
      return state.ostype.length
        ? state.ostype.map((val: any, index: number) => {
            return {
              no:
                state.paginationtype.page > 1
                  ? ++index + 10 * (state.paginationtype.page - 1)
                  : ++index,
              id: val.id,
              name: val.name,
              description: val.description,
              type_os: val.type_os,
              os_logo: val.os_logo,
              price: val.price,
            };
          })
        : [];
    },
  },
  actions: {
    //type
    fetchostype: async (
      context: ActionContext<State, any>,
      payload: any = { page: 1, itemsPerPage: 10, search: "" }
    ) => {
      return await axios.instance
        .get("/os/list", {
          params: {
            page: payload.page,
            limit: payload.itemsPerPage,
            search: payload.search,
          },
        })
        .then((response) => {
          const data = response.data.data;
          const { os, pagination } = data;
          context.commit("setostype", os);
          context.commit("setpaginationtype", pagination);
        });
    },

    addOstype: async (context: ActionContext<State, any>, payload: any) => {
      return axios.instance
        .post("/os/create", payload)
        .then((response) => {})
        .catch((e) => {
          if (e.response.data.data) {
            return Promise.reject(e);
          } else {
            context.dispatch("HOMEPAGE/showErrorToast", e.message, {
              root: true,
            });
            return Promise.reject("error");
          }
        });
    },
    editOstype: async (context: ActionContext<State, any>, payload: any) => {
      return axios.instance
        .put(`/os/update`, payload)
        .then((response) => {})
        .catch((e) => {
          if (e.response.data.data) {
            return Promise.reject(e);
          } else {
            context.dispatch("HOMEPAGE/showErrorToast", e.message, {
              root: true,
            });
            return Promise.reject("error");
          }
        });
    },
    deleteOstype: async (context: ActionContext<State, any>, payload: any) => {
      return await axios.instance.delete(`/os/delete/${payload.id}`);
    },
  },
};
export default storeType;
