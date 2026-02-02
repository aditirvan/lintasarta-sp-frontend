<template>
  <v-card class="rounded-lg elevation-0">
    <v-container class="px-7 py-4" fluid>
      <v-row>
        <v-col>
          <div class="headline font-weight-bold font--text">Edit Project</div>
        </v-col>
      </v-row>

      <p v-if="loading" class="text-center">
        <beat-loader color="gray" size="10px" class="mr-2" />
      </p>

      <template v-else>
        <v-row>
        <v-col id="col_name">
            <p><b>Project Name</b></p>

            <v-text-field
              v-model="name"
              :error-messages="name ? '' : name_error"
              outlined
              placeholder="Project Name"
              :disabled="loading"
              maxlength="30"
            />
          </v-col>

          <v-col  id="col_payment_method">
            <p><b>Payment Method</b></p>

            <v-radio-group
              v-model="payment_method"
              row
              :disabled="loading || activationDateExceeded"
              :filled="loading || activationDateExceeded"
            >
              <v-row>
                <v-col v-if="!hidePrepaid">
                  <v-radio
                    label="Prepaid"
                    value="prepaid"
                    @click="paymentMethodChange('prepaid')"
                  >
                    <template v-slot:label>
                      <span class="fs-14">Prepaid</span>
                    </template>
                  </v-radio>
                </v-col>

                <v-col>
                  <v-radio
                    label="Postpaid"
                    value="postpaid"
                    @click="paymentMethodChange('postpaid')"
                  >
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

            <v-radio-group
              v-model="postpaid_type"
              row
              :disabled="loading || activationDateExceeded"
              :filled="loading || activationDateExceeded"
            >
              <v-row>
                <v-col>
                  <v-radio
                    label="Usage Based"
                    value="usage"
                    @click="postpaidTypeChange('usage')"
                    @change="clear_network_number_error"
                  >
                    <template v-slot:label>
                      <span class="fs-14">Usage Based</span>
                    </template>
                  </v-radio>
                </v-col>

                <v-col>
                  <v-radio
                    label="Fixed"
                    value="fixed"
                    @click="postpaidTypeChange('fixed')"
                  >
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

          <v-col
            id="col_fixed_billing_price_per_month">
            <p><b>Fixed Price per Cycle</b></p>

            <v-text-field
              :class="{ hideinput: pricepermonthfocus === false }"
              @focus="pricepermonthfocus = true"
              @blur="pricepermonthfocus = false"
              v-model.number="fixed_billing_price_per_month"
              outlined
              placeholder="Fixed Price per Cycle (number only)"
              @keypress="isNumber($event)"
              :disabled="loading || activationDateExceeded"
              :filled="loading || activationDateExceeded"
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

        <v-row v-if="postpaid_type === 'fixed'">
          <v-col>
            <!-- empty div for spacing -->
          </v-col>

          <v-col id="col_postpaid_fixed_type">
            <p><b>Postpaid Fixed Type</b></p>

            <v-radio-group
              v-model="postpaid_fixed_type"
              row
              :disabled="loading || activationDateExceeded"
              :filled="loading || activationDateExceeded"
            >
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

        <v-row>
        <v-col
            id="col_description">
            <p><b>Description Project</b></p>

            <v-textarea
              v-model="description"
              :error-messages="description ? '' : description_error"
              outlined
              placeholder="Description Project"
              :disabled="loading"
            />
          </v-col>

          <v-col
            id="col_dateInput">
            <p><b>Activation Date</b></p>

            <v-menu
              ref="menu"
              v-model="dateInput"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  id="service_activation_date"
                  class="hideinput2"
                  v-model="service_activation_date"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  :error-messages="
                    service_activation_date ? '' : service_activation_date_error
                  "
                  :disabled="loading || activationDateExceeded"
                  :filled="loading || activationDateExceeded"
                >
                  <template v-slot:prepend-inner>
                    <span
                      class="font--text"
                      @click="
                        () => {
                          if (!activationDateExceeded) {
                            dateInput = true;
                          }
                        }
                      "
                      style="cursor: pointer"
                    >
                      {{
                        service_activation_date
                          ? $moment(service_activation_date).format(
                              "DD/MM/YYYY"
                            )
                          : "Null"
                      }}
                    </span>
                  </template>
                </v-text-field>
              </template>

              <v-date-picker
                v-model="service_activation_date"
                no-title
                scrollable
                @input="dateInput = false"
              />
            </v-menu>
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
              :disabled="loading"
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
                interval_billing_per_month
                  ? ''
                  : interval_billing_per_month_error
              "
              outlined
              placeholder="Interval Billing (number only)"
              :disabled="loading || activationDateExceeded"
              :filled="loading || activationDateExceeded"
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
              placeholder="Invoice Due Periode  (number only)"
              :disabled="loading || activationDateExceeded"
              :filled="loading || activationDateExceeded"
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

              <input
                ref="doc"
                type="file"
                class="d-none"
                @change="onChangeDoc"
              />

              <span>{{ docName }}</span>
            </div>

            <p v-if="doc_contract_error" class="error--text mt-4">
              {{ doc_contract_error }}
            </p>
          </v-col>
        </v-row>

        <div v-if="voucherDiscountProject">
          <v-divider />
          <div class="headline font-weight-bold font--text pt-8">Service Discount</div>
          <div class="pt-6">
            <div>
              <p class="font-weight-bold">Choose Type Instance</p>
              <v-radio-group v-model="discount_detail_type" row >
                <v-radio label="Instance Based" :value="VoucherDiscountDetailType.INSTANCE_BASED" class="pe-4"/>
                <v-radio label="Instance Flavor" :value="VoucherDiscountDetailType.INSTANCE_FLAVOR"/>
              </v-radio-group>
            </div>

            <div v-if="discount_detail_type === VoucherDiscountDetailType.INSTANCE_BASED">
              <v-row>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount Instance Based</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_instance_based"
                    suffix="%"
                    :error-messages="
                      $v.discount_instance_based.$errors.length ? $v.discount_instance_based.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount Root Disk</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_root_disk"
                    suffix="%"
                    :error-messages="
                      $v.discount_root_disk.$errors.length ? $v.discount_root_disk.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount OS Charging</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_os_charging"
                    suffix="%"
                    :error-messages="
                      $v.discount_os_charging.$errors.length ? $v.discount_os_charging.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount Object Storage</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_object_storage"
                    suffix="%"
                    :error-messages="
                      $v.discount_object_storage.$errors.length ? $v.discount_object_storage.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount Storage</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_storage"
                    suffix="%"
                    :error-messages="
                      $v.discount_storage.$errors.length ? $v.discount_storage.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount Snapshot</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_snapshot"
                    suffix="%"
                    :error-messages="
                      $v.discount_snapshot.$errors.length ? $v.discount_snapshot.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount Floating IP</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_floating_ip"
                    suffix="%"
                    :error-messages="
                      $v.discount_floating_ip.$errors.length ? $v.discount_floating_ip.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>

            <div v-else-if="discount_detail_type === VoucherDiscountDetailType.INSTANCE_FLAVOR">
              <v-row>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount Root Disk</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_root_disk"
                    suffix="%"
                    :error-messages="
                      $v.discount_root_disk.$errors.length ? $v.discount_root_disk.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount OS Charging</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_os_charging"
                    suffix="%"
                    :error-messages="
                      $v.discount_os_charging.$errors.length ? $v.discount_os_charging.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount Object Storage</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_object_storage"
                    suffix="%"
                    :error-messages="
                      $v.discount_object_storage.$errors.length ? $v.discount_object_storage.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount Storage</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_storage"
                    suffix="%"
                    :error-messages="
                      $v.discount_storage.$errors.length ? $v.discount_storage.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount Snapshot</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_snapshot"
                    suffix="%"
                    :error-messages="
                      $v.discount_snapshot.$errors.length ? $v.discount_snapshot.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="pb-0 pt-0">
                  <p class="font-weight-bold">Discount Floating IP</p>
                  <v-text-field
                    placeholder="0"
                    outlined
                    single-line
                    type="number"
                    v-model.number="discount_floating_ip"
                    suffix="%"
                    :error-messages="
                      $v.discount_floating_ip.$errors.length ? $v.discount_floating_ip.$errors[0].$message : ''
                    "
                  ></v-text-field>
                </v-col>
              </v-row>

              <div class="pt-4">
                <p class="font-weight-bold">Discount Flavor</p>
                <v-row>
                  <v-col cols="12" md="5" class="pt-0">
                    <p>Flavor</p>
                    <v-select
                      placeholder="Choose Instance Flavor"
                      :items="instanceFlavorsList"
                      v-model="selected_flavor"
                      item-text="flavor_name"
                      return-object
                      outlined
                    ></v-select>
                  </v-col>
                  
                  <v-col cols="12" md="5" class="pt-0">
                    <p>Percentage</p>
                    <v-text-field
                      placeholder="0"
                      outlined
                      single-line
                      type="number"
                      v-model.number="selected_flavor_discount"
                      suffix="%"
                      :error-messages="
                        $v.selected_flavor_discount.$errors.length ? $v.selected_flavor_discount.$errors[0].$message : ''
                      "
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="2" class="mb-2 d-flex align-end">
                    <v-btn
                      @click="addDiscountFlavor"
                      depressed
                      outlined
                      height="55"
                      width="100%"
                      class="secondary white--text"
                    >
                      Add
                    </v-btn>
                  </v-col>
                </v-row>
              </div>

              <v-data-table
                :headers="discountFlavorHeader"
                :items="discount_instance_flavors"
              >
                <template v-slot:item.flavor_name="{ item }">
                  <div>{{item.package_instance.flavor_name}}</div>
                </template>
                <template v-slot:item.discount="{ item }">
                  <div>{{item.discount}} %</div>
                </template>
                <template v-slot:item.sn="{ index }">
                  <v-btn
                    @click="deleteDiscountFlavor(index)"
                    depressed
                    outlined
                    height="55"
                    width="150"
                    class="error white--text"
                  >
                    Delete
                  </v-btn>
                </template>
              </v-data-table>
            </div>
            
          </div>
          </div>

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
              <span class="fz-16px">Edit</span>

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
      </template>
    </v-container>
  </v-card>
