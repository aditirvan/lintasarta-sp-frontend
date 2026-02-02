import { INSTANCE } from '../namespace'
import { MANAGEINSTANCEREGION } from '@/modules/superadmin-manageflavors/namespace'
import {
    useNamespacedActions,
    useNamespacedState,
  } from "vuex-composition-helpers";
import { ref, computed, watch} from  '@vue/composition-api'
// const { required } = require("@vuelidate/validators");
// const useVuelidate = require("@vuelidate/core").default;
export const useRegion = ()=>{
    const regionidselected = ref('');
    const { fetchRegions: fetchregions, fetchRegionByProject: fetchregionbyproject, fetchProjectByUser: fetchprojectbyuser, fetchRegionByStatus: fetchregionbystatus } = useNamespacedActions(MANAGEINSTANCEREGION, ['fetchRegions', 'fetchRegionByProject', 'fetchProjectByUser', 'fetchRegionByStatus'])
    const { regions, regionByProject, projectByUser, regionByStatus } = useNamespacedState(MANAGEINSTANCEREGION, ['regions', 'regionByProject', 'projectByUser', 'regionByStatus'])
    const selectregions = computed(() => {
      return regions.value.map((e) => ({
        text: e.name,
        value: e,
      }));
    });
  
  const selectregionbyproject = computed(() => {
    return regionByProject.value.map((e) => ({
      text: e.name,
      value: e,
    }));
  });

  const selectprojectbyuser = computed(() => {
    return projectByUser.value.map((e) => ({
      text: e.name,
      value: e.id,
    }));
  });

  const selectregionsbystatus = computed(() => {
    return regionByStatus.value.map((e) => ({
      text: e.name,
      value: e,
    }));
  });
    
    const regionselected = ref('')
    const selectedRegion = ref(null)
    const selectedProject = ref(null)

    // watch(selectregions, () =>{
    //   regionidselected.value = selectregions.value.filter(r => r.value == 'TKP')[0].value
    //   regionselected.value = regions.value.filter(r => r.region == 'TKP')[0]
    //   selectedRegion.value = regions.value.filter(r => r.region == 'TKP')[0]
    // })

    return {
        selectedRegion,
        regionidselected,
        fetchregions,
        regions,
        selectregions,
        regionselected,
        fetchregionbyproject,
        regionByProject,
        selectregionbyproject,
        fetchprojectbyuser,
        selectprojectbyuser,
        selectedProject,
        fetchregionbystatus,
        regionByStatus,
        selectregionsbystatus,
    }
}