<template>
  <v-container>
    <!-- <v-container> -->
    <v-col class="justify-center">
      <h1 style="text-align: center; font-weight: 800; font-size: 28px; line-height: 36px; letter-spacing: 0.04em; font-family: Mont; font-style: normal">
        Sign Up!
      </h1>

      <v-form ref="form" style="margin-top: 40px" lazy-validation class="responsive-form">
        <v-alert v-if="errorMessage" color="red" type="error" :style="{ position: 'static' }">{{ errorMessage }} </v-alert>
        <!-- <v-card-text> -->
        <p class="titletext"><b>Full Name</b></p>
        <v-text-field
          maxlength="100"
          id="fullname"
          flat
          outlined
          v-model="fullname"
          placeholder="Full Name"
          required
          :error-messages="fullnameValidation.$errors.length ? fullnameValidation.$errors[0].$message : ''"
        />
        <!-- </v-card-text> -->

        <!-- <v-card-text> -->
        <p class="titletext"><b>Email</b></p>
        <v-text-field
          maxlength="50"
          flat
          type="email"
          outlined
          v-model.trim="email"
          placeholder="Email"
          required
          :error-messages="emailValidation.$errors.length ? emailValidation.$errors[0].$message : ''"
          @keyup="onEnter"
        />
        <!-- </v-card-text> -->

        <!-- <v-card-text> -->
        <p class="titletext"><b>Password</b></p>
        <v-text-field
          maxlength="255"
          id="password"
          flat
          outlined
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          placeholder="Password"
          @click:append="show1 = !show1"
          :error-messages="passwordValidation.$errors.length ? passwordValidation.$errors[0].$message : ''"
        />
        <!-- </v-card-text> -->

        <!-- <v-card-text> -->
        <p class="titletext"><b>Mobile Phone Number</b></p>
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
        <v-text-field
          v-mask="[/[1-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/]"
          flat
          outlined
          v-model="phone"
          prefix="+62"
          placeholder="Mobile Phone Number"
          required
          :error-messages="phoneValidation.$errors.length ? phoneValidation.$errors[0].$message : ''"
        />
        <!-- </v-card-text> -->
        <!--          v-mask="'##.###.###.#-###.###'"-->
        <!-- <v-text-field
                v-if="npwp && npwp === 'asd'"
                flat
                outlined
                v-model="npwpDummy"
                placeholder="NPWP Number"
                required
    
              /> -->
            <!-- <v-tooltip max-width="400" right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="grey "
                  dark
                  v-bind="attrs"
                  v-on="on"
                  class="d-flex justify-end"
                >
                  mdi-information
                </v-icon>
              </template>
              <span
                >Please contact the sales if you do not have any NPWP number</span
              >
            </v-tooltip> -->
        <!-- <v-text-field
          v-mask="'##.###.###.#-###.###'"
          flat
          outlined
          v-model="npwp"
          placeholder="NPWP Number"
          required
          :error-messages="npwpValidation.$errors.length ? npwpValidation.$errors[0].$message : ''"
        /> -->

        <!-- <v-select
          id="selected_region"
          v-model="selected_region"
          outlined
          :items="selectRegions"
          placeholder="Choose Region"   
          required      
          :error-messages="
            selected_regionValidation.$errors.length
              ? selected_regionValidation.$errors[0].$message
              : ''
          "
        >
        </v-select> -->

        <!-- <v-select
              v-model="sales_id"
              outlined
              :items="saleses"
              error-messages=""
              placeholder="Select Sales"
  
              item-text="fullname"
              item-value="id"
            /> -->

        <!-- <p class="font-weight-bold fz-14 mb-12px">Upload NPWP</p> -->

        <!-- upload npwp button -->
        <!-- <v-btn width="150" height="45" depressed color="secondary" class="mr-4 text-capitalize font-weight-bold" @click="triggerUploadNpwp">
          <span class="fz-12"> Upload File </span>
        </v-btn>

        <img v-if="npwpimg" :src="npwpimg" alt="preview-npwp-img" style="width: 100%; display: block; margin-top: 20px" />

        <input ref="npwp_file" type="file" class="d-none" @change="onChangeUploadNpwp" />

        <p v-if="npwp_fileError" class="red--text mt-11px">
          {{ npwp_fileError }}
        </p>

        <p class="font-weight-bold fz-14 mb-12px" style="margin-top: 30px">Upload KTP</p> -->

        <!-- upload ktp button -->
        <!-- <v-btn width="150" height="45" depressed color="secondary" class="mr-4 text-capitalize font-weight-bold" @click="triggerUploadKtp">
          <span class="fz-12"> Upload File </span>
        </v-btn>

        <img v-if="ktpimg" :src="ktpimg" alt="preview-ktp-img" style="width: 100%; display: block; margin-top: 20px" />

        <input ref="ktp_file" type="file" class="d-none" @change="onChangeUploadKtp" />

        <p v-if="ktp_fileError" class="red--text mt-11px">
          {{ ktp_fileError }}
        </p> -->



        <!-- agreement checkbox -->
        <div class="d-flex align-center">
          <v-checkbox v-model="agree" :error-messages="agreeValidation.$errors.length ? agreeValidation.$errors[0].$message : ''" @click="checkboxOnclick" class="mt-0">
            <template v-slot:label>
              <div>By signing up you agree to the &nbsp;<button type="button" class="text-decoration-underline primary--text fz-16" @click="getEula()">Terms of Service</button></div>
            </template>
          </v-checkbox>
        </div>

        <v-btn
          id="submit"
          block
          height="50"
          depressed
          color="secondary"
          class="mr-4 text-capitalize font-weight-bold mt-2"
          @click="signup"
          :disabled="loading || !agree"
        >
          <!-- loading indicator -->
          <beat-loader v-if="loading" :loading="loading" :color="'white'" :size="'10px'" class="ml-2" />

          {{ loading ? "Sign Up..." : "Sign Up" }}
        </v-btn>

        <br />
      </v-form>
    </v-col>
  </v-container>
