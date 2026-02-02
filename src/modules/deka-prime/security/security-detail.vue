<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title"><v-icon class="mr-3">mdi-vector-combine</v-icon>{{ $route.params.name }}</div>
              </v-col>
            </v-row>
            <br />
            <v-card class="rounded-lg mt-4 mb-4" flat outlined>
              <template>
                <v-tabs v-model="tab" class="mb-6">
                  <v-tab class="fz-12 firewall-title">General</v-tab>
                  <v-tab class="fz-12 firewall-title">External Network</v-tab>
                  <v-tab class="fz-12 firewall-title">Firewall</v-tab>
                  <v-tab class="fz-12 firewall-title">NAT</v-tab>
                  <v-tab class="fz-12 firewall-title">Routing</v-tab>
                </v-tabs>
              </template>
              <v-row class="pb-0"> </v-row>
              <v-tabs-items v-model="tab" class="mb-6">
                <v-tab-item>
                  <v-card flat>
                    <General></General>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <ExternalNetwork />
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <Firewall></Firewall>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <Nat></Nat>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <Routing></Routing>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import { useNamespacedActions } from "vuex-composition-helpers";
import General from "./tabs-security/general.vue";
import ExternalNetwork from "./tabs-security/external-network.vue";
import DialogFirewall from "./dialog-security/dialog-firewall.vue";
import Firewall from "./tabs-dialog-firewall/firewall.vue";
import Nat from "./tabs-dialog-firewall/nat.vue";
import { DPSECURITY } from "./namespace";
import { DPNETWORK } from "../networking/namespace";
import Routing from "./tabs-dialog-firewall/routing.vue";


export default {
  components: {
    General,
    DialogFirewall,
    Firewall,
    Nat,
    Routing,
    ExternalNetwork,
  },
  setup(props, context) {
    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);
    const { getAllDetailEdgeNsxv, getVdcEdge, getListNatRuleNsxv, getListFirewallRuleNsxv, getListStaticRouteNsxv } = useNamespacedActions(DPSECURITY, [
      "getAllDetailEdgeNsxv",
      "getVdcEdge",
      "getListFirewallRuleNsxv",
      "getListNatRuleNsxv",
      "getListStaticRouteNsxv",
    ]);
    onMounted(async () => {
      setInterval(() => {
        const deka = localStorage.getItem("dekaPrime");
        if (deka) {
          refresh();
        } else {
          return;
        }
      }, 1000 * 60 * 5);

      const params = {
        idVdc: context.root.$route.params.idVdc,
        idEdge: context.root.$route.params.idEdge,
      };
      await getAllDetailEdgeNsxv(params);
      await getVdcEdge(params.idVdc);
      await getListFirewallRuleNsxv(params.idEdge);
      await getListNatRuleNsxv(params.idEdge);
      await getListStaticRouteNsxv(params.idEdge);
      await refresh();
    });
    const tab = ref(parseInt(context.root.$route.params.idTab));
    const openDialog = false;
    return {
      tab,
      openDialog,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-item-group.theme--light.v-slide-group.v-tabs-bar.v-tabs-bar--is-mobile.primary--text {
  display: grid;
}

::v-deep .v-slide-group__wrapper {
  height: 71px;
}
</style>
