<template>
  <v-dialog v-model="modal" max-width="1000">
    <v-card>
      <v-card-title class="px-7">
        <div class="headline font-weight-bold font--text">
          Status OpenVPN
        </div>
      </v-card-title>
      <v-card-text class="pa-5">
        <status-openvpn :dataValue="dataValue"/>
      </v-card-text>
      <v-card-text>
      <v-row>
        <v-col>
          <v-btn
          block
          height="45"
          depressed
          class="accent fz-14"
          @click="modal = false"
        >
          <span>Close</span>
        </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed, onMounted, ref } from '@vue/composition-api'
import StatusOpenvpn from './statusOpenvpn.vue'

export default {
  components:{
    StatusOpenvpn
  },
  props: ["value", "dataValue"],
  setup(props, context) {
    const modal = computed({
      get: () => props.value,
      set: (val) => {
        if(!val){
          // textDel.value = ''
        }
        context.emit("input", false)
      }
    })
    
    const dataItems = ref([])

    onMounted(() => {
    })

    return{
      modal,
      dataItems
    }
  },
}
</script>