import axios from "@/lib/axios";
import { uniqueId } from "lodash";
import { ActionContext, Module } from "vuex";

const baseURL = `${process.env.VUE_APP_API_BASE_URL}/nfs/v1`;
interface State {
  nfs_detail: any;
  nfs_list: Array<any>;
  nfs_client_list: Array<any>;
  nfs_pagination: any;
  nfs_client_pagination: any;
  flavor_list: Array<any>;
  flavor_pagination: any;
  nfsLimit: Object;
}

const store: Module<State, any> = {
  namespaced: true,
  state: {
    nfs_detail: {},
    nfs_list: [],
    nfs_client_list: [],
    nfs_pagination: {},
    
    nfs_client_pagination: {},

    flavor_list: [],
    flavor_pagination: {},
    nfsLimit: {},
  },
  mutations: {
    setNFSList(state, data) {
      state.nfs_list = data;
    },
    setNFSClientList(state, data) {
      state.nfs_client_list = data;
    },
    setNFSDetail(state, data) {
      state.nfs_detail = data;
    },
    setNFSPagination(state, data) {
      state.nfs_pagination = data;
    },
    setNFSClientPagination(state, data) {
      state.nfs_client_pagination = data;
    },
    setFlavorList(state, data) {
      state.flavor_list = data;
    },
    setFlavorPagination(state, data) {
      state.flavor_pagination = data;
    },
    setNFSLimit(state, data) {
      state.nfsLimit = data;
    },
  },
  actions: {
    createNFS: async (context: ActionContext<State, any>, payload: any) => {
      return await axios.instance
        .post(`${baseURL}/main/create`, payload)
        .then((response) => {
          context.dispatch("HOMEPAGE/showProcessToastWS", `Creating the NFS`, { root: true });
          return response;
        })
        .catch((e) => {
          if (!e.response) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
            return;
          }
          if (!e.response.status) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
            return;
          }
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
          return e.response;
        });
    },
    addNFSClient: async (context: ActionContext<State, any>, data: any) => {
      let params = {};
      let headers = {};
      let payload = {};
      if (data && data.params) {
        params = data.params;
      }
      if (data && data.headers) {
        headers = data.headers;
      }
      if (data && data.payload) {
        payload = data.payload;
      }
      return await axios.instance
        .post(`${baseURL}/client/${data.id}`, payload)
        .then((response) => {
          context.dispatch("HOMEPAGE/showProcessToastWS", `Creating the Client`, { root: true });
          return response;
        })
        .catch((e) => {
          if (!e.response) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
            return;
          }
          if (!e.response.status) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
            return;
          }
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
          return e.response;
        });
    },
    
    getNFSList: async (context: ActionContext<State, any>, payload: any) => {
      let params = {};
      let headers = {};
      if (payload && payload.params) {
        params = payload.params;
      }
      if (payload && payload.headers) {
        headers = payload.headers;
      }
      return await axios.instance
        .get(`${baseURL}/main/list`, {
          params: params,
          headers: headers,
        })
        .then((response) => {
          if (response.status === 200) {
            context.commit("setNFSList", response.data.data);
            context.commit("setNFSPagination", response.data.paginate);
            return response.data;
          }
        })
        .catch((e) => {
          context.commit("setNFSList", []);
          context.commit("setNFSPagination", {});
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
          return e.response;
        });
    },
    getNFSClientList: async (context: ActionContext<State, any>, payload: any) => {
      let params = {};
      let headers = {};
      if (payload && payload.params) {
        params = payload.params;
      }
      if (payload && payload.headers) {
        headers = payload.headers;
      }
      context.commit("setNFSClientList", []);
      context.commit("setNFSClientPagination", {});
      return await axios.instance
        .get(`${baseURL}/client/${payload.params.id}`, {
          params: params,
          headers: headers,
        })
        .then((response) => {
          if (response.status === 200) {
            context.commit("setNFSClientList", response.data.data);
            context.commit("setNFSClientPagination", response.data.paginate);
            return response.data;
          }
        })
        .catch((e) => {
          context.commit("setNFSList", []);
          context.commit("setNFSPagination", {});
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
          return e.response;
        });
    },
    deleteNFS: async (context: ActionContext<State, any>, payload: any) => {
      return await axios.instance
        .delete(`${baseURL}/main/detail/${payload.params.id}`)
        .then((response) => {
          context.dispatch("HOMEPAGE/showProcessToastWS", `Deleting the NFS`, { root: true });
          return response;
        })
        .catch((e) => {
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
          return e.response;
        });
    },
    deleteClient: async (context: ActionContext<State, any>, payload: any) => {
      return await axios.instance
        .delete(`${baseURL}/client/${payload.nfs_id}/detail/${payload.client_id}`)
        .then((response) => {
          context.dispatch("HOMEPAGE/showProcessToastWS", `Deleting the Client`, { root: true });
          return response;
        })
        .catch((e) => {
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
          return e.response;
        });
    },
    getNFSDetail: async (context: ActionContext<State, any>, id: string) => {
      return await axios.instance
        .get(`${baseURL}/main/detail/${id}`)
        .then((response) => {
          context.commit("setNFSDetail", response.data.data);
          return response;
        })
        .catch((e) => {
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
          return e.response;
        });
    },
    updateNFS: async (context: ActionContext<State, any>, data: any) => {
      let fiiled = false;
      let payload = data.payload;
      let edit_field = ["name", "description", "custom_flavor", "flavor"];
      for (let index = 0; index < edit_field.length; index++) {
        const element = edit_field[index];
        if (Object.keys(payload).includes(element)) {
          fiiled = true;
          break;
        }
      }
      if (!fiiled) {
        return;
      }
      if (!payload) {
        context.dispatch("HOMEPAGE/showErrorToast", "Frontend Error, `payload` is null!", { root: true });
        return;
      }
      return await axios.instance
        .put(`${baseURL}/main/detail/${data.id}`, payload)
        .then((response) => {
          if (payload.custom_flavor || payload.flavor){
            context.dispatch("HOMEPAGE/showProcessToastWS", "Updating the NFS", { root: true });
          }else{
            context.dispatch("HOMEPAGE/showSuccessToast", "Update NFS success", { root: true });
          }
          return response;
        })
        .catch((e) => {
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
          return {status:500};
        });
    },
    getNFSLimit: async (context: ActionContext<State, any>, project_id: string) => {
      return await axios.instance
        .get(`${baseURL}/setting/${project_id}`)
        .then((response) => {
          context.commit("setNFSLimit", response.data.data);
          return response;
        })
        .catch((e) => {
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
          return e.response;
        });
    },
    updateNFSLimit: async (context: ActionContext<State, any>, payload: any) => {
      return await axios.instance
        .put(`${baseURL}/setting/${payload.project_id}`, payload.body)
        .then((response) => {
          context.dispatch("HOMEPAGE/showSuccessToast", "NFS limit has been successfully updated", { root: true });
          return response;
        })
        .catch((e) => {
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
          return e.response;
        });
    },
    fetchFlavor: async (context: ActionContext<State,any>, payload: any) => {
      context.commit("setFlavorList", [
        {
          "id": uniqueId(),
          "name": "m1.medium",
          "storage_type": "SSD",
          "month_price": 100000,
          "hour_price": 100,
          "size": 30
        },
        {
          "id": uniqueId(),
          "name": "m1.medium",
          "storage_type": "SSD",
          "month_price": 100000,
          "hour_price": 100,
          "size": 100
        },
        {
          "id": uniqueId(),
          "name": "m1.medium",
          "storage_type": "SSD",
          "month_price": 100000,
          "hour_price": 100,
          "size": 1000
        },
      ])
      // let params = {};
      // let headers = {};
      // if (payload && payload.params) {
      //   params = payload.params;
      // }
      // if (payload && payload.headers) {
      //   headers = payload.headers;
      // }
      // context.commit("setFlavorList", []);
      // context.commit("setFlavorPagination", {});
      // return await axios.instance
      //   .get(`${baseURL}/flavor/list`, {
      //     params: params,
      //     headers: headers,
      //   })
      //   .then((response) => {
      //     if (response.status === 200) {
      //       context.commit("setFlavorList", response.data.data);
      //       context.commit("setFlavorPagination", response.data.paginate);
      //       return response.data;
      //     }
      //   })
      //   .catch((e) => {
      //     if (e.response.status >= 500) {
      //       context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
      //     } else if (e.response.status >= 400) {
      //       context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
      //     }
      //     return e.response;
      //   });
    }
  },
};
export default store;