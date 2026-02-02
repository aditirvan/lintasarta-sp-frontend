import { INSTANCE } from '../namespace'
import { MANAGEZONE } from '@/modules/superadmin-manageflavors/namespace'
import {
    useNamespacedActions,
    useNamespacedState,
  } from "vuex-composition-helpers";
import { ref, computed, watch} from  '@vue/composition-api'
// const { required } = require("@vuelidate/validators");
// const useVuelidate = require("@vuelidate/core").default;
export const useZone = ()=>{
    const zoneidselected = ref('');
    const { fetchZones: fetchzones, fetchZoneByRegion: fetchzonebyregion, fetchProjectByUser: fetchprojectbyuser, fetchZoneByStatus: fetchzonebystatus, fetchZoneOS: fetchzoneos, fetchZoneByProject: fetchzonebyproject } = useNamespacedActions(MANAGEZONE, ['fetchZones', 'fetchZoneByRegion', 'fetchProjectByUser', 'fetchZoneByStatus', 'fetchZoneOS', 'fetchZoneByProject'])
    const { zones, zoneByRegion, projectByUser, zoneByStatus, zoneOS, zoneByProject } = useNamespacedState(MANAGEZONE, ['zones', 'zoneByRegion', 'projectByUser', 'zoneByStatus', 'zoneOS', 'zoneByProject'])
    const selectzones = computed(() => {
      return zones.value.map((e) => ({
        text: e.name,
        value: e,
      }));
    });
  
    const selectzonebyregion = computed(() => {
      return zoneByRegion.value.map((e) => ({
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

    const selectzonesbystatus = computed(() => {
      return zoneByStatus.value.map((e) => ({
        text: e.name,
        value: e,
      }));
    });

    const selectzonesos = computed(() => {
      return zoneOS.value.map((e) => ({
        text: e.zoneName,
        value: e,
      }));
    });

    const selectzonebyproject = computed(() => {
      return zoneByProject.value.map((e) => ({
        text: e.name,
        value: e,
      }));
    });
    
    const zoneselected = ref('')
    const selectedZone = ref(null)
    const selectedProject = ref(null)
    const selectedZoneModel = ref(null)

    // watch(selectzones, () =>{
    //   zoneidselected.value = selectzones.value.filter(r => r.value == 'TKP')[0].value
    //   zoneselected.value = zones.value.filter(r => r.zone == 'TKP')[0]
    //   selectedZone.value = zones.value.filter(r => r.zone == 'TKP')[0]
    // })

    return {
        selectedZone,
        zoneidselected,
        fetchzones,
        zones,
        selectzones,
        zoneselected,
        fetchzonebyregion,
        zoneByRegion,
        selectzonebyregion,
        fetchprojectbyuser,
        selectprojectbyuser,
        selectedProject,
        fetchzonebystatus,
        zoneByStatus,
        selectzonesbystatus,
        fetchzoneos,
        zoneOS,
        selectzonesos,
        selectedZoneModel,
        fetchzonebyproject,
        zoneByProject,
        selectzonebyproject,
    }
}