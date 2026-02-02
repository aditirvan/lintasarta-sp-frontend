<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="7" class="pt-0">
                <div class="edit-title" v-if="$route.name === 'edit-alert'">
                  Edit Alerting
                </div>
                <div class="edit-title" v-if="$route.name === 'create-alert'">
                  Create Alerting
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <h4 class="pb-3">Name</h4>
                <v-text-field
                  maxlength="30"
                  placeholder="Insert Name"
                  single-line
                  outlined
                  v-model="alertName"
                  :error-messages="
                    $v.alertName.$errors.length
                      ? $v.alertName.$errors[0].$message
                      : ''
                  "
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Description</p>
                <v-textarea
                  outlined
                  name="input-7-4"
                  placeholder="Insert Description"
                  v-model="description"
                  :error-messages="
                    $v.description.$errors.length
                      ? $v.description.$errors[0].$message
                      : ''
                  "
                ></v-textarea>
              </v-col>
            </v-row>
            <v-divider />
            <h4 class="mt-4">Select Metrics</h4>
            <v-row>
              <v-col cols="2"
                ><v-select
                  placeholder="Metrics"
                  :items="metricselect"
                  v-model="metrics"
                  outlined
                  single-line
                  append-icon="mdi-chevron-down"
                  ref="metricsRef"
                  :error-messages="
                    $v.metrics.$errors.length
                      ? $v.metrics.$errors[0].$message
                      : ''
                  "
                ></v-select
              ></v-col>
              <v-col cols="2"
                ><v-select
                  :items="operatorOptions"
                  v-model="comparisonOperator"
                  outlined
                  single-line
                  append-icon="mdi-chevron-down"
                ></v-select
              ></v-col>
              <v-col cols="2"
                ><v-text-field
                  outlined
                  single-line
                  :suffix="['CPU', 'RAM'].includes(metrics) ? '%' : 'MB'"
                  type="number"
                  min="1"
                  max="100"
                  v-model.number="threshold"
                  :error-messages="
                    $v.threshold.$errors.length
                      ? ' '
                      : ''
                  "
                ></v-text-field
              ></v-col>
              <v-col cols="2"
                ><v-text-field
                  type="number"
                  v-model.number="minutes"
                  min="1"
                  outlined
                  single-line
                  suffix="minutes"
                  :error-messages="
                    $v.minutes.$errors.length
                      ? ' '
                      : ''
                  "
                ></v-text-field
              ></v-col>
              <v-col cols="4">
                <small class="error--text">
                  {{
                    $v.minutes.$errors.length && $v.threshold.$errors.length
                      ? 'The minimum value is 1 minute and 1%.'
                      : ''
                  }}
                  {{
                    !$v.minutes.$errors.length && $v.threshold.$errors.length
                      ? 'The minimum value is 1%.'
                      : ''
                  }}
                  {{
                    $v.minutes.$errors.length && !$v.threshold.$errors.length
                      ? 'The minimum value is 1 minute.'
                      : ''
                  }}
                </small>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <h4 class="pb-3">Severity</h4>
                <v-select
                  outlined
                  placeholder="Choose Severity Level"
                  single-line
                  :items="severityOptions"
                  v-model="severity"
                  append-icon="mdi-chevron-down"
                  :error-messages="
                    $v.severity.$errors.length
                      ? $v.severity.$errors[0].$message
                      : ''
                  "
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <h4 class="pb-3">Apply to</h4>
                <v-select
                  outlined
                  :items="activeInstances"
                  placeholder="Choose Instances"
                  item-text="instanceName"
                  item-value="id"
                  single-line
                  append-icon="mdi-chevron-down"
                  v-model="appliedto"
                  :error-messages="
                    $v.appliedto.$errors.length
                      ? $v.appliedto.$errors[0].$message
                      : ''
                  "
                ></v-select>
              </v-col>
            </v-row>

            <h4>Send Alert via</h4>
            <div class="d-flex flex-wrap">
              <div>
                <v-checkbox
                  class="mr-4 mt-0"
                  v-for="(member, i) in selectedMembers"
                  :key="i"
                  :label="member"
                  :value="member"
                  v-model="selectedMembers"
                ></v-checkbox>
                <span
                  class="primary--text pl-2 my-auto pointer reci"
                  @click="openModal()"
                  >Add more recipients</span
                >
              <small v-if="selectedMembers.length < 1" class="error--text">
              {{
                $v.selectedMembers.$errors.length
                  ? $v.selectedMembers.$errors[0].$message
                  : ""
              }}
            </small>
              </div>
            </div>

            <v-row>
              <v-col cols="6">
                <v-btn block depressed class="accent fz-14" dark to="/alerting"
                  ><span class="fz-14">Cancel</span></v-btn
                >
              </v-col>
              <!-- <v-col cols="6" v-if="alertingedit">
                <v-btn
                  block
                  depressed
                  class="secondary"
                  @click="
                    () => {
                      EditAlerting().then(() => {
                        $router.replace('/alerting');
                      });
                    }
                  "
                  ><span class="fz-14">Save</span></v-btn
                >
              </v-col> -->
              <!-- <v-col cols="6" v-else> -->
              <v-col cols="6">
                <v-btn
                  block
                  depressed
                  class="secondary"
                  :disabled="isLoading"
                  @click="save"
                >
                  <beat-loader
                    v-if="isLoading"
                    :color="'white'"
                    :size="'10px'"
                    style="transform: translateY(3px)"
                    class="mr-2"
                  ></beat-loader>
                  <span class="fz-14" v-else>{{
                    editMode ? "Save Changes" : "Create"
                  }}</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <alertreceipents
      :members="members"
      :selectedMembers="selectedMembers"
      @addRecipients="(members) => (selectedMembers = members)"
    />
  </div>
