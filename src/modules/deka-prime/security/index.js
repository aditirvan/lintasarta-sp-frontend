import store from "./store";
import page from "./page";
import security from "./security.vue";
import securityDetail from "./security-detail.vue";
import securityEdit from "./security-edit.vue"
import detailNsxt from './security-detail-nsxt.vue'
import general from './nsxt/general.vue'
import firewall from './nsxt/firewall.vue'
import nat from './nsxt/nat.vue'
import ipset from './nsxt/ipset.vue'
import firewallNsxtEdit from './nsxt/firewall/security-edit.vue'
import beforeenterpermission from "../../../lib/beforeenterpermission";
import beforeselectfirst from "../../../lib/beforeselectfirst";
import { DPSECURITY } from "./namespace";
import handlepermissionprivilages from "../../../lib/handlepermissionprivilages";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [DPSECURITY]: store });
    Vue.addRoutetoDashboard({
      path: "dp-security",
      component: page,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, "Dekaprime", "disable", false)()
          .then(() => {
            return beforeselectfirst(Vue)();
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
          to: "/dp-security",
          text: "Security",
        },
      },
      children: [
        {
          path: "/",
          component: security,
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
          path: "detail",
          // name: "security-detail-nsxt",
          component: page,
          meta: {
            breadcrumb: {
              to: "/dp-security/detail",
              text: "Detail",
            },
          },
        },

        {
          path: "detail",
          // name: "security-detail-nsxt",
          component: page,
          // meta: {
          //   breadcrumb: {
          //     to: "/dp-security/:name",
          //     text: ":name",
          //   },
          // },
          children: [
            {
              beforeEnter: (to, from, next) => {
                handlepermissionprivilages(Vue, next, "Dekaprime", "editor", true)()
                  .then(() => {
                    next();
                  })
                  .catch(() => {
                    if (from.path == "/") {
                      next("/");
                    }
                  });
              },
              path: ':name',
              component: page,
              children: [
                {
                  beforeEnter: (to, from, next) => {
                    handlepermissionprivilages(Vue, next, "Dekaprime", "editor", true)()
                      .then(() => {
                        next();
                      })
                      .catch(() => {
                        if (from.path == "/") {
                          next("/");
                        }
                      });
                  },
                  path: ':idVdc',
                  component: page,
                  children: [
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
                      path: ':idEdge',
                      component: detailNsxt,
                      meta: {
                        breadcrumb: {
                          text: 'Detail',
                          to: '/dp-security/detail/:name/:idVdc/:idEdge'
                        }
                      },
                      children: [
                        {
                          path: '',
                          redirect: '/dp-security/detail/:name/:idVdc/:idEdge/general'
                        },
                        {
                          path: 'general',
                          component: general,
                          meta: {
                            breadcrumb: {
                              text: 'General',
                              to: '/dp-security/detail/:name/:idVdc/:idEdge/general'
                            }
                          }
                        },
                        {
                          path: 'firewall',
                          component: firewall,
                          meta: {
                            breadcrumb: {
                              text: 'Firewall',
                              to: '/dp-security/detail/:name/:idVdc/:idEdge/firewall'
                            }
                          },
                        },
                        {
                          path: 'nat',
                          component: nat,
                          meta: {
                            breadcrumb: {
                              text: 'NAT',
                              to: '/dp-security/detail/:name/:idVdc/:idEdge/nat'
                            }
                          }
                        },
                        {
                          path: 'ipset',
                          component: ipset,
                          meta: {
                            breadcrumb: {
                              text: 'IP Set',
                              to: '/dp-security/detail/:name/:idVdc/:idEdge/ipset'
                            }
                          }
                        },

                        // {
                        //   path: 'firewall/editrule',
                        //   component: page,
                        //   meta: {
                        //     breadcrumb: {
                        //       text: 'Firewall',
                        //       to: '/dp-security/detail/:name/:idVdc/:idEdge/firewall'
                        //     }
                        //   },
                        //   children: [
                        //     {
                        //       path : '',
                        //       component: firewallNsxtEdit,
                        //       meta: {
                        //         breadcrumb: {
                        //           text: 'Editrule',
                        //           to: '/dp-security/detail/:name/:idVdc/:idEdge/firewall/editrule'
                        //         }
                        //       },
                        //     }
                        //   ]
                        // }
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
                      path: ':idEdge',
                      component: page,
                      meta: {
                        breadcrumb: {
                          text: 'Detail',
                          to: '/dp-security/detail/:name/:idVdc/:idEdge'
                        }
                      },
                      children: [
                        {
                          path: 'firewall',
                          component: page,
                          meta: {
                            breadcrumb: {
                              text: 'Firewall',
                              to: '/dp-security/detail/:name/:idVdc/:idEdge/firewall'
                            }
                          },
                          children:[
                            {
                              path: 'editrule',
                              name: 'editrulensxt',
                              component: firewallNsxtEdit,
                              meta: {
                                breadcrumb: {
                                  text: 'Edit Firewall Rules',
                                  to: '/dp-security/detail/:name/:idVdc/:idEdge/firewall/editrule'
                                }
                              },
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
          ]
        },

        {
          beforeEnter: (to, from, next) => {
            handlepermissionprivilages(Vue, next, "Dekaprime", "editor", true)()
              .then(() => {
                next();
              })
              .catch(() => {
                if (from.path == "/") {
                  next("/");
                }
              });
          },
          path: "/dp-security/:name/:idVdc/:idEdge/:idTab",
          name: "security-detail",
          component: securityDetail,
          meta: {
            breadcrumb: {
              to: "/dp-security/:name/:idVdc/:idEdge/:idTab",
              text: ":name",
            },
          },
        },
        {
          beforeEnter: (to, from, next) => {
            handlepermissionprivilages(Vue, next, "Dekaprime", "editor", true)()
              .then(() => {
                next();
              })
              .catch(() => {
                if (from.path == "/") {
                  next("/");
                }
              });
          },
          path: "/dp-security/:idVdc/:idEdge/:idRule",
          name: "security-edit",
          component: securityEdit,
          meta: {
            breadcrumb: {
              to: "/dp-security/:idVdc/:idEdge/:idRule",
              text: "Edit Firewall Rule",
            },
          },
        },
      ],
    });

    VueEvent.listen("after-store-created", (store) => {
      store.commit("ROLEPERMISSION/addmenumodulepermission", {
        header: "DEKA PRIME",
        headerno: 2,
        name: "Security",
        link: "dp-security",
        icon: "securityIcon",
        sort: 3,
        permission: ["dpsecurity-sidemenu"],
      });
      store.commit("ROLEPERMISSION/addpermissions", ["dpsecurity-view"]);
    });
  },
};
