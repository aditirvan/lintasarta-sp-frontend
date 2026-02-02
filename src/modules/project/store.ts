import { ActionContext, Module } from 'vuex'
import { Project, PaginatedProjectList, defaultPaginatedProjectList } from './type'
import axios from '@/lib/axios'
import axiosLib from "axios";
import localstorage from '@/lib/localstorage'

function makeHeaders() {
    const params = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${params}` },
    };
}

interface State {
    createModal: boolean,
    selectModal: boolean,
    opendialogcreateopenstack: boolean,
    projects: Array<Project>,
    allProjects: PaginatedProjectList,
    opendialogproject: boolean,
    projectname: string,
    projectid: string,
    opendialogselectfirst: boolean,
    opendialogopenstacknotfound: boolean,
    projectsCount: number,
    newServiceAvailability: any,
    isCheckNewServiceLoading: boolean,
}
const store: Module<State, any> = {
    namespaced: true,
    state: {
        createModal: false,
        selectModal: false,
        opendialogcreateopenstack: false,
        projects: [],
        allProjects: { ...defaultPaginatedProjectList },
        opendialogproject: false,
        projectname: '',
        projectid: '',
        opendialogselectfirst: false,
        opendialogopenstacknotfound: false,
        projectsCount: 0,
        newServiceAvailability: {},
        isCheckNewServiceLoading: false,
    },
    getters: {
        getprojectname: (state: any) => {
            console.log('get project name');
            const projectname = localstorage.getItem('projectname')
            console.log(projectname);
            state.projectname = projectname
            return state.projectname
        },
        getprojectid: (state: any) => {
            const projectid = localstorage.getItem('projectid')
            state.projectid = projectid
            return state.projectid
        },
        showCreateModal: (state) => {
            state.createModal
        },
        showSelectModal: (state) => {
            state.selectModal
        },
        getprojects: (state) => state.projects,
        getAllProject: (state) => {
            if (!state.allProjects) {
                return []
            }
            return state.allProjects.project
        },
        getAllProjectPaginate: (state) => {
            if (!state.allProjects) {
                return []
            }
            return state.allProjects.paginate
        },
        getProjectsCount: (state) => {
            return state.projectsCount
        },
        newServiceAvailability: (state) => {
            return state.newServiceAvailability
        },
        isCheckNewServiceLoading: (state) => {
            return state.isCheckNewServiceLoading
        }
    },
    mutations: {
        setprojectname: (state, data) => {
            localstorage.setItem('projectname', data)
            state.projectname = data

        },
        setprojectid: (state, data) => {
            localstorage.setItem('projectid', data)
            state.projectid = data
        },
        setcreatemodal: (state, data) => {
            state.createModal = data
        },
        setselectmodal: (state, data) => {
            state.selectModal = data
        },
        setopendialogcreateopenstack: (state, data) => {
            state.opendialogcreateopenstack = data
        },
        setprojects(state, projects) {
            state.projects = projects
        },
        setAllProjects(state, data) {
            state.allProjects = data
        },
        setopendialogselectfirst(state, payload) { state.opendialogselectfirst = payload },
        setProjectsCount(state, data) {
            state.projectsCount = data
        },
        setopendialogopenstacknotfound(state, payload) {
            state.opendialogopenstacknotfound = payload
        },
        setNewServiceAvailability: (state, payload) => {
            state.newServiceAvailability = payload;
        },
        setIsCheckNewServiceLoading: (state, payload) => {
            state.isCheckNewServiceLoading = payload
        }
    },
    actions: {
        changeProjectNameTo: async ({ commit }, project_name) => {
            console.log('changeProjectNameTo >>>', project_name);

            commit('setprojectname', project_name)
        },
        changeProjectTo: async ({ commit }, project_id) => {
            commit('setprojectid', project_id)
        },
        opendialogselectproject: async (context: ActionContext<State, any>) => {
            context.commit('setselectmodal', true)
        },
        opendialogcreateopenstack: async (context: ActionContext<State, any>) => {
            context.commit('setopendialogcreateopenstack', true)
        },
        addproject: async (context: ActionContext<State, any>, project) => {
            const user_role = context.rootState.ROLEPERMISSION.userrole
            if (user_role == 'Superadmin') {
                return await axios.instance.post('/superadmin/projects', project)
            }
            return await axios.instance.post('/user/projects', project)
        },
        createOpenstack: async (context: ActionContext<State, any>, project) => {
            const user_role = context.rootState.ROLEPERMISSION.userrole
            if (user_role == 'Superadmin') {
                return await axios.instance.post('/superadmin/dekaprime-projects/openstack', project)
            }
            return await axios.instance.post('/user/dekaprime-projects/openstack', project)
        },
        openSelectModal({ commit, state }, data) {
            commit('SET_SELECT_MODAL', state.selectModal = data)
        },
        fetchprojects: async (context, payload) => {
            const user_role = context.rootState.ROLEPERMISSION.userrole

            if (user_role == 'Superadmin') {
                const currentOrg = context.rootState.SUPERADMIN.currentOrg
                if (!currentOrg) return
                return await axios.instance.get(`superadmin/manageorg/${currentOrg.id}/projects`).then(response => {
                    const data = response.data.data
                    context.commit('setprojects', data.projects)
                    return data
                }).catch((e: any) => {
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                })
            }
            return await axios.instance.get('/user/organization/projects/byOrg').then(response => {
                const data = response.data.data ? response.data.data : []
                context.commit('setprojects', data)
                return data
            }).catch((e: any) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            })
        },
        fetchAllProjects: async (context, payload) => {
            const user_role = context.rootState.ROLEPERMISSION.userrole
            if (user_role == 'Superadmin') {
                let params = { name: null, page: null, limit: null };
                if (payload && payload.name) {
                    params.name = payload.name
                }
                if (payload && payload.page) {
                    params.page = payload.page
                }
                if (payload && payload.limit) {
                    params.limit = payload.limit
                }
                return await axios.instance.get(`superadmin/manageuser/projects`, {
                    params: params
                }).then(response => {
                    const data = response.data.data
                    context.commit('setAllProjects', data)
                    return data
                }).catch((e: any) => {
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                })
            } else {
                context.dispatch('HOMEPAGE/showErrorToast', "you do not have access", { root: true })
            }
        },
        editproject: async (context, payload) => {
            return await axios.instance.put(`/user/projects/${payload.id}`, payload)
        },
        deleteproject: async (context, payload) => {
            try{
                const response = await axios.instance.delete(`/user/projects/${payload.id}`)
                context.dispatch(
                    "HOMEPAGE/showSuccessToast",
                    "Project has been successfully deleted.",
                    { root: true }
                  );
                  context.commit("setIsLoading", false);
                  return response;
            }catch(e){
                context.dispatch( "HOMEPAGE/showErrorToast", e.response.data.data, { root: true } );
            }
        },
        checkproject: async (context, payload) => {
            return axios.instance.delete(`/user/checking/projects/${payload.id}`)
        },
        validatelimitcreateproject: async (context, payload) => {
            const role = localStorage.getItem('role')
            if (role == 'Superadmin') {
                const currentOrg = context.rootState.SUPERADMIN.currentOrg
                return await axios.instance.get(`/superadmin/validate/project/${currentOrg.id}`).then(response => {
                    const data = response.data.data
                    if (data && data.can_create == true) {
                        return Promise.resolve(true)
                    } else {
                        context.commit('DASHBOARD/setopendialogreachlimit', true, { root: true })
                        return Promise.reject('')
                    }
                })
            }
            return await axios.instance.get('/user/validate/project').then(response => {
                const { can_create } = response.data.data
                if (can_create) {
                    return Promise.resolve('')
                } else {
                    context.commit('DASHBOARD/setopendialogreachlimit', true, { root: true })
                    return Promise.reject('')
                }
            })
        },
        getProjectsCountInOrganization: async (context) => {
            const role = localStorage.getItem('role')
            if (role == 'Superadmin') {
                const currentOrg = context.rootState.SUPERADMIN.currentOrg
                return await axios.instance.get(`superadmin/projects/count/${currentOrg.id}`).then(response => {
                    const data = response.data.data.count
                    context.commit('setProjectsCount', data)
                    return data
                }).catch((e: any) => {
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                })
            } else {
                return await axios.instance.get(`user/projects/count`).then(response => {
                    const data = response.data.data.count
                    context.commit('setProjectsCount', data)
                    return data
                }).catch((e: any) => {
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                })
            }
        },
        checkNewServiceAvailability: async ({ commit, dispatch }, payload) => {
            try {
                commit("setIsCheckNewServiceLoading", true);
                const response = await axiosLib.post(`${process.env.VUE_APP_API_BASE_URL_BILLING}/project/new-service/availability`, payload, makeHeaders());
                commit("setNewServiceAvailability", response.data.data);
                commit("setIsCheckNewServiceLoading", false);
            } catch (error) {
                dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
                commit("setIsCheckNewServiceLoading", false);
            }
        },
        multiCheckNewServiceAvailability: async ({ commit, dispatch }, payload) => {
            try {
                commit("setIsCheckNewServiceLoading", true);
                const response = await axiosLib.post(`${process.env.VUE_APP_API_BASE_URL_BILLING}/project/new-service/multi-availability`, payload, makeHeaders());
                commit("setNewServiceAvailability", response.data.data);
                commit("setIsCheckNewServiceLoading", false);
            } catch (error) {
                dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
                commit("setIsCheckNewServiceLoading", false);
            }
        },
         
    }
}
export default store