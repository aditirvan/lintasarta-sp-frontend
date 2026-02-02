<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <p class="fz-16 mb-0" style="font-weight: 600">
          Rule WAN
        </p>
        <v-spacer />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Descriptive Name</p>
        <v-text-field
        :value="value.add_firewall_rule_wan.descr"
        maxlength="50"
        placeholder="Descriptive Name"
        single-line
        outlined
        @input="value.add_firewall_rule_wan.descr = $event"
        :error-messages="$v.value.add_firewall_rule_wan.descr.$errors.length?$v.value.add_firewall_rule_wan.descr.$errors[0].$message:''"
        ></v-text-field>
      </v-col>
    </v-row>

     <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <p class="fz-16 mb-0" style="font-weight: 600">
          Rule LAN
        </p>
        <v-spacer />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Source IP</p>
        <div class="d-flex">
          <v-text-field
          :value="value.add_firewall_rule_lan.src"
          maxlength="50"
          placeholder="Source IP"
          single-line
          outlined
          @input="value.add_firewall_rule_lan.src = $event"
          :error-messages="$v.value.add_firewall_rule_lan.src.$errors.length?$v.value.add_firewall_rule_lan.src.$errors[0].$message:''"
          ></v-text-field>
          <v-select
          class="ml-2"
          placeholder="Choose Network Size"
          :value="value.add_firewall_rule_lan.prefix_lan"
          :items="prefixes"
          outlined
          prefix="/"
          single-line
          @change="value.add_firewall_rule_lan.prefix_lan = $event"
          :error-messages="$v.value.add_firewall_rule_lan.prefix_lan.$errors.length?$v.value.add_firewall_rule_lan.prefix_lan.$errors[0].$message:''"
          ></v-select>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Descriptive Name</p>
        <v-text-field
        :value="value.add_firewall_rule_lan.descr"
        maxlength="50"
        placeholder="Descriptive Name"
        single-line
        outlined
        @input="value.add_firewall_rule_lan.descr = $event"
        :error-messages="$v.value.add_firewall_rule_lan.descr.$errors.length?$v.value.add_firewall_rule_lan.descr.$errors[0].$message:''"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <p class="fz-16 mb-0" style="font-weight: 600">
          Rule IPSec
        </p>
        <v-spacer />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Source</p>
        <div class="d-flex">
          <v-text-field
          :value="value.add_firewall_rule_ipsec.src"
          maxlength="50"
          placeholder="Source"
          single-line
          outlined
          @input="value.add_firewall_rule_ipsec.src = $event"
          :error-messages="$v.value.add_firewall_rule_ipsec.src.$errors.length?$v.value.add_firewall_rule_ipsec.src.$errors[0].$message:''"
          ></v-text-field>
          <v-select
          class="ml-2"
          placeholder="Choose Network Size"
          v-model="value.add_firewall_rule_ipsec.prefix_ipsec"
          :items="prefixes"
          outlined
          prefix="/"
          single-line
          @change="value.add_firewall_rule_ipsec.prefix_ipsec = $event"
          :error-messages="$v.value.add_firewall_rule_ipsec.prefix_ipsec.$errors.length?$v.value.add_firewall_rule_ipsec.prefix_ipsec.$errors[0].$message:''"
          ></v-select>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Descriptive Name</p>
        <v-text-field
        v-model="value.add_firewall_rule_ipsec.descr"
        maxlength="50"
        placeholder="Descriptive Name"
        single-line
        outlined
        @input="value.add_firewall_rule_ipsec.descr = $event"
        :error-messages="$v.value.add_firewall_rule_ipsec.descr.$errors.length?$v.value.add_firewall_rule_ipsec.descr.$errors[0].$message:''"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import {required, requiredIf, maxValue} from '@vuelidate/validators'
import { ref } from '@vue/composition-api'

export default {
  props: ["value"],
  setup(props) {
    const prefixes = ref([8, 16, 24, 30])
    const $v = useVuelidate({
      value: {
        add_firewall_rule_lan: {
          descr: { required },
          src: { 
            required,
            $autoDirty: true,
            regex: {
              $message: "Invalid ip value",
              $validator: (val) => {
                return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                  val
                );
              },
            },
          },
          prefix_lan: { required }
        },
        add_firewall_rule_wan:{
          descr: { required },
        },
        add_firewall_rule_ipsec: {
          src: { 
            required,
            $autoDirty: true,
            regex: {
              $message: "Invalid ip value",
              $validator: (val) => {
                return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                  val
                );
              },
            },
          },
          prefix_ipsec: { required },
          descr: { required }
        }
      }
    },
    {
      value: props.value
    })

    return{
      $v,
      prefixes
    }
  },
}
</script>