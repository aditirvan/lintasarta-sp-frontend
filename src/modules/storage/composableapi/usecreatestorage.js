import {
  useNamespacedActions,
  useNamespacedState
} from "vuex-composition-helpers";
import {STORAGE} from '../namespace'
import {ref, computed} from '@vue/composition-api'

export const useCreateStorage = () => {
  const selectedstorage = ref({})
  const Actions = useNamespacedActions(STORAGE,
    ['createstorage',
      'fetchstorages',
      'storagesfetch',
      'deletestorage',
      'detachfrominstance',
      'updateStorage',
      'attachStorage',
      'fetchVolumeSize'
    ])

  const {
    storages,
    isLoading,
  } = useNamespacedState(STORAGE, [
    'storages',
    'isLoading',
  ])
  const storageSelect = computed(() => {
    return storages.value.map((x) => {
      return {value: x, text: x.name};
    });
  });
  return {
    storageSelect,
    selectedstorage,
    storages,
    isLoading,
    ...Actions
  }
}