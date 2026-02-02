import page from "./page";
import pop from "./pop.vue";
import store from "./store";
import creatDekapop from "./create-dekapop.vue";
import editDekapop from "./edit-dekapop.vue";
import detailsDekapop from "./detail-dekapop.vue";
import createUsage from "./create-usage.vue";
import editUsage from "./edit-usage.vue"
import { POP } from "./namespace";
import beforeenterpermission from "../../lib/beforeenterpermission";
import beforeselectfirst from "../../lib/beforeselectfirst";
import handlepermissionprivilages from "../../lib/handlepermissionprivilages";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [POP]: store });
    Vue.addRoutetoDashboard({
      path: "dekapop",
      component: page,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, "Deka POP", "disable", false)()
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
          to: "/dekapop",
          text: "Deka POP",
        },
      },
      children: [
        {
          path: "/",
          component: pop,
        },
        {
          // beforeEnter: (to, from, next) => {
          //   handlepermissionprivilages(Vue, next, "Deka POP", "editor", true)()
          //     .then(() => {
          //       next();
          //     })
          //     .catch(() => {
          //       if (from.path == "/") {
          //         next("/");
          //       }
          //     });
          // },
          path: "/dekapop/create",
          name: "create-dekapop",
          component: creatDekapop,
          meta: {
            breadcrumb: {
              to: "/dekapop/create",
              text: "Create Deka POP",
            },
          },
        },

        {
          path: "/dekapop/edit/:id",
          name: "edit-dekapop",
          component: editDekapop,
          meta: {
            breadcrumb: {
              to: "/dekapop/edit/:id",
              text: "Edit Deka POP",
            },
          },
        },
        {
          path: "/dekapop/details/:id",
          name: "details-dekapop",
          component: detailsDekapop,
          meta: {
            breadcrumb: {
              to: "/dekapop/details/:id",
              text: "Details Deka POP",
            },
          },
        },
        {
          path: "/dekapop/create/usage/:id",
          name: "create-usage",
          component: createUsage,
          meta: {
            breadcrumb: {
              to: "/dekapop/create/usage/:id",
              text: "Create Usage",
            },
          },
        },
        {
          path: "/dekapop/edit/usage/:id",
          name: "edit-usage",
          component: editUsage,
          meta: {
            breadcrumb: {
              to: "/dekapop/edit/usage/:id",
              text: "Edit Usage",
            },
          },
        },

      ],
    });
    VueEvent.listen("after-store-created", (store) => {
      store.commit("ROLEPERMISSION/addmenumodulepermission", {
        header: "SOFTWARE",
        headerno: 9,
        name: "Deka POP",
        link: "dekapop",
        icon: "dekapopIcon",
        sort: 1,
        permission: ["deka-pop-sidemenu"],
      });
      store.commit("ROLEPERMISSION/addpermissions", ["deka-pop-view"]);
    });
  },
};
