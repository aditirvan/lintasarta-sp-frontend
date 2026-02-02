const path = require("path");
const ScriptSetup = require('unplugin-vue2-script-setup/webpack').default

module.exports = {
  pages:{
    index: {
      entry: './src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
     },
    downloadtable:{
      entry: './src/app/downloadpdf/index.js',
       template: './src/app/downloadpdf/index.html',
       filename: 'download',
    },
    downloadinvoice:{
      entry: './src/app/downloadinvoice/index.js',
       template: './src/app/downloadinvoice/index.html',
       filename: 'download-invoice',
    },
    dekaagent:{
      entry: './src/app/deka-agent/index.js',
       template: './src/app/deka-agent/index.html',
       filename: 'iframe-nodata.html',
    },
    signup:{
      entry: './src/app/sign-up/index.js',
       template: './src/app/sign-up/index.html',
       filename: 'iframe-signup.html',
    }
  },
  "transpileDependencies": [
    "vuetify"
  ],
  parallel: false,
  configureWebpack: {
    resolve:{
      alias:{
        '@': path.resolve(__dirname, './src'),
        '@project': path.resolve(__dirname, 'src/lib/project.ts'),
      }
    },
    plugins: [
      ScriptSetup({}),
    ],
  },
  chainWebpack(config) {
    // disable type check and let `vue-tsc` handles it
    config.plugins.delete('fork-ts-checker')
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/scss/text-field-outline.scss";
          @import "@/scss/data-table-padding.scss";
          @import "@/scss/mediaquery.scss";
        `
      }
    }
  }
}