<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg" flat>
        <v-container class="pa-7">
          <div class="vpc-title">Detail Project</div>

          <v-row>
            <v-col>
              <p><b>Project Name</b></p>

              <p>{{ project.name }}</p>
            </v-col>

            <v-col>
              <p><b>Region</b></p>

              <p>{{ project.region || "-" }}</p>
            </v-col>            
          </v-row>

          <v-row>
            <v-col>
              <p><b>Service Instance</b></p>

              <p>{{ project.network_number || "-" }}</p>
            </v-col>

            <v-col>
              <p><b>Interval Billing</b></p>

              <p>
                {{ project.interval_billing_per_month }}
                {{
                  project.interval_billing_per_month > 1 ? "Months" : "Month"
                }}
              </p>
            </v-col>            
          </v-row>

          <v-row>
            <v-col>
              <p><b>Invoice Due Periode</b></p>

              <p>
                {{ project.invoice_due_periode_per_day }}
                {{ project.invoice_due_periode_per_day > 1 ? "Days" : "Day" }}
              </p>
            </v-col>

            <v-col>
              <p><b>Payment Method</b></p>

              <p>
                {{
                  project.payment_method === "postpaid"
                    ? formatPostpaidType(project.postpaid_type)
                    : uppercaseFirstLetter(project.payment_method)
                }}
              </p>
            </v-col>
            
          </v-row>

          <v-row>
            <v-col>
              <p><b>Activation Date</b></p>

              <p>
                {{
                  project.service_activation_date
                    ? $moment(project.service_activation_date).format(
                        "DD/MM/YYYY"
                      )
                    : "-"
                }}
              </p>
            </v-col>
            <v-col>
              <p><b>Business VAT ID</b></p>
              <p> {{ vatid }} </p>
            </v-col>
          </v-row>

          <div
            class="mt-4 mb-4"
            :style="{ borderTop: '1px solid lightgray' }"
          />

          <v-row>
            <v-col>
              <p><b>Description Project</b></p>

              <p>{{ project.description }}</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p><b>Document Contract</b></p>

              <beat-loader
                v-if="docLoading"
                color="gray"
                size="10px"
                class="mr-2"
              />

              <template v-else>
                <a
                  v-if="project.doc_contract && doc_contract_base64"
                  :download="filename"
                  :href="filelink"
                  class="d-flex justify-content-center align-center"
                >
                  <img src="/doc.png" alt="doc" class="mr-4" />

                  {{ filename }}

                  <img src="/download.png" alt="download" class="ml-4" />
                </a>

                <p v-else>-</p>
              </template>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import localstorage from "@/lib/localstorage";
import api from "@/lib/api";

export default {
  props: {
    vatid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      docLoading: false,
      doc_contract_base64: null,
    };
  },
  computed: {
    project() {
      return JSON.parse(localstorage.getItem("currentProj"));
    },
    filename() {
      const { project } = this;

      return project.doc_contract ? project.doc_contract.split("/")[1] : "-";
    },
    filelink() {
      const { project, formatFile, doc_contract_base64 } = this;
      const fileFormat = project.doc_contract
        ? formatFile(project.doc_contract.split(".").reverse()[0])
        : "image/jpg";

      // return data:image/png;base64,asdasd...
      return "data:" + fileFormat + ";base64," + doc_contract_base64;
    },
  },
  mounted() {
    this.getDocBase64();
  },
  methods: {
    formatFile(format) {
      switch (format) {
        case "png":
          return "image/png";

        case "pdf":
          return "application/pdf";

        default:
          return "image/jpg";
      }
    },
    uppercaseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    formatPostpaidType(type) {
      return type === "fixed" ? "Postpaid Fixed" : "Postpaid Usage Based";
    },
    async getDocBase64() {
      this.docLoading = true;

      const projid =
        this.project && this.project !== "undefined" ? this.project.id : "";

      if (projid) {
        try {
          const res = await api.GET("/user/project/doc-contract/" + projid);

          const { doc_contract_base64 } = res.data;

          this.doc_contract_base64 = doc_contract_base64;

          // this.project = res.data;
          // console.log("getDocBase64", res.data);
        } catch (err) {
          let errmsg =
            "Sorry, an error occurred while displaying document contract";
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
      }

      this.docLoading = false;
    },
  },
};
</script>

<style scoped>
.vpc-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
</style>
