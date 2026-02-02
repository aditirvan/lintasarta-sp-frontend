<template>
  <div>
    <v-card class="rounded-lg" flat>
      <v-container fluid class="px-7 py-4">
        <v-row>
          <v-col cols="9">
            <div class="firewall-title">General {{ $route.params.name }}</div>
          </v-col>
        </v-row>
        <br />

        <v-card class="rounded-lg mt-4 mb-4" flat>
          <v-expansion-panels v-model="panel">
            <v-expansion-panel>
              <v-expansion-panel-header color="#f1f2f2">General</v-expansion-panel-header>
              <div :style="hide == true ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Name </v-expansion-panel-content></v-col
                  ><v-col md="6"><v-expansion-panel-content> ITS-development_DRC_EdgeGW </v-expansion-panel-content></v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Description </v-expansion-panel-content></v-col
                  ><v-col md="6"><v-expansion-panel-content> - </v-expansion-panel-content></v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Status </v-expansion-panel-content></v-col
                  ><v-col md="6"><v-expansion-panel-content> Normal </v-expansion-panel-content></v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Distributed Routing </v-expansion-panel-content></v-col
                  ><v-col md="6"><v-expansion-panel-content> Disabled </v-expansion-panel-content></v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> FIPS Mode </v-expansion-panel-content></v-col
                  ><v-col md="6"><v-expansion-panel-content> Disabled </v-expansion-panel-content></v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Edge Gateway Configuration </v-expansion-panel-content></v-col
                  ><v-col md="6"><v-expansion-panel-content> Compact </v-expansion-panel-content></v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> High Availability </v-expansion-panel-content></v-col
                  ><v-col md="6"><v-expansion-panel-content> Disabled </v-expansion-panel-content></v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Syslog Server Settings </v-expansion-panel-content></v-col
                  ><v-col md="6"><v-expansion-panel-content> 172.22.0.190 </v-expansion-panel-content></v-col>
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
                  ><v-col md="6"><v-expansion-panel-content> ITS-development_vDC </v-expansion-panel-content></v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Organization </v-expansion-panel-content></v-col
                  ><v-col md="6"><v-expansion-panel-content> ITS-development </v-expansion-panel-content></v-col>
                </v-row>
                <v-divider></v-divider>
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

export default {
  setup() {
    const panel = ref(0);
    const panel1 = ref(0);
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
