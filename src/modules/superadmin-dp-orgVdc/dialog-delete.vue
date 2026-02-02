<template>
  <v-dialog max-width="550" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Delete {{ item.name }}</div>
      </v-card-text>

      <v-card-text>
        <span class="font-weight-bold"> Warning: </span>Deleting {{ item.name }} cannot be undone.Deleting an Organization VDC permanently removes the VDC and all resources connected to it.
        <br />
        <br />
        <div class="d-flex" v-if="TotalRowsEdgeGateway">
          <v-checkbox
          class="mt-0 pt-0"
          v-model="checkbox"
          color="primary"
          hide-details
          />
          <span class="mt-1">
            {{ TotalRowsEdgeGateway }} Edge Gateways connected to the Organization VDC will be deleted.
          </span>
        </div>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
            :disabled="isLoadingBtn"
            depressed
            height="45"
            block
            class="accent"
            @click="
              () => {
                dialog = false
              }
            "
            >Cancel</v-btn>
          </v-col>
          <v-col>
            <v-btn
            :disabled="isLoadingBtn || !checkbox"
            :loading="isLoadingBtn"
            id="Add"
            depressed
            height="45"
            block
            class="error"
            @click="setData"
            >
              Delete
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { ORGVDC } from './namespace';
import { onMounted, ref } from '@vue/composition-api';
import { EDGEGATEWAY } from '../superadmin-dp-edgegateway/namespace';

export default {
  props: ["value", "item"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { deleteOrgVdc } = useNamespacedActions(ORGVDC, ["deleteOrgVdc"])
    const { isLoadingBtn, orgVdcById } = useNamespacedGetters(ORGVDC, ["isLoadingBtn", "orgVdcById"])

    const { fetchEdgeGateway } = useNamespacedActions(EDGEGATEWAY, ["fetchEdgeGateway"])

    const { TotalRowsEdgeGateway } = useNamespacedGetters(EDGEGATEWAY, ["TotalRowsEdgeGateway"])

    onMounted(async() => {
      await fetchEdgeGateway({ page:1 , itemsPerPage:10, vdc: orgVdcById.value.href})
    })

    const checkbox = ref(false)
    
    const setData = async() => {
      let detailOrgVdc = JSON.parse(localStorage.getItem('detailOrgVdc'))
      let payload = {
        orgVdcId: detailOrgVdc.id,
      }
      // console.log(payload)
      await deleteOrgVdc(payload)
      dialog.value = false
      context.root.$router.replace("/manage-orgvdc");
    }

    return{
      dialog,
      isLoadingBtn,
      setData,
      TotalRowsEdgeGateway,
      checkbox
    }
  },
}
</script>