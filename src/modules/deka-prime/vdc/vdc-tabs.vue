<template>
  <div>
    <v-row>
      <v-col cols="12" class="pa-0">
        <v-card class="rounded-lg elevation-0" flat>
          <v-container fluid class="px-7 py-4">
            <virtualMachine></virtualMachine>
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
import virtualMachine from "./virtual-machine.vue";
import Vapps from "./vapps.vue";
import { DPNETWORK } from "../networking/namespace";

export default {
  components: {
    virtualMachine,
    Vapps,
  },
  setup(props, context) {
    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);
    const { getListVm, getListTemplateVm, getListStorage, getDialogPermissionDekaPrime } = useNamespacedActions(VDC, [
      "getListVm",
      "getListTemplateVm",
      "getListStorage",
      "getDialogPermissionDekaPrime",
    ]);

    onMounted(() => {
      const params = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      const deka = localStorage.getItem("dekaPrime");
      if (!deka) {
        getDialogPermissionDekaPrime();
      } else {
        const payload = {
          vdc_id: params.vmwareProjectId,
          org_id: params.vmwareOrganizationId,
        };
        getListVm(params.vmwareProjectId);
        getListTemplateVm();
        getListStorage(payload);
        refresh();
        setInterval(() => {
          const deka = localStorage.getItem("dekaPrime");
          if (deka) {
            refresh();
          } else {
            return;
          }
        }, 1000 * 60 * 5);
      }
    });

    const tab = ref("");
    return {
      tab,
      getListVm,
      getListTemplateVm,
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
