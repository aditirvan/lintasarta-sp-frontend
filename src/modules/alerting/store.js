import libProject from '@/lib/project'
import axios from '@/lib/axios'

const store = {
  namespaced: true,
  state: {
    alert: null,
    alerts: [],
    isLoading: false,
    pagination: {},
  },
  mutations: {
    setAlert: (state, payload) => state.alert = payload,
    setAlerts: (state, payload) => state.alerts = payload,
    setIsLoading: (state, payload) => state.isLoading = payload,
    setPagination: (state, payload) => (state.pagination = payload),

  },
  actions: {
    fetchAlerts: async ({ commit, dispatch }, payload = { page: 1, itemsPerPage: 10 }) => {
      commit('setIsLoading', true)
      const activeProjectID = await libProject.getActiveProjectID()
      // let response = await axios.instance.get(`/alerting/project/${activeProjectID}`, { params: { ...payload } });
      let response = await axios.instance.get(`/alerting/paginated`, {
        params: {
          project_id: activeProjectID,
          page: payload.page,
          limit: payload.itemsPerPage,
          search: payload.search,
          sortBy: payload.sortBy,
          sortDesc: payload.sortDesc,
        }
      });
      const { alertings, pagination } = response.data.data
      commit('setAlerts', alertings);
      commit('setPagination', pagination);
      commit('setIsLoading', false)
      return response.data
    },
    fetchAlertByID: async ({ commit, dispatch }, id) => {
      commit('setIsLoading', true)
      let response = await axios.instance.get(`/alerting/detail/${id}`);
      commit('setAlert', response.data.data);
      commit('setIsLoading', false)
      return response.data
    },
    createAlert: async ({ commit, dispatch }, payload) => {
      try {
        commit('setIsLoading', true)
        let response = await axios.instance.post(`/alerting/create`, payload);
        commit('setIsLoading', false)
        dispatch('HOMEPAGE/showSuccessToast', 'Alert has been succesfully created', { root: true })
        return response.data
      } catch (e) {
        let errorMessage = 'A problem encountered while creating the alert'

        if (e && e.response && e.response.data && e.response.data.data) {
          dispatch('HOMEPAGE/showErrorToast', e.response.data.data, { root: true })  
        } else {
          dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
        }
        
        commit('setIsLoading', false)
        return e.response
      }
    },
    updateAlert: async ({ commit, dispatch }, payload) => {
      try {
        commit('setIsLoading', true)
        const { id } = payload
        let response = await axios.instance.put(`/alerting/edit/${id}`, payload);
        commit('setIsLoading', false)
        dispatch('HOMEPAGE/showSuccessToast', 'Alert has been succesfully updated', { root: true })
        return response.data
      } catch (e) {
        let errorMessage = 'A problem encountered while updating the alert'
        dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
        commit('setIsLoading', false)
        return e.response
      }
    },
    deleteAlert: async ({ commit, dispatch }, id) => {
      try {
        commit('setIsLoading', true)
        let response = await axios.instance.delete(`/alerting/delete/${id}`);
        commit('setIsLoading', false)
        dispatch('fetchAlerts')
        dispatch('HOMEPAGE/showSuccessToast', 'Alert has been succesfully deleted', { root: true })
        return response.data
      } catch (e) {
        let errorMessage = 'A problem encountered while deleting the alert'
        dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
        commit('setIsLoading', false)
        return e.response
      }
    }
  }
}
export default store