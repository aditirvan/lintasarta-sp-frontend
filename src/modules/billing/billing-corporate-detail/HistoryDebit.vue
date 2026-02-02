<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg pa-4 mt-3" flat>
        <v-card-text class="d-flex flex-row align-center">
          <div class="headline font-weight-bold font--text">History Debit</div>
          <v-spacer />

          <div style="height: auto; width: 20px" />

          <!-- <v-btn
              class="secondary"
              dark
              depressed
              height="45"
              width="111"
              style="font-size: 14px"
            >
              Download
            </v-btn> -->
        </v-card-text>

        <v-card-text>
          <v-data-table
            hide-default-footer
            :headers="tblHeaders"
            :items="tblItems"
            :items-per-page="10"
          >
            <template v-slot:item.date="{ item }">
              {{ $moment(item.date).format("DD/MM/YYYY") }}
            </template>

            <template v-slot:item.amount="{ item }">
              <b>{{ toIDRWithDotFormat(item.amount) }}</b>
            </template>

            <template v-slot:item.total="{ item }">
              <b>{{ toIDRWithDotFormat(item.total) }}</b>
            </template>

            <template v-slot:item.running_date="{ item }">
              {{ $moment(item.running_date).format("DD/MM/YYYY") }}
            </template>

            <template v-slot:item.running_by="{ item }">
              {{ uppercaseFirstLetter(item.running_by) }}
            </template>

            <template v-slot:item.description="{ item }">
              {{ sliceInv(item.description) }}
            </template>

            <template v-slot:footer="{ props }" v-if="tblItems.length">
              <custom-footer-datatable :props="props" />
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  setup(props, context) {
    return {
      toIDRWithDotFormat,
    };
  },
  props: ["billing"],
  data() {
    return {
      tblHeaders: [
        { text: "Date", value: "date" },
        { text: "Status", value: "status", sortable: false },
        { text: "Amount", value: "amount", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Running Date", value: "running_date" },
        { text: "Running By", value: "running_by", sortable: false },
        { text: "Description", value: "description", sortable: false },
      ],
      tblItems: [],
    };
  },
  methods: {
    async getHistoryDebit() {
      try {
        const currentProj = JSON.parse(localstorage.getItem("currentProj"))
        const projectId = currentProj.id;
        const { date_start, date_end } = this.billing;

        const role = localstorage.getItem("role");
        const isSuperAdmin = role && role === "Superadmin";

        const currentOrg = localstorage.getItem("currentOrg");
        const org = JSON.parse(currentOrg);

        const admin =
          "/superadmin/billing/monthly-cost/summary/history-debit/" + org.id;
        const user = "/billing/monthly-cost/summary/history-debit";

        const summary = isSuperAdmin ? admin : user;
        const proj = "/billing/monthly-cost/history-debit";

        const endpoint = projectId === "all-project" ? summary : proj;
        const res = await api.POST(endpoint, {
          project_id: projectId,
          start: date_start,
          end: date_end,
        });

        this.tblItems = res.data.reverse();
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying history debit"
        );
      }
    },
    uppercaseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    sliceInv(params) {
      return params.split(" ").slice(0, 3).join(" ");
    },
  },
  mounted() {
    this.getHistoryDebit();
  },
};
</script>
