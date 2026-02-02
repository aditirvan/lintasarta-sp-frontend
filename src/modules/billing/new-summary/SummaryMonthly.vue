<template>
  <!-- <div>
    <v-card v-if="false" color="white" flat> -->

  <v-card color="white" flat>
    <v-card-text class="pt-6">
      <p class="mb-2 font-weight-bold fz-21">Summary Monthly</p>
      <p>{{project.name}}</p>

      <!-- tbl -->
      <v-data-table
        :hide-default-footer="true"
        :headers="tblHeaders"
        :items-per-page="10"
        :items="list"
        class="mt-8"
      >
        <!-- loading / no data -->
        <template v-slot:no-data>
          {{ loading ? "Loading..." : "No data available" }}
        </template>

        <template v-slot:item.summary_date="{ item }">
          {{ $moment(item.summary_date).format("DD/MM/YYYY") }}
        </template>

        <template v-slot:item.billed="{ item }">
          <b>{{ toIDRWithDotFormat(item.billed) }} </b>
        </template>

        <template v-slot:item.updated_at="{ item }">
          {{ $moment(item.updated_at).format("DD/MM/YYYY") }}
        </template>

        <!-- detail & download btn -->
        <template v-slot:item.action="{ item }">
          <div class="d-flex justify-content-between align-center">
            <router-link
              :to="'/billing/summary-monthly/' + item.id"
              class="mr-4"
            >
              Detail
            </router-link>

            <v-btn
              color="primary"
              elevation="0"
              @click="
                () => {
                  currentPeriod = $moment(item.summary_date).format(
                    'DD-MM-YYYY'
                  );
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
        :filename="`Summary Monthly - ${currentProjectName} - ${currentPeriod}`"
        :pdf-quality="2"
        :manual-pagination="true"
        pdf-format="a4"
        pdf-orientation="portrait"
        ref="summaryMonthlyPdf"
        :html-to-pdf-options="{
          filename: `Summary Monthly - ${currentProjectName} - ${currentPeriod}`,
          margin: [16, 0, 16, 0],
          html2canvas: { scale: 3 },
        }"
      >
        <section slot="pdf-content">
          <!-- <invoice-corporate v-if="billing" :organization="organization" :billing="billing" /> -->
          <DownloadSummaryMonthly
            v-if="downloadDocument"
            :item="downloadDocument"
          />
        </section>
      </vue-html2pdf>
    </v-card-text>
  </v-card>

  <!-- <DownloadSummaryMonthly v-else />
  </div> -->
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import VueHtml2pdf from "@/components/Html2Pdf";
import DownloadSummaryMonthly from "./summary-monthly/DownloadSummaryMonthly.vue";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  setup() {
    return {
      toIDRWithDotFormat,
    };
  },
  components: {
    VueHtml2pdf,
    DownloadSummaryMonthly,
  },
  data() {
    return {
      tblHeaders: [
        { text: "Date", value: "summary_date" },
        { text: "Project Name", value: "project_name" },
        { text: "Status", value: "status", width: 100 },
        { text: "Total", value: "billed" },
        { text: "Last Update", value: "updated_at" },
        { text: "Running By", value: "running_by" },
        { text: "Description", value: "description", width: 150 },
        { text: "Action", value: "action", width: 200 },
      ],
      list: [],
      loading: false,
      currentPeriod: "",
      downloadDocument: null,
    };
  },
  computed: {
    org() {
      return JSON.parse(localstorage.getItem("currentOrg"));
    },
    project() {
      return JSON.parse(localstorage.getItem("currentProj"));
    },
    currentProjectName() {
      return JSON.parse(localstorage.getItem("currentProj")).name;
    }
  },
  methods: {
    async getSummaryMonthly() {
      this.loading = true;
      if (this.org && this.org.id) {
        try {
          const res = await api.GET(`/billing/${this.org.id}/${this.project.id}/summary/monthly`);
          this.list = res.data || [];
        } catch (err) {
          let errmsg =
            "Sorry, an error occurred while displaying summary monthly";
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
    async getSummaryMonthlyDetail(id) {
      this.loading = true;

      if (this.org && this.org.id) {
        try {
          const res = await api.GET(
            `/billing/v2/summary/monthly/${id}`
          );
          this.downloadDocument = res.data;
        } catch (err) {
          let errmsg =
            "Sorry, an error occurred while displaying summary monthly detail";
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
    async downloadInvoice(id) {
      await this.getSummaryMonthlyDetail(id);
      this.$refs.summaryMonthlyPdf.generatePdf();
    },
  },
  mounted() {
    this.getSummaryMonthly();
  },
};
</script>
