import { iVue } from "@/modules/type";

export default (Vue: iVue) => {
    return async () => {
        const currentProj = JSON.parse(localStorage.getItem('currentProj') || '{}')

        if (currentProj && currentProj.openstack_project_id != '') {
            return Promise.resolve()
        } else {
            Vue.store.commit('PROJECT/setopendialogopenstacknotfound', true)
            return Promise.reject()
        }

        // Vue.store.commit('PROJECT/setopendialogopenstacknotfound', true)
        // return Promise.reject()
    }
}