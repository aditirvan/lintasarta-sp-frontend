import api from '../../lib/api'

export default {
  namespaced: true,
  state: {
    profile: null,
    isLoading: false
  },
  getters: {
    getProfile: (state) => {
      return state.profile
    },
    isLoading: (state) => {
      return state.isLoading
    }
  },
  mutations: {
    setProfile(state, payload) {
      state.profile = payload
    },
    isLoading(state, status) {
      state.isLoading = status
    }
  },
  actions: {
    profile: async ({commit}) => {
      try {
        let result = await api.GET('user/profile')
        if (result) {
          commit('setProfile', result.data)
        }
        return result
      } catch (e) {
        return false
      }
    },
    submit: async (context, payload) => {
      try {
        context.commit('isLoading', true)
        let data = {
          user_id: context.state.profile.id,
          name: payload.name,
          details: payload.details,
          email: context.state.profile.email,
          npwp_corporate: context.state.profile.npwp_privacy,
          phone_number: payload.phone.replaceAll(" ",""),
          address: payload.address,
          sales_id: payload.sales_id,
          country: payload.country,
          city: payload.city,
          region: payload.region,
          zip: payload.zip,
          // prefix_bussiness_phone_number: payload.prefix_bussiness_phone_number,
        }
        var result = await api.POST('user/organization', data)
        context.commit('isLoading', false)
        return result
      } catch (e) {
        context.commit('isLoading', false)
        return e.response.data
      }
    }
  }
}