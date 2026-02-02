import { Module } from 'vuex'
import axios from 'axios'
import router from '@/lib/router'
import { async } from 'rxjs';




const createConfigs = (config?: any) => {
    const getToken = JSON.parse(localStorage.getItem("loginSsl") || "{}");
    return {
        headers: { Authorization: `Bearer ${getToken.token}` },
        ...config
    }
}

const baseURL = `${process.env.VUE_APP_API_BASE_URL}/ssl-services`
const wsProtocol = `${String(URL.parse(location.href).protocol).includes("https") ? "wss" : "ws"}`
const wsBaseUrl = `wss://${URL.parse(baseURL).host}/core/ssl-services`

interface state {
    isLoading: Boolean,
    isCreated: Boolean,
    isLoadingUpdateVcl: Boolean,
    isLoadingUpdateDeployment: Boolean,
    isLoadingCheckPassword: Boolean,
    isLoadingDelete: Boolean,
    isLoadingDeploy: Boolean,
    isLoadingRenewalSSL: Boolean,
    isLoadingStatsData: Boolean,
    isLoadingStatsLine: Number,
    listCDN: Array<any>,
    totalData: number,
    detailCDN: Array<any>,
    renewalData: Array<any>,
    listDns: Array<any>,
    listTag: Array<any>,
    vclSource: string
    isValidPassword: boolean,
    listSsl: Array<any>,
    observer: Array<any>,
    content: string
    cdnLimit: Array<any>,
    statsDataReq: Object,
    statsDataMiss: Object,
    statsLine: Array<any>,
    loadingRequest: Number,
    loadingMiss: Number,
    loadingHits: Number,
    isLoadingHitRate: Number,
    statsDataHits: Object,
    loadingSections: Number,
    statsDataSections: Object,
    statsDataHitRate: Object,
}


