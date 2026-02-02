import ticketing from './ticketing.vue'
import page from './page.vue'
import create from './create.vue'
import ticketDetail from './tiket-detail.vue'
import history from './history.vue'
import { TICKET } from './namespace'
import { iVue } from '../type'
import store from './store'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import checkopenstack from "@/lib/checkopenstack";

export default {
    install(Vue: iVue, Event: any) {
        Vue.addModules({ [TICKET]: store })
        Vue.addRoutetoDashboard({
            path: 'ticket',
            component: page,
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'Ticket', 'disable', false)()
                .then(()=>{
                    return beforeselectfirst(Vue)()
                })
                .then(() => {
                  return checkopenstack(Vue)();
                })
                .then(()=>{
                    next()
                })
                .catch(()=>{
                    if(from.path == '/'){
                      next('/')
                    }
                  })
            },
            meta: {
                breadcrumb: {
                    to: '/ticket',
                    text: 'Ticket'
                },
            },
            children: [
                {
                    path: '/',
                    component: ticketing,

                },

                {
                    path: 'create-ticket',
                    component: create,
                    meta: {
                        breadcrumb: {
                            to: '/ticket/create-ticket',
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
                    path: '/ticket-detail/:ticketid',
                    component: ticketDetail,
                    meta: {
                      breadcrumb: {
                        text: 'Ticket Detail',
                        to: '/ticket-detail/:ticketid'
                      }
                    },
                },
                {
                    path: 'history',
                    component: history,
                    meta: {
                        breadcrumb: {
                            to: '/ticket/history',
                            text: 'Ticket History'
                        }
                    }
                }
            ]

        })
        Event.VueEvent.listen('after-store-created', (store: any) => {
            store.commit('ROLEPERMISSION/addmenumodulepermission',
            {
                header: 'SUPPORT', headerno: 9,
                name: 'List Ticket', link: 'ticket', icon: 'managetiketIcon', sort: 1, permission: ['ticket-sidemenu']
            })
        })
    }
}