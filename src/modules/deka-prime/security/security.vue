<template>
  <div>
    <v-row>
      <v-col cols="12" class="pa-0">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7">
            <v-row>
              <v-col cols="9" class="pb-0">
                <div class="firewall-title">Security</div>
              </v-col>
            </v-row>
            <br />
            <v-data-table :headers="headers" :items="listEdge" item-key="HREF" single-line class="elevation-0" :loading="loadingEdge" hide-default-footer>
              <template #[`item.status`]="{ item }">
                <div v-if="item.status == 'REALIZED'">
                  <v-row>
                    <div>
                      <span><v-icon color="green" small>mdi-check-circle-outline</v-icon></span>
                    </div>
                    <div><span>&nbsp;Normal</span></div>
                  </v-row>
                </div>
                <div v-else>
                  <v-row>
                    <div>
                      <span><v-icon color="red" small>mdi-close-circle</v-icon></span>
                    </div>
                    <div><span>&nbsp;Failed</span></div>
                  </v-row>
                </div>
              </template>
              <template #[`item.detail`]="{ item }">
                <span v-if="item.gatewayBacking.gatewayType == 'NSXV_BACKED'"><router-link :to="`/dp-security/${item.name}/${idEdgeNew.vmwareProjectId}/${idVdc(item.id)}/0`"> Detail NSX-V</router-link></span>
                <span v-else><router-link :to="`/dp-security/detail/${item.name}/${idEdgeNew.vmwareProjectId}/${idVdc(item.id)}`"> Detail NSX-T</router-link></span>
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
import { useNamespacedActions, useNamespacedGetters, useNamespacedMutations } from "vuex-composition-helpers";
import { DPNETWORK } from "../networking/namespace";
import { DPSECURITY } from "./namespace";
import dialogDekaPrime from "@/modules/dashboard/dialogDekaPrime.vue";
import { VDC } from "../vdc/namespace";
export default {
  components: {
    dialogDekaPrime,
  },
  setup() {
    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);

    const { getListEdge } = useNamespacedActions(DPSECURITY, ["getListEdge"]);
    const { listEdge, loadingEdge } = useNamespacedGetters(DPSECURITY, ["listEdge", "loadingEdge"]);
    const { setListEdge } = useNamespacedMutations(DPSECURITY, ["setListEdge"]);
    const { getDialogPermissionDekaPrime } = useNamespacedActions(VDC, ["getDialogPermissionDekaPrime"]);

    onMounted(() => {
      const deka = localStorage.getItem("dekaPrime");
      if (!deka) {
        setListEdge([]);
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
        getListEdge();
        refresh();
      }
    });
    const openDialog = ref(false);
    const headers = ref([
      // { text: "", value: "No", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "Status", value: "status", sortable: false, width: "10%" },
      // { text: "Scope", value: "OrgVdcName", sortable: false },
      { text: "Distributed Routing", value: "distributedRoutingEnabled", sortable: false },
      // { text: "Used NICs", value: "used", sortable: false },
      // { text: "External Networks", value: "NumberOfExtNetworks", sortable: false },
      { text: "Org VDC Networks", value: "orgVdcNetworkCount", sortable: false },
      // { text: "HA State", value: "HaStatus", sortable: false },
      { text: "Action", value: "detail", sortable: false },
    ]);
    const idVdc = (string) => {
      // const pattern = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      // const hasil = string.match(pattern);
      // return hasil[6];
      const id = string.replace("urn:vcloud:gateway:", "");
      return id;
    };
    const idEdge = (string) => {
      const pattern = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      const hasil = string.match(pattern);
      return hasil[6];
    };
    const idEdgeNew = ref(JSON.parse(localStorage.getItem("dekaPrime") || "{}"));
    return {
      headers,
      listEdge,
      getListEdge,
      loadingEdge,
      openDialog,
      idVdc,
      idEdge,
      idEdgeNew,
    };
  },
};
</script>

<style lang="scss" scoped></style>
