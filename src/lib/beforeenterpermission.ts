import localstorage from './localstorage'
export default (Vue: any, next: any, modules: string, role: string, validation: boolean = true) => {
    return async () => {
        const userrole = localstorage.getItem('role')
        if (userrole == 'Superadmin' || userrole == 'Customer-Care' || userrole == 'GodMode') {
            return Promise.resolve()
        }
        const privilages = Vue.store.state.HOMEPAGE.privilages
        if (privilages[modules] && privilages[modules][role] == validation) {
            return Promise.resolve()
        } else {
            if (privilages[modules].suspend) {
                Vue.store.commit('DASHBOARD/setopendialogdonthavepermission', 'suspend')
            } else {
                Vue.store.commit('DASHBOARD/setopendialogdonthavepermission', true)
            }

            // Vue.store.commit('DASHBOARD/setopendialogdonthavepermission', true)
            return Promise.reject()
        }
    }
}