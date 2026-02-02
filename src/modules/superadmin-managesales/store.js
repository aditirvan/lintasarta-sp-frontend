import axios from '@/lib/axios'
import libProject from '@/lib/project'
import { Promise } from 'core-js';

export default {
  namespaced: true,
  state: {
    asd: null,
  },
  mutations: {
    setregions(state, regions) {
      state.regions = regions
    },
  },
  actions: {
    // resize: async ({ commit, dispatch }, payload) => {
    //   try {
    //     commit('setIsLoading', true)
    //     const { region, instance_id } = payload
    //     const response = await axios.instance.post('/user/instances/resize', payload)
    //     await dispatch('fetchInstanceDetail', instance_id)
    //     dispatch('fetchMasterInstances', { region })
    //     dispatch('HOMEPAGE/showSuccessToast', 'Instance flavor has been successfully changed.', { root: true })
    //     commit('setIsLoading', false)
    //     return response
    //   } catch (e) {
    //     commit('setIsLoading', false)
    //     const error = e.response.data.data
    //     if (error.includes('Please upgrade your organization')) commit('DASHBOARD/setopendialogreachlimit', true, { root: true })
    //     else dispatch('HOMEPAGE/showErrorToast', 'Failed to change instance flavor.', { root: true })
    //   }
    // },
  }
}