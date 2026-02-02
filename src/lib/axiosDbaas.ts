import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import localstorage from './localstorage'
import Vue from 'vue'

export interface ProcessEnv {
    [key: string]: string | undefined
}

const instance: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL_DBAAS
});

instance.interceptors.request.use((config: AxiosRequestConfig) => {
    const Vue1 = Vue as any
    Vue1.store.state.topbarloading.start()
    const loginDbaas = localstorage.getItem('loginDbaas')
    const data = JSON.parse(loginDbaas)
    if (data) {
        config.headers = { ...config.headers, Authorization: 'Bearer ' + data.token }

    }
    return config
}, (error) => {
    return Promise.reject(error)
})
instance.interceptors.response.use((response: AxiosResponse) => {
    const Vue1 = Vue as any
    Vue1.store.state.topbarloading.done()
    return response
}, (error) => {
    const Vue1 = Vue as any
    Vue1.store.state.topbarloading.done()
    if (error.message == 'Network Error') {
        const V = Vue as any
        V.store.dispatch('HOMEPAGE/showErrorToast', error.message)
    }
    if (error.response && error.response.data.error == "Not Valid Token or Token Expired") {
        Vue1.store.dispatch('HOMEPAGE/logout')
    } else if (error.response && error.response.data.error == 'No Authorization header found') {
        const V = Vue as any
        V.store.dispatch('HOMEPAGE/showSuccessToast', 'Your session is expired due to inactivity')
    }
    return Promise.reject(error)


})

export default {
    instance
}
