import axios from '@/lib/axios'

const store = {
    namespaced: true,
    state: {
        voucher: {},
        vouchers: [],
        pagination: {},
        isLoading: false,

        voucherCreditDetail: {},
        voucherCreditDetails: [],
        voucherCreditDetailPagination: {},
        isVoucherCreditDetailLoading: false,

        voucherDiscountProject: {},
        voucherDiscountProjects: [],
        voucherDiscountProjectPagination: {},
        isVoucherDiscountProjectLoading: false,
    },
    mutations: {
        setIsLoading: (state, payload) => state.isLoading = payload,
        setVoucher: (state, payload) => state.voucher = payload,
        setVouchers: (state, payload) => state.vouchers = payload,
        setPagination: (state, payload) => state.pagination = payload,

        setIsVoucherCreditDetailLoading: (state, payload) => state.isVoucherCreditDetailLoading = payload,
        setVoucherCreditDetail: (state, payload) => state.voucherCreditDetail = payload,
        setVoucherCreditDetails: (state, payload) => state.voucherCreditDetails = payload,
        setVoucherCreditDetailPagination: (state, payload) => state.voucherCreditDetailPagination = payload,

        setIsVoucherDiscountProjectLoading: (state, payload) => state.isVoucherDiscountProjectLoading = payload,
        setVoucherDiscountProject: (state, payload) => state.voucherDiscountProject = payload,
        setVoucherDiscountProjects: (state, payload) => state.voucherDiscountProjects = payload,
        setVoucherDiscountProjectPagination: (state, payload) => state.voucherDiscountProjectPagination = payload,
    },
    actions: {
        fetchVouchers: async({ commit, dispatch }, payload) => {
            let url = `/user/voucher/claimed`
            let params = {organization_id: null, project_id: null};

            const currentProj = JSON.parse(localStorage.getItem("currentProj"));
            const role = localStorage.getItem("role");
            const isSuperAdmin = role && role === "Superadmin";

            if (currentProj && currentProj.id && currentProj.organization_id) {
                params.project_id = currentProj.id;
                if (isSuperAdmin) params.organization_id = currentProj.organization_id;
            }
            if (isSuperAdmin) url = '/superadmin/voucher/claimed';
            const response = await axios.instance.get(url, {params : params})
            commit('setVouchers', response.data.data.filter(x => x.id))
            return response
        },
        claimVoucher: async({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoading', true)
                let response = await axios.instance.post(`/user/voucher`, payload)
                commit('setIsLoading', false)
                dispatch('fetchVouchers')
                dispatch('HOMEPAGE/showSuccessToast', 'Voucher has been successfully claimed!', { root: true })
                return response.data
            } catch (e) {
                let errorMessage = 'A problem encountered while claiming voucher.'
                const error = e.response.data.data
                if (error.includes('voucher code is not valid')) errorMessage = 'Invalid voucher code!'
                else if (error.includes('voucher has already redeemed')) errorMessage = 'You already redeemed this voucher.'
                else if (error.includes('voucher claim period is ended')) errorMessage = 'Voucher claim period is over!'
                else if (error.includes('voucher has already expired')) errorMessage = 'The voucher is expired'

                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
            }
        },
        adminClaimVoucher: async({ commit, dispatch }, payload) => {
            try {
                commit('setIsLoading', true)
                let response = await axios.instance.post(`/superadmin/voucher-claim`, payload)
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showSuccessToast', 'Voucher has been successfully claimed!', { root: true })
                return response.data
            } catch (e) {
                let errorMessage = 'A problem encountered while claiming voucher.'
                const error = e.response.data.data
                if (error.includes('voucher code is not valid')) errorMessage = 'Invalid voucher code!'
                else if (error.includes('voucher has already redeemed')) errorMessage = 'Voucher already redeemed.'
                else if (error.includes('voucher claim period is ended')) errorMessage = 'Voucher claim period is over!'
                else if (error.includes('voucher has already expired')) errorMessage = 'The voucher is expired'
                else if (error.includes("you need to input 'project_id'")) errorMessage = "You must be select a project !"
                commit('setIsLoading', false)
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
            }
        },

        // voucher credit
        fetchVoucherCreditDetails: async(context, payload={ page:1, itemsPerPage:10 }) => {
            let data = []
            let params = {
                page: payload.page,
                limit: payload.itemsPerPage,
            } 

            if (payload.projectID) {
                params['projectID'] = payload.projectID
            }

            context.commit('setIsVoucherCreditDetailLoading', true)
            const response = await axios.instance.get('/user/voucher-credit/claimed', { params : params })
            if(response.status === 200) {
               const {voucher_credit_details, pagination} = response.data.data
               context.commit('setVoucherCreditDetails', voucher_credit_details)
               context.commit('setVoucherCreditDetailPagination', pagination)
            }
            context.commit('setIsVoucherCreditDetailLoading', false)
            return data
        },
        claimVoucherCredit: async({ commit, dispatch }, payload) => {
            try {
                commit('setIsVoucherCreditDetailLoading', true)
                let response = await axios.instance.post(`/user/voucher-credit/claim`, payload)
                commit('setIsVoucherCreditDetailLoading', false)
                dispatch('fetchVoucherCreditDetails')
                dispatch('HOMEPAGE/showSuccessToast', 'Voucher has been successfully claimed!', { root: true })
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

                commit('setIsVoucherCreditDetailLoading', false)
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
            }
        },

        // voucher discounts
        fetchVoucherDiscountProjects: async(context, payload={ page:1, itemsPerPage:10 }) => {
            let data = []
            let params = {
                page: payload.page,
                limit: payload.itemsPerPage,
            } 

            if (payload.projectID) {
                params['projectID'] = payload.projectID
            }
            context.commit('setIsVoucherDiscountProjectLoading', true)
            const response = await axios.instance.get('/user/voucher-discount/claimed', { params : params })
            if(response.status === 200) {
               const {voucher_discounts, pagination} = response.data.data
               context.commit('setVoucherDiscountProjects', voucher_discounts)
               context.commit('setVoucherDiscountProjectPagination', pagination)
            }
            context.commit('setIsVoucherDiscountProjectLoading', false)
            return data
        },
        claimVoucherDiscount: async({ commit, dispatch }, payload) => {
            try {
                commit('setIsVoucherDiscountProjectLoading', true)
                let response = await axios.instance.post(`/user/voucher-discount/claim`, payload)
                commit('setIsVoucherDiscountProjectLoading', false)
                dispatch('fetchVoucherDiscountProjects')
                dispatch('HOMEPAGE/showSuccessToast', 'Voucher has been successfully claimed!', { root: true })
                return response.data
            } catch (e) {
                const err = e.response.data.data
                let errorMessage = 'A problem encountered while claim this voucher Discount'
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

                commit('setIsVoucherDiscountProjectLoading', false)
                dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
            }
        },
    }
}

export default store