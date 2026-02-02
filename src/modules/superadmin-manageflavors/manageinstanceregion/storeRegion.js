import axios from '@/lib/axios'
import localstorage from "@/lib/localstorage";
const projJson = localstorage.getItem("currentProj");
const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};
const userId = localStorage.getItem("userId");
const storeRegion = {
    namespaced: true,
    state: {
        regions: [],
        regionByProject:[],
        projectByUser:[],
        region: {},
        isRegionLoading: false,
        regionPaginator: {
            count: 1,
            totalpage: 1,
            page: 1,
            limit: 10,
        },
        regionByStatus:[]
    },
    mutations: {
        setRegions: (state, payload) => state.regions = payload,
        setRegion: (state, payload) => state.region = payload,
        setIsRegionLoading: (state, payload) => state.isRegionLoading = payload,
        setRegionByProject: (state, payload) => state.regionByProject = payload,
        setProjectByUser: (state, payload) => state.projectByUser = payload,
        setRegionByStatus: (state, payload) => state.regionByStatus = payload,
    },
    actions: {
        createRegion: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsRegionLoading', true)
                const response = await axios.instance.post(`/region/create`, payload)
                dispatch('fetchRegions')
                // dispatch('fetchRegionByProject')
                dispatch('HOMEPAGE/showSuccessToast', 'New region has been successfully created', { root: true })
                commit('setIsRegionLoading', false)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to create new region'
                if (err.includes('region name has already exist')) errorMessage = 'Region name already exists.'
                commit('setIsRegionLoading', false)
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                return e.response
            }
        },
        updateRegion: async ({ commit, dispatch }, payload) => {
            try {
                const { sourceName } = payload
                delete payload.sourceName
                commit('setIsRegionLoading', true)
                const response = await axios.instance.put(`/region/update/${sourceName}`, payload)
                commit('setIsRegionLoading', false)
                dispatch('fetchRegions')
                // dispatch('fetchRegionByProject')
                dispatch('HOMEPAGE/showSuccessToast', 'Region has been successfully updated', { root: true })
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to update region'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsRegionLoading', false)
                return e.response
            }
        },
        fetchRegions: async ({ commit, dispatch, rootState }, payload = { page: 1, search: '', order_column: null, order_by: null}) => {
            try {
                if (payload.limit) payload.limit = rootState['MANAGEINSTANCEREGION'].regionPaginator.limit
                commit('setIsRegionLoading', true)
                const response = await axios.instance.get(`/region-user/list`, {
                    params: { ...payload }
                })
                commit('setIsRegionLoading', false)
                commit('setRegions', response.data.data)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to get list of regions'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsRegionLoading', false)
                return e.response
            }
        },
        fetchRegionByName: async ({ commit, dispatch }, regionName) => {
            try {
                commit('setIsRegionLoading', true)
                const response = await axios.instance.get(`/region/detail/${regionName}`)
                commit('setRegion', response.data.data)
                commit('setIsRegionLoading', false)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to get region detail'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsRegionLoading', false)
                return e.response
            }
        },
        deleteRegionByName: async ({ commit, dispatch }, regionName) => {
            try {
                commit('setIsRegionLoading', true)
                const response = await axios.instance.delete(`/region/delete/${regionName}`)
                commit('setIsRegionLoading', false)
                dispatch('fetchRegions')
                // dispatch('fetchRegionByProject')
                dispatch('HOMEPAGE/showSuccessToast', 'Region has been successfully deleted', { root: true })
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to delete region'
                if (err.includes('can\'t delete region, there are instances still using this region')) errorMessage = 'Unable to delete. There are active resources in this region.'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsRegionLoading', false)
                return e.response
            }
        },
        fetchRegionByProject: async ({ commit, dispatch, rootState }, payload = { page: 1, search: '', order_column: null, order_by: null, project_id: projObj.id }) => {
            try {
                if (payload.limit) payload.limit = rootState['MANAGEINSTANCEREGION'].regionPaginator.limit
                commit('setIsRegionLoading', true)
                const response = await axios.instance.get(`/region-user/filter-by-project`, {
                    params: { ...payload }
                })
                commit('setIsRegionLoading', false)
                commit('setRegionByProject', response.data.data)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to get list of regions'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsRegionLoading', false)
                return e.response
            }
        },
        fetchProjectByUser: async ({ commit, dispatch }) => {
            try {                
                commit('setIsRegionLoading', true)
                const response = await axios.instance.get(`/user/projects`)
                commit('setIsRegionLoading', false)
                commit('setProjectByUser', response.data.data)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to get list of projects'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsRegionLoading', false)
                return e.response
            }
        },     
        fetchRegionByStatus: async ({ commit, dispatch, rootState }, payload = { page: 1, search: '', order_column: null, order_by: null, project_id: projObj.id }) => {
            try {
                if (payload.limit) payload.limit = rootState['MANAGEINSTANCEREGION'].regionPaginator.limit
                commit('setIsRegionLoading', true)
                const response = await axios.instance.get(`/region-user/filter-by-status`, {
                    params: { ...payload }
                })
                commit('setIsRegionLoading', false)
                commit('setRegionByStatus', response.data.data)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to get list of regions'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsRegionLoading', false)
                return e.response
            }
        },   
    }
}
export default storeRegion
