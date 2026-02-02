<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <br />
            <v-row
              ><v-col cols="9" class="pb-0">
                <div class="firewall-title ml-4">Catalog</div>
              </v-col>
            </v-row>
            <br />

            <v-data-table
              :headers="headers"
              :items="allCatalog"
              item-key="HREF"
              single-line
              class="elevation-0 mt-9"
              hide-default-footer
              :server-items-length="totalCatalog"
              :loading="loadingCatalog"
              :items-per-page="itemsPerPage"
            >
              <template #[`item.Name`]="{ item }">
                <span
                  ><router-link :to="`/catalog-detail/${getId(item.HREF)}`"> {{ item.Name }}</router-link></span
                >
              </template>

              <template #[`item.Status`]="{ item }">
                <span>{{ item.Status == "RESOLVED" ? "Ready" : "Not Ready" }}</span>
              </template>

              <template #[`item.IsShared`]="{ item }">
                <span v-if="item.IsShared == true"><v-icon color="red">mdi-close-circle</v-icon></span>
                <span v-else><v-icon color="green">mdi-check-circle</v-icon></span>
              </template>
              <template #[`item.OwnerName`]="{ item }">
                <span>{{ item.OwnerName || "-" }}</span>
              </template>
              <template #[`item.CreationDate`]="{ item }">
                <span>{{ $FormatDate(item.CreationDate) }}</span>
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
    <dialogDekaPrime></dialogDekaPrime>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import { CATALOG } from "./namespace";
import { useNamespacedActions, useNamespacedGetters, useNamespacedMutations } from "vuex-composition-helpers";
import { DPNETWORK } from "../networking/namespace";
import { VDC } from "../vdc/namespace";
import dialogDekaPrime from "@/modules/dashboard/dialogDekaPrime.vue";
export default {
  components: {
    dialogDekaPrime,
  },
  setup(props, context) {
    const { allCatalog, loadingCatalog, totalCatalog } = useNamespacedGetters(CATALOG, ["allCatalog", "loadingCatalog", "totalCatalog"]);
    const { getAllCatalog, fetchAllCatalog } = useNamespacedActions(CATALOG, ["getAllCatalog", "fetchAllCatalog"]);
    const { setAllCatalog, setTotalCatalog } = useNamespacedMutations(CATALOG, ["setAllCatalog", "setTotalCatalog"]);
    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);
    const { getDialogPermissionDekaPrime } = useNamespacedActions(VDC, ["getDialogPermissionDekaPrime"]);

    onMounted(() => {
      const deka = localStorage.getItem("dekaPrime");
      if (!deka) {
        setAllCatalog([]);
        setTotalCatalog(0);
        getDialogPermissionDekaPrime();
      } else {
        setInterval(() => {
          const deka = localStorage.getItem("dekaPrime");
          if (deka) {
            refresh();
          } else {
            return;
          }
        }, 1000 * 60 * 5);
        getAllCatalog();
        refresh();
      }
    });
    const itemsPerPage = ref(10);
    const headers = ref([
      { text: "Name", value: "Name", sortable: false },
      { text: "Version", value: "Version", sortable: false },
      { text: "Status", value: "Status", sortable: false },
      { text: "Shared", value: "IsShared", sortable: false },
      { text: "Owner", value: "OwnerName", sortable: false },
      { text: "Created On", value: "CreationDate", sortable: false },
      { text: "Media & Other", value: "NumberOfMedia", sortable: false },
    ]);

    const changePage = (val) => {
      itemsPerPage.value = val.itemsPerPage;
      const params = new URLSearchParams();
      params.append("pageSize", itemsPerPage.value);
      params.append("page", val.page);
      fetchAllCatalog(params);
    };

    const getId = (string) => {
      const pattern = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      const hasil = string.match(pattern);
      return hasil[6];
    };
    return {
      headers,
      allCatalog,
      loadingCatalog,
      totalCatalog,
      changePage,
      itemsPerPage,
      getId,
    };
  },
};
</script>

<style lang="scss" scoped></style>
