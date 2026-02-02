import customers from './customers';
export default {
    // called by Vue.use(FirstPlugin)
    install(children, pagesMenu) {
        pagesMenu;
        children.push({path: "customers2", name: "customers2", component: customers})
        // pagesMenu.push({path: "customers2", name: "customers2", title: "Customers2", sort:2 })
    }
 }