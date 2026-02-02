<template>
  <div>
    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="12" class="pt-0 pb-0"
          ><p class="font-weight-bold fz-16">Scope</p>
          <v-radio-group v-model="radioScope">
            <v-radio label="Organization Virtual Data Center" :value="radioScope"></v-radio>
          </v-radio-group>
          <p class="ml-9">Provides connectivity for VMs in the selected VDC only</p>
        </v-col>
      </v-row>
    </v-card-text>

    <br />
    <br />
    <br />
    <br />
    <br />

    <v-card-text class="mt-15">
      <v-row class="d-flex justify-end">
        <v-col cols="3">
          <router-link to="/networking"> <v-btn color="#a5b3bf" class="white--text fz-16" height="40" block> Cancel </v-btn></router-link>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3" v-if="step > 1">
          <v-btn class="fz-16" color="secondary" block outlined height="40" @click="prev()"> Previous </v-btn>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3" v-if="step <= 6">
          <v-btn class="white--text fz-16" color="secondary" block height="40" @click="next()"> Next </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { VDC } from "@/modules/deka-prime/vdc/namespace";
import { ref } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPNETWORK } from "../../namespace";
export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const { listVdc } = useNamespacedGetters(VDC, ["listVdc"]);
    const { getEdgeConnection } = useNamespacedActions(DPNETWORK, ["getEdgeConnection"]);
    const { detailInstance } = useNamespacedGetters(DPNETWORK, ["detailInstance"]);
    const radioScope = ref(true);
    const radioTable = ref(false);
    const scope = ref("");
    const site = ref("");

    const headers = ref([
      { text: "", value: "no", sortable: false },
      { text: "Name", value: "Name", sortable: false },
      { text: "Allocation Model", value: "AllocationModel", sortable: false },
      { text: "Organization", value: "OrgName", sortable: false },
    ]);
    const model = ref([
      { id: "1", name: "Pay-As-You-Go" },
      { id: "2", name: "Allocation Pool" },
    ]);
    const getModel = (raw) => {
      if (raw == "1") {
        return "Pay-As-You-Go";
      } else if (raw == "2") {
        return "Allocation Pool";
      } else {
        return raw;
      }
    };
    const next = () => {
      getEdgeConnection(detailInstance.value.Name);
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    const getRow = (row) => {
      const string = row.HREF;
      const pattern = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      const hasil = string.match(pattern);
      site.value = hasil[3];
      scope.value = row.Name;
      getEdgeConnection(row.Name);
    };

    return {
      headers,
      listVdc,
      radioScope,
      getModel,
      model,
      radioTable,
      getRow,
      scope,
      site,
      next,
      prev,
      detailInstance,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-messages {
  display: none !important;
}
</style>
