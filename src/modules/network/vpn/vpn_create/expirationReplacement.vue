<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
          <p class="fz-18 mb-0" style="font-weight: 600">
          Expiration and Replacement
          </p>
          <v-spacer />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Life Time</p>
        <v-text-field
          type="number"
          placeholder=""
          single-line
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Rekey Time</p>
        <v-text-field
          type="number"
          placeholder=""
          single-line
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Reauth Time</p>
        <v-text-field
          type="number"
          placeholder=""
          single-line
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Rand Time</p>
        <v-text-field
          type="number"
          placeholder=""
          single-line
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <br />
    <v-divider />
  </div>
</template>

<script>
export default {
  setup() {
    
    return {
      
    }
  },
}
</script>