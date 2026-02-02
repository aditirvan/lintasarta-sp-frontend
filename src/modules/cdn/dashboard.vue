<template>
  <div>
    <v-card>
      <v-card-title class="font-weight-bold fz-21 headline font--text"> 
        Dashboard
        <span v-if="last_fetch && current_time" class="last-fetch"> last fetch : {{ timeAgo(last_fetch) }}</span>
        <v-spacer />
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col md="3" sm="12">
            <v-hover v-slot="{ hover }" close-delay="300">
              <v-card color="primary" class="py-2">
                <v-expand-transition>
                  <v-menu offset-y>
                    <template #activator="{ on, attrs }">
                      <v-btn v-show="hover" absolute color="primary" right v-bind="attrs" v-on="on">
                        <span>Select time period</span><v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item v-for="(item, index) in time_filter" :key="index" @click="selectTimeFilterReq(item)">
                        <v-list-item-title v-if="item.reset" style="cursor: pointer"> None </v-list-item-title>
                        <v-list-item-title v-else>
                          Last {{ item.duration }} {{ item.unit }} ( {{ item.interval_duration }} {{ item.interval_unit }} interval )
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-expand-transition>
                <v-card-text class="font-weight-bold fz-20 white--text">
                  <span style="font-size: 25px">{{ formatSizeVarnish(statsDataReq.request_total || 0) }}</span>
                </v-card-text>
                <v-card-text class="white--text pb-0">
                  Request <br />
                  <span class="font-weight-bold">Server : </span>All
                </v-card-text>
                <v-card-text class="py-0">
                  <v-row>
                    <v-col v-if="dataSelectRequest" class="white--text">
                      Last {{ dataSelectRequest.duration }} {{ dataSelectRequest.unit }} ( {{ dataSelectRequest.interval_duration }}
                      {{ dataSelectRequest.interval_unit }} interval )</v-col
                    >
                    <v-col class="d-flex justify-end">
                      <v-btn class="cursor-default" fab dark color="secondary">
                        <v-icon> mdi-dns-outline </v-icon>
                      </v-btn></v-col
                    >
                  </v-row>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>

          <v-col md="3" sm="12">
            <v-hover v-slot="{ hover }" close-delay="300">
              <v-card color="primary" class="py-2">
                <v-expand-transition>
                  <v-menu offset-y>
                    <template #activator="{ on, attrs }">
                      <v-btn v-show="hover" absolute color="primary" right v-bind="attrs" v-on="on">
                        <span>Select time period</span><v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item v-for="(item, index) in time_filter" :key="index" @click="selectTimeFilterMiss(item)">
                        <v-list-item-title v-if="item.reset" style="cursor: pointer"> None </v-list-item-title>
                        <v-list-item-title v-else>
                          Last {{ item.duration }} {{ item.unit }} ( {{ item.interval_duration }} {{ item.interval_unit }} interval )
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-expand-transition>
                <v-card-text class="font-weight-bold fz-20 white--text">
                  <span style="font-size: 25px">{{ formatSizeVarnish(statsDataMiss.miss_total || 0) }}</span>
                </v-card-text>
                <v-card-text class="white--text pb-0">
                  Miss <br />
                  <span class="font-weight-bold">Server : </span>All
                </v-card-text>
                <v-card-text class="py-0">
                  <v-row>
                    <v-col v-if="dataSelectMiss" class="white--text">
                      Last {{ dataSelectMiss.duration }} {{ dataSelectMiss.unit }} ( {{ dataSelectMiss.interval_duration }}
                      {{ dataSelectMiss.interval_unit }} interval )</v-col
                    >
                    <v-col class="d-flex justify-end">
                      <v-btn class="cursor-default" fab dark color="cyan">
                        <v-icon> mdi-dns-outline </v-icon>
                      </v-btn></v-col
                    >
                  </v-row>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>

          <v-col md="3" sm="12">
            <v-hover v-slot="{ hover }" close-delay="300">
              <v-card color="primary" class="py-2">
                <v-expand-transition>
                  <v-menu offset-y>
                    <template #activator="{ on, attrs }">
                      <v-btn v-show="hover" absolute color="primary" right v-bind="attrs" v-on="on">
                        <span>Select time period</span><v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item v-for="(item, index) in time_filter" :key="index" @click="selectTimeFilterHits(item)">
                        <v-list-item-title v-if="item.reset" style="cursor: pointer"> None </v-list-item-title>
                        <v-list-item-title v-else>
                          Last {{ item.duration }} {{ item.unit }} ( {{ item.interval_duration }} {{ item.interval_unit }} interval )
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-expand-transition>
                <v-card-text class="font-weight-bold fz-20 white--text">
                  <span style="font-size: 25px">{{ formatSizeVarnish(statsDataHits.hit_total || 0) }}</span>
                </v-card-text>
                <v-card-text class="white--text pb-0">
                  Hits <br />
                  <span class="font-weight-bold">Server : </span>All
                </v-card-text>
                <v-card-text class="py-0">
                  <v-row>
                    <v-col v-if="dataSelectHits" class="white--text">
                      Last {{ dataSelectHits.duration }} {{ dataSelectHits.unit }} ( {{ dataSelectHits.interval_duration }}
                      {{ dataSelectHits.interval_unit }} interval )</v-col
                    >
                    <v-col class="d-flex justify-end">
                      <v-btn class="cursor-default" fab dark color="orange">
                        <v-icon> mdi-dns-outline </v-icon>
                      </v-btn></v-col
                    >
                  </v-row>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>

          <v-col md="3" sm="12">
            <v-hover v-slot="{ hover }" close-delay="300">
              <v-card color="primary" class="py-2">
                <v-expand-transition>
                  <v-menu offset-y>
                    <template #activator="{ on, attrs }">
                      <v-btn v-show="hover" absolute color="primary" right v-bind="attrs" v-on="on">
                        <span>Select time period</span><v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item v-for="(item, index) in time_filter" :key="index" @click="selectTimeFilterSections(item)">
                        <v-list-item-title v-if="item.reset" style="cursor: pointer"> None </v-list-item-title>
                        <v-list-item-title v-else>
                          Last {{ item.duration }} {{ item.unit }} ( {{ item.interval_duration }} {{ item.interval_unit }} interval )
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-expand-transition>
                <v-card-text class="font-weight-bold fz-20 white--text">
                  <span style="font-size: 25px">{{ formatSizeVarnish(statsDataSections.session_connection || 0) }}</span>
                </v-card-text>
                <v-card-text class="white--text pb-0">
                  Sections Connection <br />
                  <span class="font-weight-bold">Server : </span>All
                </v-card-text>
                <v-card-text class="py-0">
                  <v-row>
                    <v-col v-if="dataSelectSections" class="white--text">
                      Last {{ dataSelectSections.duration }} {{ dataSelectSections.unit }} ( {{ dataSelectSections.interval_duration }}
                      {{ dataSelectSections.interval_unit }} interval )</v-col
                    >
                    <v-col class="d-flex justify-end">
                      <v-btn class="cursor-default" fab dark color="red">
                        <v-icon> mdi-dns-outline </v-icon>
                      </v-btn></v-col
                    >
                  </v-row>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- chart -->
      <v-card-text class="pt-0">
        <div>
          <v-row>
            <v-col md="4">
              <v-hover v-slot="{ hover }" close-delay="300">
                <v-card class="px-4 py-2" outlined>
                  <v-expand-transition>
                    <v-menu offset-y>
                      <template #activator="{ on, attrs }">
                        <v-btn v-show="hover" absolute color="primary" right v-bind="attrs" v-on="on">
                          <span>Select time period</span><v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                      </template>

                      <v-list>
                        <v-list-item v-for="(item, index) in time_filter" :key="index" @click="selectTimeFilterHitRate(item)">
                          <v-list-item-title v-if="item.reset" style="cursor: pointer"> None </v-list-item-title>
                          <v-list-item-title v-else>
                            Last {{ item.duration }} {{ item.unit }} ( {{ item.interval_duration }} {{ item.interval_unit }} interval )
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-expand-transition>
                  <v-card-text class="d-flex flex-column">
                    <div class="d-flex flex-column">
                      <span class="fz-21 mb-2">Hit Rate</span>
                      <span> <span class="font-weight-bold mb-2"> Server : </span> All </span>
                      <span v-if="dataSelectHitRate" class="mt-2">
                        Last {{ dataSelectHitRate.duration }} {{ dataSelectHitRate.unit }} ( {{ dataSelectHitRate.interval_duration }}
                        {{ dataSelectHitRate.interval_unit }} interval )</span
                      >
                    </div>

                    <div v-if="!loading" class="circular-progress-wrapper align-self-center">
                      <v-progress-circular :rotate="90" :size="400" :width="25" :value="totalPercentage" :color="colorPersentage">
                        <span class="fz-20 black--text">{{ totalPercentage }}%</span>
                      </v-progress-circular>
                    </div>
                    <div class="d-flex justify-center" v-else>
                      <v-progress-circular :size="150" color="primary" indeterminate></v-progress-circular>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>

            <v-col md="8">
              <v-hover v-slot="{ hover }" close-delay="300">
                <v-card class="px-4 py-2" outlined>
                  <v-expand-transition>
                    <v-menu offset-y>
                      <template #activator="{ on, attrs }">
                        <v-btn v-show="hover" absolute color="primary" right v-bind="attrs" v-on="on">
                          <span>Select time period</span><v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                      </template>

                      <v-list>
                        <v-list-item v-for="(item, index) in time_filter" :key="index" @click="selectTimeFilterHitsMiss(item)">
                          <v-list-item-title v-if="item.reset" style="cursor: pointer"> None </v-list-item-title>
                          <v-list-item-title v-else>
                            Last {{ item.duration }} {{ item.unit }} ( {{ item.interval_duration }} {{ item.interval_unit }} interval )
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-expand-transition>
                  <v-card-text>
                    <div class="d-flex flex-column">
                      <span class="fz-21 mb-2">Hit and Miss</span>
                      <span> <span class="font-weight-bold mb-2"> Server : </span> All </span>
                      <span v-if="dataSelectHitsMiss" class="mt-2">
                        Last {{ dataSelectHitsMiss.duration }} {{ dataSelectHitsMiss.unit }} ( {{ dataSelectHitsMiss.interval_duration }}
                        {{ dataSelectHitsMiss.interval_unit }} interval )</span
                      >
                    </div>
                    <div class="chart-line mt-4" v-if="!loading">
                      <chart-line-dash :data="dataChartReal" :options="chartOptions" />
                    </div>
                    <div class="d-flex justify-center" v-else>
                      <v-progress-circular :size="150" color="primary" indeterminate></v-progress-circular>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import chartLineDash from "./chartLineDash.vue";
