import { Module } from 'vuex'
import axios from 'axios'
import router from '@/lib/router'




const createConfigs = (config?: any, header?: any) => {
    const getToken = JSON.parse(localStorage.getItem("loginSsl") || "{}");
    return {
        headers: { Authorization: `Bearer ${getToken.token}`, ...header },
        ...config
    }
}

interface state {
    listKey: Array<any>,
    totalKey: number,
    isLoading: Boolean,
    isCreated: Boolean,
    isLoadingRenewal: Boolean,
    isLoadingDelete: Boolean,
    isLoadingImport: Boolean,
    listSsl: Array<any>,
    totalData: number,
    detailSsl: Array<any>,
    renewalData: Array<any>,
    listDns: Array<any>,
    privateKey: String,
    loadingRev: Boolean,
    sslLimit: Array<any>,
}


const store: Module<state, any> = {
    namespaced: true,
    state: {
        listKey: [],
        totalKey: 0,
        isLoading: false,
        isCreated: false,
        isLoadingRenewal: false,
        isLoadingDelete: false,
        isLoadingImport: false,
        listSsl: [],
        totalData: 0,
        detailSsl: [],
        renewalData: [],
        listDns: [],
        privateKey: null,
        loadingRev: false,
        sslLimit:[],
    },
    getters: {
        listKey: state => { return state.listKey },
        totalKey: state => { return state.totalKey },
        isLoading: state => { return state.isLoading },
        isCreated: state => { return state.isCreated },
        isLoadingRenewal: state => { return state.isLoadingRenewal },
        isLoadingDelete: state => { return state.isLoadingDelete },
        isLoadingImport: state => { return state.isLoadingImport },
        listSsl: state => { return state.listSsl },
        totalData: state => { return state.totalData },
        detailSsl: state => { return state.detailSsl },
        renewalData: state => { return state.renewalData },
        listDns: state => { return state.listDns },
        privateKey: state => { return state.privateKey },
        loadingRev: state => { return state.loadingRev },
        sslLimit: state => { return state.sslLimit }
    },
    mutations: {
        setlistKey: (state: state, payload) => {
            state.listKey = payload
        },
        setTotalKey: (state: state, payload) => {
            state.totalKey = payload
        },
        setIsLoading: (state: state, payload) => {
            state.isLoading = payload
        },
        setIsCreated: (state: state, payload) => {
            state.isCreated = payload
        },
        setIsLoadingRenewal: (state: state, payload) => {
            state.isLoadingRenewal = payload
        },
        setIsLoadingDelete: (state: state, payload) => {
            state.isLoadingDelete = payload
        },
        setIsLoadingImport: (state: state, payload) => {
            state.isLoadingImport = payload
        },
        setListSsl: (state: state, payload) => {
            state.listSsl = payload
        },
        setTotalData: (state: state, payload) => {
            state.totalData = payload
        },
        setSslDetail: (state: state, payload) => {
            state.detailSsl = payload
        },
        setRenewalData: (state: state, payload) => {
            state.renewalData.push(payload)
        },
        removeRenewalData: (state: state, payload) => {
            let filtered = state.renewalData.filter(x => x !== payload)
            state.renewalData = filtered
        },
        setlistDns: (state: state, payload) => {
            state.listDns = payload
        },
        setPrivateKey: (state: state, payload) => {
            state.privateKey = payload
        },
        setLoadingRev: (state: state, payload) => {
            state.loadingRev = payload
        },
        setSSLLimit: (state: state, payload) => {
            state.sslLimit = payload
        }
    },
    actions: {
        getListSSL: async ({ commit, dispatch }, payload) => {
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
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/?${params}`, createConfigs())
                commit('setListSsl', JSON.parse(JSON.stringify(response.data.data.rows)))
                commit('setTotalData', JSON.parse(JSON.stringify(response.data.data.total_rows)))
                commit('setIsLoading', false)
            } catch (error) {
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', `Failed to load data`, { root: true })
            }
        },
        getDetailSSL: async ({ commit, dispatch }, payload) => {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/${payload}`, createConfigs())
                commit('setSslDetail', JSON.parse(JSON.stringify(response.data.data)))
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `Failed to load data`, { root: true })
            }
        },
        createSSL: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoading', true)
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/`, payload, createConfigs())
                if (store.getters.isLoading) {
                    dispatch('HOMEPAGE/showProcessToastWS', 'Creating the SSL', { root: true })
                }
            } catch (error) {
                const errorMessage = error.response.data.responseMessage
                
                if (["domain name not registered", "domain name is inactive state", "domain is already exist", "domain name is invalid name"].includes(errorMessage)) {
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                }
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
            }
        },
        deleteSSL: async ({ commit, dispatch }, { id, isExternalSSL, fqdn }) => {
            try {
                commit('setIsLoadingDelete', true)
                await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/${id}`, createConfigs())
                if (isExternalSSL) {
                    dispatch('HOMEPAGE/showSuccessToast', `SSL ${fqdn} has been successfully deleted`, { root: true })
                    commit('setIsLoadingDelete', false)
                    window.location.reload()
                } else {
                    if (store.getters.isLoadingDelete) {
                        dispatch('HOMEPAGE/showProcessToastWS', 'Deleting the SSL', { root: true })
                    }
                }
            } catch (error) {
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', "Failed to Delete SSL, Please try again", { root: true })
            }
        },
        downloadFile: async ({ commit, dispatch }, payload) => {
            let config = { params: payload, responseType: "blob" }
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/key/download`, createConfigs(config))
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', payload.filename);
                document.body.appendChild(link);
                link.click();
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `Failed download file`, { root: true })
            }
        },
        getListSSLKey: async ({ commit, dispatch }, payload) => {
            let config = { params: payload }
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/keys`, createConfigs(config))
                commit('setlistKey', JSON.parse(JSON.stringify(response.data.data)))
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `Failed to load data list keys`, { root: true })
            }
        },
        loginSslService: async ({ commit }, payload) => {
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/auth/login`, payload)
            localStorage.setItem('loginSsl', JSON.stringify(response.data.data));
        },
        forceGenerateSSL: async ({ commit, dispatch }, payload) => {
            try {
                commit('setRenewalData', payload.DomainName)
                commit('setIsLoadingRenewal', true)
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/renewal`, payload, createConfigs())
            } catch (error) {
                const errorMessage = error.response.data.responseMessage
                if (["domain name is invalid name"].includes(errorMessage)) {
                    commit('setIsLoadingRenewal', false)
                    commit('removeRenewalData', payload.DomainName)
                    dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                }
                commit('setIsLoadingRenewal', false)
                dispatch('HOMEPAGE/showErrorToast', "Failed to Renewal SSL, Please try again", { root: true })
                commit('removeRenewalData', payload.DomainName)
            }
        },
        getListDns: async ({ commit, dispatch }, payload) => {
            const params = new URLSearchParams();
            params.append("projectId", payload);
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/list-dns?${params}`, createConfigs())
                commit('setlistDns', JSON.parse(JSON.stringify(response.data.data)))
            } catch (error) {
                dispatch('HOMEPAGE/showErrorToast', `Failed to load data dns`, { root: true })
            }
        },

        getPrivateKey: async ({ commit, dispatch }, payload) => {
            try {
                commit('setLoadingRev', true)
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/key/retrieve`, payload, createConfigs())
                commit('setLoadingRev', false)
                commit('setPrivateKey', JSON.parse(JSON.stringify(response.data.data.private_key)))
            } catch (error) {
                commit('setLoadingRev', false)
                dispatch('HOMEPAGE/showErrorToast', `Failed to reveal the key because your password is invalid!`, { root: true })
            }
        },

        onClear: async ({ commit }) => {
            commit('setPrivateKey', null)
        },

        importSSL: async ({ commit, dispatch }, payload) => {
            const header = {
                "Content-Type": "multipart/form-data"
            }
            try {
                commit('setIsLoadingImport', true)
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/import`, payload, createConfigs(null, header))
                // if (store.getters.isLoadingImport) {
                //     dispatch('HOMEPAGE/showProcessToastWS', 'Importing the SSL', { root: true })
                // }
                commit('setIsLoadingImport', false)
                dispatch('HOMEPAGE/showSuccessToast', 'SSL has been successfully imported.', { root: true })
            } catch (error) {
                let errorMessage = error.response.data.responseMessage
                if (["domain is already exist", "domain name is invalid name", "Invalid certificate file format", "The certificate and key file doesn't match", "The certificate is not valid", "The key is not valid"].includes(errorMessage)) {
                    switch (errorMessage) {
                        case "domain name is invalid name":
                            errorMessage = "Domain name is invalid! Please use a subdomain"
                            break;
                        case "domain is already exist":
                            errorMessage = "Domain name already exist!"
                            break;
                        case "Invalid certificate file format":
                            errorMessage = "Invalid certificate file format, Please check again"
                            break;
                        case "The key is not valid":
                            errorMessage = "The key is not valid"
                            break;
                        case "The certificate is not valid":
                            errorMessage = "The certificate is not valid"
                            break;
                        case "The certificate and key file doesn't match":
                            errorMessage = "The certificate and key file doesn't match"
                            break;
                        default:
                            break;
                    }
                    commit('setIsLoading', false)
                    dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                    return
                }
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', "Failed to Importing SSL, Please try again", { root: true })
            }
        },
        getSSLLimit: async ({ commit, dispatch }, projectId) => {
            return new Promise<void>((resolve, reject) => {
                axios.get(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/limit/${projectId}`, createConfigs()).then((res: any) => {
                    resolve(res)
                    commit('setSSLLimit', res.data.data)
                }).catch((err) => {
                    reject(err)
                })
            })
        },
        setSSLLimit: async ({ commit, dispatch }, payload) => {
            return new Promise<void>((resolve, reject) => {
                axios.post(`${process.env.VUE_APP_API_BASE_URL}/ssl-services/v1/ssl/limit`, payload, createConfigs()).then((res: any) => {
                    resolve(res)
                }).catch((err) => {
                    reject(err)
                })
            })
        },
    }
}

export default store