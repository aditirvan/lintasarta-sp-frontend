<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4">
        Custom Deka Agent Premium Limit
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
        <div class="headline font-weight-bold darkblue--text mt-6">
          Deka Agent Premium
        </div>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Deka Agent Premium</p>
                <v-text-field
                  id="inputAgent"
                  outlined
                  placeholder="0"
                  single-line
                  v-model="agents"
                  type="number"
                  :error-messages="
                    $v.agents.$errors.length
                      ? $v.agents.$errors[0].$message
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
import { ref, onMounted, computed } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required, minValue, maxValue, helpers } from "@vuelidate/validators";
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  setup(props, context) {

    onMounted(async () => {
      await getDekaAgentLimit(projectId.value)
      agents.value = limitservices.value.deka_agent.deka_agent_total.limit
    });
    const { 
      getDekaAgentLimit, 
      updateDekaAgentLimit
    } = useNamespacedActions(
      "AGENT",
      [
        "getDekaAgentLimit",
        "updateDekaAgentLimit", 
      ]
    );
    const { isLoading, limitservices } = useNamespacedState("AGENT", ["isLoading", "limitservices"]);
    const agents = ref(0);
    const { showErrorToast, showSuccessToast } = useNamespacedActions(
      "HOMEPAGE",
      ["showErrorToast", "showSuccessToast"]
    );

    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const organizationId = ref(currentOrg.id);
    const currentProj = JSON.parse(localStorage.getItem("currentProj"));
    const projectId = ref(currentProj.id);

    const $v = useVuelidate(
      {
        agents: {
          required,
          minValue: minValue(0),
        },
      },
      {
        agents,
      }
    );

    const submit = () => {
      $v.value.$touch();
      const maxLimitService = limitservices.value.deka_agent.max_limit_deka_agent

      if (agents.value > maxLimitService) {
        showErrorToast(`The maximum value limit allowed is ${maxLimitService}, cannot exceed the number of instances`);
        document.getElementById("inputAgent").focus();
        return;
      }

      if ($v.value.$errors.length) return;

      const payload = {
        id: projectId.value,
        data: {
          deka_agent: {
            deka_agent_total: parseInt(agents.value)
          },
        }
      };
      isLoading.value = true;
      updateDekaAgentLimit(payload)
        .then(() => {
          isLoading.value = false;
          showSuccessToast("Deka agent premium limit has been successfully updated");
          context.root.$router.push(`/organization-detail/${organizationId.value}`);
        })
        .catch((err) => {
          showErrorToast("The limit size must be larger than the size being subscribed to");
          agents.value = limitservices.value.deka_agent.deka_agent_total.limit
          isLoading.value = false;
        });
    };

    return {
      $v,
      agents,
      submit,
      isLoading,
      organizationId,
      limitservices,
      // maxAgent,
      // limit,
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
