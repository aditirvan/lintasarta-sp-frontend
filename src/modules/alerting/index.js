import alerting from './alerting'
import page from './page'
import edit from './edit'
import { ALERTING } from './namespace'
import store from './store'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'

export default {
    install(Vue, { VueEvent }) {
        Vue.addModules({ [ALERTING]: store })
        Vue.addRoutetoDashboard({
            path: 'alerting',
            component: page,
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'Alerting', 'disable', false)().then(()=>{
                    return beforeselectfirst(Vue)()
                }).then(()=>{
                    next()
                }).catch(()=>{
                    if(from.path == '/'){
                      next('/')
                    }
                  })
            },
            meta: {
                permission: ['network-view'],
                breadcrumb: {
                    to: '/alerting',
                    text: 'Alerting'
                }

            },
            children: [
                {
                    path: '/',
                    component: alerting,
                },

                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Alerting', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'create',
                    name: 'create-alert',
                    component: edit,
                    meta: {
                        breadcrumb: {
                            to: '/alerting/create',
                            text: 'Create'
                        }
                    }
                },

                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Alerting', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'edit',
                    name: 'edit-alert',
                    component: edit,
                    meta: {
                        breadcrumb: {
                            to: '/alerting/edit',
                            text: 'Edit'
                        }
                    }
                }
            ]
        })

        VueEvent.listen('after-store-created', (store) => {
            store.commit('ROLEPERMISSION/addmenumodulepermission',
                {
                    header: 'MONITORING', headerno: 8,
                    name: 'Deka Alerting', link: 'alerting', icon: 'alertingIcon', sort: 1, permission: ['alerting-view']
                }
            )
            store.commit('ROLEPERMISSION/addpermissions', 'alerting-view')

            store.commit("ROLEPERMISSION/addmenumodulepermission", {
                header: "MONITORING",
                headerno: 8,
                name: "Deka Agent",
                link: "deka-agent",
                icon: "monitorIcon",
                sort: 2,
                permission: ["deka-agent-view"],
              });
        })
    },
}