<template>
  <v-row>
    <v-col cols="12" class="py-0">
      <p class="project-name">
        {{ id === "all-project" ? detail.project : detail.project.name }}
      </p>
    </v-col>

    <v-col class="d-flex mb-2 pt-0">
      <div>
        <p class="font-weight-bold fz-21 mb-4 mr-4">
          {{ getBillingTypeLabel(billing_type.toUpperCase()) }} | Cost for
          {{ currentPeriod }}
        </p>

        <p>
          *This is the current cost for your usage this billing period. A
          breakdown of your cost is available below.
        </p>
      </div>

      <v-spacer />

      <div class="summary-billed">
        <b class="font--text">Billed</b>
        <p class="total-billed">{{ toIDRWithDotFormat(detail.billed) }}</p>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import api from "@/lib/api";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  setup(props, context) {
    return {
      toIDRWithDotFormat,
    };
  },
  props: ["detail"],
  methods: {
    getBillingTypeLabel(type) {
      switch (type) {
        case "PPU":
          return "Pay Per Use (PPU)";
        case "PPM":
          return "Pay Per Metrics (PPM)";
        case "Other":
          return "One Time";

        default:
          break;
      }
    },
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    billing_type() {
      return this.$route.params.billing_type;
    },
    currentPeriod() {
      const { date_start, date_end } = this.detail;
      const startFormatted = this.$moment(date_start).format("DD MMMM YYYY");
      const endFormatted = this.$moment(date_end).format("DD MMMM YYYY");
      const currentPeriod = startFormatted + " - " + endFormatted;

      return currentPeriod;
    },
  },
};
</script>

<style scoped>
.project-name {
  font-weight: bold;
  font-size: 21px;
  display: block;
  color: #1f60a8;
}

.summary-billed {
  padding: 1.5rem;
  background: rgba(44, 148, 210, 0.02);
  border: 1px solid #2c94d2;
  border-radius: 10px;
  min-width: 300px;
}

.summary-billed p {
  font-size: 36px;
  color: #1f60a8;
  font-weight: 600;
  margin-bottom: 0;
}
</style>
