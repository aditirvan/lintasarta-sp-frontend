<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row class="d-flex justify-center"
              ><v-col>
                <div class="headline font-weight-bold font--text mb-2">List Network</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-data-table :headers="headers" :items="listNetwork" item-key="id" single-line class="elevation-0" hide-default-footer
                  ><template #[`item.ipNetwork`]="{ item }">
                    <span>{{ item.ipNetwork }}</span>
                  </template>
                </v-data-table>
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
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { DEKAROCK } from "./namespace";
export default {
  setup(props, context) {
    const { openshift_detail } = useNamespacedState(DEKAROCK, ["openshift_detail"]);
    const headers = ref([{ text: "IP Network", value: "ipNetwork", sortable: false }]);
    const listNetwork = ref([{ ipNetwork: `${openshift_detail.value.network_ip}/${openshift_detail.value.prefix_subnet}` }]);

    return {
      headers,
      listNetwork,
      openshift_detail,
    };
  },
};
</script>

<style lang="scss" scoped></style>
