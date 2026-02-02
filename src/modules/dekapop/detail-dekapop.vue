<template>
  <div>
    <v-card class="rounded-lg pa-3" flat>
      <v-row class="pl-4">
        <v-col cols="9">
          <div class="firewall-title mt-2">
            Deka Prime on Premise Report Usage
          </div>
        </v-col>
      </v-row>
      <v-row class="d-flex ml-1">
        <v-col cols="12">
          <v-card outlined class="rounded-lg fullheight pa-5">
            <v-card-text>
              <v-row>
                <v-col>
                  <v-row>
                    <v-col sm="12" md="6" class="pt-0">
                      <p class="mb-1 font-weight-regular">User Name</p>
                      <span class="font-weight-bold font--text">
                        {{ detailPop.user_name }}
                      </span>
                    </v-col>
                    <v-col sm="12" md="6" class="pt-0">
                      <p class="mb-1 font-weight-regular">Product Name</p>
                      <span class="font-weight-bold font--text">
                        {{ detailPop.product_name }}
                      </span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col>
                  <v-row>
                    <v-col sm="12" md="6" class="pt-0">
                      <p class="mb-1 font-weight-regular">Commitment Core</p>
                      <span class="font-weight-bold font--text">
                        {{ detailPop.limit_commitment_core }}
                      </span>
                    </v-col>
                    <v-col sm="12" md="6" class="pt-0">
                      <p class="mb-1 font-weight-regular">License</p>
                      <v-dialog v-model="dialogLicense" width="1200">
                        <template v-slot:activator="{ on, attrs }">
                          <span
                            class="font-weight-bold font--text"
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ detailPop.licenses.length }} Licenses
                          </span>
                        </template>

                        <v-card>
                          <v-card-title> List License </v-card-title>
                        </v-card>
                        <v-card>
                          <v-card-text>
                            <v-data-table
                              :headers="[
                                { text: 'No', value: 'no' },
                                { text: 'Name', value: 'name' },
                                { text: 'Key', value: 'key', sortable: false },
                              ]"
                              :items="
                                detailPop.licenses.map((license, index) => ({
                                  no: index + 1,
                                  name: license.Name,
                                  key: license.Key,
                                }))
                              "
                            >
                              <template v-slot:[`item.key`]="{ item }">
                                {{ item.key }}
                                <v-btn icon @click="copyKey(item.key)">
                                  <v-icon>mdi-content-copy</v-icon>
                                </v-btn>
                              </template>
                            </v-data-table>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col>
                  <v-row>
                    <v-col sm="12" md="12" class="pt-0">
                      <p class="mb-1 font-weight-regular">Usage Meter Name</p>
                      <span class="font-weight-bold font--text">
                        {{ detailPop.usage_meter_name }}
                      </span>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  ><v-row>
                    <v-col sm="12" md="6" class="pt-0"
                      ><p class="mb-1 font-weight-regular">Productid</p>
                      <span class="font-weight-bold font--text">{{
                        detailPop.product_id || "-"
                      }}</span>
                    </v-col>
                    <v-col sm="12" md="6" class="pt-0"
                      ><p class="mb-1 font-weight-regular">Service Instance</p>
                      <span class="font-weight-bold font--text">{{
                        detailPop.service_instance || "-"
                      }}</span>
                    </v-col>
                  </v-row></v-col
                >
                <v-col
                  ><v-row>
                    <v-col sm="12" md="6" class="pt-0"
                      ><p class="mb-1 font-weight-regular">Reporting Periode</p>
                      <span class="font-weight-bold font--text">{{
                        detailPop.validity_license
                      }}</span>
                    </v-col>
                    <v-col sm="12" md="6" class="pt-0"
                      ><p class="mb-1 font-weight-regular">Description</p>
                      <span class="font-weight-bold font--text">{{
                        detailPop.description
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col>
                  <v-row>
                    <v-col sm="12" md="12" class="pt-0">
                      <p class="mb-1 font-weight-regular"></p>
                      <span class="font-weight-bold font--text"></span>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text class="mt-5">
              <v-row class="d-flex align-center">
                <v-col cols="4">
                  <div class="headline font-weight-bold font--text">
                    Usage List
                  </div>
                </v-col>
                <v-col cols="8" v-if="role.toLowerCase() == 'superadmin'">
                  <v-row align="center" justify="end" class="ma-0">
                    <v-col md="3" class="pa-1">
                      <v-menu
                        v-model="menuStart"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-bind="attrs"
                            v-on="on"
                            label="Start Date"
                            readonly
                            v-model="startDate"
                            dense
                          />
                        </template>
                        <v-date-picker
                          v-model="startDate"
                          type="month"
                          @input="menuStart = false"
                        />
                      </v-menu>
                    </v-col>
                    <v-col md="3" class="pa-1">
                      <v-menu
                        v-model="menuEnd"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-bind="attrs"
                            v-on="on"
                            label="End Date"
                            readonly
                            v-model="endDate"
                            dense
                            :error-messages="dateErrorMessage"
                          />
                        </template>
                        <v-date-picker
                          v-model="endDate"
                          type="month"
                          @input="menuEnd = false"
                        />
                      </v-menu>
                    </v-col>
                    <v-col md="2" class="pa-1">
                      <v-btn
                        block
                        color="secondary"
                        dark
                        small
                        class="text-caption"
                        @click="!loadingUsage && fetchUsageData()"
                        :disabled="isEndDateBeforeStartDate"
                      >
                        {{ loadingUsage ? "Loading" : "Get" }}
                      </v-btn>
                    </v-col>
                    <v-col md="2" class="pa-1">
                      <v-btn
                        block
                        color="primary"
                        dark
                        small
                        class="text-caption"
                        @click="downloadExcel"
                        :disabled="isEndDateBeforeStartDate"
                      >
                        <v-icon small left>mdi-microsoft-excel</v-icon>
                        Export
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-row>
                <v-col md="12">
                  <!-- Grouping Info -->
                  <!-- <v-row v-if="groupingInfo.length > 0" class="mb-3">
                    <v-col cols="12">
                      <div class="d-flex align-center">
                        <span class="text-caption font-weight-medium mr-3">License Status Groups:</span>
                        <v-chip
                          v-for="group in groupingInfo"
                          :key="group.status"
                          :color="group.color"
                          text-color="white"
                          small
                          class="mr-2"
                        >
                          {{ group.status }} ({{ group.count }})
                        </v-chip>
                      </div>
                    </v-col>
                  </v-row> -->

                  <v-data-table
                    class="mb-5"
                    :items="sortedListUsage"
                    :headers="headers"
                    item-key="id"
                    show-expand
                    :single-expand="singleExpand"
                    :expanded.sync="expanded"
                    hide-default-footer
                    :server-items-length="totalRowsUsage"
                    :loading="loadingUsage"
                  >
                    <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length">
                        <v-card class="bs-no pa-4">
                          <v-col>
                            <v-row>
                              <v-col
                                ><v-row>
                                  <v-col
                                    sm="12"
                                    md="6"
                                    class="pt-0"
                                    v-if="
                                      detailPop.usage_meter_name !=
                                        'UM_Telkom' ||
                                      role.toLowerCase() === 'superadmin'
                                    "
                                  >
                                    <p class="mb-1 font-weight-regular">
                                      Usage Hour
                                    </p>
                                    <span class="font-weight-bold font--text">{{
                                      item.usage_hour
                                    }}</span>
                                  </v-col>

                                  <v-col sm="12" md="6" class="pt-0"
                                    ><p class="mb-1 font-weight-regular">
                                      Total Core
                                    </p>
                                    <span class="font-weight-bold font--text">{{
                                      item.total_cores
                                    }}</span>
                                  </v-col>
                                </v-row></v-col
                              >
                              <v-col
                                ><v-row>
                                  <v-col sm="12" md="6" class="pt-0"
                                    ><p class="mb-1 font-weight-regular">
                                      Commitment Core
                                    </p>
                                    <span class="font-weight-bold font--text">{{
                                      item.commitment_core
                                    }}</span>
                                  </v-col>
                                  <v-col sm="12" md="6" class="pt-0"
                                    ><p class="mb-1 font-weight-regular">
                                      On Demand Core
                                    </p>
                                    <span class="font-weight-bold font--text">{{
                                      item.on_demand_core
                                    }}</span>
                                  </v-col>
                                </v-row></v-col
                              >
                            </v-row>
                            <!-- <v-row>
                              <v-col
                                ><v-row>
                                  <v-col sm="12" md="6" class="pt-0"
                                    ><p class="mb-1 font-weight-regular">
                                      Tarif Commitment Core
                                    </p>
                                    <span class="font-weight-bold font--text">{{
                                      toIDRWithDotFormat(
                                        item.tariff_commitment_core
                                      )
                                    }}</span>
                                  </v-col>
                                  <v-col sm="12" md="6" class="pt-0"
                                    ><p class="mb-1 font-weight-regular">
                                      Tarif On Demand Core
                                    </p>
                                    <span class="font-weight-bold font--text">{{
                                      toIDRWithDotFormat(
                                        item.tariff_on_demand_core
                                      )
                                    }}</span>
                                  </v-col>
                                </v-row></v-col
                              >
                              <v-col
                                ><v-row>
                                  <v-col sm="12" md="6" class="pt-0"
                                    ><p class="mb-1 font-weight-regular">
                                      USD Rate
                                    </p>
                                    <span class="font-weight-bold font--text">{{
                                      toIDRWithDotFormat(item.usd_to_idr_rate)
                                    }}</span>
                                  </v-col>
                                  <v-col sm="12" md="6" class="pt-0"
                                    ><p class="mb-1 font-weight-regular">
                                      Total Tarif
                                    </p>
                                    <span class="font-weight-bold font--text">{{
                                      toIDRWithDotFormat(item.total_amount)
                                    }}</span>
                                  </v-col>
                                </v-row></v-col
                              >
                            </v-row> -->
                            <v-row>
                              <v-col
                                ><v-row>
                                  <!-- <v-col sm="12" md="6" class="pt-0"
                                    ><p class="mb-1 font-weight-regular">
                                      Status Payment
                                    </p>
                                    <span class="font-weight-bold font--text">{{
                                      item.status_payment ? "Paid" : "Unpaid"
                                    }}</span>
                                  </v-col> -->
                                  <v-col sm="12" md="6" class="pt-0"
                                    ><p class="mb-1 font-weight-regular">
                                      Month / Year
                                    </p>
                                    <span class="font-weight-bold font--text"
                                      >{{ item.month }} / {{ item.year }}</span
                                    >
                                  </v-col>
                                </v-row></v-col
                              >
                              <v-col
                                ><v-row>
                                  <v-col sm="12" md="6" class="pt-0"> </v-col>
                                  <v-col sm="12" md="6" class="pt-0">
                                  </v-col> </v-row
                              ></v-col>
                            </v-row>
                          </v-col>
                        </v-card>
                      </td>
                    </template>

                    <template #[`item.usage_created`]="{ item }">
                      <span
                        >{{ $FormatDate(item.usage_created) }} -
                        {{ $FormatDate(item.usage_expired) }}</span
                      >
                    </template>

                    <template #[`item.is_valid_license`]="{ item }">
                      <v-chip
                        :color="getLicenseStatusColor(item.is_valid_license)"
                        text-color="white"
                        small
                        class="font-weight-bold"
                      >
                        {{ item.is_valid_license }}
                      </v-chip>
                    </template>

                    <template #[`item.action`]="{ item }">
                      <popupquote
                        v-model="popo"
                        :offsetTop="20"
                        :coordinate="coordinate"
                        :documentid="'popup' + item.id"
                        offset-y
                        allow-overflow
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <label
                            v-bind="attrs"
                            class="primary--text linkpointer"
                            style="position: relative; white-space: nowrap"
                            @click="
                              ($event) => {
                                on.click($event);
                                show($event, item);
                              }
                            "
                            >More
                            <v-icon
                              :class="{
                                rotate: item.id == activemenuinstance && popo,
                              }"
                              :id="'popup' + item.id"
                              color="primary"
                              >mdi-chevron-down
                            </v-icon>
                          </label>
                        </template>
                        <v-list class="font-weight-bold">
                          <v-list-item v-if="!read_only">
                            <v-list-item-title
                              ><span class="primary--text"
                                ><router-link
                                  :to="`/dekapop/edit/usage/${item.id}`"
                                  >Edit</router-link
                                ></span
                              ></v-list-item-title
                            >
                          </v-list-item>
                          <v-list-item v-if="!read_only">
                            <v-list-item-title
                              ><span
                                class="red--text cursor-pointer"
                                @click="
                                  () => {
                                    dataItem = item;
                                    openDialog = true;
                                  }
                                "
                                >Delete</span
                              ></v-list-item-title
                            >
                          </v-list-item>
                        </v-list>
                      </popupquote>
                    </template>
                    <template v-slot:footer="{ props }">
                      <custom-footer-datatable
                        @input="
                          (val) => {
                            changePage(val);
                          }
                        "
                        :props="props"
                      />
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <DeleteUsage
      :dialog-closed.sync="openDialog"
      :data-item="dataItem"
      v-if="openDialog"
    ></DeleteUsage>
  </div>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { POP } from "./namespace";
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import { toIDRWithDotFormat } from "@/lib/formatter";
import DeleteUsage from "./delete-usage.vue";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    DeleteUsage,
  },
  setup(props, context) {
    const { getDetailPop, getListUsage, syncUsage, downloadUsageExcel } =
      useNamespacedActions(POP, [
        "getDetailPop",
        "getListUsage",
        "syncUsage",
        "downloadUsageExcel",
      ]);
    const {
      detailPop,
      listUsage,
      totalRowsUsage,
      loadingUsage,
      isDownloading,
    } = useNamespacedGetters(POP, [
      "detailPop",
      "listUsage",
      "totalRowsUsage",
      "loadingUsage",
      "isDownloading",
    ]);
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Deka POP"));
    const usageMeterId = ref("");
    onMounted(async () => {
      await getDetailPop(context.root.$route.params.id);
      console.log(
        "detailPop.value.usage_meter_id",
        detailPop.value.usage_meter_id
      );

      usageMeterId.value = detailPop.value.usage_meter_id;

      const params = new URLSearchParams();
      params.append("dekapopId", context.root.$route.params.id);
      params.append("limit", "10");
      params.append("page", "1");
      params.append("sort", "created_at desc");
      await getListUsage(params);
      if (role.value.toLowerCase() == "superadmin")
        headers.value.push({
          text: "Action",
          value: "action",
          sortable: false,
        });
    });

    const copyKey = (item) => {
      navigator.clipboard.writeText(item);
      context.root.$store.dispatch(
        "HOMEPAGE/showSuccessToast",
        "Copied to clipboard",
        { root: true }
      );
    };

    const headers = ref([
      // { text: "Product Name", value: "license_name", sortable: false },
      { text: "License Key", value: "license_key", sortable: false },
      { text: "", value: "data-table-expand" },
      { text: "License Name", value: "license_name", sortable: false },
      { text: "Validity License", value: "usage_created", sortable: false },
      { text: "Year / Month", value: "usage_synch", sortable: false },
      { 
        text: "Status License", 
        value: "is_valid_license", 
        sortable: false,
        align: "center",
        // Custom slot untuk mempercantik tampilan TRUE/FALSE
        slot: 'is_valid_license'
      },
    ]);

    const changePage = async (val) => {
      const params = new URLSearchParams();
      params.append("dekapopId", context.root.$route.params.id);
      params.append("limit", val.itemsPerPage);
      params.append("page", val.page);
      params.append("sort", "created_at desc");
      await getListUsage(params);
    };
    const dataItem = ref("");
    const openDialog = ref(false);
    const expanded = ref([]);
    const singleExpand = ref(true);
    const role = ref(localStorage.getItem("role"));

    const popo = ref(false);
    const coordinate = reactive({ x: 0, y: 0 });
    const showMenu1 = ref(false);
    const activemenuinstance = ref({});
    const startDate = ref(null);
    const endDate = ref(null);
    const menuStart = ref(false);
    const menuEnd = ref(false);
    const dialogLicense = ref(false);
    const show = (e, instance) => {
      e.preventDefault();
      activemenuinstance.value = instance.id;
      showMenu1.value = false;
      coordinate.x = e.clientX - 20;
      coordinate.y = e.clientY + 10;
      context.root.$nextTick(() => {
        showMenu1.value = true;
      });
    };

    console.log("licenses ", detailPop.value.licenses);

    const fetchUsageData = async () => {
      if (loadingUsage.value) {
        context.root.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Still fetching data, please wait...",
          { root: true }
        );
        return;
      }

      console.log("startDate.value", startDate.value);
      console.log("endDate.value", endDate.value);
      console.log("loading usage", loadingUsage.value);

      if (!startDate.value || !endDate.value) {
        context.root.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Please select start and end date",
          { root: true }
        );
        return;
      }

      // Validasi end date tidak boleh mundur dibanding start date
      if (isEndDateBeforeStartDate.value) {
        context.root.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "End date cannot be before start date",
          { root: true }
        );
        return;
      }

      let [startYear, startMonth] = startDate.value.split("-");
      let [endYear, endMonth] = endDate.value.split("-");

      // Konversi ke integer
      startYear = parseInt(startYear, 10);
      startMonth = parseInt(startMonth, 10);
      endYear = parseInt(endYear, 10);
      endMonth = parseInt(endMonth, 10);

      if (
        isNaN(startYear) ||
        isNaN(startMonth) ||
        isNaN(endYear) ||
        isNaN(endMonth)
      ) {
        context.root.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Invalid date format",
          { root: true }
        );
        return;
      }

      let payload = {
        dekapop_id: context.root.$route.params.id,
        start_year: startYear,
        start_month: startMonth,
        end_year: endYear,
        end_month: endMonth,
      };

      try {
        await syncUsage(payload);
        const params = new URLSearchParams();
        params.append("dekapopId", context.root.$route.params.id);
        params.append("limit", "10");
        params.append("page", "1");
        params.append("sort", "created_at desc");
        await getListUsage(params);
      } catch (error) {
        context.root.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Failed to fetch usage data",
          { root: true }
        );
      }
    };

    const downloadExcel = async () => {
      if (!startDate.value || !endDate.value) {
        context.root.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Please select start and end date",
          { root: true }
        );
        return;
      }

      // Validasi end date tidak boleh mundur dibanding start date
      if (isEndDateBeforeStartDate.value) {
        context.root.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "End date cannot be before start date",
          { root: true }
        );
        return;
      }

      if (isDownloading.value) {
        context.root.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Still downloading file, please wait...",
          { root: true }
        );
        return;
      }

      let [startYear, startMonth] = startDate.value.split("-");
      let [endYear, endMonth] = endDate.value.split("-");

      try {
        await downloadUsageExcel({
          dekapopId: context.root.$route.params.id,
          startYear,
          startMonth,
          endYear,
          endMonth,
          startDate: startDate.value,
          endDate: endDate.value,
        });
      } catch (error) {
        console.log("error", error);
        context.root.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Failed to download excel file",
          { root: true }
        );
      }
    };

    // Computed property untuk validasi date
    const isEndDateBeforeStartDate = computed(() => {
      if (!startDate.value || !endDate.value) return false;
      
      const start = new Date(startDate.value + '-01'); // Tambah tanggal 1 untuk memastikan format yang benar
      const end = new Date(endDate.value + '-01');
      
      return end < start;
    });

    // Computed property untuk error message
    const dateErrorMessage = computed(() => {
      if (isEndDateBeforeStartDate.value) {
        return 'End date cannot be before start date';
      }
      return '';
    });

    // Computed property untuk mengurutkan data usage berdasarkan is_valid_license
    const sortedListUsage = computed(() => {
      if (!listUsage.value) return [];
      
      const sorted = [...listUsage.value].sort((a, b) => {
        // Definisikan prioritas status
        const getStatusPriority = (status) => {
          switch (status) {
            case 'VALID': return 1; // Prioritas tertinggi - paling atas
            case 'INVALID': return 2; // Prioritas menengah - tengah
            case 'NOT REGISTERED': return 3; // Prioritas terendah - paling bawah
            default: return 4; // Status lain
          }
        };
        
        const priorityA = getStatusPriority(a.is_valid_license);
        const priorityB = getStatusPriority(b.is_valid_license);
        
        // Jika prioritas berbeda, urutkan berdasarkan prioritas
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        
        // Jika prioritas sama (dalam kelompok yang sama), urutkan berdasarkan created_at desc
        return new Date(b.created_at) - new Date(a.created_at);
      });

      // Debug: log pengelompokan
      console.log('=== SORTED LIST USAGE ===');
      const validCount = sorted.filter(item => item.is_valid_license === 'VALID').length;
      const invalidCount = sorted.filter(item => item.is_valid_license === 'INVALID').length;
      const notRegisteredCount = sorted.filter(item => item.is_valid_license === 'NOT REGISTERED').length;
      
      console.log(`VALID: ${validCount} items`);
      console.log(`INVALID: ${invalidCount} items`);
      console.log(`NOT REGISTERED: ${notRegisteredCount} items`);
      console.log('First 5 items:', sorted.slice(0, 5).map(item => ({
        id: item.id,
        status: item.is_valid_license,
        created_at: item.created_at
      })));
      
      return sorted;
    });

    // Computed property untuk mendapatkan informasi pengelompokan
    const groupingInfo = computed(() => {
      if (!sortedListUsage.value) return [];
      
      const validItems = sortedListUsage.value.filter(item => item.is_valid_license === 'VALID');
      const invalidItems = sortedListUsage.value.filter(item => item.is_valid_license === 'INVALID');
      const notRegisteredItems = sortedListUsage.value.filter(item => item.is_valid_license === 'NOT REGISTERED');
      
      return [
        { status: 'VALID', count: validItems.length, color: 'success' },
        { status: 'INVALID', count: invalidItems.length, color: 'error' },
        { status: 'NOT REGISTERED', count: notRegisteredItems.length, color: 'warning' }
      ].filter(group => group.count > 0);
    });

    const getLicenseStatusColor = (status) => {
      if (status === 'VALID') {
        return 'success';
      } else if (status === 'INVALID') {
        return 'error';
      } else if (status === 'NOT REGISTERED') {
        return 'warning';
      }
      return '';
    };

    return {
      detailPop,
      headers,
      listUsage,
      sortedListUsage,
      changePage,
      totalRowsUsage,
      toIDRWithDotFormat,
      popo,
      coordinate,
      show,
      showMenu1,
      activemenuinstance,
      role,
      singleExpand,
      expanded,
      dataItem,
      openDialog,
      read_only,
      startDate,
      endDate,
      menuStart,
      menuEnd,
      fetchUsageData,
      dialogLicense,
      copyKey,
      downloadExcel,
      loadingUsage,
      usageMeterId,
      isEndDateBeforeStartDate,
      dateErrorMessage,
      getLicenseStatusColor,
      groupingInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.psk-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.blue-border {
  border-color: #2c94d2;
}
.bs {
  box-shadow: none;
}
::v-deep .v-text-field__details {
  position: static;
}
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}
::v-deep
  .v-data-table
  > .v-data-table__wrapper
  tbody
  tr.v-data-table__expanded__content {
  box-shadow: none !important;
  background-color: #fbfbfb !important;
}
.bs-no {
  box-shadow: none !important;
}

.fz-14 {
  font-size: 14px !important;
}
</style>
