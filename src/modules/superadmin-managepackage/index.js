import Main from './main.vue'
import ManagePackage from './managepackage.vue'
import store from './store'
import { PACKAGE } from './namespace'

export default{
    install(Vue, { VueEvent }){
        Vue.addModules({ [PACKAGE]: store});
        Vue.addRoutetoDashboard({
            path: 'manage-package',
            component: Main,
            meta:{
                breadcrumb: {
                    text: 'Manage Package',
                    to: '/manage-package',
                },
            },
            children:[
                {
                    path: '',
                    component: ManagePackage,
                    // name: ''
                }
            ]
        })
    }
}