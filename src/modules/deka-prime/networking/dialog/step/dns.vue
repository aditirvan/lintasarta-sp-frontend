<template>
  <div>
    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0"><p class="font-weight-bold fz-16">DNS</p> </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0" v-if="dataNetwork == 'NAT_ROUTED'">
      <v-row>
        <v-col sm="12" md="12" class="pt-0 pb-0"
          ><p class="font-weight-bold">Use Edge DNS</p>
          <v-switch v-model="switch1" inset></v-switch>
          <p class="fz-12">Select this option to use DNS relay of the gateaway. DNS relay must be pre-configured on the gateway.</p>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0"
          ><p class="font-weight-bold">Primary DNS</p>
          <v-text-field
            placeholder="input"
            solo
            :value="gateway"
            :disabled="switch1 == true"
            @input="primaryDns = $event"
            v-if="dataNetwork == 'NAT_ROUTED'"
          ></v-text-field>
          <v-text-field label="Input" solo dense v-model="primaryDns" v-else></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0">
      <v-row>
        <v-col sm="12" md="6" class="pb-0"
          ><p class="font-weight-bold">Secondary DNS</p>
          <v-text-field label="Secondary DNS" solo v-model="secondaryDns"></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 mb-4">
      <v-row>
        <v-col sm="12" md="6" class="pb-0"
          ><p class="font-weight-bold">DNS Suffix</p>
          <v-text-field label="DNS Suffix" solo v-model="suffixDns"></v-text-field>
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
import { ref } from "@vue/composition-api";

export default {
  props: {
    gateway: {
      type: String,
      default: "",
    },
    step: {
      type: Number,
      default: 0,
    },
    dataNetwork: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const switch1 = ref(true);
    const primaryDns = ref("");
    const secondaryDns = ref("");
    const suffixDns = ref("");
    const next = () => {
      const data1 = {
        // switchDns: switch1.value,
        primaryDns: primaryDns.value,
        secondaryDns: secondaryDns.value,
        suffixDns: suffixDns.value,
      };

      const data = {
        switchDns: switch1.value,
        primaryDns: primaryDns.value ? primaryDns.value : props.gateway,
        secondaryDns: secondaryDns.value,
        suffixDns: suffixDns.value,
      };

      if (props.dataNetwork == "NAT_ROUTED") {
        context.emit("get-data", data);
      } else {
        context.emit("get-data", data1);
      }

      context.emit("update:step", props.step + 1);
    };

    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    return {
      switch1,
      primaryDns,
      secondaryDns,
      suffixDns,
      next,
      prev,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
  box-shadow: none;
  border: 1px solid black;
}
</style>
