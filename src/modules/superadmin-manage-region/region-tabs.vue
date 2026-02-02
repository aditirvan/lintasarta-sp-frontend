<template>
  <div>
    <v-col cols="12">
      <v-card class="rounded-lg" flat>
        <v-container fluid class="px-7 py-4">
          <v-card class="rounded-lg mt-4 mb-4" flat outlined>
            <template>
              <v-tabs v-model="tab" class="mb-6">
                <v-tab class="fz-14 firewall-title" to="/manage-region/deka-flexi">Deka Flexi</v-tab>
                <v-tab class="fz-14 firewall-title" to="/manage-region/deka-box">Deka Box</v-tab>
              </v-tabs>
            </template>

            <v-tabs-items v-model="$route.path" class="mb-6">
              <v-tab-item value="/manage-region/deka-flexi">
                <v-card flat>
                  <DekaFlexi></DekaFlexi>
                </v-card>
              </v-tab-item>
              <v-tab-item value="/manage-region/deka-box">
                <v-card flat>
                  <DekaBox></DekaBox>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-container>
      </v-card>
    </v-col>
  </div>
</template>

<script>
import DekaFlexi from "./region-deka-flexi/region.vue";
import DekaBox from "./region-deka-box/region.vue";
import { ref } from "@vue/composition-api";
export default {
  components: {
    DekaFlexi,
    DekaBox,
  },
  setup() {
    const tab = ref(null);
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
