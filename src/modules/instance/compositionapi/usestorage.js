import {INSTANCE} from '../namespace'
import {
    useNamespacedActions,
    useNamespacedState,
  } from "vuex-composition-helpers";
import { ref, computed} from  '@vue/composition-api'
export const useStorage = (props)=>{
    props;
    const storageselected = ref(null);
    const { fetchstoragesize } = useNamespacedActions(INSTANCE,['fetchstoragesize'])
    const { fetchstoragesizes, fetchdefaultstoragesize, fetchpackagestorage } = useNamespacedActions('MANAGEFLAVOR',['fetchstoragesizes','fetchdefaultstoragesize','fetchpackagestorage'])
    const { storagesize } = useNamespacedState(INSTANCE, ['storagesize'])

    const { fetchVolumeSize } = useNamespacedActions('STORAGE',['fetchVolumeSize'])
    const { volumeSize, isLoading } = useNamespacedState('STORAGE', ['volumeSize', 'isLoading'])

    const { storagesizes, defaultstoragesize, packagestorage } = useNamespacedState('MANAGEFLAVOR', ['storagesizes','defaultstoragesize', 'packagestorage'])
    function isStorageSelected(id) {
      return id == storageselected.value.id;
    }    
    
    return {
        fetchdefaultstoragesize,
        defaultstoragesize,
        fetchstoragesizes,
        storageselected,
        fetchstoragesize,
        storagesize,
        storagesizes,
        isStorageSelected,
        fetchVolumeSize,
        volumeSize,
        isLoading,
        fetchpackagestorage,
        packagestorage,        
    }
}