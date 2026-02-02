<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
          <p class="fz-18 mb-0" style="font-weight: 600">
          General Information
          </p>
          <v-spacer />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Description</p>
        <v-textarea
          outlined
          name="input-7-4"
          placeholder="Insert Description"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="7">
        <p class="font-weight-bold mr-5">Disabled</p>
        <v-checkbox
        class="ma-0 pa-0"
        style="text-align: justify;
        text-justify: inter-word;"
        >
          <template v-slot:label>
            <div style="font-size: 14px">
              {{ label_disabled }}
            </div>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
    <br />
    <v-divider />
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  setup() {
    const label_disabled = ref("Set this option to disable this phase1 without removing it from the list.")

    return {
      label_disabled
    }
  },
}
</script>