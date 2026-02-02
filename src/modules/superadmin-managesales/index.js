import SUPERADMINMANAGESALES from "./namespace.ts";
import store from "./store.js";
import main from "./main.vue";
import manageSales from "./manageSales.vue";
// import detailSales from "./detailSales.vue";
// import broadcast from "./broadcast.vue";
// import addBroadcast from "./addBroadcast.vue";
// import detailBroadcast from "./detailBroadcast.vue";
// import editBroadcast from "./editBroadcast.vue";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [SUPERADMINMANAGESALES]: store });
    Vue.addRoutetoDashboard({
      path: "manage-sales",
      component: main,
      meta: {
        breadcrumb: {
          text: "Manage Sales",
          to: "/manage-sales",
        },
      },
      children: [
        { path: "", component: manageSales },
        // {
        //   path: "/broadcast/add",
        //   component: addBroadcast,
        //   meta: {
        //     permission: ["broadcast-admin"],
        //     breadcrumb: {
        //       text: "Add Broadcast",
        //       to: "/broadcast/add",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-sales/:id",
        //   component: detailSales,
        //   meta: {
        //     breadcrumb: {
        //       text: "Detail Sales",
        //       to: "/manage-sales/:id",
        //     },
        //   },
        // },
        // {
        //   path: "/broadcast/:id/edit",
        //   component: editBroadcast,
        //   meta: {
        //     permission: ["broadcast-admin"],
        //     breadcrumb: {
        //       text: "Edit Broadcast",
        //       to: "/broadcast/:id/edit",
        //     },
        //   },
        // },
      ],
    });

    // VueEvent.listen("after-store-created", (store) => {
    //   store.commit("ROLEPERMISSION/addpermissions", "broadcast-admin");
    // });
  },
};
