import { iVue } from "@/modules/type";
import axios from "./axios";

export default (Vue: iVue) => {
  return async () => {
    const userId = localStorage.getItem("userId");
    const projectId = localStorage.getItem("projectid");
    const userrole = localStorage.getItem('role')
    if (userId && projectId) {
      const data = {
        user_id: JSON.parse(userId),
        project_id: projectId,
      };
      Vue.store
        .dispatch("RDBMS/checkUserRDBMS", data)
        .then((res) => {
          const status = res.data.data.status;
          if (status || userrole == 'Superadmin' || userrole == 'GodMode') {
            // const username = localStorage.getItem("username");
            // const curOrg = localStorage.getItem("currentOrg");
            // if (username && curOrg) {
            //   const currOrg = JSON.parse(curOrg);
            //   const data = {
            //     organizationID: currOrg.id,
            //     projectID: projectId,
            //     userID: JSON.parse(userId),
            //     username,
            //   };
            //   Vue.store.dispatch("RDBMS/loginRDBMS", data).then((res) => {
            //     const data = res.data.data;
            //     localStorage.setItem("token_rdbms", JSON.stringify(data));
            //     console.log("punya akses ke rdbms");
            //     return Promise.resolve();
            //   });
            // }
            return Promise.resolve();
          } else {
            console.log("tidak ada akses ke rbms");
            if (Vue.router.currentRoute.name != "main") {
              Vue.router.replace("/");
              return Promise.reject();
            }
          }
        })
        .catch((err) => {
          console.log("err ", err);
        });
    } else {
      console.log("failed");
      return Promise.reject();
    }
  };
};
