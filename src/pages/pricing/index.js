import solution from './solution';
export default {
    // called by Vue.use(FirstPlugin)
    install(children, pagesMenu) {
        children.push({path: "pricing", name: "pricing", component: solution, meta: {
            requiresAuth:true
        }})
        pagesMenu.push({path: "pricing", name: "pricing", title: "Pricing", sort:4 })
    }
 }