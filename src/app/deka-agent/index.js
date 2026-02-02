import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import index from './index.vue'
import vuetify from '../../plugins/vuetify';
import '../../theme/default.css'
import moment from '../../plugins/moment';
Vue.use(moment)
Vue.use(VueCompositionAPI)
new Vue({
    vuetify,
    render: h => h(index)
  }).$mount('#dekaagent')