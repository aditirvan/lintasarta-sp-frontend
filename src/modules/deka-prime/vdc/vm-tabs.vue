<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9" class="pt-0">
                <!-- <v-icon class="mr-3">mdi-vector-combine</v-icon>{{ $route.params.name }} -->
                <v-row>
                  <v-col class="firewall-title">
                    <v-row class="d-flex flex-row ml-2">
                      <v-col class="flex-grow-0 pa-0"
                        ><v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon :color="detail.Status == 'POWERED_ON' ? 'primary' : 'error'" large v-bind="attrs" v-on="on">mdi-circle</v-icon>
                          </template>
                          <span>{{ detail.Status == "POWERED_OFF" ? "Shutoff" : "Active" }}</span>
                        </v-tooltip></v-col
                      >
                      <v-col class="py-0 flex-grow-1">{{ $route.params.name }}</v-col>
                    </v-row>
                  </v-col>
                  <!-- <v-col cols="4"
                    ><v-row>
                      <v-col cols="4" @click="onPower()"
                        ><v-btn class="mr-2 primary--text bs" :disabled="detail.Status == 'POWERED_ON'" :loading="loadingOn">POWERED ON</v-btn></v-col
                      >
                      <v-col cols="4" @click="offPower()"
                        ><v-btn class="primary--text bs" :disabled="detail.Status == 'POWERED_OFF'" :loading="loadingOff">POWERED OFF</v-btn></v-col
                      >
                    </v-row></v-col
                  > -->
                </v-row>
              </v-col>
            </v-row>
            <v-card class="rounded-lg mt-4 mb-4" flat outlined>
              <template>
                <v-tabs v-model="tab" class="mb-6">
                  <v-tab class="fz-12 firewall-title">General</v-tab>
                  <v-tab class="fz-12 firewall-title">Removable Media</v-tab>
                  <v-tab class="fz-12 firewall-title">Hard Disk</v-tab>
                  <v-tab class="fz-12 firewall-title">Compute</v-tab>
                  <v-tab class="fz-12 firewall-title">NICs</v-tab>
                  <v-tab class="fz-12 firewall-title">Guest OS</v-tab>
                  <v-tab class="fz-12 firewall-title">Guest Properties</v-tab>
                  <v-tab class="fz-12 firewall-title">Monitoring Chart</v-tab>
                  <v-tab class="fz-12 firewall-title">Sharing</v-tab>
                  <v-tab class="fz-12 firewall-title">Monitor Tasks</v-tab>
                  <v-tab class="fz-12 firewall-title">Monitor Events</v-tab>
                </v-tabs>
              </template>

              <v-tabs-items v-model="tab" class="mb-6">
                <v-tab-item>
                  <v-card flat>
                    <General></General>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <RemovableMedia></RemovableMedia>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <Harddisks></Harddisks>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <Compute></Compute>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <Nics></Nics>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <GuestOs></GuestOs>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <GuestProperties></GuestProperties>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <MonitorChart></MonitorChart>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <Sharing></Sharing>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <MonitorTask></MonitorTask>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <MonitorEvents></MonitorEvents>
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
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { VDC } from "./namespace";
import General from "./vm-detail.vue";
import Nics from "./tabs/nics.vue";
import RemovableMedia from "./tabs/removable-media.vue";
import Harddisks from "./tabs/harddisk.vue";
import Compute from "./tabs/compute.vue";
import GuestOs from "./tabs/guest-os.vue";
import MonitorTask from "./tabs/monitor-task.vue";
import MonitorEvents from "./tabs/monitor-events.vue";
import Sharing from "./tabs/sharing.vue";
import MonitorChart from "./tabs/monitor-chart.vue";
import GuestProperties from "./tabs/guest-properties.vue";
import { DPNETWORK } from "../networking/namespace";

export default {
  components: {
    General,
    Nics,
    RemovableMedia,
    Harddisks,
    Compute,
    GuestOs,
    MonitorTask,
    MonitorEvents,
    Sharing,
    MonitorChart,
    GuestProperties,
  },
  setup(props, context) {
    const { getDetailVm, powerOff, powerOn } = useNamespacedActions(VDC, ["getDetailVm", "powerOn", "powerOff"]);
    const { detailVm, loadingOff, loadingOn } = useNamespacedGetters(VDC, ["detailVm", "loadingOff", "loadingOn"]);
    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);
    onMounted(() => {
      const payload = {
        id_vdc: context.root.$route.params.id,
        id_vapp: context.root.$route.params.id_vapp,
        id_vm: context.root.$route.params.id_vm,
      };
      getDetailVm(payload);
      
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
    const tab = ref("");
    const detail = ref(JSON.parse(localStorage.getItem("dataVM") || "{}"));
    const onPower = () => {
      const payload = {
        id_vdc: context.root.$route.params.id,
        id_vapp: context.root.$route.params.id_vapp,
        id_vm: context.root.$route.params.id_vm,
        action: false,
      };
      powerOn(payload);
    };
    const offPower = () => {
      const payload = {
        id_vdc: context.root.$route.params.id,
        id_vapp: context.root.$route.params.id_vapp,
        id_vm: context.root.$route.params.id_vm,
        action: false,
      };
      powerOff(payload);
    };
    return {
      tab,
      detailVm,
      detail,
      offPower,
      onPower,
      loadingOff,
      loadingOn,
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
.bs {
  box-shadow: none;
  background-color: transparent !important;
}
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: transparent !important;
}
</style>
