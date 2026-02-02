<template>
  <v-container class="responsive-container">
    <v-card class="mx-auto pa-10 border-card border-success" max-width="500" outlined v-if="action == 'success'">
      <v-card-title class="d-flex justify-center mb-8"><h2 class="font-blue">Selamat</h2></v-card-title>
      <v-card-subtitle class="pb-0 fz-14 text-center font-title">Akun anda telah berhasil dibuat</v-card-subtitle>
      <v-card-subtitle class="pt-1 mb-3 fz-14 text-center font-title">Silakan periksa email Anda untuk verifikasi akun!</v-card-subtitle>
      <v-btn block height="45" depressed color="secondary" class="mr-4 text-capitalize font-weight-bold btn-sign" @click="onLogin()"> OK </v-btn>
    </v-card>

    <v-card class="pa-5 border-card" v-else>
      <h1 class="text-center mb-5 mt-8" v-if="!type">What will you be using for?</h1>
      <v-row v-if="!type" class="mb-5">
        <v-col cols="12" sm="6">
          <v-card
            border-color="primary"
            outlined
            cols="12"
            sm="6"
            class="choice"
            @mouseover="personalhover = true"
            @mouseleave="personalhover = false"
            @click="changeType('P')"
          >
            <v-icon x-large :color="personalhover ? '#1F60A8' : '#556272'"> mdi-account </v-icon>
            <h2 style="margin: 10px 0">SME</h2>
            <p style="color: #a5b3bf" class="fz-12">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card
            border-color="primary"
            outlined
            cols="12"
            sm="6"
            class="choice"
            @mouseover="corporatehover = true"
            @mouseleave="corporatehover = false"
            @click="changeType('C')"
          >
            <v-icon x-large :color="corporatehover ? '#1F60A8' : '#556272'"> mdi-domain </v-icon>
            <h2 style="margin: 10px 0">Enterprise</h2>
            <p style="color: #a5b3bf" class="fz-12">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </v-card>
        </v-col>
      </v-row>

      <h1 class="text-center mb-5 mt-8 font-blue" v-if="type">Buat Akun</h1>
      <v-card-text v-if="type">
        <v-row class="d-flex justify-center"
          ><v-col cols="12" sm="6" class="pt-0 pb-0">
            <p class="fz-14 font-blue mb-2">Nama Lengkap</p>
            <v-text-field
              maxlength="100"
              flat
              outlined
              v-model="fullname"
              placeholder="Nama Lengkap"
              @blur="$v.fullname.$touch()"
              :error-messages="$v.fullname.$errors.length ? $v.fullname.$errors[0].$message : ''"
            ></v-text-field></v-col
        ></v-row>
        <v-row class="d-flex justify-center"
          ><v-col cols="12" sm="6" class="pt-0 pb-0">
            <p class="fz-14 font-blue mb-2">Email</p>
            <v-text-field
              type="email"
              flat
              outlined
              v-model="email"
              placeholder="Email"
              @blur="$v.email.$touch()"
              :error-messages="$v.email.$errors.length ? $v.email.$errors[0].$message : ''"
            ></v-text-field></v-col
        ></v-row>
        <v-row class="d-flex justify-center"
          ><v-col cols="12" sm="6" class="pt-0 pb-0">
            <p class="fz-14 font-blue mb-2">Kata Sandi</p>
            <v-text-field
              flat
              outlined
              v-model="password"
              placeholder="Kata Sandi"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              @blur="$v.password.$touch()"
              :error-messages="$v.password.$errors.length ? $v.password.$errors[0].$message : ''"
            ></v-text-field></v-col
        ></v-row>
        <v-row class="d-flex justify-center"
          ><v-col cols="12" sm="6" class="pt-0 pb-0">
            <p class="fz-14 font-blue mb-2">Mobile Phone Number</p>
            <!-- <v-text-field
              v-mask="[/[1-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/]"
              prefix="+62"
              flat
              outlined
              v-model="phone"
              placeholder=" Nomor Handphone"
              @blur="$v.phone.$touch()"
              :error-messages="$v.phone.$errors.length ? $v.phone.$errors[0].$message : ''"
            ></v-text-field> -->
            <v-select
              v-model="selectedCountryCode"
              :items="countryCodes"
              item-text="name"
              item-value="code"
              label="Country Code"
              outlined
              dense
              filterable
              v-bind:search-input.sync="search"
            ></v-select>
            <v-text-field
              v-mask="[/[1-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/]"
              flat
              outlined
              v-model="phone"
              :prefix="selectedCountryCode"
              placeholder="Mobile Phone Number"
              required
              :error-messages="$v.phone.$errors.length ? $v.phone.$errors[0].$message : ''"
            />
            
            </v-col
        ></v-row>
        <!-- <v-row class="d-flex justify-center mb-2"
          ><v-col cols="12" sm="6" class="pt-0 pb-0">
            <p class="fz-14 font-blue mb-2">Nomor NPWP</p>
            <v-text-field
              v-mask="'##.###.###.#-###.###'"
              flat
              outlined
              v-model="npwp"
              placeholder="Nomor NPWP"
              @blur="$v.npwp.$touch()"
              :error-messages="$v.npwp.$errors.length ? $v.npwp.$errors[0].$message : ''"
            ></v-text-field></v-col
        ></v-row> -->

        <!-- <v-row class="d-flex justify-center mt-2"
          ><v-col cols="12" sm="6" class="pt-0 pb-0">
            <p class="fz-14 font-blue mb-2">Upload NPWP</p>
            <v-btn width="150" height="45" depressed color="secondary" class="mr-4 text-capitalize font-weight-bold" @click="triggerUploadNpwp()">
              <span class="fz-12"> Upload File </span>
            </v-btn>
            <img v-if="npwpimg" :src="npwpimg" alt="preview-npwp-img" style="width: 100%; display: block" class="mt-5" />
            <input ref="npwp_file" type="file" class="d-none" @change="onChangeUploadNpwp($event)" />
            <p v-if="npwp_fileError" class="red--text mt-3">
              {{ npwp_fileError }}
            </p>
            <p v-if="$v.npwpimg.$errors.length" class="red--text mt-3">
              {{ $v.npwpimg.$errors[0].$message }}
            </p></v-col
          ></v-row
        > -->

        <!-- <v-row class="d-flex justify-center mb-3"
          ><v-col cols="12" sm="6" class="pt-0 pb-0">
            <p class="fz-14 font-blue mb-2 mt-5">Upload KTP</p>
            <v-btn width="150" height="45" depressed color="secondary" class="mr-4 text-capitalize font-weight-bold" @click="triggerUploadKtp()">
              <span class="fz-12"> Upload File </span>
            </v-btn>
            <img v-if="ktpimg" :src="ktpimg" alt="preview-ktp-img" style="width: 100%; display: block" class="mt-5" />
            <input ref="ktp_file" type="file" class="d-none" @change="onChangeUploadKtp($event)" />
            <p v-if="ktp_fileError" class="red--text mt-3">
              {{ ktp_fileError }}
            </p>
            <p v-if="$v.ktpimg.$errors.length" class="red--text mt-3">
              {{ $v.ktpimg.$errors[0].$message }}
            </p>
          </v-col></v-row
        > -->
        <v-row class="d-flex justify-center mb-5 mt-5">
          <v-checkbox v-model="agree">
            <template v-slot:label>
              <!-- <div>By signing up you agree to the</div> -->
              <div>Dengan mendaftar Anda menyetujui,</div>
            </template>
          </v-checkbox>

          &nbsp; <button type="button" class="text-decoration-underline primary--text fz-16" @click="getEula()">Ketentuan Layanan</button>
        </v-row>

        <v-row class="d-flex justify-center mb-5 mt-5">
          <v-col cols="12" sm="6" class="pt-0 pb-0"
            ><v-btn
              id="submit"
              block
              height="50"
              depressed
              color="secondary"
              class="mr-4 text-capitalize font-weight-bold btn-sign"
              @click="onSubmit()"
              :disabled="!agree"
            >
              Buat Akun
            </v-btn></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="5000" :color="action == 'success' ? 'green' : 'red'">
      <span class="fz-14">{{ text }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false"> X </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref } from "@vue/composition-api";
import { minLength, helpers, email as Email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import externalSubDomain from "../../lib/externalSubDomain";
import api from "../../lib/api";
import countryCodesFile from './countryCodes.js'

export default {
  setup(props, context) {
    const action = ref("");
    const text = ref("");
    const type = ref("C");
    const fullname = ref("");
    const email = ref("");
    const password = ref("");
    const phone = ref("");
    // const npwp = ref("");
    const npwp_file = ref("");
    const npwpimg = ref("");
    const npwp_fileError = ref("");
    const ktp_fileError = ref("");
    const ktp_file = ref("");
    const ktpimg = ref("");
    const hover = ref(false);
    const agree = ref(false);
    const personalhover = ref(false);
    const corporatehover = ref(false);
    const show1 = ref(false);
    const snackbar = ref(false);
    const allowedTypes = ["image/png", "image/jpeg"];
    const selectedCountryCode = ref('+62')
    const search = ref('');
    const countryCodes = countryCodesFile.countryCodes

    const changeType = (data) => {
      type.value = data;
    };
    const triggerUploadNpwp = () => {
      context.refs.npwp_file.click();
    };
    const onChangeUploadNpwp = (e) => {
      if (e.target.files[0].size > 1024000) {
        npwp_fileError.value = "File size is too large (max 1MB)";
      } else if (!allowedTypes.includes(e.target.files[0].type)) {
        npwp_fileError.value = "Only jpg, jpeg, and png files are allowed";
      } else {
        npwp_file.value = e.target.files[0];
        npwpimg.value = URL.createObjectURL(e.target.files[0]);
        npwp_fileError.value = "";
      }
    };
    const triggerUploadKtp = () => {
      context.refs.ktp_file.click();
    };
    const onChangeUploadKtp = (e) => {
      if (e.target.files[0].size > 1024000) {
        ktp_fileError.value = "File size is too large";
      } else if (!allowedTypes.includes(e.target.files[0].type)) {
        ktp_fileError.value = "Only jpg, jpeg, and png files are allowed";
      } else {
        ktp_file.value = e.target.files[0];
        ktpimg.value = URL.createObjectURL(e.target.files[0]);
        ktp_fileError.value = "";
      }
    };

    const getEula = () => {
      const url = `${window.location.origin}/eula-content?form_name=Sign Up Form`;
      window.open(url, "_blank");
    };

    const $v = useVuelidate(
      {
        fullname: {
          required: helpers.withMessage("Nama Lengkap harus diisi.", (val) => {
            return val;
          }),
          minLength: minLength(3),
        },
        email: {
          required: helpers.withMessage("Email harus diisi.", (val) => {
            return val;
          }),
          Email,
        },
        password: {
          required: helpers.withMessage("Kata Sandi harus diisi.", (val) => {
            return val;
          }),
        },
        phone: {
          required: helpers.withMessage("Nomor Handphone harus diisi.", (val) => {
            return val;
          }),
        },
        // npwp: {
        //   required: helpers.withMessage("Nomor NPWP harus diisi.", (val) => {
        //     return val;
        //   }),
        // },
        agree: {
          required: helpers.withMessage("harus diisi.", (val) => {
            return val;
          }),
        },
        // ktpimg: {
        //   required: helpers.withMessage("Value couldnt be empty.", (val) => {
        //     return val;
        //   }),
        // },
        // npwpimg: {
        //   required: helpers.withMessage("Value couldnt be empty.", (val) => {
        //     return val;
        //   }),
        // },
      },
      {
        fullname,
        email,
        password,
        phone,
        // npwp,
        agree,
        // ktpimg,
        // npwpimg,
      }
    );

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const onSubmit = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const externalSubdomain = externalSubDomain.getSubDomain();
      const newPhone = `${selectedCountryCode.value}${phone.value}`.replaceAll(" ", "");
      const payload = {
        fullname: fullname.value,
        email: email.value,
        password: password.value,
        phone_number: newPhone,
        // npwp: npwp.value,
        // npwp_file: await toBase64(npwp_file.value.files[0]),
        // ktp_file: await toBase64(ktp_file.value.files[0]),
        external_subdomain: externalSubdomain,
        type: type.value,
        host: window.location.host,
      };

      try {
        const result = await api.POST("user/register", payload);
        if (result.code == 200) {
          snackbar.value = true;
          text.value = "Your account has been successfully created";
          action.value = "success";
        }
      } catch (error) {
        action.value = "error";
        snackbar.value = true;
        text.value = error.message;
      }
    };
    const onLogin = () => {
      window.location.href = "/iframe-signup.html";
    };

    return {
      selectedCountryCode,
      countryCodes,
      search,
      changeType,
      type,
      hover,
      personalhover,
      corporatehover,
      fullname,
      email,
      password,
      phone,
      // npwp,
      triggerUploadNpwp,
      npwp_fileError,
      npwp_file,
      npwpimg,
      onChangeUploadNpwp,
      allowedTypes,
      triggerUploadKtp,
      ktp_file,
      ktp_fileError,
      ktpimg,
      onChangeUploadKtp,
      getEula,
      agree,
      onSubmit,
      $v,
      toBase64,
      show1,
      snackbar,
      text,
      action,
      onLogin,
    };
  },
};
</script>

<style lang="scss" scoped>
.choice {
  cursor: pointer;
  padding: 30px;
  height: 175px;
  border-radius: 10px;
}

.choice:hover {
  border-color: #1f60a8;
}

.choice:hover > h2 {
  color: #1f60a8;
}

.responsive-container {
  width: 850px;
  font-family: "Fira Sans", Sans-serif;
  font-weight: 600 !important;
}
.border-card {
  box-shadow: none !important;
  border: groove;
  border-radius: 15px !important;
}

::v-deep .v-text-field__details {
  position: static;
}

.font-blue {
  color: #3f96d5 !important;
  font-weight: 800 !important;
}
.font-title {
  color: rgb(0 0 0 / 35%) !important;
  font-weight: 800 !important;
}
.border-success {
  border-radius: 15px !important;
}

.btn-sign {
  border-radius: 25px;
}

// ::v-deep .v-card {
//   display: flex !important;
//   flex-direction: column;
// }

// ::v-deep .v-card__text {
//   flex-grow: 1;
//   overflow: auto;
// }

@media only screen and (max-width: 870px) {
  .responsive-container {
    width: 100%;
  }
}
</style>
