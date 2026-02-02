<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <p class="fz-18 mb-0" style="font-weight: 600">
          Create Certificate Authority
        </p>
        <v-spacer />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Descriptive Name</p>
        <v-text-field
        :value="value.descr"
        maxlength="50"
        placeholder="Descriptive Name"
        single-line
        outlined
        @change="value.descr = $event"
        :error-messages="$v.value.descr.$errors.length?$v.value.descr.$errors[0].$message:''"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import {required, requiredIf, maxValue} from '@vuelidate/validators'

export default {
  props: ["value"],
  setup(props) {
    const $v = useVuelidate({
      value: {
        descr: { required }
      }
    },
    {
      value: props.value
    })

    return{
      $v,
    }
  },
}
</script>