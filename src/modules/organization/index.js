import navmenu from './navmenu'
import store from './store'
import memberstore, { namespace as MEMBER } from './memberstore'
import SettingOrganization from './settingorganization'
import OrganizationStore from './organization.store'
import beforeenterpermission from '../../lib/beforeenterpermission'
import localstorage from '../../lib/localstorage'

export default {
  install(Vue, { VueEvent }) {
    Vue.component('ROLEPERMISSION-navmenu', navmenu)
    Vue.addModules({ ROLEPERMISSION: store })
    Vue.addModules({ ORGANIZATION: OrganizationStore })
    Vue.addModules({ [MEMBER]: memberstore })
    VueEvent.listen('after-store-created', (store) => {
      store.commit('ROLEPERMISSION/addNavCustomMenu', {
        name: 'ROLEPERMISSION-navmenu',
        sort: 3,
        permission: ['organization-view']
      })
      store.commit('ROLEPERMISSION/addpermissions', 'rolepermission-view')
      VueEvent.listen('after-check-login', async (user) => {  
        store.commit('ROLEPERMISSION/setuserrole', user.role)      
        if (user.role !='GodMode' && user.role != 'Superadmin' && user.role && !user.need_create_organization) {
          await store.dispatch('ORGANIZATION/fetchorganizationByUser', user).then(org => {
            if (org) {
              const currentProj = localstorage.getItem('currentProj')
              store.commit('SUPERADMIN/setCurrentOrg', org)
              if (currentProj) store.commit('SUPERADMIN/setCurrentProj', JSON.parse(currentProj))
            }
          }).catch((e)=>{
            console.log(e)
          })
        } else {
          const currentOrg = localstorage.getItem('currentOrg')
          const currentProj = localstorage.getItem('currentProj')
          if (currentOrg) store.commit('SUPERADMIN/setCurrentOrg', JSON.parse(currentOrg))
          if (currentProj) store.commit('SUPERADMIN/setCurrentProj', JSON.parse(currentProj))
        }
        await store.dispatch('ROLEPERMISSION/fetchUserPrivileges', user).then(() => {
          VueEvent.emit('after-user-permission-fetch', store.state['ROLEPERMISSION'].userpermissions)
          store.commit('ROLEPERMISSION/setuser', user || {})
        })
      })
      VueEvent.listen('after-check-login', (user) => {
        if (user.role) {
          store.dispatch('ROLEPERMISSION/fetchUserProfile')
        }
      })
    })

    Vue.addRoutetoDashboard({
      path: '/setting-organization',
      component: SettingOrganization,
      meta: {
        breadcrumb: {
          text: 'Setting Organization',
          to: '/setting-organization'
        }
      },
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, 'Organization', 'disable', false)().then(() => {
          next()
        }).catch(()=>{
          if(from.path == '/'){
            next('/')
          }
        })
      },
    })

  }
}