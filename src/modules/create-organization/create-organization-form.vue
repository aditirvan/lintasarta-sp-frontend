<template>
  <v-card-text class="pt-7 mx-auto">
    <v-container>
      <!-- <v-col class="justify-center"> -->
        <h1
          style="
            text-align: center;
            font-weight: 800;
            font-size: 28px;
            line-height: 36px;
            letter-spacing: 0.04em;
            font-family: Mont;
            font-style: normal;
          "
        >
          1. CREATE ORGANIZATION
        </h1>
        <p
          style="font-size: 20px; color: #a5b3bf; line-height: 27.24px"
          class="text-center mt-5"
        >
          You have to create an organization before using the app
        </p>
        <v-form ref="form" style="margin-top: 40px" lazy-validation>
          <v-alert v-if="errorMessage" color="red" type="error"
            >{{ errorMessage }}
          </v-alert>

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
                <p class="titletext"><b>Name of Organization</b></p>
                <v-text-field
                  id="name"
                  flat
                  outlined
                  maxlength="30"
                  v-model="name"
                  placeholder="Name of Organization"
                  required
                  style="margin-bottom: 22px"
                  :error-messages="
                    nameValidation.$errors.length
                      ? nameValidation.$errors[0].$message
                      : ''
                  "
                ></v-text-field>
              </v-card-text>
            </v-col>
            <v-col md="7" class="py-0" >
              <v-card-text>
                <p class="titletext"><b>Address</b></p>
                <v-textarea
                  rows="5"
                  id="description"
                  flat
                  outlined
                  maxlength="255"
                  v-model="address"
                  placeholder="Address"
                  required
                  style="margin-bottom: 22px"
                  :error-messages="
                    addressValidation.$errors.length
                      ? addressValidation.$errors[0].$message
                      : ''
                  "
                ></v-textarea>
              </v-card-text>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="5" class="py-0">
              <v-card-text>
                <p class="titletext"><b>Country</b></p>
                <v-autocomplete
                  v-model="country"
                  outlined
                  :items="countries"
                  placeholder="Country"
                  style="margin-bottom: 22px"
                  item-text="name"
                  item-value="name"
                  :error-messages="
                    countryValidation.$errors.length
                      ? countryValidation.$errors[0].$message
                      : ''
                  "
                />
              </v-card-text>
            </v-col>
            <v-col md="7" class="py-0">
              <v-card-text>
                <p class="titletext"><b>Description</b></p>
                <v-textarea
                  rows="5"
                  id="details"
                  flat
                  outlined
                  maxlength="255"
                  v-model="details"
                  placeholder="Description"
                  required
                  style="margin-bottom: 22px"
                  :error-messages="
                    detailsValidation.$errors.length
                      ? detailsValidation.$errors[0].$message
                      : ''
                  "
                ></v-textarea>
              </v-card-text>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="5" class="py-0">
              <v-card-text class="py-0">
                <p class="titletext"><b>Bussiness Phone Number</b></p>
                <v-text-field
                  v-mask="[/[1-9]/, /[0-9]/, /[0-9]/, ' ' ,/[0-9]/, /[0-9]/, /[0-9]/, ' ' ,/[0-9]/, /[0-9]/, /[0-9]/,' ' ,/[0-9]/, /[0-9]/, /[0-9]/]"
                  flat
                  outlined
                  v-model="phone"
                  placeholder="Bussiness Phone Number"
                  required
                  prefix="+62"
                  style="margin-bottom: 22px"
                  :error-messages="
                    phoneValidation.$errors.length
                      ? phoneValidation.$errors[0].$message
                      : ''
                  "
                ></v-text-field>
              </v-card-text>
            </v-col>
            <v-col md="7" class="py-0">
              <v-card-text class="py-0">
                <p class="titletext"><b>City / Region / Zip</b></p>
              </v-card-text>
              <v-card-text class="d-flex align-center justify-space-between py-0">
                <v-text-field
                  class="mr-1"
                  id="name"
                  flat
                  outlined
                  maxlength="30"
                  v-model="city"
                  placeholder="City"
                  required
                  style="margin-bottom: 22px"
                  :error-messages="
                    cityValidation.$errors.length
                      ? cityValidation.$errors[0].$message
                      : ''
                  "
                ></v-text-field>
                <v-text-field
                  class="mr-1"
                  id="name"
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
                  id="name"
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
                <p class="titletext"><b>Select Sales</b></p>
                <v-autocomplete
                  v-model="sales_id"
                  outlined
                  :items="saleses"
                  error-messages=""
                  placeholder="Select Sales"
                  style="margin-bottom: 22px"
                  item-text="fullname"
                  item-value="id"
                />
              </v-card-text>
            </v-col>
          </v-row>

          <!-- <v-card-text> -->
          <!-- <p class="titletext">Name of Organization</p>
          <v-text-field
            id="name"
            flat
            outlined
            maxlength="30"
            v-model="name"
            placeholder="Name of Organization"
            required
            style="margin-bottom: 22px"
            :error-messages="
              nameValidation.$errors.length
                ? nameValidation.$errors[0].$message
                : ''
            "
          ></v-text-field> -->
          <!-- </v-card-text> -->

          <!-- <v-card-text> -->
          <!-- <p class="titletext">description</p>
          <v-textarea
            rows="5"
            id="details"
            flat
            outlined
            maxlength="255"
            v-model="details"
            placeholder="description"
            required
            style="margin-bottom: 22px"
            :error-messages="
              detailsValidation.$errors.length
                ? detailsValidation.$errors[0].$message
                : ''
            "
          ></v-textarea> -->
          <!-- </v-card-text> -->

          <!-- <v-card-text> -->
            <!-- <v-icon color="grey" class="mr-2">mdi-information</v-icon>
            <span>Primary or Business Address</span> -->
          <!-- </v-card-text>           -->

          <!-- <v-card-text> -->
          <!-- <p class="titletext">Address</p>
          <v-textarea
            rows="5"
            id="description"
            flat
            outlined
            maxlength="255"
            v-model="address"
            placeholder="Address"
            required
            style="margin-bottom: 22px"
            :error-messages="
              addressValidation.$errors.length
                ? addressValidation.$errors[0].$message
                : ''
            "
          ></v-textarea> -->
          <!-- </v-card-text> -->

          <!-- <v-card-text> -->
          <!-- <p class="titletext">Country</p>
          <v-autocomplete
            v-model="country"
            outlined
            :items="countries"
            placeholder="Country"
            style="margin-bottom: 22px"
            item-text="name"
            item-value="name"
            :error-messages="
              countryValidation.$errors.length
                ? countryValidation.$errors[0].$message
                : ''
            "
          /> -->
          <!-- </v-card-text> -->

          <!-- <v-card-text> -->
          <!-- <p class="titletext">City</p>
          <v-text-field
            id="name"
            flat
            outlined
            maxlength="30"
            v-model="city"
            placeholder="City"
            required
            style="margin-bottom: 22px"
            :error-messages="
              cityValidation.$errors.length
                ? cityValidation.$errors[0].$message
                : ''
            "
          ></v-text-field> -->
          <!-- </v-card-text> -->

          <!-- <v-card-text> -->
          <!-- <p class="titletext">Region</p>
          <v-text-field
            id="name"
            flat
            outlined
            maxlength="30"
            v-model="region"
            placeholder="Region"
            required
            style="margin-bottom: 22px"
            error-messages=""
          ></v-text-field> -->
          <!-- </v-card-text> -->

          <!-- <v-card-text> -->
          <!-- <p class="titletext">Zip</p>
          <v-text-field
            id="name"
            flat
            outlined
            maxlength="30"
            v-model="zip"
            placeholder="Zip/Post"
            required
            style="margin-bottom: 22px"
            error-messages=""
          ></v-text-field> -->
          <!-- </v-card-text> -->

          <!-- <v-card-text> -->
          <!-- <p class="titletext">Bussiness Phone Number</p> -->
          <!-- <v-select
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
          ></v-select> -->
          <!-- <v-text-field
            v-mask="[/[1-9]/, /[0-9]/, /[0-9]/, ' ' ,/[0-9]/, /[0-9]/, /[0-9]/, ' ' ,/[0-9]/, /[0-9]/, /[0-9]/,' ' ,/[0-9]/, /[0-9]/, /[0-9]/]"
            flat
            outlined
            v-model="phone"
            placeholder="Bussiness Phone Number"
            required
            prefix="+62"
            style="margin-bottom: 22px"
            :error-messages="
              phoneValidation.$errors.length
                ? phoneValidation.$errors[0].$message
                : ''
            "
          ></v-text-field> -->
          <!-- </v-card-text> -->

          <!-- <v-card-text> -->
          <!-- <p class="titletext">Select Sales</p>
          <v-autocomplete
            v-model="sales_id"
            outlined
            :items="saleses"
            error-messages=""
            placeholder="Select Sales"
            style="margin-bottom: 22px"
            item-text="fullname"
            item-value="id"
          /> -->
          <!-- </v-card-text> -->
          <v-card-text>
          <v-btn
            :disabled="isLoading ? true : false"
            id="submit"
            block
            height="50"
            depressed
            color="secondary"
            class="mr-4 mt-7 text-capitalize font-weight-bold"
            @click="save"
          >
            {{ isLoading ? "Please wait..." : "Create" }}
          </v-btn>
          </v-card-text>
          <br />
        </v-form>
      <!-- </v-col> -->
    </v-container>
  </v-card-text>
