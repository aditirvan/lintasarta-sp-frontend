import storage from './storage'
import create from './create'
import main from './main'
import { STORAGE } from './namespace'
import { store } from './store'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'
import checkopenstack from "@/lib/checkopenstack";

export default {
    install(Vue, { VueEvent }) {
        Vue.addModules({ [STORAGE]: store })
        Vue.addRoutetoDashboard({
            path: 'storage',
            component: main,
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'Storage', 'disable', false)()
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
                permission: ['instance-view'],
                breadcrumb: {
                    text: 'Storage',
                    to: '/storage',
                },
            },
            children: [
                {
                    path: "", meta: {

                    }, component: storage
                },
                {
                    beforeEnter: (to, from, next) => {
                        handlepermissionprivilages(Vue, next, 'Storage', 'editor', true)().then(()=>{
                            next()
                        }).catch(()=>{
                            if(from.path == '/'){
                              next('/')
                            }
                          })
                    },
                    path: "create", meta: {
                        breadcrumb: {
                            text: 'Create Storage',
                            to: '/storage/create',
                        },
                    }, component: create
                }
            ]

        })
        VueEvent.listen('after-store-created', (store) => {
            store.commit('ROLEPERMISSION/addmenumodulepermission',
                {
                    header: 'DEKA FLEXI', headerno: 1,
                    name: 'Storage', link: 'storage', icon: 'storageIcon', sort: 2, permission: ['storage-sidemenu']
                }
            )
            store.commit('ROLEPERMISSION/addpermissions', ['storage-view'])
        })
    }
}