import { VOUCHER } from './namespace'
import beforeenterpermission from "../../lib/beforeenterpermission";
import beforeselectfirst from "../../lib/beforeselectfirst";
import store from './store'
import main from './main.vue'
import Voucher from './Voucher'

export default {
    install(Vue){
        Vue.addRoutetoDashboard({
            path: '/voucher',
            component: main,
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'Voucher', 'disable', false)().then(()=>{
                    return beforeselectfirst(Vue)()
                }).then(()=>{
                    next()
                }).catch(()=>{
                    if(from.path == '/'){
                        next('/')
                    }
                })
            },
            meta:{
                breadcrumb: {
                    text: 'Voucher',
                    to: '/voucher',
                },
            },
            children:[
                {
                    path:'',
                    component: Voucher,
                    name: 'Voucher',
                },
                {
                    path:'trial',
                    component: Voucher,
                    meta:{
                        breadcrumb: {
                            text: 'Voucher Trial',
                            to: '/voucher/trial',
                        },
                    },
                },
                {
                    path:'credit',
                    component: Voucher,
                    meta:{
                        breadcrumb: {
                            text: 'Voucher Credit',
                            to: '/voucher/credit',
                        },
                    },
                },
                {
                    path:'discount',
                    component: Voucher,
                    meta:{
                        breadcrumb: {
                            text: 'Voucher Discount',
                            to: '/voucher/discount',
                        },
                    },
                },
            ]
        })
        Vue.addModules({[VOUCHER]: store})
    }
}