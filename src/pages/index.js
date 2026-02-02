import pages from './pages'
export default {
    // called by Vue.use(FirstPlugin)
    install(Vue, options) {
        
        Vue;
        options;
        const children = [];
        var context = require.context('./', true, /index.js$/);
        const pagesMenu = []
        context.keys().forEach(element => {
            if(element != './index.js'){
                const page = require(""+element).default
                page.install(children, pagesMenu)
            }
        })

        Vue.modules = {
            ...Vue.modules,
            PAGES : {
                namespaced: true,
                state: {
                    pagesMenu
                },
                getters:{
                    pagesMenu: state => state.pagesMenu
                }
            }
        }

        Vue.routes.push({path: "/pages", component: pages, children})
    }
 }