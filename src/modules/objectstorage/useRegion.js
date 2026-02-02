import { MANAGEOBJECTSTORAGEREGION } from '@/modules/superadmin-manageflavors/namespace'
import {
    useNamespacedActions,
    useNamespacedState,
  } from "vuex-composition-helpers";
import { ref, computed} from  '@vue/composition-api'

export const useRegion = ()=>{
    const regionidselected = ref('');
    const { fetchRegions: fetchregions } = useNamespacedActions(MANAGEOBJECTSTORAGEREGION, ['fetchRegions'])
    const { regions } = useNamespacedState(MANAGEOBJECTSTORAGEREGION, ['regions'])
    
    const selectregions = computed(() => {
        return regions.value.map((e) => ({
          text: e.name,
          value: e,
        }));
      });

    const regionselected = ref('')
    const selectedRegion = ref(null)

    return {
        selectedRegion,
        regionidselected,
        fetchregions,
        regions,
        selectregions,
        regionselected,
    }
}