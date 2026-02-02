import page from './page.vue'
import orgDp from './organizations-dp.vue'
import detail from './detail.vue'
import general from './general.vue'
import detailUser from './user/detail.vue'
import { ORGDP } from './namespace'
import store from './store'

export default{
  install(Vue, { VueEvent }){
    Vue.addModules({ [ORGDP]: store});
    Vue.addRoutetoDashboard({
      path: 'manage-orgdp',
      component: page,
      meta:{
          breadcrumb: {
              text: 'Organizations',
              to: '/manage-orgdp',
          },
      },
      children:[
          {
              path: '/',
              component: orgDp,
              // name: ''
          },
          
          {
            // beforeEnter: (to, from, next) => {
            //   handlepermissionprivilages(Vue, next, "Dekaprime", "editor", true)()
            //     .then(() => {
            //       next();
            //     })
            //     .catch(() => {
            //       if (from.path == "/") {
            //         next("/");
            //       }
            //     });
            // },
            path: ':project_name',
            // name: "security-detail-nsxt",
            component: detail,
            meta: {
              breadcrumb: {
                to: '/manage-orgdp/:project_name',
                text: ':project_name',
              },
            },
            children: [
              // {
              //   path: '',
              //   redirect: 'general'
              // },
              // {
              //   path: 'general',
              //   name: 'general',
              //   component: general,
              //   meta: {
              //     breadcrumb: {
              //       to: '/manage-orgdp/:project_name/general',
              //       text: 'General',
              //     }
              //   },
              // },
            ]
          },

          {
            // beforeEnter: (to, from, next) => {
            //   handlepermissionprivilages(Vue, next, "Dekaprime", "editor", true)()
            //     .then(() => {
            //       next();
            //     })
            //     .catch(() => {
            //       if (from.path == "/") {
            //         next("/");
            //       }
            //     });
            // },
            path: ':project_name',
            // name: "security-detail-nsxt",
            component: page,
            meta: {
              breadcrumb: {
                to: '/manage-orgdp/:project_name',
                text: ':project_name',
              },
            },
            children: [
              {
                path: ':user_name',
                component: detailUser,
                meta: {
                  breadcrumb: {
                    to: '/manage-orgdp/:project_name/:user_name',
                    text: ':user_name',
                  },
                },
              }
            ]
          },

          // {
          //   path: ':name',
          //   component: page,
          //   // meta: {
          //   //   breadcrumb: {
          //   //     to: '/manage-orgdp/:name',
          //   //     text: ':name',
          //   //   },
          //   // },
          //   children: [
          //       // {
          //       //   path: '',
          //       //   redirect: '/manage-orgdp/:name/general'
          //       // },
          //       {
          //         path: '',
          //         component: detail,
          //         meta: {
          //             breadcrumb: {
          //               to: '/manage-orgdp/:name',
          //               text: ':name',
          //             },
          //           },
          //         children: [
          //           {
          //               path: '',
          //               redirect: '/manage-orgdp/:name/general'
          //             },
          //           {
          //             path: 'general',
          //             component: general,
          //             meta: {
          //               breadcrumb: {
          //                 text: 'General',
          //                 to: '/manage-orgdp/:name/general'
          //               }
          //             },
          //           }
          //         ]
          //       }
          //       // {
          //       //   path: 'general',
          //       //   component: general,
          //       //   meta: {
          //       //     breadcrumb: {
          //       //       text: 'General',
          //       //       to: '/manage-orgdp/:name/general'
          //       //     }
          //       //   },
          //       // }
          //     ]
          // }


          // {
          //       path: ':name',
          //       component: page,
          //       // meta: {
          //       //   breadcrumb: {
          //       //     text: ':name',
          //       //     to: '/manage-orgdp/detail/:name'
          //       //   }
          //       // },
          //       children: [
          //         {
          //           path: ':idOrg',
          //           component: detail,
          //           meta: {
          //               breadcrumb: {
          //                 text: ':name',
          //                 to: '/manage-orgdp/:name/:idOrg'
          //               }
          //             },
          //           // children: [
          //           //   {
          //           //     path: '',
          //           //     component: page,
          //               // meta: {
          //               //   breadcrumb: {
          //               //     text: ':name',
          //               //     to: '/manage-orgdp/:name/:idOrg'
          //               //   }
          //               // },
          //               children: [
          //                 {
          //                   path: '',
          //                   redirect: '/manage-orgdp/:name/:idOrg/general'
          //                 },
          //                 {
          //                   path: 'general',
          //                   component: general,
          //                   meta: {
          //                     breadcrumb: {
          //                       text: 'General',
          //                       to: '/manage-orgdp/:name/:idOrg/general'
          //                     }
          //                   },
          //                 },
          //                 // {
          //                 //   path: '',
          //                 //   component: detail,
          //                 //   meta: {
          //                 //     breadcrumb: {
          //                 //       text: ':name',
          //                 //       to: '/manage-orgdp/:name/:idOrg'
          //                 //     }
          //                 //   },
          //                 //   children:[
          //                 //     {
          //                 //       path: '',
          //                 //       redirect: '/manage-orgdp/:name/:idOrg/general'
          //                 //     },
          //                 //     {
          //                 //       path: 'general',
          //                 //       component: general,
          //                 //       meta: {
          //                 //         breadcrumb: {
          //                 //           text: 'General',
          //                 //           to: '/manage-orgdp/:name/:idOrg/general'
          //                 //         }
          //                 //       },
          //                 //     },
          //                 //   ]
          //                 // },
          //                 // {
          //                 //   path: 'general',
          //                 //   component: general,
          //                 //   meta: {
          //                 //     breadcrumb: {
          //                 //       text: 'General',
          //                 //       to: '/manage-orgdp/:name/:idOrg/general'
          //                 //     }
          //                 //   },
          //                 // },
                          
          //             //   ]
          //             // }
                      
          //             // {
          //             //   path: '',
          //             //   redirect: '/manage-orgdp/:name/:idOrg/general'
          //             // },
          //             // {
          //             //   path: 'general',
          //             //   component: general,
          //             //   meta: {
          //             //     breadcrumb: {
          //             //       text: 'General',
          //             //       to: '/manage-orgdp/:name/:idOrg/general'
          //             //     }
          //             //   },
          //             // },
          //             // {
          //             //   path: 'fire',
          //             //   component: general,
          //             //   meta: {
          //             //     breadcrumb: {
          //             //       text: 'Fire',
          //             //       to: '/manage-orgdp/:name/:idOrg/fire'
          //             //     }
          //             //   },
          //             // },
          //           ]
                        
          //       //   }
          //       // ]
          //     }
          //   ]
          // }
      ]
  })
  }
}