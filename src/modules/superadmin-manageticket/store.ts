import { ActionContext, Module } from 'vuex'
interface State {
    tickets: Array<any>,
    pagination: any,
    typetickets: Array<any>,
    requestType: Array<any>,
    status: Array<any>,
    totalRowsTickets: any,
    priorityitems: Array<any>,
    impactitem: Array<any>,
    urgencyitem: Array<any>,
    sitesitem: Array<any>;
    serviceCategoryItem: Array<any>,
    products: Array<any>,
    assets: Array<any>,
    allProjects: Array<any>
}
import axios from '@/lib/axios'
import axios2 from 'axios'
const store: Module<State, any> = {
    namespaced: true,
    state: {
        tickets: [],
        totalRowsTickets: 0,
        pagination: {},
        typetickets: [],
        requestType: [],
        status:[],
        priorityitems: [],
        impactitem: [],
        urgencyitem: [],
        sitesitem: [],
        serviceCategoryItem: [],
        products: [],
        assets: [],
        allProjects: []
    },
    mutations: {
        settickets: (state: State, payload: any) => state.tickets = payload,
        setTotalRowsTickets: (state: State, payload: any) => state.totalRowsTickets = payload,
        setpagination: (state: State, payload: any) => state.pagination = payload,
        settickettype: (state: State, payload: any) => state.typetickets = payload,
        setRequestType: (state: State, payload: any) => state.requestType = payload,
        setStatus: (state: State, payload: any) => state.status = payload,
        setpriority: (state: State, payload: any) => (state.priorityitems = payload),
        setimpact: (state: State, payload: any) => (state.impactitem = payload),
        seturgency: (state: State, payload: any) => (state.urgencyitem = payload),
        setsites: (state: State, payload: any) => (state.sitesitem = payload),
        setServiceCategoryItem: (state: State, payload: any) => (state.serviceCategoryItem = payload),
        setProducts: (state: State, payload: any) => state.products = payload,
        setAssets: (state: State, payload: any) => state.assets = payload,
        setAllProjects: (state: State, payload: any) => state.allProjects = payload
    },
    actions: {
        addticket: async (context: ActionContext<State, any>, payload: any) => {
            return await axios.instance.post('/ticket/create', payload).then(response=>{
                console.log(response)
            })
        },
        AddTicket: async (context: ActionContext<State, any>, payload: any) => {
            try {
                let response = await axios2.post(process.env.VUE_APP_API_BASE_URL_TICKET + "/ticket/requests/create", payload)
                context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
                return response
            }catch(e) {
                context.dispatch('HOMEPAGE/showErrorToast', e.response.data.message, { root: true })
                return e.response.data.message
            }
          },
        fetchticketstype: async (context: ActionContext<State, any>, payload: any) => {
            return await axios.instance.get('/ticket/request-type', ).then(response=>{
                console.log('test' + response.data.data)
                const typeticket = response.data.data
                context.commit('settickettype', typeticket )
             })
        },
        fetchtickets: async (context: ActionContext<State, any>, payload: any = { page: 1, itemsPerPage: 10, search: '' }) => {
            return axios.instance.get('/ticket/all', {
                params: {
                    page: payload.page,
                    limit: payload.itemsPerPage,
                    search: payload.search,
                    type_id: payload.type_id
                }
            }).then(response => {
                const { ticket, pagination } = response.data.data
                console.log(ticket)
                console.log(pagination)
                context.commit('settickets', ticket)
                context.commit('setpagination', pagination)
            })
        },
        fetchTicketss: async ( context: ActionContext<State, any>, payload: any) => {
            try{
                let sort = null
                if(payload.sortDesc.length){
                    if(payload.sortDesc[0]){
                        sort = 'asc'
                    }else{
                        sort = 'desc'
                    }
                }else{
                    sort = 'desc'
                }
                let API = process.env.VUE_APP_API_BASE_URL_TICKET + "/ticket/requests/all"
                API += "?limit="+payload.itemsPerPage+"&page="+payload.page
                payload.organization ? API+="&organization="+payload.organization : API
                payload.project ? API+="&project="+payload.project : API
                payload.type ? API+="&request_type="+payload.type : API
                payload.status ? API+="&status="+payload.status : API
                payload.sortBy.length>0 ? API += `&sort=${payload.sortBy[0]} ${sort}` : API

                return await axios.instance.get(`${API}`).then( (response) =>{
                // return await axios2.get(`${API}`).then( (response) =>{
                    let resp = response.data.data
                    if(resp.rows){
                        context.commit('settickets', resp.rows)
                        context.commit('setTotalRowsTickets', resp.total_rows)
                    }else{
                        context.commit('settickets', [])
                        context.commit('setTotalRowsTickets', 0)
                    }
                    return response.data
                })
            }catch(e) {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            }
        },
        fetchRequestType: async ( context: ActionContext<State, any>, payload: any) => {
            return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET +'/ticket/requests/request-type').then( response => {
                let resp = response.data
                if(resp.code == 200){
                    context.commit('setRequestType', resp.data)
                }
            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            })
        },
        fetchStatus: async ( context: ActionContext<State, any>, payload: any) => {
            return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET +'/ticket/requests/status').then( response => {
                let resp = response.data
                if(resp.code == 200){
                    context.commit('setStatus', resp.data)
                }
            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            })
        },
        fetchpriority: async (context: ActionContext<State, any>) => {
            return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET+"/ticket/requests/priority").then((response) => {
              const priority = response.data.data;
              context.commit("setpriority", priority);
            });
        },
        fetchimpact: async (context: ActionContext<State, any>) => {
            return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET + "/ticket/requests/impact").then((response) => {
            const impact = response.data.data;
            context.commit("setimpact", impact);
            });
        },
        fetchurgency: async (context: ActionContext<State, any>) => {
            return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET + "/ticket/requests/urgency").then((response) => {
            const urgency = response.data.data;
            context.commit("seturgency", urgency);
            });
        },
        fetchsites: async (context: ActionContext<State, any>) => {
            return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET+ "/ticket/requests/sites").then((response) => {
              const sites = response.data.data;
              context.commit("setsites", sites);
            });
        },
        fetchProducts: async (context: ActionContext<State, any>) => {
            context.commit('setAssets', [])
            return await axios2.get(process.env.VUE_APP_API_BASE_URL_TICKET + "/ticket/requests/item").then( (response) => {
                const products = response.data.data
                context.commit("setProducts", products)
            })
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
        fetchServiceCategory: async (context: ActionContext<State, any>) => {
            return await axios2
              .get(process.env.VUE_APP_API_BASE_URL_TICKET+"/ticket/requests/service-category")
              .then((response) => {
                const serviceCategory = response.data.data;
                context.commit("setServiceCategoryItem", serviceCategory);
              });
          },
          fetchAllProjects: async (context, payload) => {
            const user_role = context.rootState.ROLEPERMISSION.userrole
            if (user_role == 'Superadmin') {
                let params = {name: null, page: null, limit: null, id: null};
                if (payload && payload.name) {
                    params.name = payload.name
                }
                if (payload && payload.page) {
                    params.page = payload.page
                }
                if (payload && payload.limit) {
                    params.limit = payload.limit
                }
                if (payload && payload.id) {
                    params.id = payload.id
                }
                return await axios.instance.get(`superadmin/manageuser/projects`, {
                    params : params
                }).then(response => {
                    const data = response.data.data.project.map( (r: any) => {
                        return{
                            text: r.name,
                            value: r.id
                        }
                    })
                    context.commit('setAllProjects', data)
                    return data
                }).catch((e: any) => {
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                })
            }else{
                context.dispatch('HOMEPAGE/showErrorToast', "you do not have access", { root: true })
            }
        },
    },
}

export default store