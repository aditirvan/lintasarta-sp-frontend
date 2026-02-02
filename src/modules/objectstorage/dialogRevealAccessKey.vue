<template>
  <v-dialog v-model="dialog"  max-width="500">
    <v-card v-if="accessKey">
      <v-card-title class="pb-7" > 
        <div class="headline font-weight-bold font--text">Reveal Your Access Key</div>
      </v-card-title>
      <v-card-text>
        <p class="font-weight-bold">Access Key ID</p>
        <v-text-field
          id="accessKeyID"
          maxlength="50"
          :value="accessKey.access_key"
          outlined
          filled
          readonly
          flat
          solo
          hide-details
          class="v-input-append"
        >
          <template v-slot:append>
            <v-btn depressed
              @click="copyText('accessKeyID')"
              class="secondary"
              width="100"
              height="56"
              style="position: relative; right: -12px;border-radius: 0 4px 4px 0"
              >Copy</v-btn
            >
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-text v-if="showSecretKey">
        <p class="font-weight-bold">Secret Access Key</p>
        <v-text-field
          id="revealedSecretKey"
          maxlength="50"
          :value="secretKey"
          filled
          outlined
          solo
          flat
          readonly
          hide-details
          class="v-input-append"
        >
          <template v-slot:append>
            <v-btn depressed
              @click="copyText('revealedSecretKey')"
              class="secondary"
              width="100"
              height="56"
              style="right: -12px;border-radius: 0 4px 4px 0"
            >
              Copy
            </v-btn>
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-actions v-if="showSecretKey">
        <v-row class="ma-2">
          <v-col cols="12">
            <v-btn depressed
              height="50"
              color="secondary"
              block
              @click="closeDialog"
            >
              Okay
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>

      <!-- Enter Password -->
      <v-card-text v-if="!showSecretKey">
        <p class="font-weight-bold">Your Password</p>
        <v-text-field
          outlined
          placeholder="Please enter your password"
          required
          type="password"
          v-model="password"
          :error-messages="createErrorMessage('password', $v)"
        />
      </v-card-text>
      <v-card-actions v-if="!showSecretKey">
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn depressed
              height="50"
              color="accent"
              block
              @click="
                () => {
                  $emit('close')
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn depressed
              height="50"
              color="secondary"
              block
              @click="reveal"
            >
              Reveal
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>

import { ref } from '@vue/composition-api'
import { useObjectStorage } from './composableapi/useobjectstorage'
import { createErrorMessage } from '@/lib/validator'
const useVuelidate = require('@vuelidate/core').default
const { required } = require('@vuelidate/validators')


export default {
  props: ['value', 'accessKey'],
  computed:{
    dialog:{
      get:function(){
        return this.value
      },
      set:function(val){
        this.$emit('close', val)
      }
    }
  },
  setup (props, context){
    
    const Composable = {
      ...useObjectStorage()
    }

    const {
      revealAccessKey
    } = Composable

    const password = ref(null)

    const $v = useVuelidate(
    {
      password: { required }
    }, 
    {
      password
    })

    const showSecretKey = ref(false)
    const secretKey = ref(null)
    const reveal = async () => {
      $v.value.$touch()
      if($v.value.$invalid) return

      const payload = {
        id: props.accessKey.id,
        password: password.value
      }

      const response = await revealAccessKey(payload)
      if(response.status == 200){
        secretKey.value = response.data.data
        showSecretKey.value = true
        password.value = null
        $v.value.password.$reset()
      }
    }

    const closeDialog = () => {
      showSecretKey.value = false
      secretKey.value = null
      context.emit('close')
    }

    const copyText = (id) => {
      var copyText = document.getElementById(id)
      

      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */
      /* Copy the text inside the text field */
      document.execCommand("copy");
      context.root.$store.dispatch('HOMEPAGE/showSuccessToast', 'Copied to clipboard', { root: true })
    }
    
    return {
      ...Composable,
      createErrorMessage,
      closeDialog,
      reveal,
      password,
      secretKey,
      showSecretKey,
      $v,
      copyText,
    }
  }
};
</script>
<style scoped lang="scss">
button{
  ::v-deep .v-btn__content{
  font-size: 14px;
}
}

</style>