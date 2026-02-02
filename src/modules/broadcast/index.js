import BROADCAST from "./namespace.ts";
import store from "./store.js";
import main from "./main.vue";
import beforeenterpermission from "../../lib/beforeenterpermission";
import broadcast from "./broadcast.vue";
import addBroadcast from "./addBroadcast.vue";
import detailBroadcast from "./detailBroadcast.vue";
import editBroadcast from "./editBroadcast.vue";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [BROADCAST]: store });
    Vue.addRoutetoDashboard({
      path: "broadcast",
      component: main,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, "Broadcast", "disable", false)()
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
        permission: ["broadcast-admin"],
        breadcrumb: {
          text: "Broadcast",
          to: "/broadcast",
        },
      },
      children: [
        { path: "", component: broadcast },
        {
          path: "/broadcast/add",
          component: addBroadcast,
          meta: {
            permission: ["broadcast-admin"],
            breadcrumb: {
              text: "Add Broadcast",
              to: "/broadcast/add",
            },
          },
        },
        {
          path: "/broadcast/:id",
          component: detailBroadcast,
          meta: {
            permission: ["broadcast-admin"],
            breadcrumb: {
              text: "Detail Broadcast",
              to: "/broadcast/:id",
            },
          },
        },
        {
          path: "/broadcast/:id/edit",
          component: editBroadcast,
          meta: {
            permission: ["broadcast-admin"],
            breadcrumb: {
              text: "Edit Broadcast",
              to: "/broadcast/:id/edit",
            },
          },
        },
      ],
    });

    VueEvent.listen("after-store-created", (store) => {
      store.commit("ROLEPERMISSION/addpermissions", "broadcast-admin");
    });
  },
};
