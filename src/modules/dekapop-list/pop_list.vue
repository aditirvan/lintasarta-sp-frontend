<template>
  <div>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-7">
            <v-row class="d-flex align-center">
              <v-col cols="9">
                <div class="headline font-weight-bold font--text">
                  Deka Pop Usage Meter
                </div>
              </v-col>
            </v-row>

            <v-row>
              <!-- Kartu Informasi Utama -->
              <v-col cols="8">
                <v-card class="pa-4">
                  <v-row>
                    <v-col cols="12">
                      <p><strong>Filter Date:</strong> {{ dateRange.start }}</p>
                      <p><strong>License Key:</strong></p>

                      <v-simple-table dense>
                        <thead>
                          <tr>
                            <th>Usage Meter Name</th>
                            <th>License Key</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="listMonthlyByUsage.length === 0">
                            <td colspan="3" class="text-center">
                              No Data Available
                            </td>
                          </tr>
                          <tr
                            v-for="(item, index) in listMonthlyByUsage"
                            :key="index"
                          >
                            <td>{{ item.usage_meter_name }}</td>
                            <td>{{ item.license_key }}</td>
                            <td>{{ item.qty_core }}</td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- Kartu Informasi Kecil -->
              <v-col cols="4">
                <v-card class="pa-4">
                  <p>
                    <strong>
                      Total
                      <span class="blue--text text-decoration-underline">
                        Cores </span
                      >:
                    </strong>
                    {{ totalCores }}
                  </p>
                  <p>
                    <strong>
                      Last
                      <span class="blue--text text-decoration-underline">
                        Updated </span
                      >:
                    </strong>
                    {{ lastUpdated }}
                  </p>
                </v-card>
              </v-col>
            </v-row>

            <!-- Input Multi Select dan Date Range -->
            <v-row>
              <!-- Multi Select Usage Meter -->
              <v-col cols="3">
                <v-select
                  v-model="selectedUsageMeters"
                  :items="agentOptions"
                  item-text="label"
                  item-value="agentId"
                  label="Usage Meter Name"
                  multiple
                  outlined
                  dense
                  hide-details
                  chips
                  small-chips
                  style="max-width: 100%"
                ></v-select>
                <p v-if="errorMessage.usageMeter" class="text-danger">
                  {{ errorMessage.usageMeter }}
                </p>
              </v-col>

              <!-- Start Date Picker -->
              <v-col cols="2">
                <v-text-field
                  v-model="dateRange.start"
                  label="Start Date"
                  outlined
                  dense
                  readonly
                  @click="pickerStart = true"
                />
                <v-dialog v-model="pickerStart" persistent max-width="290px">
                  <v-card>
                    <v-date-picker
                      v-model="dateRange.start"
                      @input="pickerStart = false"
                      :max="dateRange.end"
                    />
                  </v-card>
                </v-dialog>
              </v-col>

              <!-- Tombol Apply -->
              <v-col cols="1">
                <v-btn color="primary" block @click="searchDate">Apply</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "@vue/composition-api";
import { POP } from "./namespace";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";

export default {
  setup() {
    const { getListAgents, getListUsageMonthlyByUsageDate } =
      useNamespacedActions(POP, [
        "getListAgents",
        "getListUsageMonthlyByUsageDate",
      ]);
    const { listAgents, listMonthlyByUsage } = useNamespacedGetters(POP, [
      "listAgents",
      "listMonthlyByUsage",
    ]);

    const selectedUsageMeters = ref([]);
    const dateRange = ref({
      start: new Date().toISOString().substr(0, 10),
      end: new Date().toISOString().substr(0, 10),
    });
    const pickerStart = ref(false);
    const pickerEnd = ref(false);
    const licenseKey = ref([]);
    const totalCores = ref(0);
    const lastUpdated = ref(new Date().toISOString().substr(0, 10));
    const errorMessage = ref({ usageMeter: "", date: "" });

    // Computed list agent + opsi Select All
    const agentOptions = computed(() => [
      { agentId: "all", label: "Select All" },
      ...listAgents.value,
    ]);

    onMounted(async () => {
      await getListAgents();
    });

    watch(listMonthlyByUsage, (newList) => {
      if (newList && newList.length) {
        licenseKey.value = newList.map(
          (item) => `${item.license_key} | ${item.qty_core}`
        );
        totalCores.value = newList.reduce(
          (sum, item) => sum + item.qty_core,
          0
        );
      } else {
        licenseKey.value = [];
        totalCores.value = 0;
      }
    });

    watch(selectedUsageMeters, (val, oldVal) => {
      const agentIds = agentOptions.value.map((agent) => agent.agentId);

      // Jika user pilih "all", maka select semua
      if (val.includes("all") && val.length === 1) {
        selectedUsageMeters.value = agentIds;
      }

      // Jika user UNCHECK "all" dari posisi sebelumnya ke kondisi sekarang
      if (!val.includes("all") && oldVal.includes("all")) {
        // Hapus semua selected jika "all" di-uncheck
        selectedUsageMeters.value = [];
      }

      // Jika "all" masih ada tapi ada item yang di-uncheck, maka hapus "all" dari selected
      if (
        val.includes("all") &&
        val.length > 1 &&
        val.length < agentOptions.value.length
      ) {
        selectedUsageMeters.value = val.filter((id) => id !== "all");
      }
    });

    const searchDate = async () => {
      errorMessage.value.usageMeter = "";
      errorMessage.value.date = "";

      if (selectedUsageMeters.value.length === 0) {
        errorMessage.value.usageMeter = "Usage Meter is required.";
      }
      if (!dateRange.value.start) {
        errorMessage.value.date = "Start Date are required.";
      }

      if (errorMessage.value.usageMeter || errorMessage.value.date) return;

      await getListUsageMonthlyByUsageDate({
        start_date: dateRange.value.start,
        end_date: dateRange.value.start,
        usage_meter_id: selectedUsageMeters.value.includes("all")
          ? "all"
          : selectedUsageMeters.value.join(","),
      });
    };

    return {
      listAgents,
      agentOptions,
      selectedUsageMeters,
      dateRange,
      pickerStart,
      pickerEnd,
      licenseKey,
      totalCores,
      lastUpdated,
      errorMessage,
      searchDate,
      listMonthlyByUsage,
      formattedLicenseKeys: licenseKey,
    };
  },
};
</script>

<style scoped>
.text-danger {
  color: red;
}
.v-select .v-chip {
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
