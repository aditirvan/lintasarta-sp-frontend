<template>
  <div>
    <!-- <v-row>
      <v-col cols="12" class="pa-0">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7"> -->
            <v-row class="d-flex justify-end"
              ><v-col cols="12" class="d-flex">
                <div class="firewall-title">Network</div>
              <!-- </v-col> -->
              <v-spacer></v-spacer>
              <!-- <v-col md="2"> -->
                <router-link to="/networking/create-network">
                  <v-btn
                    depressed
                    color="secondary"
                    width="150"
                    height="45"
                    class="white--text fz-16"
                    v-if="!read_only"
                  >
                    Create Network
                  </v-btn>
                </router-link></v-col
              ></v-row
            >
            <v-row>
              <v-col>
                <v-data-table
                  :headers="headers"
                  :items="listNetwork"
                  item-key="id"
                  single-line
                  class="elevation-0"
                  hide-default-footer
                  :loading="isLoadingNetwork"
                  :items-per-page="itemsPerPage"
                  :server-items-length="totalNetwork"
                >
                  <template #[`item.name`]="{ item }">
                    <router-link
                      :to="`/networking/${item.name}/${getId(item.id)}/networks`"
                    >
                      {{ item.name }}</router-link
                    >
                  </template>
                  <template #[`item.actions`]="{ item }">
                    <span
                    class="red--text"
                    style="cursor: pointer"
                    @click="() => {
                      selectedItem = item
                      openDialogDelete = true
                    }">
                      Delete
                    </span>
                  </template>
                  <template #[`item.status`]="{ item }">
                    <div v-if="item.status == 'REALIZED'">
                      <v-row>
                        <div>
                          <span
                            ><v-icon color="green" small
                              >mdi-check-circle-outline</v-icon
                            ></span
                          >
                        </div>
                        <div><span>&nbsp;Normal</span></div>
                      </v-row>
                    </div>
                    <div v-else-if="item.status == 'CONFIGURING'">
                      <v-row>
                        <div>
                          <span>
                            <v-progress-circular :size="16" color="primary" indeterminate></v-progress-circular>
                          </span>
                        </div>
                        <div><span>&nbsp;Busy</span></div>
                      </v-row>
                    </div>
                    <div v-else>
                      <v-row>
                        <div>
                          <span
                            ><v-icon color="red" small
                              >mdi-close-circle</v-icon
                            ></span
                          >
                        </div>
                        <div><span>&nbsp;Critical</span></div>
                      </v-row>
                    </div>
                  </template>
                  <template #[`item.orgVdc`]="{ item }">
                    <span
                      ><v-icon small>mdi-cloud-outline</v-icon>&nbsp;{{
                        item.orgVdc.name
                      }}</span
                    >
                  </template>
                  <template #[`item.subnets`]="{ item }">
                    <div v-for="(row, index) in item.subnets.values" :key="index">
                      <span>{{ row.gateway }}/{{ row.prefixLength }}</span>
                    </div>
                  </template>
                  <template #[`item.networkType`]="{ item }">
                    <span>{{
                      item.networkType == "ISOLATED" ? "Isolated" : "Routed"
                    }}</span>
                  </template>
                  <template #[`item.connection`]="{ item }">
                    <span v-if="item.connection"
                      ><v-icon small>mdi-pan</v-icon>
                      {{ item.connection.routerRef.name }}</span
                    >
                    <span v-else>-</span>
                  </template>
                  <template #[`item.totalIpCount`]="{ item }">
                    <div v-if="item.totalIpCount == 0">-</div>
                    <div v-else>
                      <v-progress-linear
                        :value="getPersen(item)"
                        height="10"
                      ></v-progress-linear
                      ><span>{{ getPersen(item) }}%</span>
                    </div>
                  </template>
                  <template #[`item.shared`]="{ item }">
                    <div>
                      <span v-if="item.shared == true"
                        ><v-icon color="green" small
                          >mdi-check-circle-outline</v-icon
                        ></span
                      >
                      <span v-else
                        ><v-icon color="red" small>mdi-close-circle</v-icon></span
                      >
                    </div>
                  </template>
                  <template #[`item.routeAdvertised`]="{ item }">
                    <span> {{ item.routeAdvertised == false ? "-" : "-" }}</span>
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
              </v-col>
            </v-row>
          <!-- </v-container>
        </v-card>
      </v-col>
    </v-row> -->
    <dialogDekaPrime></dialogDekaPrime>
    <DialogDelete
    v-if="openDialogDelete"
    v-model="openDialogDelete"
    :itemSelected="selectedItem"
    :header="'Network'"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { VDC } from "../../vdc/namespace";
