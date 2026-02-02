import beforeenterpermission from "../../lib/beforeenterpermission";
import beforeselectfirst from "../../lib/beforeselectfirst";
import checkdbaasuser from "../../lib/checkdbaasuser";
import rdbms from "./rdbms.vue";
import main from "./main";
import { RDBMS } from "./namespace";
import store from "./store";
import checkopenstack from "@/lib/checkopenstack";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({
      [RDBMS]: store,
    });
    Vue.addRoutetoDashboard({
      path: "rdbms",
      component: main,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, "Rdbms", "disable", false)()
          .then(() => {
            beforeselectfirst(Vue)()
              .then(() => {
                return checkdbaasuser(Vue)();
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
          }
          );
      },
      meta: {
        breadcrumb: {
          to: "/rdbms",
          text: "RDBMS",
        },
      },
      children: [{ path: "", component: rdbms }],
    }),
      VueEvent.listen("after-store-created", (store) => {
        store.commit("ROLEPERMISSION/addmenumodulepermission", {
          header: "PLATFORM",
          headerno: 5,
          name: "Database",
          link: "rdbms",
          icon: "databaseIcon",
          sort: 1,
          permission: ["rdbms-sidemenu"],
        });
        store.commit("ROLEPERMISSION/addpermissions", "rdbms-view");
      });
  },
};