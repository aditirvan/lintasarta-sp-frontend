import axios from 'axios'

const store = {
    namespaced: true,
    state: {
        packageMonthly: [],
        packageOnetime: [],
        packageDefault: [],
        totalRowsMonthly: null,
        totalRowsOnetime: null,
        totalRowsDefault: null,
        listType: [],
    },
    getters: {
        getPackageMonthly: state => state.packageMonthly,
        getPackageOnetime: state => state.packageOnetime,
        getPackageDefault: state => state.packageDefault,
        getTotalRowsMonthly: state => state.totalRowsMonthly,
        getTotalRowsOnetime: state => state.totalRowsOnetime,
        getTotalRowsDefault: state => state.totalRowsDefault,
        getListType: state => state.listType
    },
    mutations: {
        setListPackageMonthly: (state, monthly) => state.packageMonthly = monthly,
        setListPackageOnetime: (state, onetime) => state.packageOnetime = onetime,
        setListPackageDefault: (state, data) => state.packageDefault = data,
        setTotalRowsMonthly: (state, total) => state.totalRowsMonthly = total,
        setTotalRowsOnetime: (state, total) => state.totalRowsOnetime = total,
        setTotalRowsDefault: (state, total) => state.totalRowsDefault = total,
        setListType: (state, type) => state.listType = type,
    },
    actions: {
        fetchListPackageMonthly: async (context, payload) => {
            // console.log(payload)
            let log = await context.dispatch('MANAGESERVICE/loginMS', '' , {root: true})
            // console.log(log)
            let search = payload.search ? payload.search : ""
            if(log.status == 200){
                if(log.data){
                    context.commit('setListPackageMonthly', [])
                    context.commit('setTotalRowsMonthly', 0)
                    let headers = {
                        "Authorization": "Bearer " + localStorage.getItem('token_ms')
                    }
                    
                    let sort = null
                    if(payload.sortDesc.length){
                        if(payload.sortDesc[0]){
                            sort = 'asc'
                        }else{
                            sort = 'desc'
                        }
                    }else{
                        sort = 'desc'
                    }
                    let sortBy = payload.sortBy.length ? payload.sortBy[0] : 'id'
                    return await axios.get(process.env.VUE_APP_API_BASE_URL + `/manage-services/api/v1/package?limit=${payload.itemsPerPage}&monthly.equals=true&page=${payload.page}&sort=${sortBy} ${sort}&name.contains=${search}`, 
                    { headers }).then( response => {
                        // console.log(response)
                        let data = response.data
                        if(response.status == 200){
                            if(data.status){
                                let packageMonthly = data.data.rows
                                context.commit('setListPackageMonthly', packageMonthly)
                                context.commit('setTotalRowsMonthly', data.data.total_rows)
                            }
                        }

                    }).catch((e) => {
                        context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                    })
                }
            }
        },
        fetchListPackageOnetime: async (context, payload) => {
            // console.log(payload)
            let search = payload.search ? payload.search : ""
            let log = await context.dispatch('MANAGESERVICE/loginMS', '' , {root: true})
            if(log.status == 200){
                if(log.data){
                    context.commit('setListPackageOnetime', [])
                    context.commit('setTotalRowsOnetime', null)
                    let headers = {
                        "Authorization": "Bearer " + localStorage.getItem('token_ms')
                    }
                    
                    let sort = null
                    if(payload.sortDesc.length){
                        if(payload.sortDesc[0]){
                            sort = 'asc'
                        }else{
                            sort = 'desc'
                        }
                    }else{
                        sort = 'desc'
                    }
                    let sortBy = payload.sortBy.length ? payload.sortBy[0] : 'id'
                    return await axios.get(process.env.VUE_APP_API_BASE_URL + `/manage-services/api/v1/package?limit=${payload.itemsPerPage}&page=${payload.page}&monthly.equals=false&is_default.equals=false&sort=${sortBy} ${sort}&name.contains=${search}`, 
                    { headers }).then( response => {
                        // console.log(response)
                        let data = response.data
                        if(response.status == 200){
                            if(data.status){
                                let packageOnetime = data.data.rows
                                context.commit('setListPackageOnetime', packageOnetime)
                                context.commit('setTotalRowsOnetime', data.data.total_rows)
                            }
                        }

                    }).catch((e) => {
                        context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                    })
                }
            }
        },
        fetchListPackageDefault: async (context, payload) => {
            // console.log(payload)
            let search = payload.search ? payload.search : ""
            let log = await context.dispatch('MANAGESERVICE/loginMS', '' , {root: true})
            if(log.status == 200){
                if(log.data){
                    context.commit('setListPackageDefault', [])
                    context.commit('setTotalRowsDefault', null)
                    let headers = {
                        "Authorization": "Bearer " + localStorage.getItem('token_ms')
                    }
                    
                    let sort = null
                    if(payload.sortDesc.length){
                        if(payload.sortDesc[0]){
                            sort = 'asc'
                        }else{
                            sort = 'desc'
                        }
                    }else{
                        sort = 'desc'
                    }
                    let sortBy = payload.sortBy.length ? payload.sortBy[0] : 'id'
                    return await axios.get(process.env.VUE_APP_API_BASE_URL + `/manage-services/api/v1/package?limit=${payload.itemsPerPage}&page=${payload.page-1}&monthly.equals=false&is_default.equals=true&sort=${sortBy} ${sort}&name.contains=${search}`, 
                    { headers }).then( response => {
                        // console.log(response)
                        let data = response.data
                        if(response.status == 200){
                            if(data.status){
                                let packageDefault = data.data.rows
                                context.commit('setListPackageDefault', packageDefault)
                                context.commit('setTotalRowsDefault', data.data.total_rows)
                            }
                        }

                    }).catch((e) => {
                        context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                    })
                }
            }
        },
        listType: async (context, payload) => {
            let headers = {
                "Authorization": "Bearer " + localStorage.getItem('token_ms')
            }
            return axios.get(process.env.VUE_APP_API_BASE_URL + `/manage-services/api/v1/type?sort=created_at asc`, { headers }).then( response => {
                context.commit('setListType', [])
                // console.log(response)
                let data = response.data
                if(response.status == 200){
                    if(data.status){
                        let type = data.data.rows.map(data => ({ id : data.id, name: data.name }))
                        context.commit('setListType', type)
                    }
                }
            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            })
        },
        addNewPackage: async (context, payload) => {
            try{
                // console.log(payload)
                let headers = {
                    "Authorization": "Bearer " + localStorage.getItem('token_ms')
                }
                let response = await axios.post(process.env.VUE_APP_API_BASE_URL + `/manage-services/api/v1/package`, payload, { headers })
                if(response.status == 201){
                    if(response.status){
                        context.dispatch('HOMEPAGE/showSuccessToast', 'Create New Package Success' , { root: true })
                    }
                }
                return response
            }catch (e) {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            }
        },
        updatePackage: async (context, payload) => {
            try{
                let id = payload.id
                delete payload.id
                let headers = {
                    "Authorization": "Bearer " + localStorage.getItem('token_ms')
                }
                let response = await axios.put(process.env.VUE_APP_API_BASE_URL + `/manage-services/api/v1/package/${id}`, payload , { headers })
                if(response.status == 201){
                    if(response.status){
                        context.dispatch('HOMEPAGE/showSuccessToast', 'Update Package Success' , { root: true })
                    }
                }
                return response
            }catch (e) {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            }
        },
        deletePackage: async (context, payload) => {
            try{
                let headers = {
                    "Authorization": "Bearer " + localStorage.getItem('token_ms')
                }
                let response = await axios.delete(process.env.VUE_APP_API_BASE_URL + `/manage-services/api/v1/package/${payload.id}`, { headers })
                if(response.status == 200){
                    if(response.status){
                        context.dispatch('HOMEPAGE/showSuccessToast', 'Delete Package Success' , { root: true })
                    }
                }
                return response
            }catch (e) {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            }
        }
    }
}

export default store