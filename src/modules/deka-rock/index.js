import OpenShiftList from "./list.vue";
import OpenShiftDetail from "./detail.vue";
import OpenShiftCreate from "./create.vue";
import main from "./main";
import { DEKAROCK, DEKAROCKBILLING } from "./namespace";
import store from "./store";
import billingStore from "./store-billing";
import beforeenterpermission from "../../lib/beforeenterpermission";
import beforeselectfirst from "../../lib/beforeselectfirst";
import checkopenstack from "@/lib/checkopenstack";
import handlepermissionprivilages from "../../lib/handlepermissionprivilages";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [DEKAROCK]: store });
    Vue.addModules({ [DEKAROCKBILLING]: billingStore });
    Vue.addRoutetoDashboard({
      path: "deka-rock",
      component: main,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, "Dekarock", "disable", false)()
          .then(() => {
            return beforeselectfirst(Vue)();
          })
          .then(() => {
            return checkopenstack(Vue)();
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
          to: "/deka-rock",
          text: "Deka ROCK",
        },
      },
      children: [
        {
          path: "/",
          component: OpenShiftList,
        },
        {
          beforeEnter: (to, from, next) => {
            handlepermissionprivilages(Vue, next, "Dekarock", "editor", true)()
              .then(() => {
                next();
              })
              .catch(() => {
                if (from.path == "/") {
                  next("/");
                }
              });
          },
          path: "create",
          component: OpenShiftCreate,
          meta: {
            breadcrumb: {
              text: "Create",
              to: "/deka-rock/create",
            },
          },
        },
        {
          path: ":id",
          component: OpenShiftDetail,
          meta: {
            breadcrumb: {
              to: "/deka-rock/:id",
              text: "Detail",
            },
          },
        },
      ],
    }),
      VueEvent.listen("after-store-created", (store) => {
        store.commit("ROLEPERMISSION/addmenumodulepermission", {
          header: "PLATFORM",
          headerno: 5,
          name: "Deka ROCK",
          link: "deka-rock",
          icon: "openshiftIcon",
          sort: 2,
          permission: ["dekarock-sidemenu"],
        });
        store.commit("ROLEPERMISSION/addpermissions", ["dekarock-view"]);
      });
  },
};
