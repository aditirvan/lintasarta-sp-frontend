import { ActionContext, Module } from 'vuex'
import axios from '@/lib/axios'
import moment from "moment/moment.js";
import axiosReal from "axios";

function makeHeaders() {
    const params = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${params}` },
    };
  }

interface State {
  cpumetrics: Array<any>,
  rammetrics: Array<any>,
  inputoutput: Array<any>,
  inputin: Array<any>,
  diskread: Array<any>,
  diskwrite: Array<any>,
  isThereMetricsAllPerproject: number,
  isLoadingSubscribe: boolean,
  isThereMetricsAllPerinstance: number,
  isLoadingDownload: boolean,
  textDownload: boolean,
  dekaAgentPrice: any,
}
const store:Module<State, any> = {
  namespaced: true,
  state:{
      cpumetrics:[],
      rammetrics:[],
      inputoutput:[],
      inputin:[],
      diskread:[],
      diskwrite:[],
      isThereMetricsAllPerproject: 0,
      isLoadingSubscribe: false,
      isThereMetricsAllPerinstance: 0,
      isLoadingDownload: false,
      textDownload: true,
      dekaAgentPrice: null,
  },
  mutations:{
      setisLoadingSubscribe: (state: State, payload: any) => {
        state.isLoadingSubscribe = payload
      },
      setisLoadingDownload: (state: State, payload: any) => {
        state.isLoadingDownload = payload
      },
      settextDownload: (state: State, payload: any) => {
        state.textDownload = payload
      },

      setcpu: (state: State, payload: any) => {state.cpumetrics = payload},
      setram: (state: State, payload: any) => state.rammetrics = payload,

      setinputoutput: (state: State, payload: any) => state.inputoutput = payload,
      setinputin: (state: State, payload: any) => state.inputin = payload,

      setdiskread: (state: State, payload: any) => state.diskread = payload,
      setdiskwrite: (state: State, payload: any) => state.diskwrite = payload,

      setisThereMetricsAllPerproject: (state: State, payload: any) => {state.isThereMetricsAllPerproject = payload},
      setisThereMetricsAllPerinstance: (state: State, payload: any) => {state.isThereMetricsAllPerinstance = payload},

      setdekaAgentPrice: (state: State, payload: any) => {state.dekaAgentPrice = payload},

  },
  actions:{
      getinstancemetricssocket:async(context:ActionContext<State,any>, payload: any)=>{
          if(payload.status == 'stop'){
              axios.instance.get(`metric/all/${payload.id}`,{params:{start: payload.range.start, stop: payload.range.end}}).then((response)=>{
                  const data = response.data.data;
                  context.commit('setcpu', data[0]);
                  context.commit('setram', data[1]);
                  context.commit('setinputoutput', data[2]);
                  context.commit('setinputin', data[3]);
                  context.commit('setdiskread', data[4]);
                  context.commit('setdiskwrite', data[5]);
              })
          }
          const ws = new WebSocket(`${process.env.VUE_APP_WS_BASE_URL_METRIC}/${payload.type}/${payload.id}`);
          if(payload.type=='cpu'){
              ws.onmessage = (res) => {
                  if (window.location.pathname !== payload.path || payload.range) {
                      ws.send('Connection Closed')
                  } else {
                      const cpu = JSON.parse(res.data);
                      context.commit('setcpu', cpu)
                  }
              }
              ws.onopen = () => {
                  console.log('Metric CPU Connected.')
              }
              ws.onclose = () => {
                  console.log('Metric CPU Disconnected.')
              }
          }

          if(payload.type=='ram'){
              ws.onmessage = (res) => {
                  if (window.location.pathname !== payload.path || payload.range) {
                      ws.send('Connection Closed')
                  } else {
                      const ram = JSON.parse(res.data);
                      context.commit('setram', ram)
                  }
              }
              ws.onopen = () => {
                  console.log('Metric Ram Connected.')
              }
              ws.onclose = () => {
                  console.log('Metric Ram Disconnected.')
              }
          }

          if(payload.type=='network-out'){
              ws.onmessage = (res) => {
                  if (window.location.pathname !== payload.path || payload.range) {
                      ws.send('Connection Closed')
                  } else {
                      const data = JSON.parse(res.data);
                      context.commit('setinputoutput', data)
                  }
              }
              ws.onopen = () => {
                  console.log('Metric Network out Connected.')
              }
              ws.onclose = () => {
                  console.log('Metric Network out Disconnected.')
              }
          }

          if(payload.type=='network-in'){
              ws.onmessage = (res) => {
                  if (window.location.pathname !== payload.path || payload.range) {
                      ws.send('Connection Closed')
                  } else {
                      const data = JSON.parse(res.data);
                      context.commit('setinputin', data)
                  }
              }
              ws.onopen = () => {
                  console.log('Metric Network in Connected.')
              }
              ws.onclose = () => {
                  console.log('Metric Network in Disconnected.')
              }
          }

          if(payload.type=='disk-read'){
              ws.onmessage = (res) => {
                  if (window.location.pathname !== payload.path || payload.range) {
                      ws.send('Connection Closed')
                  } else {
                      const data = JSON.parse(res.data);
                      context.commit('setdiskread', data)
                  }
              }
              ws.onopen = () => {
                  console.log('Metric Disk Read Connected.')
              }
              ws.onclose = () => {
                  console.log('Metric Disk Read Disconnected.')
              }
          }

          if(payload.type=='disk-write'){
              ws.onmessage = (res) => {
                  if (window.location.pathname !== payload.path || payload.range) {
                      ws.send('Connection Closed')
                  } else {
                      const data = JSON.parse(res.data);
                      context.commit('setdiskwrite', data)
                  }
              }
              ws.onopen = () => {
                  console.log('Metric Disk Write Connected.')
              }
              ws.onclose = () => {
                  console.log('Metric Disk Write Disconnected.')
              }
          }
      },
      getmetricall: async (context: ActionContext<State, any>, payload: any) => {
        await axios.instance.get(`metric/all/api/${payload.id}`, { params:{start: payload.range.start, stop: payload.range.end } }).then((response) => {
            const data = response.data.data;
            context.commit('setcpu', data[0][0].values);
            context.commit('setram', data[1][0].values);
            context.commit('setinputoutput', data[2][0].values);
            context.commit('setinputin', data[3][0].values);
        }).catch((e)=>{
            // console.log(e)
            context.commit('setcpu', []);
            context.commit('setram', []);
            context.commit('setinputoutput', []);
            context.commit('setinputin', []);
        })
      },
      getmetricDekaAgentall: async (context: ActionContext<State, any>, payload: any) => {
        await axios.instance.get(`metric/deka-agent/all/api/${payload.id}`, { params:{start: payload.range.value.start, stop: payload.range.value.end } }).then((response) => {
            const data = response.data.data;
            context.commit('setisThereMetricsAllPerinstance', data);

            
        }).catch((e)=>{
            // console.log(e)
            context.commit('setisThereMetricsAllPerinstance', 0);
        })
      },
      getmetricDekaAgentPerProjectall: async (context: ActionContext<State, any>, payload: any) => {
        await axios.instance.get(`metric/deka-agent/all/perproject/api/${payload.id}`, { params:{start: payload.range.value.start, stop: payload.range.value.end } }).then((response) => {
            const data = response.data.data;
            context.commit('setisThereMetricsAllPerproject', data);
            
        }).catch((e)=>{
            // console.log(e)
            context.commit('setisThereMetricsAllPerproject', 0);
        })
      },
      subscribeDekaAgent: async ({ commit, dispatch }, payload) => {
        commit('setisLoadingSubscribe', true)
        try {
            await axios.instance.post(`dekaagent/subscribe`, payload)
            dispatch('HOMEPAGE/showSuccessToast', 'Deka Agent has been succesfully subscribed', { root: true })
            commit('setisLoadingSubscribe', false)
        } catch (error) {
            const errorMessage = 'A problem encountered while subscribing deka agent'
            dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
            commit('setisLoadingSubscribe', false)
            dispatch('HOMEPAGE/showErrorToast', "Failed to Subscribe Deka Agent, Please try again", { root: true })
        }
      },
      unsubscribeDekaAgent: async ({ commit, dispatch }, payload) => {
          commit('setisLoadingSubscribe', true)
          try {
              await axios.instance.post(`dekaagent/unsubscribe`, payload)
              dispatch('HOMEPAGE/showSuccessToast', 'Deka Agent has been succesfully unsubscribed', { root: true })
              commit('setisLoadingSubscribe', false)
          } catch (error) {
              const errorMessage = 'A problem encountered while unsubscribing deka agent'
              dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
              commit('setisLoadingSubscribe', false)
              dispatch('HOMEPAGE/showErrorToast', "Failed to Unsubscribe Deka Agent, Please try again", { root: true })
          }
      },
      downloadPdfMetric: async ({ commit, dispatch}, payload) => {
        commit('setisLoadingDownload', true)
        commit('settextDownload', false)
        try {
            const response = await axios.instance.post(`dekaagent/export-pdf/instance/`+payload.id, payload, {
                responseType: 'blob',
                // responseType: 'stream',
                // responseType: 'arraybuffer',
                // headers: {
                //     'Content-Type': 'application/json',
                //   },
            })

            const blob = new Blob([response.data], { type: 'application/pdf' });

            const startformattedDate = moment(payload.start_time, 'x').format('YYYY-MM-DD');
            const endformattedDate = moment(payload.end_time, 'x').format('YYYY-MM-DD');
            // saveAs(blob, 'Deka Agent Metrics from ' + startformattedDate + ' to ' + endformattedDate + '.pdf');

            const url = window.URL.createObjectURL(response.data);

            // Membuat link untuk mengunduh file
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Deka Agent Metrics from ' + startformattedDate + ' to ' + endformattedDate + '.pdf');
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

            // const url = URL.createObjectURL(blob);

            // window.open(url, '_blank');
            
            commit('setisLoadingDownload', false)
            commit('settextDownload', true)
        } catch (error) {
            dispatch('HOMEPAGE/showErrorToast', 'A problem encountered while downloading pdf', { root: true })
            commit('setisLoadingDownload', false)
            commit('settextDownload', true)
        }
      },
      getDefaultDekaAgent: async ({ commit, dispatch}, payload) => {
        try {
            const response = await axiosReal.get(`${process.env.VUE_APP_API_BASE_URL_BILLING}/flavor/deka-agent/default`, makeHeaders());
            commit("setdekaAgentPrice", response.data.data);
          } catch (error) {
            dispatch("HOMEPAGE/showErrorToast", `${error.response.data.message}`, { root: true });
          }
      }
  }
}

export default store