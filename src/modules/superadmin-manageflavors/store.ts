import { Module, ActionContext } from 'vuex'
import axios from '@/lib/axios'

// const isDevModeStorageTiering = process.env.VUE_APP_DEV_MODE === 'fase-1.3'
const isDevModeStorageTiering = true

export interface State {
    flavors: [],
    pagination: any,
    flavorstype: [],
    paginationtype: any,
    paginationstorage: any,
    s3Flavors: [],
    s3Pagination: any,
    s3Default: [],
    storagesizes: [],
    defaultstoragesize: [],
    instancetype: Array<any>,
    flavorbeingedit: any,
    defaulinstanceprice: Array<any>,
    defaultcpu: any, defaultram: any, defaultdisk: any, defaultgpu: any,
    packagestorage: {},
}
const store: Module<State, any> = {
    namespaced: true,
    state: {
        flavorstype: [],
        paginationtype: {},
        s3Default: [],
        s3Flavors: [],
        s3Pagination: {},
        flavorbeingedit: null,
        flavors: [],
        pagination: {},
        paginationstorage: {},
        storagesizes: [],
        defaultstoragesize: [],
        instancetype: [],
        defaulinstanceprice: [],
        defaultcpu: {},
        defaultram: {},
        defaultdisk: {},
        defaultgpu: {},
        packagestorage: {},
    },
    mutations: {
        setS3Default: (state:State, payload:any ) => state.s3Default = payload,
        setS3Flavors: (state:State, payload:any ) => state.s3Flavors = payload,
        setS3Pagination: (state:State, payload:any ) => state.s3Pagination = payload,
        setpaginationstorage: (state: State, payload: any) => state.paginationstorage = payload,
        setinstancetype: (state: State, payload: any) => state.instancetype = payload,
        setflavorbeingedit: (state: State, payload: any) => state.flavorbeingedit = payload,
        setflavors: (state: State, payload: any) => state.flavors = payload,
        setpagination: (state: State, payload: any) => state.pagination = payload,
        setflavorstype: (state: State, payload: any) => state.flavorstype = payload,
        setpaginationtype: (state: State, payload: any) => state.paginationtype = payload,
        setstoragesizes: (state: State, payload: any) => state.storagesizes = payload,
        setdefaultstoragesize: (state: State, payload: any) => state.defaultstoragesize = payload,
        setpackagestorage: (state: State, payload: any) => state.packagestorage = payload,        
        setdefaulinstanceprice: (state: State, payload: any) => {
            state.defaulinstanceprice = payload
            const defaultcpu = payload.filter((x: any) => x.id == 1)
            state.defaultcpu = defaultcpu[0]
            const defaultram = payload.filter((x: any) => x.id == 2)
            state.defaultram = defaultram[0]
            const defaultdisk = payload.filter((x: any) => x.id == 3)
            state.defaultdisk = defaultdisk[0]
            const defaultgpu = payload.filter((x: any) => x.id == 4)
            state.defaultgpu = defaultgpu[0]
        }

    },
    actions: {
        fetchflavors: async (context: ActionContext<State, any>, payload: any = { page: 1, itemsPerPage: 10, search: '' }) => {
            return await axios.instance.get('/flavor/instance',
                {
                    params: {
                        page: payload.page,
                        limit: payload.itemsPerPage,
                        search: payload.search,
                        type_id: payload.type_id,
                        region:payload.region,
                        processor:payload.processor,
                        sortBy:payload.sortBy, 
                        sortDesc:payload.sortDesc,
                    }
                }).then(response => {
                    const data = response.data.data
                    const { instance, pagination } = data
                    context.commit('setflavors', instance)
                    context.commit('setpagination', pagination)
                })
        },
        addFlavor: async (context: ActionContext<State, any>, payload: any) => {
            try {
                const response = await axios.instance.post('/flavor/instance', payload) 
                return response
            } catch (e) {
                let errorMessage = 'A problem encountered while creating instance flavor'
                
                const err = e.response.data.data
                if (err.includes('Instance size already exist')) errorMessage = 'Size already exists'
                else if (err.includes('Instance name already exist')) errorMessage = 'Name already exists'

                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                return e.response
            }
        },
        editFlavor: async (context: ActionContext<State, any>, payload: any) => {
            return axios.instance.put(`/flavor/instance/update/${payload.id}`, payload).then(response => {
                
            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                return Promise.reject(e)
            })
        },
        deleteFlavor: async (context: ActionContext<State, any>, payload: any) => {
            return await axios.instance.delete(`/flavor/instance/delete/${payload.id}`).then(response => {
                context.dispatch('HOMEPAGE/showSuccessToast', 'Flavor has been successfully deleted', { root: true })
            }).catch((e) => {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to delete instance flavor'
                if (err.includes("can't delete this package which is being used by some instances")) errorMessage = 'Unable to delete. The package is being used.'
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
            })
        },
        activateFlavor: async (context: ActionContext<State, any>, payload: any) => {
            if (payload.status == 'active') {
                return await axios.instance.put(`/flavor/instance/deactive/${payload.id}`).then(response => {
                    
                }).catch((e) => {
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                })
            } else {
                return await axios.instance.put(`/flavor/instance/active/${payload.id}`).then(response => {
                    
                }).catch((e) => {
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                })
            }

        },

        //type
        fetchflavorstype: async (context: ActionContext<State, any>, payload: any = { page: 1, itemsPerPage: 10, search: '' }) => {
            return await axios.instance.get('/flavor/type',
                {
                    params: {
                        page: payload.page,
                        limit: payload.itemsPerPage,
                        search: payload.search,
                        sortBy:payload.sortBy, 
                        sortDesc:payload.sortDesc
                    }
                }).then(response => {
                    const data = response.data.data
                    const { types, pagination } = data
                    context.commit('setflavorstype', types)
                    context.commit('setpaginationtype', pagination)
                })
        },

        addFlavortype: async (context: ActionContext<State, any>, payload: any) => {
            return axios.instance.post('/flavor/type', payload).then(response => {
                
            }).catch((e) => {
                if (e.response.data.data) {
                    return Promise.reject(e)
                } else {
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                    return Promise.reject("error")
                }
            })
        },
        editFlavortype: async (context: ActionContext<State, any>, payload: any) => {
            return axios.instance.put(`/flavor/type`, payload).then(response => {
                
            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                return Promise.reject(e)
            })
        },
        deleteFlavortype: async (context: ActionContext<State, any>, payload: any) => {
            return await axios.instance.delete(`/flavor/type/delete/${payload.id}`).then(response => {
                
            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            })
        },
        
        fetchdefaultstoragesize: async (context: ActionContext<State, any>, payload: any) => {
            return await axios.instance.get('/flavor/storage/default').then(response => {
                const data = response.data.data
                context.commit('setdefaultstoragesize', isDevModeStorageTiering ? data : [data])
            })
        },
        fetchstoragesizes: async (context: ActionContext<State, any>, payload: any={ page:1, itemsPerPage:10 }) => {
            return await axios.instance.get('/flavor/storage', { params: { page: payload.page, limit: payload.itemsPerPage, search: payload.search, sortBy: payload.sortBy, 
                sortDesc:payload.sortDesc, type_id: payload.type_id }}).then(response=>{
                const {storage, pagination} = response.data.data
                context.commit('setstoragesizes', storage.sort((a:any, b:any) => a.volume_size - b.volume_size))
                context.commit('setpaginationstorage', pagination)
            })
        },
        fetchinstancetype: async (context: ActionContext<State, any>, payload: any) => {
            return await axios.instance.get('/flavor/instance/type').then((response) => {
                const data = response.data.data
                context.commit('setinstancetype', data)
            })

        },
        addVolume: async (context: ActionContext<State, any>, payload: any) => {
            return axios.instance.post('/flavor/storage', payload)
        },
        editVolume: async (context: ActionContext<State, any>, payload: any) => {
            const endpoint = isDevModeStorageTiering ? '/flavor/storage/default/edit/' : '/flavor/storage/edit/'
            return await axios.instance.put(endpoint + payload.id, payload).then(() => {
                context.dispatch('fetchdefaultstoragesize')
            })
        },
        deleteVolume: async (context: ActionContext<State, any>, payload: any) => {
            try {
                await axios.instance.delete(`/flavor/storage/delete/${payload.id}`)
                context.dispatch('HOMEPAGE/showSuccessToast', 'Flavor has been successfully deleted', { root: true })
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while deleting volume flavor'
                if (err.includes('Unable to delete. Package storage is being used.')) errorMessage = 'Unable to delete. The package is being used.'
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
            }
        },
        fetchdefaulinstanceprice: async (context: ActionContext<State, any>, payload: any) => {
            return await axios.instance.get('/flavor/price/default').then(response => {
                const data = response.data.data
                context.commit('setdefaulinstanceprice', data)
            })
        },
        editdefaulinstanceprice: async (context: ActionContext<State, any>, payload: any) => {
            return await axios.instance.put(`flavor/price/default/${payload.id}`, payload).then(response => {
                context.dispatch('fetchdefaulinstanceprice')
            })
        },
        switchstorage: async (context: ActionContext<State, any>, payload: any) => {
            if (payload.status == 'active') {
                return await axios.instance.put(`/flavor/storage/deactive/${payload.id}`)
            } else {
                return await axios.instance.put(`/flavor/storage/active/${payload.id}`)
            }
        },
        fetchS3DefaultPrice: async ({ commit, dispatch }, payload) => {
            try {
                const response = await axios.instance.get('/flavor/object-storage/default')
                const defaultPrice = response.data.data
                commit('setS3Default', [defaultPrice])
                return response
            } catch (e) {
                return e.response
            }
        },
        fetchS3Flavors: async ({ commit, dispatch }, payload = {page: 1, itemsPerPage: 10, search: ''}) => {
            try {
                const response = await axios.instance.get('/flavor/object-storage', {
                    params: {
                        page: payload.page,
                        limit: payload.itemsPerPage,
                        search: payload.search,
                        sortBy:payload.sortBy, 
                        sortDesc:payload.sortDesc
                    }
                })
                const data = response.data.data
                const { storage, pagination } = data
                commit('setS3Flavors', storage.sort((a:any, b:any) => a.object_storage_size - b.object_storage_size))
                commit('setS3Pagination', pagination)
                return data
            } catch (e) {
                return e.response
            }
        },
        createS3Flavor: async ({ commit, dispatch }, payload) => {
            try {
                const response = await axios.instance.post('/flavor/object-storage', payload)
                await dispatch('fetchS3Flavors')
                return response
            } catch (e){
                let errorMessage = 'A problem encountered while creating object storage flavor'
                let error = e.response.data.data
                if (error == 'Object storage size already exist') errorMessage = 'Object storage size already exists'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                return e.response
            }
        },
        updateS3DefaultPrice: async ({ commit, dispatch }, payload) => {
            try {
                const { id, object_storage_size, price_per_month, price_per_hours  } = payload
                const response = await axios.instance.put(`/flavor/object-storage/edit/${id}`, {
                    object_storage_size,
                    price_per_month,
                    price_per_hours
                })
                dispatch('fetchS3DefaultPrice')
                dispatch('HOMEPAGE/showSuccessToast', 'Object Storage default price has been successfully updated', { root: true })
                return response
            } catch (e){
                dispatch('HOMEPAGE/showSuccessToast', 'A problem encountered while updating object storage default price', { root: true })
                return e.response
            }
        },
        deleteS3Flavor: async ({ commit, dispatch }, payload) => {
            try {
                const { id } = payload
                const response = await axios.instance.delete(`/flavor/object-storage/delete/${id}`)
                await dispatch('fetchS3Flavors')
                dispatch('HOMEPAGE/showSuccessToast', 'Flavor has been successfully deleted', { root: true })
                return response
            } catch (e){
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while deleting object storage flavor'
                if (err.includes("Unable to delete. Package object storage is being used.")) errorMessage = 'Unable to delete. The package is being used.'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
                return e.response
            }
        },
        activateS3Flavor: async ({ commit, dispatch }, payload) => {
            try {
                const { id } = payload
                const response = await axios.instance.put(`/flavor/object-storage/active/${id}`)
                await dispatch('fetchS3Flavors')
                return response
            } catch (e){
                return e.response
            }
        },
        deactivateS3Flavor: async ({ commit, dispatch }, payload) => {
            try {
                const { id } = payload
                const response = await axios.instance.put(`/flavor/object-storage/deactive/${id}`)
                await dispatch('fetchS3Flavors')
                return response
            } catch (e){
                return e.response
            }
        },
        fetchpackagestorage: async (context: ActionContext<State, any>, payload: any) => {
            return await axios.instance.get('/flavor/storage/'+payload.psid,
                {
                    // params: {
                    //     psid: payload.psid,
                    // }
                }).then(response => {
                    const data = response.data.data    
                    context.commit('setpackagestorage', data)
                })
        },        
        changestatus: async(context:ActionContext<any, any>, payload:any)=>{
            if(payload.status == 'active'){
                return await axios.instance.put(`/region/deactive/${payload.ID}`, payload)
            }else{
                return await axios.instance.put(`/region/active/${payload.ID}`, payload)
            }
        }

    }
}
export default store