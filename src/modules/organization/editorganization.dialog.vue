<template>
  <v-dialog persistent class="d-flex align-center justify-center" v-model="dialog">
    <v-card class="pt-7 mx-auto" style="max-width: 1200px; width: 100%;">
      <v-row>
      <v-col class="py-0">
      <v-card-text class="py-0">
        <div class="headline font-weight-bold font--text">
          Edit Organization
        </div>
      </v-card-text>
      </v-col>
      </v-row>
      <v-row>
        <v-col md="5" class="py-0" >
          <v-card-text>
            <p class="titletext">Name of Organization</p>
            <v-text-field
              maxlength="30"
              v-model="name"
              disabled
              outlined
              placeholder=""
            ></v-text-field>
          </v-card-text>
        </v-col>
        <v-col md="7" class="py-0" >
          <v-card-text>
            <p class="titletext">Address</p>
            <v-textarea
              maxlength="255"
              placeholder="Enter Address"
              :error-messages="
                $v.address.$errors.length ? $v.address.$errors[0].$message : ''
              "
              flat
              outlined
              v-model="address"
            ></v-textarea>
          </v-card-text>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="5" class="py-0" >
          <!-- <v-card-text v-if="personalStatus">
            <p class="titletext">Type</p>

            <v-select
              v-model="is_personal"
              outlined
              :items="[
                { text: 'Personal', value: true },
                { text: 'Corporate', value: false },
              ]"
              :error-messages="
                $v.is_personal.$errors.length
                  ? $v.is_personal.$errors[0].$message
                  : ''
              "
              placeholder="Select Type"
              item-text="text"
              item-value="value"
            />
          </v-card-text> -->
        </v-col>
        <v-col md="7" class="py-0" >
          <v-card-text>
            <p class="titletext">Country</p>
            <v-autocomplete
              v-model="country"
              outlined
              :items="countries"
              placeholder="Country"
              style="margin-bottom: 22px"
              item-text="name"
              item-value="name"
              :error-messages="
                $v.country.$errors.length
                  ? $v.country.$errors[0].$message
                  : ''
              "
            />
          </v-card-text>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="5" class="py-0" >
          <v-card-text class="py-0">
            <p class="titletext">Description</p>
            <v-textarea
              maxlength="255"
              placeholder="Enter Description"
              :error-messages="
                $v.details.$errors.length ? $v.details.$errors[0].$message : ''
              "
              flat
              outlined
              v-model="details"
            ></v-textarea>
          </v-card-text>
        </v-col>
        <v-col md="7" class="py-0" >
          <v-card-text class="py-0">
            <p class="titletext">City / Region / Zip</p>
          </v-card-text>
          <v-card-text class="d-flex align-center justify-space-between py-0">
            <v-text-field
              class="mr-1"
              flat
              outlined
              maxlength="30"
              v-model="city"
              placeholder="City"
              required
              style="margin-bottom: 22px"
              :error-messages="
                $v.city.$errors.length
                  ? $v.city.$errors[0].$message
                  : ''
              "
            ></v-text-field>
            <v-text-field
              class="mr-1"
              flat
              outlined
              maxlength="30"
              v-model="region"
              placeholder="Region"
              required
              style="margin-bottom: 22px"
              error-messages=""
            ></v-text-field>
            <v-text-field
              class="mr-1"
              flat
              outlined
              maxlength="30"
              v-model="zip"
              placeholder="Zip/Post"
              required
              style="margin-bottom: 22px"
              error-messages=""
              v-mask="'##########'"
            ></v-text-field>
          </v-card-text>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="5" class="py-0" >
          <v-card-text>
            <p class="titletext">Bussiness Phone Number</p>
            <v-text-field
              outlined
              placeholder="Enter Bussiness Phone Number"
              :error-messages="
                $v.phone.$errors.length
                  ? $v.phone.$errors[0].$message
                  : ''
              "
              v-mask="[
                /[1-9]/,
                /[0-9]/,
                /[0-9]/,
                ' ',
                /[0-9]/,
                /[0-9]/,
                /[0-9]/,
                ' ',
                /[0-9]/,
                /[0-9]/,
                /[0-9]/,
                ' ',
                /[0-9]/,
                /[0-9]/,
                /[0-9]/,
              ]"
              prefix="+62"
              v-model="phone"
            ></v-text-field>
          </v-card-text>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="12" class="py-0" >
          <v-card-text class="d-flex align-center justify-space-between">
            <!-- <p class="titletext">Sales </p> -->
            <v-divider />
          </v-card-text>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="12" class="py-0" >
          <v-card-text>
            <p class="titletext">Sales</p>
            <v-autocomplete
              v-model="sales_id"
              outlined
              :items="saleses"
              error-messages=""
              :placeholder="isNotSuperadmin ? '-' : 'Select Sales'"
              item-text="fullname"
              item-value="id"
              :disabled="isNotSuperadmin"
              :filled="isNotSuperadmin"
            />

          </v-card-text>
        </v-col>
      </v-row>

      <!-- <v-card-text>
        <p class="titletext">Details</p>
        <v-textarea
          maxlength="255"
          placeholder="Enter Details"
          flat
          outlined
          v-model="details"
          :error-messages="
            $v.details.$errors.length ? $v.details.$errors[0].$message : ''
          "
        ></v-textarea>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Address</p>
        <v-textarea
          maxlength="255"
          placeholder="Enter Address"
          flat
          outlined
          v-model="address"
          :error-messages="
            $v.address.$errors.length ? $v.address.$errors[0].$message : ''
          "
        ></v-textarea>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Phone Number</p>
        <v-text-field
          v-mask="[
            /[1-9]/,
            /[0-9]/,
            /[0-9]/,
            ' ',
            /[0-9]/,
            /[0-9]/,
            /[0-9]/,
            ' ',
            /[0-9]/,
            /[0-9]/,
            /[0-9]/,
            ' ',
            /[0-9]/,
            /[0-9]/,
            /[0-9]/,
          ]"
          outlined
          prefix="+62"
          placeholder="Enter Phone Number"
          v-model="phone"
          :error-messages="
            $v.phone.$errors.length ? $v.phone.$errors[0].$message : ''
          "
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">NPWP Number</p>
        <v-text-field
          outlined
          placeholder="Enter NPWP Number"
          v-model="npwp"
          disabled
          :error-messages="
            $v.npwp.$errors.length ? $v.npwp.$errors[0].$message : ''
          "
        ></v-text-field>
      </v-card-text>

      <v-card-text>
        <p class="titletext">Sales</p>

        <v-autocomplete
          v-model="sales_id"
          outlined
          :items="saleses"
          error-messages=""
          :placeholder="isNotSuperadmin ? '-' : 'Select Sales'"
          item-text="fullname"
          item-value="id"
          :disabled="isNotSuperadmin"
          :filled="isNotSuperadmin"
        />
      </v-card-text> -->

      <v-card-text>
        <v-row>
          <v-col
            ><v-btn
              @click="
                () => {
                  $emit('input', false);
                }
              "
              depressed
              height="45"
              block
              class="accent"
              >Cancel</v-btn
            ></v-col
          >
          <v-col
            ><v-btn
              @click="
                () => {
                  submit();
                }
              "
              depressed
              height="45"
              block
              class="secondary"
              >Update</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { SUPERADMIN } from "../superadmin/namespace";
