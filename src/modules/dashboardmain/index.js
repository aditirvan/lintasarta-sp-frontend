import main from './main'

export default {
  install(Vue) {
    Vue.addRoutetoDashboard({
      path: "",
      component: main,
      name: "main",
      meta: {
        breadcrumb: {
          text: 'Dashboard',
          to: '/',
        },
      },
      // beforeEnter: (to, from, next) => {
      //     // const userpermissions = Vue.store._modules.root._children.ROLEPERMISSION.state.userpermissions
      //     // if(userpermissions.includes('superadmin-view')){
      //     //     next()
      //     // }else if(from.name != 'main' && from.path ==  '/superadmin-dashboard'){
      //     //     next('/superadmin-dashboard')
      //     // }
      //     const userrole =localStorage.getItem('role');
      //     // console.log(userpermissions);
      //     if(userrole=="Superadmin"){
      //         next('/manage-organization')
      //     }else if(userrole=="GodMode"){
      //       next('/manage-superadmin')
      //     }else {
      //       next()
      //     }
      // },
      // beforeEach:(to, from, next) => {
      //   const userrole =localStorage.getItem('role');
      //     // console.log(userpermissions);
      //     if(userrole=="Superadmin"){
      //         next('/manage-organization')
      //     }else if(userrole=="GodMode"){
      //       next('/manage-superadmin')
      //     }else {
      //       next()
      //     }
      // }

     
      
    })
  }
}