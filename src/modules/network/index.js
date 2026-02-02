import network from './network'
import domain from './domain'
import dns from './dns/page'
import main from './main'
import floatingip from './floatingip/page'
import loadbalance from './loadbalance/page'
import vpc from './vpc/page'
import { SLB, SLBBILLING } from './slb/namespace'
import slbstore from './slb/store'
import slbbillingstore from './slb/store-billing'
import { VPN } from './vpn/namespace'
import vpnstore from './vpn/store'
// import raasvps from './raasvpc/page.vue'
// import createraasvpc from './raasvpc/create.vue'
// import raasvpcdetail from './raasvpc/raasdetail.vue'
import natgateway from './vpc/nat.vue'
import vyos from './vpc/vyos.vue'
import networkNat from './vpc/vpc_detail/network.vue'
import interfaceNat from './vpc/vpc_detail/interface.vue'
import natNat from './vpc/vpc_detail/nat-gateway.vue'
import routingNat from './vpc/vpc_detail/static-routing.vue'
import slb from './slb/page.vue'
import createslb from './slb/create.vue'
import configslb from './slb/configure/page.vue'
import generalslb from './slb/configure/general.vue'
import backendslb from './slb/configure/backend.vue'
import createbe from './slb/configure/createBe.vue'
import frontendslb from './slb/configure/frontend.vue'
import createfe from './slb/configure/createFe.vue'
import vpn from './vpn/page.vue'
import pfsense from './vpn/pfsense/pfsense.vue'
import createPfsense from './vpn/pfsense/create.vue'
import configVpn from './vpn/pfsense/page.vue'
import ipsec from './vpn/pfsense/ipsec/ipsec.vue'
import createIpsec from './vpn/pfsense/ipsec/createIpsec.vue'
import createIpsecPhase from './vpn/pfsense/ipsec/createIpsecPhase2.vue'
import openvpn from './vpn/pfsense/openVpn/openVpn.vue'
import services from './vpn/pfsense/service/restartService.vue'
import clientexport from './vpn/pfsense/clientexport/clientexport.vue'
import createOpenVpn from './vpn/pfsense/openVpn/createOpenVpn.vue'
import tunnels from './vpn/tunnels.vue'
import psk from './vpn/preSharedKeys.vue'
import createtunnels from './vpn/create.vue'
import createpsk from './vpn/createPreSharedKey.vue'
import page from './page'
import createloadbalance from './loadbalance/create'
import createvpc from './vpc/create'
import createExpert from './vpc/createExpert.vue'
import createTab from './vpc/createTab.vue'
import editloadbalance from './loadbalance/edit'
import { NETWORKVPC } from './vpc/namespace'
import vpcstore from './vpc/store'
import { NETWORKFLOATINGIP } from './floatingip/namespace'
import folatingipstore from './floatingip/store'
import { NETWORKLOADBALANCER } from './loadbalance/namespace'
import loadbalancerstore from './loadbalance/store'
import vpcdetail from './vpc/vpc_detail/vpcdetail.vue'
import loadbalancerdetail from './loadbalance/loadbalance_detail/loadbalance_detail.vue'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'
import checkopenstack from "@/lib/checkopenstack";

