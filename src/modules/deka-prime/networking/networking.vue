<template>
  <div>
    <v-row>
      <v-col cols="12" class="pa-0">
        <v-card class="rounded-lg elevation-0" flat>
          <v-container fluid class="px-7 py-4">
            <Networks></Networks>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import Networks from "./tabs/networks.vue";
import { useNamespacedActions } from "vuex-composition-helpers";
import { DPNETWORK } from "./namespace";
import { VDC } from "../vdc/namespace";

export default {
  components: {
    Networks,
  },
  setup() {
    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);
    const { getDialogPermissionDekaPrime } = useNamespacedActions(VDC, ["getDialogPermissionDekaPrime"]);

    onMounted(() => {
      const prime = localStorage.getItem("dekaPrime");
      if (!prime) {
        getDialogPermissionDekaPrime();
      } else {
        setInterval(() => {
          const deka = localStorage.getItem("dekaPrime");
          if (deka) {
            refresh();
          } else {
            return;
          }
        }, 1000 * 60 * 5);
        refresh();
      }
    });
    const tab = ref("");
    return {
      tab,
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
