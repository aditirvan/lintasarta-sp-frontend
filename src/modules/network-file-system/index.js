import NFSList from "./list.vue";
import NFSDetail from "./detail.vue";
import NFSCreate from "./create.vue";
import main from "./main.vue";
import { NFS } from "./namespace";
import empty from './empty'
import store from "./store";
import beforeenterpermission from "../../lib/beforeenterpermission";
import beforeselectfirst from "../../lib/beforeselectfirst";
import checkopenstack from "@/lib/checkopenstack";
import handlepermissionprivilages from "../../lib/handlepermissionprivilages";

export default {
  install(Vue, { VueEvent }) {
    Vue.addModules({ [NFS]: store });
    Vue.addRoutetoDashboard({
      path: "network-file-system",
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, "NFS", "disable", false)()
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
      component: main,
      meta: {
        breadcrumb: {
          to: "/network-file-system",
          text: "NFS",
        },
      },
      children: [
        {
          path: "/",
          component: NFSList,
        },
        {
          beforeEnter: (to, from, next) => {
            handlepermissionprivilages(Vue, next, "NFS", "editor", true)()
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
          component: NFSCreate,
          meta: {
            breadcrumb: {
              text: "Create",
              to: "/network-file-system/create",
            },
          },
        },
        {
          path: ":id",
          component: NFSDetail,
          meta: {
            breadcrumb: {
              to: "/network-file-system/:id",
              text: "Detail",
            },
          },
          children: [
            { path: '', redirect: 'client' },
            { path: 'overview', component: empty },
            { path: 'client', component: empty }
          ]
        },
      ],
    })
    VueEvent.listen("after-store-created", (store) => {
      store.commit("ROLEPERMISSION/addmenumodulepermission", {
        header: "STORAGE",
        headerno: 3,
        name: "Deka NFS",
        link: "network-file-system",
        icon: "nfsIcon",
        sort: 2,
        permission: ["network-file-system-sidemenu"],
      });
      store.commit("ROLEPERMISSION/addpermissions", ["network-file-system-view"]);
    });
  },
};




