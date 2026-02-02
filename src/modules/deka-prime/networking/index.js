import store from "./store";
import page from "./page";
import networking from "./networking.vue";
import detailNetwork from "./tabs/detail-networks.vue";
import createNetwork from "./dialog/dialog-create-network.vue";
import { DPNETWORK } from "./namespace";
import beforeenterpermission from "../../../lib/beforeenterpermission";
import beforeselectfirst from "../../../lib/beforeselectfirst";
import handlepermissionprivilages from "../../../lib/handlepermissionprivilages";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [DPNETWORK]: store });
    Vue.addRoutetoDashboard({
      path: "networking",
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
          to: "/networking",
          text: "Network",
        },
      },
      children: [
        {
          path: "/",
          component: networking,
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
          path: "/networking/create-network",
          name: "create-network",
          component: createNetwork,
          meta: {
            breadcrumb: {
              to: "/networking/create-network",
              text: "Create Network",
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
          path: "/networking/:name/:id/networks",
          name: "detail-network",
          component: detailNetwork,
          meta: {
            breadcrumb: {
              to: "/networking/:name/:id/networks",
              text: ":name",
            },
          },
        },
      ],
    });

    VueEvent.listen("after-store-created", (store) => {
      store.commit("ROLEPERMISSION/addmenumodulepermission", {
        header: "DEKA PRIME",
        headerno: 2,
        name: "Network",
        link: "networking",
        icon: "networkIcon",
        sort: 2,
        permission: ["dpnetwork-sidemenu"],
      });
      store.commit("ROLEPERMISSION/addpermissions", ["dpnetwork-view"]);
    });
  },
};
