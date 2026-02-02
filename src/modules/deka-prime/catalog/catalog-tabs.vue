<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title">Catalog Detail</div>
              </v-col>
            </v-row>
            <br />
            <v-card class="rounded-lg mt-4 mb-4" flat outlined>
              <template>
                <v-tabs v-model="tab" class="mb-6">
                  <v-tab class="fz-14 firewall-title">General</v-tab>
                  <v-tab class="fz-14 firewall-title">List</v-tab>
                </v-tabs>
              </template>

              <v-tabs-items v-model="tab" class="mb-6">
                <v-tab-item>
                  <v-card flat>
                    <General></General>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <Catalog></Catalog>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPNETWORK } from "../networking/namespace";
import General from "./tabs/general.vue";
import Catalog from "./tabs/catalog.vue";
import { CATALOG } from "./namespace";
import { VDC } from "../vdc/namespace";

export default {
  components: {
    Catalog,
    General,
  },
  setup(props, context) {
    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);
    const { getListCatalog } = useNamespacedActions(CATALOG, ["getListCatalog"]);
    const { getListTemplateVm } = useNamespacedActions(VDC, ["getListTemplateVm"]);

    onMounted(() => {
      // const params = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      setInterval(() => {
        const deka = localStorage.getItem("dekaPrime");
        if (deka) {
          refresh();
        } else {
          return;
        }
      }, 1000 * 60 * 5);
      getListTemplateVm();
      getListCatalog(context.root.$route.params.idCatalog);
      refresh();
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
