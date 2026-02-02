<template>
  <div>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-7">
            <v-row class="d-flex align-center">
              <v-col cols="4">
                <div class="headline font-weight-bold font--text">
                  Deka Pop Detail Usage Meter
                </div>
              </v-col>
              <v-col cols="2"></v-col>
              <v-col cols="6">
                <v-row align="center" justify="end" class="px-2">
                  <v-col cols="12" md="4" class="px-1">
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
                  <v-col cols="12" md="4" class="px-1">
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
                        />
                      </template>
                      <v-date-picker
                        v-model="endDate"
                        type="month"
                        @input="menuEnd = false"
                      />
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    class="px-1"
                    v-if="role.toLowerCase() == 'superadmin'"
                  >
                    <v-btn
                      block
                      color="secondary"
                      dark
                      height="40"
                      class="fz-14"
                      @click="fetchUsageData"
                    >
                      <template v-slot:loader>
                        <span>Loading...</span>
                      </template>
                      Get Usage
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="2" class="px-1">
                    <v-btn
                      block
                      color="primary"
                      dark
                      height="40"
                      class="fz-14"
                      @click="downloadExcel"
                    >
                      <v-icon left>mdi-microsoft-excel</v-icon>
                      Export to Excel
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-data-table
                  class="mb-5"
                  :items="filteredList"
                  :headers="headersPop"
                  item-key="id"
                  hide-default-footer
                  :server-items-length="totalRowsPop"
                >
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
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, ref, computed, reactive } from "@vue/composition-api";
import { POP } from "./namespace";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {},
  setup(props, context) {
    const {
      getListUsageMonthlyByUsageId,
      syncUsageMonthlyUsage,
      downloadUsageMonthlyUsage,
    } = useNamespacedActions(POP, [
      "getListUsageMonthlyByUsageId",
      "syncUsageMonthlyUsage",
      "downloadUsageMonthlyUsage",
    ]);
    const { listMonthlyByUsage, totalRowsPop, loadingUsage, isDownloading } =
      useNamespacedGetters(POP, [
        "listMonthlyByUsage",
        "totalRowsPop",
        "loadingUsage",
        "isDownloading",
      ]);
    const currentProj = ref(JSON.parse(localStorage.getItem("currentProj")));
    const role = ref(localStorage.getItem("role"));
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Deka POP"));
    const search = ref("");

    const filteredList = computed(() => {
      return listMonthlyByUsage.value.filter((item) =>
        item.date_string.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    const applySearch = () => {
      console.log("Searching for:", search.value);
    };

    const expanded = ref([]);
    const singleExpand = ref(true);
    const popo = ref(false);
    const coordinate = reactive({ x: 0, y: 0 });
    const showMenu1 = ref(false);
    const activemenuinstance = ref({});
    const openDialog = ref(false);
    const dataItem = ref("");

    const startDate = ref(null);
    const endDate = ref(null);
    const menuStart = ref(false);
    const menuEnd = ref(false);

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

    const headersPop = ref([
      { text: "Date", value: "date_string", sortable: false },
      { text: "License Key", value: "license_key", sortable: false },
      { text: "Quantity", value: "qty_core", sortable: false },
    ]);

    onMounted(async () => {
      const id = context.root.$route.params.id;

      const params = new URLSearchParams();
      params.append("usage_meter_id", id);
      params.append("limit", "10");
      params.append("page", "1");
      params.append("sort", "created_at desc");
      await getListUsageMonthlyByUsageId(params);
    });

    const changePage = async (val) => {
      const id = context.root.$route.params.id;

      const params = new URLSearchParams();
      params.append("usage_meter_id", id);

      params.append("limit", val.itemsPerPage);
      params.append("page", val.page);
      params.append("sort", "created_at desc");
      await getListUsageMonthlyByUsageId(params);
    };

    const formattedList = computed(() => {
      let lastDate = null;
      return listMonthlyByUsage.value.map((item) => {
        let displayDate = item.DateString === lastDate ? "" : item.DateString;
        lastDate = item.DateString;
        return { ...item, formattedDate: displayDate };
      });
    });

    const fetchUsageData = async () => {
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
        usage_meter_id: context.root.$route.params.id,
        start_year: startYear,
        start_month: startMonth,
        end_year: endYear,
        end_month: endMonth,
      };

      try {
        await syncUsageMonthlyUsage(payload);
        const id = context.root.$route.params.id;

        const params = new URLSearchParams();
        params.append("usage_meter_id", id);
        params.append("limit", "10");
        params.append("page", "1");
        params.append("sort", "created_at desc");
        await getListUsageMonthlyByUsageId(params);
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

      let [startYear, startMonth] = startDate.value.split("-");
      let [endYear, endMonth] = endDate.value.split("-");

      try {
        await downloadUsageMonthlyUsage({
          usage_meter_id: context.root.$route.params.id,
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

    return {
      headersPop,
      listMonthlyByUsage,
      filteredList,
      search,
      applySearch,
      expanded,
      singleExpand,
      changePage,
      popo,
      coordinate,
      show,
      showMenu1,
      activemenuinstance,
      role,
      openDialog,
      dataItem,
      totalRowsPop,
      read_only,
      startDate,
      endDate,
      menuStart,
      menuEnd,
      fetchUsageData,
      downloadExcel,
    };
  },
};
</script>
