<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container id="container" fluid class="pa-7">
            <v-row>
              <v-col cols="7">
                <div class="vpn-title d-flex align-items-center">
                  Create IPsec
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-18 mb-0" style="font-weight: 600">
                  Phase 1
                  </p>
                  <!-- <v-tooltip right max-width="430">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="grey "
                          dark
                          v-bind="attrs"
                          v-on="on"
                          class="ml-2 pb-1"
                        >
                          mdi-information
                        </v-icon>
                      </template>
                      <span>
                        Note: Blowfish, 3DES, CAST128, MD5, SHA1, and DH groups 1, 2, 5, 22, 23, and 24 provide weak security and should be avoided.  
                      </span>
                    </v-tooltip>
                  </p>
                  <v-spacer />
                  <v-btn color="success fz-14" large @click="addAlghoritm()"
                    >Add Encryption
                  </v-btn> -->
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex flex-row align-center py-0">
                <p class="font-weight-bold mb-0 mt-3" >
                  Encryption Alghoritm
                  <v-tooltip right max-width="430">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="grey "
                          dark
                          v-bind="attrs"
                          v-on="on"
                          class="ml-2 pb-1"
                        >
                          mdi-information
                        </v-icon>
                      </template>
                      <span>
                        Note: Blowfish, 3DES, CAST128, MD5, SHA1, and DH groups 1, 2, 5, 22, 23, and 24 provide weak security and should be avoided.  
                      </span>
                    </v-tooltip>
                  </p>
                  <v-spacer />
                  <v-btn color="success fz-14" large @click="addAlghoritm()"
                    >Add Encryption
                  </v-btn>
              </v-col>
            </v-row>
            <div class="balance-table">
                <v-simple-table >
                  <thead>
                    <tr>
                      <th colspan="">Name</th>
                      <th colspan="">Key length</th>
                      <th colspan="">Hash</th>
                      <th colspan="">DH Group</th>
                      <th v-if="alghoritms.length > 1">Action</th>
                    </tr>
                  </thead>
                  <tbody class="noborder">
                    <alghoritm v-for="(alghoritm, i) in alghoritms" :key="alghoritm.id"
                    ref="rulesref"
                    :rule="alghoritm"
                    :index="i"
                    :phase="1"
                    :lengthRow="alghoritms.length"
                    @dataIpChange="ipSecValue"
                    @delete="()=>{
                      deleteAlghoritm(i)
                    }"
                    />
                  </tbody>
                </v-simple-table>
                <!-- <p class="accent--text">Note: Blowfish, 3DES, CAST128, MD5, SHA1, and DH groups 1, 2, 5, 22, 23, and 24 provide weak security and should be avoided.</p> -->
              </div>
            <!-- <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-18 mb-0" style="font-weight: 600">
                  Phase 1
                </p>
                <v-spacer />
              </v-col>
            </v-row> -->
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Remote VPN</p>
                <v-text-field
                maxlength="50"
                placeholder="Remote Gateway"
                single-line
                outlined
                v-model="remote_gateway"
                :error-messages="$v.remote_gateway.$errors.length?$v.remote_gateway.$errors[0].$message:''"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <p class="font-weight-bold">Pre-Shared Key
                  <v-tooltip right max-width="430">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="grey "
                        dark
                        v-bind="attrs"
                        v-on="on"
                        class="ml-2 pb-1"
                      >
                        mdi-information
                      </v-icon>
                    </template>
                    <span>
                      Note: pre share key must be same with cross vpn.  
                    </span>
                  </v-tooltip>
                </p>
                <v-row>
                  <v-col md="6" class="py-0">
                    <v-text-field
                    id="psk"
                    maxlength="100"
                    placeholder="Input Pre-Shared Key"
                    single-line
                    outlined
                    v-model="psk"
                    :append-icon="psk ? 'mdi-content-copy' : ''"
                    @click:append="copyText('psk')"
                    :error-messages="$v.psk.$errors.length?$v.psk.$errors[0].$message:''"
                    ></v-text-field>
                  </v-col>
                  <v-col class="pt-1">
                    <v-btn 
                    large
                    outlined
                    color="success fz-14"
                    @click="generatepsk"
                      >Generate Pre-Shared Key
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Key Exchange Version</p>
                <v-select
                maxlength="50"
                placeholder="Key Exchange Version"
                single-line
                outlined
                :items="keyChangeItems"
                v-model="keyChangeVal"
                :error-messages="$v.keyChangeVal.$errors.length?$v.keyChangeVal.$errors[0].$message:''"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Life Time</p>
                <v-text-field
                maxlength="50"
                placeholder="28800"
                single-line
                outlined
                v-model="lifetime_phaseone"
                :error-messages="$v.lifetime_phaseone.$errors.length?$v.lifetime_phaseone.$errors[0].$message:''"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Description</p>
                <v-textarea
                maxlength="50"
                placeholder="Description"
                single-line
                outlined
                v-model="description1"
                :error-messages="$v.description1.$errors.length?$v.description1.$errors[0].$message:''"
                ></v-textarea>
              </v-col>
            </v-row>
            <br />
            <v-divider />

            <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-18 mb-0" style="font-weight: 600">
                  Phase 2
                  <!-- <v-tooltip right max-width="430">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="grey "
                        dark
                        v-bind="attrs"
                        v-on="on"
                        class="ml-2 pb-1"
                      >
                        mdi-information
                      </v-icon>
                    </template>
                    <span>
                      Note: Blowfish, 3DES, CAST128, MD5, SHA1, and DH groups 1, 2, 5, 22, 23, and 24 provide weak security and should be avoided.  
                    </span>
                  </v-tooltip> -->
                </p>
                <v-spacer />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex flex-row align-center py-0">
                <p class="font-weight-bold mb-0 mt-3" >
                  Encryption Alghoritm
                  <v-tooltip right max-width="430">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="grey "
                          dark
                          v-bind="attrs"
                          v-on="on"
                          class="ml-2 pb-1"
                        >
                          mdi-information
                        </v-icon>
                      </template>
                      <span>
                        Note: Blowfish, 3DES, CAST128, MD5, SHA1, and DH groups 1, 2, 5, 22, 23, and 24 provide weak security and should be avoided.  
                      </span>
                    </v-tooltip>
                  </p>
              </v-col>
            </v-row>
            <div class="balance-table">
              <v-simple-table >
                <thead>
                  <tr>
                    <th colspan="">Name</th>
                    <th colspan="">Key length</th>
                    <!-- <th v-if="alghoritms2.length > 1">Action</th> -->
                  </tr>
                </thead>
                <tbody class="noborder">
                  <alghoritm v-for="(alghoritm, i) in alghoritms" :key="alghoritm.id"
                  ref="rulesref"
                  :rule="alghoritm"
                  :phase="2"
                  :index="i"
                  :lengthRow="alghoritms.length"
                  :choiceName="nameDisabled"
                  @dataIpChange="ipSecValue"
                  @delete="()=>{
                    deleteAlghoritm2(i)
                  }"
                  />
                </tbody>
              </v-simple-table>
              <!-- <p class="accent--text">Note: Blowfish, 3DES, CAST128, MD5, SHA1, and DH groups 1, 2, 5, 22, 23, and 24 provide weak security and should be avoided.</p> -->
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Hash Alghoritm</p>
                <v-select
                class="labelinside"
                append-icon="mdi-chevron-down"
                placeholder="Hash Alghoritm"
                :items="hashs"
                outlined
                v-model="hash2"
                multiple
                :error-messages="$v.hash2.$errors.length?$v.hash2.$errors[0].$message:''"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">PFS Key Group</p>
                <v-select
                class="labelinside"
                append-icon="mdi-chevron-down"
                placeholder="PSF Key Group"
                :items="pfsItems"
                outlined
                v-model="pfs"
                :error-messages="$v.pfs.$errors.length?$v.pfs.$errors[0].$message:''"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Protocol</p>
                <v-select
                class="labelinside"
                append-icon="mdi-chevron-down"
                placeholder="Protocol"
                :items="protocolItems"
                outlined
                v-model="protocol"
                :error-messages="$v.protocol.$errors.length?$v.protocol.$errors[0].$message:''"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Remote Subnet</p>
                <div class="d-flex">
                  <v-text-field
                  maxlength="100"
                  v-model="ip_remote"
                  placeholder="Remote Network"
                  flat
                  outlined
                  :error-messages="$v.ip_remote.$errors.length ? $v.ip_remote.$errors[0].$message : ''"
                  ></v-text-field>
                  <v-text-field
                  class="ml-2"
                  maxlength="50"
                  placeholder="Network Size"
                  single-line
                  outlined
                  prefix="/"
                  type="number"
                  v-model="prefix_remote"
                  :error-messages="$v.prefix_remote.$errors.length?$v.prefix_remote.$errors[0].$message:''"
                  ></v-text-field>

                  <!-- <v-select
                  class="ml-2"
                  placeholder="Choose Network Size"
                  v-model="prefix_remote"
                  :items="prefixes"
                  outlined
                  prefix="/"
                  single-line
                  :error-messages="$v.prefix_remote.$errors.length?$v.prefix_remote.$errors[0].$message:''"
                  ></v-select> -->
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Life Time</p>
                <v-text-field
                maxlength="50"
                placeholder="3600"
                single-line
                outlined
                v-model="lifetime_phasetwo"
                :error-messages="$v.lifetime_phasetwo.$errors.length?$v.lifetime_phasetwo.$errors[0].$message:''"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Description</p>
                <v-textarea
                maxlength="50"
                placeholder="Description"
                single-line
                outlined
                v-model="description2"
                :error-messages="$v.description2.$errors.length?$v.description2.$errors[0].$message:''"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col cols="12" md="6">
                <v-btn
                  block
                  height="45"
                  depressed
                  class="accent fz-14"
                  :disabled="isLoadingBtn"
                  @click="$router.go(-1)"
                >
                  <span>Cancel</span>
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                block
                depressed
                height="45"
                :loading="isLoadingBtn"
                :disabled="isLoadingBtn"
                @click="create"
                class="secondary fz-14">
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
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { VPN } from "../../namespace"
import firewallInput from './firewall.vue'

