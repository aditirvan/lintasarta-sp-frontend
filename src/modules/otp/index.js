import main from "./main";
import OtpInput from "@bachdgvn/vue-otp-input";

export default {
  install(Vue) {
    Vue.component("bach-otp-input", OtpInput);
    Vue.addRoutes({
      path: "/otp",
      component: main,
      beforeEnter: (to, from, next) => {
        const hasToken = localStorage.getItem("token");

        if (!hasToken) {
          next("/"); // Redirect to the login page
        } else {
          next()
        }
        
      },
    });
  },
};