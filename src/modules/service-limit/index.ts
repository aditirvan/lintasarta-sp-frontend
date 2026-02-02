import { install } from "vuex";
import { iVue } from "../type";
import { LIMITSERVICE } from "./namespace";
import servicelimit from "./service-limit.vue";
import store from "./store";

export default {
  install(Vue: iVue) {
    Vue.addModules({ [LIMITSERVICE]: store });
    Vue.addRoutetoDashboard({
      path: "/service-limit",
      component: servicelimit,
      meta: {
        breadcrumb: {
          text: "Service Limit",
          to: "/service-limit",
        },
      },
    });
  },
};
