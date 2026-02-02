<template>
  <div>
    <!-- top white box (Balance) -->
    <BalanceAndHistoryBtn v-if="balance" :balance="balance" />

    <!-- bottom white box (Choose Payment) -->    
    <v-card flat class="rounded-lg pa-4 mt-3" v-if="!read_only">
      <v-card-text>
        <p class="fz-21 font-weight-bold">Choose Payment</p>
      </v-card-text>

      <!-- User Project CC -->
      <v-card v-if="recurringPaymentEnabled && projectCCMeta" class="pa-3 mx-3 border-card border-success" max-width="500" outlined>
        <v-row>
          <div class="flex-grow-1 ma-4">
            <div class="d-flex">
              <v-icon color="primary" class="mr-4">mdi-credit-card</v-icon>
              <div>
                <h3>My Credit Card</h3>
                <h6 class="font-blue">Payment Recurring</h6>
              </div>
            </div>
          </div>
          <v-switch v-model="projectCCMeta.is_active" @click.stop="onRecurringSwitchClick" inset></v-switch>
        </v-row>

        <table class="information">
          <tr>
            <td>Remark</td>
            <td>{{ `: ${projectCCMeta.remark}` }}</td>
          </tr>
          <tr>
            <td>Owner</td>
            <td>{{ `: ${projectCCMeta.owner}` }}</td>
          </tr>
          <tr v-if="projectCCMeta.card_number">
            <td>Credit Card Number</td>
            <td>{{ `: ${projectCCMeta.card_number}` }}</td>
          </tr>
          <tr v-if="projectCCMeta.card_holder_name">
            <td>Credit Card Holder</td>
            <td>{{ `: ${projectCCMeta.card_holder_name}` }}</td>
          </tr>
          <tr>
            <td>Last Payment</td>
            <td>{{ `: ${userProjectCCLastPayment}` }}</td>
          </tr>
        </table>

        <div class="mx-1 my-3 w-100">
          <v-btn
            v-if="balance && balance.total_outstanding"
            class="secondary fz-14"
            block
            @click="onPayNowClick()"
            :disabled="loading || !isUser"
          >
            Pay Now
          </v-btn>
        </div>
      </v-card>

      <v-card-text class="pt-0 mt-3">
        <v-row>
          <!-- proj name -->
          <v-col cols="6">
            <p><b>Project Name</b></p>
            <v-text-field
              v-model="project.name"
              outlined
              single-line
              label="Project"
              disabled
            ></v-text-field>
          </v-col>

          <!-- nominal balance -->
          <v-col v-if="isPrepaid" cols="6">
            <p><b>Nominal Balance</b></p>
            <v-text-field
              id="idr"
              flat
              outlined
              v-model.number="idr"
              @keypress="isNumber($event)"
              placeholder="IDR"
              required
              :disabled="!isUser"
              style="margin-bottom: 22px"
              :error-messages="idrError"
              @focus="additionalpricefocus = true"
              @blur="
                (e) => {
                  additionalpricefocus = false;
                  onChangeHandler(e);
                }
              "

              :class="{ hideinput: additionalpricefocus === false }"
            >
              <template v-slot:prepend-inner>
                <span>
                  <span class="font--text">IDR | </span>
                  <span v-if="!additionalpricefocus">
                    {{ toThousandsWithDotFormat(idr) }}
                  </span>
                </span>
              </template>
            </v-text-field>
          </v-col>

          <v-col v-if="isPostpaid" cols="6">
            <p><b>Outstanding Amount</b></p>
            <v-text-field
              id="idr"
              flat
              outlined
              v-model.number="idr"
              @keypress="isNumber($event)"
              placeholder="IDR"
              required
              disabled
              style="margin-bottom: 22px"
              :error-messages="idrError"
              @blur="onChangeHandler"
              class="hideinput"
            >
              <template v-slot:prepend-inner>
                <span>
                  <span class="font--text">IDR | </span>
                  {{ toThousandsWithDotFormat(idr) }}
                </span>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <!-- choose payment -->
          <v-col>
            <p><b>Choose Payment</b></p>
            <p v-if="paymentError" class="error--text">{{ paymentError }}</p>
            <v-select 
              outlined
              placeholder="Payment Methods"
              :items="paymentMethods"
              v-model="payment"
              item-text="label"
              item-value="value"
              :menu-props="{
                closeOnClick: true,
                closeOnContentClick: true,
              }"
            >
              <template v-slot:item="data">
                <v-list-item @click="() => paymentMethodHandler(data.item)">
                  <v-list-item-action style="width:60px">
                    <img v-if="data.item.icon" :src="require('@/assets/payment-method/' + data.item.icon)" />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.label }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <!-- Selection Slot for Selected Item -->
              <template v-slot:selection="data">
                <v-list-item v-if="data.item">
                  <v-list-item-action>
                    <img v-if="data.item.icon" :src="require('@/assets/payment-method/' + data.item.icon)" />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.label }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>

            <div v-if="recurringPaymentEnabled && isPostpaid">
              <v-checkbox v-if="isUseCC && !projectCCMeta" class="d-flex mx-1 mt-1" @change="setCCAction($event, 'save')">
                <template v-slot:label>
                  <div>Save my Credit Card</div>
                </template>
              </v-checkbox>
              <v-checkbox v-else-if="isUseCC" class="d-flex ml-1 mt-1" @change="setCCAction($event, 'replace')">
                <template v-slot:label>
                  <div>Replace my Credit Card</div>
                </template>
              </v-checkbox>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- continue payment button -->
      <v-row>
        <v-col cols="12" sm="12" md="6" />

        <v-col cols="12" sm="12" md="6">
          <v-btn
            id="submit"
            block
            height="50"
            depressed
            color="secondary"
            class="mr-4 text-capitalize font-weight-bold"
            @click="submit"
            :disabled="loading || !payment || !isUser"
          >
            <!-- loading indicator -->
            <beat-loader
              v-if="loading"
              :loading="loading"
              :color="'white'"
              :size="'10px'"
              class="ml-2"
            />

            {{ loading ? "Continue Payment..." : "Continue Payment" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <form
      ref="enterPaymentPageForm"
      class="d-none"
      :action="enterPaymentPageRes.payment_url"
      method="POST"
    >
      <input
        type="hidden"
        name="CheckoutID"
        :value="enterPaymentPageRes.checkout_id"
      />
      <input
        type="hidden"
        name="Signature"
        :value="enterPaymentPageRes.signature"
      />
    </form>

    <form
      ref="enterPaymentPageFormV1"
      class="d-none"
      :action="enterPaymentPageResV1.payment_url"
      method="POST"
    >
      <input type="hidden" name="MerchantCode" :value="enterPaymentPageResV1.merchant_code">
      <input type="hidden" name="PaymentId" :value="enterPaymentPageResV1.payment_id">
      <input type="hidden" name="RefNo" :value="enterPaymentPageResV1.ref_no">
      <input type="hidden" name="Amount" :value="enterPaymentPageResV1.amount">
      <input type="hidden" name="Currency" :value="enterPaymentPageResV1.currency">
      <input type="hidden" name="ProdDesc" :value="enterPaymentPageResV1.prod_desc">
      <input type="hidden" name="UserName" :value="enterPaymentPageResV1.user_name">
      <input type="hidden" name="UserEmail" :value="enterPaymentPageResV1.user_email">
      <input type="hidden" name="UserContact" :value="enterPaymentPageResV1.user_contact">
      <input type="hidden" name="Remark" :value="enterPaymentPageResV1.remark">
      <input type="hidden" name="Lang" :value="enterPaymentPageResV1.lang">
      <input type="hidden" name="Signature" :value="enterPaymentPageResV1.signature">
      <input type="hidden" name="ResponseURL" :value="enterPaymentPageResV1.response_url">
      <input type="hidden" name="BackendURL" :value="enterPaymentPageResV1.backend_url">
    </form>

    <DialogSwitchRecurring
      v-if="showSwitchRecurring"
      :projectCCMeta="projectCCMeta"
      :changeProjectCCStatus="changeProjectCCStatus"
      v-model="showSwitchRecurring"
    />

    <DialogPayWithSavedCC
      v-if="showPayWithSavedCC"
      :amount="balance.total_outstanding"
      :payNow="payNow"
      v-model="showPayWithSavedCC"
    />
  </div>
</template>

<script>
import { useNamespacedState } from "vuex-composition-helpers";
import localstorage from "@/lib/localstorage";
import api from "@/lib/api";
import BalanceAndHistoryBtn from "./payment/BalanceAndHistoryBtn.vue";
import UserInfo from "./payment/UserInfo.vue";
import Outstanding from "./payment/Outstanding.vue";
import { toThousandsWithDotFormat } from "@/lib/formatter";

import { AccessControl } from "@/lib/middleware";
import DialogSwitchRecurring from "./dialogSwitchRecurring.vue"
import DialogPayWithSavedCC from "./dialogPayWithSavedCC.vue"
export default {
  components: {
    BalanceAndHistoryBtn,
    UserInfo,
    Outstanding,
    DialogSwitchRecurring,
    DialogPayWithSavedCC,
  },
  data() {
    return {
      additionalpricefocus: false,
      totalUnpaidBilledError: false,
      totalUnpaidBilled: 0,
      balance: null,
      idr: 0,
      idrError: "",
      payment: null,
      ccAction: null,
      paymentError: "",
      loading: false,
      totalproject: "",
      projectname: "",
      error: false,
      paymentMethods: [],
      enterPaymentPageRes: {
        payment_url: "",
        checkout_id: "",
        signature: "",
      },
      enterPaymentPageResV1: {
        payment_url: "",
        merchant_code: "",
        payment_id: "",
        ref_no: "",
        amount: "",
        currency: "",
        prod_desc: "",
        user_name: "",
        user_email:"",
        user_contact: "",
        remark: "",
        lang: "",
        signature: "",
        response_url: "",
        backend_url: "",
      },

      // outstanding update
      projects: [],
      project: {},
      projectError: "",
      recurringPaymentID: 0,
      recurringPaymentEnabled: true,
      projectCCMeta: null,
      showSwitchRecurring: false,
      showPayWithSavedCC: false,
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
    isUser() {
      const userrole = localstorage.getItem('role')
      if (userrole == 'Superadmin' || userrole == 'Customer-Care' || userrole == 'GodMode') {
          return false
      }
      return true
    },
    isPrepaid() {
      return this.project.payment_method === "prepaid"
    },
    isPostpaid() {
      return this.project.payment_method === "postpaid"
    },
    isUseCC() {
      return this.recurringPaymentID === this.payment;
    },
    userProjectCCLastPayment() {
      if (!this.projectCCMeta || !this.projectCCMeta?.last_payment_date) return "-";
      return this.$FormatDateTime(this.projectCCMeta?.last_payment_date);
    }
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = access_control.is_read_mode('Balance');
    const { userprofile } = useNamespacedState("ROLEPERMISSION", [
      "userprofile",
    ]);    

    return {
      read_only,
      userprofile,
      toThousandsWithDotFormat,
    };
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
    onChangeHandler(e) {
      if (!this[e.target.id] && !this[e.target.id + "Error"]) {
        this[e.target.id + "Error"] = "Value is required";
      }

      if (this[e.target.id] && this[e.target.id + "Error"]) {
        this[e.target.id + "Error"] = "";
      }
    },
    async submit() {
      // if nominal balance field is empty
      const requiredFields = ["idr", "payment", "project"];
      const noEmptyField = requiredFields.every((field) => this[field]);

      // if (!this.idr) {
      //   this.idrError = "Value is required";
      // } else if (!this.payment) {
      //   this.paymentError = "Value is required";
      // } else if (!this.project) {
      //   this.projectError = "Value is required";
      // } else {

      if (noEmptyField) {
        this.loading = true;

        const endpoint = this.isPrepaid
          ? "/payment/deposit"
          : "/payment/postpaid";

        const payload = {
          payment_id: this.payment.toString(),
          amount: this.idr.toString(),
          project_id: this.project.id,
          cc_action: this.ccAction,
        };

        try {
          console.log("sending to :", endpoint)
          console.log("with payload :", payload)
          const res = await api.POST(endpoint, payload);
          console.log("response :", res)
          console.log("response data :", res.data)

          // if (this.isUseCC) this.enterPaymentPageResV1 = res.data;
          // else this.enterPaymentPageRes = res.data;

          this.enterPaymentPageRes = res.data
          
        } catch (err) {
          let errmsg = "Sorry, there was an error while submitting data";

          if (err.response && err.response.data && err.response.data.data) {
            errmsg = err.response.data.data;
          }

          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }

        this.loading = false;
      } else {
        requiredFields.forEach((field) => {
          if (!this[field]) {
            this[field + "Error"] = "Value is required";
          }
        });
      }
    },
    async fetchBalance() {
      if (this.currentOrg) {
        this.loading = true;

        try {
          const endpoint = this.isSuperAdmin
            ? "/superadmin/balance/accumulated/" + this.currentOrg.id + "/" + localStorage.projectid
            : "/balance/accumulated/" + localStorage.projectid;
          const balance = await api.GET(endpoint);
          this.balance = balance.data

          // set nominal to project outstanding
          if (this.isPostpaid) {
            this.idr = this.balance.total_outstanding
          }

        } catch {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            "Sorry, an error occurred while displaying The Remaining Balance"
          );
        }

        this.loading = false;
      }
    },
    async getPaymentMethods() {
      try {
        const res = await api.GET("/payment/id");
        this.paymentMethods = res.data.map((method) => {
          const { id, name, icon, is_active } = method;

          return {
            label: name,
            value: id,
            icon,
            is_active,
          };
        });
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while getting payment methods"
        );
      }
    },
    async getRecurringPaymentFeatureStatus() {
      try {
        const res = await api.GET("/payment/feature-recurring/status");
        this.recurringPaymentEnabled = res.data;
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while getting recurring payment feature status"
        );
      }
    },
    async getRecurringPaymentID() {
      try {
        const res = await api.GET("/payment/recurring-id");
        this.recurringPaymentID = res.data;
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while getting payment methods"
        );
      }
    },
    async getProjectCCMeta() {
      const res = await api.GET(`/payment/project-cc/${this.project.id}/meta`);
      this.projectCCMeta = res.data;
    },
    onRecurringSwitchClick() {
      this.showSwitchRecurring = !this.showSwitchRecurring;

      // To keep the switch value unchanged, reset it
      this.$nextTick(() => {
        this.projectCCMeta.is_active = !this.projectCCMeta.is_active; // Reset the switch value to its original state
      });
    },
    onPayNowClick() {
      this.showPayWithSavedCC = !this.showPayWithSavedCC;
    },
    async changeProjectCCStatus() {
      try {
        const res = await api.POST(`/payment/user-project-cc/${this.projectCCMeta.id}/status`, {state: !this.projectCCMeta.is_active});
        if (res.code === 200) this.projectCCMeta.is_active = !this.projectCCMeta.is_active
      } catch(e) {
        let errMsg = "Sorry, an error occurred while updating status";
        if (e.response?.data?.data) errMsg = e.response.data.data;

        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          errMsg  
        );
        
      }
    },
    async payNow() {
      this.loading = true;
      
      try {
        const res = await api.POST(`/payment/user-project-cc/${this.projectCCMeta.id}/pay`, {project_id: this.project.id});
        this.enterPaymentPageResV1 = res.data
      } catch (err) {
        let errmsg = "Sorry, there was an error while submitting data";

        if (err.response && err.response.data && err.response.data.data) {
          errmsg = err.response.data.data;
        }

        this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
      }

      this.loading = false;
    },
    paymentMethodHandler(method) {
      this.payment = method.value;
    },
    setCCAction(checked, action) {
      if (checked) {
        this.ccAction = action;
      } else {
        this.ccAction = null;
      }
    }
  },
  mounted() {
    const currentProj = localstorage.getItem("currentProj");
    this.project = JSON.parse(currentProj)

    this.getRecurringPaymentFeatureStatus();
    this.getRecurringPaymentID();
    this.getProjectCCMeta();
    this.getPaymentMethods();
    this.fetchBalance();
  },
  watch: {
    idr() {
      this.onChangeHandler({ target: { id: "idr" } });
    },
    payment() {
      if (!this.isUseCC) this.saveCC = null
      this.onChangeHandler({ target: { id: "payment" } });
    },
    project(newVal) {
      this.idr = 0;
      this.onChangeHandler({ target: { id: "project" } });
    },
    "enterPaymentPageRes.signature"() {
      console.log("redirect to payment gateway page...", this.enterPaymentPageRes)
      setTimeout(() => {
        this.$refs.enterPaymentPageForm.submit();
      }, 1000);
    },
    "enterPaymentPageResV1.signature"() {
      console.log("redirect to payment gateway page...", this.enterPaymentPageResV1)
      setTimeout(() => {
        this.$refs.enterPaymentPageFormV1.submit();
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.fs-14 {
  font-size: 14px !important;
}

.hideinput {
  ::v-deep input {
    position: relative;
    bottom: 50px;
    z-index: -2;
  }
}
</style>
