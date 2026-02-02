import { iVue } from "../type";
import manualPayment from "./manual-payment.vue";
import main from "./main.vue";
import { MANUALPAYMENT } from "./namespace";
import store from "./store";

export default {
  install(Vue: iVue) {
    Vue.addModules({ [MANUALPAYMENT]: store });
    Vue.addRoutetoDashboard({
      path: "manual-payment",
      component: main,
      meta: {
        breadcrumb: {
          to: "/manual-payment",
          text: "Manual Payment",
        },
      },
      children: [
        {
          path: "/",
          component: manualPayment,
          name: "manual-payment",
        },
      ],
    });
  },
};
