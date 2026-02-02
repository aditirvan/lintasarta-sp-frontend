import page from './page.vue'
import orgVdc from './organizations-vdc.vue'
import { ORGVDC } from './namespace'
import store from './store'
import createOrgVdc from './create-orgVdc.vue'
import detail from './detail.vue'

export default{
  install(Vue, { VueEvent }){
    Vue.addModules({ [ORGVDC]: store});
    Vue.addRoutetoDashboard({
      path: 'manage-orgvdc',
      component: page,
      meta:{
          breadcrumb: {
              text: 'Organizations VDC',
              to: '/manage-orgvdc',
          },
      },
      children:[
          {
              path: '',
              component: orgVdc,
              // name: ''
          },
          {
            path: 'create',
            component: createOrgVdc,
            meta: {
                breadcrumb: {
                  to: '/manage-orgvdc/create',
                  text: 'Create Organization VDC'
                }
              }
          },
          {
            path: ':project_name',
            component: detail,
            meta: {
              breadcrumb: {
                to: '/manage-orgvdc/:project_name',
                text: ':project_name'
              }
            }
          }
      ]
  })
  }
}