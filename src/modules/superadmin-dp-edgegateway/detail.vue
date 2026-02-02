<template>
  <div>
    <DetailV v-if="type == 'NSXV_BACKED'" />
    <DetailT v-else-if="type == 'NSXT_BACKED'" />
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from '@vue/composition-api'
import DetailV from './detail-v.vue'
import DetailT from './detail-t.vue'

export default {
  components: {
    DetailV,
    DetailT
  },
  setup() {

    onMounted(() => {
      let detailEdge = JSON.parse(localStorage.getItem('detailEdge'))
      type.value = detailEdge.type

    })
    onUnmounted(() => {
      localStorage.removeItem('detailEdge')
    })
    const type = ref()
    return{
      type
    }
  },
}
</script>