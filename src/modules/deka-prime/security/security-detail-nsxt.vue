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
                <v-tabs class="mb-6">
                  <v-tab class="fz-12 firewall-title" :to="`/dp-security/detail/${$route.params.name}/${$route.params.idVdc}/${$route.params.idEdge}/general`">General</v-tab>
                  <v-tab class="fz-12 firewall-title" :to="`/dp-security/detail/${$route.params.name}/${$route.params.idVdc}/${$route.params.idEdge}/firewall`">Firewall</v-tab>
                  <v-tab class="fz-12 firewall-title" :to="`/dp-security/detail/${$route.params.name}/${$route.params.idVdc}/${$route.params.idEdge}/nat`">NAT</v-tab>
                  <v-tab class="fz-12 firewall-title" :to="`/dp-security/detail/${$route.params.name}/${$route.params.idVdc}/${$route.params.idEdge}/ipset`">IP Set</v-tab>
                </v-tabs>
              </template>
              <v-row class="pb-0"> </v-row>
              <v-tabs-items v-model="$route.path" class="mb-6">
                <v-tab-item :value="`/dp-security/detail/${$route.params.name}/${$route.params.idVdc}/${$route.params.idEdge}/general`">
                  <v-card flat>
                    <router-view></router-view>
                  </v-card>
                </v-tab-item>
                <v-tab-item :value="`/dp-security/detail/${$route.params.name}/${$route.params.idVdc}/${$route.params.idEdge}/firewall`">
                  <v-card flat>
                    <router-view></router-view>
                  </v-card>
                </v-tab-item>
                <v-tab-item :value="`/dp-security/detail/${$route.params.name}/${$route.params.idVdc}/${$route.params.idEdge}/nat`">
                  <v-card flat>
                    <router-view></router-view>
                  </v-card>
                </v-tab-item>
                <v-tab-item :value="`/dp-security/detail/${$route.params.name}/${$route.params.idVdc}/${$route.params.idEdge}/ipset`">
                  <v-card flat>
                    <router-view></router-view>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>

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
  },
  setup(props, context) {
    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);
    const { getAllDetailEdgeNsxt, getVdcEdge, getListNatRuleNsxv, getListFirewallRuleNsxv, getListStaticRouteNsxv } = useNamespacedActions(DPSECURITY, [
      "getAllDetailEdgeNsxt",
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
      await getAllDetailEdgeNsxt(params);
      await getVdcEdge(params.idVdc);
    //   await getListFirewallRuleNsxv(params.idEdge);
    //   await getListNatRuleNsxv(params.idEdge);
    //   await getListStaticRouteNsxv(params.idEdge);
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
