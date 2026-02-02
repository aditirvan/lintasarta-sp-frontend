import {iVue} from '../type'
import RolePermission from '../organization/rolepermission.vue'
import ManagePermission from '../organization/managepermission.vue'
import CreateRole from '../organization/createrole.vue'
import beforeenterpermission from '@/lib/beforeenterpermission'



export default {
    install(Vue : iVue) {
        Vue.addRoutetoDashboard({
            path: 'role-permission',
            component: RolePermission,
            beforeEnter: (to, from, next) => {
              beforeenterpermission(Vue, next, 'Manage Role', 'disable', false)().then(()=>{
                next()
              }).catch(()=>{
                if(from.path == '/'){
                  next('/')
                }
              })
            },
            meta: {
              permission: ['rolepermission-view'],
              breadcrumb: {
                text: 'Manage Role',
                to: '/role-permission',
              },
            },
            children: [
              {
                path: '', component: ManagePermission,
                meta: {
                  permission: ['rolepermission-view'],
                }
              },
              {
                beforeEnter: (to, from, next) => {
                  beforeenterpermission(Vue, next, 'Manage Role', 'editor', true)().then(()=>{
                    next()
                }).catch(()=>{
                  if(from.path == '/'){
                    next('/')
                  }
                })

                },
                path: 'createrole', component: CreateRole,
                meta: {
                  permission: ['rolepermission-view'],
                  breadcrumb: {
                    text: 'Create Role',
                    to: '/role-permission/createrole',
                  },
                }
              },
              {
                beforeEnter: (to, from, next) => {
                  beforeenterpermission(Vue, next, 'Manage Role', 'editor', true)().then(()=>{
                    next()
                }).catch(()=>{
                  if(from.path == '/'){
                    next('/')
                  }
                })
                },
                path: 'editrole',
                name: 'editrole',
                component: CreateRole,
                meta: {
                  breadcrumb: {
                    text: 'Edit Role',
                    to: '/role-permission/editrole',
                  },
                }
              }
            ]
          })
    }
}