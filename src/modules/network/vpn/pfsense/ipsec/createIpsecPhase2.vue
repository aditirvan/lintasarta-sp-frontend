<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container id="container" fluid class="pa-7">
            <v-row>
              <v-col cols="7">
                <div class="vpn-title d-flex align-items-center"> Add IPsec Phase 2 </div>
              </v-col>
            </v-row>
            <v-card-title class="px-0 py-2">
              <div class="font-weight-bold font--text"> Network </div>
            </v-card-title>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Local VPC Network</p>
                <v-select
                  placeholder="Choose a VPC"
                  append-icon="mdi-chevron-down"
                  :items="vpcDisabled"
                  :item-text="item => `${item.name} - ${item.ip_prefix}/${item.network_size}`"
                  :item-value="item => `${item.ip_prefix}/${item.network_size}`"
                  v-model="vpcselected"
                  outlined
                  single-line
                  :error-messages="$v.vpcselected.$errors.length ? $v.vpcselected.$errors[0].$message : ''"
                ></v-select>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Local Subnet</p>
                <div class="d-flex">
                  <v-text-field 
                    maxlength="100" 
                    v-model="ip_local" 
                    placeholder="Local Subnet" 
                    @keypress="
                        (e) => {
                          if (!/[\d.]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }
                      "
                    flat outlined 
                    :error-messages="$v.ip_local.$errors.length ? $v.ip_local.$errors[0].$message : ''">
                    </v-text-field>
                  <v-text-field class="ml-2" maxlength="100" v-model="prefix_local" placeholder="Network Size" prefix="/" type="number" flat outlined :error-messages="$v.prefix_local.$errors.length?$v.prefix_local.$errors[0].$message:''"></v-text-field> -->
                  <!-- <v-select class="ml-2" placeholder="Choose Network Size" v-model="prefix_local" :items="prefixes" outlined prefix="/" single-line :error-messages="$v.prefix_local.$errors.length?$v.prefix_local.$errors[0].$message:''"></v-select> -->
                <!-- </div>
              </v-col>
            </v-row> -->
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Remote Subnet</p>
                <div class="d-flex">
                  <v-text-field maxlength="100" v-model="ip_remote" placeholder="Remote Subnet" flat outlined :error-messages="$v.ip_remote.$errors.length ? $v.ip_remote.$errors[0].$message : ''"></v-text-field>
                  <v-text-field class="ml-2" maxlength="100" v-model="prefix_remote" placeholder="Network Size" prefix="/" type="number" flat outlined :error-messages="$v.prefix_remote.$errors.length?$v.prefix_remote.$errors[0].$message:''"></v-text-field>
                  <!-- <v-select class="ml-2" placeholder="Choose Network Size" v-model="prefix_remote" :items="prefixes" outlined prefix="/" single-line :error-messages="$v.prefix_remote.$errors.length?$v.prefix_remote.$errors[0].$message:''"></v-select> -->
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Description</p>
                <div class="d-flex">
                  <v-textarea maxlength="100" v-model="description1" placeholder="Description" flat outlined :error-messages="$v.description1.$errors.length ? $v.description1.$errors[0].$message : ''"></v-textarea>
                </div>
              </v-col>
            </v-row>
            <!-- <v-divider />
            <br /> -->
            <v-card-title class="px-0 py-2">
              <div class="font-weight-bold font--text"> IPSec Encryption Algorithm Phase 2 </div>
            </v-card-title>
            <!-- <br /> -->
            <v-simple-table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Keylen</th>
                </tr>
              </thead>
              <tbody style="font-weight: 600">
                <tr v-for="(enctwoVal, i) in dataEncPhaseTwo" :key="i">
                  <td>{{enctwoVal.encryption_algorithm_option_name.toUpperCase()}}</td>
                  <td>{{enctwoVal.encryption_algorithm_option_keylen}}</td>
                </tr>
              </tbody>
            </v-simple-table>
            <!-- <br />
            <v-divider />
            <br /> -->
            <v-card-title class="px-0 py-2">
              <div class="font-weight-bold font--text"> IPSec Hash Algorithm Phase 2 </div>
            </v-card-title>
            <div v-for="(hashVal, i) in dataHashPhaseTwo" :key="i">
              <v-checkbox class="py-0 mt-2" hide-details v-model="isSelected" :disabled="isReadonly">
                <template v-slot:label>
                  <span style="color: black;">
                    {{hashVal.hash_algorithm_option.replace("hmac_", "").toUpperCase()}}
                  </span>
                </template>
              </v-checkbox>
            </div>
            <br />
            <br />
            <v-row class="d-flex justify-end">
              <v-col cols="12" md="6">
                <v-btn block height="45" depressed class="accent fz-14" :disabled="isLoadingBtn" @click="$router.go(-1)">
                  <span>Cancel</span>
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn block depressed height="45" :loading="isLoadingBtn" :disabled="isLoadingBtn" @click="create" class="secondary fz-14">
                  <span>Create</span>
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
import { onMounted, ref, reactive, computed } from '@vue/composition-api'
import alghoritm from '../../vpn_create/alghoritm.vue'
import useVuelidate from "@vuelidate/core";
import { required } from '@vuelidate/validators';
import { useNamespacedActions, useNamespacedGetters,useNamespacedState } from 'vuex-composition-helpers';
import { VPN } from "../../namespace"
import { NETWORKVPC } from '@/modules/network/vpc/namespace'
import firewallInput from './firewall.vue'

export default {
  components: {
    alghoritm,
    firewallInput
  },
  setup(props, context) {

    const { createIpsecPhaseTwo, generatePSK } = useNamespacedActions(VPN, ["createIpsecPhaseTwo", "generatePSK"])
    const { isLoadingBtn, getPsk } = useNamespacedGetters(VPN, ["isLoadingBtn", "getPsk"])
    const { fetchvpcs } = useNamespacedActions(NETWORKVPC, ['fetchvpcs'])
    const { vpcs } = useNamespacedState(NETWORKVPC, ['vpcs'])

    const ipsec = JSON.parse(localStorage.getItem('ipsec'))

    //console.log(ipsec[0])
    const dataEncPhaseOne = ipsec[0].encryption_vpn_ipsec_p1
    const dataEncPhaseTwo = ipsec[0].encryption_vpn_ipsec_p2
    const dataHashPhaseTwo = ipsec[0].hash_algorithm_vpn_ipsec_p2
    const isSelected = ref(true);
    const isReadonly = ref(true);
    //let ipsec = JSON.parse(localStorage.getItem("ipsec"))

    const alghoritms = ref([
      {
        name: '',
        key_length: '',
        hash: '',
        dh_group: '',
        id: Math.random()
      }
    ])
    const alghoritms2 = ref([
      {
        name: '',
        key_length: '',
        // id: Math.random()
      }
    ])
    const remote_gateway = ref('')
    const description1 = ref('')
    const description2 = ref('')
    const ip_local = ref('')
    const ip_remote = ref('')
    const psk = ref('')
    const hash2 = ref([])
    const vpnData = JSON.parse(localStorage.getItem('vpn'))
    const prefix_local = ref('')
    const prefix_remote = ref('')
    const prefixes = ref([8, 16, 24, 30])
    const keyChangeItems = ref(['IKEv1', 'IKEv2', 'Auto'])
    const keyChangeVal = ref("")
    const protocol = ref("")
    const protocolItems = ref(['ESP', 'AH'])
    const pfs = ref("")
    const lifetime_phaseone = ref('')
    const lifetime_phasetwo = ref('')
    const vpcselected = ref(null)
    const pfsItems = ref([
      "1", "2", "5", "14", "15", "16", "17", "18", "19", 
      "20", "21", "22", "23", "24", "25", "26", "27", "28",
      "29", "30", "31", "32"
    ])

    const $v = useVuelidate(
      {
        prefix_remote: { required },
        //prefix_local: { required },
        description1: { required },
        vpcselected: { required },
        // ip_local: { 
        //   required ,
        //   regex: {
        //     $message: "Invalid IP value",
        //     $validator: (val) => {
        //       return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
        //         val
        //       );
        //     },
        //   },
        // },
        ip_remote: { 
          required,
          regex: {
            $message: "Invalid IP value",
            $validator: (val) => {
              return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                val
              );
            },
          },
        }
      },
      {
        ip_remote,
        //ip_local,
        description1,
        //prefix_local,
        prefix_remote,
        vpcselected
      }
    )

    const name_alghoritms = ref([
      { text: "AES", value: 'aes' },
      { text: "AES128-GCM", value: 'aes128gcm'},
      { text: "AES192-GCM", value: 'aes192gcm'},
      { text: "AES256-GCM", value: 'aes256gcm'},
      { text: "Blowfish", value: 'blowfish'},
      { text: "3DES", value: '3des' },
      { text: "CAST128", value: 'cast128' },
    ])

    const hashs = ref([
      {text: "MD5", value: 'hmac_md5' },
      {text: "SHA1", value: 'hmac_sha1'},
      {text: "SHA256", value: 'hmac_sha256'},
      {text: "SHA384", value: 'hmac_sha384'},
      {text: "SHA512", value: 'hmac_sha512'},
      {text: "AES-XCBC", value: 'aesxcbx'}
    ])

    const create = async() =>{
      //console.log(vpcselected.value)
      $v.value.$touch()
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({behavior: "smooth"})
        return;
      }
      let proj = JSON.parse(localStorage.getItem('currentProj'))
      let userId = JSON.parse(localStorage.getItem("userId"))
      let [local_ip, local_ip_subnet] = vpcselected.value.split('/');
      
      let payload = {
        ipsec_id: ipsec[0].id,
        local_ip: local_ip,
        remote_ip: ip_remote.value,
        user_id: userId,
        desc: description1.value,
        local_ip_subnet: local_ip_subnet,
        remote_ip_subnet: prefix_remote.value,
      }
      
      //console.log(payload)
      let resp = await createIpsecPhaseTwo(payload)
      if(resp.status == 200){
          context.root.$router.replace("/network/vpn/config/ipsec");
      }else{
        console.log(resp)
      }
    }

    function ipSecValue(payload){
      // console.log(payload)
      if(payload.phase == 1){
        if(payload.name){
          alghoritms.value[payload.index].name = payload.name
        }
        if(payload.key_length){
          alghoritms.value[payload.index].key_length = payload.key_length
        }
        if(payload.hash){
          alghoritms.value[payload.index].hash = payload.hash
        }
        if(payload.dh_group){
          alghoritms.value[payload.index].dh_group = payload.dh_group
        }
      }
      else if(payload.phase == 2){
        if(payload.name){
          alghoritms2.value[payload.index].name = payload.name
        }
        if(payload.key_length){
          alghoritms2.value[payload.index].key_length = payload.key_length
        }
      }
      // console.log(alghoritms.value)
      // console.log(alghoritms2.value)
    }

    const nameDisabled = computed(()=>{
      return name_alghoritms.value.map(item =>{
        return {
        ...item,
        disabled: alghoritms2.value.some(al => al.name == item.value)
      }
      }) 
    })
    
    function addAlghoritm() {
      alghoritms.value.push({
          name: '',
          key_length: '',
          hash: '',
          dh_group: '',
          id: Math.random()
      })
    }

    function deleteAlghoritm(index){
      alghoritms.value.splice(index,1)
    }
    function addAlghoritm2() {
      alghoritms2.value.push({
          name: '',
          key_length: '',
          // id: Math.random()
      })
    }

    function deleteAlghoritm2(index){
      alghoritms2.value.splice(index,1)
    }

    const generatepsk = async() => {
      await generatePSK()
      psk.value = getPsk.value.pre_shared_key
      // console.log(getPsk.value)
    }

    const copyText = (id) => {
      var copyText = document.getElementById(id)
      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */
      /* Copy the text inside the text field */
      document.execCommand("copy");
      context.root.$store.dispatch('HOMEPAGE/showSuccessToast', 'Copied to clipboard', { root: true })
    }

    //onMounted( () => {
      // console.log(v_ike.value)
    //})

    const vpcDisabled = ref()
    onMounted(async()=>{
      await fetchvpcs()
      vpcDisabled.value = vpcs.value
    })

    return{
      alghoritms,
      alghoritms2,
      addAlghoritm,
      deleteAlghoritm,
      addAlghoritm2,
      deleteAlghoritm2,
      ipSecValue,
      create,
      description1,
      description2,
      $v,
      name_alghoritms,
      nameDisabled,
      hashs,
      isLoadingBtn,
      ip_remote,
      ip_local,
      psk,
      hash2,
      generatepsk,
      prefix_local,
      prefix_remote,
      prefixes,
      copyText,
      keyChangeItems,
      keyChangeVal,
      protocol,
      protocolItems,
      pfs,
      lifetime_phaseone,
      lifetime_phasetwo,
      pfsItems,
      dataEncPhaseOne,
      dataEncPhaseTwo,
      dataHashPhaseTwo,
      isSelected,
      vpcDisabled,
      vpcselected,
      isReadonly
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
