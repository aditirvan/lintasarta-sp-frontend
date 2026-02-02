<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 pt-0">
            <br />
            <div class="bor-table mb-5">
              <v-row class="ma-0">
                <v-col>VM Storage Policy</v-col>
                <v-col>{{detailVm.StorageProfile.Name}}</v-col>
              </v-row>
            </div>
            <v-data-table
              :headers="headers"
              :items="detailVm.VmSpecSection.DiskSection.DiskSettings"
              item-key="id"
              single-line
              class="elevation-0 mt-9"
              hide-default-footer
            >
              <template #[`item.Iops`]="{ item }">
                <div>
                  <span>{{ item.Iops }}</span>
                </div>
              </template>
              <template #[`item.BusNumber`]="{ item }">
                <div>
                  <span>{{ item.BusNumber }}</span>
                </div>
              </template>
              <template #[`item.UnitNumber`]="{ item }">
                <div>
                  <span>{{ item.UnitNumber }}</span>
                </div>
              </template>
              <template #[`item.SizeMb`]="{ item }">
                <div>
                  <span>{{ formatSize(item.SizeMb) }}</span>
                </div>
              </template>
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
      { text: "Index", value: "no", sortable: false },
      { text: "Name", value: "Name", sortable: false },
      { text: "Shared", value: "Shared", sortable: false },
      { text: "Size", value: "SizeMb", sortable: false },
      { text: "Policy", value: "Policy", sortable: false },
      { text: "IOPS", value: "Iops", sortable: false },
      { text: "Bus Type", value: "BusType", sortable: false },
      { text: "Bus Number", value: "BusNumber", sortable: false },
      { text: "Unit Number", value: "UnitNumber", sortable: false },
    ]);
    const formatSize = (bytes, decimals = 1) => {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };
    return {
      detailVm,
      headers,
      formatSize,
    };
  },
};
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center !important;
}
.bor-table {
  border: 1px solid rgb(2 0 0 / 12%);
}
</style>
