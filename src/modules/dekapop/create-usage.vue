<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="7">
                <div class="psk-title d-flex align-items-center">Create Usage</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">License Name</p>
                <v-text-field
                  v-model="licenseName"
                  placeholder="Insert License Name"
                  single-line
                  outlined
                  :error-messages="$v.licenseName.$errors.length ? $v.licenseName.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">License Key</p>
                <v-text-field
                  v-model="licenseKey"
                  placeholder="Insert License Key"
                  single-line
                  outlined
                  :error-messages="$v.licenseKey.$errors.length ? $v.licenseKey.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">License Status</p>
                <v-text-field
                  v-model="licenseStatus"
                  placeholder="Insert License Status"
                  single-line
                  outlined
                  :error-messages="$v.licenseStatus.$errors.length ? $v.licenseStatus.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Usage Hour</p>
                <v-text-field
                  v-model="usageHour"
                  placeholder="Insert Usage Hour"
                  type="number"
                  single-line
                  outlined
                  :error-messages="$v.usageHour.$errors.length ? $v.usageHour.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Commitment Core</p>

                <v-text-field
                  type="number"
                  v-model="commitmentCore"
                  placeholder="Insert Commitment Core"
                  single-line
                  outlined
                  :error-messages="$v.commitmentCore.$errors.length ? $v.commitmentCore.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">On Demand Core</p>

                <v-text-field
                  type="number"
                  v-model="onDemandCore"
                  placeholder="Insert On Demand Core"
                  single-line
                  outlined
                  :error-messages="$v.onDemandCore.$errors.length ? $v.onDemandCore.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-card-text class="pt-0 pl-0 pr-0">
                  <p for="start-date"><b>Usage Created</b></p>
                  <v-menu
                    ref="menu1"
                    v-model="toggleStartDatePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="usageCreated"
                        id="formated_start_date"
                        placeholder="DD/MM/YYYY"
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :error-messages="$v.usageCreated.$errors.length ? $v.usageCreated.$errors[0].$message : ''"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="usageCreated" no-title @input="toggleStartDatePicker = false" color="primary"></v-date-picker>
                  </v-menu>
                </v-card-text>
              </v-col>
              <v-col cols="12" md="6">
                <v-card-text class="pt-0 pl-0 pr-0">
                  <p for="end-date"><b>Usage Expired</b></p>
                  <v-menu
                    ref="menu2"
                    v-model="toggleEndDatePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="usageExpired"
                        id="formated_end_date"
                        placeholder="DD/MM/YYYY"
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :error-messages="$v.usageExpired.$errors.length ? $v.usageExpired.$errors[0].$message : ''"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="usageExpired" no-title @input="toggleEndDatePicker = false" color="primary"></v-date-picker>
                  </v-menu>
                </v-card-text>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="d-flex align-items-center font-weight-bold">Status Payment</p>
                <v-col class="d-flex pt-0"><v-switch class="mt-0" v-model="statusPayment" inset></v-switch></v-col>
              </v-col>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Description</p>
                <v-textarea v-model="description" placeholder="Insert Description" single-line outlined></v-textarea>
              </v-col>
            </v-row>

            <v-row class="my-7">
              <v-col cols="12" md="6">
                <v-btn block class="accent fz-14" @click="$router.go(-1)" height="50">
                  <span>Cancel</span>
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn block class="secondary fz-14" depressed @click="create" height="50">
                  <span>Create Usage</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useNamespacedActions } from "vuex-composition-helpers";
import { POP } from "./namespace";
import { ref } from "@vue/composition-api";
import moment from "moment";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  setup(props, context) {
    const { createUsage } = useNamespacedActions(POP, ["createUsage"]);
    const licenseKey = ref("");
    const licenseName = ref("");
    const licenseStatus = ref("");
    const usageHour = ref("");
    const commitmentCore = ref("");
    const onDemandCore = ref("");
    const statusPayment = ref(false);
    const usageCreated = ref();
    const usageExpired = ref();
    const toggleStartDatePicker = ref(false);
    const toggleEndDatePicker = ref(false);
    const currentDate = ref(moment(new Date()).format("YYYY-MM-DD"));
    const description = ref("");

    const $v = useVuelidate(
      {
        licenseKey: { required },
        licenseName: { required },
        licenseStatus: { required },
        usageHour: { required },
        commitmentCore: { required },
        onDemandCore: { required },
        usageCreated: { required },
        usageExpired: { required },
      },
      {
        licenseKey,
        licenseName,
        licenseStatus,
        usageHour,
        commitmentCore,
        onDemandCore,
        usageCreated,
        usageExpired,
      }
    );

    const create = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) {
        return;
      }

      let payload = {
        id: "",
        license_name: licenseName.value,
        license_key: licenseKey.value,
        license_status: licenseStatus.value,
        usage_created: usageCreated.value,
        usage_expired: usageExpired.value,
        commitment_core: parseInt(commitmentCore.value),
        on_demand_core: parseInt(onDemandCore.value),
        status_payment: statusPayment.value,
        usage_hour: parseInt(usageHour.value),
        description: description.value,
        dekapop_id: context.root.$route.params.id,
      };
      //   console.log(payload);
      await createUsage(payload);
    };

    return {
      $v,
      licenseKey,
      licenseName,
      licenseStatus,
      usageHour,
      commitmentCore,
      onDemandCore,
      statusPayment,
      create,
      usageCreated,
      usageExpired,
      toggleStartDatePicker,
      toggleEndDatePicker,
      currentDate,
      description,
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
</style>
