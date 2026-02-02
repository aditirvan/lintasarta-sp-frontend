<template>
  <v-dialog v-if="dialog" v-model="dialog" max-width="500">
    <v-card>

      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          <v-icon left>$vuetify.ison.successCircleIcon</v-icon>
          {{ title }}
        </div>
      </v-card-title>

      <v-card-text class="pb-0">
        <p class=" mb-0">{{ message }}</p>
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


<script lang='ts'>
import { useDialog } from '@/composable/usedialog';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: ["value", 'message', 'title'],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    return {
      dialog
    }
  },
});
</script>

