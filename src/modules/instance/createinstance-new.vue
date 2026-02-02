<template>
  <v-card flat class="rounded-lg">
    <v-container>
      <v-card-text
        >
        <v-stepper v-model="e1" linear>
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1"> Details </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2"> Volume </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 3" step="3"> Network </v-stepper-step>
            <v-divider></v-divider>
            <!-- <v-stepper-step :complete="e1 > 4" step="4"> Security Groups </v-stepper-step>
            <v-divider></v-divider> -->
            <!-- <v-stepper-step :complete="e1 > 4" step="4"> Server Groups </v-stepper-step>
            <v-divider></v-divider> -->
            <v-stepper-step :complete="e1 > 4" step="4"> Authentication </v-stepper-step>
          </v-stepper-header>

          <v-divider class="mt-4"></v-divider>

          <v-stepper-items>
            <v-stepper-content step="1">
              <Details v-if="e1 == 1" :step.sync="e1" @get-data="getDetails($event)" :data-details="dataDetails"></Details>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card>
                <Volume v-if="e1 == 2" :step.sync="e1" @get-data="getVolume($event)" :data-volume="dataVolume" :data-details="dataDetails"></Volume
              ></v-card>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card
                ><Network
                  v-if="e1 == 3"
                  :step.sync="e1"
                  @get-data="getNetwork($event)"
                  :dataDetails="dataDetails"
                  :data-network="dataNetwork"
                  :billing-type="dataVolume.billing_type"
                ></Network
              ></v-card>
            </v-stepper-content>

            <!-- <v-stepper-content step="4">
              <v-card><SecurityGroups v-if="e1 == 4" :step.sync="e1" @get-data="getSecurity($event)" :data-security="dataSecurity"></SecurityGroups></v-card>
            </v-stepper-content> -->

            <!-- <v-stepper-content step="4">
              <v-card><ServerGroups v-if="e1 == 4" :step.sync="e1" @get-data="getServer($event)" :data-server="dataServer"></ServerGroups></v-card>
            </v-stepper-content> -->

            <v-stepper-content step="4">
              <v-card
                ><Authentication
                  v-if="e1 == 4"
                  :step.sync="e1"
                  :data-details="dataDetails"
                  :data-volume="dataVolume"
                  :data-network="dataNetwork"
                  :data-security="dataSecurity"
                  >
                  <!-- :data-server="dataServer" -->
                  </Authentication
              ></v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>
    </v-container>
  </v-card>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import Details from "./step/Details.vue";
import Network from "./step/Network.vue";
import Volume from "./step/Volume.vue";
import Authentication from "./step/Authentication.vue";
import SecurityGroups from "./step/SecurityGroups.vue";
import ServerGroups from "./step/ServerGroups.vue";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import INSTANCE from "./namespace";

export default {
  components: {
    Details,
    Network,
    Volume,
    Authentication,
    SecurityGroups,
    ServerGroups,
  },
  setup(props, context) {
    const { fetchInstanceDetail } = useNamespacedActions(INSTANCE, ["fetchInstanceDetail"]);
    const { instanceDetail } = useNamespacedState(INSTANCE, ["instanceDetail"]);
    const instanceRefID = ref(context.root.$route.query.instance_ref);
    const imageRefID = ref(context.root.$route.query.image_ref);
    onMounted(() => {
      if (instanceRefID.value) {
        fetchInstanceDetail(instanceRefID.value);
      }
    });
    const e1 = ref(1);
    const dataDetails = ref({});
    const dataVolume = ref({});
    const dataNetwork = ref({});
    const dataSecurity = ref({});
    const dataServer = ref({});
    const getDetails = (data) => {
      dataDetails.value = data;
    };
    const getVolume = (data) => {
      dataVolume.value = data;
    };
    const getNetwork = (data) => {
      dataNetwork.value = data;
    };
    const getSecurity = (data) => {
      dataSecurity.value = data;
    };
    const getServer = (data) => {
      dataServer.value = data;
    };

    return {
      e1,
      getDetails,
      dataDetails,
      getVolume,
      dataVolume,
      getNetwork,
      dataNetwork,
      getSecurity,
      dataSecurity,
      getServer,
      dataServer,
      instanceRefID,
      imageRefID,
      instanceDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-sheet.v-stepper:not(.v-sheet--outlined) {
  box-shadow: none;
}

::v-deep .v-stepper__header {
  box-shadow: none;
}
</style>
