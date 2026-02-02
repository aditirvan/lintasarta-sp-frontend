<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7">
            <br />
            <div class="bor-table mb-5">
              <v-row class="ma-0">
                <v-col>CD/DVD drive</v-col>
                <v-col>Disconnected</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Floppy drive</v-col>
                <v-col>Disconnected</v-col>
              </v-row>
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useNamespacedGetters } from "vuex-composition-helpers";
import { ref, onMounted } from "@vue/composition-api";
import { VDC } from "../namespace";
export default {
  setup(props, context) {
    const { detailVm } = useNamespacedGetters(VDC, ["detailVm"]);
    return {
      detailVm,
    };
  },
};
</script>

<style lang="scss" scoped>
.bor-table {
  border: 1px solid rgb(2 0 0 / 12%);
}
</style>
