import { INSTANCE } from '../namespace'
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import {ref, computed, watch} from '@vue/composition-api'

export const useImages = () => {
  const imageidselected = ref("");
  const {fetchimages, fetchVersion} = useNamespacedActions(INSTANCE, ['fetchimages', 'fetchVersion'])
  const {images, version} = useNamespacedState(INSTANCE, ['images', 'version'])
  const selectOs = computed(() => {
    let data = [];
    images.value.map(e => {
      data.push({
        value: e.id,
        text: e.os.name + ' ' + e.version_number + ' ' + e.os.file_system
      });
    })
    return data;
  });
  const osSelected = ref('');
  const versionSelected = ref('');
  const bitVersionSelected = ref('');

  const selectVersion = computed(() => {
    let data = [];
    version.value.map(e => {
      data.push({
        value: e.id,
        text: e.version_name
      });
    })
    return data;
  });

  const { customImages } = useNamespacedState('IMAGES', ['customImages'])
  const { fetchCustomImages } = useNamespacedActions('IMAGES', ['fetchCustomImages'])

  watch(osSelected, val => {
    fetchVersion(val)
  })


  return {
    fetchCustomImages,
    customImages,
    imageidselected,
    fetchimages,
    images,
    selectOs,
    osSelected,
    versionSelected,
    bitVersionSelected,
    selectVersion
  }
}