export default {
  components: {
    alghoritm,
    firewallInput
  },
  setup(props, context) {

    const { createIpsec, generatePSK } = useNamespacedActions(VPN, ["createIpsec", "generatePSK"])
    const { isLoadingBtn, getPsk } = useNamespacedGetters(VPN, ["isLoadingBtn", "getPsk"])

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
    const pfsItems = ref([
      "1", "2", "5", "14", "15", "16", "17", "18", "19", 
      "20", "21", "22", "23", "24", "25", "26", "27", "28",
      "29", "30", "31", "32"
    ])

    const $v = useVuelidate(
      {
        psk: { required },
        prefix_remote: { required },
        remote_gateway: { 
          required ,
          regex: {
            $message: "Invalid IP value",
            $validator: (val) => {
              return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                val
              );
            },
          },
        },
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
        },
        hash2: { required },
        protocol: { required },
        pfs: { required },
        lifetime_phaseone: { required },
        lifetime_phasetwo: { required },
        keyChangeVal: { required },
        description1: { required },
        description2: { required },

      },
      {
        description1,
        description2,
        psk,
        hash2,
        ip_remote,
        remote_gateway,
        prefix_local,
        prefix_remote,
        protocol,
        pfs,
        lifetime_phaseone,
        lifetime_phasetwo,
        keyChangeVal
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
      $v.value.$touch()
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({behavior: "smooth"})
        return;
      }
      let proj = JSON.parse(localStorage.getItem('currentProj'))
      let userId = JSON.parse(localStorage.getItem("userId"))

      let payload = {
        openstack_project: proj.openstack_project_id,
        user_id: userId,
        org_id: proj.organization_id,
        project_id: proj.id,
        instance_name: vpnData.instance_name,
        lifetime: parseInt(lifetime_phaseone.value),
        desc_phase1: description1.value,
        desc_phase2: description2.value,
        ipsec_p1: {
          peerid_data: vpnData.ip_public_pfsense,
          // descr: description1.value,
          "remote-gateway": remote_gateway.value,
          "pre-shared-key": psk.value,
          encryption: [],
          iketype: keyChangeVal.value.toLowerCase()
        },
        ipsec_p2: {
          // descr: description2.value,
          remoteid: {
            address: ip_remote.value,
            netbits: parseInt(prefix_remote.value)
          },
          "encryption-algorithm-option": [],
          "hash-algorithm-option": hash2.value,
          protocol: protocol.value.toLowerCase(),
          pfsgroup: parseInt(pfs.value),
          lifetime: parseInt(lifetime_phasetwo.value),
        }
      }
      if(alghoritms.value.length){
        payload.ipsec_p1.encryption = alghoritms.value.map((x) => {
          return {
            "encryption-algorithm": {
              name: x.name,
              keylen: x.key_length ? x.key_length : 0
            },
            "hash-algorithm": x.hash,
            dhgroup: parseInt(x.dh_group)
          }
        })
        payload.ipsec_p2["encryption-algorithm-option"] = alghoritms.value.map((x) => {
          return{
            name: x.name,
            keylen: x.key_length ? x.key_length : 0
          }
        })
      }
      // if(alghoritms2.value.length){
      //   payload.ipsec_p2["encryption-algorithm-option"] = alghoritms2.value.map((x) => {
      //     return{
      //       name: x.name,
      //       keylen: x.key_length
      //     }
      //   })
      // }
      // console.log(payload)
      let resp = await createIpsec(payload)
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

    onMounted( () => {
      // console.log(v_ike.value)
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
      remote_gateway,
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
      pfsItems
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
