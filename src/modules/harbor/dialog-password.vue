<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card ref="form" class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Confirm Password</div>
      </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">Email</p>
          <v-text-field
          readonly
          v-model="email"
          outlined
          single-line
          ></v-text-field>
      </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">Password</p>
          <v-text-field
          v-model="password"
          outlined
          single-line
          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show2 ? 'text' : 'password'"
          @click:append="show2 = !show2"
          :error-messages="$v.password.$errors.length ? $v.password.$errors[0].$message : ''"
          ></v-text-field>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
            :disabled="isLoadingBtn"
            depressed
            height="45"
            block
            class="accent"
            @click="
              () => {
                dialog = false
              }
            "
            >Cancel</v-btn>
          </v-col>
          <v-col>
            <v-btn
            :loading="isLoadingBtn"
            :disabled="isLoadingBtn"
            id="Add"
            depressed
            height="45"
            block
            class="secondary"
            @click="confirmPw"
            >Confirm</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { ref } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core';
import { required, requiredIf,  } from '@vuelidate/validators'
import { HARBOR } from './namespace';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';

export default {
  props: ["value", "title"],
  setup(props, context) {
    const { downloadConfig, generateToken } = useNamespacedActions(HARBOR, ["downloadConfig", "generateToken"])
    const { isLoadingBtn } = useNamespacedGetters(HARBOR, ["isLoadingBtn"])
    
    const { dialog } = useDialog(props, context)
    const { harborid } = context.root._route.params;
    
    const email = ref(localStorage.getItem("username"))
    const password = ref()

    const $v = useVuelidate(
      {
        password: { required },
      },
      {
        password
      })

    const confirmPw = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) return

      let payload, resp
      if(props.title == 'kubeconfig'){
        payload = {
          id: harborid,
          email: email.value,
          password: password.value
        }
        resp = await downloadConfig(payload)
      }else if(props.title == 'generateToken'){
        payload = {
          harborid: harborid,
          body: {
            email: email.value,
            password: password.value
          }
        }
        resp = await generateToken(payload)
      }

      if(resp.status){
        dialog.value = false
      }else{
        console.log(resp)
        dialog.value = false
      }
    }
    return {
      email,
      password,
      dialog,
      confirmPw,
      $v,
      show2: ref(false),
      isLoadingBtn
    }
  },
}
</script>