const store: Module<state, any> = {
    namespaced: true,
    state: {
        isLoading: false,
        isCreated: false,
        isLoadingUpdateVcl: false,
        isLoadingUpdateDeployment: false,
        isLoadingCheckPassword: false,
        isLoadingDelete: false,
        isLoadingDeploy: false,
        isLoadingRenewalSSL:false,
        listCDN: [],
        totalData: 0,
        detailCDN: [],
        renewalData: [],
        listDns: [],
        listTag: [],
        vclSource: "",
        isValidPassword: false,
        listSsl: [],
        observer: [],
        content: '',
        cdnLimit: [],
        statsDataReq: {},
        statsDataMiss: {},
        statsLine: [],
        isLoadingStatsData: false,
        isLoadingStatsLine: 0,
        loadingRequest: 0,
        loadingMiss: 0,
        loadingHits: 0,
        statsDataHits: {},
        loadingSections: 0,
        statsDataSections: {},
        statsDataHitRate: {},
        isLoadingHitRate: 0,
    },
    getters: {
        isLoading: state => { return state.isLoading },
        vclSource: state => { return state.vclSource },
        isCreated: state => { return state.isCreated },
        isLoadingDelete: state => { return state.isLoadingDelete },
        isLoadingDeploy: state => { return state.isLoadingDeploy },
        isLoadingRenewalSSL: state => { return state.isLoadingRenewalSSL },
        isLoadingUpdateVcl: state => { return state.isLoadingUpdateVcl },
        isLoadingUpdateDeployment: state => { return state.isLoadingUpdateDeployment },
        isLoadingCheckPassword: state => { return state.isLoadingCheckPassword },
        listCDN: state => { return state.listCDN },
        totalData: state => { return state.totalData },
        detailCDN: state => { return state.detailCDN },
        listDns: state => { return state.listDns },
        listTag: state => { return state.listTag },
        isValidPassword: state => { return state.isValidPassword },
        listSsl: state => { return state.listSsl },
        observer: state => { return state.observer },
        content: state => { return state.content },
        cdnLimit: state => { return state.cdnLimit },
        statsDataReq: state => { return state.statsDataReq },
        statsDataMiss: state => { return state.statsDataMiss },
        statsLine: state => { return state.statsLine },
        isLoadingStatsData: state => { return state.isLoadingStatsData },
        isLoadingStatsLine: state => { return state.isLoadingStatsLine },
        loadingRequest: state => { return state.loadingRequest },
        loadingMiss: state => { return state.loadingMiss },
        loadingHits: state => { return state.loadingHits },
        statsDataHits: state => { return state.statsDataHits },
        loadingSections: state => { return state.loadingSections },
        statsDataSections: state => { return state.statsDataSections },
        statsDataHitRate: state => { return state.statsDataHitRate },
        isLoadingHitRate: state => { return state.isLoadingHitRate },
    },
    mutations: {
        setIsLoading: (state: state, payload) => {
            state.isLoading = payload
        },
        setIsCreated: (state: state, payload) => {
            state.isCreated = payload
        },
        setIsLoadingUpdateVcl: (state: state, payload) => {
            state.isLoadingUpdateVcl = payload
        },
        setIsLoadingDelete: (state: state, payload) => {
            state.isLoadingDelete = payload
        },
        setIsLoadingDeploy: (state: state, payload) => {
            state.isLoadingDeploy = payload
        },
        setIsLoadingRenewalSSL: (state: state, payload) => {
            state.isLoadingRenewalSSL = payload
        },
        setListCDN: (state: state, payload) => {
            state.listCDN = payload
        },
        setTotalData: (state: state, payload) => {
            state.totalData = payload
        },
        setDetailCDN: (state: state, payload) => {
            state.detailCDN = payload
        },
        setlistDns: (state: state, payload) => {
            state.listDns = payload
        },
        setlistTag: (state: state, payload) => {
            state.listTag = payload
        },
        setvclSource: (state: state, payload) => {
            state.vclSource = payload
        },
        setIsValidPassword: (state: state, payload) => {
            state.isValidPassword = payload
        },
        setIsLoadingUpdateDeployment: (state: state, payload) => {
            state.isLoadingUpdateDeployment = payload
        },
        setIsLoadingCheckPassword: (state: state, payload) => {
            state.isLoadingCheckPassword = payload
        },
        setListSsl: (state: state, payload) => {
            state.listSsl = payload
        },
        setObserver: (state: state, payload) => {
            state.observer.push(payload)
        },
        setContent: (state: state, payload) => {
            state.content = payload
        },
        setCdnLimit: (state: state, payload) => {
            state.cdnLimit = payload
        },
        setStatsDataReq: (state: state, payload) => {
            state.statsDataReq = payload
        },
        setStatsDataMiss: (state: state, payload) => {
            state.statsDataMiss = payload
        },
        setStatsLine: (state: state, payload) => {
            state.statsLine = payload
        },
        setIsLoadingStatsData: (state: state, payload) => {
            state.isLoadingStatsData = payload
        },
        setIsLoadingStatsLine: (state: state, payload) => {
            state.isLoadingStatsLine = payload
        },
        setLoadingRequest: (state: state, payload) => {
            state.loadingRequest = payload
        },
        setLoadingMiss: (state: state, payload) => {
            state.loadingMiss = payload
        },
        setLoadingHits: (state: state, payload) => {
            state.loadingHits = payload
        },
        setStatsDataHits: (state: state, payload) => {
            state.statsDataHits = payload
        },
        setLoadingSections: (state: state, payload) => {
            state.loadingSections = payload
        },
        setStatsDataSections: (state: state, payload) => {
            state.statsDataSections = payload
        },
        setStatsDataHitRate: (state: state, payload) => {
            state.statsDataHitRate = payload
        },
        setIsLoadingHitRate: (state: state, payload) => {
            state.isLoadingHitRate = payload
        },
    },
    actions: {
        getRealtimeStat: async ({commit, dispatch}, payload) => {
            const token = JSON.parse(localStorage.getItem("loginSsl") || "{}").token;
            const connection = new WebSocket(`${wsBaseUrl}/v1/cdn/${payload.id}/stats/realtime?token=${token}`)
            connection.onmessage = (message) => {
                const data = JSON.parse(message.data);
                console.log("on message");
                console.log(data);
                console.log("on message");
            }
            connection.onopen = (event) => {
                console.log("on open", event)
            }
            connection.onclose = (event) => {
                console.log("on close", event)
            }
        },
        getListCDN: async ({ commit, dispatch }, payload) => {
            const currentProj = JSON.parse(localStorage.getItem('currentProj'))
            const params = new URLSearchParams();
            let page = "1"
            let limit = "10"
            if (payload) {
                page = payload.page
                limit = payload.limit
            }
            params.append("projectId", currentProj.id)
            params.append("page", page)
            params.append("limit", limit)
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${baseURL}/v1/cdn/?${params}`, createConfigs())
                commit('setListCDN', JSON.parse(JSON.stringify(response.data.data.rows)))
                commit('setTotalData', JSON.parse(JSON.stringify(response.data.data.total_rows)))
                commit('setStatsDataReq', {})
                commit('setStatsDataMiss', {})
                commit('setStatsLine', {})
                commit('setStatsDataHits', {})
                commit('setStatsDataSections', {})
                commit('setStatsDataHitRate', {})
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', `Failed to load data`, { root: true })
            }
        },
        getDetailCDN: async ({ commit, dispatch }, payload) => {
            try {
                const response = await axios.get(`${baseURL}/v1/cdn/${payload}`, createConfigs())
                commit('setDetailCDN', JSON.parse(JSON.stringify(response.data.data)))
                const obj = JSON.parse(JSON.stringify(response.data.data))
                // Add null check to prevent atob crash
                if (obj.vclSource && typeof obj.vclSource === 'string') {
                    const content = atob(obj.vclSource)
                    commit('setvclSource', content)
                } else {
                    commit('setvclSource', '')
                }
            } catch (error) {
                // dispatch('HOMEPAGE/showErrorToast', `Failed to load data detail`, { root: true })
            }
        },
        createCDN: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoading', true)
                await axios.post(`${baseURL}/v1/cdn/`, payload, createConfigs())
                if (store.getters.isLoading) {
                    dispatch('HOMEPAGE/showProcessToastWS', 'Creating the CDN', { root: true })
                }
                return null
            } catch (error) {
                let errorMessage = error?.response?.data?.responseMessage || 'Unknown error'
                if (["domain name is not active", "domain is already exist", "Cannot create a cdn with limit of 0", "Cannot create a cdn with full limit"].includes(errorMessage)) {
                    switch (errorMessage) {
                        case "domain name is not active":
                            errorMessage = "Domain name is not active"
                            break;
                        case "domain is already exist":
                            errorMessage = "Domain name already exist!"
                            break;
                        case "Cannot create a cdn with limit of 0":
                        case "Cannot create a cdn with full limit":
                            errorMessage = "You do not have enough limits to create CDN. Please get in touch with the administrator."
                            break;
                        default:
                            break;
                    }
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                    return error.response
                }
                if (errorMessage.includes("you need to setting your NS to our cdn server first")){
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showErrorToast', "This domain is not linked to our namespace. DNS configuration is required.", { root: true })    
                    return error.response
                }else if(errorMessage.includes(" ip is not exist")) {
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showErrorToast', "Your IP is not found, please input correct IP!", { root: true })    
                    return error.response
                }
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', "Failed to Create CDN, Please try again", { root: true })
                return error.response
            }
        },
        getListTag: async ({ commit, dispatch }, payload) => {
            try {
                const response = await axios.get(`${baseURL}/v1/cdn/tag-regions`, createConfigs())
                commit('setlistTag', JSON.parse(JSON.stringify(response.data.data)))
            } catch (error) {
                // dispatch('HOMEPAGE/showErrorToast', `Failed to load data tag`, { root: true })
            }
        },
        getListDns: async ({ commit, dispatch }, payload) => {
            const params = new URLSearchParams();
            params.append("projectId", payload);
            try {
                const response = await axios.get(`${baseURL}/v1/ssl/list-dns?${params}`, createConfigs())
                commit('setlistDns', JSON.parse(JSON.stringify(response.data.data)))
            } catch (error) {
                // dispatch('HOMEPAGE/showErrorToast', `Failed to load data dns`, { root: true })
            }
        },
        deleteCDN: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoadingDelete', true)
                await axios.delete(`${baseURL}/v1/cdn/${payload.id}`, createConfigs())
                if (store.getters.isLoadingDelete) {
                    dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the CDN', { root: true })
                }
            } catch (error) {
                let errorMessage = error?.response?.data?.responseMessage || 'Unknown error'
                if (["data not found"].includes(errorMessage)) {
                    switch (errorMessage) {
                        case "data not found":
                            errorMessage = "Data not found"
                            break;
                        default:
                            break;
                    }
                    commit('setIsLoadingDelete', false)
                    dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                    return
                }
                commit('setIsLoadingDelete', false)
                dispatch('HOMEPAGE/showErrorToast', "Failed to Deleting CDN, Please try again", { root: true })
            }
        },
        purgeCDN: async ({ commit, dispatch }, payload) => {
            try {
                await axios.delete(`${baseURL}/v1/cdn/${payload.id}/purge`, createConfigs())
                dispatch("HOMEPAGE/showSuccessToast",`CDN cache is Purged`,{ root: true });
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', "Failed to Purging CDN, Please try again", { root: true })
            }
        },
        updateVcl: async ({ commit, dispatch }, payload) => {
            const id = payload.id
            delete payload.id
            try {
                commit('setIsLoadingUpdateVcl', true)
                await axios.put(`${baseURL}/v1/cdn/vcl/${id}`, payload, createConfigs())
                if (store.getters.isLoadingUpdateVcl) {
                    dispatch('HOMEPAGE/showProcessToastWS', 'Updating Configuration', { root: true })
                }
            } catch (error) {
                let errorMessage = error?.response?.data?.responseMessage || 'Unknown error'
                if (["data not found"].includes(errorMessage)) {
                    switch (errorMessage) {
                        case "data not found":
                            errorMessage = "Data not found"
                            break;
                        default:
                            break;
                    }
                    commit('setIsLoadingUpdateVcl', false)
                    dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                    setTimeout(() => dispatch('goToRoot'), 2000)
                    return
                }
                commit('setIsLoadingUpdateVcl', false)
                dispatch('HOMEPAGE/showErrorToast', "Failed to Updating VCL, Please try again", { root: true })
                setTimeout(() => dispatch('goToRoot'), 2000)
            }
        },
        updateDeployment: async ({ commit, dispatch }, payload) => {
            const id = payload.id
            delete payload.id
            try {
                commit('setIsLoadingUpdateDeployment', true)
                await axios.put(`${baseURL}/v1/cdn/deployment/${id}`, payload, createConfigs())
                if (store.getters.isLoadingUpdateDeployment) {
                    dispatch('HOMEPAGE/showProcessToastWS', 'Updating CDN Location', { root: true })
                }
            } catch (error) {
                let errorMessage = error?.response?.data?.responseMessage || 'Unknown error'
                if (["data not found"].includes(errorMessage)) {
                    switch (errorMessage) {
                        case "data not found":
                            errorMessage = "Data not found"
                            break;
                        default:
                            break;
                    }
                    commit('setIsLoadingUpdateDeployment', false)
                    dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                    return
                }
                commit('setIsLoadingUpdateDeployment', false)
                dispatch('HOMEPAGE/showErrorToast', "Failed to Updating CDN Location, Please try again", { root: true })
            }
        },
        checkingPassword: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoadingCheckPassword', true)
                await axios.post(`${baseURL}/v1/auth/password/check`, payload, createConfigs())
                commit('setIsValidPassword', true)
                commit('setIsLoadingCheckPassword', false)
            } catch (error) {
                let errorMessage = error?.response?.data?.responseMessage || 'Unknown error'
                if (errorMessage === 'your password is incorrect') {
                    commit('setIsValidPassword', false)
                    dispatch('HOMEPAGE/showErrorToast', "Your password is incorrect", { root: true })
                } else {
                    dispatch('HOMEPAGE/showErrorToast', "Failed Checking Password", { root: true })
                }
                commit('setIsLoadingCheckPassword', false)
            }
        },
        reloadPage: () => {
            window.location.reload()
        },
        goToRoot: () => {
            router.push('cdn')
            router.go(0)
        },
        deployCDN: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoadingDeploy', true)
                await axios.post(`${baseURL}/v1/cdn/${payload.id}/deploy`, {}, createConfigs())
                if (store.getters.isLoadingDeploy) {
                    dispatch('HOMEPAGE/showProcessToastWS', 'Deploying CDN', { root: true })
                }
            } catch (error) {
                let errorMessage = error?.response?.data?.responseMessage || 'Unknown error'
                if (["data not found"].includes(errorMessage)) {
                    switch (errorMessage) {
                        case "data not found":
                            errorMessage = "Data not found"
                            break;
                        default:
                            break;
                    }
                    commit('setIsLoadingDeploy', false)
                    dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                    return
                }
                commit('setIsLoadingDeploy', false)
                dispatch('HOMEPAGE/showErrorToast', "Failed to Deploy CDN, Please try again", { root: true })
            }
        },
        getListSSL: async ({ commit, dispatch }, payload) => {
            const currentProj = JSON.parse(localStorage.getItem('currentProj'))
            const params = new URLSearchParams();
            let page = "1"
            let limit = "10"
            if(payload && payload.isNotExpired){
                params.append("isNotExpired", payload.isNotExpired)
            }
            params.append("projectId", currentProj.id)
            params.append("page", page)
            params.append("limit", limit)
            try {
                commit('setIsLoading', true)
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/?${params}`, createConfigs())
                commit('setListSsl', JSON.parse(JSON.stringify(response.data.data.rows)))
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                // dispatch('HOMEPAGE/showErrorToast', `Failed to load data`, { root: true })
            }
        },
        getContent: async ({ commit, dispatch }) => {
            const slug = "panduan-instalasi-cdn"
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/cdn/content/${slug}`, createConfigs())
                commit('setContent', response.data.data.content)
            } catch (error) {
            }
        },
        getCDNLimit: async ({ commit, dispatch }, projectId) => {
            return new Promise<void>((resolve, reject) => {
                axios.get(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/cdn/limit/${projectId}`, createConfigs()).then((res: any) => {
                    resolve(res)
                    commit('setCdnLimit', res.data.data)
                }).catch((err) => {
                    reject(err)
                })
            })
        },
        setCDNLimit: async ({ commit, dispatch }, payload) => {
            return new Promise<void>((resolve, reject) => {
                axios.post(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/cdn/limit`, payload, createConfigs()).then((res: any) => {
                    resolve(res)
                }).catch((err) => {
                    reject(err)
                })
            })
        },
        reuploadSSL: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoadingRenewalSSL', true)
                await axios.post(`${baseURL}/v1/cdn/ssl-reupload`, payload, createConfigs())
                if (store.getters.isLoadingRenewalSSL) {
                    dispatch('HOMEPAGE/showProcessToastWS', 'Updating CDN', { root: true })
                }
            } catch (error) {
                let errorMessage = error?.response?.data?.responseMessage || 'Unknown error'
                if (["data not found"].includes(errorMessage)) {
                    switch (errorMessage) {
                        case "data not found":
                            errorMessage = "Data not found"
                            break;
                        default:
                            break;
                    }
                    commit('setIsLoadingRenewalSSL', false)
                    dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                    return
                }
                commit('setIsLoadingRenewalSSL', false)
                dispatch('HOMEPAGE/showErrorToast', "Failed to Renewal SSL, Please try again", { root: true })
            }
        },
        getStatsDataReq: async ({ commit, dispatch }, payload) => {
            try {
                commit('setLoadingRequest', 1)
                const response = await axios.get(`${baseURL}/v1/cdn/${payload.id}/stats?${payload.param}`, createConfigs())
                commit('setStatsDataReq', response.data.data)
                commit('setLoadingRequest', 0)
                return response
            } catch (error) {
                commit('setLoadingRequest', 2)
                dispatch('HOMEPAGE/showErrorToast', `Failed to load data`, { root: true })
                return error.response
            }
        },
        getStatsDataMiss: async ({ commit, dispatch }, payload) => {
            try {
                commit('setLoadingMiss', 1)
                const response = await axios.get(`${baseURL}/v1/cdn/${payload.id}/stats?${payload.param}`, createConfigs())
                commit('setStatsDataMiss', response.data.data)
                commit('setLoadingMiss', 0)
                return response
            } catch (error) {
                commit('setLoadingMiss', 2)
                dispatch('HOMEPAGE/showErrorToast', `Failed to load data`, { root: true })
                return error.response
            }
        },
        getStatsDataHits: async ({ commit, dispatch }, payload) => {
            try {
                commit('setLoadingHits', 1)
                const response = await axios.get(`${baseURL}/v1/cdn/${payload.id}/stats?${payload.param}`, createConfigs())
                commit('setStatsDataHits', response.data.data)
                commit('setLoadingHits', 0)
                return response
            } catch (error) {
                commit('setLoadingHits', 2)
                dispatch('HOMEPAGE/showErrorToast', `Failed to load data`, { root: true })
                return error.response
            }
        },
        getStatsDataSections: async ({ commit, dispatch }, payload) => {
            try {
                commit('setLoadingSections', 1)
                const response = await axios.get(`${baseURL}/v1/cdn/${payload.id}/stats?${payload.param}`, createConfigs())
                commit('setStatsDataSections', response.data.data)
                commit('setLoadingSections', 0)
                return response
            } catch (error) {
                commit('setLoadingSections', 2)
                dispatch('HOMEPAGE/showErrorToast', `Failed to load data`, { root: true })
                return error.response
            }
        },
        getStatsLine: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoadingStatsLine', 1)
                const response = await axios.get(`${baseURL}/v1/cdn/${payload.id}/stats/timeline?${payload.param}`, createConfigs())
                commit('setStatsLine', response.data.data)
                commit('setIsLoadingStatsLine', 0)
                return response
            } catch (error) {
                commit('setIsLoadingStatsLine', 2)
                dispatch('HOMEPAGE/showErrorToast', `Failed to load data`, { root: true })
                return error.response
            }
        },
        getStatsDataHitRate: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoadingHitRate', 1)
                const response = await axios.get(`${baseURL}/v1/cdn/${payload.id}/stats/timeline?${payload.param}`, createConfigs())
                commit('setStatsDataHitRate', response.data.data)
                commit('setIsLoadingHitRate', 0)
                return response
            } catch (error) {
                commit('setIsLoadingHitRate', 2)
                dispatch('HOMEPAGE/showErrorToast', `Failed to load data`, { root: true })
                return error.response
            }
        },
    }
}

export default store