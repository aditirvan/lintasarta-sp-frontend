<template>
  <div class="d-flex">
    <v-text-field
    class="mr-1"
    placeholder="Auto"
    hide-details
    outlined
    dense
    v-model="value.ipAddress"
    ></v-text-field>
    <v-tooltip class="ml-2" right max-width="45%">
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          color="grey"
          dark
          v-bind="attrs"
          v-on="on"
        >
          mdi-information
        </v-icon>
      </template>
      <p class="white--text my-1">
      The IP address must be within one of the following range: <br />
      {{ value.ipRanges.values[0].startAddress }} - {{ value.ipRanges.values[0].endAddress }}
      </p>
    </v-tooltip>
  </div>
</template>

<script>
import { onMounted } from '@vue/composition-api'

export default {
  props: ["value"],
  setup(props, context) {
    onMounted(() => {
      // console.log(props.value)
    })
  },
}
</script>