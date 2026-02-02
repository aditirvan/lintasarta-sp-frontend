<template>
  <div>
    <v-card class="rounded-lg mt-4 mb-4" flat>
      <v-expansion-panels v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header color="#f1f2f2">Overview</v-expansion-panel-header>
          <div :style="hide == true ? '' : 'display: none'">
            <v-row>
              <v-col md="6"
                ><v-expansion-panel-content>
                  Architecture
                </v-expansion-panel-content></v-col
              ><v-col md="6"
                ><v-expansion-panel-content>
                  {{ tableOverview.architecture }}
                </v-expansion-panel-content></v-col
              >
            </v-row>
            <v-row>
              <v-col md="6"
                ><v-expansion-panel-content>
                  Author
                </v-expansion-panel-content></v-col
              ><v-col md="6"
                ><v-expansion-panel-content>
                  {{ tableOverview.author }}
                </v-expansion-panel-content></v-col
              >
            </v-row>
            <v-row>
              <v-col md="6"
                ><v-expansion-panel-content>
                  Config
                </v-expansion-panel-content></v-col
              ><v-col md="6"
                ><v-expansion-panel-content>
                  {{ tableOverview.config }}
                </v-expansion-panel-content></v-col
              >
            </v-row>
            <v-row>
              <v-col md="6"
                ><v-expansion-panel-content>
                  Created
                </v-expansion-panel-content></v-col
              ><v-col md="6"
                ><v-expansion-panel-content>
                  {{ formatDate(tableOverview.created) }}
                </v-expansion-panel-content></v-col
              >
            </v-row>
            <v-row>
              <v-col md="6"
                ><v-expansion-panel-content>
                  Os
                </v-expansion-panel-content></v-col
              ><v-col md="6"
                ><v-expansion-panel-content>
                  {{ tableOverview.os }}
                </v-expansion-panel-content></v-col
              >
            </v-row>
          </div>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
import { useNamespacedGetters } from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";
import moment from "moment";
export default {
  setup() {
    const { tableOverview } = useNamespacedGetters(REGISTRY, ["tableOverview"]);
    const hide = computed(() => {
      return Number.isInteger(panel.value);
    });
    const panel = ref(0);
    const formatDate = (date) => {
      return moment(date).format("l, LT");
    };
    return {
      panel,
      tableOverview,
      formatDate,
      hide,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>