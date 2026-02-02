import {INSTANCE} from '../namespace'
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import {ref, computed} from '@vue/composition-api'

export const useInstance = (props) => {
  props;
  const instanceselected = ref({});
  const { 
    fetchinstancesize,
    fetchMasterInstances,
    fetchInstanceDetail,
    fetchServerGroupByProject,
  } = useNamespacedActions(INSTANCE, [
    'fetchinstancesize',
    'fetchMasterInstances',
    'fetchInstanceDetail',
    'fetchServerGroupByProject',
  ])
  let { instancesize, masterInstances, instanceDetail, servergroupByProject } = useNamespacedState(INSTANCE, ['instancesize', 'masterInstances', 'instanceDetail', 'servergroupByProject'])
  
  function isSelected(id) {
    return id == instanceselected.value.id;
  }

  const rootDiskSelected = ref(null)

  const selectedServerGroupModel = ref(null)
  const selectservergroupbyproject = computed(() => {
    return servergroupByProject.value.map((e) => ({
      text: e.name + " - " + e.policy_name,
      value: e.id,
    }));
  });

  return {
    instanceselected,
    fetchMasterInstances,
    fetchInstanceDetail,
    rootDiskSelected,
    fetchinstancesize,
    instancesize,
    masterInstances,
    instanceDetail,
    selectedServerGroupModel,
    fetchServerGroupByProject,
    selectservergroupbyproject,
    isSelected
  }
}