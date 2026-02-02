import axios from '@/lib/axios'
import axiosDbaas from '@/lib/axiosDbaas'
import { async } from 'rxjs'
import { ActionContext, Module } from 'vuex'
import Vue from 'vue'


interface State {
    currentOrg: any,
    currentProj: any,
    organizations: Array<any>,
    organizationprojects: Array<any>,
    organizationprojectpagination: any,
    orgswithprojects:Array<any>,
    orgswithprojectspagination:any,
}
export const store: Module<State, any> = {
    namespaced: true,
    state: {
        currentOrg: null,
        currentProj: null,
        organizations: [],
        organizationprojects: [],
        organizationprojectpagination: {},
        orgswithprojects: [],
        orgswithprojectspagination: {},
    },
    mutations: {
        setCurrentOrg: (state: State, Org: any) => {
            state.currentProj = null
            state.currentOrg = Org
            localStorage.setItem('currentOrg', JSON.stringify(Org))
            localStorage.removeItem('currentProj')

        },
        setCurrentProj: (state: State, Proj: any) => {
            const oldProjectId = state.currentProj?.id;
            const newProjectId = Proj?.id;
            
            state.currentProj = Proj
            if(Proj){
                localStorage.setItem('projectid', Proj.id)
                localStorage.setItem('currentProj', JSON.stringify(Proj))
            }
            
            // Emit project change event jika project berbeda
            if (oldProjectId !== newProjectId) {
                Vue.prototype.$VueEvent.emit('project-changed', {
                    oldProject: { id: oldProjectId },
                    newProject: Proj
                });
            }
            
            // const vm = new Vue() as any
            // let url = `${process.env.VUE_APP_WS_BASE_URL}/instances_status?project_id=${state.currentProj.id}`
            // vm.$connect(url);
        },
        setorganizations: (state: State, payload) => state.organizations = payload,
        setorganizationprojects: (state: State, payload) => state.organizationprojects = payload,
        setorgprojectpagination: (state: State, payload) => state.organizationprojectpagination = payload,
        setorgswithprojects: (state: State, payload) => state.orgswithprojects = payload,
        setorgswithprojectspagination: (state: State, payload) => state.orgswithprojectspagination = payload
    },
    actions: {
        updateCurrentProj: (context: ActionContext<State, any>, payload) => {
            context.commit('setCurrentProj', payload)
            context.dispatch('ORGANIZATION/fetchprojects', null, { root: true })
        },
        fetchorganizations: async (context: ActionContext<State, any>, payload) => {
            const params = { params: { limit: -1, is_manually_payable: null } };
            if (!!payload && payload.isManuallyPayable !== null) {
                params.params.is_manually_payable = payload.isManuallyPayable;
            }

            return await axios.instance.get('/superadmin/list/manageorg', params).then((response) => {
                const { organizations, pagination } = response.data.data
                context.commit('setorganizations', organizations)
                context.commit('setpagination', pagination)
                return response
            })
        },
        fetchorganizationprojects: async (context: ActionContext<State, any>, payload) => {
            const params = {
            params: { 
                limit: payload.itemsPerPage ? payload.itemsPerPage : -1, 
                page: payload.page ? payload.page : 1,
                search: payload.search,
                is_manually_payable: null 
            }};

            if (!!payload && payload.isManuallyPayable !== null) {
                params.params.is_manually_payable = payload.isManuallyPayable;
            }

            return await axios.instance.get('/superadmin/list/manageorgproject', params).then((response) => {
                const { organization_projects, pagination } = response.data.data
                context.commit('setorganizationprojects', organization_projects)
                context.commit('setorgprojectpagination', pagination)
                return response
            })
        },
        fetchprojectwithorganization: async (context: ActionContext<State, any>, projectId) => {
            return await axios.instance.get('/user/project/organization/detail/' + projectId).then((response) => {
                return response
            })
        },
        fetchorgswithprojects: async (context: ActionContext<State, any>, payload) => {
            const params = {params: { ...payload}};

            return await axios.instance.get('/superadmin/orgsprojects', params).then((response) => {
                const { data, pagination } = response.data.data
                context.commit('setorgswithprojects', data)
                context.commit('setorgswithprojectspagination', pagination)
                return response
            })
        },
        loginDns: async (context: ActionContext<State, any>, payload) => {
            // return await axios.instance.post(`${process.env.VUE_APP_API_BASE_URL_DNS}/api/v1/auth/connect`, payload).then((response) => {
            return await axios.instance.post('dekadns/api/v1/auth/connect', payload).then((response) => {
                localStorage.setItem('loginDns', JSON.stringify(response.data.data));
            })
        },
        loginSsl: async (context: ActionContext<State, any>, payload) => {
            return await axios.instance.post(`/ssl-services/v1/auth/login`, payload).then((response) => {
                localStorage.setItem('loginSsl', JSON.stringify(response.data.data));
            })
        },
        loginDbaas: async (context: ActionContext<State, any>, payload) => {
            const currentProj = JSON.parse(localStorage.getItem("currentProj") || "{}");
            const region = currentProj.region.split("-")[0].toLowerCase() || "";
            let url = ''

            switch (region) {
            case "tkp":
                url = '/dbaas-connector/login'
                break;
            case "tbs":
                url = '/dbaas-connector/tbs/login'
                break;
            case "jah":
                url = '/dbaas-connector/jah/login'
                break;
            default:
                url = '/dbaas-connector/login'
                break;
            }

            return await axiosDbaas.instance.post(url, payload).then((response) => {
                localStorage.setItem('loginDbaas', JSON.stringify(response.data));
                return response.data
            })
        },
        logoutDbaas: async (context: ActionContext<State, any>, payload) => {
            const currentProj = JSON.parse(localStorage.getItem("currentProj") || "{}");
            const region = currentProj.region.split("-")[0].toLowerCase() || "";
            let url = ''

            switch (region) {
            case "tkp":
                url = '/dbaas-connector/logout'
                break;
            case "tbs":
                url = '/dbaas-connector/tbs/logout'
                break;
            case "jah":
                url = '/dbaas-connector/jah/logout'
                break;
            default:
                url = '/dbaas-connector/logout'
                break;
            }

            return await axiosDbaas.instance.post(url, payload).then((response) => {
                localStorage.setItem('loginDbaas', null);
            })
        },
    }
}