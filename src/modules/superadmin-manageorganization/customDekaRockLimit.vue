<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4 darkblue--text">
        Custom Dekarock Limit
      </div>
      <v-card class="rounded-lg" flat v-if="isLoading">
        <v-card-text class="d-flex justify-center">
          <v-progress-circular
            style="margin: auto"
            :size="200"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-card-text>
      </v-card>
      <div v-else>
        <!-- <div class="headline font-weight-bold darkblue--text mt-6">
          Dekarock Cluster
        </div> -->
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Cluster ( {{ dekarockSettings.limit.cluster_used }} used )</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="cluster"
                  type="number"
                  :error-messages="
                    $v.cluster.$errors.length
                      ? $v.cluster.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Machine Set ( {{ dekarockSettings.limit.machine_set_used }} used )</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="machine_set"
                  type="number"
                  :error-messages="
                    $v.machine_set.$errors.length
                      ? $v.machine_set.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Worker ( {{ dekarockSettings.limit.worker_used }} used )</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="worker"
                  type="number"
                  :error-messages="
                    $v.worker.$errors.length
                      ? $v.worker.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              height="58"
              depressed
              block
              color="accent"
              :to="`/organization-detail/${organizationId}`"
              exact
            >
              <span style="font-size: 16px"> Cancel</span>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              height="58"
              depressed
              block
              color="secondary"
              @click="submit"
            >
              <span style="font-size: 16px"> Submit</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-card>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { DEKAROCK } from '@/modules/deka-rock/namespace';
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  setup(props, { root }) {
    const { currentProj, currentOrg } = useNamespacedState("SUPERADMIN", ["currentProj", "currentOrg"]);
    const { getDekarockSetting, updateDekarockSetting } = useNamespacedActions(DEKAROCK, ["getDekarockSetting", "updateDekarockSetting"]);
    const { settings:dekarockSettings } = useNamespacedState(DEKAROCK, ["settings"]);

    const isLoading = ref(true);
    const cluster = ref(0);
    const worker = ref(0);
    const machine_set = ref(0);

    const organizationId = ref(currentOrg.value.id);

    function getSettings(){
      getDekarockSetting({project_id: currentProj.value.id})
        .then((res) => {
            cluster.value = res.data.limit.cluster;
            worker.value = res.data.limit.worker;
            machine_set.value = res.data.limit.machine_set;
            isLoading.value = false;
        })
        .catch(() => {
          isLoading.value = false;
        })
    }

    onMounted(() => {
      getSettings()
    });

    const $v = useVuelidate(
      {
        cluster: { required, minValue: minValue(0) },
        worker: { required, minValue: minValue(0) },
        machine_set: { required, minValue: minValue(0) },
      },
      {
        cluster,worker,machine_set
      }
    );

    const submit = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
        limit: {
          cluster: parseInt(cluster.value),
          worker: parseInt(worker.value),
          machine_set: parseInt(machine_set.value),
        }
      };
      isLoading.value = true;
      const dataRes = await updateDekarockSetting({payload:payload, project_id:currentProj.value.id})
      getSettings()
      isLoading.value = false;
      if (dataRes.status == "OK" || dataRes.message == "Success to update settings") {
        root.$router.push(`/organization-detail/${organizationId.value}`);
      }
    };

    return {
      $v,
      cluster,
      worker,
      machine_set,
      submit,
      isLoading,
      organizationId,
      dekarockSettings
    };
  },
};
</script>

<style lang="scss" scoped>
.hideinput {
  ::v-deep input {
    position: relative;
    bottom: 50px;
    z-index: -4;
  }
}
.btn-delete-flavor {
  font-size: 14px;
  height: 50px !important;
}
</style>
