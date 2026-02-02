import moment from 'moment'
import 'moment/locale/id'

export default {
  install(Vue) {
    moment.locale('id')
    Vue.prototype.$moment = moment
  }
}