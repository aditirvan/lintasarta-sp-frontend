import Main from './main.vue'
import Overview from './overview.vue'
import Overview1 from './overview2.vue'
import monthlyOverview from './monthly-overview.vue'
import addonsOverview from './addons-overview.vue'
import ListPackage from './list-package.vue'
import monthly from './monthly.vue'
import onetime from './onetime.vue'
import FormPackage from './form-package.vue'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import { MANAGESERVICE } from './namespace'
import { store } from './store'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'
import checkopenstack from "@/lib/checkopenstack";

export default{
    install(Vue, {VueEvent}){
        Vue.addModules({ [MANAGESERVICE]: store});
        Vue.addRoutetoDashboard({
            path: 'overview',
            component: Main,
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'Manage Service', 'disable', false)()
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
                    text: 'Overview',
                    to: '/overview',
                } 
            },
            children:[
                {
                    path: '',
                    component: Overview,
                    children:[
                        { path: '', redirect: 'monthly'},
                        {
                            path: 'monthly',
                            component: monthlyOverview,
                        },
                        {
                            path: 'addons',
                            component: addonsOverview
                        }
                    ]
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
                    path: '',
                    component: ListPackage,
                    children:[
                        { path: '', redirect: 'package-monthly' },
                        {
                            path: 'package-monthly',
                            component: monthly,
                            meta: {
                                breadcrumb:{
                                    text: 'Monthly Package',
                                    to: '/overview/package-monthly'
                                }
                            }
                        },
                        {
                            path: 'package-addons',
                            component: onetime,
                            meta: {
                                breadcrumb:{
                                    text: 'Add Ons Package',
                                    to: '/overview/package-addons'
                                }
                            }
                        }
                    ]
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
                    path: 'package-monthly/form-package',
                    component: Main,
                    meta: {
                        breadcrumb: {
                            text: 'Monthly Package',
                            to: '/overview/package-monthly'
                        }
                    },
                    children:[
                        {
                            path: '',
                            component: FormPackage,
                            meta: {
                                breadcrumb:{
                                    text: 'Form Package',
                                    to: '/overview/package-monthly/form-package'
                                }
                            }
                        },
                    ],
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
                    path: 'package-addons/form-package',
                    component: Main,
                    meta: {
                        breadcrumb: {
                            text: 'Add Ons Package',
                            to: '/overview/package-addons'
                        }
                    },
                    children:[
                        {
                            path: '',
                            component: FormPackage,
                            meta: {
                                breadcrumb:{
                                    text: 'Form Package',
                                    to: '/overview/package-addons/form-package'
                                }
                            }
                        },
                    ],
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
                    path: 'change-package',
                    component: ListPackage,
                    meta: {
                        breadcrumb: {
                            text: 'Change Package',
                            to: 'overview/change-package'
                        }
                    },
                },
            ]
        })
        VueEvent.listen('after-store-created', (store) => {
            store.commit('ROLEPERMISSION/addmenumodulepermission',
            {
                header: 'SUPPORT', headerno: 9,
                name: 'Manage Service', link: 'overview/monthly', icon: 'manageserviceIcon', sort: 2, permission: ['manageservice-sidemenu']
            })
            store.commit('ROLEPERMISSION/addpermissions', 'manageservice-view')
        })
    }
}