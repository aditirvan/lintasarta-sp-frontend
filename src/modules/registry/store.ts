import { ActionContext, Module } from 'vuex'
import axios from 'axios'
import router from '@/lib/router'

function makeHeaders() {
    const params = JSON.parse(
        localStorage.getItem("registry") || "{}"
    );
    return {
        headers: { Authorization: `Bearer ${params.access_token}` }
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
function makeHeadersv1() {
   
    return {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }
}
interface state {
    pagination: any;
    listRepositories: Array<any>,
    listLogs: Array<any>,
    listProjects: Array<any>,
    status: Array<any>,
    detailRepositories: Array<any>,
    isLoading: Boolean,
    dataSummary: Object,
    listMembers: Array<any>,
    userOrg: Array<any>,
    listusersOrg: Array<any>,
    listmembersOrg: Array<any>,
    listUsers: Array<any>,
    quotalimits: Array<any>,
    quotastatus: Number,
    detailquotalimits: Array<any>,
    detailartifact: Array<any>,
    detailquotastatus: Number,
    listImmutable: Array<any>,
    listRegistry: Array<any>,
    listLabels: Array<any>,
    loadCard: Boolean,
    totalRepositories: Number,
    totalMembers: Number,
    totalLabels: Number,
    totalLogs: Number,
    infoSystem: Object,
    infoProj: Object,
    tableArtifacts: Array<any>,
    totaltableArtifacts:Number,
    tableOverview: Object,
    listBuildHistory: Array<any>,
    listVulnerabilities: Array<any>,
    loadingTags: Boolean,
    loading: Boolean,
    loadingBtn: Boolean,
}

const store: Module<state, any> = {
    namespaced: true,
    state: {
        listRepositories: [],
        totalRepositories: 0,
        listLogs: [],
        listProjects: [],
        status: [],
        detailRepositories: [],
        isLoading: false,
        dataSummary: {},
        listMembers: [],
        userOrg: [],
        listusersOrg: [],
        listmembersOrg: [],
        listUsers: [],
        quotalimits: [],
        detailquotalimits: [],
        detailartifact: [],
        detailquotastatus: 0,
        quotastatus: 0,
        totalMembers: 0,
        listImmutable: [],
        listRegistry: [],
        listLabels: [],
        loadCard: false,
        totalLabels: 0,
        totalLogs: 0,
        infoSystem: {},
        infoProj: {},
        tableArtifacts: [],
        totaltableArtifacts:0,
        tableOverview: {},
        listBuildHistory: [],
        listVulnerabilities: [],
        loadingTags: false,
        loading: false,
        pagination: {},
        loadingBtn: false,
    },

    getters: {
        listRepositories: state => { return state.listRepositories },
        totalRepositories: state => { return state.totalRepositories },
        listLogs: state => { return state.listLogs },
        listProjects: state => { return state.listProjects },
        status: state => { return state.status },
        detailRepositories: state => { return state.detailRepositories },
        isLoading: state => { return state.isLoading },
        isLoadingBtn: state => { return state.loadingBtn },
        dataSummary: state => { return state.dataSummary },
        listMembers: state => { return state.listMembers },
        userOrg: state => { return state.userOrg },
        listusersOrg: state => { return state.listusersOrg },
        listmembersOrg: state => { return state.listmembersOrg },
        listUsers: state => { return state.listUsers },
        quotalimits: state => { return state.quotalimits },
        detailquotalimits: state => { return state.detailquotalimits },
        detailquotastatus: state => { return state.detailquotastatus },
        detailartifact: state => { return state.detailartifact },
        quotastatus: state => { return state.quotastatus },
        totalMembers: state => { return state.totalMembers },
        listImmutable: state => { return state.listImmutable },
        listRegistry: state => { return state.listRegistry },
        listLabels: state => { return state.listLabels },
        loadCard: state => { return state.loadCard },
        totalLabels: state => { return state.totalLabels },
        totalLogs: state => { return state.totalLogs },
        infoSystem: state => { return state.infoSystem },
        infoProj: state => { return state.infoProj },
        tableArtifacts: state => { return state.tableArtifacts },
        totaltableArtifacts: state => { return state.totaltableArtifacts },
        tableOverview: state => { return state.tableOverview },
        listBuildHistory: state => { return state.listBuildHistory },
        listVulnerabilities: state => { return state.listVulnerabilities },
        loadingTags: state => { return state.loadingTags },
        loading: state => { return state.loading },
        setPagination: (state, payload) => (state.pagination = payload),
    },
    mutations: {
        setlistRepositories: (state: state, payload) => {
            state.listRepositories = payload
        },
        setTotalRepositories: (state: state, payload) => {
            state.totalRepositories = payload
        },
        setlistLogs: (state: state, payload) => {
            state.listLogs = payload
        },
        setlistProjects: (state: state, payload) => {
            state.listProjects = payload
        },
        setStatus: (state: state, payload) => {
            state.status = payload
        },
        setDetailRepositories: (state: state, payload) => {
            state.detailRepositories = payload
        },
        setIsLoading: (state: state, payload) => {
            state.isLoading = payload
        },
        setDataSummary: (state: state, payload) => {
            state.dataSummary = payload
        },
        setListMember: (state: state, payload) => {
            state.listMembers = payload
        },
        setTotalMember: (state: state, payload) => {
            state.totalMembers = payload
        },
        setListImmutable: (state: state, payload) => {
            state.listImmutable = payload
        },
        setListRegistry: (state: state, payload) => {
            state.listRegistry = payload
        },
        setlistLabels: (state: state, payload) => {
            state.listLabels = payload
        },
        setTotalLabels: (state: state, payload) => {
            state.totalLabels = payload
        },
        setLoadCard: (state: state, payload) => {
            state.loadCard = payload
        },
        setTotalLogs: (state: state, payload) => {
            state.totalLogs = payload
        },
        setInfoSystem: (state: state, payload) => {
            state.infoSystem = payload
        },
        setInfoProj: (state: state, payload) => {
            state.infoProj = payload
        },
        setTableArtifacts: (state: state, payload) => {
            state.tableArtifacts = payload
        },
        setTotaltableArtifacts: (state: state, payload) => {
            state.totaltableArtifacts = payload
        },
        setTableOverview: (state: state, payload) => {
            state.tableOverview = payload
        },
        setListBuildHistory: (state: state, payload) => {
            state.listBuildHistory = payload
        },
        setListVulnerabilities: (state: state, payload) => {
            state.listVulnerabilities = payload
        },
        setLoadingTags: (state: state, payload) => {
            state.loadingTags = payload
        },
        setLoading: (state: state, payload) => {
            state.loading = payload
        },
        setisLoadingBtn: (state: state, payload) => {
            state.loadingBtn = payload
        },
        setUserOrg: (state: state, payload) => {
            state.userOrg = payload
        },
        setlistusersOrg: (state: state, payload) => {
            state.listusersOrg = payload
        },
        setlistmembersOrg: (state: state, payload) => {
            state.listmembersOrg = payload
        },
        setListUsers: (state: state, payload) => {
            state.listUsers = payload
        },
        setquotalimits: (state: state, payload) => {
            state.quotalimits = payload
        },
        setquotastatus: (state: state, payload) => {
            state.quotastatus = payload
        },
        setdetailquotalimits: (state: state, payload) => {
            state.detailquotalimits = payload
        },
        setdetailquotastatus: (state: state, payload) => {
            state.detailquotastatus = payload
        },
        setdetailartifact: (state: state, payload) => {
            state.detailartifact = payload
        },
    },
    actions: {
        createProject: async (context: ActionContext<state,any>, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                context.commit('setIsLoading', true)
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/newproject/${param.organization_id}/${param.user_id}/${param.project_id}`, payload, makeHeadersv1())
                // const response = await axios.post(`http://localhost:1323/v1/registry/newproject/${param.organization_id}/${param.user_id}/${param.project_id}`, payload, makeHeadersv1())
                if (response.status <= 299) {
                    const nameProject = JSON.parse(localStorage.getItem("currentProj") || "{}")
                    const userId = JSON.parse(localStorage.getItem("userId"));
                    localStorage.setItem('registry', JSON.stringify({"registry_id":response.data.data.Registry_id,"registry_name":response.data.data.Registry_name,"organization_id":nameProject.organization_id,"user_id":userId,"project_id":nameProject.id,"project_name": nameProject.name.toLowerCase().replace(/ /g, "-")}));    
                    
                    context.dispatch('HOMEPAGE/showSuccessToast', 'Repository has been successfully created', { root: true })
                    // router.push("/registry/detail/overview");
                    // router.go(0);
                }
                // context.commit('setIsLoading', false)
                return response

            } catch (error) {
                context.commit('setIsLoading', false)
                context.dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                return error.response
            }
        },
        getListProjects: async ({ commit, dispatch }) => {
            const params = new URLSearchParams();
            params.append("page_size", "20");
            // params.append("page", "0");
            // params.append("sort", "created_at");
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/summary/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/summary/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`, makeHeadersv1())
                
                // console.log("=======response.status========",response.status)
                commit('setlistProjects', response.data.data)
                commit('setStatus', response.status)
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                commit('setStatus', error.response.status)
                if( error.response.status!=403){
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                }
            }
        },


        getListRepositories: async ({ commit, dispatch },  payload = { page: 1, itemsPerPage: 10 }) => {
            // commit('setlistRepositories', [])
            const params = new URLSearchParams();
            params.append("page_size", "10");
            params.append("page", "1");
            params.append("repository", payload);
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/repositories/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}`, makeHeadersv1());
                // const response = await axios.get(`http://localhost:80/v1/registry/repositories/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}`, makeHeadersv1());
                // console.log(response)
                const pagination={
                    "count":response.data.data.count,
                    "totalpage":response.data.data.totalpage,
                    "page":response.data.data.page
                }
                commit('setlistRepositories', response.data.data.rows)
                commit('setTotalRepositories', pagination)
                commit('setIsLoading', false)
                
                // const { alertings, pagination } = response.data.data
                // commit('setAlerts', alertings); 
                // commit('setPagination', pagination);
                // commit('setIsLoading', false)
                // return response.data
                
            } catch (error) {
                // console.log(error)
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },

        fetchListRepositories: async ({ commit, dispatch }, payload) => {
            // // console.log("params",payload.params)
            const params = new URLSearchParams();
            params.append("page_size", payload.params.page_size);
            params.append("page", payload.params.page);
            params.append("repository", payload.params.project);
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/repositories/${param.organization_id}/${param.user_id}/${param.project_id}?${params}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/repositories/${param.organization_id}/${param.user_id}/${param.project_id}?${params}`, makeHeadersv1())
                const pagination={
                    "count":response.data.data.count,
                    "totalpage":response.data.data.totalpage,
                    "page":response.data.data.page
                }
                commit('setlistRepositories', response.data.data.rows)
                commit('setTotalRepositories', pagination)
                commit('setIsLoading', false)
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },

        getDetailRepositories: async ({ commit, dispatch }, payload) => {
            const params = new URLSearchParams();
            params.append("page_size", "10");
            params.append("page", "1");
            params.append("repository", payload.project);
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listartifacts/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}/${payload.project}/${param.registry_id}?${params}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/listartifacts/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}/${payload.project}/${param.registry_id}?${params}`, makeHeadersv1())
                const pagination={
                    "count":response.data.data.count,
                    "totalpage":response.data.data.totalpage,
                    "page":response.data.data.page
                }
                commit('setDetailRepositories', response.data.data.rows)
                commit('setTableOverview', response.data.data.rows[0].extra_attrs)
                commit('setTotalRepositories', pagination)
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
            }
        },
        fetchDetailRepositories: async ({ commit, dispatch }, payload) => {
            const params = new URLSearchParams();
            params.append("page_size", payload.params.page_size);
            params.append("page", payload.params.page);
            params.append("repository", payload.params.project);
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listartifacts/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}/${payload.project}?${params}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/listartifacts/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}/${payload.project}?${params}`, makeHeadersv1())
                const pagination={
                    "count":response.data.data.count,
                    "totalpage":response.data.data.totalpage,
                    "page":response.data.data.page
                }
                commit('setDetailRepositories', response.data.data.rows)
                commit('setTableOverview', response.data.data.rows[0].extra_attrs)
                commit('setTotalRepositories', pagination)
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
            }
        },

        getListLogs: async ({ commit, dispatch }, payload) => {
            // commit('setlistLogs', [])
            const params = new URLSearchParams();
            params.append("page_size", "10");
            params.append("page", "1");
            params.append("repository", payload);
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/lislog/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/lislog/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}`, makeHeadersv1())
                const pagination={
                    "count":response.data.data.count,
                    "totalpage":response.data.data.totalpage,
                    "page":response.data.data.page
                }
                commit('setlistLogs', response.data.data.rows)
                commit('setTotalLogs', pagination)
                commit('setIsLoading', false)
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },

        fetchListLogs: async ({ commit, dispatch }, payload) => {
            const params = new URLSearchParams();
            params.append("page_size", payload.params.page_size);
            params.append("page", payload.params.page);
            params.append("repository", payload.params.project);
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/lislog/${param.organization_id}/${param.user_id}/${param.project_id}?${params}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/lislog/${param.organization_id}/${param.user_id}/${param.project_id}?${params}`, makeHeadersv1())
                const pagination={
                    "count":response.data.data.count,
                    "totalpage":response.data.data.totalpage,
                    "page":response.data.data.page
                }
                commit('setlistLogs', response.data.data.rows)
                commit('setTotalLogs', pagination)
                commit('setIsLoading', false)
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },

        getSummary: async ({ commit, dispatch }, payload) => {
            commit('setDataSummary', {})
            const params = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/summary/${params.organization_id}/${params.user_id}/${params.project_id}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/summary/${params.organization_id}/${params.user_id}/${params.project_id}`, makeHeadersv1())
                // console.log("=======data========",response.data.data)
                commit('setDataSummary', response.data.data) 
                commit('setStatus', response.status)
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                
                if( error.response.status!=403){
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })}
            }
        },

        getUserOrg: async ({ commit, dispatch }, payload) => {
            try {
                const params = new URLSearchParams();
                params.append("page_size", "100");
                params.append("page", "1");
                const param = JSON.parse(localStorage.getItem("registry"));
                // commit('setIsLoading', true)
                const response_listusers = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listusers/${param.organization_id}/${param.project_id}`,makeHeadersv1())
                // const response_listusers = await axios.get(`http://localhost:80/v1/registry/listusers/${param.organization_id}/${param.project_id}`,makeHeadersv1())
                
                const response_listmembers = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listmembers/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}`, makeHeadersv1())
                // const response_listmembers = await axios.get(`http://localhost:80/v1/registry/listmembers/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}`, makeHeadersv1())
                
                commit('setlistusersOrg', response_listusers.data.data)
                commit('setlistmembersOrg', response_listmembers.data.data.rows)
                // commit('setIsLoading', false)
            } catch (error) {
                // commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
            }
        },
        getlistUsers: async ({ commit, dispatch }, payload) => {
            try {
                const params = new URLSearchParams();
                const param = JSON.parse(localStorage.getItem("registry"));
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listusers/${param.organization_id}/${param.project_id}`,makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/listusers/${param.organization_id}/${param.project_id}`,makeHeadersv1())
               
                // console.log("===setUserOrg2=========",response)
                commit('setListUsers', response.data.data)
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
            }
        },
        getMembers: async ({ commit, dispatch }, payload) => {
            // commit('setListMember', [])
            const params = new URLSearchParams();
            params.append("page_size", "100");
            params.append("page", "1");
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response_listusers = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listusers/${param.organization_id}/${param.project_id}`,makeHeadersv1())
                // const response_listusers = await axios.get(`http://localhost:80/v1/registry/listusers/${param.organization_id}/${param.project_id}`,makeHeadersv1())
               
                const response_listmembers = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listmembers/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}`, makeHeadersv1())
                // const response_listmembers = await axios.get(`http://localhost:80/v1/registry/listmembers/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}`, makeHeadersv1())
                
                const pagination={
                    "count":response_listmembers.data.data.count,
                    "totalpage":response_listmembers.data.data.totalpage,
                    "page":response_listmembers.data.data.page
                }
                // console.log("count",response_listusers.data.data.count)
                commit('setlistusersOrg', response_listusers.data.data)
                commit('setlistmembersOrg', response_listmembers.data.data.rows)
                commit('setTotalMember', pagination)
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
            }
        },

        fetchMembers: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            
            const params = new URLSearchParams();
            params.append("page_size", payload.params.page_size);
            params.append("page", payload.params.page);
            params.append("repository", payload.params.project);
            try {
                commit('setIsLoading', true)
                
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listmembers/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/listmembers/${param.organization_id}/${param.user_id}/${param.project_id}?${params}`, makeHeadersv1())
                const pagination={
                    "count":response.data.data.count,
                    "totalpage":response.data.data.totalpage,
                    "page":response.data.data.page
                }
                commit('setListMember', response.data.data.rows)
                commit('setTotalMember', pagination)
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
            }
        },
        createMembers: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            // // console.log('payloadt bodi', payload)
            try {
                commit('setIsLoading', true)
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/createmembers/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`,payload, makeHeadersv1())
                // const response = await axios.post(`http://localhost:80/v1/registry/createmembers/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`,payload, makeHeadersv1())
                if (response.status <=299) {
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showSuccessToast', 'Member has been successfully created', { root: true })
                    dispatch('getMembers', payload)
                }

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        updateMembers: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            // console.log('payloadt bodi', payload)
            try {
                commit('setIsLoading', true)
                const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/updatemembers/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.member_id}/${param.registry_id}`,payload.body, makeHeadersv1())
                // const response = await axios.put(`http://localhost:80/v1/registry/updatemembers/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.member_id}/${param.registry_id}`,payload.body, makeHeadersv1())
                if (response.status <=299) {
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showSuccessToast', 'The role has been successfully updated', { root: true })
                    dispatch('getMembers', payload)
                }

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        updateStorage: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setisLoadingBtn', true)
                const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/updatequotas/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.quota_id}/${payload.projectId_reg}`,payload.body, makeHeadersv1())
                // const response = await axios.put(`http://localhost:1323/v1/registry/updatequotas/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.quota_id}/${payload.projectId_reg}`,payload.body, makeHeadersv1())
                // const response = await axios.put(`http://localhost:80/v1/registry/updatemembers/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.member_id}/${param.registry_id}`,payload.body, makeHeadersv1())
                if (response.status <=299) {
                    commit('setisLoadingBtn', false)
                    dispatch('HOMEPAGE/showSuccessToast', 'Storage has been successfully update', { root: true })
                }

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setisLoadingBtn', false)
            }
        },
        deleteMembers: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            // console.log('payloadt bodi', payload)
            try {
                commit('setIsLoading', true)
                const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/deletemembers/${param.organization_id}/${payload.UserID}/${param.project_id}/${payload.entity_id}`, makeHeadersv1())
                // const response = await axios.delete(`http://localhost:80/v1/registry/deletemembers/${param.organization_id}/${payload.UserID}/${param.project_id}/${payload.entity_id}`, makeHeadersv1())
                if (response.status<=299) {
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showSuccessToast', 'Member has been successfully deleted', { root: true })
                    dispatch('getMembers', payload)
                }

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        

        createLabels: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            // console.log('payloadt bodi', payload)
            try {
                commit('setIsLoading', true)
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/createlabels/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`,payload, makeHeadersv1())
                // const response = await axios.post(`http://localhost:80/v1/registry/createlabels/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`,payload, makeHeadersv1())
                if (response.status <=299) {
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showSuccessToast', 'Labels has been successfully created', { root: true })
                    dispatch('getListLabels', payload.project_id)
                }

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        updateLabels: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            // console.log('payloadt bodi', payload)
            try {
                commit('setIsLoading', true)
                const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/updatelabels/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`,payload, makeHeadersv1())
                // const response = await axios.put(`http://localhost:80/v1/registry/updatelabels/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`,payload, makeHeadersv1())
                if (response.status<=299) {
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showSuccessToast', 'Labels has been successfully update', { root: true })
                    dispatch('getListLabels', payload.project_id)
                }

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        deleteLabels: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            // console.log('payloadt bodi', payload)
            try {
                commit('setIsLoading', true)
                const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/deletelabels/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.label_id}/${param.registry_id}`, makeHeadersv1())
                // const response = await axios.delete(`http://localhost:80/v1/registry/deletelabels/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.label_id}/${param.registry_id}`, makeHeadersv1())
                if (response.status<=299) {
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showSuccessToast', 'Label has been successfully deleted', { root: true })
                    dispatch('getListLabels', payload.project_id)
                }

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },

        getListLabels: async ({ commit, dispatch }, payload) => {
            // commit('setlistLabels', [])
            const params = new URLSearchParams();
            params.append("page_size", "10");
            params.append("page", "1");
            const param = JSON.parse(localStorage.getItem("registry"));
            // params.append("project_id", payload);
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/lislabels/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/lislabels/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}`, makeHeadersv1())
                const pagination={
                    "count":response.data.data.count,
                    "totalpage":response.data.data.totalpage,
                    "page":response.data.data.page
                }
                commit('setlistLabels', response.data.data.rows)
                commit('setTotalLabels', pagination)
                commit('setIsLoading', false)
            } catch (error) {
                // console.log("error",error)
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },

        fetchLabels: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            const params = new URLSearchParams();
            params.append("page_size", payload.params.page_size);
            params.append("page", payload.params.page);
            params.append("repository", payload.params.project);
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/lislabels/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}?${params}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/lislabels/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}?${params}?${params}`, makeHeadersv1())
                const pagination={
                    "count":response.data.data.count,
                    "totalpage":response.data.data.totalpage,
                    "page":response.data.data.page
                }
                commit('setlistLabels', response.data.data.rows)
                commit('setTotalLabels', pagination)
                commit('setIsLoading', false)
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        getSystemInfo: async ({ commit, dispatch }) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                // commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/systeminfo/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/systeminfo/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`, makeHeadersv1())
                commit('setInfoSystem', response.data.data)
                commit('setInfoProj', response.data.projname)
                // commit('setIsLoading', false)
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                // commit('setIsLoading', false)
            }
        },

        getBuildHistory: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                // commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listbuildhistory/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}/${payload.project}/${payload.artifacts}/${param.registry_id}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/listbuildhistory/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}/${payload.project}/${payload.artifacts}/${param.registry_id}`, makeHeadersv1())
                commit('setListBuildHistory', response.data.data)
                // commit('setIsLoading', false)
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                // commit('setIsLoading', false)
            }
        },
        getVulnerabilities: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                // commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listvulnerabilities/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}/${payload.project}/${payload.artifacts}/${param.registry_id}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/listvulnerabilities/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}/${payload.project}/${payload.artifacts}/${param.registry_id}`, makeHeadersv1())
                // console.log("setListVulnerabilities============",response.data.data['application/vnd.security.vulnerability.report; version=1.1'])
                if(response.data.data['application/vnd.security.vulnerability.report; version=1.1']){
                commit('setListVulnerabilities', response.data.data['application/vnd.security.vulnerability.report; version=1.1'].vulnerabilities)
                }else{
                    commit('setLoading', true)
                }
            } catch (error) { 
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                // commit('setIsLoading', false)
            }
        },
        getGetDetailArtifact: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                // commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/getdetailartifact/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}/${payload.project}/${payload.digest}/${param.registry_id}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/getdetailartifact/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}/${payload.project}/${payload.digest}/${param.registry_id}`, makeHeadersv1())
                // console.log("scan_overview============",response.data.data.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status)
                // if(response.data.data['application/vnd.security.vulnerability.report; version=1.1']){
                commit('setdetailartifact', response.data.data)
                // }else{
                //     commit('setLoading', true)
                // }
            } catch (error) { 
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                // commit('setIsLoading', false)
            }
        },

        getListTags: async ({ commit, dispatch }, payload) => {
            const params = new URLSearchParams();
            params.append("page_size", "10");
            params.append("page", "1");
            const param = JSON.parse(localStorage.getItem("registry"));
            try { 
                commit('setLoadingTags', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listtags/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project_name}/${payload.project}/${payload.artifacts}/${param.registry_id}?${params}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/listtags/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}/${payload.project}/${payload.artifacts}/${param.registry_id}?${params}`, makeHeadersv1())
                const pagination={
                    "count":response.data.data.count,
                    "totalpage":response.data.data.totalpage,
                    "page":response.data.data.page
                }
                commit('setTableArtifacts', response.data.data.rows)
                commit('setTotaltableArtifacts', pagination)
                commit('setLoadingTags', false)
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setLoadingTags', false)
            }
        },
        fetchListTags: async ({ commit, dispatch }, payload) => {
            const params = new URLSearchParams();
            params.append("page_size", payload.pagination.page_size);
            params.append("page",payload.pagination.page);
            const param = JSON.parse(localStorage.getItem("registry"));
            try { 
                commit('setLoadingTags', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/listtags/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.param.name}/${payload.param.project}/${payload.param.artifacts}/${param.registry_id}?${params}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/listtags/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.param.name}/${payload.param.project}/${payload.param.artifacts}/${param.registry_id}?${params}`, makeHeadersv1())
                const pagination={
                    "count":response.data.data.count,
                    "totalpage":response.data.data.totalpage,
                    "page":response.data.data.page
                }
                commit('setTableArtifacts', response.data.data.rows)
                commit('setTotaltableArtifacts', pagination)
                commit('setLoadingTags', false)
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setLoadingTags', false)
            }
        },

        addTags: async ({ commit, dispatch }, payload) => {
            // console.log('payloadt bodi', payload.body)
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/createtags/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.params.project_name}/${payload.params.project}/${payload.params.artifacts}/${param.registry_id}`, payload.body, makeHeadersv1())
                // const response = await axios.post(`http://localhost:80/v1/registry/createtags/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.params.name}/${payload.params.project}/${payload.params.artifacts}/${param.registry_id}`, payload.body, makeHeadersv1())
                if (response.status<=299) {
                    // console.log( payload.params);
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showSuccessToast', 'Tags has been successfully created', { root: true })
                    dispatch('getListTags', payload.params)
                }

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        }, 
        deleteTags: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            // console.log('payloadt bodi', payload)
            try {
                commit('setIsLoading', true)
                const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/deletetags/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project.project_name}/${payload.project.project}/${payload.project.artifacts}/${payload.item}/${param.registry_id}`, makeHeadersv1())
                // const response = await axios.delete(`http://localhost:80/v1/registry/deletetags/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project.name}/${payload.project.project}/${payload.project.artifacts}/${payload.item}/${param.registry_id}`, makeHeadersv1())
                if (response.status<=299) {
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showSuccessToast', 'Tag has been successfully deleted', { root: true })
                    dispatch('getListTags', payload.project)
                }

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        confirmPass:async ({ commit, dispatch }, payload) => {
            commit('setIsLoading', true)
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                const res=await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/registry-access-key/${param.organization_id}/${param.user_id}/${param.project_id}`, payload,makeHeadersv1())
                // const res=await axios.post(`http://localhost:80/v1/registry/registry-access-key/${param.organization_id}/${param.user_id}/${param.project_id}`, payload,makeHeadersv1())
                // console.log(res.status);
                commit('setIsLoading', false)
                return res;
            } catch (error) {
                // console.log(error);
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        }, 
        showPass:async ({ commit, dispatch }, payload) => {
            commit('setIsLoading', true)
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                const res=await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/showpassword/${param.organization_id}/${param.user_id}/${param.project_id}`, makeHeadersv1())
                // console.log(res);
                commit('setIsLoading', false)
                return res;

            } catch (error) {
                // console.log(error);
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        downloadCRT: async ({ commit, dispatch }, payload) => {
            // let config = { params: payload, responseType: "blob" }
            
           
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/downloadcrt`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/downloadcrt`, makeHeadersv1())
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/crt' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'ca.crt');
                document.body.appendChild(link);
                link.click();
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `Failed download file`, { root: true })
            }
        },
        getDeleteRegistry: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            // // console.log('payloadt bodi', payload)
            try {
                commit('setIsLoading', true)
                const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/deleteregistry/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`, makeHeadersv1())
                // const response = await axios.delete(`http://localhost:80/v1/registry/deleteregistry/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`, makeHeadersv1())
                // router.push('registry')
                // router.go(0)
                dispatch('HOMEPAGE/showSuccessToast', 'Registry successfully deleted', { root: true })
                commit('setIsLoading', false)

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        getDeleteArtifact: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/deleteartifact/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.name}/${payload.digest}`, makeHeadersv1())
                // const response = await axios.delete(`http://localhost:80/v1/registry/deleteartifact/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.name}/${payload.digest}`, makeHeadersv1())
                if (response.status<=299) {
                    commit('setIsLoading', false)
                    const params = {
                        name: payload.name,
                        project:payload.project,
                      };
                    dispatch('HOMEPAGE/showSuccessToast', 'artifact has been successfully deleted', { root: true })
                    dispatch('getDetailRepositories', params)
                }
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        getDeleteRepositories: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/deleterepositories/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}`, makeHeadersv1())
                // const response = await axios.delete(`http://localhost:80/v1/registry/deleterepositories/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.name}`, makeHeadersv1())
                if (response.status<=299) {
                    commit('setIsLoading', false)
                    const params = {
                        name: payload.name
                      };
                    dispatch('HOMEPAGE/showSuccessToast', 'Repositories has been successfully deleted', { root: true })
                    dispatch('getListRepositories', params)
                }
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        getDeletelabeling: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                 const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/deletelabeling/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.name}/${payload.digest}/${payload.id}/${param.registry_id}`, makeHeadersv1())
                //  const response = await axios.delete(`http://localhost:80/v1/registry/deletelabeling/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.name}/${payload.digest}/${payload.id}`, makeHeadersv1())
                 if (response.status<=299) {
                    commit('setIsLoading', false)
                    const params = {
                        name: payload.name,
                        project: payload.project
                      };
                    dispatch('HOMEPAGE/showSuccessToast', 'Label has been successfully deleted', { root: true })
                    dispatch('getDetailRepositories', params)
                }
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                const params = {
                    name: payload.name,
                    project: payload.project
                  };
                dispatch('getDetailRepositories', params)
                commit('setIsLoading', false)
            }
        },
        getAddlabeling: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/addlabeling/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.name}/${payload.digest}/${param.registry_id}`,payload.body, makeHeadersv1())
                // const response = await axios.post(`http://localhost:80/v1/registry/addlabeling/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.name}/${payload.digest}/${param.registry_id}`,payload.body, makeHeadersv1())
                if (response.status<=299) {
                    // console.log( payload.params);
                    commit('setIsLoading', false)
                    const params = {
                        name: payload.name,
                        project: payload.project
                      };
                    dispatch('HOMEPAGE/showSuccessToast', 'Label added successfully', { root: true })
                    dispatch('getDetailRepositories', params)
                }
        
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                const params = {
                    name: payload.name,
                    project: payload.project
                  };
                dispatch('getDetailRepositories', params)
                commit('setIsLoading', false)
            }
        }, 
        getquotalimits: async ({ commit, dispatch }, payload) => {
            const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
            const currentProj = JSON.parse(localStorage.getItem("currentProj"));
            // console.log("Halo store=====",currentOrg.id);
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/quotalimits/${currentOrg.id}/${currentProj.id}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/quotalimits/${currentOrg.id}/${currentProj.id}`, makeHeadersv1())
                if (response.status<=299) {
                    // console.log("quotalimits store=====",response);
                    commit('setIsLoading', false)
                    commit('setquotalimits', response.data.data)
                    commit('setquotastatus', response.status)
                }
        
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        }, 
        getdetailquota: async ({ commit, dispatch }, payload) => {
            const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
            const currentProj = JSON.parse(localStorage.getItem("currentProj"));
            // console.log("Halo store=====",currentOrg.id);
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/getdetailquota/${currentOrg.id}/${currentProj.id}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/getdetailquota/${currentOrg.id}/${currentProj.id}`, makeHeadersv1())
                if (response.status<=299) {
                    commit('setIsLoading', false)
                    commit('setdetailquotalimits', response.data.data)
                    commit('setdetailquotastatus', response.status)
                }
        
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setdetailquotastatus',500)
                commit('setIsLoading', false)
            }
        }, 
        managequotalimits: async ({ commit, dispatch }, payload) => {
            const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
            try {
                commit('setIsLoading', true)
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/managequotalimits`,payload, makeHeadersv1())
                // const response = await axios.post(`http://localhost:80/v1/registry/managequotalimits/${payload.id_quota}`,payload.body, makeHeadersv1())
                if (response.status<=299) {
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showSuccessToast', 'Custom registry limit has been succesfully updated', { root: true })
                    await delay(1000);
                    router.push('organization-detail/'+currentOrg.id)
                    router.go(0)
                }
        
            } catch (error) {
                    dispatch('HOMEPAGE/showSuccessToast', 'Repositories has been successfully deleted', { root: true })
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        }, 

        scanArtifact: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            // console.log('scanArtifact payload', payload)
            try {
                commit('setIsLoading', true)
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/scanartifacts/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.repository}/${payload.digest}/${param.registry_id}`,null, makeHeadersv1())
                // const response = await axios.post(`http://localhost:80/v1/registry/scanartifacts/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.repository}/${payload.digest}/${param.registry_id}`,null, makeHeadersv1())
                if (response.status <=299) {
                    // commit('setIsLoading', false)
                    const params = {
                        name: payload.project,
                        project: payload.repository,
                        digest:payload.digest,
                      };
                    dispatch('getDetailRepositories', params)
                    dispatch('HOMEPAGE/showSuccessToast', 'Scanning', { root: true })
                }

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        scanArtifact_detail: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            // console.log('scanArtifact payload', payload)
            try {
                // commit('setIsLoading', true)
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/scanartifacts/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.repository}/${payload.digest}/${param.registry_id}`,null, makeHeadersv1())
                // const response = await axios.post(`http://localhost:80/v1/registry/scanartifacts/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.repository}/${payload.digest}/${param.registry_id}`,null, makeHeadersv1())
                if (response.status <=299) {
                    // commit('setIsLoading', false)
                    const params = {
                        name: payload.project,
                        project: payload.repository,
                        digest:payload.digest,
                      };
                    dispatch('getGetDetailArtifact', params)
                    dispatch('HOMEPAGE/showSuccessToast', 'Scanning', { root: true })
                }

            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        stopScanArtifact: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/stopscanartifacts/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.repository}/${payload.digest}/${param.registry_id}`,null, makeHeadersv1())
                // const response = await axios.post(`http://localhost:80/v1/registry/stopscanartifacts/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.project}/${payload.repository}/${payload.digest}/${param.registry_id}`,null, makeHeadersv1())
                if (response.status <=299) {
                    // commit('setIsLoading', false)
                    // console.log("response================================",response)
                    const params = {
                        name: payload.project,
                        project: payload.repository,
                        digest:payload.digest,
                      };
                    dispatch('getDetailRepositories', params)
                    dispatch('HOMEPAGE/showSuccessToast', 'Stop Scanning', { root: true })
                }
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        getTagImmutable: async ({ commit, dispatch }, payload) => {
            // commit('setListImmutable', [])
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/immutabletagrules/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/immutabletagrules/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`, makeHeadersv1())
                // console.log("immutabletagrules===========================",response)
                commit('setListImmutable', JSON.parse(JSON.stringify(response.data.data)))
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
            }
        },
        createTagImmutable: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true) 
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/createimmutabletagrules/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`,payload, makeHeadersv1())
                // const response = await axios.post(`http://localhost:80/v1/registry/createimmutabletagrules/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`,payload, makeHeadersv1())
                if (response.status <=299) {
                    dispatch('getTagImmutable')
                }
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        updateTagImmutable: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/updateimmutabletagrules/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`,payload, makeHeadersv1())
                // const response = await axios.put(`http://localhost:80/v1/registry/updateimmutabletagrules/${param.organization_id}/${param.user_id}/${param.project_id}/${param.registry_id}`,payload, makeHeadersv1())
                if (response.status <=299) {
                    dispatch('getTagImmutable')
                }
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        deleteTagImmutable: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/deleteimmutabletagrules/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.id}/${param.registry_id}`, makeHeadersv1())
                // const response = await axios.delete(`http://localhost:80/v1/registry/deleteimmutabletagrules/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.id}/${param.registry_id}`, makeHeadersv1())
                if (response.status <=299) {
                    dispatch('getTagImmutable')
                }
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        updateChangePass: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setIsLoading', true)
                const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/updateuserpass/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.idUser}/${param.registry_id}`,payload.param, makeHeadersv1())
                // const response = await axios.put(`http://localhost:80/v1/registry/updateuserpass/${param.organization_id}/${param.user_id}/${param.project_id}/${payload.idUser}/${param.registry_id}`,payload.param, makeHeadersv1())
                if (response.status <=299) {
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showSuccessToast', 'Member password has been changed successfully', { root: true })
                    dispatch('getMembers', payload.project_id)
                    dispatch('getUserOrg', payload.project_id)
                }
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
                commit('setIsLoading', false)
            }
        },
        getListRegistry: async ({ commit, dispatch }, payload) => {
            const param = JSON.parse(localStorage.getItem("registry"));
            try {
                commit('setListRegistry', [])
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dekaregistry/v1/registry/getlistregistry/${param.project_id}`, makeHeadersv1())
                // const response = await axios.get(`http://localhost:80/v1/registry/getlistregistry/${param.project_id}`, makeHeadersv1())
                
                commit('setListRegistry', response.data.data)
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', `${error.response.data.message}`, { root: true })
            }
        },
    }
}

export default store