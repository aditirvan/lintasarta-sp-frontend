<template>
  <v-card class="rounded-lg elevation-0">
    <v-container class="px-7 py-4" fluid>
      <v-row>
        <v-col>
          <div class="headline font-weight-bold font--text">Add Project</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col id="col_name">
          <p><b>Project Name</b></p>

          <v-text-field
            v-model="name"
            :error-messages="(name && name.length >= 5) ? '' : name_error"
            outlined
            placeholder="Project Name"
            maxlength="30"
          />
        </v-col>

        <v-col id="col_vatid">
          <p><b>Business VAT ID</b></p>

          <v-text-field
            maxlength="20"
            @keydown="vatidKeydown($event)"
            flat
            outlined
            v-model="vatid"
            placeholder="Business VAT ID"
            :error-messages="vatid ? '' : vatid_error"
            required
          />
        </v-col>

      </v-row>

      <v-row>
        <v-col md="6">
        </v-col>
        <v-col  id="col_payment_method">
          <p><b>Payment Method</b></p>

          <v-radio-group v-model="payment_method" row>
            <v-row>
              <v-col v-if="!hidePrepaid">
                <v-radio label="Prepaid" value="prepaid">
                  <template v-slot:label>
                    <span class="fs-14">Prepaid</span>
                  </template>
                </v-radio>
              </v-col>

              <v-col v-if="!hidePostpaid">
                <v-radio label="Postpaid" value="postpaid">
                  <template v-slot:label>
                    <span class="fs-14">Postpaid</span>
                  </template>
                </v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="payment_method === 'postpaid'">
        <v-col>
          <!-- empty div for spacing -->
        </v-col>

        <v-col id="col_postpaid_type">
          <p><b>Postpaid Type</b></p>

          <v-radio-group v-model="postpaid_type" row>
            <v-row>
              <v-col>
                <v-radio label="Usage Based" value="usage" @change="clear_network_number_error">
                  <template v-slot:label>
                    <span class="fs-14">Usage Based</span>
                  </template>
                </v-radio>
              </v-col>

              <v-col>
                <v-radio label="Fixed" value="fixed">
                  <template v-slot:label>
                    <span class="fs-14">Fixed</span>
                  </template>
                </v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="postpaid_type === 'fixed'">
        <v-col>
          <!-- empty div for spacing -->
        </v-col>

        <v-col id="col_postpaid_fixed_type">
          <p><b>Postpaid Fixed Type</b></p>

          <v-radio-group v-model="postpaid_fixed_type" row>
            <v-row>
              <v-col>
                <v-radio label="Prorate" value="prorate">
                  <template v-slot:label>
                    <span class="fs-14">Prorate</span>
                  </template>
                </v-radio>
              </v-col>

              <v-col>
                <v-radio label="Full Cycle" value="full_cycle">
                  <template v-slot:label>
                    <span class="fs-14">Full Cycle</span>
                  </template>
                </v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="postpaid_type === 'fixed'">
        <v-col>
          <!-- empty div for spacing -->
        </v-col>

        <v-col
            id="col_fixed_billing_price_per_month">
          <p><b>Fixed Price per Cycle</b></p>

          <v-text-field
            :class="{ hideinput: pricepermonthfocus === false }"
            @focus="pricepermonthfocus = true"
            @blur="pricepermonthfocus = false"
            v-model.number="fixed_billing_price_per_month"
            :error-messages="error_fixed_billing"
            outlined
            placeholder="Fixed Price per Cycle (number only)"
            @keypress="isNumber($event)"
            @input="clear"
          >
            <template v-slot:prepend-inner>
              <span>
                <span class="font--text">IDR | </span>
                {{
                  pricepermonthfocus
                    ? ""
                    : fixed_billing_price_per_month.toLocaleString("id-ID")
                }}
              </span>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col 
            id="col_selected_region">
          <p class="font-weight-bold">Choose Region</p>
          <v-select
            v-model="selected_region"
            outlined
            :items="selectRegions"
            placeholder="Choose Region"         
            :error-messages="selected_region ? '' : selected_region_error"   
          >
          </v-select>          
        </v-col> 

        <v-col
            id="col_dateInput">
          <p><b>Activation Date</b></p>

          <v-menu
            v-model="dateInput"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                id="col_service_activation_date"
                class="hideinput2"
                v-model="service_activation_date"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                :error-messages="
                  service_activation_date ? '' : service_activation_date_error
                "
                :disabled="loading"
              >
                <template v-slot:prepend-inner>
                  <span
                    class="font--text"
                    @click="dateInput = true"
                    style="cursor: pointer"
                  >
                    {{ $moment(service_activation_date).format("DD/MM/YYYY") }}
                  </span>
                </template>
              </v-text-field>
            </template>

            <v-date-picker
              v-model="service_activation_date"
              id="col_service_activation_date"
              no-title
              scrollable
              @input="dateInput = false"
            />
          </v-menu>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6"
            id="col_selected_voucher_discount_code">
          <p class="font-weight-bold">Voucher Discount Code</p>
          <v-autocomplete
            :items="voucherDiscountCodeList"
            v-model="selected_voucher_discount_code"
            item-text="code"
            item-value="code"
            placeholder="Select a voucher discount code"
            outlined
            >
            <template v-slot:append-item>
              <div v-intersect="endIntersectVoucherDiscountCodes" />
            </template>
          </v-autocomplete>         
        </v-col> 
      </v-row>

      <v-row>
        <v-col
            id="col_description">
          <p><b>Description Project</b></p>

          <v-textarea
            v-model="description"
            :error-messages="description ? '' : description_error"
            outlined
            placeholder="Description Project"
          />
        </v-col>
      </v-row>

      <div class="mt-4 mb-4" :style="{ borderTop: '1px solid lightgray' }" />

      <v-row>
        <v-col
            id="col_network_number">
          <p><b>Service Instance</b></p>
          <v-text-field
            v-model="network_number"
            :error-messages="renderNetworkNumberError()"
            outlined
            placeholder="Service Instance"
          />
        </v-col>

        <v-col>
          <!-- empty div for spacing -->
        </v-col>
      </v-row>

      <v-row>
        <v-col
            id="col_interval_billing_per_month">
          <p><b>Interval Billing</b></p>

          <v-text-field
            v-model.number="interval_billing_per_month"
            :error-messages="
              interval_billing_per_month ? '' : interval_billing_per_month_error
            "
            outlined
            placeholder="Interval Billing (number only)"
            @keypress="isNumber($event)"
          >
            <template v-slot:append>
              <span class="font--text">Month</span>
            </template>
          </v-text-field>
        </v-col>

        <v-col
            id="col_invoice_due_periode_per_day">
          <p><b>Invoice Due Periode</b></p>

          <v-text-field
            v-model.number="invoice_due_periode_per_day"
            outlined
            placeholder="Invoice Due Periode (number only)"
            @keypress="isNumber($event)"
          >
            <template v-slot:append>
              <span class="font--text">Day</span>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col id="col_doc">
          <p><b>Document Contract</b></p>

          <div class="d-flex align-center">
            <div style="width: 150px" class="mr-4">
              <v-btn
                depressed
                block
                height="40"
                class="secondary"
                :disabled="loading"
                @click="$refs.doc.click()"
              >
                Upload File
              </v-btn>
            </div>

            <input ref="doc" type="file" class="d-none" @change="onChangeDoc" />

            <span>{{ docName }}</span>
          </div>

          <p v-if="doc_contract_error" class="error--text mt-4">
            {{ doc_contract_error }}
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn
            depressed
            style="background-color: #a5b3bf !important"
            block
            height="58"
            class="primary"
            :to="'/organization-detail/' + organization_id"
            exact
            :disabled="loading"
          >
            <span class="fz-16px">Cancel</span>

            <!-- loading indicator -->
            <beat-loader
              v-if="loading"
              :loading="loading"
              :color="'white'"
              :size="'10px'"
              class="ml-2"
            />
          </v-btn>
        </v-col>

        <v-col>
          <v-btn
            depressed
            block
            height="58"
            class="secondary"
            :disabled="loading"
            @click="submit"
          >
            <span class="fz-16px">Create</span>

            <!-- loading indicator -->
            <beat-loader
              v-if="loading"
              :loading="loading"
              :color="'white'"
              :size="'10px'"
              class="ml-2"
            />
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { MANAGEVOUCHER } from "@/modules/superadmin-managevoucher/namespace";
import { useRegion } from "@/modules/instance/compositionapi/useregion";
const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

