<template>
  <v-select
  style="width: 250px;"
  :items="networkNics"
  v-model="value.Network"
  @change="() => { $emit('networkVal', value.Network)}"
  :error-messages="$v.rule.Network.$errors.length?$v.rule.Network.$errors[0].$message:''"></v-select>
</template>

<script>
import { useNamespacedGetters } from 'vuex-composition-helpers';
import { VDC } from '../namespace';
import useVuelidate from '@vuelidate/core';
import {required, requiredIf, helpers} from '@vuelidate/validators'

export default {
  props: ["value"],
  setup(props, context) {
    const { networkNics } = useNamespacedGetters(VDC, [
      "networkNics",
    ]);

    const $v = useVuelidate({
      rule: {
        Network: {
          required,
          $autoDirty: true,
          conditional:{
            $message: 'Network should not be "NONE"',
            $validator: (val) => {
              if(props.value.IPAddressAllocationMode === 'NONE'){
                if(val != 'none'){
                  return false
                }else{
                  return true
                }
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

    return{
      networkNics,
      $v,
    }
  },
}
</script>