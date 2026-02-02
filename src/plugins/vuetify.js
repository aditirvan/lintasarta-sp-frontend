import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

let icon = {}
const ComponentContext = require.context('@/components/icons', true, /\.vue$/i, 'lazy');
ComponentContext.keys().forEach((componentFilePath) => {
  const componentName = componentFilePath.split('/').pop().split('.')[0];
  icon[componentName] = {component : componentName}
  Vue.component(componentName, () => ComponentContext(componentFilePath));
})

import '@mdi/font/css/materialdesignicons.css' 

export default new Vuetify({
    customProperties: true,
    icons: {
      iconfont: 'mdiSvg',
      values : {
        ...icon
      }
    },
    theme: {
        themes: {
          light: {
            primary: '#1F60A8',
            secondary: '#2388C9',
            accent: '#A5B3BF',
            error: '#EB5757',
            info: '#2196F3',
            success: '#46C27A',
            warning: '#FFC107',
            darkblue: '#1F60A8',
            background: '#1F60A8',
            font:'#556272'
          },
          dark:{
            'background': '#1F60A8'
          }
        },
      },
});
