<template>
  <v-main style="margin-top: 65px">
    <v-container
      fluid
      :style="{
        'background-image': 'url(' + require('@/assets/RegisterPage.png') + ')',
        'background-position': 'bottom right',
        'padding-bottom': '50px',
        'background-size': 'contain',
        height: '100%',
      }"
    >
      <v-row>
        <v-col cols="12" class="d-flex pt-7 justify-center">
          <v-card
            style="
              background: #ffffff;
              box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
              border-radius: 20px;
            "
            width="460"
          >
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
                  Create new password
                </h1>
                <v-form ref="form" style="margin-top: 40px" lazy-validation>
                  <v-text-field
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1"
                    maxlength="255"
                    v-model="newPassword"
                    id="password"
                    flat
                    outlined
                    name="input-10-1"
                    placeholder="New Password"
                    style="margin-bottom: 22px"
                    :error-messages="
                      $v.newPassword.$errors.length
                        ? $v.newPassword.$errors[0].$message
                        : ''
                    "
                  ></v-text-field>

                  <v-text-field
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show2 ? 'text' : 'password'"
                    @click:append="show2 = !show2"
                    maxlength="255"
                    v-model="confirmPassword"
                    id="password"
                    flat
                    outlined
                    name="input-10-1"
                    placeholder="Confirm New Password"
                    :error-messages="
                      $v.confirmPassword.$errors.length
                        ? $v.confirmPassword.$errors[0].$message
                        : ''
                    "
                    style="margin-bottom: 22px"
                  ></v-text-field>

                  <v-btn
                    id="submit"
                    block
                    height="50"
                    depressed
                    color="secondary"
                    class="mr-4 mt-7 text-capitalize font-weight-bold"
                    @click="submit"
                  >
                    {{ loading ? "Create Password..." : "Create Password" }}
                  </v-btn>
                  <br />
                </v-form>
              </v-col>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <dialogsuccess
      v-model="opendialogsuccess"
      @confirm="
        () => {
          redirect();
        }
      "
    />
    <dialogfaillresetVue
          :message="dialogfailresetMessage"
          v-model="dialogfailreset"
          @close="
          () => {
            dialogfailreset = false;
          }
        "
    />

  </v-main>
</template>
<script>
import { ref } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { useNamespacedActions } from "vuex-composition-helpers";
import { HOMEPAGE } from "../homepage/namespace";
var validator = require("validator");
import dialogsuccess from "./dialogsuccess";
import dialogfaillresetVue from "./dialogfaillreset.vue";
export default {
  components: { dialogsuccess,dialogfaillresetVue },
  setup(props, context) {
    const dialogfailresetMessage = ref("");
    const { token } = context.root.$route.query;
    const newPassword = ref("");
    const confirmPassword = ref("");
    const dialogfailreset = ref(false);
    const redirect = () => {
      console.log("redirect");
      context.root.$router.replace("/");
    };
    const $v = useVuelidate(
      {
        newPassword: {
          required,
          minLength: minLength(8),
          isStrongPassword: {
            $message: "must include uppercase and lowercase",
            $validator: (val) => {
              return (
                !!val &&
                validator.isStrongPassword(val, {
                  minLength: 1,
                  minLowercase: 1,
                  minUppercase: 1,
                  minNumbers: 0,
                  minSymbols: 0,
                })
              );
            },
          },
          isStrongPassword1: {
            $message: "must include number and symbol",
            $validator: (val) => {
              return (
                !!val &&
                validator.isStrongPassword(val, {
                  minLength: 1,
                  minLowercase: 0,
                  minUppercase: 0,
                  minNumbers: 1,
                  minSymbols: 0,
                })
              );
            },
          },
          isSymbol: {
            $message: "must include symbol",
            $validator: (val) => {
              return !!val.match(/.*[-@#!$%^&*()_+|~=`{}[\]:";'<>?,./ ].*$/);
            },
          },
        },
        confirmPassword: {
          required,
          conditional: {
            $message: "confirm password not match",
            $validator: (val) => {
              return val == newPassword.value;
            },
          },
          minLength: minLength(8),
          isStrongPassword: {
            $message: "must include uppercase and lowercase",
            $validator: (val) => {
              return (
                !!val &&
                validator.isStrongPassword(val, {
                  minLength: 1,
                  minLowercase: 1,
                  minUppercase: 1,
                  minNumbers: 0,
                  minSymbols: 0,
                })
              );
            },
          },
          isStrongPassword1: {
            $message: "must include number",
            $validator: (val) => {
              return (
                !!val &&
                validator.isStrongPassword(val, {
                  minLength: 1,
                  minLowercase: 0,
                  minUppercase: 0,
                  minNumbers: 1,
                  minSymbols: 0,
                })
              );
            },
          },
          isSymbol: {
            $message: "must include symbol",
            $validator: (val) => {
              return !!val.match(/.*[-@#!$%^&*()_+|~=`{}[\]:";'<>?,./ ].*$/);
            },
          },
        },
      },
      { newPassword, confirmPassword }
    );
    const { resetpassword:ResetPassword } = useNamespacedActions(HOMEPAGE, ["resetpassword"]);
    const opendialogsuccess = ref(false);
    const submit = () => {
      $v.value.$touch();
      console.log($v.value);
      if ($v.value.$errors.length) return;
      const Value = {
        token: token,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
      };
      
      ResetPassword(Value)
        .then((data) => {
          console.log(data);
          opendialogsuccess.value = true;
        })
        .catch((e) => {
          dialogfailresetMessage.value = e.response.data.data;
          console.log(e.response.data.data);
          dialogfailreset.value = true;
        });

    };
    return {
      redirect,
      dialogfailresetMessage,
      dialogfailreset,
      opendialogsuccess,
      $v,
      submit,
      newPassword,
      confirmPassword,
      loading: ref(false),
      show1: ref(false),
      show2: ref(false)
    };
  },
};
</script>
