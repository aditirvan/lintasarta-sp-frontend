import { SUPERADMINMANAGEFLAVOR, MANAGEFLAVORTYPE } from "./namespace";
import store from "./store";
import storeType from "./managetype/storeType.ts";
import page from "./page.vue";
import flavor from "./flavor.vue";
import createFlavor from "./create-flavor.vue";
import editDetailFlavor from "./edit-detail-flavor.vue";
import managetype from "./managetype/managetype.vue";

export default {
  install(Vue) {
    Vue.addModules({ [SUPERADMINMANAGEFLAVOR]: store });
    Vue.addModules({ [MANAGEFLAVORTYPE]: storeType });
    Vue.addRoutetoDashboard({
      path: "manage-flavor",
      component: page,
      meta: {
        breadcrumb: {
          text: "Manage Flavor",
          to: "/manage-flavor",
        },
      },
      children: [
        {
          path: "",
          component: flavor,
          //   meta: {
          //     breadcrumb: {
          //       text: "Flavor",
          //       to: "/manage-flavor",
          //     },
          //   },
          //   name: "flavor",
        },
        {
          path: "/manage-flavor/create-flavor",
          component: createFlavor,
          meta: {
            breadcrumb: {
              text: "Create Flavor",
              to: "/manage-flavor/create-flavor",
            },
          },
        },
        {
          path: "/manage-flavor/edit-flavor/:id",
          component: editDetailFlavor,
          meta: {
            breadcrumb: {
              text: "Edit Flavor",
              to: "/manage-flavor/edit-flavor/:id",
            },
          },
        },
        {
          path: "/manage-flavor/detail-flavor/:id",
          component: editDetailFlavor,
          meta: {
            breadcrumb: {
              text: "Detail Flavor",
              to: "/manage-flavor/detail-flavor/:id",
            },
          },
        },
        {
          path: "/manage-flavor/flavor-type",
          component: managetype,
          meta: {
            breadcrumb: {
              text: "Flavor Type",
              to: "/manage-flavor/flavor-type",
            },
          },
        },
      ],
    });
  },
};
