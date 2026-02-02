<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <p class="fz-18 mb-0" style="font-weight: 600">
        IKE Endpoint Configuration
        </p>
        <v-spacer />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Key Exchange version</p>
        <v-select
          append-icon="mdi-chevron-down"
          :items="item_key"
          placeholder="Choose Key Exchange Version"
          outlined
          single-line
          dense
          v-model="key_exchange"
          :error-messages="
            $v.key_exchange.$errors.length
              ? $v.key_exchange.$errors[0].$message
              : ''
          "
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Internet Protocol</p>
        <v-select
          append-icon="mdi-chevron-down"
          :items="items_ip"
          placeholder="Choose Internet Protocol"
          outlined
          single-line
          dense
          v-model="ip"
          :error-messages="
            $v.ip.$errors.length
              ? $v.ip.$errors[0].$message
              : ''
          "
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Interface</p>
        <v-select
          append-icon="mdi-chevron-down"
          :items="items_infes"
          placeholder="Choose Interface"
          outlined
          single-line
          dense
          v-model="infes"
          :error-messages="
            $v.infes.$errors.length
              ? $v.infes.$errors[0].$message
              : ''
          "
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Remote Gateway</p>
        <v-text-field
          placeholder=""
          single-line
          outlined
          dense
          v-model="remote_gateway"
          :error-messages="
            $v.remote_gateway.$errors.length
              ? $v.remote_gateway.$errors[0].$message
              : ''
          "
        ></v-text-field>
      </v-col>
    </v-row>
    <br />
    <v-divider />
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from '@vue/composition-api'
import useVuelidate from "@vuelidate/core";
import { required } from '@vuelidate/validators';

export default {
  props: {
    iec:{
      type: Object
    },
  },
  setup(props, context) {

    // Key Exchange Version
    const item_key = ref(
      ["IKEv1", "IKEv2", "Auto"]
    )
    const key_exchange = computed({
        get: () => props.iec.key_exchange,
        set: (val) => {
            if(!val){
                // emit('clearItem', {})
            }
            context.emit("val_iec", { key_exchange : val })
        },
    });
    watch(key_exchange, (newVal, oldVal) => {
      // console.log(newVal)
      console.log($v.value)
    })

    // Internet Protocol
    const items_ip = ref(["IPv4", "IPv6", "Both"])
    const ip = computed({
      get: () => { 
        const { ip } = props.iec
        return ip
      },
      set: (val) => {
        context.emit("val_iec", { ip : val })
      }
    })
    watch(ip, (newVal, oldVal) => {
      // console.log(newVal)
      console.log($v.value)
    })

    // Interface
    const items_infes = ref(["WAN"])
    const infes = computed({
      get: () => props.iec.interface,
      set: (val) => {
        context.emit("val_iec", { interface : val })
      }
    })
    watch(infes, (newVal, oldVal) => {
      // console.log(newVal)
      context.emit("val_iec", { interface : newVal })
      console.log($v.value)
    })
    
    const remote_gateway = computed({
      get: () => props.iec.remote_gateway,
      set: (val) => {
        context.emit("val_iec", { remote_gateway : val })
      }
    })


    const $v = useVuelidate(
      {
          key_exchange: { required, },
          ip: { required },
          infes: { required },
          remote_gateway: { required }
      },
      {
        key_exchange,
        ip,
        infes,
        remote_gateway
      }
    )

    // console.log(ike_form)

    // context.emit('v_ike', $v)  
    // const $v = ref() 
    // const rules_ike = reactive(
    //   {
    //     rules_ike:{
    //       key_exchange: { required },
    //       ip: { required },
    //       interface: { required },
    //       remote_gateway: { required }
    //     }
    //   }
    // )
    // context.emit('v_ike', rules_ike)
    
    onMounted(() => {
      // console.log('ike')
    })
    

    return {
      key_exchange,
      item_key,
      $v,
      ip,
      items_ip,
      items_infes,
      infes,
      remote_gateway
    }
  },
}
</script>