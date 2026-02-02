<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-card-text class="px-0 pb-0 pt-2 rounded-lg">
      <v-tabs v-model="tab" slider-size="4">
        <v-tab to="/voucher/trial">
          <span style="font-size: 16px">Voucher Trial</span>
        </v-tab>
        <v-tab to="/voucher/credit">
          <span style="font-size: 16px">Voucher Credit</span>
        </v-tab>
        <v-tab to="/voucher/discount">
          <span style="font-size: 16px">Voucher Discount</span>
        </v-tab>
      </v-tabs>
    </v-card-text>
    <v-tabs-items style="border-top: 0.5px solid #e0e0e0" v-model="tab">
      <!-- voucher trial item -->
      <v-tab-item value="/voucher/trial">
        <VoucherTrial/>
      </v-tab-item>

      <!-- voucher credit item -->
      <v-tab-item value="/voucher/credit">
        <VoucherCredit/>
      </v-tab-item>

      <!-- voucher discount item -->
      <v-tab-item value="/voucher/discount">
        <VoucherDiscount/>
      </v-tab-item>

    </v-tabs-items>
  </v-card>
</template>

<script>
import { ref } from "@vue/composition-api";
import VoucherTrial from "./VoucherTrial";
import VoucherCredit from "./VoucherCredit";
import VoucherDiscount from "./VoucherDiscount";
export default {
  components: { 
    VoucherTrial, 
    VoucherCredit,
    VoucherDiscount,
  },
  setup() {
    return {
      tab: ref(""),
    };
  },
};
</script>