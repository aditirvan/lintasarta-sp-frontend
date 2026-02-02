const components = require.context('./', true, /\.vue$/i,'lazy');
export default{
    install(Vue){
        components.keys().forEach((componentFilePath) => {
            const componentName = componentFilePath.split('/').pop().split('.')[0];
            Vue.component(componentName, () => components(componentFilePath));
        })
    }
}