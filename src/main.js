import Vue from 'vue'
import App from './App.vue'
import App2 from './App2.vue'
import VueGtag from "vue-gtag";
import vuetify from './plugins/vuetify';
import lodash from './plugins/lodash';
import moment from './plugins/moment';
import worker from './plugins/worker';
import VCalendar from 'v-calendar';
import VueCompositionAPI from '@vue/composition-api'
import VueRouter from 'vue-router'

import Pages from './pages/index'
import Modules from './modules/index'

import Vuex from 'vuex'
import Emitter from './lib/emitter'

import './theme/default.css'
import Vuelidate from 'vuelidate'
import formatter from './plugins/formatter'
import { AccessControl } from './lib/middleware'
import vueTopprogress from 'vue-top-progress'
import { VueMaskDirective } from 'v-mask'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import jwt_decode from "jwt-decode";
import VueNativeSock from 'vue-native-websocket'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import vSelect from "vue-select";
import VueMarkdown from "vue-markdown";
import Editor from "v-markdown-editor";
import "v-markdown-editor/dist/v-markdown-editor.css";
import DatetimePicker from 'vuetify-datetime-picker'

Vue.directive('mask', VueMaskDirective);
Vue.use(vueTopprogress)
var VueEvent = new Emitter();
Vue.prototype.$VueEvent = VueEvent
Vue.use(moment)
Vue.use(lodash)
Vue.use(formatter)
Vue.use(worker)
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueCompositionAPI)
Vue.use(Vuelidate)
Vue.use(VCalendar, { componentPrefix: 'vc' })
Vue.component('beat-loader', BeatLoader)
Vue.use(Modules, { VueEvent })
Vue.use(Pages)
Vue.use(VueNativeSock, `${process.env.VUE_APP_WS_BASE_URL}`, {
  connectManually: true,
  reconnection: true,
  reconnectionAttempts: 30,
  reconnectionDelay: 500,
})
Vue.component("v-select2", vSelect);
Vue.component("VueMarkdown", VueMarkdown);
Vue.use(Editor);
Vue.use(DatetimePicker)

Vue.config.productionTip = false
Vue.store = new Vuex.Store({
  state: {
    topbarloading: null
  },
  mutations: {
    settopbarloading: (state, payload) => state.topbarloading = payload
  },
  modules: Vue.modules
})

VueEvent.emit('before-router-created')

const router = new VueRouter({
  mode: 'history',
  routes: Vue.routes
})

const access_control = new AccessControl(Vue.store)
router.beforeEach((to, from, next)=>{
  return access_control.allow_to_route(to, from, next)
})

Vue.router = router

const GA_ID = process.env.VUE_APP_GOOGLE_ANALYTICS_ID
if (GA_ID) {
  // Google Analytics
  Vue.use(VueGtag, {
    config: { id: GA_ID },
    // router
  });
}

VueEvent.emit('after-router-created', Vue.router)

new Vue({
  store: Vue.store,
  vuetify,
  render: h => h(App2)
}).$mount('#app2')
VueEvent.emit('after-store-created', Vue.store);
VueEvent.listen('on-check-login', () => {

  Vue.prototype.$worker.postMessage({ type: "setbaseUrl", data: process.env.VUE_APP_API_BASE_URL })
  let token = localStorage.getItem('token')
  let type = localStorage.getItem('type')
  // TODO - check if token or login still valid
  if (token) {
    const datajwt = jwt_decode(token)
    // jika token sudah expired
    if (new Date(datajwt.exp * 1000).getTime() < new Date().getTime()) {
      // localStorage.clear()
      // token = null
    }
  }
  const role = localStorage.getItem('role')
  const need_create_organization = localStorage.getItem('need_create_organization')
  if (need_create_organization) {
    Vue.router.push('/create-organization')
  }
  const need_create_project = localStorage.getItem('need_create_project')
  if (need_create_project && role !== 'Superadmin') {
    Vue.router.push('/create-new-project')
  }
  if (token && role) {
    Vue.prototype.$worker.postMessage({ type: "setusertoken", data: token })
    const privilages = JSON.parse(localStorage.getItem('privilages'))
    VueEvent.emit('after-check-login', {
      type,
      token,
      role,
      privilages,
      need_create_organization,
      need_create_project
    })
  } else {
    VueEvent.emit('after-check-login', {})
  }
})

VueEvent.emit('on-check-login')
VueEvent.listen('after-user-permission-fetch', () => {
  new Vue({
    router: Vue.router,
    store: Vue.store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
})