</template>
<script>
import { useAction } from "./useAction";
import { mapGetters } from "vuex";
import localstorage from "@/lib/localstorage";
import api from '@/lib/api';
import countryCodesFile from '@/app/sign-up/countryCodes'

export default {
  computed: {
    ...mapGetters({
      loggedUser: "CREATEORGANIZATION/getProfile",
      isLoading: "CREATEORGANIZATION/isLoading",
    }),
  },
  components: {},
  data() {
    return {
      errorMessage: undefined,
      success: false,
      saleses: [],
      search: '',
      countries: [
        { name: "Afghanistan" },
        { name: "Albania" },
        { name: "Algeria" },
        { name: "Andorra" },
        { name: "Angola" },
        { name: "Antigua and Barbuda" },
        { name: "Argentina" },
        { name: "Armenia" },
        { name: "Australia" },
        { name: "Austria" },
        { name: "Azerbaijan" },
        { name: "Bahamas" },
        { name: "Bahrain" },
        { name: "Bangladesh" },
        { name: "Barbados" },
        { name: "Belarus" },
        { name: "Belgium" },
        { name: "Belize" },
        { name: "Benin" },
        { name: "Bhutan" },
        { name: "Bolivia" },
        { name: "Bosnia and Herzegovina" },
        { name: "Botswana" },
        { name: "Brazil" },
        { name: "Brunei" },
        { name: "Bulgaria" },
        { name: "Burkina Faso" },
        { name: "Burundi" },
        { name: "Cabo Verde" },
        { name: "Cambodia" },
        { name: "Cameroon" },
        { name: "Canada" },
        { name: "Central African Republic" },
        { name: "Chad" },
        { name: "Chile" },
        { name: "China" },
        { name: "Colombia" },
        { name: "Comoros" },
        { name: "Congo, Democratic Republic of the" },
        { name: "Congo, Republic of the" },
        { name: "Costa Rica" },
        { name: "Croatia" },
        { name: "Cuba" },
        { name: "Cyprus" },
        { name: "Czech Republic" },
        { name: "Denmark" },
        { name: "Djibouti" },
        { name: "Dominica" },
        { name: "Dominican Republic" },
        { name: "Ecuador" },
        { name: "Egypt" },
        { name: "El Salvador" },
        { name: "Equatorial Guinea" },
        { name: "Eritrea" },
        { name: "Estonia" },
        { name: "Eswatini" },
        { name: "Ethiopia" },
        { name: "Fiji" },
        { name: "Finland" },
        { name: "France" },
        { name: "Gabon" },
        { name: "Gambia" },
        { name: "Georgia" },
        { name: "Germany" },
        { name: "Ghana" },
        { name: "Greece" },
        { name: "Grenada" },
        { name: "Guatemala" },
        { name: "Guinea" },
        { name: "Guinea-Bissau" },
        { name: "Guyana" },
        { name: "Haiti" },
        { name: "Honduras" },
        { name: "Hungary" },
        { name: "Iceland" },
        { name: "India" },
        { name: "Indonesia" },
        { name: "Iran" },
        { name: "Iraq" },
        { name: "Ireland" },
        { name: "Israel" },
        { name: "Italy" },
        { name: "Jamaica" },
        { name: "Japan" },
        { name: "Jordan" },
        { name: "Kazakhstan" },
        { name: "Kenya" },
        { name: "Kiribati" },
        { name: "Kuwait" },
        { name: "Kyrgyzstan" },
        { name: "Laos" },
        { name: "Latvia" },
        { name: "Lebanon" },
        { name: "Lesotho" },
        { name: "Liberia" },
        { name: "Libya" },
        { name: "Liechtenstein" },
        { name: "Lithuania" },
        { name: "Luxembourg" },
        { name: "Madagascar" },
        { name: "Malawi" },
        { name: "Malaysia" },
        { name: "Maldives" },
        { name: "Mali" },
        { name: "Malta" },
        { name: "Marshall Islands" },
        { name: "Mauritania" },
        { name: "Mauritius" },
        { name: "Mexico" },
        { name: "Micronesia" },
        { name: "Moldova" },
        { name: "Monaco" },
        { name: "Mongolia" },
        { name: "Montenegro" },
        { name: "Morocco" },
        { name: "Mozambique" },
        { name: "Myanmar" },
        { name: "Namibia" },
        { name: "Nauru" },
        { name: "Nepal" },
        { name: "Netherlands" },
        { name: "New Zealand" },
        { name: "Nicaragua" },
        { name: "Niger" },
        { name: "Nigeria" },
        { name: "North Korea" },
        { name: "North Macedonia" },
        { name: "Norway" },
        { name: "Oman" },
        { name: "Pakistan" },
        { name: "Palau" },
        { name: "Palestine" },
        { name: "Panama" },
        { name: "Papua New Guinea" },
        { name: "Paraguay" },
        { name: "Peru" },
        { name: "Philippines" },
        { name: "Poland" },
        { name: "Portugal" },
        { name: "Qatar" },
        { name: "Romania" },
        { name: "Russia" },
        { name: "Rwanda" },
        { name: "Saint Kitts and Nevis" },
        { name: "Saint Lucia" },
        { name: "Saint Vincent and the Grenadines" },
        { name: "Samoa" },
        { name: "San Marino" },
        { name: "Sao Tome and Principe" },
        { name: "Saudi Arabia" },
        { name: "Senegal" },
        { name: "Serbia" },
        { name: "Seychelles" },
        { name: "Sierra Leone" },
        { name: "Singapore" },
        { name: "Slovakia" },
        { name: "Slovenia" },
        { name: "Solomon Islands" },
        { name: "Somalia" },
        { name: "South Africa" },
        { name: "South Korea" },
        { name: "South Sudan" },
        { name: "Spain" },
        { name: "Sri Lanka" },
        { name: "Sudan" },
        { name: "Suriname" },
        { name: "Sweden" },
        { name: "Switzerland" },
        { name: "Syria" },
        { name: "Taiwan" },
        { name: "Tajikistan" },
        { name: "Tanzania" },
        { name: "Thailand" },
        { name: "Timor-Leste" },
        { name: "Togo" },
        { name: "Tonga" },
        { name: "Trinidad and Tobago" },
        { name: "Tunisia" },
        { name: "Turkey" },
        { name: "Turkmenistan" },
        { name: "Tuvalu" },
        { name: "Uganda" },
        { name: "Ukraine" },
        { name: "United Arab Emirates" },
        { name: "United Kingdom" },
        { name: "United States" },
        { name: "Uruguay" },
        { name: "Uzbekistan" },
        { name: "Vanuatu" },
        { name: "Vatican City" },
        { name: "Venezuela" },
        { name: "Vietnam" },
        { name: "Yemen" },
        { name: "Zambia" },
        { name: "Zimbabwe" }
      ],
      countryCodes: countryCodesFile.countryCodes, 
    };
  },
  async mounted() {
    await this.Profile();
    if (!this.loggedUser) this.$route.push("/");
    this.getSaleses();
  },
  methods: {
    closeDialog() {
      this.$router.push("/");
    },
    async getSaleses() {
      // this.isLoading = true

      try {
        const res = await api.GET('/user/sales/active')
        const data = res.data

        if (data) {
          this.saleses = data
          const selectedSale = data.find((s) => s.is_default)
          this.sales_id = selectedSale ? selectedSale.id : ''
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
    }
  },
  setup(props, context) {
    const Composable = useAction();
    const { save: Save } = Composable;
    const { profile: Profile } = Composable;
    return {
      ...Composable,
      Profile,
      async save() {
        let result = await Save();
        if (result.code == 200) {
          const orgid = result.data.id
          localstorage.setItem('orgid', orgid)
          localstorage.removeItem("need_create_organization");
          this.$router.push("/create-new-project");
        } else {
          console.log(result);
          let response = result.data || result.Data;
          if (!response)
            response =
              "Internal server error. Please contact administrator for more help.";
          this.errorMessage = response;
        }
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.v-card__text {
  ::v-deep .v-btn__content {
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0.02em;
  }
}

.v-input {
  ::v-deep .v-input__slot {
    margin-bottom: 0;
  }
}
</style>