<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <p class="fz-18 mb-0" style="font-weight: 600">
          Tunnel Settings
        </p>
        <v-spacer />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Protocol</p>
          <v-select
          class=""
          placeholder="Choose a Protocol"
          :value="value.protocol"
          :items="protocols"
          outlined
          single-line
          @change="value.protocol = $event"
          :error-messages="$v.value.protocol.$errors.length?$v.value.protocol.$errors[0].$message:''"
          ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Port</p>
          <v-text-field
          :value="value.port"
          maxlength="50"
          placeholder="Port"
          single-line
          outlined
          readonly
          @input="value.port = $event"
          :error-messages="$v.value.port.$errors.length?$v.value.port.$errors[0].$message:''"
          ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">OpenVPN Client Network</p>
        <div class="d-flex ">
          <v-text-field
          :value="value.tunnel_network"
          maxlength="50"
          placeholder="OpenVPN Client Network"
          single-line
          outlined
          @input="value.tunnel_network = $event"
          :error-messages="$v.value.tunnel_network.$errors.length?$v.value.tunnel_network.$errors[0].$message:''"
          ></v-text-field>
          <v-select
          class="ml-2"
          placeholder="Choose Network Size"
          :value="value.prefix_tunnel"
          :items="prefixes"
          prefix="/"
          outlined
          single-line
          @change="value.prefix_tunnel = $event"
          :error-messages="$v.value.prefix_tunnel.$errors.length?$v.value.prefix_tunnel.$errors[0].$message:''"
          ></v-select>
        </div>
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Cloud VPC Network</p>
        <div class="d-flex">
          <v-text-field
          :value="value.local_network"
          maxlength="50"
          placeholder="Cloud VPC Network"
          single-line
          outlined
          @change="value.local_network = $event"
          :error-messages="$v.value.local_network.$errors.length?$v.value.local_network.$errors[0].$message:''"
          ></v-text-field>
          <v-select
          class="ml-2"
          placeholder="Choose Network Size"
          :value="value.prefix_locale"
          :items="prefixes"
          outlined
          prefix="/"
          single-line
          @change="value.prefix_locale = $event"
          :error-messages="$v.value.prefix_locale.$errors.length?$v.value.prefix_locale.$errors[0].$message:''"
          ></v-select>
        </div>
      </v-col>
    </v-row> -->
    <v-row>
      <!-- <v-col cols="12" md="6">
        <p class="font-weight-bold">Remote Network</p>
        <div class="d-flex">
          <v-text-field
          :value="value.remote_network"
          maxlength="50"
          placeholder="Remote Network"
          single-line
          outlined
          @change="value.remote_network = $event"
          :error-messages="$v.value.remote_network.$errors.length?$v.value.remote_network.$errors[0].$message:''"
          ></v-text-field>
          <v-select
          class="ml-2"
          placeholder="Choose Network Size"
          :value="value.prefix_remote"
          :items="prefixes"
          outlined
          prefix="/"
          single-line
          @change="value.prefix_remote = $event"
          :error-messages="$v.value.prefix_remote.$errors.length?$v.value.prefix_remote.$errors[0].$message:''"
          ></v-select>
        </div>
      </v-col> -->
    </v-row>
    <!-- <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Description</p>
        <v-textarea
        :value="value.description"
        outlined
        name="input-7-4"
        placeholder="Description"
        @change="value.description = $event"
        :error-messages="$v.value.description.$errors.length?$v.value.description.$errors[0].$message:''"
        ></v-textarea>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import {required, numeric, helpers,} from '@vuelidate/validators'
import { ref } from '@vue/composition-api';

export default {
  props: ["value",],
  setup(props) {
    
    const prefixes = ref([8, 16, 24, 30])
    const protocols = ref([
      { text: 'UDP on IPv4 only', value: 'udp4' },
      // { text: 'UDP on IPv6 only', value: 'udp6' },
      // { text: 'TCP on IPv4 only', value: 'tcp4' },
      // { text: 'TCP on IPv4 only', value: 'tcp6' },
      // { text: 'UDP IPv4 and IPv6 on all interfaces (multihome)', value: 'udp' },
      // { text: 'TCP IPv4 and IPv6 on all interfaces (multihome)', value: 'tcp' }
    ])
    const $v = useVuelidate({
      value: {
        tunnel_network:{
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
        // local_network: {
        //   required,
        //   regex: {
        //     $message: "Invalid ip value",
        //     $validator: (val) => {
        //       return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
        //         val
        //       );
        //     },
        //   },
        // },
        // remote_network: {
        //   required,
        //   regex: {
        //     $message: "Invalid ip value",
        //     $validator: (val) => {
        //       return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
        //         val
        //       );
        //     },
        //   },
        // },
        // description: { required },
        prefix_tunnel: { required },
        // prefix_locale: { required },
        protocol: { required },
        port: { 
          required,
          numeric, 
          $autoDirty: true,
          portRules: helpers.withMessage(
            "Allowed local port must be 4 character.",
            val => { 
              let valid = true
              if (val.length != 4){
                valid = false
              }
              return valid
            }
          )
        }
        // prefix_remote: { required }
      }
    },
    {
      value: props.value
    })

    return{
      $v,
      prefixes,
      protocols
    }
  },
}
</script>