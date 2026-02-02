<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete {{ header }}
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure you want to proceed?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
            :disabled="isLoadingBtn"
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
            :loading="isLoadingBtn"
            :disabled="isLoadingBtn"
            color="error"
            block
            height="50"
            depressed
            @click="deleteAction"
            >
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog'
import { onMounted } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from 'vuex-composition-helpers'
import { HARBOR } from './namespace'

export default {
  props: ["value", "header", "itemSelected"],
  setup(props, context) {
    const { deleteWorker, deleteCluster, deleteSelectedWorker } = useNamespacedActions(HARBOR, ["deleteWorker", "deleteCluster", "deleteSelectedWorker"])
    const { isLoadingBtn } = useNamespacedGetters(HARBOR, ["isLoadingBtn"])
    const { rowsDelete } = useNamespacedState(HARBOR, ["rowsDelete"])


    const { dialog } = useDialog(props, context)

    const deleteAction = async() => {
      let payload = {}
      let resp

      if(props.header == 'Worker'){
        payload.harbor_id= props.itemSelected.harbor_id
        payload.worker_id = props.itemSelected.id
        resp = await deleteWorker(payload)
      }else if(props.header == 'Selected Worker'){
        payload = props.itemSelected
        resp = await deleteSelectedWorker(payload)
        context.root.$store.commit('DEKAHARBOR/setSelectedRows', [])
      }else if(props.header == 'Harbor'){
        payload.harbor_id = props.itemSelected.id
        resp = await deleteCluster(payload)
      }
      // console.log(payload)
      // console.log(resp)
      if(resp.status == 200){
        context.emit('refreshTable')
        dialog.value = false
      }else{
        console.log(resp)
        dialog.value = false
      }
      context.emit('clearItem')
    }

    onMounted(() => {
      // console.log(props)
    })

    return{
      dialog,
      deleteAction,
      isLoadingBtn,
      rowsDelete
    }
  },
}
</script>