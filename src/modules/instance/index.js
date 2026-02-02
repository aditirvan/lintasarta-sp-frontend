import instance from './instance'
import autoscaling from './autoscaling'
import autoscalingdetail from './autoscalingdetail'
import asdusage from './asd/asdusage'
import asdinstance from './asd/asdinstance'
import asdloadbalancer from './asd/asdloadbalancer'
import asdalarm from './asd/asdalarm'
import createautoscaling from './createautoscaling'
import createinstance from './createinstance'
import createinstanceNew from './createinstance-new.vue'
import main from './main'
import instancedetail from './instancedetail.vue'
import usage from './instance_detail/usage'
import agent from '@/modules/instance/instance_detail/agent'
import power from './instance_detail/power'
import backups from './instance_detail/backups'
import snapshots from './instance_detail/snapshots'
import deletes from './instance_detail/delete'
import tags from './instance_detail/tags'
import recovery from './instance_detail/recovery'
import networking from './instance_detail/networking'
import resize from './instance_detail/resize'
import storage from '@/modules/storage/storage'
import INSTANCE from './namespace'
import store from './store'
import { SERVERGROUP } from './servergroup/namespace'
import storeServerGroup from './servergroup/storeServerGroup'
import { INSTANCEDETAIL } from './instance_detail/namespace'
import instancedetailstore from './instance_detail/store'
import beforeenterpermission from '../../lib/beforeenterpermission'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'
import beforeselectfirst from '../../lib/beforeselectfirst'
import checkopenstack from "@/lib/checkopenstack";
import servergroup from './servergroup/servergroup'

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [INSTANCEDETAIL]: instancedetailstore })
    Vue.addModules({ [INSTANCE]: store })
    Vue.addModules({ [SERVERGROUP]: storeServerGroup })
    Vue.addRoutetoDashboard({
      path: 'instance',
      component: main,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, 'Instance', 'disable', false)()
        .then(()=>{
          return beforeselectfirst(Vue)()
        })
        .then(() => {
          return checkopenstack(Vue)();
        })
        .then(()=>{
          next()
        }).catch(()=>{
          if(from.path == '/'){
            next('/')
          }
        })
      },
      meta: {
        permission: ['instance-view'],
        breadcrumb: {
          text: 'Instance',
          to: '/instance',
        },
      },
      children: [
        { path: '', component: instance },
        {
          path: '/instance/auto-scaling',
          component: main,
          meta: {
            breadcrumb: {
              text: 'Auto Scaling',
              to: '/instance/auto-scaling',
            },
          },
          children: [
            { path: '', component: autoscaling },
            {
              path: "create",
              component: createautoscaling,
            },
            {
              path: ':id',
              component: autoscalingdetail,
              children: [{
                path: '', redirect: 'usage'
              }, {
                path: 'usage', component: asdusage
              }, {
                path: 'instance', component: asdinstance
              }, {
                path: 'load-balancer', component: asdloadbalancer
              }, {
                path: 'alarm', component: asdalarm
              },]
            },
          ],
          
        },
        {
          path: 'create', component: createinstanceNew,
          beforeEnter: (to, from, next) => {
            handlepermissionprivilages(Vue, next, 'Instance', 'editor', true)().then(()=>{
              next()
            }).catch(()=>{
              if(from.path == '/'){
                next('/')
              }
            })
          },
          meta: {
            breadcrumb: {
              text: 'Create Instance',
              to: '/instance/create',
            },
          },
        },
        {
          path: 'servergroup', component: servergroup,          
          meta: {
            breadcrumb: {
              text: 'Server Group',
              to: '/instance/servergroup',
            },
          },
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
            path: '', redirect: 'usage'
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
            path: 'snapshots', component: snapshots,
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
    })
    VueEvent.listen('after-store-created', (store) => {
      store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
          header: 'DEKA FLEXI', headerno: 1,
          name: 'Instance', link: 'instance', icon: 'instanceIcon', sort: 1, permission: ['instance-sidemenu']
        }
      )
      store.commit('ROLEPERMISSION/addpermissions', 'instance-view')
    })
  }
}