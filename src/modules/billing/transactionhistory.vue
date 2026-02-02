<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-card-text>
      <p class="fz-21 font-weight-bold">Transaction History</p>
      <p class="subtitle-1">{{currentProj.name}}</p>
    </v-card-text>

    <v-data-table
      hide-default-footer
      :headers="headers"
      :items="topups"
      :items-per-page="pagination.itemsPerPage"
      :server-items-length="pagination.count"
      :options.sync="pagination"
      class="elevation-0"
    >
      <!-- loading / no data -->
      <template v-slot:no-data>
        {{ loading ? "Loading..." : "No data available" }}
      </template>

      <!-- total_payment -->
      <template v-slot:item.billed="{ item }">
        <!-- <span :style="item.type === 'plus' ? 'color: #1F60A8' : 'color: red'"> -->
        <!-- {{ item.type === "plus" ? "+" : "-" }} -->
        {{ toIDRWithDotFormat(item.billed) }}
        <!-- </span> -->
      </template>
      <template v-slot:item.invoice_number="{ item }">
        {{ item.invoice_number ? item.invoice_number : "-" }}
      </template>
      <!-- date -->
      <template v-slot:item.payment_date="{ item }">
        <span>
          {{
            item.payment_date == "0001-01-01T00:00:00Z" ||
            item.status == "Initial"
              ? "-"
              : $moment(item.payment_date).format("DD/MM/YYYY")
          }}
        </span>
      </template>

      <!-- pagination -->
      <!-- <template v-slot:footer="{ props }">
        <custom-footer-datatable :props="props" />
      </template> -->

      <!-- pagination -->
      <template v-slot:footer="{ props }">
        <custom-footer-datatable
          v-if="
            (pagination && pagination.count > 10) ||
            (pagination && pagination.count === 10)
          "
          @input="
            (val) => {
              pagination = { ...pagination, ...val };
            }
          "
          :props="props"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  setup() {
    return {
      toIDRWithDotFormat,
    };
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: "Ref No", value: "ref_no", sortable: false },
        { text: "Invoice Number", value: "invoice_number", sortable: false },
        { text: "Source", value: "type", sortable: false },
        { text: "Amount", value: "billed", sortable: false },
        { text: "Date", value: "payment_date", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "By", value: "creator", sortable: false },
      ],
      topups: [],
      pagination: {
        count: 0,
        page: 1,
        totalpage: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
      },
    };
  },
  computed: {
    currentOrg() {
      const org = localstorage.getItem("currentOrg");

      if (!org) return null;

      return JSON.parse(org);
    },
    isSuperAdmin() {
      const role = localstorage.getItem("role");
      const isSuperAdmin = role && role === "Superadmin";

      return isSuperAdmin;
    },
    currentProj() {
      const currentProj = localstorage.getItem("currentProj");
      return JSON.parse(currentProj)
    }
  },
  methods: {
    async getTransactionHistory(search, page, limit, sortBy, sortDesc) {
      this.loading = true;

      try {
        const orgid = this.currentOrg.id;
        const project_id = this.currentProj.id;
        const userEndpoint = "/payment/history";
        const superadminEndpoint = "/superadmin/payment/history/" + orgid;

        const res = await api.GET(
          this.isSuperAdmin ? superadminEndpoint : userEndpoint,
          {
            search,
            page,
            limit,
            sortBy,
            sortDesc,
            project_id,
          }
        );

        // this.topups = res.data;
        // .sort((a, b) => new Date(b.date) - new Date(a.date));

        const { data, pagination } = res.data;
        this.topups = data;

        if (pagination) {
          this.pagination = {
            ...pagination,
            itemsPerPage: limit || this.pagination.itemsPerPage,
            sortBy: sortBy || this.pagination.sortBy,
            sortDesc: sortDesc || this.pagination.sortDesc,
          };
        }
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying transaction history"
        );
      }

      // this.topups = [
      //   {
      //     transaction: "123",
      //     payment: "dummy-data",
      //     total_payment: 123,
      //     date: "2022-02-02",
      //     type: "dummy-data",
      //     payment_type: "dummy-data",
      //     project: "dummy-data",
      //   },
      // ];

      this.loading = false;
    },
  },
  mounted() {
    this.getTransactionHistory("", 1, 10, [], []);
  },
  watch: {
    pagination(newVal, oldVal) {
      const changedCount = newVal.count !== oldVal.count;
      const changedPage = newVal.page !== oldVal.page;
      const changedItemsPerPage = newVal.itemsPerPage !== oldVal.itemsPerPage;
      const changedSortBy = newVal.sortBy[0] !== oldVal.sortBy[0];
      const changedSortDesc = newVal.sortDesc[0] !== oldVal.sortDesc[0];

      if (
        changedCount ||
        changedPage ||
        changedItemsPerPage ||
        changedSortBy ||
        changedSortDesc
      ) {
        this.getTransactionHistory(
          "",
          newVal.page,
          newVal.itemsPerPage,
          newVal.sortBy,
          newVal.sortDesc
        );
      }
    },
  },
};
</script>