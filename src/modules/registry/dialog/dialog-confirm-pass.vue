<template>
  <div>
    <v-dialog persistent v-model="dialog" max-width="500">
      <v-card class="pt-7 rounded-lg"  v-if="confirm_pass">
        <v-card-text>
          <div class="d-flex flex-row">
            <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
            <p class="fz-18 font-weight-bold mb-0">
              Confirm Password
            </p>
          </div>
        </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">
              For your security, please confirm your password to continue.</p>
          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            counter
            @click:append="show1 = !show1"
            outlined
            placeholder="Password"
            :error-messages="$v.password.$errors.length ? $v.password.$errors[0].$message : ''"
          />
          
          <!-- captcha -->
          <!-- <vue-recaptcha
            style="transform:scale(1.26);
            -webkit-transform:scale(1.26);
            transform-origin:0 0;
            -webkit-transform-origin:0 0;"
            ref="recaptcha"
            v-if=" recaptchaSitekey"
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
          </p> -->
        </v-card-text>
        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="#CDCDCD"
                depressed
                block
                height="35"
                 @click="() => {
                            dialog = false
                            $emit('input', false);
                        }"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="primary"
                depressed
                block
                height="35"
                @click="onConfirm"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="pt-7 rounded-lg" v-else>
        <v-card-text>
          <div class="d-flex flex-row">
            <!-- <v-icon left>$vuetify.icons.alertcircleIcon</v-icon> -->
            <p class="fz-18 font-weight-bold mb-0">
              Your Password
            </p>
          </div>
        </v-card-text>
        <v-card-text>
          <p>
              Your registry password is 
              <b>{{ dataShow}}</b>
          </p>
          
        </v-card-text>
        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="#CDCDCD"
                depressed
                block
                height="35"
                 @click="() => {
                            dialog = false
                            $emit('input', false);
                        }"
              
              >
                Close
              </v-btn>
            </v-col>
            
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { REGISTRY } from "../namespace";
import { ref,computed } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

// const recaptchaSitekey =
//   process.env.VUE_APP_RECAPTCHA_SITEKEY ||
//   "6LerJdYdAAAAAEY-4annX2yJvYEd5Xc363xYuD4f";

export default {
  props: ["value", "item"],
    data () {
      return {
        show1: false,
      }
    },
  setup(props, { emit }) {
    const { confirmPass,showPass } = useNamespacedActions(REGISTRY, ["confirmPass","showPass"]);
    const dialog = computed({
        get: () => props.value,
        set: (val) => {
            if(!val){
                emit('clearItem', {})
            }
            emit("input", val);
            
        },
    });
    const closePass = ref(false);
    const confirm_pass = ref(true);
    const password = ref("");
    const captcha = ref();
    const dataShow = ref({});
    const onCaptchaVerified = (res) => {
      captcha.value = res;
    };

    const onConfirm = async () => {
        const params = {
          password: password.value,
          entity_id: props.item.entity_id,
          // captcha:captcha.value,
        };
        // console.log(params);
        const res= await confirmPass(params);
        // console.log("=================res=============",res);
        // console.log("=================res.status=============",res.status);
      if(res.status==200){   
        // const data= await showPass();
        if(res.data!=""){
        dataShow.value=res.data.data;
        }else{
        dataShow.value="unknown"
        }
        // console.log("=================dataShow=============",dataShow);
        confirm_pass.value=false
      }
    }
    const $v = useVuelidate(
      {
        password: { required},
      },
      {
        password,
      }
    );
    return {
      confirm_pass,
      onConfirm,
      password,
      confirmPass,
      showPass,
      dataShow,
      $v,
      closePass,
      dialog,
      onCaptchaVerified,
      enter(e) {
        if (e.code == "Enter") {
          login();
        }
      },
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>