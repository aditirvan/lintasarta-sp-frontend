<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-5">
            <v-row>
              <v-col md="3">
                <p class="font-weight-bold mb-0">New Organization VDC Network</p>
                <v-stepper v-model="e6" vertical>
                  <v-stepper-step :complete="e6 > 1" step="1"> Scope </v-stepper-step>
                  <v-stepper-content step="1"></v-stepper-content>
                  <v-stepper-step :complete="e6 > 2" step="2"> Network Type </v-stepper-step>
                  <v-stepper-content step="2"></v-stepper-content>
                  <div v-if="dataNetwork == 'ISOLATED'">
                    <!-- <v-stepper-step :complete="e6 > 3" step="3"> Edge Connection </v-stepper-step>
                    <v-stepper-content step="3"></v-stepper-content> -->
                    <v-stepper-step step="3" :complete="e6 > 3"> General </v-stepper-step>
                    <v-stepper-content step="3"></v-stepper-content>
                    <v-stepper-step step="4" :complete="e6 > 4"> Static IP Pools</v-stepper-step>
                    <v-stepper-content step="4"></v-stepper-content>
                    <v-stepper-step step="5" :complete="e6 > 5"> DNS </v-stepper-step>
                    <v-stepper-content step="5"></v-stepper-content>
                    <v-stepper-step step="6"> Ready To Complete </v-stepper-step>
                  </div>
                  <div v-else>
                    <v-stepper-step :complete="e6 > 3" step="3"> Edge Connection </v-stepper-step>
                    <v-stepper-content step="3"></v-stepper-content>
                    <v-stepper-step step="4" :complete="e6 > 4"> General </v-stepper-step>
                    <v-stepper-content step="4"></v-stepper-content>
                    <v-stepper-step step="5" :complete="e6 > 5"> Static IP Pools</v-stepper-step>
                    <v-stepper-content step="5"></v-stepper-content>
                    <v-stepper-step step="6" :complete="e6 > 6"> DNS </v-stepper-step>
                    <v-stepper-content step="6"></v-stepper-content>
                    <v-stepper-step step="7"> Ready To Complete </v-stepper-step>
                  </div>
                </v-stepper>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col md="9">
                <Scope v-if="e6 == 1" :step.sync="e6"></Scope>
                <Network v-if="e6 == 2" :step.sync="e6" @get-data="getNetwork($event)"></Network>
                <div v-if="dataNetwork == 'ISOLATED'">
                  <!-- <Edge v-if="e6 == 3" :step.sync="e6" @get-data="getEdge($event)" :connect="dataEdge"></Edge> -->
                  <General
                    v-if="e6 == 3"
                    :step.sync="e6"
                    @get-data="getGeneral($event)"
                    :name="dataGeneral.generalName"
                    :desc="dataGeneral.generalDesc"
                    :cidr="dataGeneral.generalGatewayCidr"
                  ></General>
                  <Static v-if="e6 == 4" :step.sync="e6" :gateway="generalGateway" @get-data="getStatic($event)" :static="dataStatic"></Static>
                  <Dns v-if="e6 == 5" :step.sync="e6" :gateway="ipGeteway" @get-data="getDns($event)"></Dns>
                  <Complete
                    v-if="e6 == 6"
                    :step.sync="e6"
                    :data-static="dataStatic"
                    :data-dns="dataDns"
                    :data-scope="dataScope"
                    :data-network="dataNetwork"
                    :data-edge="dataEdge"
                    :data-general="dataGeneral"
                    @get-data="getClear()"
                  ></Complete>
                </div>
                <div v-else>
                  <Edge v-if="e6 == 3" :step.sync="e6" @get-data="getEdge($event)" :connect="dataEdge"></Edge>
                  <General
                    v-if="e6 == 4"
                    :step.sync="e6"
                    @get-data="getGeneral($event)"
                    :name="dataGeneral.generalName"
                    :desc="dataGeneral.generalDesc"
                    :cidr="dataGeneral.generalGatewayCidr"
                  ></General>
                  <Static v-if="e6 == 5" :step.sync="e6" :gateway="generalGateway" @get-data="getStatic($event)" :static="dataStatic"></Static>
                  <Dns v-if="e6 == 6" :step.sync="e6" :gateway="ipGeteway" @get-data="getDns($event)" :data-network="dataNetwork"></Dns>
                  <Complete
                    v-if="e6 == 7"
                    :step.sync="e6"
                    :data-static="dataStatic"
                    :data-dns="dataDns"
                    :data-scope="dataScope"
                    :data-network="dataNetwork"
                    :data-edge="dataEdge"
                    :data-general="dataGeneral"
                    @get-data="getClear()"
                  ></Complete>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import Scope from "./step/scope.vue";
import Network from "./step/network.vue";
import Edge from "./step/edge.vue";
import General from "./step/general.vue";
import Static from "./step/static.vue";
import Dns from "./step/dns.vue";
import Complete from "./step/complete.vue";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPNETWORK } from "../namespace";

export default {
  components: {
    Scope,
    Network,
    Edge,
    General,
    Static,
    Dns,
    Complete,
  },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { refresh, getDetailInstance, getEdgeConnection } = useNamespacedActions(DPNETWORK, ["refresh", "getDetailInstance", "getEdgeConnection"]);
    onMounted(() => {
      const params = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      setInterval(() => {
        const deka = localStorage.getItem("dekaPrime");
        if (deka) {
          refresh();
        } else {
          return;
        }
      }, 1000 * 60 * 5);
      refresh();
      getDetailInstance(params.vmwareProjectId);
    });

    const generalGateway = ref("");
    const dataStatic = ref([]);
    const dataDns = ref({});
    const dataScope = ref({});
    const dataNetwork = ref("");
    const dataEdge = ref({});
    const dataGeneral = ref({});
    const ipGeteway = ref("");

    const e6 = ref(1);

    const getStatic = (data) => {
      dataStatic.value = data;
    };
    const getDns = (data) => {
      dataDns.value = data;
    };
    const getScope = (data) => {
      dataScope.value = data;
    };
    const getNetwork = (data) => {
      dataNetwork.value = data;
    };
    const getEdge = (data) => {
      dataEdge.value = data;
    };
    const getGeneral = (data) => {
      dataGeneral.value = data;
      generalGateway.value = data.generalGatewayCidr;
      ipGeteway.value = data.generalGatewayIp;
    };
    const getClear = () => {
      dataStatic.value = [];
      dataDns.value = {};
      dataScope.value = {};
      dataNetwork.value = "";
      dataEdge.value = {};
      dataGeneral.value = {};
    };
    return {
      e6,
      getStatic,
      getDns,
      getNetwork,
      getScope,
      getEdge,
      getGeneral,
      getClear,
      dataStatic,
      dataDns,
      dataEdge,
      dataGeneral,
      dataScope,
      generalGateway,
      dataNetwork,
      ipGeteway,
      // detailInstance
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-sheet.v-stepper:not(.v-sheet--outlined) {
  box-shadow: none;
}
</style>
