import store from './store'
import storeBilling from './store-billing'
import page from './page'
import registry from './registry'
import listregistry from './list-registry'
import create from './create-repository'
import detail from './detail-repository'
import overview from './overview'
import artifacts from './artifacts'
import summary from './summary.vue'
import repository from './repositories.vue'
import logs from './logs.vue'
import labels from './labels.vue'
import tag from './tag-immutability.vue'
import member from './member.vue'
import { REGISTRY, REGISTRYBILLING } from './namespace'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'



export default {
    install(Vue, { VueEvent }) {
        Vue.addModules({ [REGISTRY]: store });
        Vue.addModules({ [REGISTRYBILLING]: storeBilling });
        Vue.addRoutetoDashboard({
            path: 'registry',
            component: page,
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'Registry', 'disable', false)().then(() => {
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
                    to: '/registry',
                    text: 'Registry'
                },
            },
            children: [
                {
                    path: '/',
                    component: listregistry
                },
                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Registry', 'editor', true)().then(() => {
                            next()
                        }).catch(() => {
                            if (from.path == '/') {
                                next('/')
                            }
                        })
                    },
                    path: 'create-repository',
                    name: 'create-repository',
                    component: page,
                    meta: {
                        breadcrumb: {
                            to: '/registry/create-repository',
                            text: 'Create Registry'
                        }
                    },
                    children: [
                        { path: '', component:create },
                    ]
                },
                {
                    path: ':project_name',
                    component: registry,
                    meta: {
                        breadcrumb: {
                          to: '/registry/:project_name',
                          text: ':project_name'
                        }
                    },
                    children: [
                        {
                            path: '',
                            redirect: '/registry/:project_name/summary'
                        },
                        {
                            path: 'summary',
                            component: summary,
                            meta: {
                                breadcrumb: {
                                  to: '/registry/:project_name/summary',
                                  text: 'Summary'
                                }
                              }
                        },
                        {
                            path: 'repositories',
                            component: repository,
                            meta: {
                                breadcrumb: {
                                    text: 'Repositories',
                                    to: '/registry/:project_name/repositories',
                                },
                            },
                            name: 'repositories',
                        },
                        {
                            path: 'logs', 
                            component: logs,
                            meta: {
                                breadcrumb: {
                                    text: 'Logs',
                                    to: '/registry/:project_name/logs',
                                },
                            },
                            name: 'logs'
        
                        },
                        {
                            path: 'labels', 
                            component: labels,
                            meta: {
                                breadcrumb: {
                                    text: 'Labels',
                                    to: '/registry/:project_name/labels',
                                },
                            },
                            name: 'labels'
        
                        },
                        {
                            path: 'tag-immutability', 
                            component: tag,
                            meta: {
                                breadcrumb: {
                                    text: 'Tag Immutability',
                                    to: '/registry/:project_name/tag-immutability',
                                },
                            },
                            name: 'tag-immutability'
        
                        },
                        {
                            path: 'member', 
                            component: member,
                            meta: {
                                breadcrumb: {
                                    text: 'Member',
                                    to: '/registry/:project_name/member',
                                },
                            },
                            name: 'member'
        
                        },
                    ]
                },
                {
                    path: ':project_name',
                    component: page,
                    meta: {
                        breadcrumb: {
                          to: '/registry/:project_name',
                          text: ':project_name'
                        }
                    },
                    children: [
                        {
                            path: 'overview',
                            component: overview,
                            meta: {
                                breadcrumb: {
                                  to: '/registry/:project_name/overview',
                                  text: 'Overview'
                                }
                            },
                        }
                    ]
                },
                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Registry', 'editor', true)().then(() => {
                            next()
                        }).catch(() => {
                            if (from.path == '/') {
                                next('/')
                            }
                        })
                    },
                    path: ':project_name',
                    component: page,
                    meta: {
                        breadcrumb: {
                          to: '/registry/:project_name',
                          text: ':project_name'
                        }
                    },
                    children: [
                        {
                            path: 'repositories',
                            component: page,
                            children: [
                                {
                                    path: ':project',
                                    component: page,
                                    meta: {
                                        breadcrumb: {
                                          to: '/registry/:project_name/repositories',
                                          text: 'Repositories'
                                        }
                                    },
                                    children: [
                                        {
                                            path: '',
                                            component: detail,
                                            // redirect: '/registry/:project_name/repositories/:repo_name/:project',
                                            meta: {
                                                breadcrumb: {
                                                  to: '/registry/:project_name/repositories/:project',
                                                  text: ':project'
                                                }
                                            },
                                            // children: [
                                            //     {
                                            //         path: ':project',
                                            //         component: detail,
                                            //         meta: {
                                            //             breadcrumb: {
                                            //                 text: ':name',
                                            //                 to: '/registry/:project_name/repositories/:name/:project'
                                            //             }
                                            //         }
                                            //     },
                                            // ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Registry', 'editor', true)().then(() => {
                            next()
                        }).catch(() => {
                            if (from.path == '/') {
                                next('/')
                            }
                        })
                    },
                    path: ':project_name',
                    component: page,
                    meta: {
                        breadcrumb: {
                          to: '/registry/:project_name',
                          text: ':project_name'
                        }
                    },
                    children: [
                        {
                            path: 'repositories',
                            component: page,
                            children: [
                                {
                                    path: ':project',
                                    component: page,
                                    meta: {
                                        breadcrumb: {
                                          to: '/registry/:project_name/repositories',
                                          text: 'Repositories'
                                        }
                                    },
                                    children: [
                                        {
                                            path: ':artifacts',
                                            component: page,
                                            // redirect: '/registry/:project_name/repositories/:repo_name/:project',
                                            meta: {
                                                breadcrumb: {
                                                  to: '/registry/:project_name/repositories/:project',
                                                  text: ':project'
                                                }
                                            },
                                            children: [
                                                {
                                                    path: '',
                                                    component: artifacts,
                                                    meta: {
                                                        breadcrumb: {
                                                          to: '/registry/:project_name/repositories/:project/:artifacts',
                                                          text: ':artifacts'
                                                        }
                                                    },
                                                }
                                            ]
                                            // children: [
                                            //     {
                                            //         path: ':project',
                                            //         component: detail,
                                            //         meta: {
                                            //             breadcrumb: {
                                            //                 text: ':name',
                                            //                 to: '/registry/:project_name/repositories/:name/:project'
                                            //             }
                                            //         }
                                            //     },
                                            // ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                // { path: '', component: listregistry },

                // {
                //     path: '/registry/detail', component: page,
                //     meta: {
                //         breadcrumb: {
                //             text: 'Detail',
                //             to: '/registry/detail',
                //         },
                //     },
                //     children: [
                //         { path: '', redirect:'summary' },
                //         {
                //             path: 'summary', component: registry,
                //             meta: {
                //                 breadcrumb: {
                //                     text: 'Summary',
                //                     to: '/registry/detail/summary',
                //                 },
                //             },
                //             name: 'summary'
        
                //         },
                //         {
                //             path: 'repositories', component: registry,
                //             meta: {
                //                 breadcrumb: {
                //                     text: 'Repositories',
                //                     to: '/registry/detail/repositories',
                //                 },
                //             },
                //             name: 'repositories',
                //         },
                //         {
                //             path: 'logs', component: registry,
                //             meta: {
                //                 breadcrumb: {
                //                     text: 'Logs',
                //                     to: '/registry/detail/logs',
                //                 },
                //             },
                //             name: 'logs'
        
                //         },
                //         {
                //             path: 'labels', component: registry,
                //             meta: {
                //                 breadcrumb: {
                //                     text: 'Labels',
                //                     to: '/registry/detail/labels',
                //                 },
                //             },
                //             name: 'labels'
        
                //         },
                //         {
                //             path: 'tag-immutability', component: registry,
                //             meta: {
                //                 breadcrumb: {
                //                     text: 'Tag Immutability',
                //                     to: '/registry/detail/tag-immutability',
                //                 },
                //             },
                //             name: 'tag-immutability'
        
                //         },
                //         {
                //             path: 'member', component: registry,
                //             meta: {
                //                 breadcrumb: {
                //                     text: 'Member',
                //                     to: '/registry/detail/member',
                //                 },
                //             },
                //             name: 'member'
        
                //         },
                //         {
                //             beforeEnter: (to, from, next) => {
                //                 handlepermissionprivilages(Vue, next, 'Registry', 'editor', true)().then(() => {
                //                     next()
                //                 }).catch(() => {
                //                     if (from.path == '/') {
                //                         next('/')
                //                     }
                //                 })
                //             },
                //             path: '/registry/detail/overview',
                //             name: 'overview',
                //             component: overview,
                //             meta: {
                //                 breadcrumb: {
                //                     to: '/registry/detail/overview',
                //                     text: 'Overview'
                //                 }
                //             }
                //         },
        
                //         {
                //             path: '/registry/detail/repositories',
                //             beforeEnter: (to, from, next) => {
                //                 handlepermissionprivilages(Vue, next, 'Registry', 'editor', true)().then(() => {
                //                     next()
                //                 }).catch(() => {
                //                     if (from.path == '/') {
                //                         next('/')
                //                     }
                //                 })
                //             },
                //             component: detail,
                //             meta: {
                //                 breadcrumb: { 
                //                     text: 'Repositories',
                //                     to: '/registry/detail/repositories'
                //                 }
                //             },
                //             children: [{
                //                 path: '/registry/detail/repositories/:name/:project',
                //                 component: detail,
                //                 meta: {
                //                     breadcrumb: {
                //                         text: ':name',
                //                         to: '/registry/detail/repositories/:name/:project'
                //                     }
                //                 }
                //             },
                //         ]
                //         },
        
                //         {
                //             path: '/registry/detail/repositories/:name/:project/:artifacts',
                //             beforeEnter: (to, from, next) => {
                //                 handlepermissionprivilages(Vue, next, 'Registry', 'editor', true)().then(() => {
                //                     next()
                //                 }).catch(() => {
                //                     if (from.path == '/') {
                //                         next('/')
                //                     }
                //                 })
                //             },
                //             component: artifacts,
                //             meta: {
                //                 breadcrumb: { 
                //                     text: ':name',
                //                     to: '/registry/detail/repositories/:name/:project'
                //                 }
                //             },
                //             children: [
                //             {
                //                 path: '/registry/detail/repositories/:name/:project/:artifacts',
                //                 component: artifacts,
                //                 meta: {
                //                     breadcrumb: {
                //                         text: ':project',
                //                         to: '/registry/detail/repositories/:name/:project/:artifacts'
                //                     }
                //                 }
                //             },
                //         ]
                //         },
                //     ]
                // },
                // {
                //     beforeEnter: (to, from, next) => {
                //         handlepermissionprivilages(Vue, next, 'Registry', 'editor', true)().then(() => {
                //             next()
                //         }).catch(() => {
                //             if (from.path == '/') {
                //                 next('/')
                //             }
                //         })
                //     },
                //     path: '/registry/create-repository',
                //     name: 'create-repository',
                //     component: page,
                //     meta: {
                //         breadcrumb: {
                //             to: '/registry/create-repository',
                //             text: 'Create Repository'
                //         }
                //     },
                //     children: [
                //         { path: '', component:create },
                //     ]
                // },

            ]

        })

        VueEvent.listen('after-store-created', (store) => {
            store.commit('ROLEPERMISSION/addmenumodulepermission',
                {
                    header: 'CI/CD', headerno: 7,
                    name: 'Deka Registry', link: 'registry', icon: 'registryIcon', sort: 1, permission: ['registry-sidemenu']
                }
            )
            store.commit('ROLEPERMISSION/addpermissions', ['registry-view'])
        })
    }
}