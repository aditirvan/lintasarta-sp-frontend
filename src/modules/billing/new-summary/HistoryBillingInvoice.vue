<template>
  <v-card color="white" flat>

    <v-row>
      <v-col class="px-7 pt-4">
        <p class="mb-0 font-weight-bold fz-21">Invoice</p>
        <p>{{project.name}}</p>
      </v-col>
    </v-row>

    <InvoicePrepaidTbl v-if="project.payment_method === 'prepaid'" />
    <InvoicePostpaidTbl v-else />
  </v-card>
</template>

<script>
import DownloadInvoice from "./history-billing-invoice/DownloadInvoice.vue";
import InvoicePrepaidTbl from "./history-billing-invoice/InvoicePrepaidTbl.vue";
import InvoicePostpaidTbl from "./history-billing-invoice/InvoicePostpaidTbl.vue";
import localstorage from "@/lib/localstorage";

export default {
  components: {
    InvoicePrepaidTbl,
    InvoicePostpaidTbl,
  },
  data() {
    return {
      tab: 0,
    };
  },
  computed: {
    userType() {
      return localstorage.getItem("type");
    },
    project() {
      let currentProj = localStorage.getItem('currentProj')
      return JSON.parse(currentProj)
    }
  },
  methods: {
    onTabChange(val) {
      this.tab = val;
    },
  },
};
</script>
