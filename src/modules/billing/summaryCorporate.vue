<template>
  <v-card color="transparent" elevation="0">
    <v-tabs v-model="tab" background-color="white" color="primary" grow>
      <v-tab v-for="item in tabs" :key="item.id" :to="item.route">
        {{ item.name }}
      </v-tab>
    </v-tabs>

    <div>
      <div v-if="tab === '/billing/summary-monthly'" class="mt-8">
        <SummaryMonthly/>
      </div>

      <div v-else-if="tab === '/billing/monthly-cost'" class="mt-6">
        <BillingCorporateDetail/>
      </div>

      <div v-else-if="tab === '/billing/invoice'" class="mt-8">
        <HistoryBillingInvoice/>
      </div>

      <div v-else class="mt-8">
        <DailyCost/>
      </div>
    </div>

  </v-card>
</template>

<script>
import DailyCost from "./new-summary/DailyCost.vue";
import BillingCorporateDetail from "./billingCorporateDetail"
// import MonthlyCost from "./new-summary/MonthlyCost.vue";
import HistoryBillingInvoice from "./new-summary/HistoryBillingInvoice.vue";
import SummaryMonthly from "./new-summary/SummaryMonthly.vue";
import localstorage from "@/lib/localstorage";

export default {
  components: {
    DailyCost,
    BillingCorporateDetail,
    HistoryBillingInvoice,
    SummaryMonthly,
  },
  data() {
    return {
      tab: '/billing/daily-cost-estimated',
      tabs:[
      { id: 0, name: "Daily Cost Estimated", route: `/billing/daily-cost-estimated` },
      { id: 1, name: "Monthly Cost", route: `/billing/monthly-cost` },
      { id: 2, name: "Invoice", route: `/billing/invoice` },
      { id: 3, name: "Summary Monthly", route: `/billing/summary-monthly` },
      ],
    };
  },
  computed: {
    org() {
      return JSON.parse(localstorage.getItem("currentOrg"));
    },
  },
};
</script>
