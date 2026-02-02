import { SUPERADMINMANAGEREGION, DEKAFLEXIREGION, DEKABOXREGION } from "./namespace";
import store from "./store";
import storeDekaFlexiRegion from "./region-deka-flexi/storeDekaFlexiRegion";
import storeDekaBoxRegion from "./region-deka-box/storeDekaBoxRegion";
import page from "./page.vue";
import regionTabs from "./region-tabs.vue";
import zone from "./manage-zone/zone.vue";
import bucket from "./manage-bucket/bucket.vue"

export default {
  install(Vue) {
    Vue.addModules({ [SUPERADMINMANAGEREGION]: store });
    Vue.addModules({ [DEKAFLEXIREGION]: storeDekaFlexiRegion });
    Vue.addModules({ [DEKABOXREGION]: storeDekaBoxRegion });
    Vue.addRoutetoDashboard({
      path: "manage-region",
      component: page,
      meta: {
        breadcrumb: {
          text: "Manage Region",
          to: "/manage-region",
        },
      },
      children: [
        {
          path: "",
          redirect: "deka-flexi",
        },
        {
          path: "deka-flexi",
          component: regionTabs,
          meta: {
            breadcrumb: {
              text: "Deka Flexi",
              to: "/manage-region/deka-flexi",
            },
          },
          name: "deka-flexi",
        },
        {
          path: "deka-box",
          component: regionTabs,
          meta: {
            breadcrumb: {
              text: "Deka Box",
              to: "/manage-region/deka-box",
            },
          },
          name: "deka-box",
        },
        {
          path: "/manage-region/manage-zone/:id",
          component: zone,
          meta: {
            breadcrumb: {
              text: "Manage Zone",
              to: "/manage-region/manage-zone/:id",
            },
          },
          // name: "manage-zone",
        },
        {
          path: "/manage-region/manage-bucket/:id",
          component: bucket,
          meta: {
            breadcrumb: {
              text: "Management Site",
              to: "/manage-region/manage-bucket/:id",
            },
          },
          // name: "manage-zone",
        },
        // {
        //   path: "/manage-pricing/create-flavor",
        //   component: createFlavor,
        //   meta: {
        //     breadcrumb: {
        //       text: "Create Flavor",
        //       to: "/manage-pricing/create-flavor",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/create-product",
        //   component: create,
        //   meta: {
        //     breadcrumb: {
        //       text: "Create Product",
        //       to: "/manage-pricing/create-product",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/create-tags",
        //   component: createTags,
        //   meta: {
        //     breadcrumb: {
        //       text: "Create Tags",
        //       to: "/manage-pricing/create-tags",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/edit-tags/:name/:id",
        //   component: editTags,
        //   meta: {
        //     breadcrumb: {
        //       text: "Edit Tags",
        //       to: "/manage-pricing/edit-tags/:name/:id",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/detail-tags/:name/:id",
        //   component: detailTags,
        //   meta: {
        //     breadcrumb: {
        //       text: "Detail Tags",
        //       to: "/manage-pricing/detail-tags/:name/:id",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/edit-product/:name/:id",
        //   component: editProduct,
        //   meta: {
        //     breadcrumb: {
        //       text: "Edit Product",
        //       to: "/manage-pricing/edit-product/:name/:id",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/edit-flavor/:name/:id",
        //   component: editFlavor,
        //   meta: {
        //     breadcrumb: {
        //       text: "Edit Flavor",
        //       to: "/manage-pricing/edit-flavor/:name/:id",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/detail-flavor/:name/:id",
        //   component: detailFlavor,
        //   meta: {
        //     breadcrumb: {
        //       text: ":name",
        //       to: "/manage-pricing/detail-flavor/:name/:id",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/detail-product/:name/:id",
        //   component: detailProduct,
        //   meta: {
        //     breadcrumb: {
        //       text: ":name",
        //       to: "/manage-pricing/detail-product/:name/:id",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/create-service/:name/:id",
        //   component: createService,
        //   meta: {
        //     breadcrumb: {
        //       text: "Create Service",
        //       to: "/manage-pricing/create-service/:name/:id",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/detail-service/:nameProduct/:idProduct/:nameService/:idService",
        //   component: detailService,
        //   meta: {
        //     breadcrumb: {
        //       text: "Detail Service",
        //       to: "/manage-pricing/detail-service/:nameProduct/:idProduct/:nameService/:idService",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/edit-service/:nameProduct/:idProduct/:nameService/:idService",
        //   component: editService,
        //   meta: {
        //     breadcrumb: {
        //       text: "Edit Service",
        //       to: "/manage-pricing/edit-service/:nameProduct/:idProduct/:nameService/:idService",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/create-item",
        //   component: createItem,
        //   meta: {
        //     breadcrumb: {
        //       text: "Create Item",
        //       to: "/manage-pricing/create-item",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/detail-item/:name/:id",
        //   component: detailItem,
        //   meta: {
        //     breadcrumb: {
        //       text: "Detail Item",
        //       to: "/manage-pricing/detail-item/:name/:id",
        //     },
        //   },
        // },
        // {
        //   path: "/manage-pricing/edit-item/:name/:id",
        //   component: editItem,
        //   meta: {
        //     breadcrumb: {
        //       text: "edit Item",
        //       to: "/manage-pricing/edit-item/:name/:id",
        //     },
        //   },
        // },
      ],
    });
  },
};
