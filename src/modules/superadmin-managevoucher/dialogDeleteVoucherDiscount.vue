<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete Voucher Discount
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
              <span class="fz-14">Cancel</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              id="Confirm"
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
              <span class="fz-14">Confirm</span>
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
  props: ["value", 'selectedvoucher'],
  setup(props: any, context) {
    const { dialog } = useDialog(props, context)
    return {
      dialog
    }
  },
});
</script>