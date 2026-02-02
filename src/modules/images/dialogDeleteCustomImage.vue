<template>
  <v-dialog v-model="value" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete {{ selectedCustomImage ? selectedCustomImage.name : 'Custom Image' }}
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>
          Deleted custom image could not be restored.
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
              @click="doDelete()"
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
  props: ['selectedCustomImage', 'value'],
  setup: (props, context) => {
    const { isLoading } = useNamespacedState('IMAGES', ['isLoading']);
    const { deleteCustomImage } = useNamespacedActions('IMAGES', ['deleteCustomImage']);
    const { dialog } = useDialog(props, context)
    const doDelete = async () => {
      const response = await deleteCustomImage(props.selectedCustomImage)
      if (response.status === 200) context.emit('input', false)
    }

    return {
      doDelete,
      deleteCustomImage,
      isLoading,
      dialog
    };
  },
  
};
</script>