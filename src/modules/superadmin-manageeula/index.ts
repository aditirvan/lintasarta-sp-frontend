import main from './main.vue'
import manageeula from './manageeula.vue'
import detaileula from './detaileula.vue'
import { iVue } from '../type'
import {MANAGEEULA} from './namespace'
import store from './store'
export default{
    install(Vue:iVue){
        Vue.addModules({
            [MANAGEEULA]:store
        })
        Vue.addRoutetoDashboard({
            path: "manage-eula",
            component: main,
            meta:{
                breadcrumb: {
                    text: 'Manage EULA',
                    to: '/manage-eula',
                },
            },
            children:[
                {
                    path:'',
                    component: manageeula
                },
                {
                  path: '/eula-detail/:eulaid',
                  component: detaileula,
                  meta: {
                    breadcrumb: {
                      text: 'Edit EULA',
                      to: '/eula-detail/:eulaid'
                    }
                  },
                  children: [
                    {
                      path: '', component: detaileula,
                      name: 'eula-detail-eulaid'
                    },
                  ]
                }
            ]
        })
    }
}