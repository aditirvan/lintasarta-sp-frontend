<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-card class="rounded-lg" flat>
                    <v-container fluid class="pa-7">
                        <v-row>
                            <v-col cols="7">
                                <div class="vpn-title d-flex align-items-center">
                                    Create VPN
                                </div>
                            </v-col>
                        </v-row>

                        <ike-endpoint
                        id="endpoint"
                        ref="ike_endpoint"
                        :iec="iec"
                        @val_iec="getVal_iec"
                        ></ike-endpoint>

                        <authentication>
                        </authentication>

                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <p class="fz-18 mb-0" style="font-weight: 600">
                              Phase 1 Proposal (Encryption Algorithm)
                            </p>
                            <v-spacer />
                            <v-btn depressed color="success" width="125" @click="addAlghoritm()"
                              >Add Alghoritm
                            </v-btn>
                          </v-col>
                        </v-row>
                        <div class="balance-table">
                          <v-simple-table >
                            <thead>
                              <tr>
                                <th colspan="">Algorithm</th>
                                <th colspan="">Key length</th>
                                <th colspan="">Hash</th>
                                <th colspan="2">DH Group</th>
                              </tr>
                            </thead>
                            <tbody class="noborder">
                              <alghoritm v-for="(alghoritm, i) in alghoritms" :key="i"
                              ref="rulesref"
                              :rule="alghoritm"
                              @delete="()=>{
                                deleteAlghoritm(i)
                              }"
                              />
                            </tbody>
                          </v-simple-table>
                          <p class="accent--text">Note: Blowfish, 3DES, CAST128, MD5, SHA1, and DH groups 1, 2, 5, 22, 23, and 24 provide weak security and should be avoided.</p>
                        </div>
                        <br />
                        <v-divider />

                        <expiration></expiration>

                        <general-information></general-information>  

                        <advanced-options></advanced-options>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { onMounted, ref, reactive } from '@vue/composition-api'
import alghoritm from './vpn_create/alghoritm.vue'
import IkeEndpoint from './vpn_create/ike_endpoint.vue'
import authentication from './vpn_create/authentication.vue'
import expiration from './vpn_create/expirationReplacement.vue'
import GeneralInformation from './vpn_create/generalInformation.vue'
import AdvancedOptions from './vpn_create/advancedOptions.vue'
import useVuelidate from "@vuelidate/core";
import { required } from '@vuelidate/validators';

export default {
  components: {
    alghoritm,
    IkeEndpoint,
    authentication,
    expiration,
    GeneralInformation,
    AdvancedOptions
  },
  setup(props, context) {
    const alghoritms = ref([])

    const v_ike = ref({})
    const iec = ref({
      key_exchange: '',
      ip: '',
      interface: '',
      remote_gateway: ''
    })

    function getVal_iec(val){
      // console.log(val)
      iec.value.key_exchange = val.key_exchange ?? iec.value.key_exchange
      iec.value.ip = val.ip ?? iec.value.ip
      iec.value.interface = val.interface ?? iec.value.interface
      iec.value.remote_gateway = val.remote_gateway ?? iec.value.remote_gateway
      console.log(iec.value)
    }

    function create(){
      // console.log($v)
      // $v.value.$touch();
      let element_endpoint = document.getElementById("endpoint");
      context.refs.ike_endpoint.$v.$touch()
      console.log(context.refs.ike_endpoint)
      if (context.refs.ike_endpoint.$v.$errors.length) {
        element_endpoint.scrollIntoView({behavior: "smooth"})
        return 
      }
      // console.log(context.refs.ike_endpoint.$v)
      console.log(iec.value)
    }

    const auth_method = ref('')
    const $v = useVuelidate({
        auth_method: { required }
        },
        auth_method
      )
    
    function addAlghoritm() {
      alghoritms.value.push({
          alghoritm: 'AES',
          key_length: '128 bits',
          hash: 'SHA 256',
          dh_group: '14 (2048 bit)'
      })
    }

    function deleteAlghoritm(index){
      alghoritms.value.splice(index,1)
    }

    onMounted( () => {
      // console.log(v_ike.value)
    })

    return{
      alghoritms,
      v_ike,
      iec,
      getVal_iec,
      auth_method,
      addAlghoritm,
      deleteAlghoritm,
      create,
    }
  },
}
</script>

<style scoped>
.vpn-title{
    font-style: normal;
    font-weight: bold;
    font-size: 21px;
    line-height: 140%;
    color: #556272;
}
.noborder {
  border: 0;
}
/* .v-label{
  font-size: 5px !important
} */
</style>