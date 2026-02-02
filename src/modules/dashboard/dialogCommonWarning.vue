<template>
  <v-dialog v-if="dialog" v-model="dialog" persistent max-width="550">
    <v-card>
      <v-card-title class="headline font-weight-bold font--text pb-4">
        <v-icon class="mr-4">$vuetify.icons.trianglealertIcon</v-icon> 
          {{ titlecommonwarning }}
      </v-card-title>
      <v-card-text class="pb-0 pt-4">
        <p class="font-weight-400">{{ messagecommonwarning }}</p>
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
                  dialog = false;
                }
              "
            >
              Close
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { computed } from "@vue/composition-api";
import {
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  setup(props, context) {
    const { opendialogcommonwarning, messagecommonwarning, titlecommonwarning } = useNamespacedState(
      "DASHBOARD",["opendialogcommonwarning","messagecommonwarning", 'titlecommonwarning']
    );
    const {
      setopendialogcommonwarning,
    } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonwarning",
    ]);
    const dialog = computed({
      get: () => {
        return opendialogcommonwarning.value;
      },
      set: (val) => {
        setopendialogcommonwarning(val);
      },
    });
    return {
      dialog,
      messagecommonwarning,
      titlecommonwarning,
    };
  },
};
</script>