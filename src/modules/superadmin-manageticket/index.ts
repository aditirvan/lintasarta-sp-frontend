import manageticket from './manageticket.vue'
import page from './page.vue'
import create from './create.vue'
import history from './history.vue'
import detailTicket from './detail-ticket.vue'
import { TICKET } from './namespace'
import { iVue } from '../type'
import store from './store'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import checkopenstack from "@/lib/checkopenstack";

export default {
    install(Vue: iVue, {VueEvent}) {
        Vue.addModules({ [TICKET]: store })
        Vue.addRoutetoDashboard({
            path: 'manage-ticket',
            component: page,
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'Ticket', 'disable', false)()
                .then(() => {
                    return beforeselectfirst(Vue)()
                })
                .then(() => {
                  return checkopenstack(Vue)();
                })
                .then(()=>{
                    next()
                })
                .catch(() => {
                    if (from.path == '/') {
                        next('/')
                    }
                })
            },
            meta: {
                breadcrumb: {
                    to: '/manage-ticket',
                    text: 'Ticket'
                },
            },
            children: [
                {
                    path: '/',
                    component: manageticket,

                },

                {
                    path: 'create-ticket',
                    component: create,
                    meta: {
                        breadcrumb: {
                            to: '/manage-ticket/create-ticket',
                            text: 'Create Ticket'
                        }
                    },
                    beforeEnter: (to, from, next) => {
                        beforeenterpermission(Vue, next, 'Ticket', 'editor', true)().then(() => {
                            next()
                        }).catch(() => {
                            if (from.path == '/') {
                                next('/')
                            }
                        })
                    },
                },
                {
                    path: '/detail-ticket/:ticketid',
                    component: detailTicket,
                    meta: {
                        breadcrumb: {
                          text: 'Ticket Detail',
                          to: '/detail-ticket/:ticketid'
                        }
                    },
                },
                {
                    path: 'history',
                    component: history,
                    meta: {
                        breadcrumb: {
                            to: '/manage-ticket/history',
                            text: 'Ticket History'
                        }
                    }
                }
            ]

        })
        VueEvent.listen('after-store-created', (store) => {
            store.commit('ROLEPERMISSION/addmenumodulepermission',
            {
                header: 'SUPPORT', headerno: 9,
                name: 'Manage Tickets', link: 'manage-ticket', icon: 'managetiketIcon', sort: 1, permission: ['manageticket-sidemenu']
            })
            store.commit('ROLEPERMISSION/addpermissions', 'manageticket-view')
        })
    }
}