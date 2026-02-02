import signup from './create-organization'
import {NAMESPACE} from './namespace'
import store from './store'

export default {
  install(Vue) {
    Vue.addModules({[NAMESPACE]: store})
    Vue.addRoutes({
      path: '/create-organization',
      component: signup,
    })
  }
}