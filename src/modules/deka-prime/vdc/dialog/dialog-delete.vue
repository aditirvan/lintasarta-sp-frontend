<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete {{ header }} {{ header == 'Instance' ? itemSelected.Name : itemSelected.name }}
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure you want to proceed?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
            :disabled="isLoading"
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
            :loading="isLoading"
            :disabled="isLoading"
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
import { onMounted, ref } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from 'vuex-composition-helpers'
import { VDC } from "../namespace";
import { DPNETWORK } from '../../networking/namespace';

export default {
  props: ["value", "header", "itemSelected"],
  setup(props, context) {
    const {
      deleteInstance,
      deleteVM,
    } = useNamespacedActions(VDC, [
      "deleteInstance",
      "deleteVM",
    ]);
    const { deleteNetwork,  } = useNamespacedActions(
      DPNETWORK,
      ["deleteNetwork",]
    );
    // const { isLoadingBtn } = useNamespacedGetters(VDC, ["isLoadingBtn"])

    const { dialog } = useDialog(props, context)
    const isLoading = ref(false)

    const getId = (string) => {
      const pattern =
        /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      const hasil = string.match(pattern);
      return hasil[6];
    };
    const splitId = (data) => {
      let splitData = data.split(':')
      return splitData[3]
    }
    const deleteAction = async() => {
      // console.log(props.itemSelected)
      isLoading.value = true
      if(props.header == 'Instance'){
        const prime = JSON.parse(localStorage.getItem("dekaPrime"))
        const params = {
          id_vdc: prime.vmwareProjectId,
          id_vm: getId(props.itemSelected.HREF),
          id_org: prime.vmwareOrganizationId,
        };
        await deleteVM(params)
      }else if(props.header == 'Network'){
        const params = {
          id_network: splitId(props.itemSelected.id),
          id_vdc: splitId(props.itemSelected.orgVdc.id)
        }
        await deleteNetwork(params)
        // console.log(params)
      }
      isLoading.value = false
      dialog.value = false
    }

    onMounted(() => {
      // console.log(props)
    })

    return{
      dialog,
      deleteAction,
      isLoading,
    }
  },
}
</script>