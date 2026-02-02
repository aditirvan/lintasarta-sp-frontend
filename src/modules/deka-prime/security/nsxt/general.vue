<template>
  <div>
    <v-card class="rounded-lg" flat>
      <div class="d-flex justify-center" v-if="!detailAllEdgeNsxt">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div>
      <v-container fluid class="px-7 py-4" v-else>
        <br />
        <v-card class="rounded-lg mt-4 mb-4" flat>
          <v-expansion-panels v-model="panel">
            <v-expansion-panel>
              <v-expansion-panel-header color="#f1f2f2">General</v-expansion-panel-header>
              <div :style="hide == true ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Name </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ detailAllEdgeNsxt.name }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Status </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ detailAllEdgeNsxt.status }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Description </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ detailAllEdgeNsxt.description || "-" }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Allow Non-Distributed Routing </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content>
                      {{ detailAllEdgeNsxt.nonDistributedRoutingEnabled == true ? "Yes" : "No" }}
                    </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Type </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ detailAllEdgeNsxt && detailAllEdgeNsxt.gatewayBacking && detailAllEdgeNsxt.gatewayBacking.gatewayType == 'NSXT_BACKED' ? 'NSX-T' : detailAllEdgeNsxt && detailAllEdgeNsxt.gatewayBacking && detailAllEdgeNsxt.gatewayBacking.gatewayType}} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Connected </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content class="capital">
                      {{ detailAllEdgeNsxt && detailAllEdgeNsxt.edgeGatewayUplinks && detailAllEdgeNsxt.edgeGatewayUplinks[0].connected ? 'Yes' : 'No' }}
                    </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Using Dedicated Provider Router </v-expansion-panel-content></v-col
                  ><v-col md="6"><v-expansion-panel-content> {{ detailAllEdgeNsxt && detailAllEdgeNsxt.edgeGatewayUplinks && detailAllEdgeNsxt.edgeGatewayUplinks[0].dedicated ? 'Yes' : 'No' }} </v-expansion-panel-content></v-col>
                </v-row>
                <v-divider></v-divider>
              </div>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

        <v-card class="rounded-lg mt-4 mb-4" flat>
          <v-expansion-panels v-model="panel1">
            <v-expansion-panel>
              <v-expansion-panel-header color="#f1f2f2">Scope</v-expansion-panel-header>
              <div :style="hide1 == true ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Organization Virtual Data Center </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ orgVdc.name }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Organization </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ orgRef.name }}</v-expansion-panel-content></v-col
                  >
                </v-row>
              </div>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
import { useNamespacedGetters } from "vuex-composition-helpers";
import { DPSECURITY } from "../namespace";

export default {
  // orgVdc: Object;
  // orgRef: Object;
  setup() {
    const { detailAllEdgeNsxt, dataVdcEdge, orgVdc, orgRef, setLoadFirewall } = useNamespacedGetters(DPSECURITY, [
      "detailAllEdgeNsxt",
      "dataVdcEdge",
      "orgVdc",
      "orgRef",
      "setLoadFirewall",
    ]);
    const panel = ref(0);
    const panel1 = ref(0);
    const hide = computed(() => {
      return Number.isInteger(panel.value);
    });
    const hide1 = computed(() => {
      return Number.isInteger(panel1.value);
    });

    const edgeGateway = computed(() => {
      return detailAllEdgeNsxt.value.Configuration?.GatewayBackingConfig;
    });
    return {
      panel,
      hide,
      panel1,
      hide1,
      detailAllEdgeNsxt,
      dataVdcEdge,
      orgRef,
      orgVdc,
      setLoadFirewall,
      edgeGateway,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
}
::v-deep .v-application {
  line-height: 0;
}

.capital {
  text-transform: capitalize;
}
</style>
