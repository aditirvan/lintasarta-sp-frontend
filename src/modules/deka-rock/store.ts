import axios from "@/lib/axios";
import { ActionContext, Module } from "vuex";

const baseURL = `${process.env.VUE_APP_API_BASE_URL_DEKAROCK}/v1/dekarock`;
interface State {
  openshift_detail: any;
  settings: any;
  flavor_list: Array<any>;
  flavor_pagination: any;
  openshift_list: Array<any>;
  openshift_pagination: any;
  machine_set_list: Array<any>;
  listVersion: Array<any>;
  listKubeConfig: Array<any>;
  machine_set_pagination: any;
  copyConfig: String;
  settingMaintenance: any;

  security_groups: Array<any>;
  security_group_roles: Array<any>;
  security_group_roles_ingress: Array<any>;
  security_group_roles_egress: Array<any>;

  sec_ingress_pagination: any;
  sec_egress_pagination: any;
  sec_role_pagination: any;
  sec_gr_pagination: any;
}

const store: Module<State, any> = {
  namespaced: true,
  state: {
    openshift_detail: {},
    flavor_list: [],
    flavor_pagination: {},
    settings: {},
    openshift_list: [],
    openshift_pagination: {},
    machine_set_list: [],
    machine_set_pagination: {},
    listVersion: [],
    listKubeConfig: [],
    copyConfig: "",
    settingMaintenance: "",

    security_groups: [],
    security_group_roles: [],
    security_group_roles_ingress: [],
    security_group_roles_egress: [],

    sec_ingress_pagination: {},
    sec_egress_pagination: {},
    sec_role_pagination: {},
    sec_gr_pagination: {},
  },
  mutations: {
    setOpenshiftList(state, data) {
      state.openshift_list = data;
    },
    setSettings(state, data) {
      state.settings = data;
    },
    setFlavors(state, data) {
      state.flavor_list = data;
    },
    setFlavorsPagination(state, data) {
      state.flavor_pagination = data;
    },
    setMachineSetList(state, data) {
      state.machine_set_list = data;
    },
    setOpenshiftStatusUpdate(state, data) {
      for (let index = 0; index < state.openshift_list.length; index++) {
        const element = state.openshift_list[index];
        if (element.id == data.openshift_id) {
          state.openshift_list[index].status = data.status;
          return;
        }
      }
    },
    setOpenshiftDetail(state, data) {
      state.openshift_detail = data;
    },
    setOpenshiftPagination(state, data) {
      state.openshift_pagination = data;
    },
    setMachineSetPagination(state, data) {
      state.machine_set_pagination = data;
    },
    setListVersion(state, data) {
      state.listVersion = data;
    },
    setCopyConfig(state, data) {
      state.copyConfig = data;
    },
    setListKubeConfig(state, data) {
      state.listKubeConfig = data;
    },
    setSettingMaintenance(state, data) {
      state.settingMaintenance = data;
    },
    setSecurityGroups(state, data) {
      state.security_groups = data;
    },
    setSecurityGroupRoles(state, data) {
      state.security_group_roles = data;
    },
    setSecurityGroupRolesIngress(state, data) {
      state.security_group_roles_ingress = data;
    },
    setSecurityGroupRolesEgress(state, data) {
      state.security_group_roles_egress = data;
    },
    setSecurityGrPagination(state, data) {
      state.sec_gr_pagination = data;
    },
    setSecurityGroupRolesPaginate(state, {data, direction=null}) {
      if (direction == 'ingress'){
        state.sec_ingress_pagination = data
      }else if (direction == 'egress'){
        state.sec_egress_pagination = data
      }else{
        state.sec_role_pagination = data
      }
    },
  },
  actions: {
    getOpenshiftList: async (context: ActionContext<State, any>, payload: any) => {
      let params = {};
      let headers = {};
      if (payload && payload.params) {
        params = payload.params;
      }
      if (payload && payload.headers) {
        headers = payload.headers;
      }
      return await axios.instance
        .get(`${baseURL}/cluster`, {
          params: params,
          headers: headers,
        })
        .then((response) => {
          if (response.status === 200) {
            context.commit("setOpenshiftList", response.data.data);
            context.commit("setOpenshiftPagination", response.data.paginate);
            return response.data;
          }
        })
        .catch((e) => {
          context.commit("setOpenshiftList", []);
          context.commit("setOpenshiftPagination", {});
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
          return e.response;
        });
    },
    createOpenshift: async (context: ActionContext<State, any>, payload: any) => {
      let headers = {};
      if (payload && payload.headers) {
        headers = payload.headers;
      }
      return await axios.instance
        .post(`${baseURL}/cluster`, payload, { timeout: 10000, headers: headers })
        .then((response) => {
          context.dispatch("HOMEPAGE/showProcessToastWS", `Creating the Deka ROCK cluster`, { root: true });
          // context.dispatch("HOMEPAGE/showSuccessToast", "Dekarock on creating", { root: true });
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
    updateOpenshift: async (context: ActionContext<State, any>, data: any) => {
      let fiiled = false;
      let payload = data.payload;
      let edit_field = ["name", "description"];
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
        .put(`${baseURL}/cluster/${payload.id}`, payload)
        .then((response) => {
          context.dispatch("HOMEPAGE/showSuccessToast", "Update Dekarock success", { root: true });
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
    addOpenshiftMachineSet: async (context: ActionContext<State, any>, data: any) => {
      let payload = data.payload;
      // if (!payload.total_worker) {
      //   context.dispatch("HOMEPAGE/showErrorToast", "Total Worker must be greather than 0", { root: true });
      //   return;
      // }
      return await axios.instance
        .post(`${baseURL}/cluster/${data.id}/machine-set`, payload)
        .then((response) => {
          // context.dispatch("HOMEPAGE/showSuccessToast", "Add Machine Set on progress", { root: true });
          context.dispatch("HOMEPAGE/showProcessToastWS", `Creating the machine set`, { root: true });
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
    getOpenshiftMachineSetList: async (context: ActionContext<State, any>, data: any) => {
      let payload = data.payload;
      let params = {};
      if (data.params) {
        params = data.params;
      }
      return await axios.instance
        .get(`${baseURL}/cluster/${payload.id}/machine-set`, {
          params: params,
        })
        .then((response) => {
          context.commit("setMachineSetList", response.data.data);
          context.commit("setMachineSetPagination", response.data.paginate);
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
    deleteMachineSet: async (context: ActionContext<State, any>, data: any) => {
      let payload = data.payload;
      return await axios.instance
        .delete(`${baseURL}/cluster/${payload.id}/machine-set/${payload.machine_set_id}`)
        .then((response) => {
          // context.dispatch("HOMEPAGE/showSuccessToast", "Remove Machine Set worker on progress", { root: true });
          context.dispatch("HOMEPAGE/showProcessToastWS", `Deleting the machine set`, { root: true });
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
    resizeMachineSet: async (context: ActionContext<State, any>, data: any) => {
      let payload = data.payload;
      // if (!payload.total_worker) {
      //   context.dispatch("HOMEPAGE/showErrorToast", "Total Worker tidak valid", { root: true });
      //   return;
      // }

      return await axios.instance
        .put(`${baseURL}/cluster/${data.id}/machine-set/${data.machine_set_id}`, payload)
        .then((response) => {
          // context.dispatch("HOMEPAGE/showSuccessToast", "Resize Machine Set worker on progress", { root: true });
          context.dispatch("HOMEPAGE/showProcessToastWS", `Resizing the machine set`, { root: true });
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
    deleteOpenshift: async (context: ActionContext<State, any>, id: string) => {
      return await axios.instance
        .delete(`${baseURL}/cluster/${id}`)
        .then((response) => {
          if (response.status == 200) {
            // context.dispatch("HOMEPAGE/showSuccessToast", "Dekarock on deleting", { root: true });
            return response;
          }
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
    getOpenshiftDetail: async (context: ActionContext<State, any>, id: string) => {
      return await axios.instance
        .get(`${baseURL}/cluster/${id}`)
        .then((response) => {
          if (response.status == 200) {
            context.commit("setOpenshiftDetail", response.data.data);
            return response;
          }
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
    getOpenshiftPassword: async (context: ActionContext<State, any>, payload: any) => {
      return await axios.instance
        .post(`${baseURL}/cluster/${payload.id}/retrieve-password`, { password: payload.password })
        .then((response) => {
          if (response.status == 200) {
            return response.data;
          } else {
            context.dispatch("HOMEPAGE/showErrorToast", response.data.message, { root: true });
          }
        })
        .catch((e) => {
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
        });
    },
    getDekarockSetting: async (context: ActionContext<State, any>, payload: any) => {
      let headers = {};
      if (payload && payload.headers) {
        headers = payload.headers;
      }
      return await axios.instance
        .get(`${baseURL}/settings/${payload.project_id}`, { headers: headers })
        .then((response) => {
          if (response.status == 200) {
            context.commit("setSettings", response.data.data);
            return response.data;
          } else {
            context.dispatch("HOMEPAGE/showErrorToast", response.data.message, { root: true });
          }
        })
        .catch((e) => {
          if (e.response.status >= 500) {
            context.dispatch("HOMEPAGE/showErrorToast", "Internal Server Error", { root: true });
          } else if (e.response.status >= 400) {
            context.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          }
        });
    },
    updateDekarockSetting: async (context: ActionContext<State, any>, payload: any) => {
      let headers = {};
      if (payload && payload.headers) {
        headers = payload.headers;
      }
      return await axios.instance
        .put(`${baseURL}/settings/${payload.project_id}`, payload.payload, { headers: headers })
        .then((response) => {
          if (response.status == 200) {
            context.dispatch("HOMEPAGE/showSuccessToast", "Custom dekarock limit has been successfully updated", { root: true });
            return response.data;
          } else {
            context.dispatch("HOMEPAGE/showErrorToast", response.data.message, { root: true });
          }
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
    getDekarockFlavors: async (context: ActionContext<State, any>, payload: any) => {
      let params = {};
      if (payload && payload.params) {
        params = payload.params;
      }
      return await axios.instance
        .get(`${baseURL}/flavors`, { params: params })
        .then((response) => {
          if (response.status == 200) {
            context.commit("setFlavors", response.data.data);
            context.commit("setFlavorsPagination", response.data.paginate);
            return response.data;
          } else {
            context.dispatch("HOMEPAGE/showErrorToast", response.data.message, { root: true });
          }
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
    editOpenshift: async (context: ActionContext<State, any>, payload: any) => {},
    getVersion: async (context: ActionContext<State, any>) => {
      try {
        const response = await axios.instance.get(`${baseURL}/versions`);
        context.commit("setListVersion", response.data.data);
      } catch (error) {
        context.dispatch("HOMEPAGE/showErrorToast", error.response.data.message, { root: true });
      }
    },
    downloadKubeConfig: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const response = await axios.instance.get(`${baseURL}/cluster/${payload.id}/cube-config/download`, {
          params: payload.params,
        });
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/octet-stream" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", payload.filename);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        context.dispatch("HOMEPAGE/showErrorToast", error.response.data.message, { root: true });
      }
    },
    retrievePassword: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const response = await axios.instance.post(`${baseURL}/cluster/${payload.id}/cube-config/retrieve`, { password: payload.password });
        if (response.status == 200) {
          context.commit("setCopyConfig", response.data.data.cube_config);
        }
      } catch (error) {
        context.dispatch("HOMEPAGE/showErrorToast", error.response.data.message, { root: true });
      }
    },
    getListKubeConfig: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const response = await axios.instance.get(`${baseURL}/cluster/${payload}/cube-config`);
        context.commit("setListKubeConfig", response.data.data);
      } catch (error) {
        context.dispatch("HOMEPAGE/showErrorToast", error.response.data.message, { root: true });
      }
    },
    postMaintenance: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const response = await axios.instance.put(`${baseURL}/cluster/${payload.id}/settings`, payload.body);
        if (response.status == 200) {
          context.dispatch("HOMEPAGE/showSuccessToast", "Setting Maintenance Successful", { root: true });
        }
      } catch (error) {
        context.dispatch("HOMEPAGE/showErrorToast", error.response.data.message, { root: true });
      }
    },
    getSettingMaintenace: async (context: ActionContext<State, any>, payload: any) => {
      try {
        const response = await axios.instance.get(`${baseURL}/cluster/${payload}/settings`);
        context.commit("setSettingMaintenance", response.data.data.maintainable_time);
      } catch (error) {
        context.dispatch("HOMEPAGE/showErrorToast", error.response.data.message, { root: true });
      }
    },
    getSecuritGroups: async (context: ActionContext<State, any>, data: any) => {
      let payload = data.payload;
      let params = {};
      if (data.params) {
        params = data.params;
      }
      try {
        const response = await axios.instance.get(`${baseURL}/security-group`, { params: params });
        context.commit("setSecurityGroups", response.data.data);
        context.commit("setSecurityGrPagination", response.data.paginate)
      } catch (error) {
        context.dispatch("HOMEPAGE/showErrorToast", error.response, { root: true });
      }
    },
    getSecuritGroupRoles: async (context: ActionContext<State, any>, data: any) => {
      let params = {};
      if (data.params) {
        params = data.params;
      }
      try {
        const response = await axios.instance.get(`${baseURL}/security-group-rule`, { params: params });
        if (data.params.direction == 'ingress'){
          context.commit("setSecurityGroupRolesIngress", response.data.data);
          context.commit("setSecurityGroupRolesPaginate", {data:response.data.paginate, direction:data.params.direction})
        }else if (data.params.direction == 'egress'){
          context.commit("setSecurityGroupRolesEgress", response.data.data);
          context.commit("setSecurityGroupRolesPaginate", {data:response.data.paginate, direction:data.params.direction})
        }else{
          context.commit("setSecurityGroupRoles", response.data.data);
          context.commit("setSecurityGroupRolesPaginate", {data:response.data.paginate})
        }
      } catch (error) {
        if (error.response.status >= 400){
          context.dispatch("HOMEPAGE/showErrorToast", error.response.data.message, { root: true });
          return
        }
        context.dispatch("HOMEPAGE/showErrorToast", error.response, { root: true });
      }
    },
    addSecuritGroupRole: async (context: ActionContext<State, any>, data: any) => {
      let payload = data.payload;
      try {
        await axios.instance.post(`${baseURL}/security-group-rule`, payload);
        context.dispatch("HOMEPAGE/showSuccessToast", "Adding the new rule was successful.", { root: true });
      } catch (error) {
        if (error.response.status == 409){
          context.dispatch("HOMEPAGE/showErrorToast", "The rule already exists.", { root: true });
          return
        }else if (error.response.status >= 400){
          context.dispatch("HOMEPAGE/showErrorToast", error.response.data.message, { root: true });
          return
        }
        context.dispatch("HOMEPAGE/showErrorToast", error.response, { root: true });
      }
    },
    updateSecuritGroupRole: async (context: ActionContext<State, any>, data: any) => {
      let fiiled = false;
      let payload = data.payload;
      let edit_field = [
        "direction", "ethertype", "protocol", 
        "remote_ip_prefix", "port_range_min", "port_range_max",
        "description"
      ];
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
      if (!data.id) {
        context.dispatch("HOMEPAGE/showErrorToast", "Frontend Error, `id` is null!", { root: true });
        return;
      }
      try {
        await axios.instance.put(`${baseURL}/security-group-rule/${data.id}`, payload);
        context.dispatch("HOMEPAGE/showSuccessToast", "The rule has been successfully updated.", { root: true });
      } catch (error) {
        if (error.response.status >= 400){
          context.dispatch("HOMEPAGE/showErrorToast", error.response.data.message, { root: true });
          return
        }
        context.dispatch("HOMEPAGE/showErrorToast", error.response, { root: true });
      }
    },
    deleteSecuritGroupRole: async (context: ActionContext<State, any>, id: any) => {
      if (!id) {
        context.dispatch("HOMEPAGE/showErrorToast", "Frontend Error, `id` is null!", { root: true });
        return;
      }
      return await axios.instance
        .delete(`${baseURL}/security-group-rule/${id}`)
        .then((response) => {
          context.dispatch("HOMEPAGE/showSuccessToast", "Deletion of the rule was successful.", { root: true });
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
  },
};
// this.$store.dispatch('HOMEPAGE/logout')
export default store;
