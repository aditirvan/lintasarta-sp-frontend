const list_privileges = [{
    name: "Manage Organization",
    root_path: "/manage-organization",
    role_default: {
        disabled: true,
    },
    types: []
},
{
    name: "Manage Audit",
    root_path: "/manage-audit",
},
{
    name: "Manage User",
    root_path: "/manage-user",
},
{
    name: "Manage Sales",
    root_path: "/manage-sales",
},
{
    name: "Manage Voucher",
    root_path: "/manage-voucher",
},
{
    name: "Manage Pricing",
    root_path: "/manage-pricing",
},
{
    name: "Manage Region",
    root_path: "/manage-region",
},
{
    name: "Manage Flavor",
    root_path: "/manage-flavor",
},
{
    name: "Manage Image",
    root_path: "/manage-os",
},
{
    name: "Manage Package",
    root_path: "/manage-package",
},
{
    name: "Manage EULA",
    root_path: "/manage-eula",
},
{
    name: "MailBox Log",
    root_path: "/mailbox-log",
},
{
    name: "Config E-Materai",
    root_path: "/config-e-materai",
},
{
    name: "Manual Payment",
    root_path: "/manual-payment",
},
{
    name: "Broadcast",
    root_path: "/broadcast",
},
{
    name: "Manage Project",
    root_path: "/project/{xxx}/setting",
},
{
    name: "Project Instance",
    root_path: "/instance",
},
{
    name: "Project Storage",
    root_path: "/storage",
},
{
    name: "Project Object Storage",
    root_path: "/object-storage",
},
{
    name: "Project Images",
    root_path: "/image",
},
{
    name: "Project Network",
    root_path: "/network",
},
{
    name: "Project Security",
    root_path: "/security",
},
{
    name: "Project Alerting",
    root_path: "/alerting",
},
{
    name: "DNS",
    root_path: "/dns",
},
{
    name: "Deka SSL",
    root_path: "/ssl",
},
{
    name: "CDN",
    root_path: "/cdn",
},
{
    name: "Manage Tickets",
    root_path: "/manage-ticket",
},
{
    name: "Manage Service",
    root_path: "/overview",
},
{
    name: "Billing",
    root_path: "/billing",
},
{
    name: "Balance",
    root_path: "/balance",
},
{
    name: "Database",
    root_path: "/rdbms",
},
{
    name: "Instance",
    root_path: "/dp-instance",
},
{
    name: "Network",
    root_path: "/dp-network",
},
{
    name: "Security",
    root_path: "/dp-security",
},
{
    name: "Catalog",
    root_path: "/dp-catalog",
},
{
    name: "Registry",
    root_path: "/registry/summary",
},
{
    name: "Deka ROCK",
    root_path: "/deka-rock",
},
{
    name: "Deka AST",
    root_path: "/deka-ast",
},
{
    name: "Deka Harbor",
    root_path: "/harbor",
},
{
    name: "Deka Agent",
    root_path: "/deka-agent",
},
{
    name: "NFS",
    root_path: "/network-file-system",
},
{
    name: "Deka POP",
    root_path: "/dekapop",
},
];

class AccessControl {
    constructor(store) {
        this.store = store
    }

    static getSettingPrivillegeDetail(payload) {
        // scan from list_privileges
        for (let index = 0; index < list_privileges.length; index++) {
            const x = list_privileges[index];
            if (payload.name) {
                if (String(x.name).toLowerCase() == String(payload.name).toLowerCase()) {
                    return x
                }
            } else if (payload.root_path) {
                if (String(x.root_path).toLowerCase() == String(payload.root_path).toLowerCase()) {
                    return x
                }
            }
        }
        return null
    }

    getPrivillegesMultiRole() {
        if (this.is_admin()) {
            let superadmin_privileges = this.store.state.ROLEPERMISSION.superadmin_privileges
            if (!superadmin_privileges.length) {
                const superadmin_privileges_storage = localStorage.getItem('superadmin_privileges')
                if (!superadmin_privileges_storage || superadmin_privileges_storage == 'undefined') {
                    return null
                }
                this.store.commit("ROLEPERMISSION/setAdminaPrivilleges", JSON.parse(superadmin_privileges_storage).privileges)
                return this.store.state.ROLEPERMISSION.superadmin_privileges
            }
            return superadmin_privileges
        } else {
            let user_privileges = this.store.state.ROLEPERMISSION.privilleges
            if (!user_privileges.length) {
                const user_privileges_storage = localStorage.getItem('privilages')
                if (!user_privileges_storage || user_privileges_storage == 'undefined') {
                    return null
                }
                this.store.commit("ROLEPERMISSION/setprivilleges", JSON.parse(user_privileges_storage))
                return this.store.state.ROLEPERMISSION.privilleges
            }
            return user_privileges
        }
    }

