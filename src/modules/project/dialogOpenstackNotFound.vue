<template>
  <v-dialog v-if="dialog" v-model="dialog" max-width="500">
    <v-card class="pt-7 rounded-lg">

      <v-card-text>
        <div class="d-flex flex-row">
          <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
          <p class="fz-21 font-weight-bold mb-0">Create Deka Flexi Project</p>
        </div>

      </v-card-text>
      <v-card-text>
        <p class="mb-0">Seems you dont have any project on dekaflexi</p>
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
                  dialog = false;
                  opendialogcreateopenstack()
                }
              "
            >
            Create
            </v-btn>
          </v-col>

        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from "vuex-composition-helpers";
import { PROJECT } from "./namespace";
import { computed, defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: ["value"],
  setup(props: any, context) {

    const { opendialogopenstacknotfound } = useNamespacedState(PROJECT, ['opendialogopenstacknotfound'])
    const { setopendialogopenstacknotfound } = useNamespacedMutations(PROJECT, ['setopendialogopenstacknotfound'])
    const { opendialogcreateopenstack } = useNamespacedActions(PROJECT, ['opendialogcreateopenstack'])
    const dialog = computed({
      get: () => opendialogopenstacknotfound.value,
      set: (val: any) => setopendialogopenstacknotfound(val)
    })

    return {
      dialog,
      opendialogcreateopenstack
    };
  },
});
</script>