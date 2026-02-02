<template>
  <v-dialog v-model="value" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete {{ selectedBackup ? selectedBackup.name : 'Backup Scheduler' }}
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>
          Deleted backup scheduler could not be restored.
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
              :disabled="isLoading"
              color="error"
              block
              height="50"
              depressed
              @click="$emit('delete')"
            >
              <beat-loader v-if="isLoading" size="10px" color="white" :loading="isLoading"></beat-loader>
              <span v-else>Delete</span>
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
  props: [
    'selectedBackup', 
    'value',
  ],
  setup: (props, context) => {
    const { isLoading } = useNamespacedState('IMAGES', ['isLoading'])
    const { dialog } = useDialog(props, context)

    return {
      dialog,
      isLoading,
    };
  },
  
};
</script>