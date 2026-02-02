<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 pt-0"
            ><v-data-table
              :headers="headers"
              :items="listTask"
              item-key="id"
              single-line
              class="elevation-0 mt-9"
              hide-default-footer
            >
              <!-- <template #[`item.NeedsCustomization`]="{ item }">
                <span>{{ item.NeedsCustomization == true ? "Yes" : "No" }}</span>
              </template> -->
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { ref } from "@vue/composition-api";
import { VDC } from "../namespace";
export default {
  setup() {
    const { detailVm } = useNamespacedGetters(VDC, ["detailVm"]);
    const headers = ref([
      { text: "Task", value: "NeedsCustomization", sortable: false },
      { text: "Status", value: "NetworkConnectionIndex", sortable: false },
      { text: "Initiator", value: "IsConnected", sortable: false },
      { text: "Start Time", value: "NetworkAdapterType", sortable: false },
      { text: "Completion Time", value: "Network", sortable: false },
      { text: "Service Namespace", value: "IPAddressAllocationMode", sortable: false },
    ]);
    const listTask = ref([])
    return {
      detailVm,
      headers,
      listTask
    };
  },
};
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center !important;
}
</style>