</template>

<script>
import { useSignup } from "./usesignup";
import localstorage from "@/lib/localstorage";
// import { useRegion } from "@/modules/instance/compositionapi/useregion";
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import countryCodesFile from '@/app/sign-up/countryCodes'

const allowedTypes = ["image/png", "image/jpeg"];

export default {
  props: ["userType"],
  data() {
    return {
      errorMessage: undefined,
      npwp_fileError: "",
      ktp_fileError: "",
      npwpimg: undefined,
      ktpimg: undefined,
      saleses: [],
      loading: false,
      // search: '',
      countryCodes: countryCodesFile.countryCodes,      
    };
  },
  methods: {
    async getEula() {
      const routeData = this.$router.resolve({ name: "eulaContent", query: { form_name: "Sign Up Form" }, path: "/eula-content" });
      window.open(routeData.href, "_blank");
    },
    checkboxOnclick() {
      if (!this.agree) {
        // this.agreeValidation.$errors[0].$message = "Must be filled";
        this.agreeValidation = {
          ...this.agreeValidation,
          $errors: [{ $message: "Must be filled" }],
        };
      } else {
        this.agreeValidation = {
          ...this.agreeValidation,
          $errors: [],
        };
      }
    },
    triggerUploadNpwp() {
      this.$refs.npwp_file.click();
    },
    onChangeUploadNpwp(e) {
      if (e.target.files[0].size > 1024000) {
        this.npwp_fileError = "File size is too large (max 1MB)";
      } else if (!allowedTypes.includes(e.target.files[0].type)) {
        this.npwp_fileError = "Only jpg, jpeg, and png files are allowed";
      } else {
        this.npwp_file = e.target.files[0];
        this.npwpimg = URL.createObjectURL(e.target.files[0]);
        this.npwp_fileError = "";
      }
    },
    triggerUploadKtp() {
      this.$refs.ktp_file.click();
    },
    onChangeUploadKtp(e) {
      if (e.target.files[0].size > 1024000) {
        this.ktp_fileError = "File size is too large";
      } else if (!allowedTypes.includes(e.target.files[0].type)) {
        this.ktp_fileError = "Only jpg, jpeg, and png files are allowed";
      } else {
        this.ktp_file = e.target.files[0];
        this.ktpimg = URL.createObjectURL(e.target.files[0]);
        this.ktp_fileError = "";
      }
    },
    onEnter(e) {
      this.email = this.email.toLowerCase();
    },
  },
  setup(props, context) {
    const Composable = useSignup();
    const { signup: Signup } = Composable;
    // const { selectregions: selectRegions, fetchregions } = useRegion()
    // onMounted(() => {
    //   fetchregions()
    // });
    return {
      ...Composable,
      // selectRegions,
      async signup() {
        // const isCorporate = localstorage.getItem("type") !== "P";

        // check npwp_file & ktp_file
        // if (
        //   this.npwp_fileError ||
        //   this.ktp_fileError ||
        //   (this.npwp_file.files && this.npwp_file.files.length < 1 && isCorporate) ||
        //   (this.ktp_file.files && this.ktp_file.files.length < 1)
        // ) {
        //   if (this.npwp_file.files && this.npwp_file.files.length < 1 && isCorporate) {
        //     this.npwp_fileError = "NPWP must be Uploaded";
        //   }

        //   if (this.ktp_file.files && this.ktp_file.files.length < 1) {
        //     this.ktp_fileError = "KTP must be Uploaded";
        //   }

        //   // if (!isCorporate && !this.npwp) {
        //   //   this.npwp = "asd";
        //   // }

        //   await Signup();
        // } else {
          this.loading = true;
          // this.npwp_fileError = "";
          // this.ktp_fileError = "";
          try {
            // if (!isCorporate && !this.npwp) {
            //   this.npwp = "asd";
            // }

            let result = await Signup();
            if (result) {
              // this.success = true;
              this.$emit("changeSuccess");
              this.errorMessage = undefined;
            }
          } catch (err) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            if (err.response && err.response.data) {
              if (err.response.data.message) {
                this.errorMessage = err.response.data.message;
              } else {
                let response_data = err.response.data.response_data;
                if (!response_data) response_data = "Internal server error. Please contact administrator for more help.";
                this.errorMessage = response_data;
                console.log(this.errorMessage, "else");
              }
            } else {
              console.log(err, "error signup form");
              this.errorMessage = "Sorry, an error occurred. Please refresh the page.";
            }
          }

          this.loading = false;
        // }
      },
    };
  },
  mounted() {
    this.type = this.userType;
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

// .v-input {
//   ::v-deep .v-input__slot {
//     margin-bottom: 0;
//   }
// }

.mt-11px {
  margin-top: 11px;
}

.mb-12px {
  margin-bottom: 12px;
}

.mb-30px {
  margin-bottom: 12px;
}

.responsive-form {
  width: 460px;
}

::v-deep .v-text-field__details {
  position: static;
}

@media only screen and (max-width: 460px) {
  .responsive-form {
    width: 100%;
  }
}
</style>
