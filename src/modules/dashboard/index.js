import dashboard from './DashboardLayout'

export default {
  install(Vue) {
    Vue.component('DASHBOARD', dashboard)
    const DASHBOARD = {
      namespaced: true,
      state: {
        drawer: true,
        menu: [
          {
            header: 'MANAGE',
            headerno: 2,
            list: [
              {name: 'Instance', link: 'instance', icon: 'instanceIcon', sort: 7},
              {name: 'Storage', link: 'image', icon: 'storageIcon', sort: 6},
              {name: 'Object Storage', link: 'storage', icon: 'objectstorageIcon', sort: 5},
              {name: 'Images', link: 'network', icon: 'imagesIcon', sort: 4},
              {name: 'Network', link: 'security', icon: 'networkIcon', sort: 3},
              {name: 'Security', link: 'monitoring', icon: 'securityIcon', sort: 2},
              {name: 'Alerting', link: 'alerting', icon: 'alertingIcon', sort: 1}
            ],
          },

          {
            header: 'BILLING',
            headerno: 3,
            list: [
              {name: 'Billing', link: 'billing', icon: 'billingIcon'},
              // {name: 'Billing Payment', link: '/billing/payment', icon: 'billingPaymentIcon'}
            ]
          }
        ],
        dashboardComponent: {},
        customMenu: [],
        navCustomMenu: [],
        dashboardoverlay: false,
        opendialogdonthavepermission: false,
        opendialogreachlimit: false,
        opendialogbalance: '',
        opendialogbalancemsg: '',
        opendialoghavebeensubmitted: false,
        opendialogcommonwarning: false,
        titlecommonwarning: 'Error',
        messagecommonwarning: '',
        opendialogcommonsuccess: false,
        messagecommonsuccess: 'Your data has been submitted. Please wait if the data has not appeared',
        openDialogDekaPrime: false,

      },
      getters: {
        menu: state => {
          const res = state.menu.slice().sort((a, b) => {
            return a.headerno - b.headerno
          })
          res.forEach(menu => {
            menu.list.sort((a, b) => {
              return a.sort - b.sort
            })
          });
          return res
        },
        dashboardComponent: state => state.dashboardComponent,
        customMenu: state => state.customMenu,
        navCustomMenu: state => state.navCustomMenu,
        dashboardoverlay: state => state.dashboardoverlay,
        getopendialogdonthavepermission: state => state.opendialogdonthavepermission,
        getOpenDialogDekaPrime: state => state.openDialogDekaPrime
        
      },
      mutations: {
        setdrawer(state, payload) {
          state.drawer = payload
        },
        triggerdrawer(state) {
          state.drawer = !state.drawer
        },
        addMenu(state, menu) {
          const group = state.menu.filter(e => e.header == menu.header)
          if (group[0]) {
            group.list.push()
          } else {
            state.menu.push({
              header: menu.header,
              headerno: menu.headerno,
              list: [menu]
            })
          }
        },
        setDashboardBreadcrumb(state, component_name) {
          state.dashboardComponent['breadcrumbs'] = component_name
        },
        addCustomMenu(state, menu) {
          state.customMenu.push(menu)
        },
        addNavCustomMenu(state, menu) {
          state.navCustomMenu.push(menu)
        },
        setDashboardoverlay(state, value) {
          state.dashboardoverlay = value
        },
        setopendialogdonthavepermission: (state, payload) => state.opendialogdonthavepermission = payload,
        setopendialogreachlimit: (state, payload) => state.opendialogreachlimit = payload,
        setopendialogbalance: (state, payload) => state.opendialogbalance = payload,
        setopendialogbalancemsg: (state, payload) => state.opendialogbalancemsg = payload,
        setopendialoghavebeensubmitted: async (state, payload) => {

          state.opendialoghavebeensubmitted = payload

        },
        setopendialogcommonwarning: (state, payload) => state.opendialogcommonwarning = payload,
        setmessagecommonwarning: (state, payload) => state.messagecommonwarning = payload,
        settitlecommonwarning: (state, payload) => state.titlecommonwarning = payload,
        
        setopendialogcommonsuccess: (state, payload) => state.opendialogcommonsuccess = payload,
        setmessagecommonsuccess: (state, payload) => state.messagecommonsucees = payload,
        setOpenDialogDekaPrime: (state, payload) => state.openDialogDekaPrime = payload,
      },
      actions : {
        showCommonWarning: ({ commit, dispatch }, payload = { title: 'Error', message: null }) => {
          commit('settitlecommonwarning', payload.title)
          commit('setmessagecommonwarning', payload.message)
          commit('setopendialogcommonwarning', true)
        },
        hideCommonWarning: ({ commit, dispatch }) => {
          commit('settitlecommonwarning', 'Error')
          commit('setmessagecommonwarning', null)
          commit('setopendialogcommonwarning', true)
        },
      }
    }
    Vue.addModules({DASHBOARD})
    // const children = []
    // Vue.addRoutes({path: "/dashboard", name:'dashboard', component: dashboard, meta :{
    //     requiresAuth:true
    // },
    // children
    // })
    // Vue.addRoutetoDashboard = function(route){
    //     children.push(route)
    // }

  }
}
