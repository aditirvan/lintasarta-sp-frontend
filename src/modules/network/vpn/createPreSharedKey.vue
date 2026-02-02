<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="7">
                <div class="psk-title d-flex align-items-center">
                    Create Pre Shared Keys
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Identifier</p>
                <v-text-field
                  placeholder=""
                  single-line
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Secret Type</p>
                <v-select
                  append-icon="mdi-chevron-down"
                  :items="secretType"
                  placeholder="Choose Secret Type"
                  outlined
                  single-line
                  dense
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
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <v-btn
                  block
                  class="accent fz-14"
                  depressed
                  @click="$router.go(-1)"
                >
                  <span>Cancel</span>
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  block
                  class="secondary fz-14"
                  depressed
                >
                  <span>Create Pre Shared Keys</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  setup() {
    const secretType = ref(["PSK", "EAP"])

    return{
      secretType
    }
  },
}
</script>

<style scoped>
.psk-title{
    font-style: normal;
    font-weight: bold;
    font-size: 21px;
    line-height: 140%;
    color: #556272;
}
</style>