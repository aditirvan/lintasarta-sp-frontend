import * as lodash from 'lodash'
import axios from '../../lib/axios'
import externalSubDomain from '../../lib/externalSubDomain'
import moment from 'moment'
import localstorage from "@/lib/localstorage";
import { Promise } from 'core-js';

export default {
  namespaced: true,
  state: {
    user: {},
    userprofile: {},
    usertoken: '',
    member: {},
    permissions: [],
    userrole: '',
    userpermissions: [],
    menumodulepermission: [],
    roles: [],
    rolespagination: {},
    privilleges: [],
    superadmin_privileges: [],
    myprivilleges: [],
    leftnavmenu: [],
    custommenu: [],
    navCustomMenu: [],
    selectedrole: null
  },
  mutations: {
    setuser: (state, user) => state.user = user,
    setusertoken: (state, token) => state.usertoken = token,
    setmember: (state, member) => state.member = member,
    addpermissions: (state, permission) => state.permissions.push(permission),
    setuserrole: (state, role) => state.userrole = role,
    setuserpermissions: (state, permissions) => state.userpermissions = permissions,
    addmenumodulepermission: (state, menu) => state.menumodulepermission.push(menu),
    changemenumodulepermission: (state, menu) => {
      const index = state.menumodulepermission.findIndex((m) => m.link === menu.link)
      state.menumodulepermission[index] = menu
    },
    setroles: (state, roles) => state.roles = roles,
    setrolespagination: (state, pagination) => state.rolespagination = pagination,
    setprivilleges: (state, privilleges) => state.privilleges = privilleges,
    setmyprivilleges: (state, privilleges) => state.myprivilleges = privilleges,
    addLeftNavMenu: (state, menu) => state.leftnavmenu.push(menu),
    addcustommenu: (state, menu) => state.custommenu.push(menu),
    addNavCustomMenu: (state, menu) => state.navCustomMenu.push(menu),
    setuserprofile: (state, payload) => state.userprofile = payload,
    setselectedrole: (state, payload) => state.selectedrole = payload,
    setAdminaPrivilleges: (state, payload) => state.superadmin_privileges = payload,
  },
  getters: {
    getUserProfile: state => state.userprofile, // TODO: Fase 1 - Ferry
    getuser: state => state.user,
    getcustommenu: state => {
      return state.custommenu.slice().filter(menu => {
        let res = menu.permission.filter((permission) => {
          return state.userpermissions.includes(permission)
        })
        return res.length
      })
    },
    getnavcustommenu: state => {
      return state.navCustomMenu.slice().filter(menu => {
        if (!menu.permission) return true
        let res = menu.permission.filter((permission) => {
          return state.userpermissions.includes(permission)
        })
        return res.length
      })
    },
    getleftnavmenu: state => {
      return state.leftnavmenu.slice().filter(menu => {
        let res = menu.permission.filter((permission) => {
          return state.userpermissions.includes(permission)
        })
        return res.length
      })
    },
    getmenu: state => {
      const filtered = state.menumodulepermission.filter((menu) => {
        let res = menu.permission.filter((permission) => {
          return state.userpermissions.includes(permission)
        })
        return res.length
      })
      const sortMenu = filtered.sort((a, b) => a.headerno - b.headerno)
      const group = lodash.groupBy(sortMenu, 'header')
      const menu = []

      let menui3 = []
      let idx = 0
      let c= null
      let d= null
      let groupi3
      let headi3 = ''
      for (const [key, value] of Object.entries(group)) {
        // console.log(key)
        if(key == 'SECURITY'){
          // console.log(value)
          for(idx; idx <= value.length -1; idx++){
            if(value[idx].header1){
              // console.log(value[idx])
              let childsub = value[idx].childsub ? value[idx].childsub : ''
              let subhead = value[idx].subhead ? value[idx].subhead : ''
              if(menui3.length){
                if(value[idx].child2sub){
                  if (menui3.some(data => data.childsub == childsub)) {
                    c = menui3.length - 1
                    if (menui3[c].childsub == childsub) {
                      menui3[c].list.push(value[idx])
                    }
                  }else{
                    headi3 = value[idx].header1
                    menui3.push({
                      header: value[idx].header1,
                      subhead: value[idx].subhead,
                      childsub: value[idx].childsub,
                      list: [value[idx]]
                    })
                  }
                }else{
                  if(menui3.some(data => data.childsub == childsub)){
                    d = menui3.length - 1
                    if (menui3[d].childsub == childsub) {
                      menui3[d].list.push(value[idx])
                    }
                  }else{
                    headi3 = value[idx].header1
                      menui3.push({
                      header: value[idx].header1,
                      subhead: value[idx].subhead,
                      list: [value[idx]]
                    })
                  }
                }
              }else{
                headi3 = value[idx].header1
                menui3.push({
                  header: value[idx].header1,
                  subhead: value[idx].subhead,
                  list: [value[idx]]
                })
              }
            }else{
              menu.push({
                header: key,
                list: [value[idx]],
              })
            }
          }
          groupi3 = lodash.groupBy(menui3, 'subhead')
        }else{
          menu.push({
            header: key,
            list: value.slice().sort((a, b) => a.sort - b.sort),
          })
        }
      }
      menu.forEach((x) => {
        if(x.header == 'SECURITY'){
          x.list.push({ name: headi3, list: groupi3, header: x.header})
        }
      })
      return menu

    },
    getroles: state => state.roles,
    getprivilleges: state => state.privilleges,
    getAdminaPrivilleges: state => state.superadmin_privileges
  },
  actions: {
    changestatus: async (context, payload) => {
      let message = ''
      try {
        let response = null
        if (payload.status == 'active') {
          message = 'deactivate'
          response = await axios.instance.put(`/user/manageuser/deactive/${payload.id}`, payload)
        } else {
          message = 'activate'
          response = await axios.instance.put(`/user/manageuser/active/${payload.id}`, payload)
        }
        context.dispatch('HOMEPAGE/showSuccessToast', `Successfully to ${message} user`, { root: true }) 
        return response
      } catch (e) {
        const backendErr = e.response.data.data
        let errorMessage = `A problem encountered while ${message} this user`
        if (backendErr.includes('user is not verified yet')) errorMessage = 'Unable to change status to active as the user is not verified yet'
        context.dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true }) 
        return e.response
      }
    },
    createRole: async (context, data) => {
      return await axios.instance.post('/user/organization/role', data)
    },
    editRole: async (context, data) => {
      return await axios.instance.put(`/user/organization/role/${data.id}`, data)
    },
    deleteRole: async (context, payload) => {
      return await axios.instance.delete(`/user/organization/role/${payload.id}`)
    },
    fetchRoles: async (context, payload = { page: 1, itemsPerPage: 10 }) => {
      return await axios.instance.get('/user/organization/role', { params: { page: payload.page, limit: payload.itemsPerPage, search: payload.search, sortBy: payload.sortBy, sortDesc: payload.sortDesc, org_id: payload.orgId } }).then(response => {
        const { organization_roles, pagination } = response.data.data
        context.commit('setroles', organization_roles)
        context.commit('setrolespagination', pagination)
      })
    },
    fetchUserPrivileges: async (context, user) => {
      // const isDevMode = process.env.VUE_APP_DEV_MODE === 'fase-1.3'

      const isDevMode = true
      const enduser = isDevMode ? ["project-view", "instance-view", "instance-sidemenu", "storage-view", "storage-sidemenu", "objectstorage-view", "objectstorage-sidemenu", "images-view", "images-sidemenu", "network-view", "network-sidemenu", "security-view", "security-sidemenu", "dns-view", "dns-sidemenu", "ticket-sidemenu", "manageservice-sidemenu", "manageservice-view", "alerting-view", "billing-view", "billing-sidemenu", "organization-view", "ticket-view", "docs-view", "notification-view", "profile-view", "rdbms-view", "rdbms-sidemenu", "ssl-view", "ssl-sidemenu", "cdn-sidemenu", "cdn-view","vdc-view","vdc-sidemenu", "dpimport-sidemenu","dpimport-view","dpinstance-sidemenu","dpinstance-view","dpnetwork-sidemenu","dpnetwork-view","dpsecurity-sidemenu","dpsecurity-view","catalog-sidemenu","catalog-view", "registry-sidemenu", "registry-view", "dekarock-view", "dekarock-sidemenu", "harbor-sidemenu", "harbor-view", "sast-sidemenu", "sast-view", "deka-agent-view", "network-file-system-view", "network-file-system-sidemenu","deka-pop-view","deka-pop-sidemenu"]
        : ["project-view", "instance-view", "instance-sidemenu", "storage-view", "storage-sidemenu", "objectstorage-view", "objectstorage-sidemenu", "images-view", "images-sidemenu", "network-view", "network-sidemenu", "security-view", "security-sidemenu","dns-view", "dns-sidemenu", "alerting-view", "billing-view", "billing-sidemenu", "organization-view", "ticket-view", "docs-view", "notification-view", "profile-view", "rdbms-view", "rdbms-sidemenu", "ssl-view", "cdn-view","vdc-view","vdc-sidemenu","dpimport-sidemenu","dpimport-view","dpinstance-sidemenu","dpinstance-view","dpnetwork-sidemenu","dpnetwork-view","dpsecurity-sidemenu","dpsecurity-view","catalog-sidemenu","catalog-view", "registry-view", "dekarock-view", "dekarock-sidemenu", "harbor-sidemenu", "harbor-view", "sast-sidemenu", "sast-view", "deka-agent-view", "network-file-system-view", "network-file-system-sidemenu","deka-pop-view","deka-pop-sidemenu"]
      const superadmin = ["superadmin-sidemenu", "profile-view", "instance-view", "storage-view", "objectstorage-view", "images-view", "network-view", "security-view","dns-view", "allerting-view", "billing-view", "billing-sidemenu", "rdbms-sidemenu", "manageservice-sidemenu", "manageticket-sidemenu","vdc-sidemenu","dpnetwork-sidemenu","dpsecurity-sidemenu","catalog-sidemenu","dpimport-sidemenu", "dpimport-view", "dekarock-sidemenu", "dekarock-view", "dpinstance-sidemenu", "ssl-view", "ssl-sidemenu", "harbor-sidemenu", "harbor-view", "sast-sidemenu", "sast-view", "deka-agent-view", "network-file-system-view", "network-file-system-sidemenu","deka-pop-view", "deka-pop-list-view"]
      const customerCare = ["ticket-sidemenu", "profile-view"]
      const godmode = ["godmod-sidemenu", "profile-view", "instance-view", "storage-view", "objectstorage-view", "images-view", "network-view", "security-view", "dns-view", "allerting-view", "billing-view","vdc-view","dpnetwork-view","dpsecurity-view","catalog-view","import-view", "deka-agent-view","deka-pop-view", "deka-pop-list-view"]

      //const menu="";
      if (user.role == 'Superadmin') {
        return context.commit('setuserpermissions', superadmin)
      } else if (user.role == 'Customer-Care') {
        return context.commit('setuserpermissions', customerCare)
      } else if (user.role == 'GodMode') {
        return context.commit('setuserpermissions', godmode)
      } else {
        return context.commit('setuserpermissions', enduser)
      }

    },

    fetchUserProfile: async (context) => {
      //get user profile
      return new Promise((resolve, reject) => {
        axios.instance.get('user/profile').then(response => {
          const data = response.data.data
          const profile = {
            organization_id: data.organization_id,
            id: data.id,
            username: "username",
            fullname: data.fullname,
            email: data.email,
            phone: data.phone_number,
            address: data.address ? data.address : "-",
            createdate: moment(new Date(data.created_at)).format('MM/DD/YYYY'),
          }
          context.commit('setuserprofile', profile)
          const user = {
            id: data.id,
            fullname: data.fullname,
          }
          localStorage.setItem("userId", JSON.stringify(user.id));
          resolve(profile)
        }).catch((e) => {
          context.dispatch('HOMEPAGE/showErrorToast', 'ERROR ON GET USER PROFILE', { root: true })
          reject(e)
        })
      })
    },
    upgradeorg: async (context, payload,) => {
      const currentOrg = context.rootState.SUPERADMIN.currentOrg
      const externalSubdomain = externalSubDomain.getSubDomain();
      payload.external_subdomain = externalSubdomain
      return await axios.instance.put(`/user/manageorg/${currentOrg.id}/npwp`, payload)
    },
  }
}
