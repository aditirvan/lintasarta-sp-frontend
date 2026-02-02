import api from '../../lib/api'
import localstorage from '../../lib/localstorage'

export default {
  namespaced: true,
  state: {
    isLoading: false
  },
  getters: {
    isLoading: (state) => {
      return state.isLoading
    }
  },
  mutations: {
    isLoading(state, status) {
      state.isLoading = status
    }
  },
  actions: {
    save: async (context, payload) => {
      try {
        context.commit('isLoading', true)

        const organization_id = localstorage.getItem('orgid')

        let data = {
          organization_id,
          name: payload.projectName,
          description: payload.description,
          payment_method: payload.payment_method,
          region: payload.selected_region.name,
          voucher_discount_code: payload.voucher_discount_code,
          vat_id: payload.vatid
        }
        var result = await api.POST('user/projects', data)
        context.commit('isLoading', false)
        return result
      } catch (e) {
        context.commit('isLoading', false)
        return e.response.data;
      }
    }
  }
}