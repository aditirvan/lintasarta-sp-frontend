<template>
  <!-- <v-dialog persistent max-width="500" v-model="dialog"> -->
  <v-dialog persistent class="d-flex align-center justify-center" v-model="dialog">
    <v-card class="pt-7 mx-auto" style="max-width: 1200px; width: 100%;">
      <v-row>
      <v-col class="py-0">
      <v-card-text class="py-0">
        <div v-if="organization" class="headline font-weight-bold font--text">
          Edit Organization
        </div>
        <div v-else class="headline font-weight-bold font--text">
          Add New Organization
        </div>
      </v-card-text>
      </v-col>
      </v-row>

      <!-- <v-row>
        <v-col md="12" class="py-0" >
          <v-card-text class="d-flex align-center justify-space-between">
            <p class="titletext">Bussiness </p>
            <v-divider />
          </v-card-text>
        </v-col>
      </v-row> -->

      <v-row>
        <v-col md="5" class="py-0" >
          <v-card-text>
            <p class="titletext">Name of Organization</p>
            <v-text-field
              maxlength="30"
              v-model="name"
              :error-messages="
                $v.name.$errors.length ? $v.name.$errors[0].$message : ''
              "
              outlined
              placeholder="Enter Name"
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
          <v-card-text v-if="personalStatus">
            <p class="titletext">Type</p>

            <v-select
              :disabled="!!organization"
              v-model="is_personal"
              outlined
              :items="[
                { text: 'SME', value: true },
                { text: 'Enterprise', value: false },
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
          </v-card-text>
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
                $v.phone_number_org.$errors.length
                  ? $v.phone_number_org.$errors[0].$message
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
              v-model="phone_number_org"
            ></v-text-field>
          </v-card-text>
        </v-col>
      </v-row>

      <v-row v-if="!organization">
        <v-col md="12" class="py-0" >
          <v-card-text class="d-flex align-center justify-space-between">
            <!-- <p class="titletext">Creator Identity </p> -->
            <v-divider />
          </v-card-text>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="5" class="py-0" >
          <v-card-text v-if="!organization">
            <p class="titletext">Full Name</p>
            <v-text-field
              :disabled="!!organization"
              v-model="full_name"
              :error-messages="
                $v.full_name.$errors.length ? $v.full_name.$errors[0].$message : ''
              "
              maxlength="50"
              outlined
              placeholder="Enter Full Name"
            ></v-text-field>
          </v-card-text>
        </v-col>
        <v-col md="7" class="py-0" >
          <v-card-text v-show="!organization">
            <p class="titletext">Personal Phone Number</p>
            <v-text-field
              outlined
              placeholder="Enter Personal Phone Number"
              :error-messages="
                $v.phone_number_user.$errors.length
                  ? $v.phone_number_user.$errors[0].$message
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
              v-model="phone_number_user"
            ></v-text-field>
          </v-card-text>
        </v-col>
      
      </v-row>

      <v-row>
        <v-col md="5" class="py-0" >
          <v-card-text v-show="!organization">
            <p class="titletext">Email</p>
            <v-text-field
              maxlength="50"
              v-show="!organization"
              :disabled="!!organization"
              v-model.trim="email"
              :error-messages="
                $v.email.$errors.length ? $v.email.$errors[0].$message : ''
              "
              outlined
              placeholder="Enter Email"
              @keyup="onEnter"
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
              filled
              label="Select Sales"
              :error-messages="
                $v.sales_id.$errors.length
                  ? $v.sales_id.$errors[0].$message
                  : ''
              "
              placeholder="Select Sales"
              item-text="fullname"
              item-value="id"
            ></v-autocomplete>

          </v-card-text>
        </v-col>
      </v-row>

      <!-- <v-row>

        <v-col md="6">
          <v-card-text>
            <p class="titletext">Name of Organization</p>
            <v-text-field
              maxlength="30"
              v-model="name"
              :error-messages="
                $v.name.$errors.length ? $v.name.$errors[0].$message : ''
              "
              outlined
              placeholder="Enter Name"
            ></v-text-field>
          </v-card-text>
        </v-col>
        <v-col md="6">
          <v-card-text v-if="!organization">
            <p class="titletext">Full Name</p>
            <v-text-field
              :disabled="!!organization"
              v-model="full_name"
              :error-messages="
                $v.full_name.$errors.length ? $v.full_name.$errors[0].$message : ''
              "
              maxlength="50"
              outlined
              placeholder="Enter Full Name"
            ></v-text-field>
          </v-card-text>
        </v-col>

      </v-row>

      <v-card-text v-show="!organization">
        <p class="titletext">Email</p>
        <v-text-field
          maxlength="50"
          v-show="!organization"
          :disabled="!!organization"
          v-model.trim="email"
          :error-messages="
            $v.email.$errors.length ? $v.email.$errors[0].$message : ''
          "
          outlined
          placeholder="Enter Email"
          @keyup="onEnter"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
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
      <v-card-text>
        <v-icon color="grey" class="mr-2">mdi-information</v-icon>
        <span>Primary or Business Address</span>
      </v-card-text> 
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
      </v-card-text> -->

      <!-- <v-row>
        <v-col md="6">
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
        <v-col md="6">
          <v-card-text>
            <p class="titletext">City</p>
            <v-text-field
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
          </v-card-text>
        </v-col>
      </v-row> -->

      <!-- <v-row>
        <v-col md="6">
          <v-card-text>
            <p class="titletext">Region</p>
            <v-text-field
              flat
              outlined
              maxlength="30"
              v-model="region"
              placeholder="Region"
              required
              style="margin-bottom: 22px"
              error-messages=""
            ></v-text-field>
        </v-card-text>
        </v-col>
        <v-col md="6">
          <v-card-text>
            <p class="titletext">Zip</p>
            <v-text-field
              flat
              outlined
              maxlength="30"
              v-model="zip"
              placeholder="Zip/Post"
              required
              style="margin-bottom: 22px"
              error-messages=""
            ></v-text-field>
        </v-card-text>
        </v-col>
      </v-row> -->
      
      <!-- <v-row>
        <v-col md="6">
          <v-card-text v-show="!organization">
            <p class="titletext">Personal Phone Number</p>
            <v-select
                v-model="selectedcountrycodepersonal"
                :items="countryCodes"
                item-text="name"
                item-value="code"
                label="Country Code"
                outlined
                dense
                filterable
                v-bind:search-input.sync="searchpersonal"
                required
            ></v-select>
            <v-text-field
              outlined
              placeholder="Enter Personal Phone Number"
              :error-messages="
                $v.phone_number_user.$errors.length
                  ? $v.phone_number_user.$errors[0].$message
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
              v-model="phone_number_user"
            ></v-text-field>
          </v-card-text>
        </v-col>
        <v-col md="6">
          <v-card-text>
            <p class="titletext">Bussiness Phone Number</p>
            <v-select
                v-model="selectedcountrycode"
                :items="countryCodes"
                item-text="name"
                item-value="code"
                label="Country Code"
                outlined
                dense
                filterable
                v-bind:search-input.sync="search"
                required
              ></v-select>
            <v-text-field
              outlined
              placeholder="Enter Bussiness Phone Number"
              :error-messages="
                $v.phone_number_org.$errors.length
                  ? $v.phone_number_org.$errors[0].$message
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
              v-model="phone_number_org"
            ></v-text-field>
          </v-card-text>
        </v-col>
      </v-row> -->

      <!-- <v-card-text>
        <p class="titletext">NPWP Number</p>
        <v-text-field
          :disabled="!!organization"
          outlined
          placeholder="Enter NPWP Number"
          :error-messages="
            $v.npwp_corporate.$errors.length
              ? $v.npwp_corporate.$errors[0].$message
              : ''
          "
          v-mask="'##.###.###.#-###.###'"
          v-model="npwp_corporate"
        ></v-text-field>
      </v-card-text> -->

      <!-- <v-row>
        <v-col md="6">
          <v-card-text>
            <p class="titletext">Sales</p>

            <v-autocomplete
              v-model="sales_id"
              outlined
              :items="saleses"
              filled
              label="Select Sales"
              :error-messages="
                $v.sales_id.$errors.length
                  ? $v.sales_id.$errors[0].$message
                  : ''
              "
              placeholder="Select Sales"
              item-text="fullname"
              item-value="id"
            ></v-autocomplete>

          </v-card-text>
        </v-col>
        <v-col md="6">
          <v-card-text v-if="personalStatus">
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
          </v-card-text>
        </v-col>
      </v-row> -->

      <v-card-text>
        <v-row>
          <v-col
            ><v-btn
              @click="
                () => {
                  cancel();
                  dialog = false;
                }
              "
              depressed
              height="45"
              block
              class="accent"
              ><span class="fz-14">Cancel</span></v-btn
            ></v-col
          >
          <v-col
            ><v-btn
              id="Save"
              v-if="organization"
              @click="
                () => {
                  save();
                }
              "
              depressed
              height="45"
              block
              class="secondary"
              ><span class="fz-14">Save</span></v-btn
            >
            <v-btn
              id="Create"
              v-else
              @click="
                () => {
                  submit();
                }
              "
              depressed
              height="45"
              block
              class="secondary"
              ><span class="fz-14">Create</span></v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { SUPERADMIN } from "../superadmin/namespace";
