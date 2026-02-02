import component from './create-new-project'
import { NAMESPACE } from './namespace'
import store from './store'

export default {
  install(Vue) {
    Vue.addModules({[NAMESPACE]: store})
    Vue.addRoutes({
      path: '/create-new-project',
      component: component,
    })
  }
}