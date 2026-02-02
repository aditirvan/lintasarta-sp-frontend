import libProject from '@/lib/project'
import axios from '@/lib/axios'

const store = {
    namespaced: true,
    state: {
        isLoading: false,
        limitservices: {},
    },
    mutations: {
        setIsLoading: (state, payload) => (state.isLoading = payload),
        setServiceLimit: (state, payload) => (state.limitservices = payload),
    },
    actions: {
      getDekaAgentLimit: async (context, payload) => {
          context.commit("setIsLoading", true);
          return new Promise((resolve, reject) => {
            axios.instance
              .get(`/project/${payload}/service-limits/deka-agent`)
              .then((res) => {
                resolve(res);
                const data = res.data.data;
                context.commit("setServiceLimit", data);
                context.commit("setIsLoading", false);
              })
              .catch((err) => {
                reject(err);
                context.commit("setIsLoading", false);
              });
          });
        },
        updateDekaAgentLimit: async (context, payload) => {
          context.commit("setIsLoading", true);
          return new Promise((resolve, reject) => {
            axios.instance
              .put(`/project/${payload.id}/service-limits/deka-agent`, payload.data)
              .then((res) => {
                resolve(res);
                context.commit("setIsLoading", false);
              })
              .catch((err) => {
                context.commit("setIsLoading", false);
                reject(err);
              });
          });

        }
    }

}

export default store
