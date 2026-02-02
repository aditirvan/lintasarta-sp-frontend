<template>
  <v-card-text>

    <v-data-table
      :hide-default-footer="true"
      :headers="tblHeaders"
      :items="list"
      :items-per-page="10"
      :server-items-length="pagination.count"
      :options.sync="pagination"
    >
      <!-- loading / no data -->
      <template v-slot:no-data>
        {{ loading ? "Loading..." : "No data available" }}
      </template>

      <template v-slot:item.due_date="{ item }">
        <span>
          {{ $moment(item.due_date).format("DD/MM/YYYY") }}
        </span>
      </template>

      <template v-slot:item.service_type="{ item }">
        {{ uppercaseFirstLetter(item.service_type) }}
      </template>

      <template v-slot:item.billed="{ item }">
        <b> {{ toIDRWithDotFormat(item.billed) }} </b>
      </template>

      <template v-slot:item.id="{ item }">
        <div class="d-flex justify-content-between align-center">
          <router-link :to="'/billing/invoice/postpaid/' + item.id" class="mr-4">
            Detail
          </router-link>

          <v-btn
            color="primary"
            elevation="0"
            @click="
              () => {
                currentPeriod = $moment(item.due_date).format('DD-MM-YYYY');
                downloadInvoice(item.id);
              }
            "
          >
            Download
          </v-btn>
        </div>
      </template>

      <!-- <template v-slot:footer="{ props }" v-if="list.length">
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

    <!-- download pdf -->
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :filename="`Invoice - ${currentProjectName} - ${currentPeriod}`"
      :pdf-quality="2"
      :manual-pagination="true"
      pdf-format="a4"
      pdf-orientation="portrait"
      :html-to-pdf-options="{
        filename: `Invoice - ${currentProjectName} - ${currentPeriod}`,
        margin: [16, 0, 16, 0],
        html2canvas: { scale: 3 },
      }"
      ref="historyBillingInvoicePdf2"
    >
      <section slot="pdf-content">
        <!-- <download-summary-monthly v-if="downloadDocument" :item="downloadDocument" /> -->
        <DownloadInvoice2 v-if="detail" :item="detail" :list="detailList" :payments="payments" :totalPayment="totalPayment" />
      </section>
    </vue-html2pdf>
  </v-card-text>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import VueHtml2pdf from "@/components/Html2Pdf";
import DownloadInvoice2 from "./DownloadInvoice2.vue";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  setup() {
    return {
      toIDRWithDotFormat,
    };
  },
  components: {
    VueHtml2pdf,
    DownloadInvoice2,
  },
  data() {
    return {
      loading: false,
      tblHeaders: [
        { text: "Date", value: "due_date" },
        { text: "Invoice Number", value: "number", sortable: false },
        { text: "Project Name", value: "project_name", sortable: false },
        { text: "Payment Method", value: "service_type", sortable: false },
        { text: "Billed", value: "billed", sortable: false },
        { text: "Status", value: "payment_status", sortable: false },
        { text: "Action", value: "id", sortable: false },
      ],

      list: [],
      pagination: {
        count: 0,
        page: 1,
        totalpage: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
      },

      currentPeriod: "",

      // download pdf
      detail: null,
      detailList: [],
      payments: null,
      totalPayment: null,
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
    currentProjectName() {
      return JSON.parse(localstorage.getItem("currentProj")).name;
    }
  },
  methods: {
    async getInvoiceHistory(search, page, limit, sortBy, sortDesc) {
      this.loading = true;

      let currentProj = localStorage.getItem('currentProj')
      const project = JSON.parse(currentProj);

      const projectId = project ? project.id : "all";
      const userEndpoint = "/billing/invoice/" + projectId;
      const superadminEndpoint = `/superadmin/invoice/${this.currentOrg.id}/${projectId}`;
      const endpoint = this.isSuperAdmin ? superadminEndpoint : userEndpoint;

      try {
        const res = await api.GET(endpoint, {
          search,
          page,
          limit,
          sortBy,
          sortDesc,
        });

        const { invoice, pagination } = res.data;

        this.list =
          invoice.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          ) || [];

        this.pagination = {
          ...pagination,
          itemsPerPage: limit || this.pagination.itemsPerPage,
          sortBy: sortBy || this.pagination.sortBy,
          sortDesc: sortDesc || this.pagination.sortDesc,
        };
      } catch (err) {
        let errmsg =
          "Sorry, an error occurred while displaying invoice billing";
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

      this.loading = false;
    },
    async getInvoiceDetail(id) {
      this.loading = true;

      try {
        const res = await api.GET("/billing/v2/invoice/detail/" + id);
        const { detail, services, payments } = res.data;
        this.detail = detail;
        this.detailList = services;

        this.payments = payments;
        this.payments.forEach(payment => {
          this.totalPayment += payment.amount
        })
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying invoice detail"
        );
      }

      this.loading = false;
    },
    async downloadInvoice(id) {
      await this.getInvoiceDetail(id);
      this.$refs.historyBillingInvoicePdf2.generatePdf();
    },
    uppercaseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  mounted() {
    this.getInvoiceHistory("", 1, 10, [], []);
  },
  watch: {
    projectName(newVal) {
      this.getInvoiceHistory("", 1, 10, [], []);
    },
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
        this.getInvoiceHistory(
          this.search,
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
