<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete {{ header == 'staticroute' ? 'Routing' : header == 'nat' ? 'NAT' : header == 'interface' ? 'Floating IP' : 'Network' }}
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
              color="error"
              block
              height="50"
              depressed
              :disabled="isLoadingBtn"
              :loading="isLoadingBtn"
              @click="doDelete"
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
import { pasteRulesPlugin } from "@tiptap/core";

export default defineComponent({
  props: ["value", "itemSelected", "header"],
  setup(props: any, context) {
    const { dialog } = useDialog(props, context)
    const { 
      deleteNetwork,
      deleteInterface,
      deleteStaticRouting,
      deleteNat
      } = useNamespacedActions(NETWORKVPC, [
      "deleteNetwork",
      "deleteInterface",
      "deleteStaticRouting",
      "deleteNat"
    ]);
    const { 
      isLoadingBtn
      } = useNamespacedState(NETWORKVPC, [
      "isLoadingBtn"
    ]);

    const doDelete = async() => {
      let resp = null
      if(props.header == 'network'){
        console.log('network')
        // localStorage.setItem('is_network', 'yes')
        resp = await deleteNetwork({id: props.itemSelected.id})
      }else if(props.header == 'interface'){
        console.log('interface')
        resp = await deleteInterface({id: props.itemSelected.id})
      }else if(props.header == 'staticroute'){
        console.log('staticroute')
        resp = await deleteStaticRouting({id: props.itemSelected.id})
      }else if(props.header == 'nat'){
        console.log('nat')
        resp = await deleteNat({id: props.itemSelected.id})
      }else{
        console.log('no header')
      }
      if(resp != null){
        if(resp.status == 200){
          dialog.value = false
          context.emit('refreshTab')
        }else{
          dialog.value = false
          console.log(resp)
        }
      }else{
        console.log('no hit api')
      }
    }

    return {
      dialog,
      doDelete,
      isLoadingBtn
    }
  },
});
</script>