<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <p class="fz-18 mb-0" style="font-weight: 600">
          User Certificate
        </p>
        <v-spacer />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Descriptive name</p>
        <v-textarea
        v-model="rule.descr"
        outlined
        name="input-7-4"
        placeholder="Description"
        ></v-textarea>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import {required, requiredIf, maxValue} from '@vuelidate/validators'

export default {
  props: ["rule"],
  setup(props) {
    const $v = useVuelidate({
      rule: {
        descr: { required }
      }
    },
    {
      rule: props.rule
    })
    
    return{
      $v,
    }
  },
}
</script>