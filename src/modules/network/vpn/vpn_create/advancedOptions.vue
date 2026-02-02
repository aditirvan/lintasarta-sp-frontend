<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
          <p class="fz-18 mb-0" style="font-weight: 600">
          Advanced Options
          </p>
          <v-spacer />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Child SA Start Action</p>
        <v-select
          append-icon="mdi-chevron-down"
          :items="[]"
          placeholder=""
          outlined
          single-line
          dense
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Child SA Close Action</p>
        <v-select
          append-icon="mdi-chevron-down"
          :items="[]"
          placeholder=""
          outlined
          single-line
          dense
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">NAT Traversal</p>
        <v-select
          append-icon="mdi-chevron-down"
          :items="[]"
          placeholder=""
          outlined
          single-line
          dense
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">MOBIKE</p>
        <v-select
          append-icon="mdi-chevron-down"
          :items="[]"
          placeholder=""
          outlined
          single-line
          dense
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <!-- <v-checkbox
        class="ma-0 pa-0"
        label="Gateway duplicates"
        ></v-checkbox>
        <p class="accent--text">Enable this to allow multiple phase 1 configurations with the same endpoint. 
          When enabled, pfSense does not manage routing to the remote gateway and traffic will follow the default route without regard for the chosen interface. 
          Static routes can override this behavior.</p> -->
        <!-- <div class="d-flex">
          <p class="font-weight-bold mr-5">Gateway duplicates</p>
          <v-checkbox
          class="ma-0 pa-0"
          ></v-checkbox>
        </div>
        <div>
          <p>Enable this to allow multiple phase 1 configurations with the same endpoint. 
          When enabled, pfSense does not manage routing to the remote gateway and traffic will follow the default route without regard for the chosen interface. 
          Static routes can override this behavior.</p>
        </div> -->
        <p class="font-weight-bold mr-5">Gateway duplicates</p>
        <v-checkbox
        class="ma-0 pa-0"
        style="text-align: justify;
        text-justify: inter-word;"
        >
          <template v-slot:label>
            <div style="font-size: 14px">
              {{ label_gatedup }}
            </div>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <p class="font-weight-bold mr-5">Split connections</p>
        <v-checkbox
        class="ma-0 pa-0"
        style="text-align: justify;
        text-justify: inter-word;"
        >
          <template v-slot:label>
            <div style="font-size: 14px">
              {{ label_spill }}
            </div>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold mr-5">PRF Selection</p>
        <v-checkbox
        class="ma-0 pa-0"
        style="text-align: justify;
        text-justify: inter-word;"
        >
          <template v-slot:label>
            <div style="font-size: 14px">
              {{ label_prf }}
            </div>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0" cols="12" md="12">
        <p class="font-weight-bold">Custom IKE/NAT-T Ports</p>
      </v-col>
      <v-col class="py-0" md="4" sm="12">
        <v-text-field
          type="number"
          placeholder=""
          single-line
          outlined
          dense
          label="Remote IKE Port"
        ></v-text-field>
        <p class="accent--text" style="text-align: justify; text-justify: inter-word;">UDP port for IKE on the remote gateway. Leave empty for default automatic behavior (500/4500).</p>
      </v-col>
      <v-col class="py-0" md="4" sm="12">
        <v-text-field
          type="number"
          placeholder=""
          single-line
          outlined
          dense
          label="Remote NAT-T Port"
        ></v-text-field>
        <p class="accent--text">UDP port for NAT-T on the remote gateway.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold mr-5">Dead Peer Detection</p>
        <v-checkbox
        class="mb-1 pa-0"
        style="text-align: justify;
        text-justify: inter-word;"
        label="Enable DPD"
        hide-details
        >
        </v-checkbox>
        <p class="accent--text">Check the liveness of a peer by using IKEv2 INFORMATIONAL exchanges or IKEv1 R_U_THERE messages. 
          Active DPD checking is only enforced if no IKE or ESP/AH packet has been received for the configured DPD delay.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Delay</p>
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
        <p class="font-weight-bold">Max failures</p>
        <v-text-field
          type="number"
          placeholder=""
          single-line
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  setup() {
    const label_gatedup = ref("Enable this to allow multiple phase 1 configurations with the same endpoint. When enabled, pfSense does not manage routing to the remote gateway and traffic will follow the default route without regard for the chosen interface. Static routes can override this behavior.")
    const label_spill = ref("Enable this to split connection entries with multiple phase 2 configurations. Required for remote endpoints that support only a single traffic selector per child SA.")
    const label_prf = ref("Enable manual Pseudo-Random Function (PRF) selection")

    return{
      label_gatedup,
      label_spill,
      label_prf,
    }
  },
}
</script>

<style scoped>
.v-input--checkbox.v-messages.theme--light {
  position: absolute !important;
}
</style>