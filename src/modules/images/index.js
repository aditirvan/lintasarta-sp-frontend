
// import main from './main'
import images from './images'
import snapshot from './snapshot'
import backups from './backups'
import customimage from './customimage.vue'
import restore from './restore.vue'
import {IMAGES, IMAGESBILLING} from './namespace'
import store from './store'
import storeBilling from './store-billing'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import checkopenstack from "@/lib/checkopenstack";

export default {
    install(Vue, { VueEvent }) {
        Vue;
        Vue.addModules({[IMAGES]:store})
        Vue.addModules({ [IMAGESBILLING] : storeBilling})
        Vue.addRoutetoDashboard({
            path: 'image',
            component: images,
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'Images', 'disable', false)()
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
                    text: 'Image',
                    to: '/image',
                },
            },
            children: [
                { path: '', redirect: 'snapshot' },
                {
                    path: 'snapshot', component: snapshot,
                    meta: {
                        breadcrumb: {
                            text: 'Snapshot',
                            to: '/image/snapshot',
                        },
                    },
                    name: 'snapshot'

                },
                {
                    path: 'backups', component: backups,
                    meta: {
                        breadcrumb: {
                            text: 'Backups',
                            to: '/image/backups',
                        },
                    },
                },
                {
                    path: 'restore', component: restore,
                    meta: {
                        breadcrumb: {
                            text: 'Restore',
                            to: '/image/restore',
                        },
                    },
                },
                {
                    path: 'customimage', component: customimage,
                    meta: {
                        breadcrumb: {
                            text: 'Custom Image',
                            to: '/image/customimage',
                        },
                    },

                },


            ]
        })
        VueEvent.listen('after-store-created', (store) => {
            store.commit('ROLEPERMISSION/addmenumodulepermission',
                {
                    header: 'DEKA FLEXI', headerno: 1,
                    name: 'Images', link: 'image/snapshot', icon: 'imagesIcon', sort: 3, permission: ['images-sidemenu']
                }
            )
            store.commit('ROLEPERMISSION/addpermissions', ['images-view'])
        })
    }
}