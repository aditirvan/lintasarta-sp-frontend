import main from './main.vue'

export default {
  // called by Vue.use(FirstPlugin)
  install(Vue, options) {
    Vue;
    options;
    Vue.routes = []
    Vue.modules = {}
    Vue.addModules = function (module) {
      this.modules = {...this.modules, ...module}
    }
    Vue.addRoutes = function (route) {
      this.routes.push(route)
    }
    const children = []

    Vue.addRoutes({
      path: "/", component: main, meta: {
        requiresAuth: true
      },
      children
    })
    Vue.addRoutetoDashboard = function (route) {
      children.push(route)
    }
    var context = require.context('./', true, /index.(js|ts)$/);
    context.keys().forEach(element => {
      if (element != './index.js') {
        const module = require("" + element).default
        Vue.use(module, options)
      }
    })
  }
}