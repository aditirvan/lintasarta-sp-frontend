<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete Object Storage {{ objectStorage.object_storage_size }} GB
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p class="fz-16">Are you sure you want to proceed?</p>
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
                  dialog = false;
                }
              "
            >
              <span class="fz-14">Cancel</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn color="error" block height="50" depressed @click="doDelete(objectStorage)">
              <span class="fz-14">Confirm</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { defineComponent } from "@vue/composition-api";
import { useDialog } from "@/composable/usedialog";
import { useNamespacedActions } from "vuex-composition-helpers";
import { MANAGEFLAVOR } from "./namespace";
const module = defineComponent({
  props: ["value", "objectStorage"],
  setup(props, { emit }) {
    const { dialog } = useDialog(props, { emit });
    const { deleteS3Flavor } = useNamespacedActions(MANAGEFLAVOR, [
      'deleteS3Flavor',
    ]);
    
    const doDelete = async (objectStorage:any) => {
      const { id } = objectStorage
      const response = await deleteS3Flavor({ id })
      if(response.status === 200){
        dialog.value = false;
      }
    };

    return {
      dialog,
      doDelete,
    };
  },
});
export default module;
</script>