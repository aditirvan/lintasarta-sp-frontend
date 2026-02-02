import manageflavors from './manageflavors.vue'
import managetype from './managetype/managetype.vue'
import managevolumetype from './managevolumetype.vue'
import manageregion from './manageinstanceregion/region.vue'
import manageobjectstorageregion from './manageobjectstorageregion/objectStorageRegion.vue'
import managezone from './manageinstanceregion/managezone/zone.vue'
import createflavor from './createflavor.vue'
import main from './main.vue'
import { MANAGEFLAVOR, MANAGEFLAVORTYPE, MANAGEINSTANCEREGION, MANAGEOBJECTSTORAGEREGION, MANAGEZONE } from './namespace'
import store from './store'
import storeType from './managetype/storeType'
import storeRegion from './manageinstanceregion/storeRegion'
import storeObjectStorageRegion from './manageobjectstorageregion/storeObjectStorageRegion'
import storeZone from './manageinstanceregion/managezone/storeZone'
export default{
    install(Vue){
        Vue.addModules({[MANAGEFLAVOR]: store})
        Vue.addModules({[MANAGEFLAVORTYPE]: storeType})
        Vue.addModules({[MANAGEINSTANCEREGION]: storeRegion})
        Vue.addModules({[MANAGEOBJECTSTORAGEREGION]: storeObjectStorageRegion})
        Vue.addModules({[MANAGEZONE]: storeZone})
        Vue.addRoutetoDashboard({
            path: "manage-pricings",
            component: main,
            meta:{
                breadcrumb: {
                    text: 'Manage Pricing',
                    to: '/manage-pricings',
                },
            },
            children:[
                {
                    path:'',
                    component: manageflavors,
                    name: "superadmin-manageflavor",

                },
                {
                    path:'create',
                    component: createflavor,
                    meta:{
                        breadcrumb: {
                            text: 'Create Instance',
                            to: '/manage-pricing/create',
                        },
                    },
                },
                {
                    path:'edit',
                    component: createflavor,
                    meta:{
                        breadcrumb: {
                            text: 'Edit Flavor',
                            to: '/manage-pricing/edit',
                        },
                    },
                },
                {
                    path:'manage-type',
                    component: managetype,
                    meta:{
                        breadcrumb: {
                            text: 'Manage Type Instance',
                            to: '/manage-pricing/manage-type',
                        },
                    },
                },
                {
                    path:'manage-volume-type',
                    component: managevolumetype,
                    meta:{
                        breadcrumb: {
                            text: 'Manage Volume Type',
                            to: '/manage-pricing/manage-volume-type',
                        },
                    },
                },
                {
                    path:'manage-region',
                    component: manageregion,
                    meta:{
                        breadcrumb: {
                            text: 'Manage Region Instance',
                            to: '/manage-pricing/manage-region',
                        },
                    },                    
                },
                {
                    path:'manage-object-storage-region',
                    component: manageobjectstorageregion,
                    meta:{
                        breadcrumb: {
                            text: 'Manage Region Object Storage',
                            to: '/manage-pricing/manage-object-storage-region',
                        },
                    },
                },
                {
                    path:'manage-region/manage-zone/:region_id',
                    component: managezone,
                    meta:{
                        breadcrumb: {
                            text: 'Manage Zone',
                            to: '/manage-pricing/manage-region/manage-zone/:region_id',
                        },
                    },
                },
            ]
        })
    }
}