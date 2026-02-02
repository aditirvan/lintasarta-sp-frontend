import {INSTANCE} from '../namespace'
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import {ref, computed} from '@vue/composition-api'

export const useSSHkeys = (props) => {
  props;
  const sshkeyidselected = ref('');
  const {fetchsshkeys} = useNamespacedActions(INSTANCE, ['fetchsshkeys'])
  const {sshkeys} = useNamespacedState(INSTANCE, ['sshkeys'])
  const selectsshkeys = computed(() => {
    return sshkeys.value.slice(0, 5).map(x => {
      return {
        value: x.id,
        text: x.name
      }
    })
  })
  return {
    sshkeyidselected,
    fetchsshkeys,
    sshkeys,
    selectsshkeys,
  }
}