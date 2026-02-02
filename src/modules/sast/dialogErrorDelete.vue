<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Failed delete Deka AST
        </div>
      </v-card-title>
     
      <v-card-actions>
        <v-row class="ma-2">

          <v-col>
            <v-btn
              color="error"
              block
              height="50"
              depressed
              @click="
                () => {
                  dialog = false
                }
              "
            >
              Ok
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { defineComponent } from '@vue/composition-api';
import { useDialog } from '@/composable/usedialog';

export default defineComponent({
  props: ["value", 'message'],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    return {
      dialog
    }
  },
});
</script>