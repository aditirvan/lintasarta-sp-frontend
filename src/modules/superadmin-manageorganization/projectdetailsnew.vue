<template>
  <v-dialog persistent max-width="900" v-model="dialogDetail">
    <v-card flat class="rounded-lg pa-0">
      <v-card-text class="pa-7">
        <v-row>
          <v-col>
            <div class="headline font-weight-bold font--text">Detail Project</div>
          </v-col>
        </v-row>

        <!-- <p v-if="loading" class="text-center">
          <beat-loader color="gray" size="10px" class="mr-2" />
        </p> -->

        <template v-if="project">
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
            </v-row>

            <v-row>
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
              <v-col v-if="project.postpaid_type === 'fixed'">
                <p><b>Postpaid Type</b></p>

                <p>
                  {{ uppercaseFirstLetter(project.postpaid_type) }}
                </p>
              </v-col> 

              <v-col v-if="project.postpaid_type !== 'fixed'">
                <p><b>Business VAT ID</b></p>
                <p> {{ project.vat_id }} </p>
              </v-col>
            </v-row>

            <v-row v-if="project.postpaid_type === 'fixed'">
            <v-col>
              <p><b>Business VAT ID</b></p>
              <p> {{ project.vat_id }} </p>
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

              <v-col v-if="isSuperAdmin && project.postpaid_type === 'fixed'">
                <p><b>Fixed Price per Cycle</b></p>

                <p>
                  IDR
                  {{
                    project.fixed_billing_price_per_month.toLocaleString("id-ID")
                  }}
                </p>
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
                    v-if="project.doc_contract && project.doc_contract_base64"
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

            <v-row>
              <v-col>
                <!-- empty div for spacing -->
              </v-col>

              <v-col>
                <v-btn
                  depressed
                  block
                  height="58"
                  class="secondary"
                  @click="onBack()"
                >
                  <span class="fz-16px">Back</span>
                </v-btn>
              </v-col>
            </v-row>

          <!-- <p v-else class="text-center">No data</p> -->
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";

export default {
  props: {
    dialogDetail: {
      type: Boolean,
      default: false,
    },
    dataDetail: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      docLoading: false,
      project: null,
    };
  },
  computed: {
    filename() {
      const { project } = this;

      return project.doc_contract ? project.doc_contract.split("/")[1] : "-";
    },
    filelink() {
      const { project } = this;
      const fileFormat = project.doc_contract
        ? this.formatFile(project.doc_contract.split(".").reverse()[0])
        : "image/jpg";

      // return data:image/png;base64,asdasd...
      return "data:" + fileFormat + ";base64," + project.doc_contract_base64;
    },
    isSuperAdmin() {
      const role = localstorage.getItem("role");
      const isSuperAdmin = role && role === "Superadmin";

      return isSuperAdmin;
    },
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
    async getProject() {
      console.log("masukkk")
      this.loading = true;

      try {
        const res = await api.GET(
          "/user/project/detail/" + this.dataDetail.id
        );
        this.project = { ...this.project, ...res.data };
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying project";
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
    async getDocBase64() {
      this.docLoading = true;

      try {
        const res = await api.GET(
          "/user/project/doc-contract/" + this.dataDetail.id
        );

        const { doc_contract_base64 } = res.data;

        this.project = { ...this.project, doc_contract_base64 };

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

      this.docLoading = false;
    },
    uppercaseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    formatPostpaidType(type) {
      return type === "fixed" ? "Postpaid Fixed" : "Postpaid Usage Based";
    },
    onBack() {
      this.$emit("update:dialog-detail", false)
    }
  },
  mounted() {
    this.getProject();
    this.getDocBase64();
  },
};
</script>
