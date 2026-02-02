<template>
  <v-col cols="12">
    <v-card class="rounded-lg" flat>
      <v-container fluid class="pa-7">
        <v-row>
          <v-col cols="12" class="py-0">
            <p class="project-name">
              <template v-if="$route.params.id === 'all-project'">
                All Project
              </template>

              <template v-else>
                {{ billing && billing.project ? billing.project.name : "" }}
              </template>
            </p>
          </v-col>

          <v-col class="d-flex mb-2 pt-0">
            <div>
              <p class="font-weight-bold fz-21 mb-4 mr-4">
                Cost for {{ currentPeriod }}
              </p>

              <p>
                This is the current cost for your usage this billing period. A
                breakdown of your cost is available below.
              </p>
            </div>

            <v-spacer />

            <div class="summary-billed">
              <b class="font--text">Billed</b>
              <p class="total-billed">
                {{ toIDRWithDotFormat(detail.total) }}
              </p>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-data-table
              class="datatable-services"
              :headers="tblHeaders"
              :items="detail.list"
              hide-default-footer
            >
              <template v-slot:item.type="{ item }">
                <router-link :to="`/billing/monthly-cost/${project.id}/${item.type}?start=${startDate}&end=${endDate}`">
                  {{ item.type }}
                </router-link>
              </template>

              <template v-slot:item.billed="{ item }">
                {{ toIDRWithDotFormat(item.billed) }}
              </template>

              <template v-if="!postpaidFixed" v-slot:body.append>
                <tr style="border: none">
                  <td class="border-bottom-none"></td>
                  <td class="border-bottom-none"></td>
                  <td class="border-bottom-none">
                    <div>
                      <p class="font-weight-bold">Total</p>
                    </div>
                    <div class="d-flex flex-row justify-start">
                      {{ toIDRWithDotFormat(detail.total) }}
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-col>
</template>

<script>
import { toIDRWithDotFormat } from "@/lib/formatter";
import localstorage from "@/lib/localstorage";
import { date } from "faker";

export default {
  props: ["detail", "billing"],
  // data() {
  //   return {
  //     tblHeaders: [
  //       { text: "Billing Type", value: "name" },
  //       { text: "Amount of Service", value: "service_amount" },
  //       !this.postpaidFixed && { text: "Billed", value: "billed" },
  //     ],
  //   };
  // },
  setup(props, context) {
    return {
      toIDRWithDotFormat,
    };
  },
  computed: {
    tblHeaders() {
      return [
        { text: "Billing Type", value: "type" },
        { text: "Amount of Service", value: "service_count" },
        !this.postpaidFixed && { text: "Billed", value: "billed" },
      ];
    },
    project() {
      return JSON.parse(localstorage.getItem("currentProj"));
    },
    currentPeriod() {
      const { date_start, date_end } = this.billing;
      const start = this.$moment(date_start).format("DD MMMM YYYY");
      const end = this.$moment(date_end).format("DD MMMM YYYY");

      return start + " - " + end;
    },
    startDate() {
      const { date_start } = this.billing;
      return date_start
    },
    endDate() {
      const { date_end } = this.billing;
      return date_end
    },
    postpaidFixed() {
      const { billing } = this;

      return (
        billing && billing.project && billing.project.postpaid_type === "fixed"
      );
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
