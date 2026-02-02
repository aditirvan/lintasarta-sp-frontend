<template>
  <v-card-text>
    <!-- <h6 class="text-h6 font-weight-bold">Invoice Prepaid</h6> -->

    <v-data-table
      :hide-default-footer="true"
      :headers="tblHeaders"
      :items-per-page="10"
      :items="list"
    >
      <!-- loading / no data -->
      <template v-slot:no-data>
        {{ loading ? "Loading..." : "No data available" }}
      </template>

      <template v-slot:item.billed="{ item }">
        <b>{{ item.billed ? toIDRWithDotFormat(item.billed) : 0 }} </b>
      </template>

      <template v-slot:item.created_at="{ item }">
        <span>
          {{ $moment(item.created_at).format("DD/MM/YYYY") }}
        </span>
      </template>

      <template v-slot:item.transaction_id="{ item }">
        <div class="d-flex justify-content-between align-center">
          <!-- <router-link
              :to="
                '/billing/invoice/' + $moment(item.created_at).format('YYYY-MM-DD')
              "
              class="mr-4"
            > -->
          <router-link :to="'/billing/invoice/prepaid/' + item.id" class="mr-4">
            Detail
          </router-link>

          <v-btn
            color="primary"
            elevation="0"
            @click="
              () => {
                currentPeriod = $moment(item.created_at).format('DD-MM-YYYY');
                currentId = item.id;
                downloadInvoice(item.id);
              }
            "
          >
            Download
          </v-btn>
        </div>
      </template>

      <template v-slot:footer="{ props }" v-if="list.length">
        <custom-footer-datatable :props="props" />
      </template>
    </v-data-table>

    <!-- download pdf -->
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :filename="`Invoice - ${currentId} - ${currentPeriod}`"
      :pdf-quality="2"
      :manual-pagination="true"
      pdf-format="a4"
      pdf-orientation="portrait"
      ref="historyBillingInvoicePdf"
      :html-to-pdf-options="{
        filename: `Invoice - ${currentId} - ${currentPeriod}`,
        margin: [16, 0, 16, 0],
        html2canvas: { scale: 3 },
      }"
    >
      <section slot="pdf-content">
        <!-- <download-summary-monthly v-if="downloadDocument" :item="downloadDocument" /> -->
        <DownloadInvoice v-if="detail" :item="detail" />
      </section>
    </vue-html2pdf>
  </v-card-text>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import VueHtml2pdf from "@/components/Html2Pdf";
import DownloadInvoice from "./DownloadInvoice.vue";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  setup() {
    return {
      toIDRWithDotFormat,
    };
  },
  components: {
    VueHtml2pdf,
    DownloadInvoice,
  },
  data() {
    return {
      loading: false,
      tblHeaders: [
        { text: "Invoice ID", value: "id", sortable: false },
        { text: "Invoice Date", value: "created_at" },
        { text: "Status", value: "status", sortable: false },
        { text: "Amount", value: "billed", sortable: false },
        { text: "Description", value: "description", sortable: false },
        { text: "Action", value: "transaction_id", sortable: false },
      ],
      list: [],
      currentPeriod: "",
      currentId: "",
      detail: null,
    };
  },
  methods: {
    async getInvoiceHistory() {
      this.loading = true;
      const role = localstorage.getItem("role");
      const currentOrg = localstorage.getItem("currentOrg");
      const org = JSON.parse(currentOrg);
      const orgId = org ? org.id : "";
      let endpoint = "/balance/history/invoice";

      if (role === "Superadmin") {
        endpoint = "/superadmin/balance/history/invoice/" + orgId;
      }

      try {
        const res = await api.GET(endpoint);
        this.list =
          res.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          ) || [];
      } catch (err) {
        let errmsg =
          "Sorry, an error occurred while displaying invoice history";
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
        const res = await api.GET("/balance/history/invoice/detail/" + id);
        this.detail = res.data;
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying invoice detail";
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
    async downloadInvoice(id) {
      await this.getInvoiceDetail(id);
      this.$refs.historyBillingInvoicePdf.generatePdf();
    },
  },
  mounted() {
    this.getInvoiceHistory();
  },
};
</script>
