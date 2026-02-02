import localstorage from "./localstorage";
export default (
  Vue: any,
  next: any,
  modules: string,
  role: string,
  validation: boolean = true
) => {
  return async () => {
    const userrole = localstorage.getItem("role");
    if (userrole == 'Superadmin' || userrole == 'GodMode') {
      return Promise.resolve()
    }

    const jsonPrivilages: any = localstorage.getItem("privilages");
    const array: any = JSON.parse(jsonPrivilages);
    const obj = array.find((el: any) => el.name == modules);
    const privilages = Vue.store.state.HOMEPAGE.privilages;

    const status = privilages[modules];

    if (status.suspend || status.terminated) {
      const action = status.terminated ? 'terminated' : 'suspend';
      Vue.store.commit('DASHBOARD/setopendialogdonthavepermission', action);
      
      return Promise.reject();
    }
    
    if (obj && !obj.editor) {
      Vue.store.commit("DASHBOARD/setopendialogdonthavepermission", true);
      return Promise.reject();
    }

    if (privilages[modules] && privilages[modules][role] == validation) {
      return Promise.resolve();
    } else {
      const status = privilages[modules];
      let action;

      if (status.suspend && !status.terminated) {
        action = 'suspend';
      } else if (status.terminated) {
        action = 'terminated';
      } else {
        action = true;
      }

      Vue.store.commit('DASHBOARD/setopendialogdonthavepermission', action);
      return Promise.reject();
    }
  };
};
