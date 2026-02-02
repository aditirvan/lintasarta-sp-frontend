<template>
  <v-card color="white" flat>
    <v-card-text>
      <v-row>
        <v-col>
          <p class="mb-2 font-weight-bold fz-21">Daily Cost Estimated</p>
          <p>{{project.name}}</p>
        </v-col>
      </v-row>

      <v-data-table
        :hide-default-footer="true"
        :headers="tblHeaders"
        :items-per-page="10"
        :items="list"
        class="mt-2"
      >
        <!-- loading / no data -->
        <template v-slot:no-data>
          {{ loading ? "Loading..." : "No data available" }}
        </template>

        <!-- <template v-slot:item.billed="{ item }">
          <b> IDR {{ item.billed.toLocaleString("id-ID") }} </b>
          /hours
        </template> -->

        <template v-slot:item.date>
          {{ $moment(date).format("DD/MM/YYYY") }}
        </template>

        <template v-slot:item.service_type="{ item }">
          {{ stylizeServiceName(item.service_type) }}
        </template>

        <template v-slot:item.charged="{ item }">
          {{ item.charged ? "Yes" : "No" }}
        </template>

        <template v-slot:item.total_price="{ item }">
          <b>{{ toIDRWithDotFormat(item.total_price) }}</b>
        </template>

        <template v-slot:item.total_discount_value="{ item }">
          <b>{{ toIDRWithDotFormat(item.total_discount_value) }}</b>
        </template>

        <template v-slot:item.total_discount="{ item }">
          <b>{{ toIDRWithDotFormat(item.total_discount) }}</b>
        </template>

        <template v-slot:item.total_billed="{ item }">
          <b>{{ toIDRWithDotFormat(item.total_billed) }}</b>
        </template>

        <template v-slot:item.service_billings="{ item }">
          <v-btn
            color="white primary--text"
            elevation="0"
            v-if="item.service_billings"
            @click="
              () => {
                actionPopupOn = true;
                service_billings = item.service_billings;
                service_type = item.service_type;
              }
            "
          >
            Detail
          </v-btn>
        </template>

        <template v-if="project.postpaid_type !== 'fixed'" v-slot:body.append>
          <tr style="border: none" v-if="list.length">
            <td
              v-for="number in tblHeaders.length - 3"
              :key="'total-' + number"
              class="border-bottom-none"
            />

            <td class="border-bottom-none">
              <div class="d-flex flex-row justify-end font-weight-bold">
                Total
              </div>
            </td>

            <td class="border-bottom-none">
              <div class="d-flex flex-row justify-end font-weight-bold">
                {{ toIDRWithDotFormat(total) }}
              </div>
            </td>
          </tr>
        </template>

        <template v-slot:footer="{ props }" v-if="list.length">
          <custom-footer-datatable :props="props" />
        </template>
      </v-data-table>
    </v-card-text>

    <ActionPopup
      v-if="service_billings"
      v-model="actionPopupOn"
      :item="service_billings"
      :service-name="service_type"
    />
  </v-card>
</template>

<script>
import { capitalCase } from "capital-case";
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import ActionPopup from "./daily-cost/ActionPopup.vue";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  components: {
    ActionPopup,
  },
  setup(props, context) {
    return {
      toIDRWithDotFormat,
    };
  },
  data() {
    let currentProj = JSON.parse(localStorage.getItem('currentProj'))
    
    return {
      actionPopupOn: false,
      loading: false,
      tblHeaders: currentProj.postpaid_type !== 'fixed' ? [
        { text: "Date", value: "date" },
        { text: "Service", value: "service_type", sortable: false },
        { text: "Charge", value: "charged", sortable: false },
        { text: "Price Estimate", value: "total_price", sortable: false },
        { text: "Discount Estimate", value: "total_discount_value", sortable: false },
        { text: "Bill Estimate", value: "total_billed", align: "end", sortable: false },
        { text: "Action", value: "service_billings", align: "center", sortable: false },
      ] : [
        { text: "Date", value: "date" },
        { text: "Service", value: "service_type", sortable: false },
        { text: "Charge", value: "charged", sortable: false },
        { text: "Action", value: "service_billings", align: "center", sortable: false },
      ],
      list: [],
      total: 0,
      service_billings: null,
    };
  },
  computed: {
    currentOrg() {
      const org = localstorage.getItem("currentOrg");

      if (!org) return null;

      return JSON.parse(org);
    },
    project() {
      let currentProj = localStorage.getItem('currentProj')
      return JSON.parse(currentProj)
    },
    isSuperAdmin() {
      const role = localstorage.getItem("role");
      const isSuperAdmin = role && role === "Superadmin";

      return isSuperAdmin;
    },
  },
  methods: {
    async getDailyCost() {
      this.loading = true;

      if (this.currentOrg) {
        try {
          let currentProj = localStorage.getItem('currentProj')
          const project = JSON.parse(currentProj);
          const res = await api.GET(
            `/billing/v2/daily-cost/${project.id}`
          );
          const { date, grouped_service_billings, total_billed } = res.data;
          this.date = date;
          this.list = grouped_service_billings || [];
          this.total = total_billed;
        } catch (err) {
          let errmsg = "Sorry, an error occurred while displaying data";
          const thereIsErrorMessage = err && err.response && err.response.data;

          if (thereIsErrorMessage && err.response.data.message) {
            errmsg = err.response.data.message;
          }

          if (
            thereIsErrorMessage &&
            err.response.data.data !== "record not found"
          ) {
            this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
          }
        }
      } else {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, organization id not found"
        );
      }

      this.loading = false;
    },
    stylizeServiceName(service) {

      switch (service) {
        case "OS_CHARGING":
          return "OPERATING SYSTEM";
        case "OBJECT_STORAGE":
          return "DEKA BOX";
        default:
          return capitalCase(service).toUpperCase();
      }

    },
  },
  mounted() {
    this.getDailyCost();
  },
  watch: {
    projectName(newVal) {
      this.getDailyCost();
    },
  },
};
</script>
