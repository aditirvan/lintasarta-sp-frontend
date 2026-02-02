<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <p class="fz-16 mb-0" style="font-weight: 600">
          Rule WAN
        </p>
        <v-spacer />
      </v-col>
    </v-row>

    <!-- <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Destination IP</p>
        <div class="d-flex">
          <v-text-field
          :value="value.dst"
          maxlength="50"
          placeholder="Destination IP"
          single-line
          outlined
          @change="value.dst = $event"
          :error-messages="$v.value.dst.$errors.length?$v.value.dst.$errors[0].$message:''"
          ></v-text-field>
          <v-select
            class="ml-2"
            placeholder="Choose Network Size"
            :value="value.prefix_wan"
            :items="prefixes"
            outlined
            prefix="/"
            single-line
            @change="value.prefix_wan = $event"
            :error-messages="$v.value.prefix_wan.$errors.length?$v.value.prefix_wan.$errors[0].$message:''"
            ></v-select>
        </div>
      </v-col>
    </v-row> -->

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
import { ref } from '@vue/composition-api'

export default {
  props: ["value"],
  setup(props) {
    const prefixes = ref([8, 16, 24, 30])
    const $v = useVuelidate({
      value: {
        // dst: { required },
        descr: { required },
        // prefix_wan: { required },
      }
    },
    {
      value: props.value
    })
    
    return{
      $v,
      prefixes
    }
  },
}
</script>