import page from './page.vue'
import edgeGateway from './edge-gateway.vue'
import { EDGEGATEWAY } from './namespace'
import store from './store'
import createEdgeGateway from './create-edge-gateway.vue'
import detail from './detail.vue'

export default{
  install(Vue, { VueEvent }){
    Vue.addModules({ [EDGEGATEWAY]: store});
    Vue.addRoutetoDashboard({
      path: 'manage-edge',
      component: page,
      meta:{
          breadcrumb: {
              text: 'Edge Gateway',
              to: '/manage-edge',
          },
      },
      children:[
          {
              path: '',
              component: edgeGateway,
              // name: ''
          },
          {
            path: 'create',
            component: createEdgeGateway,
            meta: {
                breadcrumb: {
                  to: '/manage-edge/create',
                  text: 'Create Edge Gateway'
                }
              }
          },
          {
            path: ':project_name',
            component: detail,
            meta: {
                breadcrumb: {
                  to: '/manage-edge/:project_name',
                  text: ':project_name'
                }
              }
          },

      ]
  })
  }
}