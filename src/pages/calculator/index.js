import calculator from './calculator';
export default {
    install(children, pagesMenu) {
        children.push({path: "calculator", name: "calculator", component: calculator})
        pagesMenu.push({path: "calculator", name: "calculator", title: "Calculator", sort:5 })
    }
 }