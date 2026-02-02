import store from "./store";
import page from "./page";
import importVue from "./import.vue";
import { IMPORT } from "./namespace";

export default {
  install(Vue) {
    Vue.addModules({ [IMPORT]: store });
    Vue.addRoutetoDashboard({
      path: "import",
      component: page,
      meta: {
        breadcrumb: {
          to: "/import",
          text: "Import Deka Prime",
        },
      },
      children: [
        {
          path: "/",
          component: importVue,
        },
      ],
    });
  },
};
