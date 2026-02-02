<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title"><v-icon class="mr-3">mdi-vector-combine</v-icon>{{ $route.params.name }}</div>
              </v-col>
            </v-row>
            <br />
            <v-card class="rounded-lg mt-4 mb-4" flat outlined>
              <template>
                <v-tabs v-model="tab" class="mb-6">
                  <v-tab class="fz-12 firewall-title">Firewall</v-tab>
                  <v-tab class="fz-12 firewall-title">NAT</v-tab>
                  <v-tab class="fz-12 firewall-title">Routing</v-tab>
                </v-tabs>
              </template>

              <v-tabs-items v-model="tab" class="mb-6">
                <v-tab-item>
                  <v-card flat>
                    <Firewall></Firewall>
                    <!-- <Firewall2></Firewall2> -->
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <Nat></Nat>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <Routing></Routing>
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
import { ref } from "@vue/composition-api";
import Firewall from "../tabs-dialog-firewall/firewall.vue";
import Nat from "../tabs-dialog-firewall/nat.vue";
import Routing from "../tabs-dialog-firewall/routing.vue";
import Firewall2 from "../tabs-dialog-firewall/firewall2.vue";

export default {
  components: {
    Firewall,
    Nat,
    Routing,
    Firewall2,
  },
  props: {
    // dialogFirewall: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  setup(props, context) {
    // const onCancel = () => {
    //   context.emit("update:dialogFirewall", false);
    // };
    // const onSumbit = () => {
    //   context.emit("update:dialogFirewall", false);
    // };
    const tab = ref("");
    return {
      // onCancel,
      // onSumbit,
      tab,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-dialog {
  box-shadow: none;
}
::v-deep .v-item-group.theme--light.v-slide-group.v-tabs-bar.v-tabs-bar--is-mobile.primary--text {
  display: grid;
}

::v-deep .v-slide-group__wrapper {
  height: 71px;
}
</style>
