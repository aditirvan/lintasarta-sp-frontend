import { ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers'

export default () => {
  const { 
    fetchType,
    fetchMasterInstances, 
    resize,
    revert,
  } = useNamespacedActions('INSTANCE', [
    'fetchType',
    'fetchMasterInstances',
    'resize',
    'revert',
  ])

  const { 
    type,
    masterInstances,
    isLoading,
    instance
  } = useNamespacedState('INSTANCE', [
    'type',
    'masterInstances',
    'isLoading',
    'instance'
  ])

  const {
    region,
    regions,
  } = useNamespacedState('MANAGEINSTANCEREGION', [
    'region',
    'regions',
  ])

  const {
    fetchRegions,
    fetchRegionByName,
  } = useNamespacedActions('MANAGEINSTANCEREGION', [
    'fetchRegions',
    'fetchRegionByName',
  ])
  
  return {
    region,
    regions,
    fetchRegions,
    fetchRegionByName,
    fetchType,
    fetchMasterInstances,
    resize,
    type,
    masterInstances,
    instance,
    isLoading,
    revert,
  }
}