import BROADCAST from "./namespace.ts";
import store from "./store.js";
import main from "./main.vue";
// import beforeenterpermission from "../../lib/beforeenterpermission";
import broadcast from "./broadcast.vue";
import detailBroadcast from "./detailBroadcast.vue";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [BROADCAST]: store });
    Vue.addRoutetoDashboard({
      path: "broadcast-user",
      component: main,
      // beforeEnter: (to, from, next) => {
      //   beforeenterpermission(Vue, next, "Broadcast User", "disable", false)()
      //     .then(() => {
      //       next();
      //     })
      //     next()
      //     .catch(() => {
      //       if (from.path == "/") {
      //         next("/");
      //       }
      //     });
      // },
      meta: {
        permission: ["broadcast-user"],
        breadcrumb: {
          text: "Broadcast",
          to: "/broadcast-user",
        },
      },
      children: [
        { path: "", component: broadcast },
        {
          path: "/broadcast-user/:id",
          component: detailBroadcast,
          meta: {
            permission: ["broadcast-user"],
            breadcrumb: {
              text: "Detail Broadcast",
              to: "/broadcast-user/:id",
            },
          },
        },
      ],
    });

    VueEvent.listen("after-store-created", (store) => {
      store.commit("ROLEPERMISSION/addpermissions", "broadcast-user");
    });
  },
};
