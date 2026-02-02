<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card class="pt-7 rounded-lg">

      <v-card-text>
        <div class="d-flex flex-row">
          <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
          <p class="fz-21 font-weight-bold mb-0">Select Organization and Project</p>
        </div>

      </v-card-text>
      <v-card-text>
        <p class="mb-0">Please select any project first to use this menu</p>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col class="d-flex flex-row justify-center">
            <v-btn
              color="secondary"
              depressed
              block
              height="50"
              @click="
                () => {
                  $emit('selectproject')
                  dialog = false;
                }
              "
            >
              Select Project
            </v-btn>
          </v-col>

        </v-row>
      </v-card-text>
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