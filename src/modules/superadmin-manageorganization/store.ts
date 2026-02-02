import axios from '@/lib/axios'
import externalSubDomain from '@/lib/externalSubDomain'
import { async } from 'rxjs'
import {ActionContext, Module} from 'vuex'
interface State {
    organizations : Array<any>,
    pagination: any,
    members: Array<any>,
    memberpagination: any
    projects: Array<any>,
    projectspagination: any,
    roles: Array<any>,
    organizationsall : Array<any>,
    listActivityOrganisasi : Array<any>,
    listActivityUser : Array<any>,
    listActivityProject : Array<any>,
    listActivityRole : Array<any>,
}
const store: Module<State,any>= {
    namespaced: true,
    state:{
        organizations:[],
        pagination: {},
        members: [],
        memberpagination:{},
        projects: [],
        projectspagination:{},
        roles:[],
        organizationsall:[],
        listActivityOrganisasi:[],
        listActivityUser:[],
        listActivityProject:[],
        listActivityRole:[],
    },
    mutations:{
        setorganizations:(state:State, payload:any)=>state.organizations = payload,
        setpagination:(state:State, payload:any)=>state.pagination = payload,
        setmembers(state: any, members:any){
            state.members = members
        },
        setprojects:(state:State, payload:any)=>state.projects = payload,
        setprojectspagination:(state:State, payload:any)=>state.projectspagination = payload,
        setmemberpagination: (state:State, payload:any)=>state.memberpagination = payload,
        setroles: (state:State, payload:any)=>state.roles = payload,
        setorganizationsall:(state:State, payload:any)=>state.organizationsall = payload,
        setListActivityOrganisasi:(state:State, payload:any)=>state.listActivityOrganisasi = payload,
        setListActivityUser:(state:State, payload:any)=>state.listActivityUser = payload,
        setListActivityProject:(state:State, payload:any)=>state.listActivityProject = payload,
        setListActivityRole:(state:State, payload:any)=>state.listActivityRole = payload,
    },
    actions:{
        fetchorganizations: async(context: ActionContext<State, any>, payload: any={page:1,itemsPerPage: 10})=>{
            return await axios.instance.get('/superadmin/manageorg', {params:{page:payload.page,limit:payload.itemsPerPage, search:payload.search, sortBy:payload.sortBy, sortDesc:payload.sortDesc}}).then(response=>{
               const {organization, pagination} = response.data.data
               if(organization==null){
                context.commit('setorganizations', [])
               }else{
               context.commit('setorganizations', organization)
               }
               context.commit('setpagination', pagination)
            })
        },
        fetchorganization: async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.get(`/superadmin/manageorg/${payload.id}`, ).then(response=>{
               const currentOrg =  response.data.data
               console.log('test'+ currentOrg)
               context.commit('SUPERADMIN/setCurrentOrg', currentOrg, {root: true})
            })
        },
        addorganization: async(context: ActionContext<State, any>, payload: any)=>{
            const externalSubdomain = externalSubDomain.getSubDomain();
            payload.external_subdomain = externalSubdomain
            const host = window.location.host;
            payload.host = host;
            return await axios.instance.post('/superadmin/manageorg', payload)
        },
        editorganization: async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.put(`/superadmin/manageorg/${payload.id}`, payload)
        },

        checkdeleteorg: async(context:ActionContext<any, any>, payload:any)=>{
            return await axios.instance.delete(`/superadmin/manageorg/checking/${payload.id}`, {data:payload})
        },

        deleteorg: async(context:ActionContext<any, any>, payload:any)=>{
            console.log(payload.name);
            return await axios.instance.delete(`/superadmin/manageorg/delete/${payload.id}`, {data:payload})
        },

        unsuspendorg: async(context:ActionContext<any, any>, id: string)=>{
            return await axios.instance.put(`/superadmin/manageorg/unsuspend/${id}`)
        },

        changeorgstatus: async(context: ActionContext<State, any>, payload: any)=>{
            const externalSubdomain = externalSubDomain.getSubDomain();
            payload.external_subdomain = externalSubdomain
            if(payload.status){
                return await axios.instance.put(`/superadmin/manageorg/${payload.id}/deactive`,payload)
            }else{
                return await axios.instance.put(`/superadmin/manageorg/${payload.id}/active`, payload)
            }
        },
        upgradeorg: async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.put(`/superadmin/manageorg/${payload.id}/npwp`,payload)
        },
        downgradeorg: async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.put(`/superadmin/manageorg/${payload.id}/basic`)
        },
        addmember: async(context: ActionContext<State, any>, payload: any)=>{
            const currentOrg = context.rootState.SUPERADMIN.currentOrg
            const externalSubdomain = externalSubDomain.getSubDomain();
            payload.external_subdomain = externalSubdomain
            const host = window.location.host;
            payload.host = host;
            return await axios.instance.post(`/superadmin/manageorg/member/${currentOrg.id}`, payload).then(response=>{
            })
        },
        editmember: async(context:ActionContext<any, any>, payload:any)=>{
            const currentOrg = context.rootState.SUPERADMIN.currentOrg
            payload.user_id = payload.id
            return await axios.instance.put(`superadmin/manageorg/${currentOrg.id}/member`, payload)
        },
        deletemember: async(context:ActionContext<any, any>, payload:any)=>{
            const currentOrg = context.rootState.SUPERADMIN.currentOrg
            payload.user_id = payload.id
            
            return await axios.instance.delete(`/superadmin/manageorg/member/${currentOrg.id}`, {data:payload})
            
        },

        resendemail:async(context: ActionContext<State, any>, payload: any)=>{
            const externalSubdomain = externalSubDomain.getSubDomain();
            const host = window.location.host;
            const json = {
                external_subdomain: externalSubdomain,
                host
            }
            return await axios.instance.post(`/superadmin/manageuser/resend-verified/${payload.id}`, json).then(response=>{
                console.log(response)
            })
        },
       
        fetchmembers: async(context: ActionContext<State, any>, payload: any={page:1,itemsPerPage:10})=>{
            const currentOrg = context.rootState.SUPERADMIN.currentOrg
            return await axios.instance.get(`/superadmin/manageorg/${currentOrg.id}/member`,{params:{page:payload.page,limit:payload.itemsPerPage}}).then((response)=>{
               const {user, pagination} = response.data.data
               context.commit('setmembers', user)
               context.commit('setmemberpagination', pagination)
            })
        },
        addproject: async(context: ActionContext<State, any>, payload)=>{
            return await axios.instance.post('/superadmin/projects',payload)
        },
        fetchprojects: async(context: ActionContext<State, any>, payload: any={page:1,itemsPerPage:10})=>{
            const currentOrg = context.rootState.SUPERADMIN.currentOrg
            const id = payload && payload.id ? payload.id : currentOrg?.id
            if(!id){
                context.commit('setprojects', [])
                return
            }
            return await axios.instance.get(`/superadmin/manageorg/${id}/projects`,{params:{page:payload.page,limit:payload.itemsPerPage, search: payload.search}}).then((response)=>{
               const {projects, pagination} = response.data.data
               context.commit('setprojects', projects)
               context.commit('setprojectspagination', pagination)
               return {projects, pagination}
            })
        },
        fetchRoles: async(context:ActionContext<any, any>, payload: any={page:1,itemsPerPage:10})=>{
            let currentOrg = context.rootState.SUPERADMIN.currentOrg
            if(payload.currentOrg){
                currentOrg = payload.currentOrg
            }
            if(!currentOrg) return
            return await axios.instance.get(`/user/organization/role`,
            {
                params:{
                    page:payload.page,limit:payload.itemsPerPage,
                    org_id:currentOrg.id
                }
            }).then((response)=>{
                const {organization_roles} = response.data.data
                context.commit('setroles', organization_roles)
            })
        },
        fetchprojectsSelectOption: async(context: ActionContext<State, any>, payload: any={page:1,itemsPerPage:10})=>{
            const currentOrg = context.rootState.SUPERADMIN.currentOrg
            const id = payload && payload.id ? payload.id : currentOrg?.id
            if(!id){
                context.commit('setprojects', [])
                return
            }
            return await axios.instance.get(`/superadmin/manageorg/${id}/projectsall`,{params:{page:payload.page,limit:payload.itemsPerPage, search: payload.search}}).then((response)=>{
               const {projects, pagination} = response.data.data
               context.commit('setprojects', projects)
               context.commit('setprojectspagination', pagination)
               return {projects, pagination}
            })
        },
        fetchorganizationsall: async(context: ActionContext<State, any>, payload: any={page:1,itemsPerPage: 10})=>{
            return await axios.instance.get('/superadmin/manageorgall', {params:{search:payload.search, sortBy:payload.sortBy, sortDesc:payload.sortDesc}}).then(response=>{
               const {organization} = response.data.data
               context.commit('setorganizationsall', organization)
            })
        },
        editlogowhitelabel: async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.post(`/label/logo`, payload)
                .then((response) => {})
                .catch((e) => {
                    if (e.response.data.data) {
                        return Promise.reject(e);
                      } else {
                        context.dispatch("HOMEPAGE/showErrorToast", e.message, {
                          root: true,
                        });
                        return Promise.reject("error");
                      }
                });
        },
        restoreroleweblabel: async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.get(`/superadmin/restorerole/${payload.id}`)
                .then((response) => {})
                .catch((e) => {
                    if (e.response.data.data) {
                        return Promise.reject(e);
                      } else {
                        context.dispatch("HOMEPAGE/showErrorToast", e.message, {
                          root: true,
                        });
                        return Promise.reject("error");
                      }
                });
        },
        getActivityOrganisasi: async(context: ActionContext<State, any>, payload: any)=>{
            try {
                const response = await axios.instance.get(`/superadmin/manageorg/activity/${payload.id}`, { params: payload.params });
                context.commit("setListActivityOrganisasi", response.data.data);
            } catch (error) {
                context.dispatch("HOMEPAGE/showErrorToast", `${error.response.data.data}`, { root: true });
            }
        },
        getActivityUser: async(context: ActionContext<State, any>, payload: any)=>{
            try {
                const response = await axios.instance.get(`/superadmin/manageorg/activity/${payload.id}`, { params: payload.params });
                context.commit("setListActivityUser", response.data.data);
            } catch (error) {
                context.dispatch("HOMEPAGE/showErrorToast", `${error.response.data.data}`, { root: true });
            }
        },
        getActivityProject: async(context: ActionContext<State, any>, payload: any)=>{
            try {
                const response = await axios.instance.get(`/superadmin/manageorg/activity/${payload.id}`, { params: payload.params });
                context.commit("setListActivityProject", response.data.data);
            } catch (error) {
                context.dispatch("HOMEPAGE/showErrorToast", `${error.response.data.data}`, { root: true });
            }
        },
        getActivityRole: async(context: ActionContext<State, any>, payload: any)=>{
            try {
                const response = await axios.instance.get(`/superadmin/manageorg/activity/${payload.id}`, { params: payload.params });
                context.commit("setListActivityRole", response.data.data);
            } catch (error) {
                context.dispatch("HOMEPAGE/showErrorToast", `${error.response.data.data}`, { root: true });
            }
        },
    }
}

export default store