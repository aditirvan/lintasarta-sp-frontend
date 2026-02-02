import axios from '@/lib/axios'

const storeObjectStorageRegion = {
    namespaced: true,
    state: {
        regions: [],
        region: {},
        isRegionLoading: false,
        regionPaginator: {
            count: 1,
            totalpage: 1,
            page: 1,
            limit: 10,
        }
    },
    mutations: {
        setRegions: (state, payload) => state.regions = payload,
        setRegion: (state, payload) => state.region = payload,
        setIsRegionLoading: (state, payload) => state.isRegionLoading = payload,
    },
    actions: {
        createRegion: async ({ commit, dispatch }, payload) => {
            try {
                commit('setIsRegionLoading', true)
                const response = await axios.instance.post(`/object-storage-region/create`, payload)
                dispatch('fetchRegions')
                dispatch('HOMEPAGE/showSuccessToast', 'New region has been successfully created', { root: true })
                commit('setIsRegionLoading', false)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to create new region'

                if (err.includes('s3 region name already exist')) errorMessage = 'S3 Region name already exists.'
                else if (err && err.includes('region name already exist')) errorMessage = 'Region Name already exists'
                commit('setIsRegionLoading', false)
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                return e.response
            }
        },
        updateRegion: async ({ commit, dispatch }, payload) => {
            try {
                const { ID } = payload
                delete payload.ID
                commit('setIsRegionLoading', true)
                const response = await axios.instance.put(`/object-storage-region/update/${ID}`, payload)
                commit('setIsRegionLoading', false)
                dispatch('fetchRegions')
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
        fetchRegions: async ({ commit, dispatch, rootState }, payload = { page: 1, search: '', order_column: null, order_by: null }) => {
            try {
                if (payload.limit) payload.limit = rootState['MANAGEINSTANCEREGION'].regionPaginator.limit
                commit('setIsRegionLoading', true)
                const response = await axios.instance.get(`/object-storage-region/list`, {
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
        fetchRegionByID: async ({ commit, dispatch }, regionID) => {
            try {
                commit('setIsRegionLoading', true)
                const response = await axios.instance.get(`/object-storage-region/detail/${regionID}`)
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
        deleteRegionByID: async ({ commit, dispatch }, regionID) => {
            try {
                commit('setIsRegionLoading', true)
                const response = await axios.instance.delete(`/object-storage-region/delete/${regionID}`)
                commit('setIsRegionLoading', false)
                dispatch('fetchRegions')
                dispatch('HOMEPAGE/showSuccessToast', 'Region has been successfully deleted', { root: true })
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to delete region'
                if (err.includes('please detach object storage before delete object storage region')) errorMessage = 'Please detach object storage before delete the region!'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                commit('setIsRegionLoading', false)
                return e.response
            }
        }
    }
}
export default storeObjectStorageRegion