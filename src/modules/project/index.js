import project from './project'
import custommenu from './custommenu'
import listproject from './listproject'
import page from './page'
import setting from './setting'
import projectmenuuser from './projectmenuuser'
import main from '@/modules/instance/main'
import instancedetail from '@/modules/instance/instancedetail.vue'
import usage from '@/modules/instance/instance_detail/usage'
import agent from '@/modules/instance/instance_detail/agent'
import power from '@/modules/instance/instance_detail/power'
import backups from '@/modules/instance/instance_detail/backups'
import snapshots from '@/modules/instance/instance_detail/snapshots'
import deletes from '@/modules/instance/instance_detail/delete'
import tags from '@/modules/instance/instance_detail/tags'
import recovery from '@/modules/instance/instance_detail/recovery'
import networking from '@/modules/instance/instance_detail/networking'
import resize from '@/modules/instance/instance_detail/resize'
import storage from '@/modules/storage/storage'
import store from './store'
import beforeenterpermission from '../../lib/beforeenterpermission'

export default {
  install(Vue, { VueEvent }) {
    Vue.component('PROJECT-custommenu', custommenu);
    Vue.component('PROJECT-projectmenuuser', projectmenuuser)

    Vue.addModules({ PROJECT: store }),

      Vue.addRoutetoDashboard(
        {
          beforeEnter: (to, from, next) => {
            beforeenterpermission(Vue, next, 'Project', 'disable', false)().then(() => {
              next()
            }).catch(()=>{
              if(from.path == '/'){
                next('/')
              }
            })
          },
          path: 'project',
          component: page,
          meta: {
            breadcrumb: {
              text: 'Project',
              to: '/project',
            }
          },
          children: [
            {
              path: '',
              component: listproject,
            },

            {
              path: '/project/:project/:id',
              component: main,
              meta: {
                breadcrumb: {
                  text: ':project',
                  to: '/project/:project/:id',
                }
              },
              children: [
                {
                  path: '',
                  component: project
                },
                {
                  beforeEnter: (to, from, next) => {
                    beforeenterpermission(Vue, next, 'Project', 'editor', true)().then(()=>{
                      next()
                  }).catch(()=>{
                    if(from.path == '/'){
                      next('/')
                    }
                  })
                  },
                  path: 'setting',
                  component: setting,
                  meta: {
                    breadcrumb: {
                      text: 'Setting Project',
                      to: ''
                    }
                  },
                  props: {
                    project: {}
                  }
                },
                {
                  path: ':instanceid', component: instancedetail,
                  meta: {
                    breadcrumb: {
                      text: 'Instance Detail',
                      to: ''
                    },
                  },
                  children: [{
                    // path: '', redirect: 'usage'
                    path: '', redirect: 'agent'
                  }, {
                    path: 'usage', component: usage
                  }, {
                    path: 'power', component: power
                  }, {
                    path: 'agent', component: agent
                  }, {
                    path: 'storage', component: storage
                  }, {
                    path: 'backups', component: backups
                  }, {
                    path: 'snapshots', component: snapshots
                  }, {
                    path: 'delete', component: deletes
                  }, {
                    path: 'tags', component: tags
                  }, {
                    path: 'recovery', component: recovery
                  }, {
                    path: 'networking', component: networking
                  }, {
                    path: 'resize', component: resize
                  }
                  ]
                }
              ]

            },

          ]
        }
      ),

      VueEvent.listen('after-store-created', (store) => {
        store.commit('DASHBOARD/addCustomMenu', 'PROJECT-custommenu')
        store.commit('ROLEPERMISSION/addcustommenu',
          {
            component: 'PROJECT-custommenu',
            permission: ['project-view']
          }
        )
        store.commit('ROLEPERMISSION/addLeftNavMenu',
          {
            component: 'PROJECT-projectmenuuser',
            permission: ['project-view']
          }
        )
      })
  }
}