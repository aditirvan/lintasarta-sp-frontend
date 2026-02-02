<template>
  <v-card flat outlined class="rounded-lg mt-4">
    <v-col class="ml-2"><h3>Cloudeka Nameserver</h3></v-col>

    <div class="ml-6 mr-2">
      To use Cloudeka, ensure your authoritative DNS server, or nameservers have
      been changed. These are you assigned Cloudeka nameservers.
    </div>

    <v-row>
      <v-col class="ml-2">
        <v-data-table
          :headers="headerNameservers"
          :items="listNameservers"
          item-key="id"
          :items-per-page="10"
          class="elevation-0"
          hide-default-footer
        >
          <template #[`item.id`]="{ item }">
            {{ listNameservers.indexOf(item) + 1 }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { ref } from "@vue/composition-api";
import {
  useNamespacedGetters,
  useNamespacedActions,
} from "vuex-composition-helpers";
export default {
  created() {
    this.getListNameservers();
  },
  setup() {
    const { listNameservers } = useNamespacedGetters("DNS", [
      "listNameservers",
    ]);
    const { getListNameservers } = useNamespacedActions("DNS", [
      "getListNameservers",
    ]);
    const headerNameservers = ref([
      { text: "No", value: "id" },
      { text: "Type", value: "type", sortable: false },
      { text: "Name", value: "name", sortable: false },
    ]);
    return {
      headerNameservers,
      getListNameservers,
      listNameservers,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>