import DialogCreateNetwork from "../dialog/dialog-create-network.vue";
import { DPNETWORK } from "../namespace";
import dialogDekaPrime from "@/modules/dashboard/dialogDekaPrime.vue";
import DialogDelete from '../../vdc/dialog/dialog-delete.vue'
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    DialogCreateNetwork,
    dialogDekaPrime,
    DialogDelete
  },
  setup(props, context) {
    const { listNetwork, isLoadingNetwork, totalNetwork } =
      useNamespacedGetters(DPNETWORK, [
        "listNetwork",
        "isLoadingNetwork",
        "totalNetwork",
      ]);
    const { getListNetwork, fetchListNetwork } = useNamespacedActions(
      DPNETWORK,
      ["getListNetwork", "fetchListNetwork"]
    );
    const { getDialogPermissionDekaPrime } = useNamespacedActions(
      VDC,
      ["getDialogPermissionDekaPrime"]
    );
    const { setListNetwork, setTotalNetwork } = useNamespacedMutations(
      DPNETWORK,
      ["setListNetwork", "setTotalNetwork"]
    );

    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Network"));
    const openDialogDelete = ref(false);
    const selectedItem = ref();
    const isEnabledVdc = ref(false)

    onMounted(async () => {
      const prime = localStorage.getItem("dekaPrime");
      // let Vdc = JSON.parse(localStorage.getItem('vdcById'))
      // isEnabledVdc.value = Vdc?.isEnabled
      if (!prime) {
        await setListNetwork([]);
        await setTotalNetwork(0);
        await getDialogPermissionDekaPrime();
      } else {
        await getListNetwork();
        // await getListVdc();
      }
    });
    const headers = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Status", value: "status", width: "10%", sortable: false },
      { text: "Scope", value: "orgVdc", width: "15%", sortable: false },
      { text: "Gateway CIDR", value: "subnets", sortable: false },
      { text: "Network Type", value: "networkType", sortable: false },
      { text: "Connected To", value: "connection", sortable: false },
      { text: "IP Pool Consumed", value: "totalIpCount", sortable: false },
      { text: "Shared", value: "shared", sortable: false },
      { text: "Route Advertised", value: "routeAdvertised", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ]);
    const getPersen = (item) => {
      const total = item.totalIpCount;
      const used = item.usedIpCount;
      const hasil = (used / total) * 100;
      const persen = hasil.toFixed();
      return persen;
    };
    const itemsPerPage = ref(10);
    const changePage = (val) => {
      itemsPerPage.value = val.itemsPerPage;
      const params = new URLSearchParams();
      params.append("pageSize", itemsPerPage.value);
      params.append("page", val.page);

      fetchListNetwork(params);
    };

    const getId = (string) => {
      return string.replace("urn:vcloud:network:", "");
    };

    return {
      headers,
      listNetwork,
      isLoadingNetwork,
      totalNetwork,
      getPersen,
      changePage,
      itemsPerPage,
      getId,
      read_only,
      openDialogDelete,
      selectedItem,
      isEnabledVdc
    };
  },
};
</script>

<style lang="scss" scoped></style>
