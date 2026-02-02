import page from "./page";

import store from "./store";
import listDekapop from "./pop_list.vue";
import listDekapopDetail from "./detail.vue";
import { POP } from "./namespace";
import beforeenterpermission from "../../lib/beforeenterpermission";
import beforeselectfirst from "../../lib/beforeselectfirst";
import handlepermissionprivilages from "../../lib/handlepermissionprivilages";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [POP]: store });
    Vue.addRoutetoDashboard({
      path: "dekapop-list",
      component: page,

      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, "Deka POP List", "disable", false)()
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
          to: "/dekapop-list",
          text: "Deka POP List",
        },
      },
      children: [
        {
          path: "/",
          component: listDekapop,
        },
        {
          path: "/dekapop-list/detail/:id",
          name: "dekapop-list-detail",
          component: listDekapopDetail,
          meta: {
            breadcrumb: {
              to: "/dekapop-list/detail/:id",
              text: "Deka POP List",
            },
          },
        },


      ],
    });
    // VueEvent.listen("after-store-created", (store) => {
    //   store.commit("ROLEPERMISSION/addmenumodulepermission", {
    //     header: "SOFTWARE",
    //     headerno: 9,
    //     name: "Deka POP List",
    //     link: "dekapop-list",
    //     icon: "dekapopIcon",
    //     sort: 1,
    //     permission: ["deka-pop-list-sidemenu"],
    //   });
    //   store.commit("ROLEPERMISSION/addpermissions", ["deka-pop-list-view"]);
    // });
  },
};
