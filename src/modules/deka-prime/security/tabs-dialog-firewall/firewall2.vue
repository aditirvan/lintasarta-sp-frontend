<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn class="secondary" depressed>Create Firewall</v-btn>
              </v-col>
            </v-row>
            <br />
            <v-data-table :headers="headers" :items="listRuleFirewallNsxv" class="elevation-0" hide-default-footer disable-pagination>
              <template #[`item.name`]="{ item }">
                <span class="primary--text cursor-pointer" @click="getDetail(item)">{{ item.name }}</span>
              </template>
              <template #[`item.action`]="{ item }">
                <v-row>
                  <v-col class="pa-0 primary--text cursor-pointer" @click="getDetail(item)">Edit</v-col>
                  <v-col class="pa-0 red--text cursor-pointer" @click="getDetail(item)">Delete</v-col>
                </v-row>
              </template></v-data-table
            >
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPSECURITY } from "../namespace";
export default {
  setup() {
    const { listRuleFirewallNsxv } = useNamespacedGetters(DPSECURITY, ["listRuleFirewallNsxv"]);
    const headers = ref([
      { text: "Name", value: "name" },
      { text: "Applied to", value: "apply" },
      { text: "Rules", value: "rule" },
      { text: "Action", sortable: false, align: "center", value: "action" },
    ]);
    const getDetail = (item) => {
      console.log("item", item);
    };
    return {
      headers,
      listRuleFirewallNsxv,
      getDetail,
    };
  },
};
</script>

<style lang="scss">
.firewall-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
</style>
