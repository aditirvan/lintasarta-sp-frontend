import { ActionContext, Module } from "vuex";
import { isLimitError, createLimitErrorMsg } from "@/lib/validator";
import axios from "../../lib/axios";
import libProject from "@/lib/project";
import { async } from "rxjs";

interface State {
  securities: [];
  security: {};
  isLoading: Boolean;
}
const store: Module<State, any> = {
  namespaced: true,
  state: {
    securities: [],
    security: {},
    isLoading: false,
  },
  mutations: {
    setsecurities: (state: State, payload: any) => {
      state.securities = payload;
    },
    setsecurity: (state: State, payload: any) => {
      state.security = payload;
    },
    setIsLoading: (state: State, payload: any) => {
      state.isLoading = payload;
    },
  },
  actions: {
    addsecurity: async (context, payload: any) => {
      context.commit('setIsLoading', true)
      try {
        const activeProjectID = await libProject.getActiveProjectID();
        delete payload.by;
        delete payload.created;
        payload.project_id = activeProjectID;
        const response = await axios.instance.post(`/user/security`, payload);
        context.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Firewall has been successfully created.",
          { root: true }
        );
        context.commit('setIsLoading', false)
        return response;
      } catch (e) {
        const err = e.response.data.data;
        
        console.log(err.includes("OverQuota"))
        let errorMessage =
          "A problem encountered while tring to create firewall";

        if (err.includes("security name has already exist"))
          errorMessage = "Security name already exists";
        else if (isLimitError(err)) errorMessage = createLimitErrorMsg(err);
        else if (err.includes("Postpaid")) errorMessage = err;
        else if (err.includes("Security group has exceeded the limit"))
          errorMessage =
            "Security group has exceeded the limit. Please contact the administrator.";
        else if (err.includes("Quota exceeded for resources: ['security_group_rule']"))
          errorMessage =
            "Security group rules has exceeded the limit. Please contact the administrator.";
        else if (err.includes("OverQuota"))
          errorMessage =
            "Security group limit size has reached in this project.";
        else if (err.includes("please make sure your instance is exist"))
          errorMessage =
            "Failed to create security. Please make sure all of your instance selected is exist";
        else if (err.includes("could not be found as device id on any ports"))
          errorMessage =
            "Please ensure that the instance has a network interface before attempting to attach a Firewall.";
 
        context.dispatch("HOMEPAGE/showErrorToast", errorMessage, {
          root: true,
        });
        context.commit("setIsLoading", false);
      }
    },
    fetchsecurity: async ({ commit, dispatch }) => {
      const activeProjectID = await libProject.getActiveProjectID();
      const response = await axios.instance.get(
        `/service/project/${activeProjectID}/security`
      );
      commit("setsecurities", response.data.data);
    },
    FETCH_SECURITY_DETAIL: async ({ commit, dispatch }, payload) => {
      try {
        const { id } = payload;
        const response = await axios.instance.get(`/user/security/${id}`);
        if (response.data.code === 200) {
          commit("setsecurity", response.data.data);
          return response.data;
        } else
          dispatch("HOMEPAGE/showErrorToast", "Failed to get firewall data.", {
            root: true,
          });
      } catch (e) {
        dispatch("HOMEPAGE/showErrorToast", "Failed to get firewall data.", {
          root: true,
        });
      }
    },
    FETCH_SECURITY_EDIT: async ({ commit, dispatch }, payload) => {
      try {
        const { id } = payload;
        const response = await axios.instance.get(`/user/newsecurity/${id}`);
        if (response.data.code === 200) {
          commit("setsecurity", response.data.data);
          return response.data;
        } else
          dispatch("HOMEPAGE/showErrorToast", "Failed to get firewall data.", {
            root: true,
          });
      } catch (e) {
        dispatch("HOMEPAGE/showErrorToast", "Failed to get firewall data.", {
          root: true,
        });
      }
    },
    UPDATE_SECURITY: async (context, payload: any) => {
      context.commit('setIsLoading', true)
      try {
        const { id } = payload;
        delete payload.id;
        const response = await axios.instance.put(
          `/user/security/${id}`,
          payload
        );
        context.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Firewall has been successfully updated.",
          { root: true }
        );
        context.commit("setIsLoading", false);
        return response;
      } catch (e) {
        const err = e.response.data.data;
        console.log(err)
        let errorMessage =
          "A problem encountered while trying to update firewall";
        if (err.includes("Quota exceeded for resources: ['security_group_rule']")) {
          errorMessage = "Security group rules has exceeded the limit. Please contact the administrator.";
        }
        else if (isLimitError(err)){ errorMessage = createLimitErrorMsg(err);}
        else if (err.includes("could not be found as device id on any ports"))
          errorMessage =
            "Please ensure that the instance has a network interface before attempting to attach a Firewall.";

        context.commit("setIsLoading", false);
        context.dispatch("HOMEPAGE/showErrorToast", errorMessage, {
          root: true,
        });
        context.commit("setIsLoading", false);
      }
    },
    DELETE_SECURITY: async ({ commit, dispatch }, payload) => {
      try {
        const { id } = payload;
        commit("setIsLoading", true);
        const response = await axios.instance.delete(`/user/security/${id}`);
        dispatch(
          "HOMEPAGE/showSuccessToast",
          "Firewall has been successfully deleted.",
          { root: true }
        );
        commit("setIsLoading", false);
        dispatch("fetchsecurity");
        return response;
      } catch (e) {
        const err = e.response.data.data;
        console.log(err)
        let errorMessage =
          "Failed to delete firewall";
        if (err.includes("SecurityGroupInUse")){
          errorMessage ="Security Group in use on VPC Port";
        }
        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showErrorToast", errorMessage, {
          root: true,
        });
      }
    },
    
    fetchinstances_security: async (context, payload) => {
      context.commit('setIsLoading', true)
      const currentProj = context.rootState.SUPERADMIN.currentProj
      const userrole = context.rootState.ROLEPERMISSION.userrole
      let params = {}
      if (currentProj) {
        params.pro_id = currentProj.id
      }
      // context.commit('setinstances', [])
      return await axios.instance.get('/user/instances', { params }).then(response => {
        let dataInstances = {
          instance: []
        }
        const data = response.data.data.map((x, index) => {
          
          dataInstances.instance[index] = {
              id: x.id,
              name: x.name
          }
        })
        context.commit('setsecurity', dataInstances)
        context.commit('setIsLoading', false)
        return data

      }).catch((e) => {
        context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
      })
    },
    syncSecurity: async ({dispatch}, payload) => {
      try {
        const projectid = localStorage.getItem('projectid');
        const securityID = payload.securityID;
        const response = await axios.instance.get(`/service/security/sync?project_id=${projectid}&security_id=${securityID}`);
        
        dispatch("HOMEPAGE/showSuccessToast", `${response.data.message}`, { root: true });

        return response;
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
        return error.response.data;
      }
      
    }
  },
};

export default store;
