<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <p class="fz-16 mb-0" style="font-weight: 600">
          Rule LAN
        </p>
        <v-spacer />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Source IP</p>
        <div class="d-flex">
          <v-text-field
          :value="value.src"
          maxlength="50"
          placeholder="Source IP"
          single-line
          outlined
          @change="value.src = $event"
          :error-messages="$v.value.src.$errors.length?$v.value.src.$errors[0].$message:''"
          ></v-text-field>
          <v-select
          class="ml-2"
          placeholder="Choose Network Size"
          :value="value.prefix_lan"
          :items="prefixes"
          outlined
          prefix="/"
          single-line
          @change="value.prefix_lan = $event"
          :error-messages="$v.value.prefix_lan.$errors.length?$v.value.prefix_lan.$errors[0].$message:''"
          ></v-select>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Descriptive Name</p>
        <v-text-field
        v-model="value.descr"
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
        descr: { required },
        src: { 
          required,
          regex: {
            $message: "Invalid ip value",
            $validator: (val) => {
              return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                val
              );
            },
          },
        },
        prefix_lan: { required }
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