import { useDialog } from "@/composable/usedialog";
import { required, requiredIf, email as Email, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { SUPERADMINMANAGEORG } from "./namespace";
import api from "@/lib/api";
import countryCodesFile from '@/app/sign-up/countryCodes'
import countryListFile from '@/app/sign-up/countryList'

export default {
  props: ["value", "organization"],
  data() {
    return {
      saleses: [],
      loading: false,
      personalStatus: false,
    };
  },
  setup(props, context) {
    const name = ref();
    const full_name = ref();
    const email = ref();
    const details = ref();
    const address = ref();
    const country = ref();
    const city = ref();
    const region = ref();
    const zip = ref();
    const phone_number_org = ref();
    const phone_number_user = ref();
    // const selectedcountrycode = ref('+62');
    // const selectedcountrycodepersonal = ref('+62');
    const search = ref('');
    const searchpersonal = ref('');
    // const npwp_corporate = ref();
    const sales_id = ref();
    const is_personal = ref(false);
    const countries = countryListFile.countries
    const countryCodes = countryCodesFile.countryCodes

    const { dialog } = useDialog(props, context);
    const { setCurrentOrg, setCurrentProj } = useNamespacedMutations(
      SUPERADMIN,
      ["setCurrentOrg", "setCurrentProj"]
    );
    if (props.organization) {
      console.log('props.organization:', props.organization)
      name.value = props.organization.name;
      full_name.value = props.organization.full_name;
      email.value = props.organization.email;
      details.value = props.organization.details;
      address.value = props.organization.address;
      country.value = props.organization.country
      city.value = props.organization.city
      region.value = props.organization.region
      zip.value = props.organization.zip
      // selectedcountrycode.value = props.organization.prefix_bussiness_phone_number != "" ? props.organization.prefix_bussiness_phone_number : selectedcountrycode.value
      // selectedcountrycodepersonal.value = props.organization.prefix_personal_phone_number != "" ? props.organization.prefix_personal_phone_number : selectedcountrycodepersonal.value
      phone_number_org.value = props.organization.phone_number_org.replaceAll(
        '+62',
        ""
      );
      phone_number_user.value = props.organization.phone_number_org.replaceAll(
        '+62',
        ""
      );
      // npwp_corporate.value = props.organization.npwp_corporate;
      sales_id.value = props.organization.sales_id;
      is_personal.value = props.organization.is_personal;
    }
    const emailalreadyexist = ref();
    const emaildetectedasfree = ref();
    const orgnamealreadyexist = ref();

    let $v;
    if (!props.organization) {
      $v = useVuelidate(
        {
          name: {
            required,
            minLength: minLength(5),
            conditional: {
              $message: () => orgnamealreadyexist.value,
              $validator: () => {
                return !orgnamealreadyexist.value;
              },
            },
          },
          details: {
            required,
            minLength: minLength(5),
          },
          full_name: {
            required,
            minLength: minLength(5),
          },
          email: {
            required,
            Email,
            conditional: {
              $message: () => emailalreadyexist.value,
              $validator: () => {
                return !emailalreadyexist.value;
              },
            },
            // conditional2: {
            //   $message: "cannot use this email",
            //   $validator: () => {
            //     return !emaildetectedasfree.value;
            //   },
            // },
          },
          address: {
            required,
            minLength: minLength(5),
          },
          country: {
            required,
          },
          city: {
            required,
          },
          phone_number_org: {
            required,
            custom:{
              $message: "value min 10 number",
              $validator: (val)=>val.replaceAll(' ','').length > 10
            }
          },
          phone_number_user: {
            required,
            custom:{
              $message: "value min 10 number",
              $validator: (val)=>val.replaceAll(' ','').length > 10
            }
          },
          // npwp_corporate: {
          //   required,
          //   custom:{
          //     $message: "value min 15 number",
          //     $validator: (val)=>val.replaceAll('.','').length > 15
          //   }
          // },
          sales_id: { required },
          is_personal: { required },
        },
        {
          name,
          full_name,
          email,
          details,
          address,
          country,
          city,
          phone_number_org,
          phone_number_user,
          // npwp_corporate,
          sales_id,
          is_personal,
        }
      );
      watch(email, (val) => {
        emailalreadyexist.value = "";
        emaildetectedasfree.value = "";

        $v.value.email.$reset();
      });
      watch(name, (val) => {
        orgnamealreadyexist.value = "";
        $v.value.name.$reset();
      });
    } else {
      $v = useVuelidate(
        {
          name: {
            required,
            minLength: minLength(5)
          },
          details: {
            required,
            minLength: minLength(5)
          },
          full_name: {},
          email: {},
          address: {
            required,
            minLength: minLength(5)
          },
          country: {
            required,
          },
          city:{
            required,
          },
          phone_number_org: {
            required,
            custom:{
              $message: "value min 10 number",
              $validator: (val)=>val.replaceAll(' ','').length > 10
            }
          },
          phone_number_user: { required },
          // npwp_corporate: {
          //   required: requiredIf((val) => {
          //     return !is_personal.value;
          //   }),
          // },
          sales_id: { required },
          is_personal: { required },
        },
        {
          name,
          full_name,
          email,
          details,
          address,
          country,
          city,
          phone_number_org,
          phone_number_user,
          // npwp_corporate,
          sales_id,
          is_personal,
        }
      );
    }
    const { addorganization, editorganization } = useNamespacedActions(
      SUPERADMINMANAGEORG,
      ["addorganization", "editorganization"]
    );
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);
    const submit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const Value = {
        name: name.value,
        details: details.value,
        full_name: full_name.value,
        email: email.value,
        address: address.value,
        country: country.value,
        city: city.value,
        region: region.value,
        zip: zip.value,
        phone_number_org: '+62' + phone_number_org.value.replaceAll(" ", ""),
        phone_number_user: '+62' + phone_number_user.value.replaceAll(" ", ""),
        // prefix_bussiness_phone_number: selectedcountrycode.value,
        // prefix_personal_phone_number: selectedcountrycodepersonal.value,
        // npwp_corporate: npwp_corporate.value,
        sales_id: sales_id.value,
        is_personal: is_personal.value,
      };
      addorganization(Value)
        .then(() => {
          name.value = "";
          details.value = "";
          full_name.value = "";
          email.value = "";
          address.value = "";
          country.value = "";
          city.value = "";
          region.value = "";
          zip.value = "";
          phone_number_org.value = "";
          phone_number_user.value = "";
          // npwp_corporate.value = "";
          // selectedcountrycode.value = "+62";
          // selectedcountrycodepersonal.value = "+62";
          sales_id.value = "";
          is_personal.value = "";
          $v.value.$reset();
          dialog.value = false;
          context.emit("added");
          setopendialogcommonsuccess(true);
        })
        .catch((e) => {
          const { data } = e.response.data;
          if (data == "Email was ready exist") {
            emailalreadyexist.value = "Email already exist";
          }
          else if (data == "email detected as free email provider domain") {
            emailalreadyexist.value = "Cannot use this Email";
          }
          else if (data == "Organization name already exist") {
            // emailalreadyexist.value = data;
            orgnamealreadyexist.value = data;
          }
          else {
            context.root.$store.dispatch("HOMEPAGE/showErrorToast", data)
          }
        });
    };
    const save = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const Value = {
        name: name.value,
        details: details.value,
        full_name: full_name.value,
        address: address.value,
        country: country.value,
        city: city.value,
        region: region.value,
        zip: zip.value,
        phone_number_org: '+62' + phone_number_org.value.replaceAll(" ", ""),
        // prefix_bussiness_phone_number: selectedcountrycode.value,
        // npwp_corporate: npwp_corporate.value,
        sales_id: sales_id.value,
        is_personal: is_personal.value,
      };

      Value.id = props.organization.id;
      editorganization(Value).catch((e) => {
        const { data } = e.response.data;
        if (data == "Email was ready exist") {
          emailalreadyexist.value = "Email already exist";
        }
        else if (data == "email detected as free email provider domain") {
          emailalreadyexist.value = "Cannot use this Email";
        }
        else if (data == "Organization name already exist") {
          // emailalreadyexist.value = data;
          orgnamealreadyexist.value = data;
        }
        else {
          context.root.$store.dispatch("HOMEPAGE/showErrorToast", data)
        }
        
      }).then((res) => {
        if (res && res.status === 200) {
          dialog.value = false;
          context.emit("updated");
          setopendialogcommonsuccess(true);
        }
      });
    };
    const cancel = () => {
      name.value = "";
      details.value = "";
      full_name.value = "";
      email.value = "";
      address.value = "";
      country.value = "";
      city.value = "";
      region.value = "";
      zip.value = "";
      phone_number_org.value = "";
      phone_number_user.value = "";
      sales_id.value = "";
      is_personal.value = "";
      $v.value.$reset();
    }
    return {
      countries,
      country,
      city,
      region,
      zip,
      name,
      full_name,
      email,
      details,
      address,
      phone_number_org,
      phone_number_user,
      // selectedcountrycode,
      // selectedcountrycodepersonal,
      countryCodes,
      search,
      searchpersonal,
      submit,
      // npwp_corporate,
      sales_id,
      is_personal,
      dialog,
      $v,
      save,
      cancel,
    };
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
    onEnter(e) {
      this.email = this.email.toLowerCase();
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
  font-size: 12px;
  margin-bottom: 12px;
  font-weight: 700;
}
.titletext2 {
  font-size: 12px;
  font-weight: 700;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>
