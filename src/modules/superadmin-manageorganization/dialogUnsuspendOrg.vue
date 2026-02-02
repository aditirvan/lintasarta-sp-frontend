<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card class="text-center">
      <v-card-title class="justify-center headline font-weight-bold font--text pb-4">
        Unsuspend Organization
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure to unsuspend this organization?</p>
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
              color="primary"
              block
              height="50"
              depressed
              @click="
                () => {
                  Unsuspend()
                }
              "
            >
              Unsuspend Organization
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { useDialog } from '@/composable/usedialog';
import { useNamespacedActions } from "vuex-composition-helpers";
import { defineComponent } from '@vue/composition-api';
//import { PROJECT } from "./namespace";
import { SUPERADMINMANAGEORG} from "./namespace";

export default defineComponent({
  props: ["value", 'org'],
  setup(props: any, context: any) {
    //const { deleteproject } = useNamespacedActions(PROJECT, ["deleteproject"]);
    const { dialog } = useDialog(props, context)
    const { unsuspendorg } = useNamespacedActions(SUPERADMINMANAGEORG, ["unsuspendorg"]);

    return {
      Unsuspend: async () => {
        unsuspendorg(props.org.id)
        .then(() => {
          dialog.value = false;
          context.emit("success")
        })
        .catch((e) => {
          context.emit("error", e.response)
        });
      },
      dialog
    }
  },
});
</script>