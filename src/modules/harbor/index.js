import page from './page'
import store from './store'
import storeBilling from './store-billing'
import { HARBOR, HARBORBILLING } from './namespace'
import harbor from './harbor.vue'
import detail from './detail.vue'
import createCluster from './create-cluster.vue'
import master from './master.vue'
import worker from './worker.vue'
import maintwindows from './maintwindows.vue'
import securityGroup from './security-group/security-group.vue'
import createSecurityGroup from './security-group/create-sg.vue'
import detailSG from './security-group/detail-sg.vue'
import securityAudit from './security-audit.vue'
import kubeconfig from './kubeconfig.vue'
import slbpage from './slb/page.vue'
import configslb from './slb/configure/page.vue'
import generalslb from './slb/configure/general.vue'
import backendslb from './slb/configure/backend.vue'
import frontendslb from './slb/configure/frontend.vue'
import createbe from './slb/configure/createBe.vue'
import createfe from './slb/configure/createFe.vue'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'
import checkopenstack from "@/lib/checkopenstack";


export default {
  install(Vue, {VueEvent}) {
    Vue.addModules({ [HARBOR] : store})
    Vue.addModules({ [HARBORBILLING] : storeBilling})
    Vue.addRoutetoDashboard({
      path: 'harbor',
      component: page,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, "Deka Harbor", "disable", false)()
          .then(() => {
            return beforeselectfirst(Vue)();
          })
          .then(() => {
            return checkopenstack(Vue)();
          })
          .then(() => {
            next();
          })
          .catch(() => {
            if (from.path == "/") {
              next("/");
            }
          });
      },
      meta: {
        breadcrumb: {
          to: '/harbor',
          text: 'Deka Harbor'
        },
      },
      children: [
        {
          path: '/',
          component: harbor
        },
        {
          beforeEnter: (to, from, next) => {
            handlepermissionprivilages(Vue, next, 'Deka Harbor', 'editor', true)().then(()=>{
              next()
            }).catch(()=>{
              if(from.path == '/'){
                next('/')
              }
            })
          },
          path: 'create-harbor',
          name: 'create-harbor',
          component: createCluster,
          meta: {
            breadcrumb: {
              to: '/harbor/create-harbor',
              text: 'Create Deka Harbor'
            }
          }
        },
        {
          path: 'detail',
          component: page,
          meta: {
            breadcrumb: {
              to: '/harbor/detail',
              text: 'Detail Deka Harbor'
            }
          }
        },

        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka Harbor', 'editor', true)().then(()=>{
          //       next()
          //   }).catch(()=>{
          //       if(from.path == '/'){
          //         next('/')
          //       }
          //     })
          // },
          path: 'detail',
          component: page,
          // meta: {
          //   breadcrumb: {
          //       text: 'Harbor',
          //       to: '/harbor'
          //   }
          // },
          // children:[
          //   {
          //     path: ':harborid',
          //     component: detail,
          //     meta: {
          //       breadcrumb: {
          //           text: ':harborid',
          //           to: '/harbor/detail/:harborid'
          //       }
          //     },
              children:[
                {
                  path: ':harborid',
                  component: detail,
                  meta: {
                    breadcrumb: {
                        text: 'Detail Deka Harbor',
                        to: '/harbor/detail/:harborid'
                    }
                  },
                  children: [
                    {
                      path: '',
                      redirect: '/harbor/detail/:harborid/worker'
                    },
                    // {
                    //   path: 'master',
                    //   component: master,
                    //   meta: {
                    //     breadcrumb: {
                    //         text: 'Master',
                    //         to: '/harbor/detail/:harborid/master'
                    //     }
                    //   },
                    // },
                    {
                      path: 'worker',
                      component: worker,
                      meta: {
                        breadcrumb: {
                            text: 'Worker',
                            to: '/harbor/detail/:harborid/worker'
                        }
                      }
                    },
                    {
                      path: 'securitygroup',
                      component: securityGroup,
                      meta: {
                        breadcrumb: {
                            text: 'Security Group',
                            to: '/harbor/detail/:harborid/securitygroup'
                        }
                      }
                    },
                    {
                      path: 'auditsg',
                      component: securityAudit,
                      meta: {
                        breadcrumb: {
                            text: 'Security Audit',
                            to: '/harbor/detail/:harborid/auditsg'
                        }
                      }
                    },
                    {
                      path: 'kubeconfig',
                      component: kubeconfig,
                      meta: {
                        breadcrumb: {
                            text: 'Config',
                            to: '/harbor/detail/:harborid/kubeconfig'
                        }
                      }
                    },
                    {
                      path: 'settings',
                      component: maintwindows,
                      meta: {
                        breadcrumb: {
                            text: 'Settings',
                            to: '/harbor/detail/:harborid/settings'
                        }
                      }
                    },
                    {
                      path: 'loadbalancer',
                      component: slbpage,
                      meta: {
                        breadcrumb: {
                            text: 'Load Balancer',
                            to: '/harbor/detail/:harborid/loadbalancer'
                        }
                      }
                    },
                  ]
                },

                {
                  path: ':harborid',
                  component: page,
                  meta: {
                    breadcrumb:{
                      text: 'Detail Deka Harbor',
                      to: '/harbor/detail/:harborid'
                    }
                  },
                  children: [
                    {
                      path: 'securitygroup',
                      component: page,
                      children:[
                        {
                          path: ':sg_id',
                          component: page,
                          meta: {
                            breadcrumb:{
                              text: 'Security Group',
                              to: '/harbor/detail/:harborid/securitygroup'
                            }
                          },
                          children: [
                            {
                              path: '',
                              redirect: '/harbor/detail/:harborid/securitygroup'
                            },
                            {
                              path: 'edit',
                              component: createSecurityGroup,
                              // name: 'create',
                              meta: {
                                breadcrumb:{
                                  text: 'Edit',
                                  to: '/harbor/detail/:harborid/securitygroup/:sg_id/edit'
                                }
                              },
                            },
                            {
                              path: 'detail',
                              component: detailSG,
                              // name: 'create',
                              meta: {
                                breadcrumb:{
                                  text: 'Detail',
                                  to: '/harbor/detail/:harborid/securitygroup/:sg_id/detail'
                                }
                              },
                            },

                          ]
                        }
                      ]
                    }
                  ]
                },

                {
                  path: ':harborid',
                  component: page,
                  meta: {
                    breadcrumb:{
                      text: 'Detail Deka Harbor',
                      to: '/harbor/detail/:harborid'
                    }
                  },
                  children:[
                    {
                      path: 'loadbalancer',
                      component: page,
                      children: [
                        {
                          beforeEnter: (to, from, next) => {
                              handlepermissionprivilages(Vue, next, 'Deka Harbor', 'editor', true)().then(()=>{
                                  next()
                              }).catch(()=>{
                                  if(from.path == '/'){
                                    next('/')
                                  }
                                })
                          },
                          path: 'config',
                          component: page,
                          meta: {
                              breadcrumb: { 
                                  text: 'Load Balancer',
                                  to: '/harbor/detail/:harborid/loadbalancer'
                              }
                          },
                          children: [
                              { 
                                  path: '', 
                                  component: configslb,
                                  meta: {
                                      breadcrumb: {
                                          text: 'Configuration',
                                          to: '/harbor/detail/:harborid/loadbalancer/config'
                                      }
                                  },
                                  children: [
                                      { path: '', redirect: '/harbor/detail/:harborid/loadbalancer/config/general'},
                                      {
                                          path: 'general', component: generalslb,
                                          meta: {
                                              breadcrumb: {
                                                  text: 'General',
                                                  to: '/harbor/detail/:harborid/loadbalancer/config/general'
                                              }
                                          }
                                      },
                                      {
                                          path: 'backend', component: backendslb,
                                          meta: {
                                              breadcrumb: {
                                                  text: 'Backend',
                                                  to: '/harbor/detail/:harborid/loadbalancer/config/backend'
                                              }
                                          }
                                      },
                                      {
                                          path: 'frontend', component: frontendslb,
                                          meta: {
                                              breadcrumb: {
                                                  text: 'Frontend',
                                                  to: '/harbor/detail/:harborid/loadbalancer/config/frontend'
                                              }
                                          }
                                      }
                                  ]
                              },
                              {
                                  path: 'backend',
                                  component: page,
                                  meta: {
                                      breadcrumb: {
                                          text: 'Configuration',
                                          to: '/harbor/detail/:harborid/loadbalancer/config'
                                      }
                                  },
                                  children: [
                                      {
                                          path: 'create',
                                          component: page,
                                          meta: {
                                              breadcrumb: {
                                                  text: 'Backend',
                                                  to: '/harbor/detail/:harborid/loadbalancer/config/backend'
                                              }
                                          },
                                          children: [
                                              {
                                                  path: '',
                                                  component: createbe,
                                                  meta: {
                                                      breadcrumb: {
                                                          text: 'Create Backend',
                                                          to: '/harbor/detail/:harborid/loadbalancer/config/backend/create'
                                                      }
                                                  }
                                              },
                                              
                                          ]
                                      },
                                      {
                                          path: 'edit',
                                          component: page,
                                          meta: {
                                              breadcrumb: {
                                                  text: 'Backend',
                                                  to: '/harbor/detail/:harborid/loadbalancer/config/backend'
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
                                                          to: '/harbor/detail/:harborid/loadbalancer/config/backend/edit'
                                                      }
                                                  }
                                              },
                                          ]
                                      }
                                  ]
                              },
                              {
                                  path: 'frontend',
                                  component: page,
                                  meta: {
                                      breadcrumb: {
                                          text: 'Configuration',
                                          to: '/harbor/detail/:harborid/loadbalancer/config'
                                      }
                                  },
                                  children: [
                                      {
                                          path: 'create',
                                          component: page,
                                          meta: {
                                              breadcrumb: {
                                                  text: 'Frontend',
                                                  to: '/harbor/detail/:harborid/loadbalancer/config/frontend'
                                              }
                                          },
                                          children: [
                                              {
                                                  path: '',
                                                  component: createfe,
                                                  meta: {
                                                      breadcrumb: {
                                                          text: 'Create Frontend',
                                                          to: '/harbor/detail/:harborid/loadbalancer/config/frontend/create'
                                                      }
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          path: 'edit',
                                          component: page,
                                          meta: {
                                              breadcrumb: {
                                                  text: 'Frontend',
                                                  to: '/harbor/detail/:harborid/loadbalancer/config/frontend'
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
                                                          to: '/harbor/detail/:harborid/loadbalancer/config/frontend/edit'
                                                      }
                                                  }
                                              },
                                          ]
                                      }
                                  ]
                              },
                          ]
                        },
                      ]
                    }
                  ]
                }
              ]
          //   }
          // ]
        }
      ]
    })

    VueEvent.listen('after-store-created', (store) => {
      store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
          header: 'PLATFORM', headerno: 5,
          name: 'Deka Harbor', link: 'harbor', icon: 'harborIcon', sort: 3, permission: ['harbor-sidemenu']
        }
      )
      store.commit('ROLEPERMISSION/addpermissions', ['harbor-view'])
    })
  }
}