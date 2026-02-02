import axios from '@/lib/axios'
import {ActionContext, Module} from 'vuex'
import localstorage from "@/lib/localstorage";

interface State {
    // voucher trial
    vouchers: Array<any>,
    pagination: any,
    isLoading: Boolean,
    voucher: Object,
    voucherDetails: Object,

    // voucher credit
    voucherCredits: Array<any>,
    voucherCreditPagination: any,
    isVoucherCreditLoading: Boolean,
    voucherCredit: Object,
    voucherCreditDetails: Array<any>,
    voucherCreditCodeCount: number,
    voucherCreditDetailPagination: Object

    // voucher discount
    projects: Array<Object>,
    isProjectsLoading: Boolean,
    projectPagination: any,
    sales: Array<Object>,
    isSalesLoading: Boolean,
    instanceFlavors: Array<Object>,
    isinstanceFlavorsLoading: Boolean,
    voucherDiscounts: Array<any>,
    isVoucherDiscountLoading: Boolean,
    voucherDiscountPagination: any,
    voucherDiscountProjects: Array<any>,
    voucherDiscountProject: any,
    isVoucherDiscountProjectLoading: Boolean,
    voucherDiscountProjectPagination: any,
    voucherDiscount: Object,
    voucherDiscountCodes: Array<any>,
    voucherDiscountCodesPagination: any,
}
const store: Module<State,any>= {
    namespaced: true,
    state:{
        vouchers: [],
        pagination: {},
        voucher: {},
        isLoading: false,
        voucherDetails: {},

        voucherCredits: [],
        voucherCreditPagination: {},
        isVoucherCreditLoading: false,
        voucherCredit: {},
        voucherCreditDetails: [],
        voucherCreditCodeCount: 0,
        voucherCreditDetailPagination: {},

        projects: [],
        isProjectsLoading: false,
        projectPagination: {},
        sales: [],
        isSalesLoading: false,
        instanceFlavors: [],
        isinstanceFlavorsLoading: false,
        voucherDiscounts: [],
        isVoucherDiscountLoading: false,
        voucherDiscountPagination: {},
        voucherDiscountProjects: [],
        voucherDiscountProject: {},
        isVoucherDiscountProjectLoading: false,
        voucherDiscountProjectPagination: {},
        voucherDiscount: {},
        voucherDiscountCodes:[],
        voucherDiscountCodesPagination: {}
    },
    mutations:{
        setVouchers:(state:State,payload:any) => state.vouchers = payload,
        setVoucher:(state:State,payload:any) => state.voucher = payload,
        setPagination:(state:State,payload:any) => state.pagination = payload,
        setIsLoading: (state:State, payload:any) => state.isLoading = payload,
        setVoucherDetails: (state, payload) => state.voucherDetails = payload,

        setVoucherCredits: (state:State,payload:any) => state.voucherCredits = payload,
        setVoucherCredit: (state:State,payload:any) => state.voucherCredit = payload,
        setVoucherCreditPagination: (state:State,payload:any) => state.voucherCreditPagination = payload,
        setIsVoucherCreditsLoading: (state:State,payload:any) => state.isVoucherCreditLoading = payload,
        setVoucherCreditDetails: (state:State,payload:any) => state.voucherCreditDetails = payload,
        setVoucherCreditCodeCount: (state:State,payload:any) => state.voucherCreditCodeCount = payload,
        setVoucherCreditDetailPagination: (state:State,payload:any) => state.voucherCreditDetailPagination = payload,

        setProjects:(state:State,payload:any) => state.projects = payload,
        setIsProjectsLoading: (state:State, payload:any) => state.isProjectsLoading = payload,
        setProjectPagination:(state:State,payload:any) => state.projectPagination = payload,
        setSales:(state:State,payload:any) => state.sales = payload,
        setIsSalesLoading: (state:State, payload:any) => state.isSalesLoading = payload,
        setInstanceFlavors:(state:State,payload:any) => state.instanceFlavors = payload,
        setIsInstanceFlavorLoading: (state:State, payload:any) => state.isinstanceFlavorsLoading = payload,
        setVoucherDiscounts:(state:State,payload:any) => state.voucherDiscounts = payload,
        setVoucherDiscountPagination:(state:State,payload:any) => state.voucherDiscountPagination = payload,
        setIsVoucherDiscountLoading: (state:State, payload:any) => state.isVoucherDiscountLoading = payload,
        setVoucherDiscountProjects:(state:State,payload:any) => state.voucherDiscountProjects = payload,
        setVoucherDiscountProject:(state:State,payload:any) => state.voucherDiscountProject = payload,
        setVoucherDiscountProjectPagination:(state:State,payload:any) => state.voucherDiscountProjectPagination = payload,
        setIsVoucherDiscountProjectLoading: (state:State, payload:any) => state.isVoucherDiscountProjectLoading = payload,
        setVoucherDiscount:(state:State,payload:any) => state.voucherDiscount = payload,
        setVoucherDiscountCodes: (state:State, payload:any)=>state.voucherDiscountCodes = payload,
        setVoucherDiscountCodesPagination: (state:State, payload:any)=>state.voucherDiscountCodesPagination = payload
    },
    actions:{
        // voucher trial
        addvoucher:async(context: ActionContext<State, any>, payload:any)=>{
            let haveValue = false
            if (!payload.setting){
                context.dispatch(
                    'HOMEPAGE/showErrorToast',
                    "System Error, Tell your system administration!",
                    { root: true }
                )
                return { code: null}
            }

            for(const [_, value] of Object.entries(payload.setting)) {
                if (value > 0){
                    haveValue = true
                    break
                }
            }

            if (!haveValue) {
                context.dispatch(
                    'HOMEPAGE/showErrorToast',
                    "All of resources can't be zero!",
                    { root: true }
                )
                return { code: null}
            }

            try {
                context.commit('setIsLoading', true)
                const response =  await axios.instance.post('/superadmin/voucher', payload)
                context.commit('setIsLoading', false) 
                context.dispatch('fetchvouchers')
                context.dispatch('HOMEPAGE/showSuccessToast', 'Voucher has been successfully created!', { root: true }) 
                return response.data
            } catch (e) { 
                let errorMessage = 'A problem encountered while create new voucher'
                const error = e.response.data.data
                
                if (error.includes('voucher name or prefix code has already taken')) errorMessage = 'Voucher name or prefix code has already taken!'
                else if (
                    error.includes("'day_duration' or 'expired_date' must be filled") ||
                    error.includes("'day_duration' or 'expired_date' one of them must be filled")
                ) {
                    errorMessage = "Make sure to input Duration or Expired Date!"
                }
                else if (error.includes("expired date must be greater than claim end period")) errorMessage = "Expired Date must be greater than claim end period!"

                context.commit('setIsLoading', false) 
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
            }
        },
        fetchvouchers: async(context: ActionContext<State, any>,payload: any={ page:1, itemsPerPage:10 })=>{
            let data : any = []
            context.commit('setIsLoading', true)
            const response:any = await axios.instance.get('/superadmin/voucher',{params:{page:payload.page,limit:payload.itemsPerPage, search:payload.search, sortBy:payload.sortBy, sortDesc:payload.sortDesc}})
            if(response.status === 200) {
               const {voucher, pagination} = response.data.data
               context.commit('setVouchers', voucher)
               context.commit('setPagination', pagination)
               data = response.data.data
            }
            context.commit('setIsLoading', false)
            return data
        },
        fetchvoucher: async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.get(`/user/voucher/${payload.id}`, ).then(response=>{
                const voucher =  response.data.data
                context.commit('setVoucher', voucher)
            })
        },
        fetchVoucherDetails: async({ commit, dispatch }, payload:any) => {
            commit('setIsLoading', true)
            const url = `/superadmin/voucher-detail/${payload.id}`
            const response = await axios.instance.get(url, {
                params:{page:payload.page,limit:payload.itemsPerPage, search:payload.search}}
            )
            commit('setVoucherDetails', response.data.data)
            commit('setIsLoading', false)
        },
        updateVoucherDetail:async(context: ActionContext<State, any>, payload:any)=>{
            try {
                context.commit('setIsLoading', true)
                const response = await axios.instance.put(`/superadmin/voucher-detail/${payload.id}`, payload)
                context.commit('setIsLoading', false) 
                context.dispatch('HOMEPAGE/showSuccessToast', 'Voucher has been updated!', { root: true }) 
                return response.data
            } catch (e) { 
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while update this voucher'
                if (err.includes('expired date only can set to the after the next 7 days')) errorMessage = 'Expired date only can set to the after the next 7 days from now.'
                context.commit('setIsLoading', false) 
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
            }
        },
        deleteVoucher: async ({ commit, dispatch }, id) => {
            try {
                commit('setIsLoading', true)
                const response = await axios.instance.delete(`/superadmin/voucher/${id}`)
                dispatch('fetchvouchers')
                dispatch('HOMEPAGE/showSuccessToast', 'Trial voucher has been successfully deleted!', { root: true }) 
                commit('setIsLoading', false)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to delete trial voucher'
                if (err.includes(`voucher credit is being used by project`)) errorMessage = 'Voucher credit is being used by project'
                if (err.includes(`this voucher has already been claimed for the project and is non-deletable`)) errorMessage = 'This voucher has already been claimed for the project and is non-deletable'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
                return
            }
        },

        // voucher credit
        fetchVoucherCredits: async(context: ActionContext<State, any>,payload: any={ page:1, itemsPerPage:10 })=>{
            let data : any = []
            context.commit('setIsVoucherCreditsLoading', true)
            const response:any = await axios.instance.get('/superadmin/voucher-credit',{params:{page:payload.page,limit:payload.itemsPerPage, search:payload.search, sortBy:payload.sortBy, sortDesc:payload.sortDesc}})
            if(response.status === 200) {
               const {voucher_credits, pagination} = response.data.data
               context.commit('setVoucherCredits', voucher_credits)
               context.commit('setVoucherCreditPagination', pagination)
               data = response.data.data
            }
            context.commit('setIsVoucherCreditsLoading', false)
            return data
        },
        fetchvoucherCredit: async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.get(`/superadmin/voucher-credit/${payload.id}`, ).then(response=>{
                const voucher =  response.data.data
                context.commit('setVoucherCredit', voucher)
            })
        },
        fetchVoucherCreditDetails: async(context, payload={ page:1, itemsPerPage:5 }) => {
            const { id } = payload
            context.commit('setIsVoucherCreditsLoading', true)
            const response = await axios.instance.get(`/superadmin/voucher-credit/${id}/detail`, {params:{page:payload.page,limit:payload.itemsPerPage}})
            if(response.status === 200) {
                const {voucher_credit_details, pagination} = response.data.data
                context.commit('setVoucherCreditDetails', voucher_credit_details)
                context.commit('setVoucherCreditDetailPagination', pagination)
             }
             context.commit('setIsVoucherCreditsLoading', false)
        },
        fetchVoucherCreditCodeCount: async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.get(`/superadmin/voucher-credit/${payload.id}/count-available`, ).then(response=>{
                const count =  response.data.data
                context.commit('setVoucherCreditCodeCount', count)
            })
        },
        addvoucherCredit:async(context: ActionContext<State, any>, payload:any)=>{
            try {
                context.commit('setIsVoucherCreditsLoading', true)
                const response =  await axios.instance.post('/superadmin/voucher-credit', payload)
                context.commit('setIsVoucherCreditsLoading', false) 
                context.dispatch('fetchVoucherCredits')
                context.dispatch('HOMEPAGE/showSuccessToast', 'Voucher credit has been successfully created!', { root: true }) 
                return response.data
            } catch (e) { 
                let errorMessage = 'A problem encountered while create new voucher credit'
                const error = e.response.data.data
                
                if (error.includes('recurring date and period cannot be empty')) errorMessage = 'Recurring date and period cannot be empty'
                else if (error.includes("recurring expired date cannot be empty")) errorMessage = "Recurring expired date cannot be empty"
                else if (error.includes("voucher name or prefix code has already taken")) errorMessage = "Voucher name or prefix code has already taken"
                else if (error.includes("ClaimPeriodEnd") || error.includes("ClaimPeriodStart")) errorMessage = "Voucher claim period is not allowed"

                context.commit('setIsVoucherCreditsLoading', false) 
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
            }
        },
        updateVoucherCredit:async(context: ActionContext<State, any>, payload:any)=>{
            const { id } = payload
            try {
                context.commit('setIsVoucherCreditsLoading', true)
                const response = await axios.instance.put(`/superadmin/voucher-credit/${id}`, payload)
                context.commit('setIsVoucherCreditsLoading', false) 
                context.dispatch('HOMEPAGE/showSuccessToast', 'Voucher has been updated!', { root: true }) 
                return response.data
            } catch (e) { 
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while edit this voucher credit'
                if (err.includes('voucher code is not valid')) errorMessage = 'voucher code is not valid'
                else if (err.includes('unable to edit one time voucher amount after claimed by user')) errorMessage = 'Unable to edit one time voucher amount after claimed by user'

                context.commit('setIsVoucherCreditsLoading', false) 
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
            }
        },
        deleteVoucherCredit: async ({ commit, dispatch }, id) => {
            try {
                commit('setIsVoucherCreditsLoading', true)
                const response = await axios.instance.delete(`/superadmin/voucher-credit/${id}`)
                dispatch('fetchVoucherCredits')
                dispatch('HOMEPAGE/showSuccessToast', 'Credit voucher has been successfully deleted!', { root: true }) 
                commit('setIsVoucherCreditsLoading', false)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to delete credit voucher'
                if (err.includes(`voucher credit is being used by project`)) errorMessage = 'Voucher credit is being used by project'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
                return
            }
        },
        claimVoucherCredit:async(context: ActionContext<State, any>, payload:any)=>{
            try {
                context.commit('setIsVoucherCreditsLoading', true)
                const response = await axios.instance.post(`/superadmin/voucher-credit/claim`, payload)
                context.commit('setIsVoucherCreditsLoading', false) 
                context.dispatch('HOMEPAGE/showSuccessToast', 'Voucher has been updated!', { root: true }) 
                return response.data
            } catch (e) { 
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while claim this voucher credit'
                if (err.includes('ProjectID') || err.includes('OrganizationID')) errorMessage = 'Project is not selected'
                else if (err.includes('voucher code is not valid')) errorMessage = 'Voucher code is not valid'
                else if (err.includes('project id is not valid')) errorMessage = 'Project id is not valid'
                else if (err.includes('voucher is not active')) errorMessage = 'Voucher is not active'
                else if (err.includes('voucher claim period has not started yet')) errorMessage = 'Voucher claim period has not started yet'
                else if (err.includes('voucher claim period has ended')) errorMessage = 'Voucher claim period has ended'
                else if (err.includes('voucher has already expired')) errorMessage = 'Voucher has already expired'
                else if (err.includes('voucher has already redeemed')) errorMessage = 'Voucher has already redeemed'
                else if (err.includes('voucher already applied to project')) errorMessage = 'Voucher already applied to project'
                else if (err.includes('voucher has already applied to this project')) errorMessage = 'Voucher has already applied to this project'
                else if (err.includes('project has been deleted')) errorMessage = 'Project has been deleted'
                else if (err.includes('project is not active')) errorMessage = 'Project is not active'
                else if (err.includes('organization has been deleted')) errorMessage = 'Organization has been deleted'
                else if (err.includes('organization is not active')) errorMessage = 'Organization is not active'
                
                context.commit('setIsVoucherCreditsLoading', false) 
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
            }
        },
        revokeVoucherCredit: async ({ commit, dispatch }, code) => {
            try {
                commit('setIsVoucherCreditsLoading', true)
                const response = await axios.instance.delete(`/superadmin/voucher-credit/claim/${code}`)
                commit('setIsVoucherCreditsLoading', false)
                dispatch('HOMEPAGE/showSuccessToast', 'Credit voucher code has been successfully revoked from project!', { root: true }) 
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to delete credit voucher code'
                if (err.includes(`voucher code is not valid`)) errorMessage = 'Voucher code is not valid'
                else if (err.includes(`voucher has been revoked`)) errorMessage = 'Voucher has been revoked'
                else if (err.includes(`voucher has been redeemed`)) errorMessage = 'Voucher has been redeemed'
                else if (err.includes(`voucher unclaimed`)) errorMessage = 'Voucher unclaimed'
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
                return
            }
        },
        enableVoucherCredit:async(context: ActionContext<State, any>, id)=>{
            try {
                context.commit('setIsVoucherCreditsLoading', true)
                const response = await axios.instance.put(`/superadmin/voucher-credit/detail/${id}/enable`)
                context.commit('setIsVoucherCreditsLoading', false) 
                context.dispatch('HOMEPAGE/showSuccessToast', 'Voucher has been enabled!', { root: true }) 
                return response
            } catch (e) { 
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while enable this voucher credit'
                if (err.includes('voucher code is not valid')) errorMessage = 'Voucher code is not valid'
                else if (err.includes('project is not found')) errorMessage = 'Project is not found'
                else if (err.includes('voucher already enabled')) errorMessage = 'Voucher already enabled'
                
                context.commit('setIsVoucherCreditsLoading', false) 
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
            }
        },
        disableVoucherCredit:async(context: ActionContext<State, any>, id)=>{
            try {
                context.commit('setIsVoucherCreditsLoading', true)
                const response = await axios.instance.put(`/superadmin/voucher-credit/detail/${id}/disable`)
                context.commit('setIsVoucherCreditsLoading', false) 
                context.dispatch('HOMEPAGE/showSuccessToast', 'Voucher has been disabled!', { root: true }) 
                return response
            } catch (e) { 
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while disable this voucher credit'
                if (err.includes('voucher code is not valid')) errorMessage = 'Voucher code is not valid'
                else if (err.includes('voucher already disabled')) errorMessage = 'Voucher already disabled'
                
                context.commit('setIsVoucherCreditsLoading', false) 
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
            }
        },

        // voucher discount
        fetchProjects: async(context: ActionContext<State, any>,payload: any={ page:1, itemsPerPage:50 })=>{
            let data : any = []
            context.commit('setIsProjectsLoading', true)
            const response:any = await axios.instance.get('/superadmin/projects/paginated',{params:{page:payload.page,limit:payload.itemsPerPage, name:payload.name}})
            if(response.status === 200) {
               const {projects, pagination} = response.data.data
               context.commit('setProjects', projects)
               context.commit('setProjectPagination', pagination)
               data = response.data.data
            }
            context.commit('setIsProjectsLoading', false)
            return data
        },
        fetchSales: async(context: ActionContext<State, any>)=>{
            let data : any = []
            context.commit('setIsSalesLoading', true)
            const response:any = await axios.instance.get('/superadmin/sales-list')
            if(response.status === 200) {
               const sales = response.data.data
               context.commit('setSales', sales)
               data = sales
            }
            context.commit('setIsSalesLoading', false)
            return data
        },
        fetchInstanceFlavors: async(context: ActionContext<State, any>)=>{
            let data : any = []
            context.commit('setIsInstanceFlavorLoading', true)
            const response:any = await axios.instance.get('/flavor/instance-list')
            if(response.status === 200) {
               const instanceFlavors = response.data.data
               context.commit('setInstanceFlavors', instanceFlavors)
               data = instanceFlavors
            }
            context.commit('setIsInstanceFlavorLoading', false)
            return data
        },
        fetchVoucherDiscounts: async(context: ActionContext<State, any>, payload: any={ page:1, itemsPerPage:10 })=>{
            let data : any = []
            context.commit('setIsVoucherDiscountLoading', true)
            const response:any = await axios.instance.get('/superadmin/voucher-discount',{params:{page:payload.page,limit:payload.itemsPerPage, search:payload.search, sortBy:payload.sortBy, sortDesc:payload.sortDesc}})
            if(response.status === 200) {
               const {voucher_discounts, pagination} = response.data.data
               context.commit('setVoucherDiscounts', voucher_discounts)
               context.commit('setVoucherDiscountPagination', pagination)
               data= response.data.data
            }
            context.commit('setIsVoucherDiscountLoading', false)
            return data
        },
        fetchVoucherDiscount: async(context: ActionContext<State, any>, id: string)=>{
            return await axios.instance.get(`/superadmin/voucher-discount/${id}`, ).then(response=>{
                const voucherDiscount =  response.data.data
                context.commit('setVoucherDiscount', voucherDiscount)
            })
        },
        addVoucherDiscount:async(context: ActionContext<State, any>, payload:any)=>{
            try {
                context.commit('setIsVoucherDiscountLoading', true)
                const response =  await axios.instance.post('/superadmin/voucher-discount', payload)
                context.commit('setIsVoucherDiscountLoading', false) 
                context.dispatch('fetchVoucherDiscounts')
                context.dispatch('HOMEPAGE/showSuccessToast', 'Voucher discount has been successfully created!', { root: true }) 
                return response.data
            } catch (e) { 
                let errorMessage = 'A problem encountered while create new voucher discount'
                const error = e.response.data.data
                
                if (error.includes('sales not found')) errorMessage = 'Sales not found'
                else if (error.includes('voucher name has already taken')) errorMessage = 'Voucher name has already taken'
                else if (error.includes('failed to create voucher discount')) errorMessage = 'Failed to create voucher discount'
                else if (error.includes('you must add at least 1 instance flavor to create this voucher discount')) errorMessage = 'You must add at least 1 instance flavor to create this voucher discount'
                else if (error.includes('failed to create voucher discount detail')) errorMessage = 'Failed to create voucher discount detail'
                
                context.commit('setIsVoucherDiscountLoading', false) 
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
            }
        },
        updateVoucherDiscount:async(context: ActionContext<State, any>, payload:any)=>{
            try {
                context.commit('setIsVoucherDiscountLoading', true)
                const response =  await axios.instance.put(`/superadmin/voucher-discount/${payload.id}`, payload.data)
                context.commit('setIsVoucherDiscountLoading', false) 
                context.dispatch('fetchVoucherDiscounts')
                context.dispatch('HOMEPAGE/showSuccessToast', 'Voucher discount has been successfully updated!', { root: true }) 
                return response.data
            } catch (e) { 
                let errorMessage = 'A problem encountered while update voucher discount'
                const error = e.response.data.data
                
                if (error.includes('voucher discount not found')) errorMessage = 'Voucher discount not found'
                else if (error.includes('voucher name has already taken')) errorMessage = 'Voucher name has already taken'
                else if (error.includes('sales not found')) errorMessage = 'sales not found'
                else if (error.includes('you must add at least 1 instance flavor to edit this voucher discount')) errorMessage = 'You must add at least 1 instance flavor to edit this voucher discount'
                else if (error.includes('failed to update voucher discount')) errorMessage = 'Failed to update voucher discount'
                else if (error.includes('failed to update voucher discount detail')) errorMessage = 'Failed to update voucher discount detail'
                
                context.commit('setIsVoucherDiscountLoading', false) 
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
            }
        },
        deleteVoucherDiscount: async ({ commit, dispatch }, id) => {
            try {
                commit('setIsVoucherDiscountLoading', true)
                const response = await axios.instance.delete(`/superadmin/voucher-discount/${id}`)
                dispatch('fetchVoucherDiscounts')
                dispatch('HOMEPAGE/showSuccessToast', 'Voucher discount has been successfully deleted!', { root: true }) 
                commit('setIsVoucherDiscountLoading', false)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to delete voucher discount'
                
                if (err.includes('voucher discount not found')) errorMessage = 'Voucher discount not found'
                else if (err.includes("cannot delete this voucher discount because it's still has remaining project")) errorMessage = "Cannot delete this voucher discount because it's still has remaining project"

                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
                return
            }
        },
        fetchVoucherDiscountProjects: async(context: ActionContext<State, any>, payload: any={ voucherDiscountID: "", page:1, itemsPerPage:10 })=>{
            let data : any = []
            context.commit('setIsVoucherDiscountProjectLoading', true)
            const response:any = await axios.instance.get(`/superadmin/voucher-discount/projects/${payload.voucherDiscountID}`, {params:{page:payload.page,limit:payload.itemsPerPage}})
            if(response.status === 200) {
               const {voucher_discount_projects, pagination} = response.data.data
               context.commit('setVoucherDiscountProjects', voucher_discount_projects)
               context.commit('setVoucherDiscountProjectPagination', pagination)
               data = response.data.data
            }
            context.commit('setIsVoucherDiscountProjectLoading', false)
            return data
        },
        fetchVoucherDiscountByProjectID: async(context: ActionContext<State, any>, projectID)=>{
            const user_role = localstorage.getItem("role");
            const uri = user_role === "Superadmin" ? 
                `/superadmin/voucher-discount/project/${projectID}` :
                `/user/voucher-discount/project/${projectID}`

            let data : any = []
            context.commit('setIsVoucherDiscountProjectLoading', true)
            const response:any = await axios.instance.get(uri)
            if(response.status === 200) {
               const voucherDiscount = response.data.data
               context.commit('setVoucherDiscountProject', voucherDiscount)
               data = voucherDiscount
            }
            context.commit('setIsVoucherDiscountProjectLoading', false)
            return data
        },
        claimVoucherDiscountProject: async (context: ActionContext<State, any>, payload:any) => {
            try {
                context.commit('setIsVoucherDiscountProjectLoading', true)
                const response =  await axios.instance.post('/superadmin/voucher-discount/claim', payload)
                context.commit('setIsVoucherDiscountProjectLoading', false) 
                context.dispatch('fetchVoucherDiscount')
                // context.dispatch('HOMEPAGE/showSuccessToast', 'Voucher discount has already applied to this project!', { root: true }) 
                return response.data
            } catch (e) { 
                let errorMessage = 'A problem encountered while applied voucher discount to project'
                const err = e.response.data.data
                
                if (err.includes('project not found')) errorMessage = 'Project not found'
                else if (err.includes('voucher code is not valid')) errorMessage = 'Voucher code is not valid'
                else if (err.includes('project has been deleted')) errorMessage = 'Project has been deleted'
                else if (err.includes('project is not active')) errorMessage = 'Project is not active'
                else if (err.includes('organization has been deleted')) errorMessage = 'Organization has been deleted'
                else if (err.includes('organization is not active')) errorMessage = 'Organization is not active'
                else if (err.includes('cannot apply voucher discount to postpaid fixed project')) errorMessage = 'Cannot apply voucher discount to postpaid fixed project'
                else if (err.includes('the number of claims has exceeded the quota')) errorMessage = 'The number of claims has exceeded the quota'
                else if (err.includes('voucher discount has already applied to this project')) errorMessage = 'Voucher discount has already applied to this project'
                else if (err.includes('voucher discount detail not found')) errorMessage = 'Voucher discount detail not found'
                
                context.commit('setIsVoucherDiscountProjectLoading', false) 
                context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
            }
        },
        deleteVoucherDiscountProject: async ({ commit, dispatch }, id) => {
            try {
                commit('setIsVoucherDiscountProjectLoading', true)
                const response = await axios.instance.delete(`/superadmin/voucher-discount/project/${id}`)
                dispatch('fetchVoucherDiscounts')
                dispatch('HOMEPAGE/showSuccessToast', 'Voucher discount has been successfully removed from project!', { root: true }) 
                commit('setIsVoucherDiscountProjectLoading', false)
                return response
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while trying to remove voucher discount from project'
                
                if (err.includes('voucher discount not found')) errorMessage = 'Voucher discount not found'
                else if (err.includes("project not found on this voucher discount")) errorMessage = "Project not found on this voucher discount"

                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
                return
            }
        },
        fetchVoucherDiscountCodes: async(context: ActionContext<State, any>, payload: any={page:1,itemsPerPage:50})=>{
            return await axios.instance.get(`/superadmin/voucher-discount-codes`,{params:{page:payload.page,limit:payload.itemsPerPage}}).then((response)=>{
               const {voucher_discount_codes, pagination} = response.data.data
               context.commit('setVoucherDiscountCodes', voucher_discount_codes)
               context.commit('setVoucherDiscountCodesPagination', pagination)
            })
        },
    }
    
}

export default store