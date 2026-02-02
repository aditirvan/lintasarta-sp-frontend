import Vue from 'vue';

export const suspendValidator = (modules, role, validation) => {
  const userrole = localStorage.getItem("role");
  if (userrole == 'Superadmin' || userrole == 'GodMode') {
    return true
  }

  const jsonPrivilages= localStorage.getItem("privilages");
  const array = JSON.parse(jsonPrivilages);

  const obj = array.find((el) => el.name == modules);
  const privilages = Vue.store.state.HOMEPAGE.privilages;

  const status = privilages[modules];

  if (status.suspend || status.terminated) {
    const action = status.terminated ? 'terminated' : 'suspend';
    Vue.store.commit('DASHBOARD/setopendialogdonthavepermission', action);

    return false;
  }
  
  if (obj && !obj.editor) {

    Vue.store.commit("DASHBOARD/setopendialogdonthavepermission", true);
    return false
  }

  if (privilages[modules] && privilages[modules][role] == validation) {
    return true;
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
    return false;
  }
}