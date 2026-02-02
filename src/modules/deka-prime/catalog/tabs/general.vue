<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-0">
        <v-card class="rounded-lg" flat>
          <div class="d-flex justify-center pa-7" v-if="loadingCatalog">
            <v-progress-circular :size="90" color="primary" indeterminate></v-progress-circular>
          </div>
          <v-container fluid class="pt-0" v-else>
            <v-row>
              <v-col cols="12">
                <v-card class="rounded-lg" flat>
                  <v-container v-if="Object.keys(detailCatalog).length == 0">
                    <v-card class="mt-9 bs">
                      <v-card-text class="font-weight-bold d-flex justify-center bd"> No data available </v-card-text>
                    </v-card>
                  </v-container>
                  <v-container fluid class="px-7 py-4" v-else>
                    <br />
                    <div class="bor-table mb-5">
                      <v-row class="ma-0">
                        <v-col>Name</v-col>
                        <v-col>{{ detailCatalog.Name }}</v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-row class="ma-0">
                        <v-col>Description</v-col>
                        <v-col>{{ detailCatalog.Description || "-" }}</v-col>
                      </v-row>
                    </div>
                    <div class="bor-table mb-5">
                      <v-row class="ma-0">
                        <v-col>Version</v-col>
                        <v-col>{{ detailCatalog.VersionNumber }}</v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-row class="ma-0">
                        <v-col>Status</v-col>
                        <v-col>Ready</v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-row class="ma-0">
                        <v-col>Created On</v-col>
                        <v-col>{{ $FormatDate(detailCatalog.DateCreated) }}</v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-row class="ma-0">
                        <v-col>vApps Templates</v-col>
                        <v-col>-</v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-row class="ma-0">
                        <v-col>Media & Other</v-col>
                        <v-col>-</v-col>
                      </v-row>
                    </div>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useNamespacedGetters } from "vuex-composition-helpers";
import { CATALOG } from "../namespace";

// import { ref, onMounted } from "@vue/composition-api";
export default {
  setup(props, context) {
    const { detailCatalog, loadingCatalog } = useNamespacedGetters(CATALOG, ["detailCatalog", "loadingCatalog"]);
    return {
      detailCatalog,
      loadingCatalog,
    };
  },
};
</script>

<style lang="scss" scoped>
.bor-table {
  border: 1px solid rgb(2 0 0 / 12%);
}

.bd {
  border: solid 1px #1f60a8;
}

.bs {
  box-shadow: none !important;
}
</style>
