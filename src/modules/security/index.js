import firewall from './firewall'
import security from './security'
import page from './page'
import internal from './internal'
import { SECURITY } from './namespace'
import store from './store'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'
import checkopenstack from "@/lib/checkopenstack";

export default {
    install(Vue, { VueEvent }) {
        Vue.addModules({ [SECURITY]: store })
        Vue.addRoutetoDashboard({
            path: 'security',
            component: page,
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'Security', 'disable', false)()
                .then(()=>{
                    return beforeselectfirst(Vue)()
                })
                .then(() => {
                  return checkopenstack(Vue)();
                })
                .then(()=>{
                    next()
                })
                .catch(()=>{
                    if(from.path == '/'){
                      next('/')
                    }
                  })
            },
            meta: {
                breadcrumb: {
                    to: '/security',
                    text: 'Security'
                },
            },
            children: [
                {
                    path: '/',
                    component: security,

                },

                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Security', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'create-firewall',
                    name: 'create-firewall',
                    component: firewall,
                    meta: {
                        breadcrumb: {
                            to: '/security/create-firewall',
                            text: 'Create Security'
                        }
                    }
                },
                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Security', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'edit-firewall/:id',
                    name: 'edit-firewall',
                    component: firewall,
                    meta: {
                        breadcrumb: {
                            to: '',
                            text: 'Edit Security'
                        }
                    }
                },
                {
                    path: ':id',
                    name: 'internal',
                    component: internal,
                    meta: {
                        breadcrumb: {
                            to: "",
                            text: 'Internal Firewall'
                        }
                    }
                }
            ]

        })

        VueEvent.listen('after-store-created', (store) => {
            store.commit('ROLEPERMISSION/addmenumodulepermission',
                {
                    header: 'DEKA FLEXI', headerno: 1,
                    name: 'Security', link: 'security', icon: 'securityIcon', sort: 5, permission: ['security-sidemenu']
                }
            )
            store.commit('ROLEPERMISSION/addpermissions', ['security-view'])
        })

    }
}