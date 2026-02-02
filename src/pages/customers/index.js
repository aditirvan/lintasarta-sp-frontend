import customers from './customers';
export default {
    // called by Vue.use(FirstPlugin)
    install(children, pagesMenu) {
        children.push({path: "customers", name: "customers", component: customers})
        pagesMenu.push({path: "customers", name: "customers", title: "Customers", sort:3 })
    }
 }