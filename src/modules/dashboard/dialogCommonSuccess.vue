<template>
  <v-dialog v-if="dialog" v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="headline font-weight-bold font--text">
        <v-icon left>$vuetify.ison.successCircleIcon</v-icon> Data has been saved!
      </v-card-title>
      <v-card-text class="pb-0">
        <p class=" mb-0">{{messagecommonsuccess}}</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col>
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
    const { opendialogcommonsuccess, messagecommonsuccess } = useNamespacedState(
      "DASHBOARD",["opendialogcommonsuccess","messagecommonsuccess"]
    );
    const {
      setopendialogcommonsuccess,
    } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);
    const dialog = computed({
      get: () => {
        return opendialogcommonsuccess.value;
      },
      set: (val) => {
        setopendialogcommonsuccess(val);
      },
    });
    return {
      dialog,
      messagecommonsuccess
    };
  },
};
</script>