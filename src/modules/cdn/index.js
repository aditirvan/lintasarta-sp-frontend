import page from './page'
import createssl from './createcdn'
import cdndetail from './cdndetail.vue'
import empty from './empty'
import ssl from './cdn'
import store from './store'
import { CDN } from './namespace'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [CDN]: store })
    Vue.addRoutetoDashboard({
      path: 'cdn',
      component: page,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, 'CDN', 'disable', false)().then(() => {
          return beforeselectfirst(Vue)()
        }).then(() => {
          next()
        }).catch(() => {
          if (from.path == '/') {
            next('/')
          }
        })
      },
      meta: {
        breadcrumb: {
          to: '/cdn',
          text: 'CDN'
        },
      },
      children: [
        { path: '/', component: ssl },
        {
          beforeEnter: (to, from, next) => {
            handlepermissionprivilages(Vue, next, 'CDN', 'editor', true)().then(() => {
              next()
            }).catch(() => {
              if (from.path == '/') {
                next('/')
              }
            })
          },
          path: 'create', component: createssl, meta: {
            breadcrumb: {
              text: 'Create CDN',
              to: '/cdn/create',
            },

          }
        },
        {
          path: ':id',
          component: cdndetail,
          props(route) {
            return { id: route.params.id }
          },
          meta: {
            breadcrumb: {
              text: 'CDN Detail',
              to: '',
            },
          },
          children: [
            { path: '', redirect: 'overview' },
            { path: 'overview', component: empty },
            { path: 'editor', component: empty },
            { path: 'dashboard', component: empty },
          ]
        }
      ],
    })
    VueEvent.listen('after-store-created', (store) => {
      store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
          header: 'NETWORK', headerno: 4,
          name: 'Deka CDN', link: 'cdn', icon: 'cdnIcon', sort: 1, permission: ['cdn-sidemenu']
        }
      )
      store.commit('ROLEPERMISSION/addpermissions', ['cdn-view'])
    })
  }
}