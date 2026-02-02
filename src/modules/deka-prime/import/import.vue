<template>
  <div>
    <v-card class="rounded-lg elevation-0">
      <v-container class="px-7 py-4" fluid>
        <v-row>
          <v-col>
            <div class="headline font-weight-bold font--text">Import Deka Prime</div>
          </v-col>
        </v-row>

        <v-card v-if="role == 'Superadmin'" style="box-shadow: none !important">
          <!-- <v-row>
            <v-col md="6">
              <p><b>Payment Method</b></p>

              <v-radio-group row v-model="paymentMethod">
                <v-row>
                  <v-col>
                    <v-radio label="Prepaid" value="prepaid">
                      <template v-slot:label>
                        <span class="fs-14">Prepaid</span>
                      </template>
                    </v-radio>
                  </v-col>

                  <v-col>
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

          <v-row v-if="paymentMethod == 'postpaid'">
            <v-col md="6">
              <p><b>Postpaid Type</b></p>

              <v-radio-group v-model="postpaidType" row>
                <v-row>
                  <v-col>
                    <v-radio label="Usage Based" value="usage">
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

          <v-row v-if="postpaidType === 'fixed'">
            <v-col md="6">
              <p><b>Postpaid Fixed Type</b></p>

              <v-radio-group v-model="postpaidFixedType" row>
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

          <v-row v-if="postpaidType === 'fixed'">
            <v-col md="6">
              <p><b>Fixed Price per Cycle</b></p>

              <v-text-field
                prefix="IDR | "
                v-model="fixedBillingPricePerMonth"
                outlined
                placeholder="Fixed Price per Cycle (number only)"
                onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 "
              >
              </v-text-field>
            </v-col>
          </v-row> -->

          <!-- <v-row>
            <v-col md="6">
              <p><b>Activation Date</b></p>

              <v-menu ref="menu" v-model="dateInput" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field readonly v-bind="attrs" v-on="on" outlined>
                    <template v-slot:prepend-inner>
                      <span class="font--text" @click="dateInput = true" style="cursor: pointer">
                        {{ $moment(serviceActivationDate).format("DD/MM/YYYY") }}
                      </span>
                    </template>
                  </v-text-field>
                </template>

                <v-date-picker v-model="serviceActivationDate" no-title scrollable @input="dateInput = false" />
              </v-menu>
            </v-col>
          </v-row>
          <v-divider></v-divider> -->

          <v-row>
            <v-col>
              <p><b>Service Instance</b></p>

              <v-text-field v-model="serviceInstance" outlined placeholder="Service Instance" />
            </v-col>

            <v-col> </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p><b>Interval Billing</b></p>
              <v-text-field
                v-model="intervalBilling"
                outlined
                placeholder="Interval Billing (number only)"
                onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 "
                suffix="Month"
                :maxlength="2"
              >
              </v-text-field>
            </v-col>

            <v-col>
              <p><b>Invoice Due Periode</b></p>
              <v-text-field
                v-model="invoiceDuePeriode"
                outlined
                placeholder="Invoice Due Periode (number only)"
                onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 "
                suffix="Day"
                :maxlength="2"
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="6" class="mt-2">
              <p><b>Deka Prime Organization</b></p>
              <v-text-field
                outlined
                v-model="organizationVm"
                placeholder="Deka Prime Organization"
                @blur="$v.organizationVm.$touch()"
                :error-messages="$v.organizationVm.$errors.length ? 'Deka Prime Organization couldnt be empty.' : ''"
              ></v-text-field>
            </v-col>
            <!-- <v-col md="6" class="mt-2" v-if="role == 'Superadmin'">
              <p><b>Organization</b></p>
              <v-autocomplete
                :items="organizations"
                outlined
                item-text="name"
                item-value="id"
                v-model="organizationSp"
                placeholder="Organization"
                :search-input.sync="search"
                @blur="$v.organizationSp.$touch()"
                :error-messages="$v.organizationSp.$errors.length ? 'Organization couldnt be empty.' : ''"
              >
              </v-autocomplete>
            </v-col> -->
          </v-row>

          <v-row>
            <v-col cols="12" sm="12" md="6" class="mt-2">
              <p><b>Deka Prime User</b></p>
              <v-text-field
                placeholder="Deka Prime User"
                outlined
                v-model="userVm"
                @blur="$v.userVm.$touch()"
                :error-messages="$v.userVm.$errors.length ? 'Deka Prime User couldnt be empty.' : ''"
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="12" md="6" class="mt-2">
              <p><b>Deka Prime Password</b></p>
              <v-text-field
                placeholder="Deka Prime Password"
                :type="show1 ? 'text' : 'password'"
                outlined
                v-model="passwordVm"
                @blur="$v.passwordVm.$touch()"
                :error-messages="$v.passwordVm.$errors.length ? 'Deka Prime Password couldnt be empty.' : ''"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <v-card v-if="role != 'Superadmin'" style="box-shadow: none !important">
          <v-row>
            <v-col md="6" class="mt-2">
              <p><b>Deka Prime Organization</b></p>
              <v-text-field
                outlined
                v-model="organizationVm"
                placeholder="Deka Prime Organization"
                @blur="$v.organizationVm.$touch()"
                :error-messages="$v.organizationVm.$errors.length ? 'Deka Prime Organization couldnt be empty.' : ''"
              ></v-text-field>
            </v-col>
            <v-col md="6" class="mt-2" v-if="role == 'Superadmin'">
              <p><b>Organization</b></p>
              <!-- :error-messages="errorOrgSp" -->
              <v-autocomplete
                :items="organizations"
                outlined
                item-text="name"
                item-value="id"
                v-model="organizationSp"
                placeholder="Organization"
                :search-input.sync="search"
                @blur="$v.organizationSp.$touch()"
                :error-messages="$v.organizationSp.$errors.length ? 'Organization couldnt be empty.' : ''"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="6" class="mt-2">
              <p><b>Deka Prime User</b></p>
              <v-text-field
                placeholder="Deka Prime User"
                outlined
                v-model="userVm"
                @blur="$v.userVm.$touch()"
                :error-messages="$v.userVm.$errors.length ? 'Deka Prime User couldnt be empty.' : ''"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="6" class="mt-2">
              <p><b>Deka Prime Password</b></p>
              <v-text-field
                placeholder="Deka Prime Password"
                :type="show1 ? 'text' : 'password'"
                outlined
                v-model="passwordVm"
                @blur="$v.passwordVm.$touch()"
                :error-messages="$v.passwordVm.$errors.length ? 'Deka Prime Password couldnt be empty.' : ''"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="6" class="mt-2">
              <p><b>Service Instance</b></p>
              <v-text-field v-model="serviceInstance" outlined placeholder="Service Instance" />
            </v-col>
            <v-col> </v-col>
          </v-row>
        </v-card>

        
        <!-- 
        <v-row v-if="role == 'Superadmin'">
          <v-col class="mb-5">
            <p><b>Document Contract</b></p>

            <div class="d-flex align-center">
              <div style="width: 150px" class="mr-4">
                <v-btn depressed block height="40" class="secondary" @click="$refs.doc.click($event)"> Upload File </v-btn>
              </div>

              <input ref="doc" type="file" class="d-none" @change="onChangeDoc($event)" />

              <span>{{ docName }}</span>
            </div>

            <p v-if="docError" class="error--text mt-4">
              {{ docError }}
            </p>
          </v-col>
        </v-row>
         -->

        <v-row>
          <v-col>
            <v-btn depressed style="background-color: #a5b3bf !important" block height="50" class="primary" to="/">
              <span class="fz-16px">Cancel</span>
            </v-btn>
          </v-col>

          <v-col cols="6">
            <v-btn depressed block height="50" class="secondary" @click="onSubmit()" :loading="loadingImport">Import</v-btn>
          </v-col>
          <!-- <beat-loader v-if="loading" :loading="loading" :color="'white'" :size="'10px'" class="ml-2" /> -->
        </v-row>
      </v-container>
    </v-card>
    <v-dialog v-model="dialogImport" max-width="450" persistent>
      <v-card class="overflow-x-hidden">
        <v-row>
          <v-col class="pt-0">
            <v-card-text>
              <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
              <span class="fz-14 font-weight-bold mb-0">Import Status</span>
            </v-card-text>
          </v-col>

          <v-col class="pt-0 pb-0">
            <v-card-text class="pb-0">
              <div class="d-flex justify-end mb-2">
                <span
                  class="cursor-pointer"
                  @click="
                    () => {
                      onClose();
                    }
                  "
                  ><v-icon color="red">mdi-close-circle</v-icon></span
                >
              </div>
            </v-card-text>
          </v-col>
        </v-row>

        <v-card-text class="mb-5">
          <div v-for="(row, index) in dataResponse" :key="index">
            <div class="mb-0 text-h7 green--text" v-if="row.status == true">
              <span><v-icon color="green" small>mdi-circle</v-icon></span> {{ row.name
              }}<span class="lower">&nbsp;has&nbsp;{{ row.message }}fully&nbsp; imported</span>
            </div>
            <div class="mb-0 text-h7 red--text" v-else>
              <span><v-icon color="red" small>mdi-circle</v-icon></span> {{ row.name }}<span>&nbsp;{{ row.message }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "@vue/composition-api";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { IMPORT } from "./namespace";
import { SUPERADMINMANAGEORG } from "@/modules/superadmin-manageorganization/namespace";
import moment from "moment";
import { ORGANIZATION } from '@/modules/organization/namespace';

export default {
  setup(props, context) {
    const { fetchorganizations } = useNamespacedActions(SUPERADMINMANAGEORG, ["fetchorganizations"]);
    const { organizations, pagination } = useNamespacedState(SUPERADMINMANAGEORG, ["organizations", "pagination"]);
    const { postImport, postImportSuperadmin } = useNamespacedActions(IMPORT, ["postImport", "postImportSuperadmin"]);
    const { fetchorganizationByUser } = useNamespacedActions(ORGANIZATION, [
      "fetchorganizationByUser",
    ]);
    const { loadingImport, dialogImport, dataResponse, statusImport } = useNamespacedGetters(IMPORT, [
      "loadingImport",
      "dialogImport",
      "dataResponse",
      "statusImport",
    ]);
    onMounted(() => {
      if (localStorage.getItem("role") == "Superadmin") {
        fetchorganizations();
      }
    });
    const role = ref(localStorage.getItem("role"));
    const organizationVm = ref("");
    // const organizationSp = ref("");
    const userVm = ref("");
    const passwordVm = ref("");
    const type = ref("");
    const hidePrepaid = ref(false);
    // // const paymentMethod = ref("prepaid");
    // const postpaidType = ref("usage");
    // const postpaidFixedType = ref("prorate");
    const fixedBillingPricePerMonth = ref("0");
    const networkNumber = ref("");
    // const serviceActivationDate = ref(moment().format("YYYY-MM-DD"));
    const dateInput = ref(false);
    const serviceInstance = ref("");
    const invoiceDuePeriode = ref("30");
    const intervalBilling = ref("1");
    const allowedTypes = ref(["image/jpeg", "image/png", "application/pdf"]);
    // const docName = ref("");
    // const docError = ref("");
    // const docContract = ref("");
    const errorOrgSp = ref("");
    const show1 = ref(false);
    const search = ref("");

    const onClose = () => {
      context.root.$store.commit("IMPORT/setDialogImport", false);
      if (localStorage.getItem("role") == "Superadmin") {
        const currentOrg = JSON.parse(localStorage.getItem('currentOrg') || '{}')
        if (currentOrg) {
          context.root.$router.replace(`/organization-detail/` + currentOrg.id);
          
        } else {
          context.root.$router.replace(`/`);  
        }
      } else {
        context.root.$router.replace(`/project`);
      }
    };

    // const onChangeDoc = async (e) => {
    //   if (e.target.files[0].size / (1024 * 1024) > 10) {
    //     docError.value = "File size is too large (max 10MB)";
    //   } else if (!allowedTypes.value.includes(e.target.files[0].type)) {
    //     docError.value = "Only jpg, png, pdf files are allowed";
    //   } else {
    //     docName.value = e.target.files[0].name;
    //     docContract.value = await getBase64(e.target.files[0]);
    //     docError.value = "";
    //   }
    // };
    const getBase64 = (file) => {
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
    };

    const onSubmit = async() => {
      if (role.value == "Superadmin") {
        $v.value.$touch();
        if ($v.value.$errors.length)  return;
        const currentOrg = JSON.parse(localStorage.getItem("currentOrg") || "{}");
        const payload = {
          // doc_contract: docContract.value,
          fixed_billing_price_per_month: parseInt(fixedBillingPricePerMonth.value),
          interval_billing_per_month: parseInt(intervalBilling.value),
          invoice_due_periode_per_day: parseInt(invoiceDuePeriode.value),
          network_number: serviceInstance.value,
          // payment_method: paymentMethod.value,
          // postpaid_fixed_type: postpaidFixedType.value,
          // postpaid_type: postpaidType.value,
          // service_activation_date: serviceActivationDate.value,
          spOrganizationId: currentOrg.id,
          token: localStorage.getItem("token"),
          vmwareOrganization: organizationVm.value,
          vmwarePassword: passwordVm.value,
          vmwareUser: userVm.value,
        };
        await postImportSuperadmin(payload);
        if (statusImport.value) {
          // organizationSp.value = "";
          organizationVm.value = "";
          userVm.value = "";
          passwordVm.value = "";
          // docContract.value = "";
          // docName.value = "";
          serviceInstance.value = "";
          $v.value.$reset();
        }
      } else {
        $v.value.$touch();
        if ($v.value.$errors.length) return;
        const params = JSON.parse(localStorage.getItem("currentOrg") || "{}");
        const payload = {
          spOrganizationId: params.id,
          spUserId: params.user_id,
          token: localStorage.getItem("token"),
          vmwareOrganization: organizationVm.value,
          vmwarePassword: passwordVm.value,
          vmwareUser: userVm.value,
          network_number: serviceInstance.value,
        };
        await postImport(payload);
        let resp = await fetchorganizationByUser()
        localStorage.setItem("currentOrg", JSON.stringify(resp))
        
        if (statusImport.value) {
          organizationVm.value = "";
          userVm.value = "";
          passwordVm.value = "";
          $v.value.$reset();
        }
      }
    };
    const $v = useVuelidate(
      localStorage.getItem("role") == "Superadmin"
        ? {
            organizationVm: { required },
            userVm: { required },
            passwordVm: { required },
            // organizationSp: { required },
          }
        : {
            organizationVm: { required },
            userVm: { required },
            passwordVm: { required },
          },
      localStorage.getItem("role") == "Superadmin"
        ? {
            organizationVm,
            userVm,
            passwordVm,
            // organizationSp,
          }
        : {
            organizationVm,
            userVm,
            passwordVm,
          }
    );
    watch(search, () => {
      // if (search.value != "") {
      //   $v.value.organizationSp.$reset();
      // }
      fetchorganizations({ search: search.value });
    });

    return {
      organizationVm,
      userVm,
      passwordVm,
      onSubmit,
      $v,
      type,
      loadingImport,
      organizations,
      pagination,
      role,
      hidePrepaid,
      // paymentMethod,
      // postpaidType,
      // postpaidFixedType,
      fixedBillingPricePerMonth,
      networkNumber,
      // serviceActivationDate,
      dateInput,
      serviceInstance,
      intervalBilling,
      invoiceDuePeriode,
      allowedTypes,
      // onChangeDoc,
      // docError,
      // docName,
      // docContract,
      getBase64,
      // organizationSp,
      dialogImport,
      onClose,
      dataResponse,
      statusImport,
      errorOrgSp,
      show1,
      search,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
.lower {
  text-transform: lowercase;
}
</style>
