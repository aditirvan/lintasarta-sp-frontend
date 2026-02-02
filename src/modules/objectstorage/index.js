import main from './main'
import objectstorage from './objectstorage'
import createObjectStorage from './createobjectstorage'
import objectstoragedetail from './objectstoragedetail'
import bucketcors from './bucketcors'
import empty from './empty'
import axios from '../../lib/axios'
import beforeenterpermission from '../../lib/beforeenterpermission'
import beforeselectfirst from '../../lib/beforeselectfirst'
import libProject from '@/lib/project'
import handlepermissionprivilages from '../../lib/handlepermissionprivilages'
import OBJECTSTORAGEBILLING from './namespace'
import storeObjectStorage from './storeObjectStorage'
import checkopenstack from "@/lib/checkopenstack";

export default {
  install(Vue, { VueEvent }) {
    const OBJECTSTORAGE = {
      namespaced: true,
      state: {
        accessKeys: [],
        objectStorages: [],
        objectStorage: null,
        objectStorageUsage: null,
        s3Flavors: [],
        s3DefaultPrice: null,
        isLoading: false,
        objectStorageCors:[],
        buckets:[],
      },
      mutations: {
        setAccessKeys: (state, payload) => state.accessKeys = payload,
        setObjectStorages: (state, payload) => state.objectStorages = payload,
        setObjectStorage: (state, payload) => state.objectStorage = payload,
        setObjectStorageUsage: (state, payload) => state.objectStorageUsage = payload,
        setS3Flavors: (state, payload) => state.s3Flavors = payload,
        setS3DefaultPrice: (state, payload) => state.s3DefaultPrice = payload,
        setIsLoading: (state, payload) => state.isLoading = payload,
        setObjesctStorageCros: (state, payload) => state.objectStorageCors = payload,
        setBuckets:(state, payload)=>state.buckets=payload,
      },
      actions: {
        fetchAccessKeys: async ({ commit, dispatch }, payload) => {
          const { id } = payload
          const response = await axios.instance.get(`/user/object-storages-users/${id}`)
          commit('setAccessKeys', response.data.data)
          return response
        },
        fetchObjectStorage: async ({ commit, dispatch }, payload) => {
          console.log("melakukan fetch object storage");
          const { id } = payload
          const response = await axios.instance.get(`/user/object-storages/${id}`)
          const { data } = response.data
          console.log("data object storage ", data);
          if (data) commit('setObjectStorage', data)
          return response
        },
        fetchObjectStorages: async ({ commit, dispatch }, payload) => {
          const role = localStorage.getItem('role')
          const currentProj = JSON.parse(localStorage.getItem('currentProj'))
          let params = {}
          params = {
            pro_id: currentProj.id
          }
          commit('setObjectStorages', [])
          commit('setIsLoading', true)
          const response = await axios.instance.get('/user/object-storages', { params })
          commit('setIsLoading', false)
          commit('setObjectStorages', response.data.data)
          return response
        },
        fetchS3Flavors: async ({ commit, dispatch }, payload = { page: 1, limit: 10, search: '', organization_id: null }) => {
          try {
            if (!payload.organization_id) payload.organization_id = await libProject.getCurrentOrgID()
            const response = await axios.instance.get('/flavor/object-storage', {
              params: { ...payload }
            })
            const { storage } = response.data.data
            commit('setS3Flavors', storage)
            return response
          } catch (e) {
            dispatch('HOMEPAGE/showErrorToast', 'A problem encountered while getting S3 flavors', { root: true })
          }
        },
        fetchS3DefaultPrice: async ({ commit, dispatch }) => {
          try {
            const response = await axios.instance.get('/flavor/object-storage/default')
            commit('setS3DefaultPrice', response.data.data)
            return response
          } catch (e) {
            dispatch('HOMEPAGE/showErrorToast', 'A problem encountered while getting S3 default flavor', { root: true })
          }
        },
        createObjectStorage: async ({ commit, dispatch }, payload) => {
          try {
            commit('setIsLoading', true)
            const response = await axios.instance.post('/user/object-storages', payload)
            commit('setIsLoading', false)
            dispatch('fetchObjectStorages')
            dispatch('HOMEPAGE/showSuccessToast', 'Deka Box has been successfully created', { root: true })
            return response
          } catch (e) {
            commit('setIsLoading', false)

            const err = e.response.data.data

            let errorMessage = 'A problem encountered while creating Deka Box'
            if (err && err.includes('Please contact our Team to activate your Postpaid account.')) errorMessage = err
            if (err && err.includes('Conflict. Resource already exists.')) errorMessage = 'Conflicted resource name. Please choose another name.'
            else if (err && err.includes('Service activation')) errorMessage = err
            else if (err && err.includes('already exist')) errorMessage = 'Name is already exists'
            else if (err && err.includes('Deka Box limit size has reached in this project')) errorMessage = 'Deka Box limit size has exceeded the limit. Please contact administrator.'
            else if (err && err.includes('Deka Box limit total has reached in this project')) errorMessage = 'Deka Box limit has exceeded the limit. Please contact administrator.'
            else if (err && err.includes('object volume limit size voucher has reached limit')) errorMessage = 'Deka Box size has reached the limit!'
            else if (err && err.includes('object volume limit total voucher has reached limit')) errorMessage = 'Deka Box quota has reached the limit!'
            else if (err && err.includes('this voucher is not available for Deka Box')) errorMessage = "This voucher is not available for Deka Box!"
            else if (err && err.includes('voucher has already expired')) errorMessage = "This voucher is expired."
            else if (err && err.includes('Deka Box size cannot exceed region volume limit')) errorMessage = "Deka Box size has exceeded the region usage limit. Please contact administrator"
            else if (err && err.includes('You do not have enough limits to create Deka Box. Please get in touch with the administrator.')) errorMessage = err
            else if (err && err.includes('you do not have enough limits to create Deka Box Size. Please get in touch with the administrator')) errorMessage = `You don't have enough size to create Deka Box. Please get in touch with the administrator.`
            else if (err && err.includes('invalid region credentials')) errorMessage = "Region Credentials is invalid. Please use another region!"
            else if (err && err.includes('you do not have enough limits to create Deka Box. Please get in touch with the administrator')) errorMessage = "You do not have enough limits to create Deka Box. Please get in touch with the administrator"
            // if(err && err.includes('Your balance not enough')) errorMessage = 'Your balance not enough'
            else if (e && e.response && e.response.data && e.response.data.data.includes('Your balance not enough')) {
              commit('DASHBOARD/setopendialogbalance', true, { root: true })
              commit('DASHBOARD/setopendialogbalancemsg', e.response.data.data, { root: true })
            }
            dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
            return e.response
          }
        },
        deleteObjectStorage: async ({ commit, dispatch }, payload) => {
          try {
            commit('setIsLoading', true)
            const { id, name } = payload
            const response = await axios.instance.delete(`/user/object-storages/${id}`)
            commit('setIsLoading', false)
            await dispatch('fetchObjectStorages')
            return response
          } catch (e) {
            commit('setIsLoading', false)
            const err = e.response.data.data
            let errorMessage = 'A problem encountered while trying to destroy deka box'
            if (err.includes('you don\'t have access key to delete deka box')) errorMessage = 'You don\'t have access key to this deka box.'
            dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
            return e.response
          }
        },
        createAccessKey: async ({ commit, dispatch }, payload) => {
          try {
            commit('setIsLoading', true)
            const response = await axios.instance.post('/user/object-storages-users', payload)
            await dispatch('fetchAccessKeys', { id: payload.object_storage_id })
            commit('setIsLoading', false)
            dispatch('HOMEPAGE/showSuccessToast', 'New Access Key has been succesfully created', { root: true })
            return response
          } catch (e) {
            const err = e.response.data.data
            let errorMessage = 'A problem encountered while creating new access key'
            if (err.includes('Conflict. Resource already exists')) errorMessage = 'Key name already exists'
            commit('setIsLoading', false)
            dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
          }
        },
        revealAccessKey: async ({ commit, dispatch }, payload) => {
          try {
            commit('setIsLoading', true)
            const response = await axios.instance.post('/user/object-storages-secret-access-key', payload)
            commit('setIsLoading', false)
            return response
          } catch (e) {
            const error = e.response.data.data
            let errorMessage = 'A problem encountered while creating new access key'
            if (error.includes('wrong password')) errorMessage = 'Oops, password does not match'
            commit('setIsLoading', false)
            dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
          }
        },
        deleteAccessKey: async ({ commit, dispatch }, payload) => {
          try {
            commit('setIsLoading', true)
            const { id, object_storage_id } = payload
            const response = await axios.instance.delete(`/user/object-storages-delete-access-key/${id}`, payload)
            await dispatch('fetchAccessKeys', { id: object_storage_id })
            commit('setIsLoading', false)
            dispatch('HOMEPAGE/showSuccessToast', 'Access Key has been succesfully deleted', { root: true })
            return response
          } catch (e) {
            commit('setIsLoading', false)
            dispatch('HOMEPAGE/showErrorToast', 'A problem encountered while deleting access key', { root: true })
          }
        },
        updateCORS: async ({ commit, dispatch }, payload) => {
          try {
            commit('setIsLoading', true)
            const { id, rules,bucketName } = payload
            const response = await axios.instance.put(`/user/object-storages-cors/${id}/${bucketName}`, rules)
            await dispatch('fetchObjectStorage', { id })
            commit('setIsLoading', false)
            dispatch('HOMEPAGE/showSuccessToast', 'CORS has been successfully updated', { root: true })
            return response
          } catch (e) {
            commit('setIsLoading', false)
            dispatch('HOMEPAGE/showErrorToast', 'A problem encountered while updating CORS', { root: true })
            await dispatch('fetchObjectStorage', { id: payload.id })
          }
        },
        fetchUsage: async ({ commit, dispatch }, payload) => {
          const { id } = payload
          const response = await axios.instance.get(`/user/object-storages-usage/${id}`)
          const { data } = response.data
          if (data) commit('setObjectStorageUsage', data)
          return response
        },
        increaseVolume: async ({commit, dispatch }, payload) => {
          try {
            commit('setIsLoading', true)
            
            const response = await axios.instance.put(`/user/object-storages/resize`, payload)
            
            commit('setIsLoading', false)
            dispatch('HOMEPAGE/showSuccessToast', 'Deka box size has been successfully increased.', { root: true })
            dispatch('fetchObjectStorages')
            return response
          } catch (e) {
            const err = e.response.data.data
            let errorMessage = 'A problem encountered while trying to increase Deka Box size'
            
            if (err.includes('Deka Box limit size has reached in this project')) errorMessage = 'Deka Box sizes has exceeded the limit. Please contact the administrator.'
            else if (err && err.includes('Deka Box size cannot exceed region volume limit')) errorMessage = 'Deka Box size has exceeded the region usage limit. Please contact administrator'

            dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
            commit('setIsLoading', false);
          }
        },
        createBucket: async ({ commit, dispatch }, payload) => {
          try {
            commit('setIsLoading', true)
            const response = await axios.instance.post('/user/object-storages-bucket', payload)
            commit('setIsLoading', false)
            dispatch('HOMEPAGE/showSuccessToast', 'Bucket has been successfully created', { root: true })
            return response
          } catch (e) {
            const err = e.response.data.data
            let errorMessage = 'A problem encountered while creating new access key'
            if (err.includes('Conflict. Resource already exists')) errorMessage = 'Key name already exists'
            commit('setIsLoading', false)
            dispatch('HOMEPAGE/showErrorToast', errorMessage, { root: true })
          }
        },
        fetchCorsObjectStorage: async ({ commit, dispatch }, payload) => {
          console.log("melakukan fetch cors object storage");
          const { id,bucketname } = payload
          const response = await axios.instance.get(`/user/object-storages-cors-bucket/${id}/${bucketname}`)
          const { data } = response.data
          console.log("data cors ", data);
          if (data) commit('setObjesctStorageCros', data)
          return response
        },
        fetchBuckets: async ({ commit, dispatch }, id) => {
          try {
            console.log("fetchBuckets ", id);
            commit("setIsLoading", true);
            const response = await axios.instance.get(`/object-storage-region/manage-bucket/${id}`);
            commit("setBuckets", response.data.data);
            commit("setIsLoading", false);
            return response;
          } catch (e) {
            const err = e.response.data.data;
            let errorMessage = "A problem encountered while trying to get buckets detail";
            dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
            commit("setIsLoading", false);
            return e.response;
          }
        },
        deleteBucketById: async ({ commit, dispatch }, payload) => {
          try {
            console.log("deletehBucketById ", payload);
            commit("setIsLoading", true);
            // user/object-storages-bucket/8d89964d-b7f3-4691-b662-25e3d7134cb9/vandy-karang-testing-predeploy
            const response = await axios.instance.delete(`user/object-storages-bucket/${payload.id}/${payload.bucketName}`);
            dispatch('HOMEPAGE/showSuccessToast', 'Success Delete Bucket', { root: true })
            commit("setIsLoading", false);
            return response;
          } catch (e) {
            const err = e.response.data.data;
            let errorMessage = "A problem encountered while trying to get buckets detail";
            dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
            commit("setIsLoading", false);
            return e.response;
          }
        },

         




      }
    }
    Vue.addModules({
      OBJECTSTORAGE
    });
    Vue.addModules({ [OBJECTSTORAGEBILLING]: storeObjectStorage });
    Vue.addRoutetoDashboard({
      path: 'object-storage',
      component: main,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, 'Object Storage', 'disable', false)()
        .then(() => {
          return beforeselectfirst(Vue)()
        })
        .then(() => {
          return checkopenstack(Vue)();
        })
        .then(() => {
          next()
        })
        .catch(() => {
          if (from.path == '/') {
            next('/')
          }
        })
      },
      meta: {
        permission: ['instance-view'],
        breadcrumb: {
          text: 'Deka Box',
          to: '/object-storage',
        },
      },
      children: [
        { path: '', component: objectstorage },
        {
          beforeEnter: (to, from, next) => {
            handlepermissionprivilages(Vue, next, 'Object Storage', 'editor', true)().then(() => {
              next()
            }).catch(() => {
              if (from.path == '/') {
                next('/')
              }
            })
          },
          path: 'create', component: createObjectStorage, meta: {
            breadcrumb: {
              text: 'Create Deka Box',
              to: '/object-storage/create',
            },

          }
        },
        {
          path: ':objectsrtorageid', component: objectstoragedetail, meta: {
            breadcrumb: {
              text: 'Detail Deka Box ',
              to: '',
            },
          },
          
          children:[
            { path: '', redirect: 'overview' },
            { path: 'overview', component: empty },
            { path: 'access-keys', component: empty },
            { path: 'settings', component: empty },
          ]
          
        },
        {
          path: ':objectsrtorageid', component: main, meta: {
            breadcrumb: {
              text: 'Detail Deka Box ',
              to: '/object-storage/:objectsrtorageid',
            },
          },
          children: [
            {
              path: 'cors-settings/:bucketname',
              component: bucketcors,
              meta: {
                breadcrumb: {
                  text: 'Cors Configuration',
                  to: '', 
                },
              }
            }
          
          ]
        },



        
      ]
    })
    VueEvent.listen('after-store-created', (store) => {
      store.commit('ROLEPERMISSION/addmenumodulepermission',
        {
          header: 'STORAGE', headerno: 3,
          name: 'Deka Box', link: 'object-storage', icon: 'objectstorageIcon', sort: 1, permission: ['objectstorage-sidemenu']
        }
      )
      store.commit('ROLEPERMISSION/addpermissions', ['objectstorage-view'])
    })
  }
}
