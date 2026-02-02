import axios from 'axios'

export const store = {
    namespaced: true,
    state : {
        loginMS: false,
        listPackageMonthly: [],
        listOtherPackage: [],
        activePackageMonthly: [],
        activePackageAddOns: [],
        allSubsPackage: [],
        listPackageDefault: [],
        totalMonthly: 0,
        totalAddons: 0,
        isLoading: false,
    },
    getters: {
        getListPackageMonthly: state => state.listPackageMonthly,
        getListOtherPackage: state => state.listOtherPackage,
        getActivePackageMonthly: state => state.activePackageMonthly,
        getActivePackageAddOns: state => state.activePackageAddOns.filter(data => data.ticket_available>0),
        getPackageDefault: state => state.listPackageDefault,
        getPackageOnetime: state => state.listOtherPackage,
        getTotalRows: state => state.totalMonthly,
        getTotalAddons: state => state.totalAddons,
        getIsLoading: state => state.isLoading
    },
    mutations: {
        setListPackageMonthly: (state, listpackage) => state.listPackageMonthly = listpackage,
        setTotalMonthly: (state, totalMonthly) => state.totalMonthly = totalMonthly,
        setListOtherPackage: (state, otherPackage) => state.listOtherPackage = otherPackage,
        setLoginMS: (state, login) => state.loginMS = login,
        setActivePackageMonthly: (state, activePackage) => state.activePackageMonthly = activePackage,
        setActivePackageAddOns: (state, addOns) => state.activePackageAddOns = addOns,
        setListAllSubsPackage: (state, allSubsPackage) => state.allSubsPackage = allSubsPackage,
        setListPackageDefault: (state, packageDefault) => state.listPackageDefault = packageDefault,
        setTotalAddons: (state, totalAddons) => state.totalAddons = totalAddons,
        setIsLoading: (state, isLoading) => state.isLoading = isLoading
    },
    actions: {
        fetchActivePackage: async (context, payload = {}) => {
            context.commit('setActivePackageMonthly', [])
            context.commit('setActivePackageAddOns', [])
            context.commit('setIsLoading', true)
            let headers = {
                "Authorization": 'Bearer ' + localStorage.getItem('token_ms')
            }
            return await axios.get(process.env.VUE_APP_API_BASE_URL + '/manage-services/api/v1/subs-package-active',{ headers }).then( response => {
                context.commit('setIsLoading', false)
                let data = response.data
                if(response.status == 200){
                    if(data.status){
                        if(data.data){
                            let packageMonthly = data.data.filter( x => x.monthly == "true")
                            let addOns = data.data.filter( x => x.monthly == "false" && x.is_default == "false")
                            context.commit('setActivePackageMonthly', packageMonthly)
                            context.commit('setActivePackageAddOns', addOns)
                            return data
                        }else{
                            context.commit('setActivePackageMonthly', [])
                            context.commit('setActivePackageAddOns', [])
                            return data
                        }
                    }
                }
            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            })
        },
        fetchListPackageMonthly: async (context, payload) => {
            context.commit('setListPackageMonthly', [])
            let headers = {
                "Authorization": "Bearer " + localStorage.getItem('token_ms')
            }
            return await axios.get(process.env.VUE_APP_API_BASE_URL + `/manage-services/api/v1/package?page=${payload.page}&limit=${payload.limit}&monthly.equals=true&sort=quota asc`, { headers }).then( response => {
                let data = response.data
                if(response.status == 200){
                    if(data.status){
                        let packageMonthly = data.data.rows.filter( x => x.monthly == "true" )
                        context.commit('setListPackageMonthly', packageMonthly)
                        context.commit('setTotalMonthly', data.data.total_rows)
                        // console.log(context.state.listPackageMonthly)
                    }
                }

            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            })
        },
        fetchListPackageOnetime: async (context, payload = {page: 1, limit: 10}) => {
            context.commit('setListOtherPackage', [])
            let headers = {
                "Authorization": "Bearer " + localStorage.getItem('token_ms')
            }
            return await axios.get(process.env.VUE_APP_API_BASE_URL + `/manage-services/api/v1/package?page=${payload.page}&limit=${payload.limit}&monthly.equals=false&is_default.equals=false&sort=created_at asc`, { headers }).then( response => {
                let data = response.data
                if(response.status == 200){
                    if(data.status){
                        let packageOther = data.data.rows.filter( x => x.monthly == "false" )
                        context.commit('setListOtherPackage', packageOther)
                        context.commit('setTotalAddons', data.data.total_rows)
                        // console.log(context.state.listPackageMonthly)
                    }
                }

            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            })
        },
        fetchListPackageDefault: async (context, payload = {}) => {
            context.commit('setListPackageDefault', [])
            let headers = {
                "Authorization": "Bearer " + localStorage.getItem('token_ms')
            }
            return await axios.get(process.env.VUE_APP_API_BASE_URL + '/manage-services/api/v1/package?limit=100&monthly.equals=false&is_default.equals=true&sort=created_at asc', { headers }).then( response => {
                let data = response.data
                if(response.status == 200){
                    if(data.status){
                        let packageDefault = data.data.rows.filter( x => x.monthly == "false" )
                        context.commit('setListPackageDefault', packageDefault)
                    }
                }

            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            })
        },
        fetchListSubsPackage: async (context, payload) => {
            context.commit('setActivePackageMonthly', [])
            context.commit('setActivePackageAddOns', [])
            context.commit('setIsLoading', true)
            // let log = await context.dispatch('loginMS')
            // if(log.status == 200){
                let currentProj = JSON.parse(localStorage.getItem('currentProj'))
                    let headers = {
                        "Authorization": 'Bearer ' + localStorage.getItem('token_ms')
                    }
                    return axios.get(process.env.VUE_APP_API_BASE_URL + '/manage-services/api/v1/subs-package?project_id.equals='+ currentProj.id+'&status.equals=active',{ headers }).then( response => {
                        context.commit('setIsLoading', false)
                        let data = response.data
                        if(response.status == 200){
                            if(data.status){
                                if(data.data){
                                    let packageMonthly = data.data.rows.filter( x => x.monthly == "true")
                                    let addOns = data.data.rows.filter( x => x.monthly == "false" && x.is_default == "false")
                                    context.commit('setActivePackageMonthly', packageMonthly)
                                    context.commit('setActivePackageAddOns', addOns)
                                    return data
                                }else{
                                    context.commit('setActivePackageMonthly', [])
                                    context.commit('setActivePackageAddOns', [])
                                    return data
                                }
                            }
                        }
                    }).catch((e) => {
                        context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                    })
                // }else{
                //     localStorage.removeItem('token_ms')
                // }
            // }
        },
        subscribePackage: async (context, payload) => {
            try {
                let headers = {
                    "Authorization": 'Bearer ' + localStorage.getItem('token_ms')
                }
                let response = await axios.post(process.env.VUE_APP_API_BASE_URL + '/manage-services/api/v1/subs-package',payload, { headers })
                context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
                return response
            }catch (e) {
                if(e.response){
                    context.dispatch('HOMEPAGE/showErrorToast', e.response.data.errors[0], { root: true })
                    return e.response.data.errors[0]
                }else{
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                    return e.message
                }
            }
        },
        upgradePackage: async (context, payload) => {
            try {
                let id_subs_package = context.state.activePackageMonthly[0].id
                let headers = {
                    "Authorization": 'Bearer ' + localStorage.getItem('token_ms')
                }

                let response = await axios.post(process.env.VUE_APP_API_BASE_URL + '/manage-services/api/v1/subs-package/upgrade/'+ id_subs_package, payload, { headers } )
                context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
                return response
            } catch (e) {
                if(e.response){
                    context.dispatch('HOMEPAGE/showErrorToast', e.response.data.errors[0], { root: true })
                    return e.response.status
                }else{
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                    return e.message
                }
              }
        },
        unsubscribePackage: async (context, payload) => {
            try {
                let headers = {
                    "Authorization": 'Bearer ' + localStorage.getItem('token_ms')
                }
                let body = {
                    postpaid_type: payload.postpaid_type,
                    role: payload.role
                }
                let response = await axios.post(process.env.VUE_APP_API_BASE_URL + '/manage-services/api/v1/unsubs-package/' + payload.id_package, body ,{ headers })
                context.dispatch('HOMEPAGE/showSuccessToast', response.data.message , { root: true })
                return response
            }catch (e) {
                if(e.response){
                    context.dispatch('HOMEPAGE/showErrorToast', e.response.data.errors[0], { root: true })
                    return e.response.status
                }else{
                    context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
                    return e.message
                }
              }
        },
        loginMS: async (context, payload) => {
            try {
                let params = {}
                let userId_admin = JSON.parse(localStorage.getItem('userId'))
                let role = localStorage.getItem('role')
                let response = null
                
                if(!payload || role == 'Superadmin'){
                    params = { 
                        project_id: "00000000-0000-0000-0000-000000000001",
                        organization_id: "00000000-0000-0000-0000-000000000000",
                        user_id: userId_admin,
                        role: role
                    }
                    response = await axios.post(process.env.VUE_APP_API_BASE_URL + '/manage-services/api/v1/auth/connect', params)
                }else{
                    // let currentProj = JSON.parse(localStorage.getItem('currentProj'))
                    params = { role: role, ...payload }
                    response = await axios.post(process.env.VUE_APP_API_BASE_URL + '/manage-services/api/v1/auth/connect', params)
                }
                    // console.log(response)
                    localStorage.setItem('token_ms', response.data.data.access_token)
                    localStorage.setItem('login_ms', JSON.stringify(response.data.data))
                    context.commit('setLoginMS', true)

                    return response                
                }catch(e) {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            }
        },
        registerMS: async (context, payload = {}) => {
            const currentProj = context.rootState.SUPERADMIN.currentProj
            const currentOrg = context.rootState.SUPERADMIN.currentOrg
            let params = {}
            if (currentProj && currentOrg) {
                params = {
                  project_id: currentProj.id,
                  organization_id: currentOrg.id,
                  user_id: currentOrg.user_id
                }
            }
            return await axios.instance.post('/manage-services/api/v1/auth/register', params).then( response => {
                // console.log(response)
                let data = response.error
            }).catch((e) => {
                context.dispatch('HOMEPAGE/showErrorToast', e.message, { root: true })
            })
        }
    }
}