import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";
import { useDialog } from "@/composable/usedialog";
import localstorage from "@/lib/localstorage";
import { ORGANIZATION } from "./namespace";
import useVuelidate from "@vuelidate/core";
import { required, requiredIf, minLength } from "@vuelidate/validators";
import api from "@/lib/api";
import countryListFile from '@/app/sign-up/countryList'

export default {
  props: ["value", "organization"],
  setup(props, context) {
    const { dialog } = useDialog(props, context);
    const name = ref(props.organization.name);
    const country = ref(props.organization.country);
    const city = ref(props.organization.city);
    const region = ref(props.organization.region);
    const zip = ref(props.organization.zip);
    const details = ref(props.organization.details);
    const address = ref(props.organization.address);
    const phone = ref(props.organization.phone_number_org.replace("+62", ""));
    // const npwp = ref(props.organization.npwp_corporate);
    const sales_id = ref(props.organization.sales_id);
    const is_personal = ref(props.organization.is_personal);
    const countries = countryListFile.countries
    const { getActivityOrganisasi } = useNamespacedActions(SUPERADMINMANAGEORG, ["getActivityOrganisasi"]);
    const { setCurrentOrg, setCurrentProj } = useNamespacedMutations(
      SUPERADMIN,
      ["setCurrentOrg", "setCurrentProj"]
    );
    const user_role = localstorage.getItem("role");
    const store =
      user_role == "Superadmin" ? SUPERADMINMANAGEORG : ORGANIZATION;
    const { editorganization } = useNamespacedActions(store, [
      "editorganization",
    ]);
    const $v = useVuelidate(
      {
        country: {
          required,
        },
        city: {
          required,
        },
        // is_personal: { required },
        details: { required },
        address: { required },
        phone: { required },
        // npwp: {
        //   required: requiredIf((val) => {
        //     return !is_personal.value;
        //   }),
        // },
        sales_id: { required },
      },
      {
        minLength,
        country,
        city,
        // is_personal,
        details,
        address,
        phone,
        // npwp,
        sales_id,
      }
    );
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);
    const submit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      const Value =
        user_role == "Superadmin"
          ? {
              id: props.organization.id,
              details: details.value,
              address: address.value,
              country: country.value,
              city: city.value,
              region: region.value,
              zip: zip.value,
              phone_number_org: "+62" + phone.value.replaceAll(" ", ""),
              // npwp_corporate: npwp.value
              sales_id: sales_id.value,
              // is_personal: is_personal.value,
            }
          : {
              id: props.organization.id,
              details: details.value,
              address: address.value,
              country: country.value,
              city: city.value,
              region: region.value,
              zip: zip.value,
              phone_number: "+62" + phone.value.replaceAll(" ", ""),
              // npwp_corporate: npwp.value
              sales_id: sales_id.value,
              // is_personal: is_personal.value,
            };
      return editorganization(Value).then(() => {
        if ( user_role == "Superadmin") {
        getActivityOrganisasi({ id: props.organization.id, params: { page_size: 10, page: 1, activity: "Data Organization" } });
        }
        dialog.value = false;
        context.emit("updated");
        setopendialogcommonsuccess(true);
      });
    };
    return {
      $v,
      name,
      country,
      city,
      region,
      zip,
      details,
      address,
      phone,
      submit,
      // npwp,
      sales_id,
      dialog,
      countries,
      is_personal,
      user_role,
    };
  },
  data() {
    return {
      saleses: [],
      personalStatus: false,
    };
  },
  computed: {
    isNotSuperadmin() {
      const role = localstorage.getItem("role");
      return role !== "Superadmin";
    },
  },
  methods: {
    async getSaleses() {
      // this.isLoading = true

      try {
        const res = await api.GET("/user/sales/active");
        const data = res.data;

        if (data) {
          this.saleses = data;
        }
      } catch (err) {
        let errmsg = "Sorry, an error occurred while getting the sales";
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

      // this.isLoading = false
    },
    async getPersonalStatus() {
      this.loading = true;

      try {
        const res = await api.GET("/user/personal-status");
        this.personalStatus = res.data.personal_active;
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying data";
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
  },
  mounted() {
    this.getSaleses();
    this.getPersonalStatus();
  },
};
</script>

<style lang="scss" scoped>
.titletext {
  font-weight: 700;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>