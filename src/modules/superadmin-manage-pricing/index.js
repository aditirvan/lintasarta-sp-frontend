import { SUPERADMINMANAGEPRICING } from "./namespace";
import store from "./store";
import page from "./page.vue";
import create from "./product/create-product.vue";
import detailProduct from "./product/detail-product.vue";
import createService from "./service/create-service.vue";
import createItem from "./items/create-item.vue";
import pricingTabs from "./pricing-tabs.vue";
import createTags from "./tags/create-tags.vue";
import editItem from "./items/edit-item.vue";
import editService from "./service/edit-service.vue";
import createFlavor from "./flavor-type/create-flavor.vue";
import editFlavor from "./flavor-type/edit-flavor.vue";
import detailFlavor from "./flavor-type/detail-flavor.vue";

export default {
  install(Vue) {
    Vue.addModules({ [SUPERADMINMANAGEPRICING]: store });
    Vue.addRoutetoDashboard({
      path: "manage-pricing",
      component: page,
      meta: {
        breadcrumb: {
          text: "Manage Pricing",
          to: "/manage-pricing",
        },
      },
      children: [
        {
          path: "",
          redirect: "items",
        },
        {
          path: "product",
          component: pricingTabs,
          meta: {
            breadcrumb: {
              text: "Product",
              to: "/manage-pricing/product",
            },
          },
          name: "product",
        },
        {
          path: "tags",
          component: pricingTabs,
          meta: {
            breadcrumb: {
              text: "Tags",
              to: "/manage-pricing/tags",
            },
          },
          name: "tags",
        },
        {
          path: "items",
          component: pricingTabs,
          meta: {
            breadcrumb: {
              text: "Items",
              to: "/manage-pricing/items",
            },
          },
          name: "items",
        },
        {
          path: "activity",
          component: pricingTabs,
          meta: {
            breadcrumb: {
              text: "Activity",
              to: "/manage-pricing/activity",
            },
          },
          name: "activity",
        },
        {
          path: "/manage-pricing/create-flavor",
          component: createFlavor,
          meta: {
            breadcrumb: {
              text: "Create Flavor",
              to: "/manage-pricing/create-flavor",
            },
          },
        },
        {
          path: "/manage-pricing/create-product",
          component: create,
          meta: {
            breadcrumb: {
              text: "Create Product",
              to: "/manage-pricing/create-product",
            },
          },
        },
        {
          path: "/manage-pricing/create-tags",
          component: createTags,
          meta: {
            breadcrumb: {
              text: "Create Tags",
              to: "/manage-pricing/create-tags",
            },
          },
        },
        {
          path: "/manage-pricing/edit-flavor/:name/:id",
          component: editFlavor,
          meta: {
            breadcrumb: {
              text: "Edit Flavor",
              to: "/manage-pricing/edit-flavor/:name/:id",
            },
          },
        },
        {
          path: "/manage-pricing/detail-flavor/:name/:id",
          component: detailFlavor,
          meta: {
            breadcrumb: {
              text: ":name",
              to: "/manage-pricing/detail-flavor/:name/:id",
            },
          },
        },
        {
          path: "/manage-pricing/detail-product/:name/:id",
          component: detailProduct,
          meta: {
            breadcrumb: {
              text: ":name",
              to: "/manage-pricing/detail-product/:name/:id",
            },
          },
        },
        {
          path: "/manage-pricing/create-service/:name/:id",
          component: createService,
          meta: {
            breadcrumb: {
              text: "Create Service",
              to: "/manage-pricing/create-service/:name/:id",
            },
          },
        },
        {
          path: "/manage-pricing/edit-service/:nameProduct/:idProduct/:nameService/:idService",
          component: editService,
          meta: {
            breadcrumb: {
              text: "Edit Service",
              to: "/manage-pricing/edit-service/:nameProduct/:idProduct/:nameService/:idService",
            },
          },
        },
        {
          path: "/manage-pricing/add-item",
          component: createItem,
          meta: {
            breadcrumb: {
              text: "Create Item",
              to: "/manage-pricing/add-item",
            },
          },
        },
        {
          path: "/manage-pricing/update-item/:name/:id",
          component: editItem,
          meta: {
            breadcrumb: {
              text: "edit Item",
              to: "/manage-pricing/update-item/:name/:id",
            },
          },
        },
      ],
    });
  },
};
