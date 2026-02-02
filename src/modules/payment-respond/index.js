import main from "./main";

export default {
  install(Vue) {
    Vue.addRoutes({
      path: "/payment-response",
      component: main,
    });
  },
};
