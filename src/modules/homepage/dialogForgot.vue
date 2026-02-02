<template>
  <v-dialog v-model="dialog" persistent max-width="500">
    <form id="form" @submit.prevent="submit"></form>
    <v-card>
      <v-card-title class="font--text headline font-weight-bold">
        Forgot Password
      </v-card-title>
      <div style="height: 20px; width: auto" />
      <v-card-text class="pb-0">
        <p class="font-weight-bold primary--text">
          We will email you a link to reset your password
        </p>
      </v-card-text>
      <v-card-text class="pb-0">
        <v-text-field
					maxlength="50"
          required
          type="email"
          v-model.trim="email"
          form="form"
          outlined
          placeholder="Enter Email"
          :error-messages="$v.email.$errors.length?$v.email.$errors[0].$message:''"
          @keyup="onEnter"
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col>
            <v-btn
              depressed
              color="accent"
              block
              height="50"
              @click="
                () => {
                  dialog = false;
                  email='';
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              form="form"
              type="submit"
              depressed
              color="secondary"
              height="50"
              block
              @click="() => {}"
            >
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useDialog } from "@/composable/usedialog";
import { ref, watch } from "@vue/composition-api";
import { email as Email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useNamespacedActions } from 'vuex-composition-helpers';
import { HOMEPAGE } from './namespace';
export default {
  props: ["value"],
  setup(props, context) {
    const { dialog } = useDialog(props, context);
    const email = ref('');
    const custommessage = ref('')
    const custommessagee = ref('')
    const $v = useVuelidate({ email: { Email, conditional1:{
      $message : "email not registered",
      $validator : ()=>{
        return !(custommessage.value == "email not registered")
      }
    },
    conditional2:{
      $message : "Account is not active, please verify your account before reset password",
      $validator : ()=>{
        return !(custommessagee.value == "Account is not active, please verify your account before reset password")
      }
    }
    
    } }, { email });

    watch(email, val=>{
      custommessage.value = ""
      custommessagee.value = ""
      $v.value.$reset()
    })
    
    const {forgotpassword} = useNamespacedActions(HOMEPAGE,['forgotpassword'])
    const submit = async () => {
      $v.value.$touch();
      forgotpassword(email.value).then(()=>{
        dialog.value = false
        context.emit('success')
        email.value=""
      }).catch(e=>{
        email.value=""
        dialog.value = false
        context.emit('error',e.response.data.message)
         //custommessage.value = "email not registered"
        // if(e.response && e.response.data.data && e.response.data.data == 'record not found'){
        //   custommessage.value = "email not registered"
        // }

        // if(e.response && e.response.data.data && e.response.data.data == 'Please verify your account before requesting reset password'){
        //   email.value=""
        //   custommessagee.value = "Account is not active, please verify your account before reset password"
        // }


        
      })
    };
    return {
      $v,
      dialog,
      submit,
      email,
    };
  },
  methods: {
    onEnter(e) {
      this.email = this.email.toLowerCase();
    },
  },
};
</script>