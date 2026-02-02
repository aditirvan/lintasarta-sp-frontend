<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Change Password</div>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Old Password</p>
        <v-text-field
          :append-icon="showOld ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showOld ? 'text' : 'password'"
          @click:append="showOld = !showOld"
          placeholder="Input existing password"
          maxlength="255"
          v-model="oldpassword"
          :error-messages="
            $v.oldpassword.$errors.length
              ? $v.oldpassword.$errors[0].$message
              : ''
          "
          outlined
        >
        </v-text-field>

      

      </v-card-text>
      <v-card-text>
        <p class="titletext">New Password</p>
        <v-text-field
          :append-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showNew ? 'text' : 'password'"
          @click:append="showNew = !showNew"
          placeholder="Input new password"
          maxlength="255"
          v-model="newpassword"
          :error-messages="
            $v.newpassword.$errors.length
              ? $v.newpassword.$errors[0].$message
              : ''
          "
          outlined
        >
        </v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Confirm Password</p>
        <v-text-field
          :append-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showConfirm ? 'text' : 'password'"
          @click:append="showConfirm = !showConfirm"
          maxlength="255"
          placeholder="Confirm new password"
          v-model="confirmpassword"
          :error-messages="
            $v.confirmpassword.$errors.length
              ? $v.confirmpassword.$errors[0].$message
              : ''
          "
          outlined
        >
        </v-text-field>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
              @click="dialog = false"
              block
              height="50"
              depressed
              class="accent"
            >
              <span style="font-size: 14px">Cancel</span></v-btn
            >
          </v-col>
          <v-col>
            <v-btn
              @click="Update"
              block
              height="50"
              depressed
              class="secondary"
            >
              <span style="font-size: 14px">Update</span></v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
const { required, email, minLength } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;
import { useDialog } from "@/composable/usedialog";
import { ref, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { PROFILE } from "./namespace";
var validator = require("validator");
export default {
  props: ["value"],
  setup(props, { emit, root }) {
    const oldpassword = ref();
    const newpassword = ref();
    const confirmpassword = ref();
    const erroroldpassword = ref("");
    const oldpassworderror = ref("")
    const $v = useVuelidate(
      {
        oldpassword: {
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
              return (
                !!val && !!val.match(/.*[-@#!$%^&*()_+|~=`{}[\]:";'<>?,./ ].*$/)
              );
            },
          },
          oldpassword:{
            $message: "old password not match",
            $validator: (val) => {
              return !oldpassworderror.value
            },
          }
        },
        newpassword: {
          required,
          minLength: minLength(8),
          conditional: {
            $message: "passwords may not be the same as before",
            $validator: () => !erroroldpassword.value,
          },
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
              return (
                !!val && !!val.match(/.*[-@#!$%^&*()_+|~=`{}[\]:";'<>?,./ ].*$/)
              );
            },
          },
        },
        confirmpassword: {
          required,
          conditional: {
            $message: "confirm password not match",
            $validator: (val) => val == newpassword.value,
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
              return (
                !!val && !!val.match(/.*[-@#!$%^&*()_+|~=`{}[\]:";'<>?,./ ].*$/)
              );
            },
          },
        },
      },

      { oldpassword, newpassword, confirmpassword }
    );
    const { changepassword } = useNamespacedActions(PROFILE, [
      "changepassword",
    ]);
    watch(oldpassword, (val) => {
      oldpassworderror.value = ""
      
      $v.value.$reset();
    });
    watch(newpassword, val=>{
      erroroldpassword.value = ""
      $v.value.$reset();
    })
    const {
      setopendialoghavebeensubmitted,
    } = useNamespacedMutations("DASHBOARD", ["setopendialoghavebeensubmitted"]);
    const Update = async () => {
      $v.value.$touch();
      console.log($v.value.$errors);
      if ($v.value.$errors.length) {
        return;
      }
      const Value = {
        old_password: oldpassword.value,
        new_password: newpassword.value,
        confirm_password: confirmpassword.value,
      };
      return await changepassword(Value)
        .then(() => {
          dialog.value = false;
        })
        .then(() => {
          setopendialoghavebeensubmitted(true);
        })
        .catch((e) => {
          const data = e.response.data.data;
          if (data == "Passwords may not be the same as before") {
            erroroldpassword.value = data;
          }
          if( data == "old_password not match"){
            oldpassworderror.value = data

          }
        });
    };
    const { dialog } = useDialog(props, { emit });
    return {
      oldpassworderror,
      dialog,
      oldpassword,
      newpassword,
      confirmpassword,
      $v,
      showOld: ref(false),
      showNew: ref(false),
      showConfirm: ref(false),
      Update,
    };
  },
};
</script>
<style lang="scss" scoped>
.titletext {
  font-weight: 700;
  font-size: 12px;
}
.hideinput {
  ::v-deep input {
    position: relative;
    bottom: 50px;
    z-index: -2;
  }
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f2f2f2;
  }
}
</style>