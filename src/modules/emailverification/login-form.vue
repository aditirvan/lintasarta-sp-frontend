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
            font-family: Mont;
            font-style: normal;
          "
        >
          Sign In Now!
        </h1>
        <v-form ref="form" style="margin-top: 40px" lazy-validation>
          <v-alert v-if="errorMessage" color="red" type="error">{{
            errorMessage
          }}</v-alert>

          <v-text-field
            maxlength="50"
            flat
            type="email"
            outlined
            v-model.trim="email"
            placeholder="Email"
            required
            :error-messages="
              $v.email.$errors.length ? $v.email.$errors[0].$message : ''
            "
            style="margin-bottom: 22px"
            @keyup="onEnter"
          ></v-text-field>

          <v-text-field
            id="password"
            flat
            outlined
            v-model="password"
            :error-messages="
              $v.password.$errors.length ? $v.password.$errors[0].$message : ''
            "
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            placeholder="Password"
            @click:append="show1 = !show1"
            style="margin-bottom: 22px"
            @keypress="
              (ev) => {
                ev.code == 'Enter' && login();
              }
            "
          ></v-text-field>

          <!-- captcha -->
          <vue-recaptcha
            ref="recaptcha"
            v-if="isDevModeIPProtection && recaptchaSitekey"
            :sitekey="recaptchaSitekey"
            @verify="onCaptchaVerified"
            class="g-recaptcha"
          />

          <p
            :style="{
              opacity:
                $v.captcha && $v.captcha.$errors && $v.captcha.$errors.length
                  ? 1
                  : 0,
              marginTop: '16px',
            }"
            class="error--text"
          >
            {{
              $v.captcha && $v.captcha.$errors && $v.captcha.$errors.length
                ? $v.captcha.$errors[0].$message
                : ""
            }}
          </p>

          <v-btn
            id="submit"
            block
            height="50"
            depressed
            color="secondary"
            class="mr-4 mt-7 text-capitalize font-weight-bold"
            @click="login"
          >
            {{ loading ? "Sign In..." : "Sign In" }}
          </v-btn>
          <br />
        </v-form>
      </v-col>
    </v-container>

    <dialogIP v-if="ipError" v-model="ipError" :errmsg="ipErrorMsg" />

    <dialogsuccess :email="email" v-model="success" @close="closeDialog" />
    <dialogfailloginVue
      :message="dialogfailloginMessage"
      v-model="dialogfaillogin"
      @reset="doReset"
      @close="
        () => {
          dialogfaillogin = false;
        }
      "
    />
    <dialogReset v-model="opendialogreset" />
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
    <dialogFailedReset
      v-model="opendialogfailedforgot"
      :message="dialogfailForgotMessage"
    />
  </v-card-text>
</template>
<script>
import Dialogsuccess from "@/modules/emailverification/dialogsuccess";
import { onMounted, ref, watch } from "@vue/composition-api";
import { useState } from "vuex-composition-helpers";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { HOMEPAGE } from "../homepage/namespace";
import { email, password, captcha, show1 } from "../homepage/emailpass";
import { VERIFYEMAIL } from "./namespace";
import useVuelidate from "@vuelidate/core";
import { required, email as Email } from "@vuelidate/validators";
import dialogfailloginVue from "../homepage/dialogfaillogin";
import VueRecaptcha from "vue-recaptcha";
import localstorage from "@/lib/localstorage";
import dialogIP from "../homepage/dialogIP.vue";
import dialogReset from "../homepage/dialogReset.vue";
import dialogFailedReset from "../homepage/dialogFailedReset.vue";
import dialogForgot from "../homepage/dialogForgot.vue";

// const isDevModeIPProtection = process.env.VUE_APP_DEV_MODE === 'fase-1.3'
const isDevModeIPProtection = true;

const recaptchaSitekey =
  process.env.VUE_APP_RECAPTCHA_SITEKEY ||
  "6LerJdYdAAAAAEY-4annX2yJvYEd5Xc363xYuD4f";

export default {
  components: {
    Dialogsuccess,
    dialogfailloginVue,
    VueRecaptcha,
    dialogIP,
    dialogReset,
    dialogFailedReset,
    dialogForgot,
  },
  data() {
    return {
      errorMessage: undefined,
      isDevModeIPProtection,
      recaptchaSitekey,
    };
  },
  methods: {
    closeDialog() {
      this.success = false;
    },
    onEnter(e) {
      this.email = this.email.toLowerCase();
    },
  },
  setup(props, context) {
    const success = ref(false);
    const { token } = context.root.$route.query;
    const { topbarloading } = useState(["topbarloading"]);
    const { verifyemail } = useNamespacedActions(VERIFYEMAIL, ["verifyemail"]);
    onMounted(() => {
      if (token) {
        topbarloading.value.start();
        verifyemail(token).then(() => {
          success.value = true;
          topbarloading.value.done();
        });
      }
    });
    const dialogfailloginMessage = ref("");
    const dialogfailForgotMessage = ref("");
    const opendialogforgot = ref(false);
    const opendialogfailedforgot = ref(false);
    const $auth = context.root.$auth;
    const loading = ref(false);
    const dialogfaillogin = ref(false);
    const { login: Login } = useNamespacedActions(HOMEPAGE, ["login"]);
    const { user } = useNamespacedState("ROLEPERMISSION", ["user"]);

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
      {
        email,
        password,
        ...additionalValidation,
      }
    );

    const ipError = ref(false);
    const ipErrorMsg = ref("");

    const login = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      loading.value = true;

      Login({
        email: email.value,
        password: password.value,
        captcha: captcha.value,
      })
        .then((data) => {
          // context.root.$VueEvent.emit('on-check-login')

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
          }

          if (data.need_create_organization) {
            return context.root.$router.push("/create-organization");
          }

          if (data.need_create_project && data.role !== "Superadmin") {
            return context.root.$router.push("/create-new-project");
          }

          context.root.$VueEvent.emit("after-check-login", data);

          context.root.$VueEvent.listen("after-user-permission-fetch", () => {
            if (context.root.$route.path !== "/") {
              context.root.$router.replace("/");
            }
          });
        })
        .then(() => {
          loading.value = false;
        })
        .catch((e) => {
          dialogfailloginMessage.value = e.data;
          dialogfaillogin.value = true;
          loading.value = false;
        });
    };
    return {
      ipErrorMsg,
      ipError,
      onCaptchaVerified,
      $v,
      user,
      login,
      success,
      doReset,
      doFailedReset,
      dialogfailForgotMessage,
      dialogfailloginMessage,
      opendialogfailedforgot,
      opendialogforgot,
      opendialogreset: ref(false),
      email,
      password,
      show1,
      loading,
      dialogfaillogin,
    };
  },
  watch: {
    dialogfaillogin(newVal) {
      if (newVal) {
        this.$refs.recaptcha.reset();
      }
    },
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

.g-recaptcha {
  transform: scale(1.15);
  transform-origin: 0 0;
}
</style>
