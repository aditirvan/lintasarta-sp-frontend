<template>
  <div>
    <v-col cols="12">
      <v-card class="rounded-lg" flat>
        <v-container fluid class="px-7 py-4">
          <v-card class="rounded-lg mt-4 mb-4" flat outlined>
            <template>
              <v-tabs v-model="tab" class="mb-6">
                <v-tab class="fz-14 firewall-title" to="/manage-pricing/items">Items</v-tab>
                <v-tab class="fz-14 firewall-title" to="/manage-pricing/tags">Tags</v-tab>
                <v-tab class="fz-14 firewall-title" to="/manage-pricing/product">Product</v-tab>
                <v-tab class="fz-14 firewall-title" to="/manage-pricing/activity">Activity</v-tab>
              </v-tabs>
            </template>

            <v-tabs-items v-model="$route.path" class="mb-6">
              <v-tab-item value="/manage-pricing/items">
                <v-card flat>
                  <Items v-if="tab == '/manage-pricing/items'"></Items>
                </v-card>
              </v-tab-item>
              <v-tab-item value="/manage-pricing/tags">
                <v-card flat>
                  <Tags v-if="tab == '/manage-pricing/tags'"></Tags>
                </v-card>
              </v-tab-item>
              <v-tab-item value="/manage-pricing/product">
                <v-card flat>
                  <Product v-if="tab == '/manage-pricing/product'"></Product>
                </v-card>
              </v-tab-item>
              <v-tab-item value="/manage-pricing/activity">
                <v-card flat>
                  <Activity v-if="tab == '/manage-pricing/activity'"></Activity>
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
import Product from "./product/product.vue";
import Items from "./items/items.vue";
import Tags from "./tags/tags.vue";
import Activity from "./activity.vue";
import { ref } from "@vue/composition-api";
export default {
  components: {
    Product,
    Items,
    Tags,
    Activity,
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
