import { iVue } from '../type'
import configematerai from './config-e-materai.vue'
import main from './main.vue'
import { EMATERAI } from './namespace'
import store from './store'

export default {
  install(Vue: iVue) {
    Vue.addModules({[EMATERAI]: store})
    Vue.addRoutetoDashboard({
      path: 'config-e-materai',
      component: main,
      meta: {
        breadcrumb: {
          to: '/config-e-materai',
          text: 'Config E-Materai',
        },
      },
      children: [
        {
          path: '/',
          component: configematerai,
          name: 'superadmin-config-e-materai',
        }
      ],
    })
  }
}