import axios from "@/lib/axios";
import { ActionContext, Module } from "vuex";
import { toIDRWithDotFormat } from "../../lib/formatter";
import localstorage from "@/lib/localstorage";

interface State {
  billingdetails: any;
  billings: Array<any>;
  billing: any;
  projectBilling: any;
  billingDetail: any;
  creditCardIds: Array<number>;
}
const store: Module<State, any> = {
  namespaced: true,
  state: {
    billingdetails: null,
    billings: [],
    billing: null,
    projectBilling: [],
    billingDetail: null,
  },
  getters: {
    billinginstance: (state: State) => {
      return state.billingdetails.instance_detail.map((e: any) => ({
        name: e.name,
        servicetype: "Instance",
        spec: `${e.package_instance.vcpu} vCPU / ${e.package_instance.ram} GB Memory`,
        root_disk: `${
          e.vm_root_disk_package
            ? e.vm_root_disk_package.volume_size
            : e.package_instance.root_disk
        } GB`,
        price: `${toIDRWithDotFormat(e.package_instance.price_per_month)}/mo`,
        billingtype: e.billing_type ? e.billing_type : "-",
        usage: e.usage ? e.usage : "-",
        billed: `${toIDRWithDotFormat(e.billed)}`,
        billednumber: e.billed,
      }));
    },
    firstdate: (state: State) => new Date(state.billingdetails.first_date),
    untildate: (state: State) => new Date(state.billingdetails.until_date),
    billingstorage: (state: State) => {
      return state.billingdetails.storage_detail.map((e: any) => ({
        name: e.name,
        servicetype: "Storage",
        spec: `${e.package_storage.volume_size} GB`,
        price: `${toIDRWithDotFormat(e.package_storage.price_per_month)}/mo`,
        billingtype: e.billing_type ? e.billing_type : "-",
        usage: e.usage ? e.useage : "-",
        billed: `${toIDRWithDotFormat(e.billed)}`,
        billednumber: e.billed,
      }));
    },
    billingperservice: (state: State) => {
      const list = [];
      state.billingdetails.total_instance.forEach((e: any) => {
        list.push({
          name: "Lintas Service",
          servicetype: "Instance",
          spec: `256 GB / 32 CPUs
            4.69 TB NVMe SSDs
            10 TB transfer`,
          price: "IDR 1,000,000/mo",
          billingtype: "PPM",
          usage: "-",
          billed: "1,000,000",
        });
      });
      return [
        {
          name: "Lintas Service",
          servicetype: "Instance",
          spec: `256 GB / 32 CPUs
          4.69 TB NVMe SSDs
          10 TB transfer`,
          price: "IDR 1,000,000/mo",
          billingtype: "PPM",
          usage: "-",
          billed: "1,000,000",
        },
        {
          name: "Cloud Service",
          servicetype: "Storage",
          spec: `256 GB / 32 CPUs
          4.69 TB NVMe SSDs
          10 TB transfer`,
          price: "IDR 2,000,000/mo",
          billingtype: "PPU",
          usage: "30%",
          billed: "600,000",
        },
        {
          name: "VM Service",
          servicetype: "Instance",
          spec: `256 GB / 32 CPUs
          4.69 TB NVMe SSDs
          10 TB transfer`,
          price: "IDR 5,000,000/mo",
          billingtype: "PPU",
          usage: "-",
          billed: "5,000,000",
        },
      ];
    },
    billinglist: (state: State) => {
      return state.billingdetails.service_detail;
    },
    total: (state: State) => {
      return (
        state.billingdetails.storage.reduce((t: number, v: any) => {
          return t + v.package_storage.price_per_month;
        }, 0) +
        state.billingdetails.total_instance.reduce((t: number, v: any) => {
          return t + v.package_instance.price_per_month;
        }, 0)
      );
    },
  },
  mutations: {
    setbillingdetails: (state: State, payload: any) =>
      (state.billingdetails = payload),
    setbillings: (state: State, payload: any) => (state.billings = payload),
    setBilling: (state: State, payload: any) => (state.billing = payload),
    setCreditCardIds: (state: State, payload: any) => (state.creditCardIds = payload),
    setProjectBilling: (state: State, payload: any) =>
      (state.projectBilling = payload),
    setBillingDetail: (state: State, payload: any) =>
      (state.billingDetail = payload),
  },
  actions: {
    fetchbillings: async ({ commit, dispatch, rootState }, payload: any) => {
      const currentOrg = rootState.SUPERADMIN.currentOrg;
      return await axios.instance
        .get(`/billing/organization/${currentOrg.id}`)
        .then((response) => {
          commit("setbillings", response.data.data);
        });
    },
    getBillingDetail: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.instance.post("/billing/v2/monthly-cost/by-type", payload);

        commit("setBillingDetail", response.data.data);

        return response;
      } catch (e) {
        return e.response;
      }
    },
    fetchbillingdetails: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      return axios.instance
        .get(`/billing/project/${payload.id}`)
        .then((response) => {
          const data = response.data.data;
          context.commit("setbillingdetails", data);
        });
    },
    fetchBillingCycleDate: async ({ commit, dispatch }, payload: any) => {
      const response = await axios.instance.get(`/billing/get-date`);
      commit("setBillingCycleDate", response.data.data);
    },
    fetchBillingHistory2: async ({ commit, dispatch }, payload) => {
      try {
        const endpoint = "/billing/v2/history";
        const response = await axios.instance.post(endpoint, payload);
        commit("setProjectBilling", response.data.data);
        return response;
      } catch (e) {
        return e.response;
      }
    },
    fetchBillingHistory: async ({ commit, dispatch }, payload) => {
      try {
        const role = localstorage.getItem("role");
        const isSuperAdmin = role && role === "Superadmin";

        const currentOrg = localstorage.getItem("currentOrg");
        const org = JSON.parse(currentOrg || "{}");

        const admin =
          "/superadmin/billing/monthly-cost/summary/history/" + org.id;
        const user = "/billing/monthly-cost/summary/history";

        const summary = isSuperAdmin ? admin : user;
        const proj = "/billing/monthly-cost/history";

        const endpoint = payload.project_id === "all-project" ? summary : proj;

        const response = await axios.instance.post(endpoint, payload);

        commit("setProjectBilling", response.data.data);

        return response;
      } catch (e) {
        return e.response;
      }
    },
    getBilling: async ({ commit, dispatch }, payload) => {
      commit("setBilling", null);

      try {
        const role = localstorage.getItem("role");
        const isSuperAdmin = role && role === "Superadmin";
        const currentOrg = localstorage.getItem("currentOrg");
        const org = JSON.parse(currentOrg || "{}");

        const allProjSuperadmin =
          "/superadmin/billing/monthly-cost/summary/total-billed/" + org.id;
        const selectProjSuperadmin = `/superadmin/billing/monthly-cost/total-billed/${org.id}/${payload}`;

        const allProjUser = "/billing/monthly-cost/summary/total-billed";
        const selectProjUser = "/billing/monthly-cost/total-billed/" + payload;

        const allProjEndpoint = isSuperAdmin ? allProjSuperadmin : allProjUser;
        const selectProjEndpoint = isSuperAdmin
          ? selectProjSuperadmin
          : selectProjUser;

        const endpoint =
          payload === "all-project" ? allProjEndpoint : selectProjEndpoint;

        // const endpoint = '/billing/monthly-cost/total-billed/' + payload

        const res = await axios.instance.get(endpoint);
        const billing = res.data.data;
        const { date_start, date_end, billed, project, project_id, total } =
          billing;

        // let result = payload === 'all-project' ? {
        //     date_start,
        //     date_end,
        //     billed,
        //     project,
        //     project_id
        // } : {
        //     date_start,
        //     date_end,
        //     billed: total,
        //     project,
        //     project_id
        // }

        let result = {
          date_start,
          date_end,
          billed: total,
          project,
          project_id,
        };

        commit("setBilling", result);
      } catch (e) {
        return e.response;
      }
    },
    postBillingOrganization: async ({ commit, dispatch }, payload) => {
      commit("setBilling", null);

      const role = localstorage.getItem("role");
      const endpoint =
        role && role === "Superadmin"
          ? "/superadmin/billing/monthly-cost"
          : "/billing/organization";

      try {
        const res = await axios.instance.post(endpoint, payload);
        const billing = res.data.data;
        const {
          date_start,
          date_end,
          billed,
          ppn,
          ppn_value,
          price,
          user,
          organization,
        } = billing;

        let result = {
          ppn,
          ppn_value,
          price,
          date_start,
          date_end,
          billed,
          user,
          organization,
          details: billing.details.map((detail: any) => {
            const { project, billed, other } = detail;
            return {
              project,
              billed,
              instances: detail.instances,
              storages: detail.storages,
              root_disks: detail.root_disks,
              object_storages: detail.object_storages,
              other,
            };
          }),
        };

        commit("setBilling", result);
      } catch (e) {
        return e.response;
      }
    },
    fetchBillingOrganization: async ({ commit, dispatch }, payload) => {
      commit("setBilling", null);

      const response = await axios.instance.get(`/billing/organization`);
      const billing = response.data.data;
      const {
        date_start,
        date_end,
        billed,
        ppn,
        ppn_value,
        price,
        user,
        organization,
        invoice_number,
      } = billing;
      let result = {
        invoice_number,
        ppn,
        ppn_value,
        price,
        date_start,
        date_end,
        billed,
        user,
        organization,
        details: billing.details.map((detail: any) => {
          const { project, billed, other } = detail;
          return {
            project,
            billed,
            instances: detail.instances,
            storages: detail.storages,
            root_disks: detail.root_disks,
            object_storages: detail.object_storages,
            other,
          };
        }),
      };
      commit("setBilling", result);
    },
    getListCcID: async ({ commit, dispatch }, payload) => {
      try {
        const endpoint = "/payment/list-cc";

        const res = await axios.instance.get(endpoint);
        const list = res.data.data;


        commit("setBilling", list);
      } catch (e) {
        return e.response;
      }
    },
  },
};

export default store;
