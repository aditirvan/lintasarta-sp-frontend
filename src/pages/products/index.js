import products from './products';
export default {
    // called by Vue.use(FirstPlugin)
    install(children, pagesMenu) {
        children.push({path: "products", name: "products", component: products})
        pagesMenu.push({path: "products", name: "products", title: "Products", sort:1 })
    }
 }