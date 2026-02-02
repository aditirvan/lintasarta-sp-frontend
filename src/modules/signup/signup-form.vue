<template>
  <v-card-text>
    <p v-if="loading" class="text-center">
      <beat-loader color="gray" size="10px" class="mr-2" />
    </p>

    <template v-else>
      <!-- success message -->
      <successmessage v-if="success" />

      <!-- form -->
      <template v-else>
        <Choice
          v-if="!type && personalStatus"
          :type="type"
          v-on:changeType="changeType($event)"
        />

        <NewSignupForm
          v-if="type"
          :loading="loading"
          :user-type="type"
          @changeSuccess="success = true"
        />
      </template>

      <!-- tnc popup -->
      <Tncpopup v-if="data" v-model="tnc" :data="data" />
    </template>

    <!-- tnc popup -->
    <Tncpopup v-model="tnc" />
    <!-- <Tncpopup v-model="tnc" :data="data" /> -->

    <!--    <v-snackbar v-model="snackbar" color="error" right="true" top="true">-->
    <!--      {{ errorMessage }}-->
    <!--      <template v-slot:action="{ attrs }">-->
    <!--        <v-btn-->
    <!--            dark-->
    <!--            text-->
    <!--            v-bind="attrs"-->
    <!--            @click="snackbar = false"-->
    <!--        >-->
    <!--          Close-->
    <!--        </v-btn>-->
    <!--      </template>-->
    <!--    </v-snackbar>-->
  </v-card-text>
</template>

<script>
import Choice from "@/modules/signup/choice.vue";
import Successmessage from "@/modules/signup/successmessage.vue";
import Tncpopup from "./tncpopup.vue";
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import NewSignupForm from "./new-signup-form.vue";

export default {
  components: {
    Choice,
    Successmessage,
    Tncpopup,
    NewSignupForm,
  },
  data() {
    return {
      tnc: false,
      success: false,
      npwp_fileError: "",
      ktp_fileError: "",
      npwpimg: undefined,
      ktpimg: undefined,
      saleses: [],
      loading: false,
      data: null,
      personalStatus: false,
      type: null,
      npwpDummy: "",
    };
  },
  methods: {
    changeType(char) {
      this.type = char;
    },
    async getEula() {
      // var res = await api.GET("/useradmin/eula?form_name=Sign Up Form");
      // if (res.code === 200) {
      //   this.data = res.data;
      //   this.tnc = true;
      // }
        // this.tnc = true;
      const routeData = this.$router.resolve({name: 'eulaContent', query: {form_name: 'Sign Up Form'}, path: '/eula-content'});
      window.open(routeData.href, '_blank');
    },
    async getPersonalStatus() {
      this.loading = true;

      try {
        const res = await api.GET("/user/personal-status");
        this.personalStatus = res.data.personal_active;
        this.type = !res.data.personal_active ? "C" : null;
        localstorage.setItem("personalStatus", res.data.personal_active);
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
          const isCorporate = localstorage.getItem('type') === 'C'

          if (this.npwp_file.files && this.npwp_file.files.length < 1 && isCorporate) {
            this.npwp_fileError = "NPWP must be Uploaded";
          }
          if (this.ktp_file.files && this.ktp_file.files.length < 1) {
            this.ktp_fileError = "KTP must be Uploaded";
          }

          await Signup();
        } else {
          this.loading = true;
          this.npwp_fileError = "";
          this.ktp_fileError = "";
          try {
            let result = await Signup();
            if (result) {
              this.success = true;
              this.errorMessage = undefined;
            }
          } catch (err) {
            console.log("err 1");
            window.scrollTo({ top: 0, behavior: "smooth" });
            if (err.response && err.response.data) {
              if (err.response.data.message) {
                console.log("err 2");
                this.errorMessage = err.response.data.message;
              } else {
                console.log("err 3");
                let response_data = err.response.data.response_data;
                if (!response_data)
                  response_data =
                    "Internal server error. Please contact administrator for more help.";
                this.errorMessage = response_data;
                console.log(this.errorMessage, "else");
              }
            } else {
              console.log("err 4");
              console.log(err, "error signup form");
              this.errorMessage =
                "Sorry, an error occurred. Please refresh the page.";
            }
          }

          this.loading = false;
        }
      }

      this.loading = false;
    },
  },
  mounted() {
    this.getPersonalStatus();
  },
};
</script>
