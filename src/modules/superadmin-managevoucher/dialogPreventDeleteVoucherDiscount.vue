<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="d-flex justify-center">
        <p class="headline font-weight-bold font--text pb-4">
          Cannot Delete This Vouher Discount
        </p>
      </v-card-title>
      <v-card-text class="pb-0 d-flex justify-center">
        <p>This voucher discount is used by project</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="12">
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
              <span class="fz-14">OK</span>
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