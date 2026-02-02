import mailboxlog from './mailbox-log'
import main from './main.vue'
import { SUPERADMINMANAGEMAILBOX } from './namespace'
import store from './store'
export default {
  install(Vue) {
    Vue.addModules({ [SUPERADMINMANAGEMAILBOX]: store })
    Vue.addRoutetoDashboard({
      path: "mailbox-log",
      component: main,
      meta: {
        breadcrumb: {
          text: 'Mailbox Log',
          to: '/mailbox-log',
        },
      },
      children: [
        {
          path: '',
          name: "superadmin-managemailbox",
          component: mailboxlog
        },

      ]
    })
  }
}