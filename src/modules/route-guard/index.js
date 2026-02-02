
export default {
    // called by Vue.use(FirstPlugin)
    install(Vue, {VueEvent}) {
        Vue;
        VueEvent.listen('after-router-created',(router)=>{
          Vue.prototype.router = router;
              VueEvent.listen('after-user-permission-fetch',userpermission=>{
                userpermission;
                // router.beforeEach((to, from, next) => {
                //   console.log(to,userpermission)
                //   if(to.path == '/' || to.path == '' ){
                //     return next()
                //   }
                //   if(to.meta.permission){
                //     next()
                //   }
                // });
            })
        })
        
      }
}