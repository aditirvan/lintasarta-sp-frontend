<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="pt-6">
        <div class="headline font-weight-bold font--text pb-4">
          Delete Version
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p class="fz-16">Are you sure you want to proceed?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              class="fz-14"
              color="accent"
              block
              depressed
              height="50"
              @click="
                () => {
                  dialog = false;
                }
              "
            >
              <span class="fz-14">Cancel</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn color="error" block height="50" depressed @click="Destroy">
              <span class="fz-14">Confirm</span>
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
import {
  useNamespacedActions,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { SUPERADMINMANAGEOS } from "./namespace";

export default defineComponent({
  props: ["value", "item"],
  setup(props: any, context) {
    const { dialog } = useDialog(props, context);
    const { deleteVersion } = useNamespacedActions(SUPERADMINMANAGEOS, [
      "deleteVersion",
    ]);
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);

    const Destroy = async () => {
      return await deleteVersion(props.item).then(() => {
        context.emit("deleted");
        dialog.value = false;
        setopendialogcommonsuccess(true);
      });
    };
    return {
      dialog,
      Destroy,
    };
  },
});
</script>