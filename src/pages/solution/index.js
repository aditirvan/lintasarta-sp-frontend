import solution from './solution';
export default {
    // called by Vue.use(FirstPlugin)
    install(children, pagesMenu) {
        children.push({path: "solution", name: "solution", component: solution, meta: {
            requiresAuth:true
        }})
        pagesMenu.push({path: "solution", name: "solution", title: "Solution", sort:2 })
    }
 }