export default {
    install(Vue, { VueEvent }) {
        Vue.addModules({ [NETWORKFLOATINGIP]: folatingipstore })
        Vue.addModules({ [NETWORKVPC]: vpcstore });
        Vue.addModules({ [NETWORKLOADBALANCER]: loadbalancerstore });
        Vue.addModules({ [SLB]: slbstore})
        Vue.addModules({ [SLBBILLING]: slbbillingstore})
        Vue.addModules({ [VPN]: vpnstore})
        Vue.addRoutetoDashboard({
            path: '/network',
            components: {
                default: page,
            },
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'Network', 'disable', false)()
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
                permission: ['network-view'],
                breadcrumb: {
                    text: 'Network',
                    to: '/network'
                }
            },
            children: [
                {
                    path: '',
                    component: network,
                    meta: {
                        permission: ['network-view']
                    },
                    children: [
                        { path: '', redirect: 'vpc' },
                        {
                            path: 'dns',
                            component: dns,
                            name : 'dns',
                            meta : {
                                breadcrumb : {
                                    text : 'DNS',
                                    to : '/network/dns'
                                }
                            },

                        }, 

                        {
                            path: 'floatingip',
                            component: floatingip,
                            name: 'floatingip',
                            meta: {
                                breadcrumb: {
                                    text: 'Floating IP',
                                    to: '/network/floatingip'
                                }
                            }
                        },

                        {
                            path: 'loadbalancer',
                            name: 'loadbalancer',
                            component: loadbalance,
                            meta: {
                                breadcrumb: {
                                    text: 'Load Balancer',
                                    to: '/network/loadbalancer'
                                }
                            }
                        },

                        {
                            path: 'vpc',
                            name: 'vpc',
                            component: vpc,
                            meta: {
                                breadcrumb: {
                                    text: 'VPC',
                                    to: '/network/vpc'
                                }
                            }
                        },

                        // {
                        //     path: 'raasvpc',
                        //     name: 'raasvpc',
                        //     component: raasvps,
                        //     meta: {
                        //         breadcrumb: {
                        //             text: 'RaaS VPC',
                        //             to: '/network/raasvpc'
                        //         }
                        //     }
                        // },

                        {
                            path: 'slb',
                            name: 'Load Balancer',
                            component: slb,
                            meta: {
                                breadcrumb: {
                                    text: 'Load Balancer',
                                    to: '/network/slb'
                                }
                            }
                        },
                        {
                            path: 'nat',
                            name: 'NAT Gateway',
                            component: vyos,
                            meta: {
                                breadcrumb: {
                                    text: 'NAT Gateway',
                                    to: '/network/nat'
                                }
                            },
                        },
                        {
                            path: 'vpn',
                            name: 'VPN',
                            component: pfsense,
                            meta: {
                                breadcrumb: {
                                    text: 'VPN',
                                    to: '/network/vpn'
                                }
                            },
                        },

                        // {
                        //     path: 'vpn',
                        //     name: 'VPN',
                        //     component: vpn,
                        //     meta: {
                        //         breadcrumb: {
                        //             text: 'VPN',
                        //             to: '/network/vpn'
                        //         }
                        //     },
                        //     children: [
                        //         { path: '', redirect: '/network/vpn/pfsense' },
                        //         {
                        //             path: 'pfsense',
                        //             component: main,
                        //             children: [
                        //                 { 
                        //                     path : '', 
                        //                     component: pfsense,
                        //                     meta: {
                        //                         breadcrumb:{
                        //                             text: 'Pfsense',
                        //                             to: '/network/vpn/pfsense'
                        //                         }
                        //                     }
                        //                 }
                        //             ]
                        //         },
                        //         {
                        //             path: 'tunnels',
                        //             component: main,
                        //             children: [
                        //                 { 
                        //                     path : '', 
                        //                     component: tunnels,
                        //                     meta: {
                        //                         breadcrumb:{
                        //                             text: 'Tunnels',
                        //                             to: '/network/vpn/tunnels'
                        //                         }
                        //                     }
                        //                 }
                        //             ]
                        //         },
                        //         {
                        //             path: 'psk',
                        //             component: main,
                        //             children: [
                        //                 { 
                        //                     path : '', 
                        //                     component: psk,
                        //                     meta: {
                        //                         breadcrumb:{
                        //                             text: 'Pre Shared Keys',
                        //                             to: '/network/vpn/psk'
                        //                         }
                        //                     }
                        //                 }
                        //             ]
                        //         },
                        //     ]
                        // }

                    ]
                },


                {
                    beforeEnter: (to, from, next) => {
                        beforeenterpermission(Vue, next, 'Network', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'dns/new-record',
                    component: domain,
                    name: 'newrecord',
                    meta: {
                        breadcrumb: {
                            text: 'New Record',
                            to: '/network/dns/new-record'
                        }
                    }
                },

                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'loadbalancer/create',
                    component: main,
                    meta: {
                        breadcrumb: {
                            text: 'Load Balancer',
                            to: '/network/loadbalancer'
                        }
                    },
                    children: [
                        {
                            path: '',
                            component: createloadbalance,
                            meta: {
                                breadcrumb: {
                                    text: 'Create Load Balance',
                                    to: '/network/loadbalancer/create'
                                }
                            },
                        }
                    ]
                },
                {
                    path: 'loadbalancer/:loadbalancer_id',
                    component: main,
                    meta: {
                        breadcrumb: {
                            text: 'Load Balancer',
                            to: '/network/loadbalancer'
                        }
                    },
                    children: [
                        {
                            path: '',
                            redirect: '/network/loadbalancer/:loadbalancer_id/instances'
                        },
                        {
                            path: 'instances',
                            component: loadbalancerdetail,
                            meta: {
                                breadcrumb: {
                                    text: 'Instances',
                                    to: '/network/loadbalancer/:loadbalancer_id/instances'
                                }
                            },
                        },
                        {
                            path: 'settings',
                            component: loadbalancerdetail,
                            meta: {
                                breadcrumb: {
                                    text: 'Settings',
                                    to: '/network/loadbalancer/:loadbalancer_id/settings'
                                }
                            },
                        },
                    ]
                },

                {
                    beforeEnter: (to, from, next) => {
                        beforeenterpermission(Vue, next, 'Network', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'loadbalancer/edit',
                    component: editloadbalance,
                    meta: {
                        breadcrumb: {
                            text: 'Load Balancer',
                            to: 'loadbalancer/edit'
                        }
                    }
                },

                {
                    path: 'vpc/create',
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    component: main,
                    meta: {
                        breadcrumb: { 
                            text: 'VPC',
                            to: '/network/vpc'
                        }
                    },
                    children: [
                        {
                            path: '', 
                            component: createTab,
                            meta: {
                                breadcrumb: {
                                    text: 'Create VPC',
                                    to: '/network/vpc/create'
                                }
                            },
                            children:[
                                { path: '', redirect: '/network/vpc/create/simple' },
                                {
                                    path: 'simple', component: createvpc,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Wizard Simple',
                                            to: '/network/vpc/create/simple'
                                        }
                                    }
                                },
                                {
                                    path: 'expert', component: createExpert,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Wizard Expert',
                                            to: '/network/vpc/create/expert'
                                        }
                                    }
                                },
                            ]
                        }
                    ]
                },

                // {
                //     path: 'vpc/create',
                //     beforeEnter: (to, from, next) => {
                //         handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                //             next()
                //         }).catch(()=>{
                //             if(from.path == '/'){
                //               next('/')
                //             }
                //           })
                //     },
                //     component: main,
                //     meta: {
                //         breadcrumb: { 
                //             text: 'VPC',
                //             to: '/network/vpc'
                //         }
                //     },
                //     children: [
                //         {
                //             path: '', component: createvpc,
                //             meta: {
                //                 breadcrumb: {
                //                     text: 'Create VPC',
                //                     to: '/network/vpc/create'
                //                 }
                //             }
                //         }
                //     ]
                // },

                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'vpc/edit',
                    component: createvpc,
                    meta: {
                        breadcrumb: {
                            text: 'Edit VPC',
                            to: ''
                        }
                    }
                },
                {
                    path: 'vpc/:vpcid',
                    component: main,
                    meta: {
                        breadcrumb: {
                            text: 'VPC',
                            to: '/network/vpc'
                        }
                    },
                    children: [{
                        path: '',
                        component: vpcdetail,
                        meta: {
                            breadcrumb: {
                                text: 'Detail VPC',
                                to: ''
                            }
                        }
                    }]
                },
                
                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'nat/:vyosid',
                    component: main,
                    meta: {
                        breadcrumb: {
                            text: 'NAT Gateway',
                            to: '/network/nat'
                        }
                    },
                    children: [
                        // { path: '', redirect: '/nat/:vyosid/network' },
                        {
                        path: '',
                        component: natgateway,
                        meta: {
                            breadcrumb: {
                                text: 'Configuration NAT Gateway',
                                to: '/network/nat/:vyosid'
                            }
                        },
                        children:[
                            { path: '', redirect: '/network/nat/:vyosid/networknat' },
                            { 
                                path: 'networknat',
                                component: networkNat,
                                meta: {
                                    breadcrumb: {
                                        text: 'Router',
                                        to: '/network/nat/:vyosid/networknat'
                                    }
                                }
                            },
                            { 
                                
                                path: 'floatingip',
                                component: interfaceNat,
                                meta: {
                                    breadcrumb: {
                                        text: 'Floating IP',
                                        to: '/network/nat/:vyosid/floatingip'
                                    }
                                }
                            },
                            { 
                                path: 'routing',
                                component: routingNat,
                                meta: {
                                    breadcrumb: {
                                        text: 'Static Route',
                                        to: '/network/nat/:vyosid/routing'
                                    }
                                }
                            },
                            { 
                                path: 'nat',
                                component: natNat,
                                meta: {
                                    breadcrumb: {
                                        text: 'NAT',
                                        to: '/network/nat/:vyosid/nat'
                                    }
                                }
                            },
                        ]
                    },]
                },

                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'slb/create',
                    // beforeEnter: (to, from, next) => {
                    //     handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                    //         next()
                    //     }).catch(()=>{
                    //         if(from.path == '/'){
                    //           next('/')
                    //         }
                    //       })
                    // },
                    component: main,
                    meta: {
                        breadcrumb: { 
                            text: 'Load Balancer',
                            to: '/network/slb'
                        }
                    },
                    children: [
                        {
                            path: '', component: createslb,
                            meta: {
                                breadcrumb: {
                                    text: 'Create Load Balancer',
                                    to: '/network/slb/create'
                                }
                            }
                        }
                    ]
                },

                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'vpn/create',
                    // beforeEnter: (to, from, next) => {
                    //     handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                    //         next()
                    //     }).catch(()=>{
                    //         if(from.path == '/'){
                    //           next('/')
                    //         }
                    //       })
                    // },
                    component: main,
                    meta: {
                        breadcrumb: { 
                            text: 'VPN',
                            to: '/network/vpn'
                        }
                    },
                    children: [
                        {
                            path: '', 
                            component: createPfsense,
                            meta: {
                                breadcrumb: {
                                    text: 'Create',
                                    to: '/network/vpn/create'
                                }
                            }
                        }
                    ]
                },

                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'vpn/config',
                    // beforeEnter: (to, from, next) => {
                    //     handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                    //         next()
                    //     }).catch(()=>{
                    //         if(from.path == '/'){
                    //           next('/')
                    //         }
                    //       })
                    // },
                    component: main,
                    meta: {
                        breadcrumb: { 
                            text: 'VPN',
                            to: '/network/vpn'
                        }
                    },
                    children: [
                        { 
                            path: '', 
                            component: configVpn,
                            meta: {
                                breadcrumb: {
                                    text: 'Configuration',
                                    to: '/network/vpn/config'
                                }
                            },
                            children: [
                                { path: '', redirect: '/network/vpn/config/ipsec'},
                                {
                                    path: 'ipsec', component: ipsec,
                                    meta: {
                                        breadcrumb: {
                                            text: 'IPsec',
                                            to: '/network/vpn/config/ipsec'
                                        }
                                    }
                                },
                                {
                                    path: 'openvpn', component: openvpn,
                                    meta: {
                                        breadcrumb: {
                                            text: 'OpenVPN',
                                            to: '/network/vpn/config/openvpn'
                                        }
                                    }
                                },
                                {
                                    path: 'restartservice', component: services,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Restart Service',
                                            to: '/network/vpn/config/restartservice'
                                        }
                                    }
                                },
                                {
                                    path: 'export', component: clientexport,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Client Export',
                                            to: '/network/vpn/config/export'
                                        }
                                    }
                                },
                            ]
                        },
                        {
                            path: 'ipsec',
                            component: main,
                            meta: {
                                breadcrumb: {
                                    text: 'Configuration',
                                    to: '/network/vpn/config'
                                }
                            },
                            children: [
                                {
                                    path: 'create',
                                    component: main,
                                    meta: {
                                        breadcrumb: {
                                            text: 'IPsec',
                                            to: '/network/vpn/config/ipsec'
                                        }
                                    },
                                    children: [
                                        {
                                            path: '',
                                            component: createIpsec,
                                            meta: {
                                                breadcrumb: {
                                                    text: 'Create IPsec',
                                                    to: '/network/vpn/config/ipsec/create'
                                                }
                                            }
                                        },
                                        
                                    ]
                                },
                                {
                                    path: 'phase2',
                                    component: main,
                                    meta: {
                                        breadcrumb: {
                                            text: 'IPsec',
                                            to: '/network/vpn/config/ipsec'
                                        }
                                    },
                                    children: [
                                        {
                                            path: '',
                                            component: createIpsecPhase,
                                            meta: {
                                                breadcrumb: {
                                                    text: 'Create IPsec Phase 2',
                                                    to: '/network/vpn/config/ipsec/phase2'
                                                }
                                            }
                                        },
                                        
                                    ]
                                },

                            ]
                        },
                        {
                            path: 'openvpn',
                            component: main,
                            meta: {
                                breadcrumb: {
                                    text: 'Configuration',
                                    to: '/network/vpn/config'
                                }
                            },
                            children: [
                                {
                                    beforeEnter: (to, from, next) => {
                                        handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                                            next()
                                        }).catch(()=>{
                                            if(from.path == '/'){
                                              next('/')
                                            }
                                          })
                                    },
                                    path: 'create',
                                    component: main,
                                    meta: {
                                        breadcrumb: {
                                            text: 'OpenVPN',
                                            to: '/network/vpn/config/openvpn'
                                        }
                                    },
                                    children: [
                                        {
                                            path: '',
                                            component: createOpenVpn,
                                            meta: {
                                                breadcrumb: {
                                                    text: 'Create OpenVPN',
                                                    to: '/network/vpn/config/openvpn/create'
                                                }
                                            }
                                        },
                                        
                                    ]
                                },
                            ]
                        }
                    ]
                },
                
                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: 'slb/config',
                    // beforeEnter: (to, from, next) => {
                    //     handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                    //         next()
                    //     }).catch(()=>{
                    //         if(from.path == '/'){
                    //           next('/')
                    //         }
                    //       })
                    // },
                    component: main,
                    meta: {
                        breadcrumb: { 
                            text: 'Load Balancer',
                            to: '/network/slb'
                        }
                    },
                    children: [
                        { 
                            path: '', 
                            component: configslb,
                            meta: {
                                breadcrumb: {
                                    text: 'Configuration',
                                    to: '/network/slb/config'
                                }
                            },
                            children: [
                                { path: '', redirect: '/network/slb/config/general'},
                                {
                                    path: 'general', component: generalslb,
                                    meta: {
                                        breadcrumb: {
                                            text: 'General',
                                            to: '/network/slb/config/general'
                                        }
                                    }
                                },
                                {
                                    path: 'backend', component: backendslb,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Backend',
                                            to: '/network/slb/config/backend'
                                        }
                                    }
                                },
                                {
                                    path: 'frontend', component: frontendslb,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Frontend',
                                            to: '/network/slb/config/frontend'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            path: 'backend',
                            component: main,
                            meta: {
                                breadcrumb: {
                                    text: 'Configuration',
                                    to: '/network/slb/config'
                                }
                            },
                            children: [
                                {
                                    path: 'create',
                                    component: main,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Backend',
                                            to: '/network/slb/config/backend'
                                        }
                                    },
                                    children: [
                                        {
                                            path: '',
                                            component: createbe,
                                            meta: {
                                                breadcrumb: {
                                                    text: 'Create Backend',
                                                    to: '/network/slb/config/backend/create'
                                                }
                                            }
                                        },
                                        
                                    ]
                                },
                                {
                                    path: 'edit',
                                    component: main,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Backend',
                                            to: '/network/slb/config/backend'
                                        }
                                    },
                                    children: [
                                        {
                                            path: '',
                                            component: createbe,
                                            name: 'editbe',
                                            meta: {
                                                breadcrumb: {
                                                    text: 'Edit Backend',
                                                    to: '/network/slb/config/backend/edit'
                                                }
                                            }
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'frontend',
                            component: main,
                            meta: {
                                breadcrumb: {
                                    text: 'Configuration',
                                    to: '/network/slb/config'
                                }
                            },
                            children: [
                                {
                                    path: 'create',
                                    component: main,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Frontend',
                                            to: '/network/slb/config/frontend'
                                        }
                                    },
                                    children: [
                                        {
                                            path: '',
                                            component: createfe,
                                            meta: {
                                                breadcrumb: {
                                                    text: 'Create Frontend',
                                                    to: '/network/slb/config/frontend/create'
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    path: 'edit',
                                    component: main,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Frontend',
                                            to: '/network/slb/config/frontend'
                                        }
                                    },
                                    children: [
                                        {
                                            path: '',
                                            component: createfe,
                                            name: 'editfe',
                                            meta: {
                                                breadcrumb: {
                                                    text: 'Edit Frontend',
                                                    to: '/network/slb/config/frontend/edit'
                                                }
                                            }
                                        },
                                    ]
                                }
                            ]
                        },
                    ]
                },

                {
                    path: 'vpn/tunnels',
                    component: main,
                    meta: {
                        breadcrumb: { 
                            text: 'VPN',
                            to: '/network/vpn/tunnels'
                        }
                    },
                    children: [
                        {
                            path: 'create',
                            // beforeEnter: (to, from, next) => {
                            //     handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                            //         next()
                            //     }).catch(()=>{
                            //         if(from.path == '/'){
                            //           next('/')
                            //         }
                            //       })
                            // },
                            component: main,
                            meta: {
                                breadcrumb: { 
                                    text: 'Tunnels',
                                    to: '/network/vpn/tunnels'
                                }
                            },
                            children: [
                                {
                                    path: '', component: createtunnels,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Create Tunnels',
                                            to: '/network/vpn/tunnels/create'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },

                {
                    path: 'vpn/pfsense',
                    component: main,
                    meta: {
                        breadcrumb: { 
                            text: 'VPN',
                            to: '/network/vpn/pfsense'
                        }
                    },
                    children: [
                        {
                            path: 'create',
                            // beforeEnter: (to, from, next) => {
                            //     handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                            //         next()
                            //     }).catch(()=>{
                            //         if(from.path == '/'){
                            //           next('/')
                            //         }
                            //       })
                            // },
                            component: main,
                            meta: {
                                breadcrumb: { 
                                    text: 'Pfsense',
                                    to: '/network/vpn/pfsense'
                                }
                            },
                            children: [
                                {
                                    path: '', component: createPfsense,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Create VPN Pfsense',
                                            to: '/network/vpn/pfsense/create'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                
                {
                    path: 'vpn/psk',
                    component: main,
                    meta: {
                        breadcrumb: { 
                            text: 'VPN',
                            to: '/network/vpn/psk'
                        }
                    },
                    children: [
                        {
                            path: 'create',
                            // beforeEnter: (to, from, next) => {
                            //     handlepermissionprivilages(Vue, next, 'Network', 'editor', true)().then(()=>{
                            //         next()
                            //     }).catch(()=>{
                            //         if(from.path == '/'){
                            //           next('/')
                            //         }
                            //       })
                            // },
                            component: main,
                            meta: {
                                breadcrumb: { 
                                    text: 'Pre Shared Keys',
                                    to: '/network/vpn/psk'
                                }
                            },
                            children: [
                                {
                                    path: '', component: createpsk,
                                    meta: {
                                        breadcrumb: {
                                            text: 'Create Pre Shared Keys',
                                            to: '/network/vpn/psk/create'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },

                
            ]

        }
        )

        VueEvent.listen('after-store-created', (store) => {
            store.commit('ROLEPERMISSION/addmenumodulepermission',
                {
                    header: 'DEKA FLEXI', headerno: 1,
                    name: 'Network', link: 'network/vpc', icon: 'networkIcon', sort: 4, permission: ['network-sidemenu']
                }
            )
            store.commit('ROLEPERMISSION/addpermissions', 'network-view')
        })
    }
}
