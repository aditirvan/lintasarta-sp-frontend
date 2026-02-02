<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
          <p class="fz-18 mb-0" style="font-weight: 600">
          Phase 1 Proposal (Authentication)
          </p>
          <v-spacer />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Authentication Method</p>
        <v-select
          append-icon="mdi-chevron-down"
          :items="[]"
          placeholder=""
          outlined
          single-line
          dense
          v-model="auth_method"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">My identifier</p>
        <v-select
          append-icon="mdi-chevron-down"
          :items="[]"
          placeholder=""
          outlined
          single-line
          dense
          v-model="my_identifier"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Peer identifier</p>
        <v-select
          append-icon="mdi-chevron-down"
          :items="[]"
          placeholder=""
          outlined
          single-line
          dense
          v-model="peer_identifier"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Pre-Shared Key</p>
        <v-text-field
          placeholder=""
          single-line
          outlined
          dense
          v-model="pre_shared_key"
        ></v-text-field>
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
    const auth_method = ref("") 
    const my_identifier = ref("")
    const peer_identifier = ref("")
    const pre_shared_key = ref("")   

    return {
      auth_method,
      my_identifier,
      peer_identifier,
      pre_shared_key
    }
  },
}
</script>