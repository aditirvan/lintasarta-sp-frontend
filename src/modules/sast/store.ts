import { ActionContext, Module } from "vuex";
import axios from "@/lib/axios";


function makeHeadersv1() {
  return {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }
}
interface State{
  resSast: any,
  isLoading: boolean
  quotalimitsI3gis: number,
  quotastatusI3gis: Number,
  isLogout:boolean,
  serviceList:Object,
}

const store: Module<State, any> = {
  namespaced: true,
  state: {
    resSast: [],
    isLoading: false,
    quotalimitsI3gis: 0,
    quotastatusI3gis: 0,
    isLogout:false,
    serviceList:{},
  },
  mutations: {
    setResSast: (state, sast) => state.resSast = sast,
    setIsLoading: (state: State, payload: any) => (state.isLoading = payload),
    setquotalimitsI3gis: (state: State, payload: any) => (state.quotalimitsI3gis = payload),
    setquotastatusI3gis: (state: State, payload: any) => (state.quotastatusI3gis = payload),
    setIsLogout: (state: State, payload: any) => (state.isLogout = payload),
    setServiceListAst:(state: State, payload: any) => (state.serviceList = payload),
  },
  getters: {
    quotalimitsI3gis: state => { return state.quotalimitsI3gis },
    quotastatusI3gis: state => { return state.quotastatusI3gis },
    getIsLogout: state => { return state.isLogout },
    getServiceListAst: state => {return state.serviceList},
  },
  actions: {
    loginSAST: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .post("/sast-connector/login", payload)
          .then((res: any) => {
            resolve(res);
 
            const data = res.data.data;
            context.commit("setResSast", data);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            // console.log("reject res",err)
            context.dispatch('HOMEPAGE/showErrorToast', `${err.response.data.responseMessage}`, { root: true })
            context.commit('setIsLoading', false)
            reject(err);
          });
      });
    },

    getquotalimitI3gis: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      // console.log("payload ", payload.organization_id)
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .get(`${process.env.VUE_APP_API_BASE_URL}/sast-connector/limit-sast?project_id=${payload.project_id}&organization_id=${payload.organization_id}&user_id=${payload.user_id}`, makeHeadersv1())
          .then((res: any) => {
            resolve(res);
            const data = res.data.data;
            // console.log("getquotalimitI3gis data ", data)
            context.commit("setquotalimitsI3gis", data.limit);
            context.commit("setquotastatusI3gis", data);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            // console.log("error",err)
            context.dispatch('HOMEPAGE/showErrorToast', `${err.response.data.responseMessage}`, { root: true })
            context.commit('setIsLoading', false)
            reject(err);
          });
      });
    },

    updateQuotalimitI3gis: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      // console.log("updateQuotalimitI3gis ", payload)
      const reqData ={
        "organization_id":payload.organization_id,
        "project_id":payload.project_id,
        "user_id":payload.user_id,
        "limit":payload.limit,
        "limit_project":payload.limit_project,
        "limit_site":payload.limit_site,
      }
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .post(`${process.env.VUE_APP_API_BASE_URL}/sast-connector/limit-sast`, reqData,makeHeadersv1())
          .then((res: any) => {
            // console.log("updateQuotalimitI3gis ",res)
            resolve(res);
            const data = res.data.data;           
            if(data.project_id==""){
              context.dispatch('HOMEPAGE/showErrorToast', `record not found`, { root: true })
              return
            }
            context.commit("setquotalimitsI3gis", data);
            context.commit("setquotastatusI3gis", data);
            context.commit("setIsLoading", false);
            context.dispatch('HOMEPAGE/showSuccessToast', 'Custom Deka AST limit has been successfully updated', { root: true })
          })
          .catch((err) => {
            // console.log("error",err)
            context.dispatch('HOMEPAGE/showErrorToast', `${err.response.data.responseMessage}`, { root: true })
            context.commit('setIsLoading', false)
            reject(err);
          });
      });
    },
    deleteLimitI3gis: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      // console.log("deleteLimitI3gis ", payload)
      const reqData ={
        "organization_id":payload.organization_id,
        "project_id":payload.project_id,
        "user_id":payload.user_id,
      }
      return new Promise<void>((resolve, reject) => {
        axios.instance
        .delete(`${process.env.VUE_APP_API_BASE_URL}/sast-connector/limit-sast?project_id=${payload.project_id}&organization_id=${payload.organization_id}&user_id=${payload.user_id}`, makeHeadersv1())
          .then((res: any) => {
            // console.log("deleteLimitI3gis ",res)
            resolve(res);
            const data = res.data.data;
            context.commit("setIsLoading", false);
            context.dispatch('HOMEPAGE/showSuccessToast', 'Custom Deka AST limit has been successfully updated', { root: true })
          })
          .catch((err) => {
            // console.log("error",err)
            context.dispatch('HOMEPAGE/showErrorToast', `${err.response.data.responseMessage}`, { root: true })
            context.commit('setIsLoading', false)
            reject(err);
          });
      });
    },

    getServiceListSast: async (context: ActionContext<State, any>, payload: any) => {
      context.commit("setIsLoading", true);
      // console.log("payload ", payload.organization_id)
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .get(`${process.env.VUE_APP_API_BASE_URL}/sast-connector/service-limit?project_id=${payload.project_id}&organization_id=${payload.organization_id}`, makeHeadersv1())
          .then((res: any) => {
            resolve(res);
            const data = res.data.data;
            console.log("GET SERVICE LIST SAST ", data);
            
            context.commit("setServiceListAst", data);
            context.commit("setIsLoading", false);
          })
          .catch((err) => {
            // console.log("error",err)
            context.dispatch('HOMEPAGE/showErrorToast', `${err.response.data.responseMessage}`, { root: true })
            context.commit('setIsLoading', false)
            reject(err);
          });
      });
    },


  }
}

export default store;