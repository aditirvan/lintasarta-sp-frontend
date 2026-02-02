<template>
  <v-dialog v-if="dialog" v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete {{ client.name }}
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure you want to proceed?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn color="accent" :disabled="isLoading" block depressed height="50" @click="dialog = false"> Cancel </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="error"
              block
              height="50"
              :disabled="isLoading"
              :loading="isLoading"
              @click="
                () => {
                  doDelete()
                }
              "
              depressed
            >
              Yes
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog'
import { useNamespacedActions } from 'vuex-composition-helpers';
import { NFS } from '../namespace';
import { ref } from '@vue/composition-api';

export default {
  props: ["value", "client"],
  setup(props, context) {
    const { deleteClient, getNFSClientList } = useNamespacedActions(NFS, [
      "deleteClient", "getNFSClientList"
    ]);
    const isLoading = ref(false)
    const { dialog } = useDialog(props, context)

    const doDelete = async() => {
      isLoading.value = true
      let payload = {
        nfs_id: context.root.$route.params.id,
        client_id: props.client.id
      }
      let res = await deleteClient(payload)
      if (res && res.status == 204) {
        await getNFSClientList({ params: { id: props.client.nfs_id } });
      }
      isLoading.value = false
      dialog.value = false
    }

    return{
      dialog,
      doDelete,
      isLoading
    }
  },
}
</script>