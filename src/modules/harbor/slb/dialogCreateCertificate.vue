<template>
  <v-dialog v-model="value" persistent max-width="500">
    <form @submit.prevent="create">
      <v-card>
        <v-card-title>
          <h3>Add New SSL Certificate</h3>
        </v-card-title>
        <v-card-text class="pb-0">
          <p>
            Copy your SSL Certificate and paste it in the space below.
          </p>
        </v-card-text>
        <v-card-text>
          <p><b>SSL Certificate Key</b></p>
          <v-textarea
              outlined
              v-model="key"
              placeholder="Enter your SSL Certificate Key"
              :error-messages="createErrorMessage('content', $v)"
          ></v-textarea>
          <p><b>SSL Certificate Content</b></p>
          <v-textarea
              outlined
              v-model="content"
              placeholder="Enter your SSL Certificate Content"
              :error-messages="createErrorMessage('content', $v)"
          ></v-textarea>
          <p><b>SSL Certificate Chain</b></p>
          <v-textarea
              outlined
              v-model="ca_chain"
              placeholder="Enter your SSL Certificate Chain"
              :error-messages="createErrorMessage('content', $v)"
          ></v-textarea>
        </v-card-text>
        <v-card-text>
          <p><b>Name</b></p>
          <v-text-field
              v-model="name"
              maxlength="50"
              outlined
              placeholder="Enter a name for your certificate"
              :error-messages="createErrorMessage('name', $v)"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn
                  depressed
                  :disabled="isLoading"
                  height="50"
                  color="accent"
                  block
                  @click="
                  () => {
                    $emit('close')
                  }
                "
              >
                <b>Cancel</b>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                  id="SubmitSSHkey"
                  depressed
                  height="50"
                  color="secondary"
                  block
                  :disabled="isLoading"
                  type="submit"
              >
                <beat-loader
                  v-if="isLoading"
                  :color="'white'"
                  :size="'10px'"
                  style="transform: translateY(3px)"
                  class="mr-2"
                ></beat-loader>
                <b v-else>Add SSL Certificate</b>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>
<script>
import { ref } from '@vue/composition-api'
import { useCertificate } from '../../network/loadbalance/useCertificate'
import { createErrorMessage } from '@/lib/validator'
const useVuelidate = require("@vuelidate/core").default;
const { required, requiredIf, maxLength } = require("@vuelidate/validators");

export default {
  props: ['value', 'isOpen'],
  setup(props, context) {
    const content = ref('')
    const name = ref('')
    const key = ref('')
    const ca_chain = ref('')
    const { createCertificate } = useCertificate()
    
    const $v = useVuelidate({
      key: { 
        required: requiredIf(() => props.isOpen), 
      },
      content: { 
        required: requiredIf(() => props.isOpen), 
      },
      ca_chain: { 
        required: requiredIf(() => props.isOpen), 
      },
      name: { 
        required: requiredIf(() => props.isOpen), 
        maxLength: maxLength(50) 
      }
    }, {
      content,
      name,
      key,
      ca_chain,
    })

    const create =  async () => {
      $v.value.$touch()
      if ($v.value.$invalid) return
      const payload = {
        content: content.value,
        name: name.value,
        key: key.value,
        ca_chain: ca_chain.value,
      }
      const response = await createCertificate(payload)
      if (response.status === 200) {
        context.emit('close')
        content.value = ''
        name.value = ''
        key.value = ''
        ca_chain.value = ''
        $v.value.$reset()
      }
    }
    
    return {
      content,
      name,
      key,
      ca_chain,
      create,
      ...useCertificate(),
      $v,
      createErrorMessage,
    }
  }
}
</script>