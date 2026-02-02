import jwt_decode from "jwt-decode";
import axios from '../../lib/axios'
import localstorage from '../../lib/localstorage'
import lodash from 'lodash'
import { worker } from '../../lib/worker'
import externalSubDomain from '../../lib/externalSubDomain'
import Vue from 'vue'

// const isDevModeIPProtection = process.env.VUE_APP_DEV_MODE === "fase-1.3";
const isDevModeIPProtection = true;

const store = {
  namespaced: true,
  state: {
    email: undefined,
    password: undefined,
    landingpages: ['homepage-landingpage'],
    appBarButton: ['homepage-loginbutton'],
    loginorsignup: 'login',
    superAdminWebsocket: null,
    visibilityloginorsignup: true,
    toast: false,
    toastmessage: 'error',
    toastMode: 'error',
    toastWS: false,
    toastWSMessage: 'error',
    superadmin_privileges: {},
    toastWSMode: 'error',
    privilages: [
      {
        "name": "Instance",
        "editor": false,
        "viewer": true
      },
      {
        "name": "Storage",
        "editor": false,
        "viewer": true
      },
      {
        "name": "Object Storage",
        "editor": false,
        "viewer": true
      },
      {
        "name": "Images",
        "editor": false,
        "viewer": true
      },
      {
        "name": "Security",
        "editor": false,
        "viewer": true
      },
      {
        "name": "Alerting",
        "editor": false,
        "viewer": true
      },
      {
        "name": "Billing",
        "editor": false,
        "viewer": true
      },
      {
        "name": "Organization",
        "editor": false,
        "viewer": true
      },
      {
        "name": "Ticket",
        "editor": false,
        "viewer": true
      },
      {
        "name": "Docs",
        "editor": false,
        "viewer": true
      }
    ],
  },
  getters: {
    landingpages: state => state.landingpages,
    appBarButton: state => state.appBarButton,
    loginorsignup: state => state.loginorsignup,
    visibilityloginorsignup: state => state.visibilityloginorsignup,
    privilagesGroup: state => lodash.groupBy(state.privilages, 'name')
  },
  mutations: {
    setSuperAdminWebsocket: (state, payload) => {
      state.superAdminWebsocket = payload
    },
    setvisibilityloginorsignup(state, payload) {
      state.visibilityloginorsignup = payload
    },
    setloginorsignup(state, payload) {
      state.visibilityloginorsignup = true
      state.loginorsignup = payload
    },
    addAppBarButton(state, payload) {
      state.appBarButton.push(payload)
    },
    setToast(state, payload) {
      state.toast = payload
    },
    setToastmessage(state, payload) {
      state.toastmessage = payload
    },
    setToastMode(state, payload) {
      if (payload == 'success') state.toastMode = 'green'
      else if (payload == 'error') state.toastMode = 'red'
      else if (payload == 'info') state.toastMode = 'cyan'
      else state.toastMode = 'black'
    },
    setToastWS(state, payload) {
      state.toastWS = payload
    },
    setToastWSMessage(state, payload) {
      state.toastWSMessage = payload
    },
    setToastWSMode(state, payload) {
      state.toastWSMode = payload
    },
    setprivilages: (state, payload) => {
      const groupbyname = lodash.groupBy(payload, 'name')
      const obj = {}
      for (const key in groupbyname) {
        obj[key] = groupbyname[key][0]
      }
      return state.privilages = obj
    },
    setSuperadminPrevileges: (state, payload) => {
        
    }
  },
  actions: {
    login: async (context, { email, password, captcha }) => {
      localstorage.setItem('timestamp', new Date())
      context.state.email = email
      context.state.password = password
      context.state.captcha = captcha;

      context.commit('PROJECT/setprojectname', '', { root: true })
      const cid = localstorage.getItem("cid");

      const externalSubdomain = externalSubDomain.getSubDomain();
      const external_subdomain = externalSubdomain
      const payload = isDevModeIPProtection && cid ? { email, password, captcha, cid, external_subdomain } : { email, password, captcha, external_subdomain }

      return axios.instance.post('user/login', isDevModeIPProtection ? payload : { email, password, external_subdomain }).then(e => {
        const { token, type, role, organization_role_id, need_create_project, is_creator, service_type, superadmin_privileges } = e.data.data
        worker.postMessage({type:"setusertoken", data: token})
        localstorage.setItem('is_creator', is_creator)
        localstorage.setItem('token', token)
        localstorage.setItem('username', email)
        localstorage.setItem('role', role)
        localstorage.setItem('type', type)
        localstorage.setItem("service_type", service_type);

        if (superadmin_privileges){
          localstorage.setItem('superadmin_privileges', JSON.stringify(superadmin_privileges))
          context.commit("ROLEPERMISSION/setAdminaPrivilleges", superadmin_privileges.privileges, { root: true })
        }

        const jwtDecoded = jwt_decode(token)

        if (jwtDecoded.cid) {
          localstorage.setItem('cid', jwtDecoded.cid)
        }

        //location.reload();

        if (need_create_project) {
          localstorage.setItem('need_create_project', true)
        }

        if (organization_role_id && organization_role_id.privilages) {
          localstorage.setItem('privilages', JSON.stringify(organization_role_id.privilages))
          const privilages = organization_role_id.privilages
          e.data.data.privilages = privilages
        }
        return e.data.data

        // axios.setToken(data.token)
      }).catch((e) => {
        if (e.response) throw e.response.data
        context.dispatch('showErrorToast', e.message)
        return Promise.reject(e)
      })
    },
    relogin: async (context) => {
      localstorage.setItem('timestamp', new Date())
      context.commit('PROJECT/setprojectname', '', { root: true })
      const { email, password, captcha } = context.state
      const cid = localstorage.getItem("cid");
      const externalSubdomain = externalSubDomain.getSubDomain();
      const external_subdomain = externalSubdomain

      const payload = isDevModeIPProtection && cid ? { email, password, captcha, cid, external_subdomain } : { email, password, captcha, external_subdomain }
      const endpoint = isDevModeIPProtection ? 'user/re-login' : "user/login"

      return axios.instance.post(endpoint,
        isDevModeIPProtection ? payload : {
          email: context.state.email,
          password: context.state.password,
          external_subdomain
        }).then(e => {
          const data = e.data.data
          worker.postMessage({ type: "setusertoken", data: data.token })
          localstorage.setItem('token', data.token)

          const jwtDecoded = jwt_decode(data.token)
          if (data.organization_role_id) {
            localstorage.setItem('privilages', JSON.stringify(data.organization_role_id.privilages))
          }

          if (jwtDecoded.cid) {
            localstorage.setItem('cid', jwtDecoded.cid)
          }

          return data
          // axios.setToken(data.token)
        }).catch((e) => {
          if (e.response) throw e.response.data
          context.dispatch('showErrorToast', e.message)
          return Promise.reject(e)
        })
    },
    showErrorToast: async (context, message) => {
      context.commit('setToastmessage', message)
      context.commit('setToastMode', 'error')
      context.commit('setToast', true)
    },
    showInfoToast: async (context, message) => {
      context.commit('setToastmessage', message)
      context.commit('setToastMode', 'info')
      context.commit('setToast', true)
    },
    showSuccessToast: async (context, message) => {
      context.commit('setToastmessage', message)
      context.commit('setToastMode', 'success')
      context.commit('setToast', true)
    },
    showErrorToastWS: async (context, message) => {
      context.commit('setToastWSMessage', message)
      context.commit('setToastWSMode', 'error')
      context.commit('setToastWS', true)
    },
    showSuccessToastWS: async (context, message) => {
      context.commit('setToastWSMessage', message)
      context.commit('setToastWSMode', 'success')
      context.commit('setToastWS', true)
    },
    showProcessToastWS: async (context, message) => {
      context.commit('setToastWSMessage', message)
      context.commit('setToastWSMode', 'process')
      context.commit('setToastWS', true)
    },
    forgotpassword: async (context, email) => {
      const externalSubdomain = externalSubDomain.getSubDomain();
      const host = window.location.host;
      const external_subdomain = externalSubdomain
      return await axios.instance.post('/user/forgot/password', { email, external_subdomain, host })
    },
    logout: async (context, payload) => {
      if (!context.rootState.ROLEPERMISSION.user.token) {
        return Promise.resolve()
      }
      context.commit("PROJECT/setprojects", [], { root: true })
      context.commit("ROLEPERMISSION/setuser", {}, { root: true })
      context.commit("ROLEPERMISSION/setAdminaPrivilleges", {}, { root: true })

      // Disconnects Websocket connections
      const role = localStorage.getItem('role');
      if (role == 'Superadmin') {
        context.state.superAdminWebsocket.close() // superadmin 
      }

      //context.state.superAdminWebsocket.close() // superadmin 
      Vue.prototype.$disconnect() // project

      const cid = localstorage.getItem('cid')

      localstorage.clear()

      if (cid) {
        localstorage.setItem('cid', cid)
      }

      context.commit('setToastWS', false)

      if (Vue.router.history.current.path != "/") {
        Vue.router.replace("/");
        Vue.router.go(0);
      }
      if (payload === 'Your session is expired due to inactivity.'){
        context.dispatch('showSuccessToast', payload)
        worker.postMessage({ type: "clearInterval", data: '' })
      }
    },
    validateprivilages: async (context, payload) => {
      const role = localStorage.getItem('role')
      if (role == 'Superadmin') {
        return Promise.resolve(true)
      }
      if (context.state.privilages[payload[0]] && context.state.privilages[payload[0]][payload[1]]) {
        return Promise.resolve(true)
      } else {
        if (context.state.privilages[payload[0]].suspend) {
          context.commit('DASHBOARD/setopendialogdonthavepermission', 'suspend', { root: true })
        } else {
          context.commit('DASHBOARD/setopendialogdonthavepermission', true, { root: true })
        }

        // context.commit('DASHBOARD/setopendialogdonthavepermission', true, { root: true })
        return Promise.reject(false)
      }
    },
    validateprivilagesync: (context, payload) => {
      const role = localStorage.getItem('role')
      if (role == 'Owner' || role == 'Superadmin') {
        return true
      }
      if (context.state.privilages[payload[0]] && context.state.privilages[payload[0]][payload[1]]) {
        return true
      } else {
        return false
      }
    },

    validateprivilagesyncnew: (context, payload) => {
      // if (context.state.privilages[payload[0]].suspend) {
      //   context.commit('DASHBOARD/setopendialogdonthavepermission', 'suspend', { root: true })
      // }

      const role = localStorage.getItem('role')

      if (role == 'Superadmin') {
        return false
      }

      if (context.state.privilages[payload[0]][payload[1]] == false) {
        return true
      } else {
        return false
      }
    },

    openDialogDontHavePermition: (context, payload) => {
      context.commit('DASHBOARD/setopendialogdonthavepermission', true, { root: true })
      if (!payload){
        return
      }

      if (context.state.privilages[payload[0]].suspend) {
        context.commit('DASHBOARD/setopendialogdonthavepermission', 'suspend', { root: true })
      } else {
        context.commit('DASHBOARD/setopendialogdonthavepermission', true, { root: true })
      }
    },

    resetpassword: async (context, payload) => {
      return axios.instance.post('/user/reset-password', payload)
    }
  }
}

export default store