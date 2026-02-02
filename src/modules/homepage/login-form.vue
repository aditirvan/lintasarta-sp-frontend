<template>
  <v-card-text>
    <v-container>
      <v-col class="justify-center">
        <h1
          style="
            text-align: center;
            font-weight: 800;
            font-size: 28px;
            line-height: 36px;
            letter-spacing: 0.04em;
            font-family: Fira sans;
            font-style: normal;
          "
        >
          Sign In Now!
        </h1>
        <v-form ref="form" style="margin-top: 40px" lazy-validation>
          <v-text-field
            maxlength="50"
            id="username"
            flat
            outlined
            v-model.trim="email"
            placeholder="Email Address"
            required
            style="margin-bottom: 10px"
            :error-messages="
              $v.email.$errors.length ? $v.email.$errors[0].$message : ''
            "
            @keyup="onEnter"
          ></v-text-field>

          <v-text-field
            id="password"
            flat
            outlined
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            placeholder="Password"
            @click:append="show1 = !show1"
            style="margin-bottom: 10px"
            :error-messages="
              $v.password.$errors.length ? $v.password.$errors[0].$message : ''
            "
            @keypress="
              (ev) => {
                enter(ev);
              }
            "
          ></v-text-field>

          <!-- captcha -->
          <vue-recaptcha
            style="transform:scale(1.26);
            -webkit-transform:scale(1.26);
            transform-origin:0 0;
            -webkit-transform-origin:0 0;"
            ref="recaptcha"
            v-if="isDevModeIPProtection && recaptchaSitekey"
            :sitekey="recaptchaSitekey"
            @verify="onCaptchaVerified"
            class="g-recaptcha"
            :load-recaptcha-script="true"
          />

          <p
            :style="{
              opacity:
                $v.captcha && $v.captcha.$errors && $v.captcha.$errors.length
                  ? 1
                  : 0,
              marginTop: '23px',
            }"
            class="error--text"
          >
            {{
              $v.captcha && $v.captcha.$errors && $v.captcha.$errors.length
                ? $v.captcha.$errors[0].$message
                : ""
            }}
          </p>

          <div class="pt-2">
            <p
              @click="
                () => {
                  opendialogforgot = true;
                }
              "
              class="linkpointer text-right"
              style="font-weight: 600; font-size: 12px"
            >
              Forgot Password?
            </p>
          </div>

          <v-btn
            id="submit"
            block
            height="50"
            :disabled="loading"
            depressed
            color="secondary"
            class="mr-4 mt-7 text-capitalize font-weight-bold"
            @click="login"
          >
            {{ loading ? "Sign In..." : "Sign In" }}
          </v-btn>
          <br />
          <v-btn
            v-show="showBtnSignUp"
            to="/signup"
            exact
            block
            height="50"
            :disabled="loading"
            depressed
            outlined
            color="white"
            class="mr-4 mt-2 text-capitalize font-weight-bold"
            style="border: 1px solid #2c94d2"
          >
            <span class="secondary--text">Sign Up</span>
          </v-btn>
        </v-form>
      </v-col>
      <dialogfailloginVue
        :message="dialogfailloginMessage"
        :error_code="dialogfailloginErrorCode"
        v-model="dialogfaillogin"
        @reset="doReset"
        @close="
          () => {
            dialogfaillogin = false;
          }
        "
      />
    </v-container>
    <dialogForgot
      v-model="opendialogforgot"
      @success="
        () => {
          opendialogreset = true;
          dialogfaillogin = false;
        }
      "
      @error="
        (message) => {
          opendialogfailedforgot = true;
          dialogfailForgotMessage = message;
        }
      "
    />

    <dialogIP v-if="ipError" v-model="ipError" :errmsg="ipErrorMsg" />

    <dialogReset v-model="opendialogreset" />

    <dialogFailedReset
      v-model="opendialogfailedforgot"
      :message="dialogfailForgotMessage"
    />
  </v-card-text>
</template>
<script>
import { ref, onMounted } from "@vue/composition-api";
import { email, password, show1 } from "./emailpass";
import dialogfailloginVue from "./dialogfaillogin.vue";
import dialogFailedReset from "./dialogFailedReset.vue";
import dialogForgot from "./dialogForgot";
import dialogReset from "./dialogReset";
import { HOMEPAGE } from "./namespace";
import { useNamespacedActions } from "vuex-composition-helpers";
import useVuelidate from "@vuelidate/core";
import { required, email as Email } from "@vuelidate/validators";
import localstorage from "@/lib/localstorage";
import VueRecaptcha from "vue-recaptcha";
import dialogIP from "./dialogIP";
import externalSubDomain from '@/lib/externalSubDomain'

// const isDevModeIPProtection = process.env.VUE_APP_DEV_MODE === 'fase-1.3'
const isDevModeIPProtection = true;

const recaptchaSitekey =
  process.env.VUE_APP_RECAPTCHA_SITEKEY ||
  "6LerJdYdAAAAAEY-4annX2yJvYEd5Xc363xYuD4f";

