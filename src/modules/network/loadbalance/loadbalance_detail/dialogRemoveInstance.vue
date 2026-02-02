<template>
  <v-dialog v-model="value" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Remove Instance
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>
          The instance will be removed from load balancer members, but the instance will not be destroyed.
        </p>
        <p><b>Do you wish to proceed?</b></p>
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
                  $emit('input', false);
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="error"
              block
              height="50"
              depressed
              @click="$emit('remove')"
            >
            Remove
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useDialog } from '@/composable/usedialog';
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
export default {
  props: ["value", "instanceName", "selectedinstance"],
  setup: (props, context) => {
    const { deleteInstance } = useNamespacedActions('INSTANCE', [
      "deleteInstance",
    ]);
    
    const { isLoading } = useNamespacedState('INSTANCE', [
      "isLoading",
    ]);

    const { dialog } = useDialog(props, context)
    return {
      deleteInstance,
      dialog,
      isLoading,
    };
  },
  
};
</script>