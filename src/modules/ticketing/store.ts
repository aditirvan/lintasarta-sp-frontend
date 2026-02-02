import { ActionContext, Module } from "vuex";
interface State {
  tickets: Array<any>;
  attachment: Array<any>;
  pagination: any;
  paginationAttachment: any;
  typetickets: Array<any>;
  requestsItem: Array<any>;
  serviceCategoryItem: Array<any>;
  statusitem: Array<any>;
  sitesitem: Array<any>;
  impactitem: Array<any>;
  urgencyitem: Array<any>;
  categoryitem: Array<any>;
  subcategoryitem: Array<any>;
  items: Array<any>;
  priorityitems: Array<any>;
  commentitems: Array<any>;
  detailtickets: any;
  assets: any
}
import axios from "@/lib/axios";
import axios2 from 'axios'
import { async } from "rxjs";
const store: Module<State, any> = {
  namespaced: true,
  state: {
    tickets: [],
    pagination: {},
    paginationAttachment: {},
    typetickets: [],
    requestsItem: [],
    serviceCategoryItem: [],
    statusitem: [],
    sitesitem: [],
    impactitem: [],
    urgencyitem: [],
    categoryitem: [],
    subcategoryitem: [],
    items: [],
    priorityitems: [],
    detailtickets: {},
    commentitems: [],
    attachment: [],
    assets: []
  },
  mutations: {
    settickets: (state: State, payload: any) => (state.tickets = payload),
    setattachment: (state: State, payload: any) => (state.attachment = payload || []),
    setpagination: (state: State, payload: any) => (state.pagination = payload),
    setpaginationAttachment: (state: State, payload: any) =>
      (state.paginationAttachment = payload),
    settickettype: (state: State, payload: any) =>
      (state.typetickets = payload),
    setrequesttype: (state: State, payload: any) =>
      (state.requestsItem = payload),
    setServiceCategoryItem: (state: State, payload: any) =>
      (state.serviceCategoryItem = payload),
    setstatus: (state: State, payload: any) => (state.statusitem = payload),
    setsites: (state: State, payload: any) => (state.sitesitem = payload),
    setimpact: (state: State, payload: any) => (state.impactitem = payload),
    seturgency: (state: State, payload: any) => (state.urgencyitem = payload),
    setcategory: (state: State, payload: any) => (state.categoryitem = payload),
    setsubcategory: (state: State, payload: any) =>
      (state.subcategoryitem = payload),
    setitem: (state: State, payload: any) => (state.items = payload),
    setpriority: (state: State, payload: any) =>
      (state.priorityitems = payload),
    setdetailticket: (state: State, payload: any) =>
      (state.detailtickets = payload),
    setcomment: (state: State, payload: any) => (state.commentitems = payload),
    setAssets: (state: State, payload: any) => (state.assets = payload)
  },

  getters: {
    getattachment: (state: State) => {
      return state.attachment ? state.attachment : [];
    },
  },
  actions: {
    addticket: async (context: ActionContext<State, any>, payload: any) => {
      return axios.instance.post("/ticket/create", payload);
    },
    AddTicket: async (context: ActionContext<State, any>, payload: any) => {
      try{
        let response = await axios2.post(process.env.VUE_APP_API_BASE_URL_TICKET + `/ticket/requests/create`, payload)
        context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
        return response
      }catch(e) {
        // console.log(e.response)
        context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
        return e.response.data.message
    }
    },
    addcomment: async (context: ActionContext<State, any>, payload: any) => {
      return axios2.post(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/comment/add", payload);
    },
    addattachment: async (context: ActionContext<State, any>, payload: any) => {
      return axios2.post(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/attachments/add", payload);
    },
    deleteattachment: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      return axios2.delete(
        process.env.VUE_APP_API_BASE_URL_TICKET +`/ticket/attachments/${payload.attachId}/ticket/${payload.ticketId}`,
        payload
      );
    },
    updatecomment: async (context: ActionContext<State, any>, payload: any) => {
      return axios2.post(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/comment/edit", payload);
    },
    fetchticketstype: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      return await axios2
        .get(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/requests/ticket-type")
        .then((response) => {
          const typeticket = response.data.data;
          context.commit("settickettype", typeticket);
        });
    },
    fetchrequest: async (context: ActionContext<State, any>) => {
      return await axios2
        .get(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/requests/request-type")
        .then((response) => {
          const request = response.data.data;
          context.commit("setrequesttype", request);
        });
    },
    fetchServiceCategory: async (context: ActionContext<State, any>) => {
      return await axios2
        .get(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/requests/service-category")
        .then((response) => {
          const serviceCategory = response.data.data;
          context.commit("setServiceCategoryItem", serviceCategory);
        });
    },
    fetchstatus: async (context: ActionContext<State, any>) => {
      return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/requests/status").then((response) => {
        const status = response.data.data;
        context.commit("setstatus", status);
      });
    },
    fetchsites: async (context: ActionContext<State, any>) => {
      return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/requests/sites").then((response) => {
        const sites = response.data.data;
        context.commit("setsites", sites);
      });
    },
    fetchimpact: async (context: ActionContext<State, any>) => {
      return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/requests/impact").then((response) => {
        const impact = response.data.data;
        context.commit("setimpact", impact);
      });
    },
    fetchurgency: async (context: ActionContext<State, any>) => {
      return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/requests/urgency").then((response) => {
        const urgency = response.data.data;
        context.commit("seturgency", urgency);
      });
    },
    fetchpriority: async (context: ActionContext<State, any>) => {
      return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/requests/priority").then((response) => {
        const priority = response.data.data;
        context.commit("setpriority", priority);
      });
    },
    fetchcategory: async (context: ActionContext<State, any>) => {
      return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/requests/category").then((response) => {
        const category = response.data.data;
        context.commit("setcategory", category);
      });
    },
    fetchsubcategory: async (context: ActionContext<State, any>) => {
      return await axios2
        .get(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/requests/subcategory")
        .then((response) => {
          const subcat = response.data.data;
          context.commit("setsubcategory", subcat);
        });
    },
    fetchitem: async (context: ActionContext<State, any>) => {
      context.commit('setAssets', [])
      return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET +"/ticket/requests/item").then((response) => {
        const item = response.data.data;
        context.commit("setitem", item);
      });
    },
    fetchAssets: async (context: ActionContext<State, any>, payload: any) => {
      context.commit('setAssets', [])
      let basicAuth: any = {
          auth : {
              username: process.env.VUE_APP_BASICAUTH_ASSET_USERNAME,
              password: process.env.VUE_APP_BASICAUTH_ASSET_PASSWORD
          }
      }
      return await axios2.get(process.env.VUE_APP_API_BASE_URL + '/sdp-connector/assets/' + payload.productName + '/' + payload.project_id , basicAuth ).then( response => {
        const dataAssets = response.data.data
        context.commit("setAssets", dataAssets)
        return response.data
      })
  },
    fetchtickets: async (
      context: ActionContext<State, any>,
      payload: any = { page: 1, itemsPerPage: 10, search: "" }
    ) => {
      const params: {
        page: any;
        limit: any;
        project?: any;
        request_type?: any;
        status?: any;
      } = { page: payload.page, limit: payload.itemsPerPage };
      if (payload.project) {
        params.project = payload.project;
      }
      if (payload.request_type) {
        params.request_type = payload.request_type;
      }
      if (payload.status) {
        params.status = payload.status;
      }
      return axios.instance.get("/ticket/all", { params }).then((response) => {
        const ticket = response.data.data.ticket;
        const pagination = response.data.data.pagination;
        context.commit("settickets", ticket);
        context.commit("setpagination", pagination);
      });
    },
    fetchattachment: async (
      context: ActionContext<State, any>,
      payload: any = { page: 1, itemsPerPage: 10 }
    ) => {
      const params: { page: any; limit: any } = {
        page: payload.page || 1,
        limit: payload.itemsPerPage || 10,
      };
      return axios2
        .get(process.env.VUE_APP_API_BASE_URL_TICKET+`/ticket/attachments/ticket/${payload.id}`, { params })
        .then((response) => {
          // const attachments = response.data.data.ticket;
          const attachments = response.data.data;
          if (attachments && attachments.length) {
            context.commit("setattachment", attachments);
          } else {
            context.commit("setattachment", []); // reset kalau null
          }
          // const pagination = response.data.data.pagination;
          const pagination = response.data.data.length;
          context.commit("setpaginationAttachment", pagination);
        });
    },
    fetchdetailtiket: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      return await axios2
        .get(process.env.VUE_APP_API_BASE_URL_TICKET + `/ticket/requests/detail/${payload}`)
        .then((response) => {
          const detail = response.data.data;
          if (detail.assets == null) {
            detail.assets = []
          }
          context.commit("setdetailticket", detail);
        });
    },
    fetchdetailtikett: async (
      context: ActionContext<State, any>,
      payload: any
    ) => {
      return await axios2
        .get(process.env.VUE_APP_API_BASE_URL_TICKET + `/ticket/requests/detail/${payload}`)
        .then((response) => {
          const detail = response.data.data;
          if (detail.assets == null) {
            detail.assets = []
          }
          context.commit("setdetailticket", detail);
        });
    },
    fetchcomment: async (context: ActionContext<State, any>, payload: any) => {
      return await axios2
        .get(process.env.VUE_APP_API_BASE_URL_TICKET +`/ticket/comment/ticket/${payload}`)
        .then((response) => {
          const comment = response.data.data;
          context.commit("setcomment", comment);
        });
    },
  },
};

export default store;
