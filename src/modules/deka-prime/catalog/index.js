import store from "./store";
import page from "./page";
import catalogTabs from "./catalog-tabs.vue";
import catalog from "./catalog.vue";
import beforeenterpermission from "../../../lib/beforeenterpermission";
import beforeselectfirst from "../../../lib/beforeselectfirst";
import handlepermissionprivilages from "../../../lib/handlepermissionprivilages";
import { CATALOG } from "./namespace";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [CATALOG]: store });
    Vue.addRoutetoDashboard({
      path: "catalog",
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
          to: "/catalog",
          text: "Catalog",
        },
      },
      children: [
        {
          path: "/",
          component: catalog,
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
          path: "/catalog-detail/:idCatalog",
          name: "catalog-detail",
          component: catalogTabs,
          meta: {
            breadcrumb: {
              to: "/catalog-detail/:idCatalog",
              text: ":idCatalog",
            },
          },
        },
      ],
    });

    VueEvent.listen("after-store-created", (store) => {
      store.commit("ROLEPERMISSION/addmenumodulepermission", {
        header: "DEKA PRIME",
        headerno: 2,
        name: "Catalog",
        link: "catalog",
        icon: "imagesIcon",
        sort: 4,
        permission: ["catalog-sidemenu"],
      });
      store.commit("ROLEPERMISSION/addpermissions", ["catalog-view"]);
    });
  },
};
