<template>
  <div>
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
    <v-dialog v-if="dialog" v-model="dialogerror" persistent max-width="550">
      <v-card>
        <v-card-title class="headline font-weight-bold font--text pb-4">
          <v-icon class="mr-4">$vuetify.icons.trianglealertIcon</v-icon>
          titlecommonwarning
        </v-card-title>
        <v-card-text class="pb-0 pt-4">
          <p class="font-weight-400">Cannot delete project</p>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col
              class="px-0"
            >
              <v-btn
                height="50"
                depressed
                color="secondary"
                block
                @click="
                () => {
                  dialogerror = false;
                }
              "
              >
                Okay
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang='ts'>
import { defineComponent, ref } from '@vue/composition-api';
import { useDialog } from "@/composable/usedialog";
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
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

    const { opendialogdonthavepermission } = useNamespacedMutations(
      "DASHBOARD", ["opendialogdonthavepermission"]
    );

    const {
      setopendialogcommonwarning,
      setmessagecommonwarning
    } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonwarning",
      "setmessagecommonwarning"
    ]);


    const dialogerror = ref(false);

    const Destroy = async () => {
      deleteVersion(props.item).then(() => {
        context.emit("deleted");
        dialog.value = false;
        setopendialogcommonsuccess(true);
      }).catch(() => {
        dialogerror.value = false;
        setopendialogcommonwarning(true)
        setmessagecommonwarning('Cannot delete this type because still used by some organization')
      });
    };
    return {
      dialog,
      Destroy,
      dialogerror,
    };
  },
});
</script>