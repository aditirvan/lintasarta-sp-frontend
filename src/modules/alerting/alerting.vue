<template>
  <div>
    <div class="row">
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-card flat>
            <v-container class="pa-7">
              <v-row>
                <v-col cols="8">                  
                  <div class="alert-list-title">Alerting</div>
                </v-col>
                <v-col cols="4" class="text-right">
                  <v-btn
                    style="height: 55px; width: 150px"
                    to="/alerting/create"
                    v-if="alerts.length && !read_only"
                    class="secondary"
                    depressed
                    >Create</v-btn
                  >
                </v-col>
              </v-row>
              <br />

              <v-card flat outlined class="rounded-lg" v-if="project.region != 'TKP-Banten 1' ">
                <v-row align="center" justify="center">
                  <div class="text-center w-50">
                    <div class="alert-title mt-4">
                      For Your Information.
                    </div>
                    <div class="alert-content mt-4">
                      Sorry, currently the alert feature has not available at TBS-Jakarta 1.
                    </div>
                    <br />
                  </div>
                </v-row>
              </v-card>

              <v-data-table
                v-else-if="alerts.length"
                :headers="headers"
                :items="alerts"
                :items-per-page="10"
                class="elevation-0"
                :server-items-length="pagination.count"
                :options.sync="options"
                hide-default-footer
                hide-default-header
              >
                <template v-slot:header="{ props, on }">
                  <v-data-table-header
                    v-on="on"
                    v-bind="props"
                    sort-icon="mdi-menu-down"
                  >
                  </v-data-table-header>
                </template>
                <template v-slot:no-data>
                  <p class="text-center" v-if="isLoading">Loading..</p>
                  <p class="text-center" v-else>No data available</p>
                </template>
                <template v-slot:item.name="{ item }">
                  <div class="primary--text">{{ item.name }}</div>
                </template>
                <template v-slot:item.metric="{ item }">
                  <span v-if="item.metric == 'cpu'">CPU</span>
                  <span v-else-if="item.metric == 'memory.usage'">RAM</span>
                  <span v-else-if="item.metric == 'network.ingoing.bytes'"
                    >Network (In)</span
                  >
                  <span v-else-if="item.metric == 'network.outgoing.bytes'"
                    >Network (Out)</span
                  >
                  <span v-else>-</span>
                </template>
                <template v-slot:item.comparison_operator="{ item }">
                  {{
                    item.comparison_operator == "gt" ? "Is Above" : "Is Below"
                  }}
                </template>
                <template v-slot:item.threshold="{ item }">
                  <span v-if="['cpu', 'memory.usage'].includes(item.metric)"
                    >{{ item.threshold }}%</span
                  >
                  <span
                    v-else-if="
                      [
                        'network.ingoing.bytes',
                        'network.outgoing.bytes',
                      ].includes(item.metric)
                    "
                    >{{
                      (item.threshold / 1000000).toString().replace(".", ",")
                    }}
                    MB</span
                  >
                  <span v-else>{{ item.threshold }}</span>
                </template>
                <template v-slot:item.minutes="{ item }">
                  {{ item.evaluation_period }}
                </template>
                <template v-slot:item.severity="{ item }">
                  <span style="text-transform:capitalize;">{{
                    item.severity
                  }}</span>
                </template>
                <template v-slot:item.apply="{ item }">
                  <router-link
                    :to="
                      `/project/${item.instance.project.name}/${item.instance.id}/agent`
                    "
                    >{{ item.instance.name }}</router-link
                  >
                </template>
                <template v-slot:item.action="{ item }">
                  <router-link
                    v-if="!read_only"
                    :to="{ path: '/alerting/edit', query: { id: item.id } }"
                  >
                    <span class="primary--text">Edit</span>
                  </router-link>
                  <span
                    style="cursor: pointer"
                    class="pl-3 error--text pr-3"
                    v-if="!read_only"
                    @click="
                      () => {
                        validateprivilages(['Alerting', 'editor']).then(() => {
                          selectedAlert = item;
                          openDeleteModal = true;
                        });
                      }
                    "
                    >Delete</span
                  >
                </template>
                <template #footer="{ props }">
                  <custom-footer-datatable
                    @input="
                      (val) => {
                        options = { ...options, ...val };
                      }
                    "
                    :props="props"
                  />
                </template>
              </v-data-table>
              <v-card flat outlined class="rounded-lg" v-else>
                <v-row align="center" justify="center">
                  <div class="text-center w-50">
                    <div class="alert-title mt-4">
                      Looks like you don't have any alert
                    </div>
                    <div class="alert-content mt-4">
                      Alert policies watch your Instance and alert you if there
                      are any issues.
                    </div>
                  </div>
                </v-row>
                <v-row v-if="!read_only">
                  <v-col cols="3"> </v-col>
                  <v-col cols="6" class="mb-3">
                    <router-link to="/alerting/create">
                      <v-btn
                        block
                        class="secondary"
                        style="height:55px; font-size:14px;"
                        depressed
                        >Create Alert</v-btn
                      >
                    </router-link>
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </v-card>
        </v-card>
      </v-col>
    </div>
    <deleteAlertModal
      v-model="openDeleteModal"
      @confirm="doDelete"
      @close="() => (openDeleteModal = false)"
    />
  </div>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
import { onMounted, ref, watch } from "@vue/composition-api";
import deleteAlertModal from "./deleteAlertModal";
import { useAlert } from "./useAlert";

import { AccessControl } from "@/lib/middleware";

import localstorage from "@/lib/localstorage";

export default {
  components: {
    deleteAlertModal,
  },

  setup(props, { root }) {
    const project = JSON.parse(localstorage.getItem("currentProj"));
    const access_control = new AccessControl(root.$store);
    const read_only = ref(access_control.is_read_mode('Project Alerting'));
    const headers = ref([
      { text: "Name", value: "name" },
      { text: "Metric", value: "metric" },
      { text: "Operator", value: "comparison_operator" },
      { text: "Threshold", value: "threshold" },
      { text: "Minutes", value: "minutes" },
      { text: "Severity", value: "severity" },
      { text: "Applied To", value: "apply" },
      { text: "Action", sortable: false, align: "center", value: "action" },
    ]);

    const { fetchAlerts, alerts, pagination, deleteAlert } = useAlert();
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      rowsPerPage: 10,
      search: "",
      sortBy: [],
      sortDesc: [],
    });
    watch(
      options,
      (val) => {
        fetchAlerts(val);
      },
      { deep: true }
    );

    const selectedAlert = ref(null);
    const openDeleteModal = ref(false);

    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);
    const doDelete = async () => {
      openDeleteModal.value = false;
      const { id } = selectedAlert.value;
      await deleteAlert(id);
    };

    onMounted(async () => {
      if(read_only.value){
        headers.value.pop()
        headers.value.pop()
      }
      fetchAlerts();
    });

    return {
      ...useAlert(),
      read_only,
      
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
      alerts,
      headers,
      options,
      openDeleteModal,
      selectedAlert,
      doDelete,
      project,
    };
  },
};
</script>

<style scoped>
.v-btn {
  height: 55px !important;
}

.alert-list-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.alert-title {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 140%;
  color: #556272;
}

.alert-content {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 140%;
  color: #a5b3bf;
}
</style>
