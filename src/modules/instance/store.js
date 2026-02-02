import axios from "@/lib/axios";
import libProject from "@/lib/project";
import { Promise } from "core-js";
import { isLimitError, createLimitErrorMsg } from "@/lib/validator"
import Vue from 'vue'

// import {localstroge} from '@/lib/localstorage'

function sortByName(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

export default {
  namespaced: true,
  state: {
    type: [],
    version: [],
    regions: [],
    vpcs: [],
    vpcports: [],
    securityinstances: [],
    vpcportattached: [],
    vpcportenabled: [],
    vpcportfloatingips: [],
    images: [],
    instancesize: [],
    storagesize: [],
    sshkeys: [],
    sshid: {},
    instances: [],
    activeInstances: [],
    masterInstances: [],
    listInstanceSize: [],
    listInstanceType: [],
    listStorageTypeBilling: [],
    listInstanceRootDisk: [],
    defaultInstanceDataDisk: [],
    defaultPriceStorage: {},
    defaultInstancePriceDataDisk: {},
    isLoadingCreateSSH: false,
    instanceDetail: null,
    isLoadingConsole: false,
    isLoadingTurn: false,
    instancesLoadingTurn: [],
    listTypeStorage: [],
    isLoading: false,
    isLoadingReboot: false,
    isLoadingInstanceStatus: true,
    instanceStatus: "",
    instancePaginator: {
      count: 1,
      totalpage: 1,
      page: 1,
    },
    openstackinstances: "",
    openstackproject: "",
    instanceByProject: [],
    statusInstanceDekaAgent: null,
    servergroupByProject: [],
    listProcessorType: [],
    statusCheckEula: "",
  },
  getters: {
    getType: (state) => state.type,
    getVersion: (state) => state.version,
    getregions: (state) => state.regions,
    getMasterInstances: (state) => state.masterInstances,
    getvpcs: (state) => state.vpcs,
    getvpcports: (state) => state.vpcports,
    getsecurityinstances: (state) => state.securityinstances,
    getvpcportattached: (state) => state.vpcportattached,
    getvpcportenabled: (state) => state.vpcportenabled,
    getvpcportfloatingips: (state) => state.vpcportfloatingips,
    userProfile(state, getters, rootState, rootGetters) {
      return rootGetters["ROLEPERMISSION/getUserProfile"];
    },
    activeProject(state, getters, rootState, rootGetters) {
      return rootGetters["PROJECT/getprojects"];
    },
    getIsLoadingCreateSSH: (state) => state.isLoadingCreateSSH,
    getInstanceDetail: (state) => state.instanceDetail,
    getIsLoadingConsole: (state) => state.isLoadingConsole,
    getIsLoadingTurn: (state) => state.isLoadingTurn,
    getInstanceLoadingTurn: (state) => (id) => {
      if (id) {
        const result = state.instancesLoadingTurn.filter(
          (item) => item.id === id
        );
        if (result && result.length > 0) return result[0].loading;
      }
      return false;
    },
    getIsLoading: (state) => state.isLoading,
    getIsLoadingReboot: (state) => state.isLoadingReboot,
    getIsLoadingInstanceStatus: (state) => state.isLoadingInstanceStatus,
    getInstanceStatus: (state) => state.instanceStatus,
    getActiveInstances: (state) => state.activeInstances,
    listInstanceSize: state => state.listInstanceSize,
    listInstanceType: state => state.listInstanceType,
    listStorageTypeBilling: state => state.listStorageTypeBilling,
    listInstanceRootDisk: state => state.listInstanceRootDisk,
    defaultInstanceDataDisk: state => state.defaultInstanceDataDisk,
    defaultPriceStorage: state => state.defaultPriceStorage,
    defaultInstancePriceDataDisk: (state) => state.defaultInstancePriceDataDisk,
    getopenstackinstances: (state) => state.openstackinstances,
    getopenstackproject: (state) => state.openstackproject,
    getStatusInstanceDekaAgent: (state) => state.statusInstanceDekaAgent,
    listProcessorType: (state) => state.listProcessorType,
    statusCheckEula: (state) => state.statusCheckEula,
  },
  mutations: {
    isLoadingCreateSSH: (state, flag) => (state.isLoadingCreateSSH = flag),
    setType: (state, type) => (state.type = type),
    setVersion: (state, type) => (state.version = type),
    setMasterInstances: (state, type) => (state.masterInstances = type),
    setInstancePaginator: (state, payload) =>
      (state.instancePaginator = payload),
    setregions(state, regions) {
      state.regions = regions;
    },
    setInstancesStatus(state, instancesStatus) {
      let total = state.instances.length;
      let totalSync = 0;
      for (let index = 0; index < state.instances.length; index++) {
        if (total === totalSync) break;
        let s = state.instances[index];
        instancesStatus.forEach((x) => {
          if (s.id === x.id) {
            state.instances[index].state = x.state;
            totalSync++;
          }
        });
      }
    },
    setvpcs(state, vpcs) {
      state.vpcs = vpcs;
    },
    setvpcports(state, vpcports) {
      state.vpcports = vpcports;
    },
    setsecurityinstances(state, securityinstances) {
      state.securityinstances = securityinstances;
    },
    setvpcportattached(state, vpcportattached) {
      state.vpcportattached = vpcportattached;
    },
    setvpcportenabled(state, vpcportenabled) {
      state.vpcportenabled = vpcportenabled;
    },
    setvpcportfloatingips(state, vpcportfloatingips) {
      state.vpcportfloatingips = vpcportfloatingips;
    },
    setimages(state, images) {
      state.images = images;
    },
    setinstancesize(state, instancesize) {
      state.instancesize = instancesize;
    },
    setstoragesize(state, storagesize) {
      state.storagesize = storagesize;
    },
    setsshkeys(state, sshkeys) {
      state.sshkeys = sshkeys;
    },
    setsshid(state, sshid) {
      state.sshid = sshid;
    },
    setinstances(state, instances) {
      state.instances = instances;
    },
    setInstanceDetail(state, instance) {
      state.instanceDetail = instance;
    },
    setIsLoadingConsole(state, instance) {
      state.isLoadingConsole = instance;
    },
    setIsLoadingTurn(state, instance) {
      state.isLoadingTurn = instance;
    },
    addInstancesLoadingTurn(state, id) {
      if (id) state.instancesLoadingTurn.push({ id: id, loading: true });
    },
    removeInstancesLoadingTurn(state, id) {
      if (id)
        state.instancesLoadingTurn = state.instancesLoadingTurn.filter(
          (item) => item.id !== id
        );
    },
    setIsLoading(state, flag) {
      state.isLoading = flag;
    },
    setIsLoadingReboot(state, instance) {
      state.isLoadingReboot = instance;
    },
    setInstanceStatus(state, flag) {
      state.instanceStatus = flag;
    },
    setIsLoadingInstanceStatus(state, flag) {
      state.isLoadingInstanceStatus = flag;
    },
    setActiveInstances(state, instances) {
      state.activeInstances = instances;
    },
    setListInstanceSize(state, instances) {
      state.listInstanceSize = instances;
    },
    setListInstanceType(state, instances) {
      state.listInstanceType = instances;
    },
    setListStorageType(state, instances) {
      state.listStorageTypeBilling = instances;
    },
    setListInstanceRootDisk(state, instances) {
      state.listInstanceRootDisk = instances;
    },
    setDefaultInstanceDataDisk(state, instances) {
      state.defaultInstanceDataDisk = instances;
    },
    setDefaultPriceStorage(state, instances) {
      state.defaultPriceStorage = instances;
    },
    setDefaultInstancePriceDataDisk(state, instances) {
      state.defaultInstancePriceDataDisk = instances;
    },
    setopenstackinstances(state, openstackinstances) {
      state.openstackinstances = openstackinstances;
    },
    setopenstackproject(state, openstackproject) {
      state.openstackproject = openstackproject;
    },
    setinstanceByProject: (state, payload) => state.instanceByProject = payload,
    setStatusInstanceDekaAgent(state, data) {
      state.statusInstanceDekaAgent = data;
    },
    setServerGroupByProject: (state, payload) => state.servergroupByProject = payload,
    setListProcessorType(state, payload) {
      state.listProcessorType = payload;
    },
    setStatusCheckEula(state, payload) {
      state.statusCheckEula = payload;
    },
  },
  actions: {
    // Handle project change event
    handleProjectChange: ({ commit }, { oldProject, newProject }) => {
      // Clear instance data immediately
      commit('setinstances', []);
      commit('setIsLoading', true);
      
      // Clear related data juga
      commit('setInstanceDetail', null);
      commit('setActiveInstances', []);
      
      console.log(`Project changed from ${oldProject?.id} to ${newProject?.id}`);
    },
    
    fetchregions: async (context) => {
      context.commit("setregions", [
        {
          region: "TKP",
        },
      ]);
    },
    fetchvpcs: async ({ commit, dispatch }, params) => {
      let data = [];
      let response;
      const activeProjectID = await libProject.getActiveProjectID();
      if (!activeProjectID)
        dispatch("HOMEPAGE/showErrorToast", "Could not find project data.", {
          root: true,
        });
      if (params) {
        response = await axios.instance.get(
          `/network/vpc/project/${activeProjectID}`,
          { params: params }
        );
      } else {
        response = await axios.instance.get(
          `/network/vpc/project/${activeProjectID}`
        );
      }
      if (response.status === 200) {
        response.data.data.map((item) => data.push(item));
        data.sort(sortByName);
        commit("setvpcs", data);
      }
      return data;
    },
    fetchvpcports: async ({ commit, dispatch }, instanceID) => {
      let data = [];
      let response;
      const activeProjectID = await libProject.getActiveProjectID();
      if (!activeProjectID)
        dispatch("HOMEPAGE/showErrorToast", "Could not find project data.", {
          root: true,
        });

      response = await axios.instance.get(
        `/network/vpc/port/get/${activeProjectID}/${instanceID}`
      );

      if (response.status === 200) {
        response.data.data.map((item) => data.push(item));
        data.sort(sortByName);
        commit("setvpcports", data);
      }
      return data;
    },
    fetchvpcportsfip: async ({ commit, dispatch }, instanceID) => {
      let data = [];
      let response;
      const activeProjectID = await libProject.getActiveProjectID();
      if (!activeProjectID)
        dispatch("HOMEPAGE/showErrorToast", "Could not find project data.", {
          root: true,
        });

      response = await axios.instance.get(
        `/network/vpc/port/floatingip/get/${activeProjectID}/${instanceID}`
      );

      if (response.status === 200) {
        response.data.data.map((item) => data.push(item));
        data.sort(sortByName);
        commit("setvpcports", data);
      }
      return data;
    },
    fetchvpcportsfiplist: async ({ commit, dispatch }, instanceID) => {
      let data = [];
      let response;
      const activeProjectID = await libProject.getActiveProjectID();
      if (!activeProjectID)
        dispatch("HOMEPAGE/showErrorToast", "Could not find project data.", {
          root: true,
        });

      response = await axios.instance.get(
        `/network/vpc/port/fip/${activeProjectID}/${instanceID}`
      );

      if (response.status === 200) {
        response.data.data.map((item) => data.push(item));
        data.sort(sortByName);
        commit("setvpcports", data);
      }
      return data;
    },
    fetchvpcportattached: async ({ commit, dispatch }, instanceID) => {
      let data = [];
      let response;
      const activeProjectID = await libProject.getActiveProjectID();
      if (!activeProjectID)
        dispatch("HOMEPAGE/showErrorToast", "Could not find project data.", {
          root: true,
        });

      response = await axios.instance.get(
        `/network/vpc/port/attached/${activeProjectID}`
      );

      if (response.status === 200) {
        response.data.data.map((item) => data.push(item));
        data.sort(sortByName);
        commit("setvpcportattached", data);
      }
      return data;
    },
    fetchvpcportenabled: async ({ commit, dispatch }, instanceID) => {
      let data = [];
      let response;
      const activeProjectID = await libProject.getActiveProjectID();
      if (!activeProjectID)
        dispatch("HOMEPAGE/showErrorToast", "Could not find project data.", {
          root: true,
        });

      response = await axios.instance.get(
        `/network/vpc/port/attached/enabled/${activeProjectID}`
      );

      if (response.status === 200) {
        response.data.data.map((item) => data.push(item));
        data.sort(sortByName);
        commit("setvpcportenabled", data);
      }
      return data;
    },
    fetchvpcportfloatingips: async ({ commit, dispatch }, instanceID) => {
      let data = [];
      let response;
      const activeProjectID = await libProject.getActiveProjectID();
      if (!activeProjectID)
        dispatch("HOMEPAGE/showErrorToast", "Could not find project data.", {
          root: true,
        });

      response = await axios.instance.get(
        `/network/vpc/port/floatingip/${activeProjectID}/${instanceID}`
      );

      if (response.status === 200) {
        response.data.data.map((item) => data.push(item));
        data.sort(sortByName);
        commit("setvpcportfloatingips", data);
      }
      return data;
    },
    fetchvpcportdetacheds: async ({ commit, dispatch }, instanceID) => {
      let data = [];
      let response;
      const activeProjectID = await libProject.getActiveProjectID();
      if (!activeProjectID)
        dispatch("HOMEPAGE/showErrorToast", "Could not find project data.", {
          root: true,
        });

      response = await axios.instance.get(
        `/network/vpc/port/detached/${activeProjectID}/${instanceID}`
      );

      if (response.status === 200) {
        response.data.data.map((item) => data.push(item));
        data.sort(sortByName);
        commit("setvpcports", data);
      }
      return data;
    },
    resize: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        // const { region, instance_id } = payload
        const response = await axios.instance.post(
          "/user/instances/resize",
          payload
        );
        // await dispatch('fetchInstanceDetail', instance_id)
        // dispatch('fetchMasterInstances', { region })
        // dispatch('HOMEPAGE/showProcessToastWS', 'Resizing instance', { root: true })
        return response;
      } catch (e) {
        commit("setIsLoading", false);
        const error = e.response.data.data;
        let errorMessage =
          "A problem encountered while trying to resize instance flavor";
        if (error.includes("Please upgrade your organization"))
          commit("DASHBOARD/setopendialogreachlimit", true, { root: true });
        else if (error.includes("vCPU has exceeded the limit"))
          errorMessage =
            "vCPU has exceeded the limit. Please contact the administrator.";
        else if (error.includes("RAM has exceeded the limit"))
          errorMessage =
            "RAM has exceeded the limit. Please contact the administrator.";
        else if (error.includes("cannot resize to the same size"))
          errorMessage = "Cannot resize to the same size.";
        else if (error.includes("cannot resize with same flavor"))
          errorMessage = "Cannot resize with same flavor.";
        else if (
          e &&
          e.response &&
          e.response.data &&
          e.response.data.data
            .toLowerCase()
            .includes("your balance is not enough")
        ) {
          commit("DASHBOARD/setopendialogbalance", true, { root: true });
          commit("DASHBOARD/setopendialogbalancemsg", e.response.data.data, {
            root: true,
          });
        } else if (isLimitError(error)) {
          errorMessage = createLimitErrorMsg(error);
        }

        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
      }
    },
    revert: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        const response = await axios.instance.post(
          "/user/instances/resize-revert",
          payload
        );
        dispatch("fetchInstanceDetail", payload.instance_id);
        dispatch("fetchMasterInstances");
        dispatch(
          "HOMEPAGE/showSuccessToast",
          "Instance flavor has been successfully reverted.",
          { root: true }
        );
        commit("setIsLoading", false);
      } catch (e) {
        commit("setIsLoading", false);
        const error = e.response.data.data;
        let errorMessage = "Failed to revert instance flavor.";
        if (
          error.includes(
            "15 seconds has already passed, you can't revert anymore"
          )
        )
          errorMessage = "Revert expired.";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
      }
    },
    resizeRootDisk: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        const response = await axios.instance.post(
          "/user/instances/resize-root-disk",
          payload
        );
        dispatch("fetchPaginatedInstances");
        dispatch(
          "HOMEPAGE/showProcessToastWS",
          "Extending instance root disk size",
          { root: true }
        );
        commit("setIsLoading", false);
        return response;
      } catch (e) {
        commit("setIsLoading", false);
        let errorMessage = "A problem encountered while resizing root disk";
        const error = e.response.data.data;
        if (error.includes("Please upgrade your organization"))
          commit("DASHBOARD/setopendialogreachlimit", true, { root: true });
        else if (
          e &&
          e.response &&
          e.response.data &&
          e.response.data.data
            .toLowerCase()
            .includes("your balance is not enough")
        ) {
          commit("DASHBOARD/setopendialogbalance", true, { root: true });
          commit("DASHBOARD/setopendialogbalancemsg", e.response.data.data, {
            root: true,
          });
        } else {
          if (error.includes("new size can't be smaller than size before"))
            errorMessage =
              "New root disk size must be greater than current root disk size";
          else if (error.includes("Volume size has exceeded the limit"))
            errorMessage =
              "Volume size has exceeded the limit. Please contact the administrator.";
          else if (error.includes("cannot resize with same storage"))
            errorMessage =
              "Cannot resize with the same root disk.";
          else if (isLimitError(error))
            errorMessage = createLimitErrorMsg(error);
          dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        }
      }
    },
    async fetchType({ commit }) {
      // TODO: Ferry - Fase 1
      let data = await axios.instance.get("/flavor/instance/type");
      commit("setType", data.data.data);
    },
    async fetchVersion({ commit }) {
      // TODO: Ferry - Fase 1
      let data = await axios.instance.get("/flavor/image/version");
      commit("setVersion", data.data.data);
    },
    async fetchMasterInstances({ commit }, param) {
      // TODO: Ferry - Fase 1
      commit("setIsLoading", true);
      commit("setMasterInstances", []);
      const data = await axios.instance.get("/flavor/instance", {
        params: param,
      });
      let flavors = data.data.data.instance
        .filter((x) => x.status == "active")
        .sort((a, b) => {
          if (a.root_disk > b.root_disk) {
            if (a.vcpu > b.vcpu) {
              if (a.ram > b.ram) return 1;
              else return 1;
            } else return -1;
          } else return -1;
        });
      commit("setMasterInstances", flavors);
      commit("setIsLoading", false);
    },
    async fetchimages({ commit }, param) {
      // TODO: Ferry - Fase 1
      let data = await axios.instance.get("/flavor/image", { params: param });

      commit("setimages", data.data.data.image);
    },
    fetchinstancesize(context) {},
    fetchstoragesize(context) {},
    async createsshkey({ commit, dispatch }, payload) {
      try {
        commit("setIsLoading", true);
        const projectID = await libProject.getActiveProjectID();
        if (!projectID)
          dispatch("HOMEPAGE/showErrorToast", `Cannot find project data.`, {
            root: true,
          });
        payload.project_id = projectID;
        payload.content = payload.sshkey;
        delete payload.sshkey;
        const response = await axios.instance.post("/user/keypair", payload);
        dispatch("fetchsshkeys");
        commit("setIsLoading", false);
        dispatch(
          "HOMEPAGE/showSuccessToast",
          `New SSH Key has been successfully created.`,
          { root: true }
        );
        return response;
      } catch (e) {
        const errorMessage = e.response.data.data;
        if (
          errorMessage.includes("Key pair") &&
          errorMessage.includes("already exists")
        )
          dispatch("HOMEPAGE/showErrorToast", `Keypair name already exists`, {
            root: true,
          });
        else if (errorMessage.includes("Can not start or end with whitespace"))
          dispatch(
            "HOMEPAGE/showErrorToast",
            `Keypair name cannot start or end with whitespace`,
            { root: true }
          );
        else if (
          errorMessage.includes("Keypair name contains unsafe characters")
        )
          dispatch(
            "HOMEPAGE/showErrorToast",
            `Keypair name contains unsafe characters`,
            { root: true }
          );
        else if (errorMessage.includes("name can only letter, digit, - or _"))
          dispatch(
            "HOMEPAGE/showErrorToast",
            `Keypair name can only contains letter, digit, dash (-), and underscore (_)`,
            { root: true }
          );
        else if (errorMessage.includes("Keypair data is invalid"))
          dispatch("HOMEPAGE/showErrorToast", `Keypair is invalid.`, {
            root: true,
          });
        else
          dispatch("HOMEPAGE/showErrorToast", `Failed to create new SSH Key.`, {
            root: true,
          });
        commit("setIsLoading", false);
        return e.response;
      }
    },
    deletesshkey: async ({ commit, dispatch }, payload) => {
      commit("setIsLoading", true);
      const sshkeyID = payload;
      let result = await axios.instance.delete(`/user/keypair/${sshkeyID}`);
      if (result) {
        dispatch("fetchsshkeys");
        commit("setIsLoading", false);
        return result;
      }
    },
    updatesshkey: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        return new Promise((resolve, reject) => {
          return axios.instance
            .put(`/user/keypair/${payload.id}`, payload)
            .then((res) => {
              resolve(res);
              dispatch("fetchsshkeys");
              commit("setIsLoading", false);
            })
            .catch((err) => {
              reject(err);
              const errorMessage = err.response.data.data;
              if (
                errorMessage.includes("Key pair") &&
                errorMessage.includes("already exists")
              )
                dispatch(
                  "HOMEPAGE/showErrorToast",
                  `Keypair name already exists`,
                  { root: true }
                );
              else if (
                errorMessage.includes("Can not start or end with whitespace")
              )
                dispatch(
                  "HOMEPAGE/showErrorToast",
                  `Keypair name cannot start or end with whitespace`,
                  { root: true }
                );
              else if (
                errorMessage.includes("Keypair name contains unsafe characters")
              )
                dispatch(
                  "HOMEPAGE/showErrorToast",
                  `Keypair name contains unsafe characters`,
                  { root: true }
                );
              else if (
                errorMessage.includes("name can only letter, digit, - or _")
              )
                dispatch(
                  "HOMEPAGE/showErrorToast",
                  `Keypair name can only contains letter, digit, dash (-), and underscore (_)`,
                  { root: true }
                );
              else if (errorMessage.includes("Keypair data is invalid"))
                dispatch("HOMEPAGE/showErrorToast", `Keypair is invalid.`, {
                  root: true,
                });
              else
                dispatch(
                  "HOMEPAGE/showErrorToast",
                  `Keypair name already exists`,
                  { root: true }
                );
              commit("setIsLoading", false);
              return err.response;
            });
        });
      } catch (e) {
        const errorMessage = e.response.data.data;
        if (
          errorMessage.includes("Key pair") &&
          errorMessage.includes("already exists")
        )
          dispatch("HOMEPAGE/showErrorToast", `Keypair name already exists`, {
            root: true,
          });
        else if (errorMessage.includes("Can not start or end with whitespace"))
          dispatch(
            "HOMEPAGE/showErrorToast",
            `Keypair name cannot start or end with whitespace`,
            { root: true }
          );
        else if (
          errorMessage.includes("Keypair name contains unsafe characters")
        )
          dispatch(
            "HOMEPAGE/showErrorToast",
            `Keypair name contains unsafe characters`,
            { root: true }
          );
        else if (errorMessage.includes("name can only letter, digit, - or _"))
          dispatch(
            "HOMEPAGE/showErrorToast",
            `Keypair name can only contains letter, digit, dash (-), and underscore (_)`,
            { root: true }
          );
        else if (errorMessage.includes("Keypair data is invalid"))
          dispatch("HOMEPAGE/showErrorToast", `Keypair is invalid.`, {
            root: true,
          });
        else
          dispatch("HOMEPAGE/showErrorToast", `Failed to update SSH Key.`, {
            root: true,
          });
        commit("setIsLoading", false);
        return e.response;
      }
    },
    async getsshkey({ commit }, payload) {
      const keyID = payload;
      return await axios.instance
        .get(`/user/keypair/${keyID}`)
        .then((response) => {
          const data = response.data.data;
          // console.log('tes' + response.data.data)
          commit("setsshid", data);
        });
    },
    async fetchsshkeys({ commit, rootState }) {
      commit("setIsLoading", true);
      const profileID = rootState.ROLEPERMISSION.userprofile.id;
      const activeProjectID = await libProject.getActiveProjectID();
      if (profileID != undefined) {
        return new Promise((resolve, reject) => {
          axios.instance
            .get(`/user/keypair/region/${profileID}/${activeProjectID}`, {
              params: {
                page: 1,
                paginate: false,
              },
            })
            .then((res) => {
              resolve(res);
              const keypair = res.data.data;
              commit("setsshkeys", keypair);
              commit("setIsLoading", false);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }
    },
    fetchinstances: async (context, payload) => {
      // this function is duplicated, please make this function to one
      context.commit("setIsLoading", true);
      const currentProj = context.rootState.SUPERADMIN.currentProj;
      const userrole = context.rootState.ROLEPERMISSION.userrole;
      let params = {};
      if (currentProj) {
        params.pro_id = currentProj.id;
      }

      // let params = {}
      params = { ...params, ...payload }
      return await axios.instance.get('/user/instances/paginated', {
        params
      }).then(response => {
        const data = response.data.data.instances.map(x => {
          if (payload && payload.no_detail){
            return x
          }
          let datains_vpc_port
          if (x.ins_vpc_port != null) {
            datains_vpc_port = x.ins_vpc_port.map(c => {                            
              const ipAddress = []
              const ipAddressFIP = []
              const recordDNS = [];
              const listMacAddress = [];
              const listIPGateway = [];
              c.internal.map((b) => {
                return listMacAddress.push(b.mac_address);
              });
              c.internal.map((b) => {
                return listIPGateway.push(b.ip_gateway);
              });
              c.internal.map(b => {              
                  return ipAddress.push(b.ip_address)              
              })
              c.external.map(d => {              
                  return ipAddressFIP.push(d.ip_address)              
              })    
              c.external.map((d) => {
                return recordDNS.push(d.record_dns_name);
              });                        
                return {
                  vpc_name: c.vpc_name,
                  ip_gateway: listIPGateway.join(`\n`),
                  type: c.type,
                  internal: ipAddress.join(`\n`),
                  external: ipAddressFIP.join(`\n`),
                  dns: recordDNS.join(`\n`),
                  mac_address: listMacAddress.join(`\n`),
                }
            })  
          }
          console.log("log 1 ", datains_vpc_port);
          return {
            id: x.id,
            createddate: x.created_at,
            instanceName: x.name,
            name: x.name,
            billing_type: x.billing_type,
            is_deleting: x.is_deleting,
            revert_expired: x.revert_expired,
            error_message: x.error_message,
            state: x.state,
            image: {
              name: x.image.name,
              file_system: x.image.file_system,
              version_number: x.image.version
            },
            package: {
              vcpu: x.package.v_cpu,
              ram: x.package.ram,
              data_disk_total: x.package.data_disk_total,
              root_disk: x.package.root_disk
            },
            region: {
              region: x.region,
              city: x.region
            },
            vpc : {
              name: x.vpc.name,
              ip_prefix: x.vpc.ip_prefix ,
              network_size: x.vpc.network_size
            },
            ip_gateway: x.network.ip_gateway,
            ipext: x.network.ip_external,
            floating_ip: x.network.floating_ip,
            is_floating_ip_exist: x.is_floating_ip_exist,
            ipv4: x.network.ip_internal,
            project_id: x.project_id,
            openstack_vm_uuid: x.openstack_vm_uuid,
            storage_type: x.package.root_disk_type,
            zone: x.zone,
            ins_vpc_port: datains_vpc_port,
          }
        })
        context.commit('setinstances', data)     
        context.commit('setIsLoading', false)
        context.commit('setInstancePaginator', response.data.data.pagination)
        return response.data.data
      }).catch((e) => {
        context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
      })
    },
    fetchActiveInstances: async (context, payload) => {
      // this function is duplicated, please make this function to one
      context.commit("setIsLoading", true);

      const currentProj = context.rootState.SUPERADMIN.currentProj;
      let params = { state: "ACTIVE" };
      if (currentProj) {
        params.pro_id = currentProj.id;
      }
      try {
        const response = await axios.instance.get("/user/instances/paginated", {
          params,
        });
        const data = response.data.data.instances.map((x) => {
          return {
            id: x.id,
            createddate: x.created_at,
            instanceName: x.name,
            billing_type: x.billing_type,
            is_deleting: x.is_deleting,
            revert_expired: x.revert_expired,
            error_message: x.error_message,
            state: x.state,
            image: {
              name: x.image.name,
              file_system: x.image.file_system,
              version_number: x.image.version,
            },
            package: {
              vcpu: x.package.v_cpu,
              ram: x.package.ram,
              data_disk_total: x.package.data_disk_total,
              root_disk: x.package.root_disk,
            },
            region: {
              region: x.region,
              city: x.region,
            },
            vpc: {
              name: x.vpc.name,
              ip_prefix: x.vpc.ip_prefix,
              network_size: x.vpc.network_size,
            },
            ip_gateway: x.network.ip_gateway,
            ipext: x.network.ip_external,
            floating_ip: x.network.floating_ip,
            is_floating_ip_exist: x.is_floating_ip_exist,
            ipv4: x.network.ip_internal,
            project_id: x.project_id,
            openstack_vm_uuid: x.openstack_vm_uuid,
            storage_type: x.package.root_disk_type,
          };
        });
        context.commit("setActiveInstances", data);
        context.commit("setIsLoading", false);
        return data;
      } catch (e) {
        await context.dispatch("HOMEPAGE/showErrorToast", e.message, {
          root: true,
        });
      }
    },
    fetchPaginatedInstances: async (
      context,
      payload = {
        page: 1,
        limit: 10,
        search: "",
        order_column: null,
        order_by: null,
      }
    ) => {
      // this function is duplicated, please make this function to one
      context.commit("setIsLoading", true);
      const currentProj = context.rootState.SUPERADMIN.currentProj;
      let params = {};
      if (currentProj) {
        params = {
          project_id: currentProj.id,
          state_with_paginate: true,
        };
      }
      params = { ...params, ...payload };
      context.commit("setinstances", []);
      return await axios.instance
        .get("/user/instances/paginated", {
          params,
        })
        .then((response) => {
          if (response.data.data.instances == null) {
            context.commit("setinstances", []);
          } else {
            const data = response.data.data.instances.map((x) => {
              let datains_vpc_port;
              if (x.ins_vpc_port != null) {
                datains_vpc_port = x.ins_vpc_port.map((c) => {
                  const ipAddress = [];
                  const ipAddressFIP = [];
                  const listDNS = [];
                  const listMacAddress = [];
                  const listIPGateway = [];
                  c.internal.map((b) => {
                    return listMacAddress.push(b.mac_address);
                  });
                  c.internal.map((b) => {
                    return listIPGateway.push(b.ip_gateway);
                  });
                  c.internal.map((b) => {
                    return ipAddress.push(b.ip_address);
                  });
                  c.external.map((d) => {
                    return ipAddressFIP.push(d.ip_address);
                  });
                  c.external.map((d) => {
                    return listDNS.push(d.record_dns_name);
                  });
                  return {
                    vpc_name: c.vpc_name,
                    ip_gateway: listIPGateway,
                    type: c.type,
                    internal: ipAddress,
                    external: ipAddressFIP,
                    dns: listDNS,
                    mac_address: listMacAddress,
                  };
                });
              }
              // console.log("log 3 ", datains_vpc_port);

              return {
                id: x.id,
                createddate: x.created_at,
                instanceName: x.name,
                billing_type: x.billing_type,
                is_deleting: x.is_deleting,
                revert_expired: x.revert_expired,
                error_message: x.error_message,
                state: x.state,
                image: {
                  name: x.image.name,
                  file_system: x.image.file_system,
                  version_number: x.image.version,
                },
                package: {
                  vcpu: x.package.v_cpu,
                  ram: x.package.ram,
                  data_disk_total: x.package.data_disk_total,
                  root_disk: x.package.root_disk,
                  root_disk_type: x.package.root_disk_type,
                  root_disk_type_id: x.package.root_disk_type_id,
                },
                region: {
                  region: x.region,
                  city: x.region,
                },
                vpc: {
                  name: x.vpc.name,
                  ip_prefix: x.vpc.ip_prefix,
                  network_size: x.vpc.network_size,
                },
                ip_gateway: x.network.ip_gateway,
                ipext: x.network.ip_external,
                floating_ip: x.network.floating_ip,
                is_floating_ip_exist: x.is_floating_ip_exist,
                ipv4: x.network.ip_internal,
                project_id: x.project_id,
                openstack_vm_uuid: x.openstack_vm_uuid,
                storage_type: x.package.root_disk_type,
                zone: x.zone,
                // vpc_port: x.vpc_port.map(c => {
                //   return {
                //     // name: c.name,
                //     ip_address: c.ip_address,
                //   }
                // })
                // vpc_port: showString,
                ins_vpc_port: datains_vpc_port,
              };
            });
            context.commit("setinstances", data);
          }
          context.commit("setIsLoading", false);
          context.commit("setInstancePaginator", response.data.data.pagination);

          return response.data.data;
        })
        .catch((e) => {
          context.dispatch("HOMEPAGE/showErrorToast", e.message, {
            root: true,
          });
        });
    },
    createinstance: async (
      { getters, commit, dispatch, rootState },
      payload
    ) => {
      // TODO: Ferry - Fase 1
      // console.log('create instance payload >>> ', payload);
      commit("setIsLoading", true);
      const activeProjectID = await libProject.getActiveProjectID();
      const user_role = rootState.ROLEPERMISSION.userrole;
      let url = "/user/instances";
      const currentProj = rootState.SUPERADMIN.currentProj;
      const currentOrg = rootState.SUPERADMIN.currentOrg;
      payload.project_id = currentProj.id;
      if (user_role == "Superadmin") {
        url = `/superadmin/instances/create/${currentOrg.id}`;
      } else {
        payload.project_id = activeProjectID;
      }
      const result = await axios.instance.post(url, payload);
      commit("setIsLoading", false);
      return result;
    },
    deleteInstance: async ({ commit, dispatch, rootState }, payload) => {
      commit("setIsLoading", true);
      const user_role = rootState.ROLEPERMISSION.userrole;
      if (user_role == "Superadmin") {
        try {
          const currentProj = rootState.SUPERADMIN.currentProj;
          const param = {};
          param.project_id = currentProj.id;
          param.instance_id = payload.instance_id;
          const result = await axios.instance.post(
            `/superadmin/instances/delete`,
            param
          );
          if (result) {
            dispatch("fetchPaginatedInstances");
            return result;
          }
        } catch (e) {
          commit("setIsLoading", false);
          const error = e.response.data.data;
          let errorMessage =
            "A problem encountered while trying to destroy the instance";
          if (error.includes("please detach load balancer"))
            errorMessage =
              "Please detach all attached Load Balancer from selected Instance and try again.";
          else if (error.includes("please detach storage"))
            errorMessage =
              "Please detach all attached Storage from selected Instance and try again.";
          else if (error.includes("please detach floating ip"))
            errorMessage =
              "Please detach all attached Floating IP from selected Instance and try again.";
          else if (error.includes("please detach firewall"))
            errorMessage =
              "Please detach all attached Firewall from selected Instance and try again.";
          else if (
            error.includes("please detach interface before delete instance")
          )
            errorMessage =
              "Please detach Interface before delete Instance and try again.";
          else if (error.includes("please detach all snapshots before delete instance"))
          errorMessage =
            "Please remove the snapshot before delete the instance.";
          else if (error.includes("please detach all snapshots backup before delete instance"))
            errorMessage =
              "Please remove the backup scheduler before delete the instance.";
          else if (error.includes("please delete backup scheduler before delete instance"))
            errorMessage =
              "Please remove the backup scheduler before delete the instance.";
          else {
            dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
            return;
          }
          dispatch(
            "DASHBOARD/showCommonWarning",
            { title: "Warning!", message: errorMessage },
            { root: true }
          );
        }
      } else {
        try {
          let result = await axios.instance.post(
            "/user/instances/delete",
            payload
          );
          if (result) {
            dispatch("fetchPaginatedInstances");
            return result;
          }
        } catch (e) {
          commit("setIsLoading", false);
          const error = e.response.data.data;
          let errorMessage =
            "A problem encountered while trying to destroy the instance";
          if (error.includes("please detach load balancer"))
            errorMessage =
              "Please detach Load Balancer from selected Instance and try again.";
          else if (error.includes("please detach storage"))
            errorMessage =
              "Please detach Storage from selected Instance and try again.";
          else if (error.includes("please detach floating ip"))
            errorMessage =
              "Please detach Floating IP from selected Instance and try again.";
          else if (error.includes("please detach firewall"))
            errorMessage =
              "Please detach Firewall from selected Instance and try again.";
          else if (error.includes("please delete backup scheduler"))
            errorMessage =
              "Please delete Backup Scheduler from selected Instance and try again.";
          else if (
            error.includes("please detach interface before delete instance")
          )
            errorMessage =
              "Please detach Interface before delete Instance and try again.";
          else if (error.includes("please detach all snapshots before delete instance"))
          errorMessage =
            "Please remove the snapshot before delete the instance.";
          else if (error.includes("please detach all snapshots backup before delete instance"))
            errorMessage =
              "Please remove the backup scheduler before delete the instance.";
          else if (error.includes("please delete backup scheduler before delete instance"))
            errorMessage =
              "Please remove the backup scheduler before delete the instance.";
          else {
            dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
            return;
          }
          dispatch(
            "DASHBOARD/showCommonWarning",
            { title: "Warning!", message: errorMessage },
            { root: true }
          );
        }
      }
    },
    openconsole: async (context, payload) => {
      // TODO: Ferry - Fase 1
      context.commit("setIsLoadingConsole", true);
      let data;
      const user_role = context.rootState.ROLEPERMISSION.userrole;
      if (user_role == "Superadmin") {
        const currentProj = context.rootState.SUPERADMIN.currentProj;
        const param = {};
        param.project_id = currentProj.id;
        param.openstack_vm_uuid = payload.openstack_vm_uuid;
        data = await axios.instance.post(
          `/superadmin/instances/console`,
          param
        );
      } else {
        data = await axios.instance.post("/user/instances/console", payload);
      }

      context.commit("setIsLoadingConsole", false);
      if (data) {
        let myURL = data.data.data;
        let title = "console";
        let myWidth = 700;
        let myHeight = 500;
        var left = (screen.width - myWidth) / 2;
        var top = (screen.height - myHeight) / 4;
        window.open(
          myURL,
          title,
          "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
            myWidth +
            ", height=" +
            myHeight +
            ", top=" +
            top +
            ", left=" +
            left
        );
      }
    },
    fetchInstanceDetail: async ( context , uuid) => {
      return await axios.instance.get('/user/instances/detail/' + uuid).then(response => {        
        const data  = response.data.data
        let datains_vpc_port
        if (data.ins_vpc_port != null) {
          datains_vpc_port = data.ins_vpc_port.map(c => {                            
              const ipAddress = []
              const ipAddressFIP = []
              const recordDNS = [];
              const listMacAddress = [];
              const listIPGateway = [];
              c.internal.map((b) => {
                return listMacAddress.push(b.mac_address);
              });
              c.internal.map((b) => {
                return listIPGateway.push(b.ip_gateway);
              });
              c.internal.map(b => {              
                  return ipAddress.push(b.ip_address)              
              })
              c.external.map(d => {              
                  return ipAddressFIP.push(d.ip_address)              
              })    
              c.external.map((d) => {
                return recordDNS.push(d.record_dns_name);
              });                        
                return {
                  vpc_name: c.vpc_name,
                  ip_gateway: listIPGateway,
                  type: c.type,
                  internal: ipAddress,
                  external: ipAddressFIP,
                  dns: recordDNS,
                  mac_address: listMacAddress,
                }
          })  
        }
        console.log("log 4 ", datains_vpc_port);
        data.ins_vpc_port = datains_vpc_port                  
        context.commit('setInstanceDetail', data)
        context.commit('setInstanceStatus', data.state)        
      }).catch((e) => {
        context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
      })      
    },
    startInstance: async ({ commit, dispatch, rootState }, payload) => {
      const { id } = payload;
      commit("addInstancesLoadingTurn", id);
      try {
        let result;
        const user_role = rootState.ROLEPERMISSION.userrole;
        if (user_role == "Superadmin") {
          const currentProj = rootState.SUPERADMIN.currentProj;
          const param = {};
          param.project_id = currentProj.id;
          param.openstack_vm_uuid = payload.openstack_vm_uuid;
          result = await axios.instance.post(
            `/superadmin/instances/start`,
            payload
          );
        } else {
          result = await axios.instance.post("/user/instances/start", payload);
        }
        if (result) {
          dispatch("HOMEPAGE/showProcessToastWS", "Powering on the instance", {
            root: true,
          });
        } else {
          dispatch(
            "HOMEPAGE/showErrorToast",
            "Failed to power on the instance",
            { root: true }
          );
          commit("removeInstancesLoadingTurn", id);
        }
      } catch (e) {
        const error = e.response.data.data;
        let errorMessage = "Failed to power on the instance";
        if (error.includes("instance is expired"))
          errorMessage = "Instance is expired!";
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("removeInstancesLoadingTurn", id);
      }
    },
    stopInstance: async ({ commit, dispatch, rootState }, payload) => {
      const { id } = payload;
      commit("addInstancesLoadingTurn", id);
      try {
        let result;
        const user_role = rootState.ROLEPERMISSION.userrole;
        if (user_role == "Superadmin") {
          const currentProj = rootState.SUPERADMIN.currentProj;
          const param = {};
          param.project_id = currentProj.id;
          param.openstack_vm_uuid = payload.openstack_vm_uuid;
          result = await axios.instance.post(
            `/superadmin/instances/stop`,
            param
          );
        } else {
          result = await axios.instance.post("/user/instances/stop", payload);
        }
        if (result) {
          dispatch(
            "HOMEPAGE/showProcessToastWS",
            "Shutting down the instance",
            { root: true }
          );
        } else {
          dispatch(
            "HOMEPAGE/showErrorToast",
            "Failed to shutdown the instance",
            { root: true }
          );
          commit("removeInstancesLoadingTurn", id);
        }
      } catch (e) {
        dispatch("HOMEPAGE/showErrorToast", "Failed to shutdown the instance", {
          root: true,
        });
        commit("removeInstancesLoadingTurn", id);
      }
    },
    restartInstance: async ({ commit, dispatch, rootState }, payload) => {
      commit("setIsLoadingReboot", true);
      try {
        let result;
        const user_role = rootState.ROLEPERMISSION.userrole;
        if (user_role == "Superadmin") {
          const currentProj = rootState.SUPERADMIN.currentProj;
          const param = {};
          param.project_id = currentProj.id;
          param.openstack_vm_uuid = payload.openstack_vm_uuid;
          param.mode = payload.mode;
          result = await axios.instance.post(
            `/superadmin/instances/restart`,
            param
          );
        } else {
          result = await axios.instance.post(
            "/user/instances/restart",
            payload
          );
        }
        if (result) {
          dispatch("HOMEPAGE/showProcessToastWS", "Restarting the instance", {
            root: true,
          });
        } else {
          dispatch(
            "HOMEPAGE/showErrorToast",
            "Failed to restart the instance.",
            { root: true }
          );
          commit("setIsLoadingReboot", false);
        }
      } catch (e) {
        dispatch("HOMEPAGE/showErrorToast", "Failed to restart the instance.", {
          root: true,
        });
        commit("setIsLoadingReboot", false);
      }
    },
    fetchInstanceStatus: async ({ getters, commit, dispatch }, payload) => {
      commit("setIsLoadingInstanceStatus", true);
      try {
        let result = await axios.instance.post(
          "/user/instances/status",
          payload
        );
        commit("setInstanceStatus", result.data.data);
        commit("setIsLoadingInstanceStatus", false);
      } catch (e) {
        commit("setIsLoadingInstanceStatus", false);
      }
    },
    validateInstanceCreate: async (context, payload) => {
      const role = localStorage.getItem("role");
      if (role == "Superadmin") {
        return Promise.resolve();
      }
      const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
      return await axios.instance
        .get(`/user/instances/validate/${currentOrg.id}`)
        .then((response) => {
          const { can_create } = response.data.data;
          if (can_create) {
            return Promise.resolve("");
          } else {
            context.commit("DASHBOARD/setopendialogreachlimit", true, {
              root: true,
            });
            return Promise.reject("");
          }
        });
    },
    saverenameinstance: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        const { id, name } = payload;
        const response = await axios.instance.post("/user/instances/rename", {
          id,
          name,
        });

        if (response.status === 200) {
          dispatch(
            "HOMEPAGE/showSuccessToast",
            "Instance has been successfully updated!",
            { root: true }
          );
          commit("setIsLoading", false);
          return response;
        }
        commit("setIsLoading", false);
      } catch (err) {
        const error = err.response.data.data ?? err.response.data.message;
        let errorMessage =
          "A problem encountered while tring to rename instance";

        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsLoading", false);
      }
    },
    attachInterface: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        const { instance_id, ip_address, vpc_id, project_id, port_id } =
          payload;
        const response = await axios.instance.post(
          "/user/instances/attach-interface",
          {
            instance_id,
            ip_address,
            vpc_id,
            project_id,
            port_id,
          }
        );

        if (response.status === 200) {
          dispatch(
            "HOMEPAGE/showSuccessToast",
            "Interface has been successfully attached!",
            { root: true }
          );
          commit("setIsLoading", false);
          return response;
        }
        commit("setIsLoading", false);
      } catch (err) {
        const error = err.response.data.data ?? err.response.data.message;
        let errorMessage =
          "A problem encountered while tring to rename instance";
        if (error.includes("Unexpected API Error"))
          errorMessage = "IP Address is out of the specified network range!";
        else if (error.includes("is already in use"))
          errorMessage = "IP Address has already allocated!";
        else if (error.includes("IP Address has already attached to Instance"))
          errorMessage = "IP Address has already attached to Instance!";
        else if (error.includes("IP Address has already allocated to VPC Port"))
          errorMessage = "IP Address has already allocated to VPC Port!";
        else if (isLimitError(error))
          errorMessage = createLimitErrorMsg(error);

        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsLoading", false);
      }
    },
    detachInterface: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        const { instance_id, port_id, project_id, vpc_id } = payload;
        const response = await axios.instance.post(
          "/user/instances/detach-interface",
          {
            instance_id,
            port_id,
            project_id,
            vpc_id,
          }
        );

        if (response.status === 200) {
          dispatch(
            "HOMEPAGE/showSuccessToast",
            "Interface has been successfully detached!",
            { root: true }
          );
          commit("setIsLoading", false);
          return response;
        }
        commit("setIsLoading", false);
      } catch (err) {
        const error = err.response.data.data ?? err.response.data.message;
        // let errorMessage = 'A problem encountered while tring to rename instance'

        dispatch("HOMEPAGE/showErrorToast", error, { root: true });
        commit("setIsLoading", false);
      }
    },
    fetchsecurityinstances: async ({ commit, dispatch }, securityID) => {
      let data = [];
      let response;
      const activeProjectID = await libProject.getActiveProjectID();
      if (!activeProjectID)
        dispatch("HOMEPAGE/showErrorToast", "Could not find project data.", {
          root: true,
        });

      response = await axios.instance.get(
        `/user/newsecurity/${securityID}/instance`
      );

      if (response.status === 200) {
        response.data.data.map((item) => data.push(item));
        data.sort(sortByName);
        commit("setsecurityinstances", data);
      }
      return data;
    },
    getListInstanceSize: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/instance?${payload}`);
        commit("setListInstanceSize", response.data.data ? response.data.data : []);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListInstanceType: async ({ commit }) => {
      try {
        // const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/instance/type`);
        const response = await axios.instance.get('/flavor/instance/type');
        commit("setListInstanceType", response.data.data);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListStorageType: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/storage/type?${payload}`);
        commit("setListStorageType", response.data.data);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getListInstanceRootDisk: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/storage?${payload}`);
        commit("setListInstanceRootDisk", response.data.data ? response.data.data : []);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getDefaultInstanceDataDisk: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/storage?${payload}`);
        commit("setDefaultInstanceDataDisk", response.data.data ? response.data.data : []);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    getDefaultPriceStorage: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/storage/default?${payload}`);
        commit("setDefaultPriceStorage", response.data.data);
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },    
    getDefaultInstancePriceDataDisk: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/storage/default?${payload}`);
        commit("setDefaultInstancePriceDataDisk", response.data.data);
        return response;
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    // Custom Instance Data Disk
    fetchOpenstackInstanceDetail: async (context, uuid) => {
      return await axios.instance
        .get("/user/instances/detailopenstack/" + uuid)
        .then((response) => {
          const data = response.data.data;
          context.commit("setopenstackinstances", data);
          return data;
        })
        .catch((e) => {
          context.dispatch("HOMEPAGE/showErrorToast", e.message, {
            root: true,
          });
        });
    },
    fetchOpenstackProjectDetail: async (context, uuid) => {
      return await axios.instance
        .get("/user/project/openstack/" + uuid)
        .then((response) => {
          const data = response.data.data;
          context.commit("setopenstackproject", data);
          return data;
        })
        .catch((e) => {
          context.dispatch("HOMEPAGE/showErrorToast", e.message, {
            root: true,
          });
        });
    },
    fetchInstanceByProject: async (context, uuid) => {
      return await axios.instance.get('/user/instances', { params: { pro_id: uuid, state: "" } }).then(response => {
        let dataInstances = {
          instance: []
        }
        const data = response.data.data.map((x, index) => {
          
          dataInstances.instance[index] = {
              id: x.id,
              name: x.name
          }
        })
        context.commit('setinstanceByProject', dataInstances)
        return data

      }).catch((e) => {
        context.commit('setinstanceByProject', [])
      })
    },
    getStatusSubscribeDekaAgent: async (context, uuid) => {
      let statusSubscribeDekaAgent = {
        is_still_active: false,
        is_unsubscribe: false,
        instance_id: null,
      }
      return await axios.instance.get('/dekaagent/check-status-unsubscribe/' + uuid).then(response => {
        if (response.data.data.DeletedAt != null) {
          statusSubscribeDekaAgent.is_unsubscribe = true
        }

        if (response.data.data.status == "active") {
          statusSubscribeDekaAgent.is_still_active = true
        }
        statusSubscribeDekaAgent.instance_id = response.data.data.instance_id

        context.commit('setStatusInstanceDekaAgent', statusSubscribeDekaAgent)
        return statusSubscribeDekaAgent

      }).catch((e) => {
        context.commit('setStatusInstanceDekaAgent', statusSubscribeDekaAgent)
      })
    },
    fetchServerGroupByProject: async ({ commit, dispatch, rootState }, payload = {project_id: ''}) => {
      try {                          
          const activeProjectID = await libProject.getActiveProjectID();
          if (payload.project_id == '') payload.project_id = activeProjectID          
          const response = await axios.instance.get(`/servergroup/list`, {
              params: { ...payload }
          })
          if (response.data.data == null){              
              commit('setServerGroupByProject', [])
          }else{          
              let policyName = ''
              const data = response.data.data.map(x => {                        
                  if(x.policy == 'affinity'){
                      policyName = 'Affinity'
                  }else if(x.policy == 'anti-affinity'){
                      policyName = 'Anti Affinity'
                  }else if(x.policy == 'soft-affinity'){
                      policyName = 'Soft Affinity'
                  }else if(x.policy == 'soft-anti-affinity'){
                      policyName = 'Soft Anti Affinity'
                  }
                  return {
                      id: x.id,
                      name: x.name,
                      policy: x.policy,
                      policy_name: policyName,
                      instances: x.instances,
                  }
              })              
              commit('setServerGroupByProject', data)
              return response
          }                                
      } catch (e) {
          const err = e.response.data.data
          let errorMessage = 'A problem encountered while trying to get list of servergroups'
          dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
          return e.response
      }
    },
    getProcessorType: async ({ commit }, payload) => {
      // flavor/processor-groups?project_id=90d54d0d-4078-40d8-b440-fad1fef1b17b
      try {
        const response = await axios.instance.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/processor-groups?${payload}`);
        commit("setListProcessorType", response.data.data);
        return response;
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
    checkEula: async ({ commit }, payload) => {
      try {
        const response = await axios.instance.get(`/useradmin/eula/status?${payload}`);
        console.log("response", response.data.data.isValidate)
        if (response.status == 200) {
            commit("setStatusCheckEula", response.data.data.isValidate);
          }
      } catch (error) {
        // dispatch("HOMEPAGE/showErrorToast", `${error.response.data.responseMessage}`, { root: true });
      }
    },
 
    validateEula: async ({ commit, dispatch} , payload) => {
      try {
        const response = await axios.instance.post(`/useradmin/validate/eula`, payload); 
        return response;
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
      }
    },

    syncInstance: async ({dispatch, rootState}, payload) => {
      try {
        const currentOrg = rootState.SUPERADMIN.currentOrg;
        const projectid = localStorage.getItem('projectid');
        const instanceID = payload.instanceID;
        const response = await axios.instance.get(`/user/instances/sync?project_id=${projectid}&instance_id=${instanceID}&org_id=${currentOrg.id}`);
        
        dispatch("HOMEPAGE/showSuccessToast", `${response.data.message}`, { root: true });

        return response;
      } catch (error) {
        dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
        return error.response.data;
      }
      
    }
  }
}

// Setup event listener untuk project changes
if (typeof window !== 'undefined' && Vue.prototype.$VueEvent) {
  Vue.prototype.$VueEvent.listen('project-changed', (data) => {
    if (Vue.store) {
      Vue.store.dispatch('INSTANCE/handleProjectChange', data);
    }
  });
}