export default {
  components: {
    dialogfailloginVue,
    dialogForgot,
    dialogReset,
    dialogFailedReset,
    VueRecaptcha,
    dialogIP,
  },
  setup(props, context) {
    // const $router = context.root.$router
    const dialogfailloginMessage = ref("");
    const dialogfailloginErrorCode = ref(400);
    const dialogfailForgotMessage = ref("");
    const opendialogforgot = ref(false);
    const opendialogfailedforgot = ref(false);
    const showBtnSignUp = ref(true);

    const externalSubdomain = externalSubDomain.getSubDomain();
    onMounted(() => {
      if (externalSubdomain !== "") {
        showBtnSignUp.value = false;
      }
    });

    const $auth = context.root.$auth;

    const primary = context.root.$vuetify.theme.themes.light.primary;
    const loading = ref(false);
    const dialogfaillogin = ref(false);
    const { login: Login } = useNamespacedActions(HOMEPAGE, ["login"]);
    const { profile } = useNamespacedActions("CREATEORGANIZATION", ["profile"]);
    const email = ref();
    const password = ref();
    const captcha = ref();
    const sizeCaptcha = ref("10%")

    const onCaptchaVerified = (res) => {
      captcha.value = res;
    };

    const additionalRules = isDevModeIPProtection
      ? {
          captcha: { required },
        }
      : {};

    const additionalValidation = isDevModeIPProtection
      ? {
          captcha,
        }
      : {};

    const doReset = async () => {
      opendialogforgot.value = true;
    };

    const doFailedReset = async () => {
      opendialogfailedforgot.value = true;
    };

    const $v = useVuelidate(
      {
        email: { required, Email },
        password: { required },
        ...additionalRules,
      },
      { email, password, ...additionalValidation }
    );

    const ipError = ref(false);
    const ipErrorMsg = ref("");

    function login() {
      $v.value.$touch();
      if ($v.value.$errors.length) {
        return;
      }
      loading.value = true;

      Login({
        email: email.value,
        password: password.value,
        captcha: captcha.value,
      })
        .then((data) => {
          if (data.need_validate) {
            localstorage.setItem("need_validate", true);
            // return this.$router.push('/otp')
            ipError.value = true;

            const errmsg = [
              "IP address",
              "device",
              "IP address and the device",
            ];

            ipErrorMsg.value = errmsg[data.validate_reason - 1];
          } else if (data.need_create_organization) {
            localstorage.setItem("need_create_organization", true);
            return this.$router.push("/create-organization");
          } else if (data.need_create_project && data.role !== "Superadmin") {
            localstorage.setItem("need_create_project", true);
            profile().then((res) => {
              const orgid = res.data.organization_id;
              localstorage.setItem("orgid", orgid);
              return this.$router.push("/create-new-project");
            });
          } else {
            if (data.role == "Superadmin") {
              localstorage.removeItem("need_create_organization");
              localstorage.removeItem("need_create_project");
              context.root.$VueEvent.emit("after-check-login", data);
              
              // return this.$router.push("/manage-organization");
              return window.location.href="/manage-organization";
            } else if (data.role == "GodMode") {
              localstorage.removeItem("need_create_organization");
              localstorage.removeItem("need_create_project");
              context.root.$VueEvent.emit("after-check-login", data);

              // return this.$router.push("/manage-superadmin");
              return window.location.href="/manage-superadmin";
            } else {
              localstorage.removeItem("need_create_organization");
              localstorage.removeItem("need_create_project");
              context.root.$VueEvent.emit("after-check-login", data);

              return window.location.href="/project";

            }
          }
        })
        .then(() => {
          loading.value = false;
        })
        .catch((e) => {
          this.$refs.recaptcha.reset();

          if (e.message == "Network Error") {
            return (loading.value = false);
          }

          dialogfailloginMessage.value = e.data;
          dialogfailloginErrorCode.value = e.code;
          // if(e.code == 'PARAM-001'){
          //   dialogfailloginMessage.value = ''
          // }
          dialogfaillogin.value = true;
          loading.value = false;
        });
    }
    return {
      ipErrorMsg,
      ipError,
      onCaptchaVerified,
      enter(e) {
        if (e.code == "Enter") {
          login();
        }
      },
      $v,
      doReset,
      doFailedReset,
      dialogfailloginErrorCode,
      dialogfailForgotMessage,
      dialogfailloginMessage,
      opendialogfailedforgot,
      opendialogforgot,
      opendialogreset: ref(false),
      email,
      password,
      show1,
      primary,
      login,
      loading,
      dialogfaillogin,
      sizeCaptcha,
      showBtnSignUp,
    };
  },
  data() {
    return {
      isDevModeIPProtection,
      recaptchaSitekey,
    };
  },
  watch: {
    dialogfaillogin(newVal) {
      if (newVal) {
        this.$refs.recaptcha.reset();
      }
    },
  },
  methods: {
    onEnter(e) {
      this.email = this.email.toLowerCase();
    },
  },
};
</script>
<style lang="scss" scoped>
.v-card__text {
  ::v-deep .v-btn__content {
    font-family: Fira sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0.02em;
  }
}

.g-recaptcha {
  transform: scale(1.15);
  transform-origin: 0 0;
}
</style>
