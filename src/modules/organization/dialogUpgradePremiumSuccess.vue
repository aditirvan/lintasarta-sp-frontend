<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card class="rounded-xl pa-2">
      <v-card-title class="d-flex justify-center">
        <div style="font-size: 21px" class="pb-0 font-weight-bold font--text">
          Upgrade Request Was Successful!
        </div>
      </v-card-title>
      <v-card-title class="d-flex justify-center py-0">
        <div
          class="pb-0 text-center accent--text"
          style="max-width: 420px; font-size: 14px"
        >
          The request will be verified by Lintasarta, we will
        </div>
        <div
          class="pb-0 text-center accent--text"
          style="max-width: 420px; font-size: 14px"
        >
          notify you if the request has been approved
        </div>
      </v-card-title>

      <v-card-actions>
        <v-row class="ma-2">
          <v-col class="py-0">
            <v-btn
              color="secondary"
              block
              height="50"
              depressed
              @click="
                () => {
                  dialog = false;
                }
              "
            >
              <span class="fz-14">Ok</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { defineComponent } from '@vue/composition-api';
import { useDialog } from "@/composable/usedialog";

export default defineComponent({
  props: ["value"],
  setup(props: any, context) {
    const { dialog } = useDialog(props, context);
    return {
      dialog,
    };
  },
});
</script>