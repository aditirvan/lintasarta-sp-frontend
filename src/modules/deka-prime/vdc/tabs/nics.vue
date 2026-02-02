<template>
  <div>
    <v-row v-if="isLoadingVdc">
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <div class="d-flex justify-center">
              <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 pt-0" >
            <br />
            <v-row>
              <v-col md="3">
                <v-btn
                block
                color="secondary"
                dark
                @click="dialogEdit"> Edit </v-btn>
                <!-- <span class="primary--text fz-16 ml-4" style="cursor: pointer" @click="dialogEdit">
                  EDIT
                </span> -->
              </v-col>
            </v-row>
            <v-data-table
              :headers="headersNic"
              :items="detailVm.NetworkConnectionSection.NetworkConnection ? detailVm.NetworkConnectionSection.NetworkConnection : []"
              item-key="id"
              single-line
              class="elevation-0 mt-4"
              hide-default-footer
            >
              <template #[`item.pnic`]="{ item }">
                <span v-if="detailVm.NetworkConnectionSection.NetworkConnection.indexOf(item) == detailVm.NetworkConnectionSection.PrimaryNetworkConnectionIndex">{{
                  detailVm.NetworkConnectionSection.PrimaryNetworkConnectionIndex == detailVm.NetworkConnectionSection.PrimaryNetworkConnectionIndex ? "Yes" : ""
                }}</span>
              </template>
              <template #[`item.IsConnected`]="{ item }">
                <div v-if="item.IsConnected == true" class="text-center">
                  <span><v-icon color="green">mdi-check-circle</v-icon></span>
                </div>
                <div v-else class="text-center">
                  <span><v-icon color="red">mdi-close-circle</v-icon></span>
                </div>
              </template>
              <template #[`item.IPAddress`]="{ item }">
                <div class="text-center">
                  <span>{{ item.IPAddress || "-" }}</span>
                </div>
              </template>
              <template #[`item.ExternalIPAddress`]="{ item }">
                <div class="text-center">
                  <span>{{ item.ExternalIPAddress || "-" }}</span>
                </div>
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <DialogEdit
    v-if="openDialogEdit"
    v-model="openDialogEdit"
    :data="dataVm"
    />
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { ref } from "@vue/composition-api";
import { VDC } from "../namespace";
import DialogEdit from '../dialog/dialog-edit-nics.vue'

export default {
  components: {
    DialogEdit
  },
  setup() {
    const { detailVm, isLoadingVdc } = useNamespacedGetters(VDC, ["detailVm", "isLoadingVdc"]);
    const headersNic = ref([
      { text: "Primary NIC", value: "pnic", sortable: false },
      { text: "NIC", value: "NetworkConnectionIndex", sortable: false },
      { text: "Connected", value: "IsConnected", sortable: false },
      { text: "Network Adapter Type", value: "NetworkAdapterType", sortable: false },
      { text: "Network", value: "Network", sortable: false },
      { text: "IP Mode", value: "IPAddressAllocationMode", sortable: false },
      { text: "IP Address", value: "IPAddress", sortable: false },
      { text: "External IP Address", value: "ExternalIPAddress", sortable: false },
      { text: "MAC Address", value: "MACAddress", sortable: false },
    ]);

    const openDialogEdit = ref(false)
    const dataVm = ref()
    const dialogEdit = () => {
      dataVm.value = detailVm.value
      openDialogEdit.value = true
    }

    return {
      detailVm,
      headersNic,
      dialogEdit,
      openDialogEdit,
      dataVm,
      isLoadingVdc,
    };
  },
};
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center !important;
}
</style>
