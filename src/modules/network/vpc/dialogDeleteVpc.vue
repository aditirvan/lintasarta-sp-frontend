<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete VPC
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure you want to proceed?</p>
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
                  $emit('confirm')
                  dialog = false
                }
              "
            >
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { useDialog } from '@/composable/usedialog'
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: ["value"],
  setup(props: any, context) {
    const { dialog } = useDialog(props, context)
    return {
      dialog
    }
  },
});
</script>