</template>

<script>
import api from "@/lib/api";
import { VoucherDiscountDetailType, VoucherDiscountType } from "@/modules/superadmin-managevoucher/type"
import { required, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useNamespacedMutations } from "vuex-composition-helpers";
import { SUPERADMIN } from "../superadmin/namespace"
import { PROJECT } from "../project/namespace";
import findprojectbyname from "../project/findprojectbyname";

// const hidePrepaid = process.env.VUE_APP_DEV_MODE !== 'fase-1.3'
const hidePrepaid = false;

export default {
  setup () {        
    const { setCurrentProj } = useNamespacedMutations(SUPERADMIN, [
      "setCurrentProj",
    ]);
    const { setprojectname } = useNamespacedMutations(PROJECT, [
      "setprojectname",
    ]);
    return { $v: useVuelidate(), setprojectname, setCurrentProj }
  },
  data() {
    return {      
      pricepermonthfocus: false,
      hidePrepaid,
      loading: false,
      name: "",
      payment_method: "postpaid",
      postpaid_type: null,
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
      description_error: "",
      service_activation_date_error: "",
      network_number_error: "",
      interval_billing_per_month_error: "",
      doc_contract_error: "",
      // mas den
      fixed_billing_price_per_month: 0,
      postpaid_fixed_type: "prorate",
      // service_activation_date_from_api
      service_activation_date_from_api: null,

      voucherDiscountProject : null,
      instanceFlavorsList : [],
      selected_flavor : {},
      selected_flavor_discount : 0,
      VoucherDiscountDetailType,
      VoucherDiscountType,
      voucher_discount_project_id : "",
      discount_type : VoucherDiscountType.INTERNAL,
      limit_discount : 0,
      discount_detail_type : VoucherDiscountDetailType.INSTANCE_BASED,
      discount_instance_based : 0,
      discount_root_disk: 0,
      discount_os_charging: 0,
      discount_object_storage : 0,
      discount_storage : 0,
      discount_snapshot : 0,
      discount_floating_ip : 0,
      discount_instance_flavors : [],
      discountFlavorHeader : [
        { text: "Flavor Name", value: "flavor_name" },
        { text: "Percentage", value: "discount", align: 'end' },
        { text: "Action", value: "sn", align: 'center', width:"300" },
      ],
      submitted: false,
    };
  },
  computed: {
    organization_id() {
      return this.$route.params.organizationid;
    },
    projid() {
      return this.$route.params.project;
    },
    activationDateExceeded() {
      return (
        this.service_activation_date_from_api &&
        new Date(this.service_activation_date_from_api).getTime() <=
          new Date().getTime()
      );
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
    async editVoucherDiscountProject() {
      try{
        let payload = {
          id: this.voucher_discount_project_id,
          voucher_discount_detail: {
            type: this.discount_detail_type,
            root_disk: this.discount_root_disk,
            os_charging: this.discount_os_charging,
            storage: this.discount_storage,
            object_storage: this.discount_object_storage,
            floating_ip: this.discount_floating_ip,
            snapshot: this.discount_snapshot,
          },
        };

        if(this.discount_detail_type === VoucherDiscountDetailType.INSTANCE_BASED) {
          payload.voucher_discount_detail.instance_based = this.discount_instance_based
        }

        if(this.discount_detail_type === VoucherDiscountDetailType.INSTANCE_FLAVOR) {
          payload.voucher_discount_detail.instance_flavors = this.discount_instance_flavors
        }

        await api.PUT(
          `/superadmin/voucher-discount/project/${this.voucher_discount_project_id}`,
          payload
        );
        return null

      }catch(err) {
        let errmsg = "Sorry, an error occurred while submitting data";
        const thereIsErrorMessage = err && err.response && err.response.data;

        if (thereIsErrorMessage && err.response.data.data) {
          errmsg = err.response.data.data[0].toUpperCase() + err.response.data.data.slice(1);
        }

        if (thereIsErrorMessage) {
          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }
        
        return err
      }
    },
    async submit() {
      
      this.submitted = true

      let requiredFields = [
        "name",
        "payment_method",
        "description",
        // "service_activation_date",
        "interval_billing_per_month",
        // "doc_contract",
      ];

      if (this.payment_method === "postpaid") {
        requiredFields.push("service_activation_date");
      } else {
        requiredFields = requiredFields.filter(
          (field) => field !== "network_number" && field !== "doc_contract"
        );
      }
      
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

      // if (this.postpaid_type === "fixed") {
      //   requiredFields.push("fixed_billing_price_per_month");
      // }

      // clear errors
      [...requiredFields, "service_activation_date"].forEach((field) => {
        if (!this[field]) {
          this[field + "_error"] = "";
        }
      });

      const noEmptyField = requiredFields.every((field) => this[field]);

      if (noEmptyField) {
        this.loading = true;

        // edit voucher discount
        if (this.voucher_discount_project_id) {
          const err = await this.editVoucherDiscountProject()
          if (err) {
            this.loading = false;
            return
          }
        }

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
          } = this;

          const payload = {
            organization_id,
            name,
            payment_method,
            description,
            postpaid_type: payment_method === "postpaid" ? postpaid_type : null,
            postpaid_fixed_type:
              postpaid_type === "fixed" ? postpaid_fixed_type : null,
            service_activation_date: service_activation_date || null,
            network_number,
            interval_billing_per_month,
            doc_contract: doc_contract || null,
            invoice_due_periode_per_day: invoice_due_periode_per_day || 30,
            fixed_billing_price_per_month,
          };

          await api.PUT(
            `/superadmin/projects/${organization_id}/${this.projid}`,
            payload
          );       
                    
          const project = await findprojectbyname(this.projid);   
          if (project) {
            this.setCurrentProj(project);
          }
          
          this.$router.push("/organization-detail/" + organization_id);

          this.$store.dispatch(
            "HOMEPAGE/showSuccessToast",
            "Project has been successfully edit",
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
        // window.scrollTo({ top: 0, behavior: "smooth" });

        let i=0;
        requiredFields.forEach((field) => {
          if (!this[field]) {
            if(i==0){   
              let element = document.getElementById("col_"+field);
              element.scrollIntoView({behavior: "smooth"});
              i++;
            }  
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
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

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
    async getProject() {
      this.loading = true;

      try {
        const res = await api.GET("/user/project/detail/" + this.projid);
        const data = res.data;
        const fields = [
          "name",
          "payment_method",
          "description",
          "postpaid_type",
          "service_activation_date",
          "network_number",
          "interval_billing_per_month",
          "doc_contract",
          "invoice_due_periode_per_day",
          "fixed_billing_price_per_month",
          "postpaid_fixed_type",
        ];

        fields.forEach((field) => {
          if (field === "service_activation_date") {
            this.service_activation_date = data.service_activation_date
              ? this.$moment(data.service_activation_date).format("YYYY-MM-DD")
              : null;

            this.service_activation_date_from_api = data.service_activation_date
              ? this.$moment(data.service_activation_date).format("YYYY-MM-DD")
              : null;
          } else if (field === "doc_contract") {
            this[field] = "";
          } else {
            this[field] = data[field];
          }
        });

        this.docName = data.doc_contract
          ? data.doc_contract.split("/")[1]
          : "-";
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
    paymentMethodChange(method) {
      if (method === "postpaid") {
        this.postpaid_type = "usage";
      } else {
        this.postpaid_type = null;
      }
    },
    postpaidTypeChange(method) {
      if (method === "fixed") {
        this.postpaid_fixed_type = "prorate";
      } else {
        this.postpaid_fixed_type = null;
      }
    },
    async getvoucherDiscountProject() {
      this.loading = true;

      try {
        const res = await api.GET(`/superadmin/voucher-discount/project/${this.projid}`);
        if (res.code === 200) {
          this.voucherDiscountProject = res.data
          const voucherDiscount = this.voucherDiscountProject.voucher_discount
          const discountDetail = this.voucherDiscountProject.voucher_discount_detail

          this.voucher_discount_project_id = this.voucherDiscountProject.id
          this.discount_type = voucherDiscount.type
          this.limit_discount = voucherDiscount.limit_discount

          this.discount_detail_type = discountDetail.type
          this.discount_root_disk = discountDetail.root_disk
          this.discount_os_charging = discountDetail.os_charging
          this.discount_object_storage = discountDetail.object_storage
          this.discount_storage = discountDetail.storage
          this.discount_snapshot = discountDetail.snapshot
          this.discount_floating_ip = discountDetail.floating_ip

          if(discountDetail.type === VoucherDiscountDetailType.INSTANCE_BASED) {
            this.discount_instance_based = discountDetail.instance_based
          }

          if(discountDetail.type === VoucherDiscountDetailType.INSTANCE_FLAVOR) {
            this.discount_instance_flavors = discountDetail.instance_flavors
          }
        }
      } catch (err) {
        this.loading = false;
        return
      } 

      this.loading = false;
    },
    async getInstanceFlavors() {
      this.loading = true;

      try {
        const res = await api.GET(`/flavor/instance-list`);
        if (res.code === 200) {
          this.instanceFlavors = res.data
        }
      } catch (err) {
        this.loading = false;
        return
      } 

      this.loading = false;
    },
    filterInstanceList() {
      const selectedInstanceIDs = this.discount_instance_flavors.map(instance => instance.package_instance_id)
      this.instanceFlavorsList = this.instanceFlavors.filter(instance => !selectedInstanceIDs.includes(instance.id))
    },
    addDiscountFlavor() {
      if (!this.selected_flavor.id) return
      // push selected instance to list
      this.discount_instance_flavors.push(
        {
          id: "",
          package_instance_id: this.selected_flavor.id,
          package_instance: this.selected_flavor,
          discount: this.selected_flavor_discount,
          voucher_discount_project_id: this.voucher_discount_project_id
        }
      )
      // reset input value
      this.selected_flavor = {}
      this.selected_flavor_discount = 0

      // remove selected instance from list so user cannot choice the same item twice
      this.filterInstanceList()
    },
    deleteDiscountFlavor(index) {
      // remove selected instance from list
      this.discount_instance_flavors = this.discount_instance_flavors.filter((instance, i) => i !== index)

      // add selected instance back to list
      this.filterInstanceList()
    }
  },
  validations() {
    const notLessThanZero = helpers.withMessage('Cannot be minus', (val) => {
      return val >= 0 ? true : false
    })

    const shouldLessThanDiscountLimit = helpers.withMessage('Must be less or equal than limit discount', (val) => {
      return (this.discount_type !== VoucherDiscountType.RESELLER || this.limit_discount <= 0) || (val >= 0 && val <= this.limit_discount)
    })

    return {
      discount_detail_type: { required },
      discount_instance_based: { 
        required,
        $autoDirty: true,
        notLessThanZero,
        shouldLessThanDiscountLimit,
      },
      discount_root_disk: { 
        required,
        $autoDirty: true,
        notLessThanZero,
        shouldLessThanDiscountLimit,
      },
      discount_os_charging: { 
        required,
        $autoDirty: true,
        notLessThanZero,
        shouldLessThanDiscountLimit,
      },
      discount_object_storage: { 
        required,
        $autoDirty: true,
        notLessThanZero,
        shouldLessThanDiscountLimit,
      },
      discount_storage: { 
        required,
        $autoDirty: true,
        notLessThanZero,
        shouldLessThanDiscountLimit,
      },
      discount_snapshot: { 
        required,
        $autoDirty: true,
        notLessThanZero,
        shouldLessThanDiscountLimit,
      },
      discount_floating_ip: { 
        required,
        $autoDirty: true,
        notLessThanZero,
        shouldLessThanDiscountLimit,
      },
      selected_flavor: { 
        required,  
        $autoDirty: true,
        notEmpty: helpers.withMessage('Instance flavor cannot be empty', (val) => {
          return val.id !== ""
        }) 
      },
      selected_flavor_discount: { 
        required,
        $autoDirty: true,
        notLessThanZero,
        shouldLessThanDiscountLimit, 
      },
    }
  },
  async mounted() {
    this.getProject();
    await this.getvoucherDiscountProject()
    await this.getInstanceFlavors()
    this.filterInstanceList()
  },
};
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
