import agentPage from "@/modules/instance/instance_detail/agent";
import selectInstance from "@/modules/project/resource/instance";
import resource from "@/modules/deka-agent/resource";
import { AGENT } from './namespace'
import store from './store'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'

export default {
    install(Vue, { VueEvent }) {
        Vue.addModules({ [AGENT]: store })
        Vue.addRoutetoDashboard({
            path: 'deka-agent',
            component: resource,
            beforeEnter: (to, from, next) => {
                beforeenterpermission(Vue, next, 'Deka Agent', 'disable', false)().then(()=>{
                    return beforeselectfirst(Vue)()
                }).then(()=>{
                    next()
                }).catch(()=>{
                    if(from.path == '/'){
                      next('/')
                    }
                  })
            },
            meta: {
                permission: ['deka-agent-view'],
                breadcrumb: {
                    to: '/deka-agent',
                    text: 'Deka Agent'
                }

            },
            children: [
                {
                    path: '/',
                    component: resource,
                },

            ]
        })
    },
}
