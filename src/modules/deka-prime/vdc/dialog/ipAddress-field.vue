<template>
  <v-card elevation="0">
    <v-card-text>
      <v-text-field
      style="width: 200px;"
      v-if="value.IPAddressAllocationMode == 'MANUAL'"
      v-model="value.IPAddress" 
      :error-messages="$v.rule.IPAddress.$errors.length?$v.rule.IPAddress.$errors[0].$message:''">
      </v-text-field>
      <v-text-field
      style="width: 200px;"
      v-else-if="value.IPAddressAllocationMode == 'POOL'"
      disabled
      v-model="value.IPAddress" >
      </v-text-field>
      <v-text-field
      v-else
      style="width: 200px;"
      disabled>
      </v-text-field>
    </v-card-text>
  </v-card>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import {required, requiredIf, helpers} from '@vuelidate/validators'
import { onMounted } from '@vue/composition-api';

export default {
  props: ['value', ],
  setup(props, context) {
    
    const $v = useVuelidate({
      rule: {
        IPAddress: {
          required: requiredIf(() => props.value.IPAddressAllocationMode === 'MANUAL'),
          $autoDirty: true,
          conditional:{
            $message: 'Invalid IP value',
            $validator: (val) => {
              if(props.value.IPAddressAllocationMode === 'MANUAL'){
                return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                  val
                );
              }else{
                return true
              }
            },
          },
        },
      }
    },
    {
      rule: props.value
    })

    onMounted(() => {
      // console.log(props)
    })

    return{
      $v
    }
  },
}
</script>