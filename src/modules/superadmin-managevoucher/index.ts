import main from './main.vue'
import create from './create.vue'
import detail from './detail.vue'
import createCredit from './createCredit.vue'
import detailCredit from './detailCredit.vue'
import editCredit from './editCredit.vue'
import createDiscount from './createDiscount.vue'
import detailDiscount from './detailDiscount.vue'
import editDiscount from './editDiscount.vue'
import managevoucher from './managevoucher.vue'
import { iVue } from '../type'
import {MANAGEVOUCHER} from './namespace'
import store from './store'
export default{
    install(Vue:iVue){
        Vue.addModules({
            [MANAGEVOUCHER]:store
        })
        Vue.addRoutetoDashboard({
            path: "manage-voucher",
            component: main,
            meta:{
                breadcrumb: {
                    text: 'Manage Voucher',
                    to: '/manage-voucher',
                },
            },
            children:[
                {
                    path:'',
                    component: managevoucher,
                    name: "superadmin-voucher",
                },

                {
                    path:'trial',
                    component: main,
                    meta: {
                        breadcrumb: {
                          text: 'Trial',
                          to: '/manage-voucher/trial',
                        }
                    },
                    children: [
                        { path: '', component: managevoucher },
                        {
                            path: "create",
                            component: create,
                            meta: {
                                breadcrumb: {
                                to: "/manage-voucher/trial/create",
                                text: "Create Voucher Trial",
                                },
                            },
                        },
                        {
                            path: ":id/detail",
                            component: detail,
                            meta: {
                                breadcrumb: {
                                to: "/manage-voucher/trial/:id/detail",
                                text: "Detail Voucher Trial",
                                },
                            },
                        },
                    ]
                },

                {
                    path:'credit',
                    component: main,
                    meta: {
                        breadcrumb: {
                          text: 'Credit',
                          to: '/manage-voucher/credit',
                        }
                    },
                    children: [
                        { path: '', component: managevoucher },
                        {
                            path: "create",
                            component: createCredit,
                            meta: {
                                breadcrumb: {
                                to: "/manage-voucher/credit/create",
                                text: "Create Voucher Credit",
                                },
                            },
                        },
                        {
                            path: ":id/detail",
                            component: detailCredit,
                            meta: {
                                breadcrumb: {
                                to: "/manage-voucher/credit/:id/detail",
                                text: "Detail Voucher Credit",
                                },
                            },
                        },
                        {
                            path: ":id/edit",
                            component: editCredit,
                            meta: {
                                breadcrumb: {
                                to: "/manage-voucher/credit/:id/edit",
                                text: "Edit Voucher Credit",
                                },
                            },
                        }
                    ]
                },

                {
                    path:'discount',
                    component: main,
                    meta: {
                        breadcrumb: {
                          text: 'Discount',
                          to: '/manage-voucher/discount',
                        }
                    },
                    children: [
                        { path: '', component: managevoucher },
                        {
                            path: "create",
                            component: createDiscount,
                            meta: {
                                breadcrumb: {
                                to: "/manage-voucher/discount/create",
                                text: "Create Voucher Discount",
                                },
                            },
                        },
                        {
                            path: ":id/detail",
                            component: detailDiscount,
                            meta: {
                                breadcrumb: {
                                to: "/manage-voucher/discount/:id/detail",
                                text: "Detail Voucher Discount",
                                },
                            },
                        },
                        {
                            path: ":id/edit",
                            component: editDiscount,
                            meta: {
                                breadcrumb: {
                                to: "/manage-voucher/discount/:id/edit",
                                text: "Edit Voucher Discount",
                                },
                            },
                        }
                    ]
                },
            ]
        })
    }
}