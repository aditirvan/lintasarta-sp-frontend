<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          {{ header }} Gateway
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure you want to proceed?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              :disabled="isLoadingBtn"
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
              :color="header == 'Set' ? 'primary' : 'error'"
              block
              height="50"
              depressed
              :disabled="isLoadingBtn"
              :loading="isLoadingBtn"
              @click="doAction"
            >
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { NETWORKVPC } from "../namespace";
import { useDialog } from '@/composable/usedialog'
import { defineComponent } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers'

export default defineComponent({
  props: ["value", "itemSelected", "header"],
  setup(props: any, context) {
    const { dialog } = useDialog(props, context)
    const { 
        setDeleteGateway
      } = useNamespacedActions(NETWORKVPC, [
        "setDeleteGateway"
    ]);
    const { 
      isLoadingBtn
      } = useNamespacedState(NETWORKVPC, [
      "isLoadingBtn"
    ]);

    const doAction = async() => {
      let id = props.header === 'Set' ? props.itemSelected.id : props.itemSelected.router.id
      let resp = await setDeleteGateway({ id: id, header: props.header})
      if(resp.status == 200){
        dialog.value = false
        context.emit('refreshTab')
      }
      // console.log(props.itemSelected)
    }

    return {
      dialog,
      doAction,
      isLoadingBtn
    }
  },
});
</script>