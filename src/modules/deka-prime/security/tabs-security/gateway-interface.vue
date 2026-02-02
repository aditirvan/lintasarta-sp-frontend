<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 pt-0"
            ><v-data-table
              :headers="headers"
              :items="detailAllEdge.Configuration.GatewayInterfaces.GatewayInterface"
              item-key="id"
              single-line
              class="elevation-0 mt-9"
              hide-default-footer
            >
              <!-- <template #[`item.gateway`]="{ item }">
                <span>{{ item.Name }}</span>
              </template> -->
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { ref } from "@vue/composition-api";
import { DPSECURITY } from "../namespace";
export default {
  setup() {
    const { detailAllEdge } = useNamespacedGetters(DPSECURITY, ["detailAllEdge"]);
    const headers = ref([
      { text: "Gateway", value: "gateway", sortable: false },
      { text: "Subnet", value: "subnet", sortable: false },
      { text: "Default Gateway", value: "default_gateway", sortable: false },
      { text: "Primary IP", value: "primary", sortable: false },
      { text: "External Netwrok", value: "external", sortable: false },
    ]);
    return {
      detailAllEdge,
      headers,
    };
  },
};
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center !important;
}
</style>
