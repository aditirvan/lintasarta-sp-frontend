<template>
  <v-dialog v-if="dialog" v-model="dialog" persistent max-width="550">
    <v-card>
      <v-card-title class="headline">
        <v-icon class="mr-4">$vuetify.icons.trianglealertIcon</v-icon>Organization has reached limit!
      </v-card-title>
      <v-card-text v-if="userrole != 'Superadmin'" class="pb-0">
        <p class="font-weight-bold">Your organization has reached the limit, please upgrade your organization type to get unlimited services</p>
        <p class="mb-0">You can contact our service department at <span class="linkpointer">info@cloudeka.id</span></p>
      </v-card-text>
      <v-card-text v-else class="pb-0">
        <p class="font-weight-bold">This organization has reached the limit, please upgrade organization type to get unlimited services</p>
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
import { ROLEPERMISSION } from '../organization/namespace';
export default {
  setup(props, context) {
    const { opendialogreachlimit } = useNamespacedState(
      "DASHBOARD",["opendialogreachlimit"]
    );
    const {
      setopendialogreachlimit,
    } = useNamespacedMutations("DASHBOARD", [
      "setopendialogreachlimit",
    ]);
    const dialog = computed({
      get: () => {
        return opendialogreachlimit.value;
      },
      set: (val) => {
        setopendialogreachlimit(val);
      },
    });
    const {userrole} = useNamespacedState(ROLEPERMISSION, ['userrole'])

    return {
      userrole,
      dialog,
      message: "You don't have permission to do this"
    };
  },
};
</script>