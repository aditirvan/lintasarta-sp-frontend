import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import index from './index.vue'
import vuetify from '../../plugins/vuetify';
import moment from '../../plugins/moment';
import VueRouter from 'vue-router'
Vue.use(moment)
Vue.use(VueCompositionAPI)
Vue.use(VueRouter)
Vue.router = new VueRouter({
  mode: 'history',
  routes: Vue.routes
})

new Vue({
  router: Vue.router,
  vuetify,
  render: h => h(index)
}).$mount('#downloadtable')