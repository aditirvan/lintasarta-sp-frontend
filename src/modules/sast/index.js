import { I3GIS } from './namespace'
import store from './store'
import page from './page.vue'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'
import sast from './sast.vue'

export default{
  install(Vue, {VueEvent}){
    Vue.addModules({ [I3GIS]: store })
    Vue.addRoutetoDashboard({
      path: "deka-ast",
      component: page,
      beforeEnter: (to, from, next) => {
        // beforeenterpermission(Vue, next, "Deka AST", "disable", false)()
        //   .then(() => {
            beforeselectfirst(Vue)()
              .then(() => {
                return next()
              })
              .catch(() => {
                if (from.path == "/") {
                  next("/");
                }
              });
          // }
          // );
      },
      meta: {
        breadcrumb: {
          to: "/deka-ast",
          text: "Deka AST",
        },
      },
      children: [
        { path: "", component: page, redirect: '/deka-ast/summaryproject' },
        // { 
        //   path: "home",
        //   component: sast, 
        //   meta:{
        //     breadcrumb: {
        //       to: "/deka-ast/home",
        //       text: "Home",
        //     },
        //   }
        // },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'summaryproject',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/summaryproject',
              text: 'Summary Project'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'sast',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/sast',
              text: 'SAST'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'issuecode',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/issuecode',
              text: 'Issue Code'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'measurescode',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/measurescode',
              text: 'Measures Code'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'customrules',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/customrules',
              text: 'Custom Rules'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'securitydetector',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/securitydetector',
              text: 'Security Detector'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'sca',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/sca',
              text: 'SCA'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'scafilter',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/scafilter',
              text: 'SCA Filter'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'secretcheck',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/secretcheck',
              text: 'Secret Check'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'misconf',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/misconf',
              text: 'Repo Misconfiguration'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'scanvalidation',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/scanvalidation',
              text: 'Scan Validation AppSec'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'integration',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/integration',
              text: 'Integration'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'dast',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/dast',
              text: 'Dynamic Security'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'scanhistory',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/scanhistory',
              text: 'Scan History'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'reportappsec',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/reportappsec',
              text: 'Appsec Report'
            }
          },
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, 'Deka AST', 'editor', true)().then(() => {
          //     next()
          //   }).catch(() => {
          //     if (from.path == '/') {
          //       next('/')
          //     }
          //   })
          // },
          path: 'dynamicsecreport',
          component: sast,
          meta:{
            breadcrumb:{
              to: '/deka-ast/dynamicsecreport',
              text: 'Dynamic Security Report'
            }
          },
        },
        // {
        //   path: 'auditlog',
        //   component: sast,
        //   meta:{
        //     breadcrumb:{
        //       to: '/deka-ast/auditlog',
        //       text: 'Audit Log'
        //     }
        //   },
        // },
      ],
    },
    )

    //   VueEvent.listen('after-store-created', (store) => {
    //     store.commit('ROLEPERMISSION/addmenumodulepermission',
    //     {
    //         header: 'I3gis', headerno: 6,
    //         name: 'Home', link: 'i3gis', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
    //     })
    //     store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    // })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Summary Project', subheadno: 1,
            // childsub: 'Summary Project', childsubno:1,
            name: 'Summary Project', link: 'deka-ast/summaryproject', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Application Security', subheadno: 2, childsub: 'SAST', childsubno:2,
            child2sub: 'Overview', linkk: 'deka-ast/sast', iconn: 'manageserviceIcon', sortt: 1, permissionn: ['sast-sidemenu'],
            name: 'Overview', link: 'deka-ast/sast', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
            // name: 'SAST', link: 'deka-ast/sast', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Application Security', subheadno: 2, childsub: 'SAST', childsubno:2,
            child2sub: 'Issue Code', linkk: 'deka-ast/issuecode', iconn: 'manageserviceIcon', sortt: 2, permissionn: ['sast-sidemenu'],
            name: 'Issue Code', link: 'deka-ast/issuecode', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Application Security', subheadno: 2, childsub: 'SAST', childsubno:2,
            child2sub: 'Measures Code', linkk: 'deka-ast/measurescode', iconn: 'manageserviceIcon', sortt: 3, permissionn: ['sast-sidemenu'],
            name: 'Measures Code', link: 'deka-ast/measurescode', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Application Security', subheadno: 2, childsub: 'SAST', childsubno:2,
            child2sub: 'Custom Rules', linkk: 'deka-ast/customrules', iconn: 'manageserviceIcon', sortt: 4, permissionn: ['sast-sidemenu'],
            name: 'Custom Rules', link: 'deka-ast/customrules', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Application Security', subheadno: 2, childsub: 'SAST', childsubno:2,
            child2sub: 'Security Detector', linkk: 'deka-ast/securitydetector', iconn: 'manageserviceIcon', sortt: 5, permissionn: ['sast-sidemenu'],
            name: 'Security Detector', link: 'deka-ast/securitydetector', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Application Security', subheadno: 2, childsub: 'SCA', childsubno:3,
            child2sub: 'Result Vulnerability', linkk: 'deka-ast/sca', iconn: 'manageserviceIcon', sortt: 1, permissionn: ['sast-sidemenu'],
            name: 'Result Vulnerability', link: 'deka-ast/sca', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Application Security', subheadno: 2, childsub: 'SCA', childsubno:3,
            child2sub: 'Filter Scan Vulnerability', linkk: 'deka-ast/scafilter', iconn: 'manageserviceIcon', sortt: 2, permissionn: ['sast-sidemenu'],
            name: 'Filter Scan Vulnerability', link: 'deka-ast/scafilter', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Application Security', subheadno: 2, childsub: 'Secret Check', childsubno:4,
            linkk: 'deka-ast/secretcheck', iconn: 'manageserviceIcon', permissionn: ['sast-sidemenu'],
            name: 'Secret Check', link: 'deka-ast/secretcheck', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Application Security', subheadno: 2, childsub: 'Misconf Repository', childsubno:5,
            linkk: 'deka-ast/misconf', iconn: 'manageserviceIcon', permissionn: ['sast-sidemenu'],
            name: 'Repo Misconfiguration', link: 'deka-ast/misconf', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
      })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Application Security', subheadno: 2, childsub: 'Scan Validation', childsubno:6,
            linkk: 'deka-ast/scanvalidation', iconn: 'manageserviceIcon', permissionn: ['sast-sidemenu'],
            name: 'Scan Validation AppSec', link: 'deka-ast/scanvalidation', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Dynamic Security', subheadno: 3, childsub: 'Site Scan', childsubno:7,
            linkk: 'deka-ast/dast', iconn: 'manageserviceIcon', permissionn: ['sast-sidemenu'],
            name: 'Site Scan', link: 'deka-ast/dast', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Dynamic Security', subheadno: 3, childsub: 'Scan History', childsubno:8,
            linkk: 'deka-ast/scanhistory', iconn: 'manageserviceIcon', permissionn: ['sast-sidemenu'],
            name: 'Scan History', link: 'deka-ast/scanhistory', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
    VueEvent.listen('after-store-created', (store) => {
      store.commit('ROLEPERMISSION/addmenumodulepermission',
      {
          header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Integration', subheadno: 4,
          linkk: 'deka-ast/integration', iconn: 'manageserviceIcon', permissionn: ['sast-sidemenu'],
          name: 'Integration', link: 'deka-ast/integration', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
      })
      store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Report', subheadno: 5, childsub: 'All Tools', childsubno:9,
            child2sub: 'Appsec Report', linkk: 'deka-ast/reportappsec', iconn: 'manageserviceIcon', sortt: 1, permissionn: ['sast-sidemenu'],
            name: 'Appsec Report', link: 'deka-ast/reportappsec', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
      VueEvent.listen('after-store-created', (store) => {
        store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
            header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Report', subheadno: 5, childsub: 'All Tools', childsubno:9,
            child2sub: 'Dynamic-Sec Report', linkk: 'deka-ast/dynamicsecreport', iconn: 'manageserviceIcon', sortt: 2, permissionn: ['sast-sidemenu'],
            name: 'Dynamic-Sec Report', link: 'deka-ast/dynamicsecreport', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
        })
        store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    })
    //   VueEvent.listen('after-store-created', (store) => {
    //     store.commit('ROLEPERMISSION/addmenumodulepermission',
    //     {
    //         header: 'SECURITY', headerno: 6, header1: 'Deka AST', subhead: 'Report', subheadno: 3, childsub: 'Audit Log', childsubno:9,
    //         linkk: 'deka-ast/auditlog', iconn: 'manageserviceIcon', permissionn: ['sast-sidemenu'],
    //         name: 'Audit Log', link: 'deka-ast/auditlog', icon: 'dekaAstIcon', sort: 2, permission: ['sast-sidemenu']
    //     })
    //     store.commit('ROLEPERMISSION/addpermissions', 'sast-view')
    // })
      
  }
}
