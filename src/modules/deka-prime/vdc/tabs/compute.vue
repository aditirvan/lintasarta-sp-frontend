<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 pt-0">
            <br />
            <div class="bor-table mb-5">
              <v-row class="ma-0">
                <v-col>Placement Policy</v-col>
                <v-col>{{ detailVm.ComputePolicy.VmPlacementPolicy || "-" }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Sizing Policy</v-col>
                <v-col>{{ detailVm.ComputePolicy.VmSizingPolicy.Name }}</v-col>
              </v-row>
            </div>
            <br />
            <v-card class="rounded-lg mt-4 mb-4" flat>
              <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                  <v-expansion-panel-header color="#f1f2f2">CPU</v-expansion-panel-header>
                  <div :style="hide == true ? '' : 'display: none'">
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Number of virtual CPUs </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content> {{ detailVm.VmSpecSection.NumCpus }} </v-expansion-panel-content></v-col
                      >
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Core per socket </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content> {{ detailVm.VmSpecSection.NumCoresPerSocket }} </v-expansion-panel-content></v-col
                      >
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Number of socket </v-expansion-panel-content></v-col
                      ><v-col md="6"><v-expansion-panel-content> - </v-expansion-panel-content></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Virtual CPU hot add </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content>
                          {{ detailVm.VMCapabilities.CPUHotAddEnabled == false ? "Disabled" : "Enabled" }}
                        </v-expansion-panel-content></v-col
                      >
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"
                        ><v-expansion-panel-content> Expose hardware-assisted CPU virtualization to guest OS </v-expansion-panel-content></v-col
                      ><v-col md="6"><v-expansion-panel-content> - </v-expansion-panel-content></v-col>
                    </v-row>
                  </div>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
            <br />
            <v-card class="rounded-lg mt-4 mb-4" flat>
              <v-expansion-panels v-model="panel1">
                <v-expansion-panel>
                  <v-expansion-panel-header color="#f1f2f2">Memory</v-expansion-panel-header>
                  <div :style="hide1 == true ? '' : 'display: none'">
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Memory </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content>
                          {{ formatSize(detailVm.VmSpecSection.MemoryResourceMb.Configured) }}
                        </v-expansion-panel-content></v-col
                      >
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Memory hot add </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content
                          >{{ detailVm.VMCapabilities.MemoryHotAddEnabled == false ? "Disabled" : "Enabled" }}
                        </v-expansion-panel-content></v-col
                      >
                    </v-row>
                  </div>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { ref, computed } from "@vue/composition-api";
import { VDC } from "../namespace";
export default {
  setup() {
    const { detailVm } = useNamespacedGetters(VDC, ["detailVm"]);
    const formatSize = (bytes, decimals = 1) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };
    const panel = ref(0);
    const panel1 = ref(0);
    const hide = computed(() => {
      return Number.isInteger(panel.value);
    });
    const hide1 = computed(() => {
      return Number.isInteger(panel1.value);
    });
    return {
      detailVm,
      formatSize,
      panel,
      panel1,
      hide,
      hide1,
    };
  },
};
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center !important;
}
.bor-table {
  border: 1px solid rgb(2 0 0 / 12%);
}
</style>
