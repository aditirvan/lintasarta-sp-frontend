<template>
  <div>
    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="12" class="pt-0 pb-0"
          ><p class="font-weight-bold fz-16">Network Type</p>
          <!-- <v-radio-group v-model="radioScope">
            <v-radio label="Organization Virtual Data Center" :value="radioScope"></v-radio>
          </v-radio-group>
          <p class="ml-9">Provides connectivity for VMs in the selected VDC only</p> -->
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="12" class="pt-0 pb-0"
          ><p class="font-weight-bold">Select the type of network that you are about to create</p>
          <v-radio-group v-model="radioNetwork" class="mb-6">
            <v-radio label="Routed" value="NAT_ROUTED" class="mb-0"></v-radio
            ><span class="ml-9 mb-4 fz-12"
              >This type of network provides controlled access to machine and networks outside of the VDC Group through an edge gateway</span
            >
            <v-radio label="Isolated" value="ISOLATED" class="mb-0"></v-radio
            ><span class="ml-9 fz-12"
              >This type of network provides a fully isolated enviroment, which is accessible only by this organization VDC or VDC Group</span
            >
          </v-radio-group>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <v-row class="d-flex justify-end">
        <v-col cols="3">
          <router-link to="/networking"> <v-btn color="#a5b3bf" class="white--text fz-16" block height="40"> Cancel </v-btn></router-link>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3" v-if="step > 1">
          <v-btn class="fz-16" color="secondary" block outlined height="40" @click="prev()"> Previous </v-btn>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3" v-if="step <= 6">
          <v-btn class="white--text fz-16" color="secondary" block height="40" @click="next()"> Next </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { ref, watch } from "@vue/composition-api";

export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const radioNetwork = ref("NAT_ROUTED");
    const next = () => {
      context.emit("get-data", radioNetwork.value);
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    watch(radioNetwork, () => {
      context.emit("get-data", radioNetwork.value);
    });

    return {
      radioNetwork,
      next,
      prev,
    };
  },
};
</script>

<style lang="scss" scoped>
.fz-16 {
  font-size: 16px !important;
}
</style>