import { computed, onMounted, onUnmounted, ref, watch } from "@vue/composition-api";
import { AccessControl } from "@/lib/middleware";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { useWebSocket } from "./cdnWs.js";
import { formatSizeVarnish } from "@/lib/formatSize.js";
import { timeAgo } from "@/lib/time.js";

export default {
  components: {
    chartLineDash,
  },
  data() {
    return {
      interval: null,
      current_time: null
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  created() {
    this.interval = setInterval(() => {
      this.current_time = new Date().toISOString();
    }, 1000)
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("CDN"));
    const last_fetch = ref(null);
    const router = context.root.$router;
    let timer = null;
    const time_filter = [
      {
        reset: true,
      },
      {
        duration: "15",
        unit: "mins",
        interval_duration: 1,
        interval_unit: "min",
        from: "15:00",
      },
      {
        duration: "30",
        unit: "mins",
        interval_duration: 1,
        interval_unit: "min",
        from: "30:00",
      },
      {
        duration: "1",
        unit: "hours",
        interval_duration: 1,
        interval_unit: "min",
        from: "01:00:00",
      },
      {
        duration: "3",
        unit: "hours",
        interval_duration: 10,
        interval_unit: "min",
        from: "03:00:00",
      },
      {
        duration: "6",
        unit: "hours",
        interval_duration: 10,
        interval_unit: "min",
        from: "06:00:00",
      },
      {
        duration: "12",
        unit: "hours",
        interval_duration: 10,
        interval_unit: "min",
        from: "12:00:00",
      },
      {
        duration: "24",
        unit: "hours",
        interval_duration: 10,
        interval_unit: "min",
        from: "1d",
      },
      {
        duration: "2",
        unit: "days",
        interval_duration: 1,
        interval_unit: "hour",
        from: "2d",
      },
      {
        duration: "7",
        unit: "days",
        interval_duration: 1,
        interval_unit: "hour",
        from: "7d",
      },
      {
        duration: "1",
        unit: "month",
        interval_duration: 1,
        interval_unit: "day",
        from: "1mo",
      },
      {
        duration: "3",
        unit: "month",
        interval_duration: 1,
        interval_unit: "day",
        from: "3mo",
      },
      {
        duration: "6",
        unit: "month",
        interval_duration: 1,
        interval_unit: "day",
        from: "6mo",
      },
      {
        duration: "9",
        unit: "month",
        interval_duration: 1,
        interval_unit: "day",
        from: "9mo",
      },
      {
        duration: "1",
        unit: "year",
        interval_duration: 1,
        interval_unit: "day",
        from: "1y",
      },
      {
        duration: "2",
        unit: "year",
        interval_duration: 1,
        interval_unit: "month",
        from: "2y",
      },
      {
        duration: "5",
        unit: "year",
        interval_duration: 1,
        interval_unit: "month",
        from: "5y",
      },
      {
        duration: "10",
        unit: "year",
        interval_duration: 1,
        interval_unit: "month",
        from: "10y",
      },
    ];
    const {
      statsDataReq,
      statsDataMiss,
      statsLine,
      isLoadingStatsLine,
      loadingRequest,
      loadingMiss,
      loadingHits,
      statsDataHits,
      loadingSections,
      isLoadingHitRate,
      statsDataSections,
      statsDataHitRate,
    } = useNamespacedGetters("CDN", [
      "statsDataReq",
      "statsDataMiss",
      "statsLine",
      "isLoadingStatsLine",
      "loadingRequest",
      "loadingMiss",
      "loadingHits",
      "isLoadingHitRate",
      "statsDataHits",
      "loadingSections",
      "statsDataSections",
      "statsDataHitRate",
    ]);
    const { getStatsDataReq, getStatsDataMiss, getStatsLine, getStatsDataHits, getStatsDataSections, getStatsDataHitRate } = useNamespacedActions("CDN", [
      "getStatsDataReq",
      "getStatsDataMiss",
      "getStatsLine",
      "getStatsDataHits",
      "getStatsDataSections",
      "getStatsDataHitRate",
    ]);

    onUnmounted(() => {
      clearTimeout(timeoutFuncRequest.value);
      clearTimeout(timeoutFuncMiss.value);
      clearTimeout(timeoutFuncHits.value);
      clearTimeout(timeoutFuncSections.value);
      clearTimeout(timeoutFuncHitsMiss.value);
      clearTimeout(timeoutFuncHitRate.value);
    });

    onMounted(async () => {
      clearTimeout(timeoutFuncRequest.value);
      clearTimeout(timeoutFuncMiss.value);
      clearTimeout(timeoutFuncHits.value);
      clearTimeout(timeoutFuncSections.value);
      clearTimeout(timeoutFuncHitsMiss.value);
      clearTimeout(timeoutFuncHitRate.value);
      await fetchData();
    });

    const { data, isConnected } = useWebSocket(router.currentRoute.params.id);

    const totalPercentage = computed(() => {
      return statsDataHitRate.value?.hit_percentage || 0;
      // return 81;
    });

    const colorPersentage = computed(() => {
      if (totalPercentage.value <= 80) {
        return "primary";
      } else if (totalPercentage.value > 80 && totalPercentage.value < 90) {
        return "warning";
      } else {
        return "error";
      }
    });
    const loading = ref(true);
    const timReqInterval = ref(30000);      // 30 seconds
    const timMissInterval = ref(30000);     // 30 seconds
    const timHitsInterval = ref(30000);     // 30 seconds
    const timSectionsInterval = ref(30000); // 30 seconds
    const timHitsMissInterval = ref(60000); // 1 minute
    const timHitRateInterval = ref(60000);  // 1 minute
    const timeoutFuncRequest = ref();
    const timeoutFuncHits = ref();
    const timeoutFuncMiss = ref();
    const timeoutFuncSections = ref();
    const timeoutFuncHitsMiss = ref();
    const timeoutFuncHitRate = ref();
    const dataSelectRequest = ref();
    const dataSelectMiss = ref();
    const dataSelectHits = ref();
    const dataSelectSections = ref();
    const dataSelectHitsMiss = ref();
    const dataSelectHitRate = ref();
    const dataFromRequest = ref();
    const dataFromMiss = ref();
    const dataFromHits = ref();
    const dataFromSections = ref();
    const dataFromHitsMiss = ref();
    const dataFromHitRate = ref();
    const dataChartReal = ref({ labels: [], datasets: [] });
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 5,
          usePointStyle: true,
          fontSize: 12,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              padding: 10,
            },
            gridLines: {
              color: "#e5e7eb",
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              padding: 0,
            },
            gridLines: {
              color: "#f3f4f6",
            },
            scaleLabel: {
              display: true,
              fontColor: "#6b7280",
              fontSize: 14,
              fontStyle: "bold",
            },
          },
        ],
      },
    });
    const dataChartDefault = ref({
      labels: [],
      datasets: [
        {
          label: "Hit",
          borderColor: "#0ea5e9",
          backgroundColor: "transparent",
          tension: 0.4,
          data: [0],
        },
        {
          label: "Miss",
          borderColor: "#5eead4",
          backgroundColor: "transparent",
          tension: 0.4,
          // data: [1, 2, 3, 3.2, 3.1, 2.8, 2.4, 1.5],
          data: [0],
        },
      ],
    });

    const dataChart = ref({
      labels: ["Aug, 2024", "Sep, 2024", "Oct, 2024", "Nov, 2024", "Dec, 2024", "Jan, 2025", "Feb, 2025", "Mar, 2025"],
      datasets: [
        {
          label: "Hit",
          borderColor: "#0ea5e9",
          backgroundColor: "transparent",
          tension: 0.4,
          data: [0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: "Miss",
          borderColor: "#5eead4",
          backgroundColor: "transparent",
          tension: 0.4,
          // data: [1, 2, 3, 3.2, 3.1, 2.8, 2.4, 1.5],
          data: [0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    });

    const value = ref(50); // Progress value
    const filters = ref({});
    // filter Request
    const selectTimeFilterReq = async (item) => {
      if (timeoutFuncRequest.value) {
        clearTimeout(timeoutFuncRequest.value);
        timeoutFuncRequest.value = null;
      }

      dataSelectRequest.value = item;
      dataFromRequest.value = item.from;

      const params = new URLSearchParams();
      params.append("names", "client_req_count");
      if (item.from) {
        params.append("from", dataFromRequest.value);
      } else {
        params.delete("from");
      }
      await getStatsDataReq({ id: router.currentRoute.params.id, param: params });

      if (item.interval_unit == "min") {
        timReqInterval.value = item.interval_duration * 60 * 1000;
      } else if (item.interval_unit == "hour") {
        timReqInterval.value = item.interval_duration * 60 * 60 * 1000;
      } else if (item.interval_unit == "day") {
        timReqInterval.value = 86400000;
      } else if (item.interval_unit == "month") {
        timReqInterval.value = 2678400000;
      } else {
        dataSelectRequest.value = null;
        timReqInterval.value = 0; // Set to 0 to disable auto-refresh
      }
    };

    const autoRefreshRequest = async () => {
      const params = new URLSearchParams();
      params.append("names", "client_req_count");
      if (dataFromRequest.value) {
        params.append("from", dataFromRequest.value);
      }
      await getStatsDataReq({ id: router.currentRoute.params.id, param: params });
    };
    // filter Miss
    const selectTimeFilterMiss = async (item) => {
      if (timeoutFuncMiss.value) {
        clearTimeout(timeoutFuncMiss.value);
        timeoutFuncMiss.value = null;
      }

      dataSelectMiss.value = item;
      dataFromMiss.value = item.from;

      const params = new URLSearchParams();
      params.append("names", "client_miss_count");
      if (item.from) {
        params.append("from", dataFromMiss.value);
      } else {
        params.delete("from");
      }
      await getStatsDataMiss({ id: router.currentRoute.params.id, param: params });

      if (item.interval_unit == "min") {
        timMissInterval.value = item.interval_duration * 60 * 1000;
      } else if (item.interval_unit == "hour") {
        timMissInterval.value = item.interval_duration * 60 * 60 * 1000;
      } else if (item.interval_unit == "day") {
        timMissInterval.value = 86400000;
      } else if (item.interval_unit == "month") {
        timMissInterval.value = 2678400000;
      } else {
        dataSelectMiss.value = null;
        timMissInterval.value = 0; // Set to 0 to disable auto-refresh
      }
    };

    const autoRefreshMiss = async () => {
      const params = new URLSearchParams();
      params.append("names", "client_miss_count");
      if (dataFromMiss.value) {
        params.append("from", dataFromMiss.value);
      }
      await getStatsDataMiss({ id: router.currentRoute.params.id, param: params });
    };
    // filter Hits
    const selectTimeFilterHits = async (item) => {
      if (timeoutFuncHits.value) {
        clearTimeout(timeoutFuncHits.value);
        timeoutFuncHits.value = null;
      }

      dataSelectHits.value = item;
      dataFromHits.value = item.from;

      const params = new URLSearchParams();
      params.append("names", "client_hit_count");
      if (item.from) {
        params.append("from", dataFromHits.value);
      } else {
        params.delete("from");
      }
      await getStatsDataHits({ id: router.currentRoute.params.id, param: params });

      if (item.interval_unit == "min") {
        timHitsInterval.value = item.interval_duration * 60 * 1000;
      } else if (item.interval_unit == "hour") {
        timHitsInterval.value = item.interval_duration * 60 * 60 * 1000;
      } else if (item.interval_unit == "day") {
        timHitsInterval.value = 86400000;
      } else if (item.interval_unit == "month") {
        timHitsInterval.value = 2678400000;
      } else {
        dataSelectHits.value = null;
        timHitsInterval.value = 0; // Set to 0 to disable auto-refresh
      }
    };

    const autoRefreshHits = async () => {
      const params = new URLSearchParams();
      params.append("names", "client_hit_count");
      if (dataFromHits.value) {
        params.append("from", dataFromHits.value);
      }
      await getStatsDataHits({ id: router.currentRoute.params.id, param: params });
    };
    // filter Sections
    const selectTimeFilterSections = async (item) => {
      dataSelectSections.value = item;
      dataFromSections.value = item.from;

      const params = new URLSearchParams();
      params.append("names", "default.conn");
      if (item.from) {
        params.append("from", dataFromSections.value);
      } else {
        params.delete("from");
      }
      await getStatsDataSections({ id: router.currentRoute.params.id, param: params });

      if (item.interval_unit == "min") {
        timSectionsInterval.value = item.interval_duration * 60 * 1000;
      } else if (item.interval_unit == "hour") {
        timSectionsInterval.value = item.interval_duration * 60 * 60 * 1000;
      } else if (item.interval_unit == "day") {
        timSectionsInterval.value = 86400000;
      } else if (item.interval_unit == "month") {
        timSectionsInterval.value = 2678400000;
      } else {
        dataSelectSections.value = null;
        timSectionsInterval.value = 2678400000;
      }
    };

    const autoRefreshSections = async () => {
      const params = new URLSearchParams();
      params.append("names", "default.conn");
      if (dataFromSections.value) {
        params.append("from", dataFromSections.value);
      }
      await getStatsDataSections({ id: router.currentRoute.params.id, param: params });
    };
    // filter Hits and Miss
    const selectTimeFilterHitsMiss = async (item) => {
      dataSelectHitsMiss.value = item;
      dataFromHitsMiss.value = item.from;

      const params = new URLSearchParams();
      if (item.from) {
        params.append("from", dataFromHitsMiss.value);
      } else {
        params.delete("from");
      }
      let response = await getStatsLine({ id: router.currentRoute.params.id, param: params });
      if (response?.status == 200) {
        await getChartHitMiss(response.data?.data?.time_line_data);
      } else {
        dataChartReal.value = dataChartDefault.value;
      }

      if (item.interval_unit == "min") {
        timHitsMissInterval.value = item.interval_duration * 60 * 1000;
      } else if (item.interval_unit == "hour") {
        timHitsMissInterval.value = item.interval_duration * 60 * 60 * 1000;
      } else if (item.interval_unit == "day") {
        timHitsMissInterval.value = 86400000;
      } else if (item.interval_unit == "month") {
        timHitsMissInterval.value = 2678400000;
      } else {
        dataSelectHitsMiss.value = null;
        timHitsMissInterval.value = 2678400000;
      }
    };
    // filter Hit Rate
    const selectTimeFilterHitRate = async (item) => {
      dataSelectHitRate.value = item;
      dataFromHitRate.value = item.from;
      const params = new URLSearchParams();
      if (item.from) {
        params.append("from", dataFromHitRate.value);
      } else {
        params.delete("from");
      }
      await getStatsDataHitRate({ id: router.currentRoute.params.id, param: params });

      if (item.interval_unit == "min") {
        timHitRateInterval.value = item.interval_duration * 60 * 1000;
      } else if (item.interval_unit == "hour") {
        timHitRateInterval.value = item.interval_duration * 60 * 60 * 1000;
      } else if (item.interval_unit == "day") {
        timHitRateInterval.value = 86400000;
      } else if (item.interval_unit == "month") {
        timHitRateInterval.value = 2678400000;
      } else {
        dataSelectHitRate.value = null;
        timHitRateInterval.value = 2678400000;
      }
    };

    const autoRefreshHitsMiss = async () => {
      const params = new URLSearchParams();
      if (dataFromHitsMiss.value) {
        params.append("from", dataFromHitsMiss.value);
      }
      let response = await getStatsLine({ id: router.currentRoute.params.id, param: params });

      if (response?.status == 200) {
        await getChartHitMiss(response.data?.data?.time_line_data);
      } else {
        dataChartReal.value = dataChartDefault.value;
      }
    };

    const autoRefreshHitRate = async () => {
      const params = new URLSearchParams();
      if (dataFromHitRate.value) {
        params.append("from", dataFromHitRate.value);
      }
      await getStatsDataHitRate({ id: router.currentRoute.params.id, param: params });
    };

    const getChartHitMiss = async (data) => {
      if (!data || !Array.isArray(data) || data.length === 0) {
        dataChartReal.value = dataChartDefault.value;
        return;
      }

      dataChartReal.value = {
        labels: data.map((item) => item?.time || ''),
        datasets: [
          {
            data: data.map((item) => item?.hit_total || 0),
            label: "Hit",
            borderColor: "#0ea5e9",
            backgroundColor: "transparent",
            minBarLength: 5,
          },
          {
            data: data.map((item) => item?.miss_total || 0),
            label: "Miss",
            borderColor: "#5eead4",
            backgroundColor: "transparent",
            minBarLength: 5,
          },
        ],
      };
    };

    const fetchData = async () => {

      const paramsRequest = new URLSearchParams();
      paramsRequest.append("names", "client_req_count");

      const paramsMiss = new URLSearchParams();
      paramsMiss.append("names", "client_miss_count");

      const paramsHits = new URLSearchParams();
      paramsHits.append("names", "client_hit_count");

      const paramsSections = new URLSearchParams();
      paramsSections.append("names", "default.conn");

      const paramsTimeline = new URLSearchParams();
      paramsTimeline.append("from", "01:00:00");

      const paramsHitRate = new URLSearchParams();
      paramsHitRate.append("from", "01:00:00");
      await getStatsDataReq({ id: router.currentRoute.params.id, param: paramsRequest });
      await getStatsDataMiss({ id: router.currentRoute.params.id, param: paramsMiss });
      await getStatsDataHits({ id: router.currentRoute.params.id, param: paramsHits });
      await getStatsDataSections({ id: router.currentRoute.params.id, param: paramsSections });
      await getStatsDataHitRate({ id: router.currentRoute.params.id, param: paramsHitRate });

      let response = await getStatsLine({ id: router.currentRoute.params.id, param: paramsTimeline });
      if (response?.status == 200) {
        await getChartHitMiss(response.data?.data?.time_line_data);
      } else {
        dataChartReal.value = dataChartDefault.value;
      }

      loading.value = false;
      last_fetch.value = new Date().toISOString();
    };

    watch([loadingRequest, timReqInterval], ([loadingVal, interval]) => {
      if (timeoutFuncRequest.value) {
        clearTimeout(timeoutFuncRequest.value);
        timeoutFuncRequest.value = null;
      }
      
      if (loadingVal == 0 && interval && interval > 0) {
        timeoutFuncRequest.value = setTimeout(async () => {
          autoRefreshRequest();
        }, interval);
      }
    });

    watch([loadingMiss, timMissInterval], ([loadingVal, interval]) => {
      if (timeoutFuncMiss.value) {
        clearTimeout(timeoutFuncMiss.value);
        timeoutFuncMiss.value = null;
      }
      
      if (loadingVal == 0 && interval && interval > 0) {
        timeoutFuncMiss.value = setTimeout(async () => {
          autoRefreshMiss();
        }, interval);
      }
    });

    watch([loadingHits, timHitsInterval], ([loadingVal, interval]) => {
      if (timeoutFuncHits.value) {
        clearTimeout(timeoutFuncHits.value);
        timeoutFuncHits.value = null;
      }
      
      if (loadingVal == 0 && interval && interval > 0) {
        timeoutFuncHits.value = setTimeout(async () => {
          autoRefreshHits();
        }, interval);
      }
    });

    watch([loadingSections, timSectionsInterval], ([loadingVal, interval]) => {
      if (timeoutFuncSections.value) {
        clearTimeout(timeoutFuncSections.value);
        timeoutFuncSections.value = null;
      }
      
      if (loadingVal == 0 && interval && interval > 0) {
        timeoutFuncSections.value = setTimeout(async () => {
          autoRefreshSections();
        }, interval);
      }
    });

    watch([isLoadingStatsLine, timHitsMissInterval], ([loadingVal, interval]) => {
      if (timeoutFuncHitsMiss.value) {
        clearTimeout(timeoutFuncHitsMiss.value);
        timeoutFuncHitsMiss.value = null;
      }
      
      if (loadingVal == 0 && interval && interval > 0) {
        timeoutFuncHitsMiss.value = setTimeout(async () => {
          autoRefreshHitsMiss();
        }, interval);
      }
    });

    watch([isLoadingHitRate, timHitRateInterval], ([loadingVal, interval]) => {
      if (timeoutFuncHitRate.value) {
        clearTimeout(timeoutFuncHitRate.value);
        timeoutFuncHitRate.value = null;
      }
      
      if (loadingVal == 0 && interval && interval > 0) {
        timeoutFuncHitRate.value = setTimeout(async () => {
          autoRefreshHitRate();
        }, interval);
      }
    });

    return {
      last_fetch,
      timeAgo,
      filters,
      time_filter,
      selectTimeFilterReq,
      value,
      chartOptions,
      dataChart,
      statsDataReq,
      statsDataMiss,
      statsDataHits,
      statsDataSections,
      statsLine,
      dataChartReal,
      loading,
      isLoadingStatsLine,
      totalPercentage,
      colorPersentage,
      formatSizeVarnish,
      timeoutFuncRequest,
      timeoutFuncMiss,
      timeoutFuncHits,
      timeoutFuncSections,
      timReqInterval,
      timMissInterval,
      timHitsInterval,
      timSectionsInterval,
      selectTimeFilterMiss,
      autoRefreshMiss,
      selectTimeFilterHits,
      selectTimeFilterSections,
      autoRefreshSections,
      selectTimeFilterSections,
      dataSelectRequest,
      dataSelectMiss,
      dataSelectHits,
      dataSelectSections,
      dataFromRequest,
      dataFromMiss,
      dataFromHits,
      dataFromSections,
      selectTimeFilterHitsMiss,
      dataSelectHitsMiss,
      getChartHitMiss,
      dataFromHitsMiss,
      timHitsMissInterval,
      autoRefreshHitsMiss,
      timeoutFuncHitsMiss,
      selectTimeFilterHitRate,
      dataSelectHitRate,
      dataFromHitRate,
      autoRefreshHitRate,
      timeoutFuncHitRate,
      getStatsDataHitRate,
      statsDataHitRate,
      timHitRateInterval
    };
  },
};
</script>

<style scoped>
.circular-progress-wrapper {
  width: 250px;
  height: 315px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.circular-progress {
  width: 100%;
  height: 100%;
}
.card-4-top {
  padding: 15px 30px;
}
@media only screen and (max-width: 600px) {
  .col-sm-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
.cursor-default {
  cursor: default;
  box-shadow: none;
}
.v-menu__content {
  height: 500px !important;
  overflow-y: auto !important;
}
.last-fetch {
  border-radius: 12px;
  color: darkgray;
  font-family: 'Fira Sans';
  font-size: x-small;
}
</style>
