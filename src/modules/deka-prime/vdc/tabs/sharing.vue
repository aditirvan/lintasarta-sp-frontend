<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7">
            <div class="bd-bg">This VM is not shared with anybody yet.</div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { ref } from "@vue/composition-api";
import { VDC } from "../namespace";
export default {
  setup() {
    const { detailVm } = useNamespacedGetters(VDC, ["detailVm"]);
    return {
      detailVm,
    };
  },
};
</script>

<style lang="scss" scoped>
.bd-bg {
  border: 1px solid black;
  padding: 10px;
  background-color: #e2f1ff;
}
</style>
