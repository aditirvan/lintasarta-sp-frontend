import { IDRformat, Rpformat, Fformat } from '@/lib/formatter'
import { FormatDate, FormatDateTime } from '@/lib/formatDate'
import { formatSize } from '@/lib/formatSize'

export default {
  install(Vue) {
    Vue.prototype.$IDRformat = IDRformat
    Vue.prototype.$Rpformat = Rpformat
    Vue.prototype.$Fformat = Fformat
    Vue.prototype.$FormatDate = FormatDate
    Vue.prototype.$FormatDateTime = FormatDateTime
    Vue.prototype.$formatSize = formatSize
  }
}