import store from "./store";
import page from "./page";
// import test from "./test";
import vmTabs from "./vm-tabs.vue";
import vappsDetail from "./vapps-detail.vue";
import createInstance from "./dialog/dialog-create-vm.vue";
// import vmDetail from "./vm-detail.vue";
import vdcTabs from "./vdc-tabs.vue";
import { VDC } from "./namespace";
import beforeenterpermission from "../../../lib/beforeenterpermission";
import beforeselectfirst from "../../../lib/beforeselectfirst";
import handlepermissionprivilages from "../../../lib/handlepermissionprivilages";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [VDC]: store });
    Vue.addRoutetoDashboard({
      path: "dp-instance",
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
          to: "/dp-instance",
          text: "Instance",
        },
      },
      children: [
        {
          path: "/",
          component: vdcTabs,
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
          path: "/dp-instance/create-instance",
          name: "create-instance",
          component: createInstance,
          meta: {
            breadcrumb: {
              to: "/dp-instance/create-instance",
              text: "Create Instance",
            },
          },
        },

        // {
        //   beforeEnter: (to, from, next) => {
        //     handlepermissionprivilages(Vue, next, "Dekaprime", "editor", true)()
        //       .then(() => {
        //         next();
        //       })
        //       .catch(() => {
        //         if (from.path == "/") {
        //           next("/");
        //         }
        //       });
        //   },
        //   path: "/test",
        //   name: "test",
        //   component: test,
        //   meta: {
        //     breadcrumb: {
        //       to: "/test",
        //       text: "test",
        //     },
        //   },
        // },
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

          path: "/dp-instance/:id/:id_vm/:id_vapp/:name",
          name: "vm-detail",
          component: vmTabs,
          meta: {
            breadcrumb: {
              text: ":name",
              to: "/dp-instance/:id/:id_vm/:id_vapp/:name",
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

          path: "/vdc/vapps/:id/:name",
          name: "vapps-detail",
          component: vappsDetail,
          meta: {
            breadcrumb: {
              text: ":name",
              to: "/vdc/vapps/:id/:name",
            },
          },
        },
      ],
    });

    VueEvent.listen("after-store-created", (store) => {
      store.commit("ROLEPERMISSION/addmenumodulepermission", {
        header: "DEKA PRIME",
        headerno: 2,
        name: "Instance",
        link: "dp-instance",
        icon: "instanceIcon",
        sort: 1,
        permission: ["dpinstance-sidemenu"],
      });
      store.commit("ROLEPERMISSION/addpermissions", ["dpinstance-view"]);
    });
  },
};
