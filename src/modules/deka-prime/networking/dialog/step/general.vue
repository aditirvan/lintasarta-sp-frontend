<template>
  <div>
    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="12" class="pt-0 pb-0"><p class="font-weight-bold fz-16">General</p> </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0"
          ><p class="font-weight-bold">Name</p>
          <v-text-field
            label="Name"
            solo
            v-model="generalName"
            @blur="$v.generalName.$touch()"
            :error-messages="$v.generalName.$errors.length ? 'Name couldnt be empty.' : ''"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0"
          ><p class="font-weight-bold">Description</p>
          <v-textarea solo label="Description" v-model="generalDesc"></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- <div>
      <v-row class="mt-2">
        <v-col class="d-flex mt-5" md="4" sm="4">
          <span>Dual Stack Mode</span>
        </v-col>
        <v-col class="d-flex" md="6" sm="6">
          <v-switch v-model="switch1" inset></v-switch>
        </v-col>
      </v-row>
    </div> -->

    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0"
          ><p class="font-weight-bold">Gateway CIDR</p>
          <v-text-field
            label="Gateway CIDR"
            solo
            v-model="generalGatewayCidr"
            @blur="$v.generalGatewayCidr.$touch()"
            :error-messages="$v.generalGatewayCidr.$errors.length ? $v.generalGatewayCidr.$errors[0].$message : ''"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0"
          ><p class="font-weight-bold">Shared</p>
          <v-switch v-model="generalShared" inset></v-switch>
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
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    cidr: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const switch1 = ref(false);
    const generalShared = ref(false);
    const generalGatewayCidr = ref(props.cidr);
    const generalName = ref(props.name);
    const generalDesc = ref(props.desc);
    const generalGatewayIp = ref("");
    const generalPrefixIp = ref("");

    const next = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const patern = /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}?(\/([0-9]{1,3}))/;
      const satu = generalGatewayCidr.value.match(patern);
      generalGatewayIp.value = generalGatewayCidr.value.replace(satu[4], "");
      generalPrefixIp.value = satu[5];

      const data = {
        generalDesc: generalDesc.value,
        generalName: generalName.value,
        generalShared: generalShared.value,
        generalGatewayCidr: generalGatewayCidr.value,
        generalGatewayIp: generalGatewayIp.value,
        generalPrefixIp: parseInt(generalPrefixIp.value),
      };

      context.emit("get-data", data);
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    const $v = useVuelidate(
      {
        generalName: { required },
        generalGatewayCidr: { 
          required,
          $autoDirty: true,
          portRules: helpers.withMessage(
          ({$model})  => {
            return `"${$model}" is not a valid CIDR notation. A valid CIDR is a valid IP address followed by a slash and a number between 0 and 32 or 64, depending on the IP version.`;
          },
            val => { 
              let valid = true
              const patern = /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}?(\/([0-9]{1,3}))/;
              const satu =val.match(patern);
              if(!satu){
                valid = false
              }else{
                valid = true
              }
              return valid
            }
          )
          },
      },
      {
        generalName,
        generalGatewayCidr,
      }
    );
    return {
      $v,
      switch1,
      generalShared,
      generalGatewayCidr,
      generalName,
      generalDesc,
      generalPrefixIp,
      generalGatewayIp,
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
::v-deep .v-text-field__details {
  position: static;
}
</style>
