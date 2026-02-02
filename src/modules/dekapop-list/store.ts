import { Module, ActionContext } from "vuex";
import axios from "axios";

function makeHeaders() {
  const token = localStorage.getItem("token") || "{}";
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
}

interface State {
  isLoading: boolean;
  isLoadingBtn: boolean;
  totalRowsPop: number;
  listPop: Array<any>;
  detailPop: Object;
  userPop: Array<any>;
  loadingDelete: Boolean;
  loadingUsage: Boolean;
  listUsage: Array<any>;
  totalRowsUsage: Number;
  detailUsage: Object;
  dataOrgName: Object;
  listAgents: Array<any>;
  listProducts: Array<any>;
  listTypeLicense: Array<any>;
  defaultProduct:Object;
  isDownloading: Boolean;
  listCustomCommitmentCore: Array<any>;
  listMonthly: Array<any>;
  listMonthlyByUsage: Array<any>;
}

const store: Module<State, any> = {
  namespaced: true,
  state: {
    isLoading: false,
    isLoadingBtn: false,
    listPop: [],
    totalRowsPop: 0,
    detailPop: {},
    userPop: [],
    loadingDelete: false,
    loadingUsage: false,
    listUsage: [],
    totalRowsUsage: 0,
    detailUsage: {},
    dataOrgName: {},
    listAgents: [],
    listProducts:[],
    listTypeLicense: [],
    defaultProduct:{},
    isDownloading: false,
    listCustomCommitmentCore: [],
    listMonthly:[],
    listMonthlyByUsage:[],
  },
  getters: {
    isLoading: (state) => state.isLoading,
    isLoadingBtn: (state) => state.isLoadingBtn,
    getListPop: (state) => state.listPop,
    detailPop: (state) => state.detailPop,
    userPop: (state) => state.userPop,
    totalRowsPop: (state) => state.totalRowsPop,
    loadingDelete: (state) => state.loadingDelete,
    loadingUsage: (state) => state.loadingUsage,
    listUsage: (state) => state.listUsage,
    totalRowsUsage: (state) => state.totalRowsUsage,
    detailUsage: (state) => state.detailUsage,
    dataOrgName: (state) => state.dataOrgName,
    listAgents: (state) => state.listAgents,
    listProducts: (state) => state.listProducts,
    listTypeLicense: (state) => state.listTypeLicense,
    defaultProduct:(state) => state.defaultProduct,
    isDownloading: (state) => state.isDownloading,
    listCustomCommitmentCore: (state) => state.listCustomCommitmentCore,
    listMonthly: (state) => state.listMonthly,
    listMonthlyByUsage: (state) => state.listMonthlyByUsage
  },
  mutations: {
    setTotalRowsPop: (state, totalRows) => (state.totalRowsPop = totalRows),
    setIsLoading: (state, loading) => (state.isLoading = loading),
    setIsLoadingBtn: (state, loading) => (state.isLoadingBtn = loading),
    setListPop: (state, listPop) => (state.listPop = listPop),
    setDetailPop: (state, payload) => (state.detailPop = payload),
    setUserPop: (state, payload) => (state.userPop = payload),
    setLoadingDelete: (state, payload) => (state.userPop = payload),
    setLoadingUsage: (state, payload) => (state.loadingUsage = payload),
    setListUsage: (state, payload) => (state.listUsage = payload),
    setTotalRowsUsage: (state, payload) => (state.totalRowsUsage = payload),
    setDetailUsage: (state, payload) => (state.detailUsage = payload),
    setDataOrgName: (state, payload) => (state.dataOrgName = payload),
    setListAgents: (state, payload) => (state.listAgents = payload),
    setListProducts: (state, payload) => (state.listProducts = payload),
    setListTypeLicense: (state, payload) => (state.listTypeLicense = payload),
    setDefaultProduct:  (state, payload) => (state.defaultProduct = payload),
    setIsDownloading: (state, payload) => (state.isDownloading = payload),
    setListCustomCommitmentCore: (state, payload) => (state.listCustomCommitmentCore = payload),
    setListMonthly: (state, payload) => (state.listMonthly = payload),
    setListMonthlyByUsage: (state, payload) => (state.listMonthlyByUsage = payload),
  },
  actions: {
    fetchPop: async (context: ActionContext<State, any>, payload: any) => {
      try {
        context.commit("setIsLoading", true);
        const resp = await axios.get(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop?${payload}`, makeHeaders());
        if (resp.status == 200) {
          let data = resp.data.data;
          context.commit("setListPop", data.rows);
          context.commit("setTotalRowsPop", data.total_rows);
          context.commit("setIsLoading", false);
        }
        return resp;
      } catch (e) {
        context.commit("setIsLoading", false);
        return handleError(context, e);
      }
    },

    getDetailPop: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const resp = await axios.get(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/${payload}`, makeHeaders());
        context.commit("setDetailPop", resp.data.data);
        return resp;
      } catch (e) {
        return handleError(context, e);
      }
    },
    getUserPop: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const resp = await axios.get(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/user/${payload}`, makeHeaders());
        context.commit("setUserPop", resp.data.data);
        return resp;
      } catch (e) {
        return handleError(context, e);
      }
    },
    createPop: async (context: ActionContext<State, any>, payload: any) => {
      try {
        context.commit("setIsLoading", true);
        context.commit("setIsLoadingBtn", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/create`, payload, makeHeaders());
        if (response.status == 200) {
          context.dispatch("HOMEPAGE/showSuccessToast", `Deka POP has successfully created!`, { root: true });
          window.location.replace("/dekapop");
          context.commit("setIsLoadingBtn", false);
        }
        return response;
      } catch (e) {
        context.commit("setIsLoading", false);
        context.commit("setIsLoadingBtn", false);
        return handleError(context, e);
      }
    },
    deletePop: async (context: ActionContext<State, any>, payload: any) => {
      try {
        context.commit("setLoadingDelete", true);
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/delete/${payload}`, makeHeaders());
        if (response.status == 200) {
          context.dispatch("HOMEPAGE/showSuccessToast", `Deka POP has successfully deleted!`, { root: true });
          context.commit("setLoadingDelete", false);
        }
        return response;
      } catch (e) {
        context.commit("setLoadingDelete", false);
        return handleError(context, e);
      }
    },
    editPop: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/edit/${payload.id}`, payload, makeHeaders());
        if (response.status == 200) {
          context.dispatch("HOMEPAGE/showSuccessToast", `Deka POP has successfully updated!`, { root: true });
          window.location.replace("/dekapop");
        }
        return response;
      } catch (e) {
        return handleError(context, e);
      }
    },
    createUsage: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/usage/create`, payload, makeHeaders());
        if (response.status == 200) {
          context.dispatch("HOMEPAGE/showSuccessToast", `Usage has successfully created!`, { root: true });
          window.location.replace("/dekapop");
        }
        return response;
      } catch (e) {
        return handleError(context, e);
      }
    },
    getListUsage: async (context: ActionContext<State, any>, payload: any) => {
      try {
        context.commit("setLoadingUsage", true);
        const resp = await axios.get(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/usage?${payload}`, makeHeaders());
        if (resp.status == 200) {
          let data = resp.data.data;
          context.commit("setListUsage", data.rows);
          context.commit("setTotalRowsUsage", data.total_rows);
          context.commit("setLoadingUsage", false);
        }
        return resp;
      } catch (e) {
        context.commit("setLoadingUsage", false);
        return handleError(context, e);
      }
    },
    deleteUsage: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/usage/delete/${payload}`, makeHeaders());
        if (response.status == 200) {
          context.dispatch("HOMEPAGE/showSuccessToast", `Usage has successfully deleted!`, { root: true });
        }
        return response;
      } catch (e) {
        return handleError(context, e);
      }
    },

    getDetailUsage: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const resp = await axios.get(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/usage/${payload}`, makeHeaders());
        context.commit("setDetailUsage", resp.data.data);
        return resp;
      } catch (e) {
        return handleError(context, e);
      }
    },
    editUsage: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/usage/edit/${payload.id}`, payload, makeHeaders());
        if (response.status == 200) {
          context.dispatch("HOMEPAGE/showSuccessToast", `Usage has successfully updated!`, { root: true });
          setTimeout(() => {
            window.location.replace(`/dekapop/details/${payload.dekapop_id}`);
          }, 1000);
        }
        return response;
      } catch (e) {
        return handleError(context, e);
      }
    },
    getOrganization: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const resp = await axios.get(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/organization/${payload}`, makeHeaders());
        context.commit("setDataOrgName", resp.data.data);
        return resp;
      } catch (e) {
        return handleError(context, e);
      }
    },
    getListAgents: async (context: ActionContext<State, any>) => {
      try {
        const resp = await axios.get(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/list-agents`, makeHeaders());
        context.commit("setListAgents", resp.data.data);
        return resp;
      } catch (e) {
        return handleError(context, e);
      }
    },

    getListProducts: async (context: ActionContext<State, any>) => {
      try {
        const resp = await axios.get(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/products`, makeHeaders());
        context.commit("setListProducts", resp.data.data);
        resp.data.data.forEach((item: any) => {
          if(item.is_default){            
            context.commit("setDefaultProduct", item);
          }
        })
        
        return resp;
      } catch (e) {
        return handleError(context, e);
      }
    },

    getListTypeLicense: async (context: ActionContext<State, any>) => {
      try {
        const resp = await axios.get(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/type-license`, makeHeaders());
        context.commit("setListTypeLicense", resp.data.data);
        
        return resp;
      } catch (e) {
        return handleError(context, e);
      }
    },

     getListUsageMonthly: async (context: ActionContext<State, any>, payload: any) => {
      try {
        console.log("getListUsageMonthly 1",payload);
        context.commit("setIsLoading", true);
        const resp = await axios.get(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/all-usage-monthly-record`, makeHeaders());
        if(resp.status == 200){
            context.commit("setIsLoading", false);
           context.commit("setListMonthly", resp.data.data);
        }
        
       
        
        return resp;
      } catch (e) {
        context.commit("setIsLoading", true);
        return handleError(context, e);
      }
    },
    
    syncUsage: async (context: ActionContext<State, any>, payload: any) => {
      try {
        context.commit("setLoadingUsage", true);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/sync-usage`, payload, makeHeaders());
        if (response.status == 200) {
          context.dispatch("HOMEPAGE/showSuccessToast", `Usage has successfully synced!`, { root: true });
        }
        return response;
      } catch (e) {
        context.commit("setLoadingUsage", false);
        return handleError(context, e);
      }
    },
    downloadUsageExcel: async (context: ActionContext<State, any>, payload: any) => {
      try {
        context.commit("setIsDownloading", true);
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/export-usage`,
          {
            dekapop_id: payload.dekapopId,
            start_year: parseInt(payload.startYear, 10),
            start_month: parseInt(payload.startMonth, 10), 
            end_year: parseInt(payload.endYear, 10),
            end_month: parseInt(payload.endMonth, 10)
          },
          { 
            ...makeHeaders(),
            responseType: 'blob' 
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `usage-report-${payload.startDate}-${payload.endDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        context.commit("setIsDownloading", false);
        return response;
      } catch (e) {
        context.commit("setIsDownloading", false);
        return handleError(context, e);
      }
    },
    getCustomCommitmentCore: async (context: ActionContext<State, any>, masterUsageId: string) => {
      try {
        const resp = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/default-custome-commitment-core/${masterUsageId}`, 
          makeHeaders()
        );
        if (resp.status === 200) {
          const commitmentCores = resp.data.data.map((item: any) => ({
            text: item.commitment_core_usage.toString(),
            value: item.commitment_core_usage
          }));
          context.commit("setListCustomCommitmentCore", commitmentCores);
        }
        return resp;
      } catch (e) {
        return handleError(context, e);
      }
    },
    getListUsageMonthlyByUsageId: async (context: ActionContext<State, any>, id: any) => {
      try {
        context.commit("setIsLoading", true);
        const resp = await axios.get(`${process.env.VUE_APP_API_BASE_URL_POP}/v1/deka-pop/monthly-record-by-id/${id}`, makeHeaders());
        if(resp.status == 200){
            context.commit("setIsLoading", false);
           context.commit("setListMonthlyByUsage", resp.data.data);
        }
         
        return resp;
      } catch (e) {
        context.commit("setIsLoading", true);
        return handleError(context, e);
      }
    },
  },
};

function handleError(context: ActionContext<State, any>, e: any) {
  if (e.response && e.response.status === 403) {
    context.dispatch("HOMEPAGE/showErrorToast", "Not Valid Token or Token Expired", { root: true });
    context.dispatch("HOMEPAGE/logout", null, { root: true });
    return "Not Valid Token or Token Expired";
  }

  if (e.response) {
    context.dispatch("HOMEPAGE/showErrorToast", e.response.data.responseMessage, { root: true });
    return e.response.data.responseMessage;
  } else {
    context.dispatch("HOMEPAGE/showErrorToast", e.message, { root: true });
    return e.message;
  }
}

export default store;
