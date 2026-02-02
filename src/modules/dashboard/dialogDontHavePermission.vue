<template>
  <v-dialog v-if="dialog" v-model="dialog" persistent max-width="550">
    <v-card>
      <v-card-title class="headline">
        <v-icon class="mr-4">$vuetify.icons.trianglealertIcon</v-icon>Access Denied
      </v-card-title>
      <v-card-text class="pb-0">
        <p v-if="dialog === 'suspend'" class="font-weight-bold">
          Your account has been suspended, please contact your administrator for further information
        </p>
        <p v-else-if="dialog === 'terminated'" class="font-weight-bold">
          Your account has been terminated, please contact your administrator for further information
        </p>
        <p v-else class="font-weight-bold">Your role is not allowed to access this feature, please contact your administrator for further information</p>
        <p class="mb-0">You can contact our service department at <a href="mailto:info@cloudeka.id">info@cloudeka.id</a></p>
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
    const { opendialogdonthavepermission } = useNamespacedState(
      "DASHBOARD",["opendialogdonthavepermission"]
    );
    const {
      setopendialogdonthavepermission,
    } = useNamespacedMutations("DASHBOARD", [
      "setopendialogdonthavepermission",
    ]);
    const dialog = computed({
      get: () => {
        return opendialogdonthavepermission.value;
      },
      set: (val) => {
        setopendialogdonthavepermission(val);
      },
    });
    return {
      dialog,
      message: "You don't have permission to do this"
    };
  },
};
</script>