    is_read_mode_multi_role(menuName) {
        const privileges = this.getPrivillegesMultiRole()
        if (!privileges) {
            return true
        }

        if (this.is_admin()){
            for (let index = 0; index < privileges.length; index++) {
                const element = privileges[index];
                if (String(element.name).toLowerCase() == String(menuName).toLowerCase()) {
                    if (String(element.role).toLowerCase() === 'viewer') {
                        return true
                    }
                    return false
                }
            }
    
            return true
        } else {
            for (let index = 0; index < privileges.length; index++) {
                const element = privileges[index];
                if (String(element.name).toLowerCase() == String(menuName).toLowerCase()) {
                    if (element.viewer) {
                        return true
                    }
                    return false
                }
            }
    
            return true
        }
    }

    getPrivilleges() { // like singeleton
        let superadmin_privileges = this.store.state.ROLEPERMISSION.superadmin_privileges
        if (!superadmin_privileges.length) {
            const superadmin_privileges_storage = localStorage.getItem('superadmin_privileges') // this should using state manage
            if (!superadmin_privileges_storage || superadmin_privileges_storage == 'undefined') { // TODO:temporary logic
                return null
            }
            this.store.commit("ROLEPERMISSION/setAdminaPrivilleges", JSON.parse(superadmin_privileges_storage).privileges)
            return this.store.state.ROLEPERMISSION.superadmin_privileges
        }
        return superadmin_privileges
    }

    is_read_mode(menuName) {
        const role = localStorage.getItem('role')
        if (String(role).toLowerCase() != "superadmin") { // TODO:temporary logic
            return false
        }

        const privileges = this.getPrivilleges()
        if (!privileges) {
            return true
        }
        for (let index = 0; index < privileges.length; index++) {
            const element = privileges[index];
            if (String(element.name).toLowerCase() == String(menuName).toLowerCase()) {
                if (String(element.role).toLowerCase() === 'viewer') {
                    return true
                }
                return false
            }
        }

        return true
    }


    isNotHideMenu(menuName) {

        let privillege_detail = AccessControl.getSettingPrivillegeDetail({ name: menuName })        
        if (privillege_detail && privillege_detail.role_default) {
            if (privillege_detail.role_default.disabled) {
                return true
            }
        }

        const role = localStorage.getItem('role')
        if (role != "Superadmin") { // TODO:temporary logic
            return true
        }

        const privileges = this.getPrivilleges()
        if (!privileges) {
            return true
        }
        for (let index = 0; index < privileges.length; index++) {
            const element = privileges[index];
            if (String(element.name).toLowerCase() == String(menuName).toLowerCase()) {
                return true
            }
        }
        return false
    }

    allow_to_route(to, from, next) {
        let routeName = AccessControl.name_of_path(to.fullPath);
        if (routeName) {
            let is_not_hide_menu = this.isNotHideMenu(routeName);
            let read_mode = this.is_read_mode(routeName);
            if (!is_not_hide_menu) {
                this.getStore().commit('DASHBOARD/setopendialogdonthavepermission', true)
                return next(from);
            } else if (read_mode) {
                if ((to.fullPath.includes("/edit") || to.fullPath.includes("/create")) && true) {
                    this.getStore().commit('DASHBOARD/setopendialogdonthavepermission', true)
                    return next(from);
                } else if ("Manage Organization" == routeName && (to.fullPath.includes("custom-dbaas-limit") || to.fullPath.includes("custom-deka-flexi") || to.fullPath.includes("custom-cdn-limit"))) {
                    this.getStore().commit('DASHBOARD/setopendialogdonthavepermission', true)
                    return next(from);
                } else if ("SSL" == routeName && (String(to.fullPath.split("/").at(-1)).toLowerCase() == 'import')) {
                    this.getStore().commit('DASHBOARD/setopendialogdonthavepermission', true)
                    return next(from);
                } else if ("Manage Service" == routeName) {
                    let current_last_path = String(to.fullPath.split("/").at(-1)).toLowerCase();
                    let disallowed = [
                        'package-addons',
                        'package-monthly',
                        'form-package'
                    ]
                    if (disallowed.includes(current_last_path)) {
                        this.getStore().commit('DASHBOARD/setopendialogdonthavepermission', true)
                        return next(from);
                    }
                }
            }
        }
        next();
    }

    static name_of_path(path) {
        let split_path = path.split("/");
        if (split_path.length > 1) {
            let root_path = "/" + split_path[1];

            // manual value
            if (root_path.toLowerCase() == '/project' && split_path.length == 4 && split_path[3].toLowerCase() == 'setting') {
                return "Manage Project"
            } else if (root_path.toLowerCase() == '/organization-detail' && split_path.length == 4 && (split_path[3].toLowerCase() == 'custom-dbaas-limit' || split_path[3].toLowerCase() == 'custom-deka-flexi' || split_path[3].toLowerCase() == 'custom-cdn-limit' || split_path[3].toLowerCase() == 'custom-object-storage-limit')) {
                return "Manage Organization"
            }

            // scan from list_privileges
            for (let index = 0; index < list_privileges.length; index++) {
                const x = list_privileges[index];
                if (String(x.root_path).toLowerCase() == String(root_path).toLowerCase()) {
                    return x.name
                }
            }
        }
    }

    is_admin() {
        const role = localStorage.getItem('role')
        return (["Superadmin", "Customer-Care", "GodMode"].includes(role))
    }

    getStore() {
        return this.store
    }
}


export { list_privileges, AccessControl }
