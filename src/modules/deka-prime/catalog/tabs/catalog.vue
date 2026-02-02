<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-0">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pt-0">
            <br />
            <!-- <v-row
              ><v-col cols="9" class="pb-0">
                <div class="firewall-title ml-4">List Catalog</div>
              </v-col>
            </v-row>
            <br /> -->

            <v-data-table
              :headers="headers"
              :items="listTemplatesVm"
              item-key="HREF"
              single-line
              class="elevation-0 mt-9"
              hide-default-footer
              :server-items-length="totalTemplatesVm"
              :loading="isLoadingTable"
              :items-per-page="itemsPerPage"
            >
              <!-- <template #[`item.no`]="{ item }">
                  <v-radio-group v-model="radio1">
                    <v-radio :value="item.HREF" @click="getRow(item)" :key="listTemplatesVm.indexOf(item)"></v-radio>
                  </v-radio-group>
                </template> -->
              <template #[`item.ContainerName`]="{ item }">
                <span>{{ getName(item.ContainerName) }}</span>
              </template>
              <template #[`item.Cpus`]="{ item }">
                <v-row>
                  <v-col>CPU</v-col>
                  <v-col>{{ item.Cpus }}</v-col>
                </v-row>
                <v-row>
                  <v-col>Memory</v-col>
                  <v-col>{{ formatSize(item.MemoryMB) }}</v-col>
                </v-row>
              </template>
              <template v-slot:footer="{ props }">
                <custom-footer-datatable
                  @input="
                    (val) => {
                      options = val;
                      changePage(val);
                    }
                  "
                  :props="props"
                />
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import { CATALOG } from "../namespace";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { VDC } from "../../vdc/namespace";
export default {
  setup(props, context) {
    // const openDialog = ref(false);

    const { listCatalog, loadingCatalog } = useNamespacedGetters(CATALOG, ["listCatalog", "loadingCatalog"]);
    const { listTemplatesVm, totalTemplatesVm, isLoadingTable } = useNamespacedGetters(VDC, ["listTemplatesVm", "totalTemplatesVm", "isLoadingTable"]);
    const { fetchListTemplateVm } = useNamespacedActions(VDC, ["fetchListTemplateVm"]);
    const itemsPerPage = ref(10);
    const headers = ref([
      // { text: "Name", value: "Name", sortable: false },
      // { text: "Status", value: "Status", sortable: false },
      // { text: "Owner", value: "console", sortable: false },
      // { text: "VDC", value: "runtime", sortable: false },
      // { text: "Created On", value: "DateCreated", sortable: false },
      // { text: "Storage Used", value: "storageL", sortable: false },
      { text: "Name", value: "Name", sortable: false },
      { text: "vApp Name", value: "ContainerName", sortable: false },
      { text: "Catalog", value: "CatalogName", sortable: false },
      { text: "OS", value: "GuestOS", sortable: false },
      { text: "Compute", value: "Cpus", width: "20%", sortable: false },
      // { text: "Storage", value: "VmPlacementPolicyId", sortable: false },
    ]);

    const changePage = (val) => {
      itemsPerPage.value = val.itemsPerPage;
      const params = new URLSearchParams();
      params.append("pageSize", itemsPerPage.value);
      params.append("page", val.page);
      fetchListTemplateVm(params);
    };

    // const getId = (string) => {
    //   const pattern = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
    //   const hasil = string.match(pattern);
    //   return hasil[6];
    // };

    const formatSize = (bytes, decimals = 1) => {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const getName = (item) => {
      return item.replace("[Harden] ", "");
    };
    return {
      headers,
      listCatalog,
      loadingCatalog,
      getName,
      listTemplatesVm,
      totalTemplatesVm,
      isLoadingTable,
      changePage,
      itemsPerPage,
      formatSize,
    };
  },
};
</script>

<style lang="scss" scoped></style>