// const hidePrepaid = process.env.VUE_APP_DEV_MODE !== 'fase-1.3'

export default defineComponent({
  setup(){
    const { fetchVoucherDiscountCodes } = useNamespacedActions(MANAGEVOUCHER, [
      "fetchVoucherDiscountCodes"
    ])
    const { voucherDiscountCodes, voucherDiscountCodesPagination } = useNamespacedState(MANAGEVOUCHER, [
      "voucherDiscountCodes", "voucherDiscountCodesPagination"
    ])

    const voucherDiscountCodeList = ref([])

    const endIntersectVoucherDiscountCodes = async (isIntersecting) => {
      if (isIntersecting) {
        if (voucherDiscountCodesPagination.value.page >= voucherDiscountCodesPagination.value.totalpage) {
          return
        }

        const requestPage = voucherDiscountCodesPagination.value.page + 1
        await fetchVoucherDiscountCodes({page:requestPage, itemsPerPage: 50})
        voucherDiscountCodeList.value = [...voucherDiscountCodeList.value, ...voucherDiscountCodes.value]
      }
    }   

    const { selectregionsbystatus: selectRegions, fetchregionbystatus } = useRegion()

    onMounted(async () => {
      fetchregionbystatus()
      await fetchVoucherDiscountCodes()
      voucherDiscountCodeList.value = [...voucherDiscountCodes.value]
    });    
    
    return {
      selectRegions,
      voucherDiscountCodeList,
      endIntersectVoucherDiscountCodes
    };
  },
  data() {
    const json = localstorage.getItem("currentOrg");
    const org = JSON.parse(json);

    return {
      pricepermonthfocus: false,
      hidePrepaid: !org.is_personal,
      hidePostpaid: org.is_personal,
      loading: false,
      name:"",
      vatid:"",
      payment_method: !org.is_personal ? "postpaid" : "prepaid",
      postpaid_type: !org.is_personal ? "usage" : null,
      description: "",
      dateInput: false, // date input
      service_activation_date: null,
      network_number: null,
      interval_billing_per_month: 1,
      invoice_due_periode_per_day: 30,
      doc_contract: "",
      docName: "",
      // errmsgs
      name_error: "",
      vatid_error: "",
      description_error: "",
      service_activation_date_error: "",
      network_number_error: "",
      interval_billing_per_month_error: "",
      doc_contract_error: "",
      // mas den
      fixed_billing_price_per_month: 0,
      error_fixed_billing: "",
      postpaid_fixed_type: "prorate",
      // voucher discount
      selected_voucher_discount_code: "",
      selecteds_voucher_discount_error: "",
      selected_region:"",
      selected_region_error: "",
      submitted: false,
    };
  },
  computed: {
    organization_id() {
      return this.$route.params.organizationid;
    },
  },
  methods: {
    isNumber(e) {
      const charCode = e.which ? e.which : e.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
      } else {
        return true;
      }
    },
    is_digit(val) {
      const reg = new RegExp(/^-?\d+\.?\d*$/)
      if(reg.test(val)){
        return true
      } else {
        return false
      }
    },
    renderNetworkNumberError() {
      if (!this.submitted) return ''

      if (this.postpaid_type === "fixed") {
        if (!this.network_number) return "Value is required"
      } 

      if (this.network_number) {
        if((!this.is_digit(this.network_number))) return "Value must be a number"
      }

      return ''
    },
    clear_network_number_error() {
      this.network_number_error=""
    },
    clear() {
      this.error_fixed_billing = "";
    },
    async submit() {

      this.submitted = true

      let requiredFields = [
        "name",
        "vatid",
        "payment_method",
        "description",
        "service_activation_date",
        "interval_billing_per_month",
        "doc_contract",
        "selected_region",
      ];

      if (this.payment_method === "postpaid") {
        requiredFields.push("service_activation_date");
      } else {
        requiredFields = requiredFields.filter(
          (field) => field !== "network_number" && field !== "doc_contract"
        );
      }

      // if (this.postpaid_type === "fixed") {
      //   requiredFields.push("fixed_billing_price_per_month");
      // }
      
      if (this.postpaid_type === "fixed") {
        requiredFields.push("network_number");
      } else {
        requiredFields.filter(value => value !== "network_number")
      }

      if (this.network_number){
        if (!this.is_digit(this.network_number)){
          this.network_number_error="value must be a number"
          return false
        } else {
          this.network_number_error=""
        }
      }

      if (this.postpaid_type === "fixed") {
        const type = typeof this.fixed_billing_price_per_month
        if (type == "string") {
          this.error_fixed_billing = "Value is required"
          0({ top: 0, behavior: "smooth" });
          return false
        } 
      }

      // clear errors
      let i=0;
      requiredFields.forEach((field) => {
        if (!this[field]) {
          if(i==0){   
            let element = document.getElementById("col_"+field);
            element.scrollIntoView({behavior: "smooth"});
            i++;
          }  
          this[field + "_error"] = "";
        }
      });

      const noEmptyField = requiredFields.every((field) => this[field]);

      if (this.name.length < 5) {
        this["name_error"] = "This field should be at least 5 long";
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "There is an empty field or error field"
        );
      } else 
      if (noEmptyField) {
        this.loading = true;

        try {
          const {
            organization_id,
            name,
            payment_method,
            description,
            postpaid_type,
            service_activation_date,
            network_number,
            interval_billing_per_month,
            doc_contract,
            invoice_due_periode_per_day,
            fixed_billing_price_per_month,
            postpaid_fixed_type,
            selected_voucher_discount_code,
            selected_region,
            vatid,
          } = this;

          const payload = {
            organization_id,
            name,
            payment_method,
            description,
            postpaid_type: payment_method === "postpaid" ? postpaid_type : null,
            postpaid_fixed_type:
              postpaid_type === "fixed" ? postpaid_fixed_type : null,
            service_activation_date,
            network_number,
            interval_billing_per_month,
            doc_contract,
            invoice_due_periode_per_day: invoice_due_periode_per_day || 30,
            fixed_billing_price_per_month,
            voucher_discount_code: selected_voucher_discount_code,
            region: selected_region.name,
            vat_id: vatid,
          };

          await api.POST("/superadmin/projects", payload);

          this.$router.push("/organization-detail/" + organization_id);

          this.$store.dispatch(
            "HOMEPAGE/showSuccessToast",
            "Project has been successfully created",
            { root: true }
          );
        } catch (err) {
          let errmsg = "Sorry, an error occurred while submitting data";
          const thereIsErrorMessage = err && err.response && err.response.data;

          if (thereIsErrorMessage && err.response.data.data) {
            errmsg = err.response.data.data;
          }

          if (
            thereIsErrorMessage &&
            err.response.data.data !== "record not found"
          ) {
            this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
          }
        }

        this.loading = false;
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });

        requiredFields.forEach((field) => {
          if (!this[field]) {
            this[field + "_error"] = "Value is required";
          }
        });

        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "There is an empty field or error field"
        );
      }
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function () {
          resolve(reader.result);
        };

        reader.onerror = function (error) {
          reject(error);
        };
      });
    },
    async onChangeDoc(e) {
      if (e.target.files[0].size / (1024 * 1024) > 10) {
        this.doc_contract_error = "File size is too large (max 10MB)";
      } else if (!allowedTypes.includes(e.target.files[0].type)) {
        this.doc_contract_error = "Only jpg, png, pdf files are allowed";
      } else {
        this.docName = e.target.files[0].name;
        this.doc_contract = await this.getBase64(e.target.files[0]);
        this.doc_contract_error = "";
      }
    },
    vatidKeydown(e) {
      if (/[^a-zA-Z0-9]/g.test(e.key)) {
        e.preventDefault();
      }
    },
  },
  mounted() {
    this.service_activation_date = this.$moment().format("YYYY-MM-DD");
  },
  watch: {
    payment_method(newVal) {
      if (newVal === "postpaid") {
        this.postpaid_type = "usage";
      } else {
        this.postpaid_type = null;
      }
    },
    postpaid_type(newVal) {
      if (newVal === "fixed") {
        this.postpaid_fixed_type = "prorate";
      } else {
        this.postpaid_fixed_type = null;
      }
    },
    vatid(newVal) {
      this.vatid = newVal.replace(/[^a-zA-Z0-9]/g, '');
    },
  },
});
</script>

<style scoped>
.hideinput2 ::v-deep input {
  opacity: 0;
}

.fz-16px {
  font-size: 16px;
}
</style>

<style lang="scss" scoped>
.hideinput {
  ::v-deep input {
    position: relative;
    bottom: 50px;
    z-index: -2;
  }
}
</style>
