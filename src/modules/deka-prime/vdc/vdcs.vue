<template>
  <div>
    <v-row v-if="isLoadingVdc">
      <v-col cols="12">
        <v-card class="rounded-lg" flat
          ><v-container fluid class="px-7 py-4">
            <div class="d-flex justify-center">
              <v-progress-circular :size="50" color="primary" indeterminate>
              </v-progress-circular>
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-card class="rounded-lg" flat v-if="listVdc">
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title">VDC</div>
              </v-col>
            </v-row>
            <v-card
              flat
              class="d-flex rounded-lg flex-grow-1 flex-column ma-auto"
            >
              <v-row>
                <v-col md="5"
                  ><span class="font-weight-bold cb">Environment</span>
                  <v-row style="font-size: 55%">
                    <v-col md="3" sm="6">
                      <v-icon small>mdi-map-marker-outline</v-icon>&nbsp;<span
                        class="ma-1"
                        >Sites</span
                      >: 1
                    </v-col>
                    <v-col md="4" sm="6">
                      <v-icon small>mdi-sitemap</v-icon>&nbsp;<span class="ma-1"
                        >Organizations</span
                      >
                      : 1
                    </v-col>
                    <v-col md="5" sm="12">
                      <v-icon small>mdi-cloud-outline</v-icon>&nbsp;<span
                        class="ma-1"
                        >Virtual Data Centers</span
                      >: {{ listVdc.length }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col md="4"
                  ><span class="font-weight-bold cb">Used Resources</span>
                  <v-row style="font-size: 55%">
                    <v-col class="pr-0" md="4" sm="6">
                      <v-icon small>mdi-memory</v-icon>&nbsp;<span class="ma-1"
                        >CPU</span
                      >: {{ formatHerzt(getHerzt(listVdc)) }}
                    </v-col>
                    <v-col md="4" sm="6" class="pr-0">
                      <v-icon small>mdi-mini-sd</v-icon>&nbsp;<span class="ma-1"
                        >Memory</span
                      >
                      : {{ formatSize(getMemory(listVdc)) }}
                    </v-col>
                    <v-col md="4" sm="6">
                      <v-icon small>mdi-database</v-icon>&nbsp;<span
                        class="ma-1"
                        >Storage</span
                      >: {{ formatSize(getStorage(listVdc)) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col md="3"
                  ><span class="font-weight-bold cb">Running Applications</span>
                  <v-row style="font-size: 55%">
                    <v-col>
                      <v-icon small>mdi-vector-combine</v-icon>&nbsp;<span
                        class="ma-1"
                        >VMs</span
                      >
                      :
                      {{ getVms(listVdc) }}
                    </v-col>
                    <v-col>
                      <v-icon small>mdi-select-group</v-icon>&nbsp;<span
                        class="ma-1"
                        >vApps</span
                      >
                      : 2
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
            <v-divider></v-divider>
            <v-row>
              <v-col
                v-for="(row, index) in listVdc"
                :key="index"
                md="6"
                sm="12"
                lg="6"
                xs="12"
                xl="4"
              >
                <v-card
                  max-width="500"
                  outlined
                  class="mt-5 bd-hv cursor-pointer"
                  @click="go(row)"
                >
                  <v-list-item three-line>
                    <v-list-item-content>
                      <span style="font-size: 12px">
                        <v-icon small>mdi-cloud-outline</v-icon>&nbsp;{{
                          row.Name
                        }}
                      </span>
                      <v-row style="font-size: 12px">
                        <v-col>
                          <v-icon small>mdi-web</v-icon>&nbsp;<span
                            class="ma-1"
                            >{{ row.OrgName }}</span
                          >
                        </v-col>
                        <v-col>
                          <v-icon small>mdi-map-marker-outline</v-icon
                          >&nbsp;<span class="ma-1">{{
                            getHref(row.HREF)
                          }}</span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col md="3" sm="3">
                          <v-list-item-title
                            class="mb-4"
                            style="font-size: 10px"
                          >
                            Applications
                          </v-list-item-title>
                          <v-list-item-subtitle style="font-size: 10px">
                            {{ row.NumberOfUnmanagedVApps }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle
                            class="mb-4"
                            style="font-size: 10px"
                          >
                            vApps
                          </v-list-item-subtitle>
                          <v-list-item-subtitle style="font-size: 10px"
                            >{{ row.NumberOfRunningVMs }} of
                            {{ row.NumberOfVMs }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle
                            class="mb-2"
                            style="font-size: 10px"
                          >
                            Running VMs
                          </v-list-item-subtitle>
                        </v-col>
                        <v-divider vertical></v-divider>
                        <v-col>
                          <v-row>
                            <v-col cols="4" class="pt-0">
                              <v-list-item-title
                                style="font-size: 10px"
                                class="mb-4 title-text"
                              >
                                CPU
                              </v-list-item-title>
                              <v-list-item-subtitle
                                style="width: 50px; height: 50px"
                                class="mb-4"
                              >
                                <div v-if="row.CpuLimitMhz != 0">
                                  <pie
                                    :if="row.CpuLimitMhz != 0"
                                    :data="{
                                      datasets: [
                                        datasets(
                                          row.CpuUsedMhz,
                                          row.CpuLimitMhz
                                        ),
                                      ],
                                      labels: ['used', 'remaining'],
                                    }"
                                    :options="{
                                      legend: {
                                        display: false,
                                      },
                                      tooltips: {
                                        enabled: false,
                                      },
                                    }"
                                  />
                                </div>
                              </v-list-item-subtitle>
                              <v-list-item-subtitle style="font-size: 8px" v-if="row.CpuLimitMhz != 0">
                                Used {{ formatHerzt(row.CpuUsedMhz) }} of
                                {{ formatHerzt(row.CpuLimitMhz) }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle style="font-size: 8px" v-else>
                                <div>Used {{ formatHerzt(row.CpuUsedMhz) }}</div>
                                <div>Unlimited Allocation</div>
                              </v-list-item-subtitle>
                            </v-col>
                            <v-col cols="4" class="pt-0">
                              <v-list-item-title
                                style="font-size: 10px"
                                class="mb-4 title-text"
                              >
                                Memory
                              </v-list-item-title>
                              <v-list-item-subtitle
                                style="width: 50px; height: 50px"
                                class="mb-4"
                              >
                                <div v-if="row.CpuLimitMhz != 0">
                                  <pie
                                    :data="{
                                      datasets: [
                                        datasets(
                                          row.MemoryUsedMB,
                                          row.MemoryLimitMB
                                        ),
                                      ],
                                      labels: ['used', 'remaining'],
                                    }"
                                    :options="{
                                      legend: {
                                        display: false,
                                      },
                                      tooltips: {
                                        enabled: false,
                                      },
                                    }"
                                  />
                                </div>
                              </v-list-item-subtitle>
                              <v-list-item-subtitle style="font-size: 8px" v-if="row.MemoryLimitMB != 0">
                                Used {{ formatSize(row.MemoryUsedMB) }} of
                                {{ formatSize(row.MemoryLimitMB) }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle style="font-size: 8px" v-else>
                                <div>Used {{ formatSize(row.MemoryUsedMB) }}</div>
                                <div>Unlimited Allocation</div>
                              </v-list-item-subtitle>
                            </v-col>
                            <v-col cols="4" class="pt-0">
                              <v-list-item-title
                                style="font-size: 10px"
                                class="mb-4 title-text"
                              >
                                Storage
                              </v-list-item-title>
                              <v-list-item-subtitle
                                style="width: 50px; height: 50px"
                                class="mb-4"
                              >
                                <pie
                                  :data="{
                                    datasets: [
                                      datasets(
                                        row.StorageUsedMB,
                                        row.StorageLimitMB
                                      ),
                                    ],
                                    labels: ['used', 'remaining'],
                                  }"
                                  :options="{
                                    legend: {
                                      display: false,
                                    },
                                    tooltips: {
                                      enabled: false,
                                    },
                                  }"
                                />
                              </v-list-item-subtitle>
                              <v-list-item-subtitle style="font-size: 8px">
                                Used {{ formatSize(row.StorageUsedMB) }} of
                                {{ formatSize(row.StorageLimitMB) }}
                              </v-list-item-subtitle>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <!-- <v-list-item-subtitle style="font-size: 8px" class="title-text mb-2">pay-as-you-go </v-list-item-subtitle> -->
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import pie from "../pie.vue";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { VDC } from "./namespace";

export default {
  components: {
    pie,
  },
  setup(props, context) {
    const { listVdc, isLoadingVdc } = useNamespacedGetters(VDC, [
      "listVdc",
      "isLoadingVdc",
    ]);
    const { getListVdc } = useNamespacedActions(VDC, ["getListVdc"]);

    onMounted(async () => {
      const params = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      await getListVdc();
    });

    const datasets = (useData, totalData) => {
      return {
        data: [useData, totalData - useData],
        backgroundColor: [
          useData / totalData <= 0.5
            ? "#2C94D2"
            : useData / totalData > 0.5 && useData / totalData < 1
            ? "#FBD834"
            : "#D9544F",
          "#EEEEEE",
        ],
        borderWidth: 0,
      };
    };
    const go = (row) => {
      const pattern =
        /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      const hasil = row.HREF.match(pattern);
      const id = hasil[6];
      localStorage.setItem("vdcName", row.Name);
      context.root.$router.push(`vdc/data-centers/${id}`);
    };

    const getHref = (string) => {
      const pattern =
        /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      const hasil = string.match(pattern);
      return hasil[3];
    };

    const formatSize = (bytes, decimals = 1) => {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const formatHerzt = (string) => {
      const format = string / 1000;
      return format + " GHz";
    };

    const getVms = (arr) => {
      if (arr) {
        const nilai = arr.map((elem) => {
          return elem.NumberOfRunningVMs;
        });
        return nilai.reduce((a, b) => a + b);
      }
    };

    const getHerzt = (arr) => {
      if (arr.length !== 0) {
        const nilai = arr.map((elem) => {
          return elem.CpuUsedMhz;
        });
        return nilai.reduce((a, b) => a + b);
      }
    };

    const getMemory = (arr) => {
      if (arr.length !== 0) {
        const nilai = arr.map((elem) => {
          return elem.MemoryUsedMB;
        });
        return nilai.reduce((a, b) => a + b);
      }
    };

    const getStorage = (arr) => {
      if (arr.length !== 0) {
        const nilai = arr.map((elem) => {
          return elem.StorageUsedMB;
        });
        return nilai.reduce((a, b) => a + b);
      }
    };

    return {
      listVdc,
      getListVdc,
      datasets,
      go,
      getHref,
      formatSize,
      formatHerzt,
      getVms,
      getHerzt,
      getMemory,
      getStorage,
      isLoadingVdc,
    };
  },
};
</script>

<style lang="scss" scoped>
.cb {
  color: #556272;
  font-size: 12px;
}

.bd-hv:hover {
  border: solid 1px;
  color: #1f60a8;
}

.title-text {
  text-align: center;
  margin-right: 28px;
}
</style>
