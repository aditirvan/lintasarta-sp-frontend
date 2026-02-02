import page from './page'
import createssl from './createssl'
import importSsl from './importSsl'
import ssldetail from './ssldetail'
import empty from './empty'
import ssl from './ssl'
import store from './store'
import { SSL } from './namespace'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [SSL]: store })
    Vue.addRoutetoDashboard({
      path: 'ssl',
      component: page,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, 'SSL', 'disable', false)().then(() => {
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
          to: '/ssl',
          text: 'SSL'
        },
      },
      children: [
        { path: '/', component: ssl },
        {
          beforeEnter: (to, from, next) => {
            handlepermissionprivilages(Vue, next, 'SSL', 'editor', true)().then(() => {
              next()
            }).catch(() => {
              if (from.path == '/') {
                next('/')
              }
            })
          },
          path: 'create', component: createssl, meta: {
            breadcrumb: {
              text: 'Create SSL',
              to: '/ssl/create',
            },
          }
        },
        {
          beforeEnter: (to, from, next) => {
            handlepermissionprivilages(Vue, next, 'SSL', 'editor', true)().then(() => {
              next()
            }).catch(() => {
              if (from.path == '/') {
                next('/')
              }
            })
          },
          path: 'import', component: importSsl, meta: {
            breadcrumb: {
              text: 'Import SSL',
              to: '/ssl/import',
            },
          }
        },
        {
          path: ':id',
          component: ssldetail,
          props(route) {
            return { id: route.params.id }
          },
          meta: {
            breadcrumb: {
              text: 'SSL Detail',
              to: '',
            },
          },
          children: [
            { path: '', redirect: 'overview' },
            { path: 'overview', component: empty },
            { path: 'keys', component: empty },
          ]
        }
      ],
    })
    VueEvent.listen('after-store-created', (store) => {
      store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
          header: 'SECURITY', headerno: 6,
          name: 'Deka SSL', link: 'ssl', icon: 'sslIcon', sort: 1, permission: ['ssl-sidemenu']
        }
      )
      store.commit('ROLEPERMISSION/addpermissions', ['ssl-view'])
    })
  }
}