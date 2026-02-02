<template>
  <div>
    <v-card class="rounded-lg" flat>
      <div class="d-flex justify-center pa-7" v-if="loadingObject">
        <v-progress-circular :size="90" color="primary" indeterminate></v-progress-circular>
      </div>

      <v-container fluid class="px-7 py-4" v-else>
        <v-row>
          <v-col cols="9">
            <div class="firewall-title">General {{ detailNetwork.name }}</div>
          </v-col>
        </v-row>
        <br />
        <v-row
          ><v-col md="3"
            ><v-btn
              block
              color="secondary"
              dark
              v-if="!read_only"
              @click="
                () => {
                  openDialog = true;
                }
              "
              >Edit</v-btn
            ></v-col
          ></v-row
        >
        <v-card class="rounded-lg mt-4 mb-4" flat>
          <v-expansion-panels v-model="panel">
            <v-expansion-panel>
              <v-expansion-panel-header color="#f1f2f2">General</v-expansion-panel-header>
              <div :style="hide == true ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Name </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ detailNetwork.name }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Description </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ detailNetwork.description || "-" }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Gateway CIDR </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content>
                      {{ detailSubnets.gateway || "-" }}
                    </v-expansion-panel-content></v-col
                  >
                  <!-- {{ detailSubnets.gateway ? `${detailSubnets.gateway}/${detailSubnets.prefixLength}` : "-" || "-" }} -->
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Network Type </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ detailNetwork.networkType == "NAT_ROUTED" ? "Routed" : "Isolated" }}</v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Backing Type </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ detailNetwork.backingNetworkType || "-" }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Connected To </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ connectionRef.name || "-" }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Connection Type </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ detailConnection.connectionType || "-" }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Shared </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ detailNetwork.shared == false ? "Disabled" : "Enabled" }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Guest VLAN Allowed </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content>
                      {{ detailNetwork.guestVlanTaggingAllowed == false ? "Disabled" : "Enabled" }}
                    </v-expansion-panel-content></v-col
                  >
                </v-row>
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
                    ><v-expansion-panel-content> {{ detailVdc.name }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Organization </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ detailOrg.name }} </v-expansion-panel-content></v-col
                  >
                </v-row>
              </div>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-container>
    </v-card>
    <DialogEditNetwork :dialog.sync="openDialog" :data-connect="detailVdc.name" v-if="openDialog == true"></DialogEditNetwork>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import DialogEditNetwork from "../dialog/dialog-edit-network.vue";
import { DPNETWORK } from "../namespace";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    DialogEditNetwork,
  },
  setup(props, context) {
    const { getDetailNetwork, refresh, getEdgeConnection } = useNamespacedActions(DPNETWORK, ["getDetailNetwork", "refresh", "getEdgeConnection"]);
    const { detailNetwork, detailOrg, detailVdc, detailSubnets, loadingObject, detailConnection, connectionRef, edgeConnection } = useNamespacedGetters(
      DPNETWORK,
      ["detailNetwork", "detailOrg", "detailVdc", "detailSubnets", "loadingObject", "detailConnection", "connectionRef", "edgeConnection"]
    );
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Network'));
    onMounted(() => {
      getDetailNetwork(context.root.$route.params.id);
      setTimeout(() => {
        getEdgeConnection(detailVdc.value.name);
      }, 1000);

      setInterval(() => {
        const deka = localStorage.getItem("dekaPrime");
        if (deka) {
          refresh();
        } else {
          return;
        }
      }, 1000 * 60 * 5);
      refresh();
    });
    const panel = ref(0);
    const panel1 = ref(0);
    const openDialog = ref(false);
    const hide = computed(() => {
      return Number.isInteger(panel.value);
    });
    const hide1 = computed(() => {
      return Number.isInteger(panel1.value);
    });
    return {
      panel,
      hide,
      panel1,
      hide1,
      openDialog,
      detailNetwork,
      detailOrg,
      detailSubnets,
      detailVdc,
      loadingObject,
      detailConnection,
      connectionRef,
      edgeConnection,
      read_only,
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
</style>