</template>

<script>
import Alertreceipents from "./alertreceipents.vue";
import useralerting from "./useralerting";
import useVuelidate from "@vuelidate/core";
import { required, minValue, minLength } from "@vuelidate/validators";
import { onMounted, ref, watch } from "@vue/composition-api";
import libProject from "@/lib/project";
import {
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { useAlert } from "./useAlert";
import { create } from "lodash";
export default {
  components: { Alertreceipents },
  setup(props, context) {
    const { id: alert_id } = context.root.$route.query;
    const editMode = alert_id ? true : false;
    const { items, openModal, data } = useralerting();
    const selectedMembers = ref([]);
    const alertName = ref("");
    const description = ref("");
    const metrics = ref("CPU");
    const comparisonOperator = ref("gt");
    const threshold = ref(1);
    const minutes = ref(1);
    const appliedto = ref("");
    const operatorOptions = [
      {
        text: "Is Below",
        value: "lt",
      },
      {
        text: "Is Above",
        value: "gt",
      },
    ];
    const metricselect = ["CPU", "RAM", "Network (In)", "Network (Out)"];
    const severity = ref(null);
    const severityOptions = [
      {
        text: "Low",
        value: "low",
      },
      {
        text: "Moderate",
        value: "moderate",
      },
      {
        text: "Critical",
        value: "critical",
      },
    ];
    const granularity = 30;

    const {
      isLoading,
      createAlert,
      fetchAlertByID,
      alert,
      updateAlert,
    } = useAlert();

    function addData() {
      data.value = true;
      this.$router.push("/alerting");
    }

    const $v = useVuelidate(
      {
        alertName: {
          required,
          minLength: minLength(5),
        },
        description: { required },
        metrics: { required },
        minutes: { required, minValue: minValue(1) },
        threshold: { required, minValue: minValue(1) },
        severity: { required },
        selectedMembers: {
          conditional: {
            $message: "Value is required",
            $validator: () => {
              return !!selectedMembers.value.length;
            },
          },
        },
        appliedto: {
          conditional: {
            $message: "Value is required",
            $validator: (val) => {
              return !!val.length;
            },
          },
        },
      },
      {
        alertName,
        description,
        metrics,
        minutes,
        threshold,
        appliedto,
        severity,
      }
    );

    const save = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) {
        const ref = context.refs[$v.value.$errors[0].$property + "Ref"];
        return;
      }

      let resource_type = "";
      if (metrics.value == "CPU" || metrics.value == "RAM")
        resource_type = "instance";
      else if (
        metrics.value == "Network (In)" ||
        metrics.value == "Network (Out)"
      )
        resource_type = "instance_network_interface";

      let metric_type = "";
      if (metrics.value == "CPU") metric_type = "cpu";
      else if (metrics.value == "RAM") metric_type = "memory.usage";
      else if (metrics.value == "Network (In)")
        metric_type = "network.ingoing.bytes";
      else if (metrics.value == "Network (Out)")
        metric_type = "network.outgoing.bytes";

      const activeProjectID = await libProject.getActiveProjectID();
      let thresholdValue = [
        "network.ingoing.bytes",
        "network.outgoing.bytes",
      ].includes(metric_type)
        ? threshold.value * 1000000 // from MB to Bytes
        : threshold.value; // percentage

      const payload = {
        project_id: activeProjectID,
        name: alertName.value,
        description: description.value,
        resource_type,
        resource_id: appliedto.value,
        metric: metric_type,
        severity: severity.value,
        comparison_operator: comparisonOperator.value,
        evaluation_period: minutes.value,
        granularity,
        threshold: thresholdValue,
        emails: selectedMembers.value,
        aggregation_method: "rate:mean",
      };

      if (editMode) {
        payload.id = alert_id;
        const response = await updateAlert(payload);
        if (response.code == 200) context.root.$router.replace("/alerting");
      } else {
        const response = await createAlert(payload);
        if (response.code == 200) context.root.$router.replace("/alerting");
      }
    };

    onMounted(async () => {
      if (editMode) {
        await fetchAlertByID(alert_id);
        alertName.value = alert.value.name;
        description.value = alert.value.description;
        threshold.value = [
          "network.ingoing.bytes",
          "network.outgoing.bytes",
        ].includes(alert.value.metric)
          ? alert.value.threshold / 1000000
          : alert.value.threshold;
        severity.value = alert.value.severity;
        selectedMembers.value = alert.value.emails;
        appliedto.value = alert.value.resource_id;
        comparisonOperator.value = alert.value.comparison_operator;
        minutes.value = alert.value.evaluation_period;
        if (alert.value.metric == "cpu") metrics.value = "CPU";
        else if (alert.value.metric == "memory.usage") metrics.value = "RAM";
        else if (alert.value.metric == "network.ingoing.bytes")
          metrics.value = "Network (In)";
        else if (alert.value.metric == "network.outgoing.bytes")
          metrics.value = "Network (Out)";
      }
    });

    return {
      editMode,
      description,
      severity,
      severityOptions,
      selectedMembers,
      alertName,
      metrics,
      comparisonOperator,
      threshold,
      minutes,
      appliedto,
      operatorOptions,
      metricselect,
      openModal,
      $v,
      save,
      items,
      addData,
      ...useAlert(props, context),
    };
  },
};
</script>

<style scoped>
.edit-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.reci {
  cursor: pointer;
}

.v-btn {
  height: 55px !important;
}
</style>
