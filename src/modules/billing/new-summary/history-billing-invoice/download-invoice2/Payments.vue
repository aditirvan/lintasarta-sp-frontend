<template>
  <div>
    <div
      :style="{
        marginTop: '8px',
        padding: '10px',
        backgroundColor: '#1f60a8',
        color: 'white',
      }"
    >
      <b>Payment</b>
    </div>

    <v-row>
      <v-col>
        <b>Paid At</b>
      </v-col>
      <v-col/>
      <v-col/>
      <v-col>
        <b>Amount</b>
      </v-col>
    </v-row>
    <v-divider :style="{ backgroundColor: 'black', color: 'black' }" />

    <v-row
      v-for="(payment, index) in payments"
      :key="index"
      class="row-bb"
    >
      <v-col>
        <b>{{ $moment(payment.created_at).format("DD/MM/YYYY HH:mm:ss") }}</b>
      </v-col>
      <v-col/>
      <v-col/>
      <v-col>
        <b>{{toIDRWithDotFormat(payment.amount)}}</b>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { toIDRWithDotFormat } from "@/lib/formatter";
export default {
  props: ["payments"],
  setup() {
    return {
      toIDRWithDotFormat,
    };
  },
};
</script>

<style scoped>
.row-bb {
  border-bottom: 1px solid #e0e0e0;
  color: #333333;
}
</style>
