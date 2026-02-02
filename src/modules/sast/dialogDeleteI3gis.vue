<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Confirm delete this Deka AST
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>This action is irreversible. To confirm deletion, click the button below.</p>
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
                  dialog = false
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
              @click="
                () => {
                  Delete().then(()=>{
                  $emit('close');
                  }).catch(e=>{

                  })
                }
              "
            >
              Delete Deka AST
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { useDialog } from '@/composable/usedialog';
import { useNamespacedActions } from "vuex-composition-helpers";
import { PROJECT } from "../project/namespace";
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: ["value", 'selectedproject'],
  setup(props: any, context: any) {
    console.log("selected project ",props.selectedproject);
    
    const { deleteproject } = useNamespacedActions(PROJECT, ["deleteproject"]);
    const { dialog } = useDialog(props, context)
    return {
      Delete: async () => {
        //await deleteproject(props.selectedproject)
        context.emit("deleteproject")
      },
      dialog
    }
  },
});
</script>