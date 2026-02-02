import store from './store'
import page from './page'
import dns from './dns'
import record from './record'
import overview from './overview'
import { DNS } from './namespace'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'



export default {
    install(Vue, { VueEvent }) {
        Vue.addModules({ [DNS]: store });
        Vue.addRoutetoDashboard({
            path: 'dns',
            component: page,
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'DNS', 'disable', false)().then(() => {
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
                    to: '/dns',
                    text: 'Deka DNS'
                },
            },
            children: [
                {
                    path: '/',
                    component: dns,
                },

                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'DNS', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: '/dns/create-overview/:id/:name',
                    name: 'create-overview',
                    component: overview,
                    meta: {
                        breadcrumb: {
                            to: '/dns/create-overview/:id/:name',
                            text: 'Create overview'
                        }
                    }
                },

                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'DNS', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: '/dns/new-record/:id/:name',
                    name: 'new-record',
                    component: record,
                    meta: {
                        breadcrumb: {
                            to: '/dns/new-record/:id/:name',
                            text: ':name'
                        }
                    }
                },
                // {
                //     path: ':id',
                //     name: 'new-record',
                //     component: record,
                //     meta: {
                //         breadcrumb: {
                //             to: "/dns/new-record/:id",
                //             text: 'New Record'
                //         }
                //     }
                // }
            ]

        })

        VueEvent.listen('after-store-created', (store) => {
            store.commit('ROLEPERMISSION/addmenumodulepermission',
                {
                    header: 'NETWORK', headerno: 4,
                    name: 'Deka DNS', link: 'dns', icon: 'dnsIcon', sort: 2, permission: ['dns-sidemenu']
                }
            )
            store.commit('ROLEPERMISSION/addpermissions', ['dns-view'])
        })
    }
}