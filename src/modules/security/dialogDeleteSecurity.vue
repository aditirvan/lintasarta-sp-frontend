<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Destroy Firewall
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>This is irreversible. Your Firewall will be destroyed, and any Instance will be dissociated from them.</p>
        <p>Once this happens, the Instance will allow any type of inbound and outbound traffic, unless you've configured
          a software firewall in them.</p>
        <p>Do you want to permanently destroy this?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              @click="
                () => {
                  dialog = false
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="error"
              block
              height="50"
              depressed
              @click="
                () => {
                  Delete().then(()=>{
                  $emit('deleted')
                  dialog = false
                  })
                }
              "
            >
              Destroy
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { defineComponent } from '@vue/composition-api';
import { useDialog } from '@/composable/usedialog'
import { useNamespacedActions } from 'vuex-composition-helpers'

export default defineComponent({
  props: ["value", 'selectedsecurity'],
  setup(props: any, context) {
    const { dialog } = useDialog(props, context)
    const { DELETE_SECURITY } = useNamespacedActions('SECURITY', ['DELETE_SECURITY'])
    return {
      Delete: async () => {
        await DELETE_SECURITY({ id: props.selectedsecurity.id })
      },
      dialog
    }
  },
});
</script>