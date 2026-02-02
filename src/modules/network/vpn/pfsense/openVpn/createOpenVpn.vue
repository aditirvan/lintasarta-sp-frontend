<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container id="container" fluid class="pa-7">
            <v-row>
              <v-col cols="7">
                <div class="vpn-title d-flex align-items-center">
                  Create OpenVPN
                </div>
              </v-col>
            </v-row>

            <!-- <ca-create
            v-model="ca_create"
            />
            <br />
            <v-divider />

            <srv-cert
            v-model="srv_cert"
            />
            <br />
            <v-divider /> -->

            <create-user
            v-model="create_user"
            />
            <br />
            <v-divider />

            <!-- <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-18 mb-0" style="font-weight: 600">
                  User Certificate
                </p>
                <v-spacer />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Descriptive Name</p>
                <v-text-field
                v-model="descr"
                maxlength="50"
                placeholder="Descriptive Name"
                single-line
                outlined
                :error-messages="$v.descr.$errors.length?$v.descr.$errors[0].$message:''"
                ></v-text-field>
              </v-col>
            </v-row>
            <br />
            <v-divider /> -->

            <tunnel
            v-model="tunnel"
            />
            <!-- <br />
            <v-divider /> -->

            <!-- <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-20 mb-0" style="font-weight: 600">
                  Firewall
                </p>
                <v-spacer />
              </v-col>
            </v-row> -->

            <!-- <rule-wan
            v-model="rule_wan"
            /> -->
            <!-- <br />
            <v-divider /> -->
            
            <!-- <rule-lan
            v-model="rule_lan"
            /> -->
            <!-- <br />
            <v-divider /> -->
            
            <!-- <create-wan 
            :rule="create_wan[0]"
            />
            <br />
            <v-divider /> -->

            <!-- <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-16 mb-0" style="font-weight: 600">
                  Rule OpenVPN
                </p>
                <v-spacer />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Source</p>
                <div class="d-flex">
                  <v-text-field
                  v-model="src_firewall"
                  maxlength="50"
                  placeholder="Source"
                  single-line
                  outlined
                  :error-messages="$v.src_firewall.$errors.length?$v.src_firewall.$errors[0].$message:''"
                  ></v-text-field>
                  <v-select
                  class="ml-2"
                  placeholder="Choose Network Size"
                  v-model="prefix_firewall"
                  :items="prefixes"
                  outlined
                  prefix="/"
                  single-line
                  :error-messages="$v.prefix_firewall.$errors.length?$v.prefix_firewall.$errors[0].$message:''"
                  ></v-select>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Destination</p>
                <div class="d-flex">
                  <v-text-field
                  v-model="dst_firewall"
                  maxlength="50"
                  placeholder="Source"
                  single-line
                  outlined
                  :error-messages="$v.dst_firewall.$errors.length?$v.dst_firewall.$errors[0].$message:''"
                  ></v-text-field>
                  <v-select
                  class="ml-2"
                  placeholder="Choose Network Size"
                  v-model="prefixDst_firewall"
                  :items="prefixes"
                  outlined
                  prefix="/"
                  single-line
                  :error-messages="$v.prefixDst_firewall.$errors.length?$v.prefixDst_firewall.$errors[0].$message:''"
                  ></v-select>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Descriptive Name</p>
                <v-text-field
                v-model="descr_firewall"
                maxlength="50"
                placeholder="Descriptive Name"
                single-line
                outlined
                :error-messages="$v.descr_firewall.$errors.length?$v.descr_firewall.$errors[0].$message:''"
                ></v-text-field>
              </v-col>
            </v-row>
            <br />
            <v-divider /> -->
            
            <!-- <user-cert
            :rule="user_cert"
            /> -->       

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
                :disabled="isLoadingBtn"
                :loading="isLoadingBtn"
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
import useVuelidate from '@vuelidate/core'
import {required, requiredIf, maxValue} from '@vuelidate/validators'
import { ref, watch } from '@vue/composition-api'
import moment from 'moment';
import tunnel from './tunnelSetting.vue'
import CreateUser from './createUser.vue'
import RuleWan from './ruleWan.vue'
import RuleLan from './ruleLan.vue'
import CreateWan from './createWan.vue'
import CaCreate from './caCreate.vue'
import SrvCert from './srvCert.vue'
import UserCert from './userCert.vue'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { VPN } from "../../namespace"

export default {
  components: {
    tunnel,
    CreateUser,
    RuleWan,
    RuleLan,
    // CreateWan,
    CaCreate,
    SrvCert,
    // UserCert
  },
  setup(props,context) {
    const { createOpenVpn,  } = useNamespacedActions(VPN, ["createOpenVpn"])
    const { isLoadingBtn } = useNamespacedGetters(VPN, ["isLoadingBtn"])

    const tunnel = ref({
        tunnel_network: '',
        prefix_tunnel: '',
        // local_network: '',
        // prefix_locale: '',
        protocol: '',
        port: '1194',
        // remote_network: '',
        // prefix_remote: '',
        // description: ''
      }) 

    const create_user = ref({
      username: '',
      password: '',
      confirm_password: '',
      expires: '',
      // descr: ''
    })

    const rule_wan = ref({
      dst: '',
      prefix_wan: '',
      descr: ''
    })

    const rule_lan = ref({
      src: '',
      prefix_lan: '',
      descr: ''
    })

    const create_wan = ref([{
      // dst: '',
      prefix_cwan: ''
    }])

    const ca_create = ref({
      descr: ''
    })

    const srv_cert = ref({
      descr: ''
    })

    const prefixes = ref([8, 16, 24, 30])
    const src_firewall = ref('')
    const prefix_firewall = ref('')
    const descr_firewall = ref('')
    const dst_firewall = ref('')
    const prefixDst_firewall = ref('')

    // const user_cert = ref({
    //   descr: ''
    // })
    const descr = ref('')
    const vpnData = JSON.parse(localStorage.getItem('vpn'))

    const $v = useVuelidate({
      // descr: { required },
      // src_firewall: { 
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
      // dst_firewall: { 
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
      // prefix_firewall: { required },
      // prefixDst_firewall: { required },
      // descr_firewall: { required }
    },
    {
      // descr,
      // src_firewall,
      // prefix_firewall,
      // descr_firewall,
      // dst_firewall,
      // prefixDst_firewall
    })

    const create = async() => {
      $v.value.$touch()
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({behavior: "smooth"})
        return;
      }
      let proj = JSON.parse(localStorage.getItem('currentProj'))
      let userId = JSON.parse(localStorage.getItem("userId"))
      let [tahun, bulan, tgl] = create_user.value.expires.split('-')
      let payload = {
        instance_name: vpnData.instance_name,
        openstack_project: proj.openstack_project_id,
        user_id: userId,
        org_id: proj.organization_id,
        project_id: proj.id,
          // CA Create
        // pfsense_CA_create: {
        //   descr: ca_create.value.descr
        // },
          // Create User 
        pfsense_user_create: {
          username: create_user.value.username,
          password: create_user.value.password,
          expires: `${bulan}/${tgl}/${tahun}`,
          // descr: create_user.value.descr
        },
          // SRV Cert
        // pfsense_srv_cert_gen: {
        //   descr: srv_cert.value.descr
        // },
          // User Cert
        // pfsense_user_cert_gen: {
        //   descr: descr.value
        // },
          // Tunnel Setting
        pfsense_OVPN_create: {
          // description: tunnel.value.description,
          // local_network: `${tunnel.value.local_network}/${tunnel.value.prefix_locale}`,
          tunnel_network: `${tunnel.value.tunnel_network}/${tunnel.value.prefix_tunnel}`,
          // protocol: tunnel.value.protocol,
          // local_port: parseInt(tunnel.value.port)
          // remote_network: `${tunnel.value.remote_network}/${tunnel.value.prefix_remote}`
        },
          // Rule WAN
        // pfsense_OVPN_rule_wan: {
        //   descr: rule_wan.value.descr,
        //   // dst: `${rule_wan.value.dst}/${rule_wan.value.prefix_wan}`
        // },
          // Rule LAN
        // pfsense_OVPN_rule_lan: {
        //   src: `${rule_lan.value.src}/${rule_lan.value.prefix_lan}`,
        //   descr: rule_lan.value.descr,
        //   // dst: `${rule_lan.value.dst}/${rule_lan.value.prefix_lan}`
        // },
          // Create WAN
        // pfsense_OVPN_create_wan: {
        //   dst: `${create_wan.value[0].dst}/${create_wan.value[0].prefix_cwan}`
        // },
        // add_firewall_rule_ovpn: {
        //   descr: descr_firewall.value,
        //   src: `${src_firewall.value}/${prefix_firewall.value}`,
        //   dst: `${dst_firewall.value}/${prefixDst_firewall.value}`
        // }
      }
      // console.log(payload)
      let resp = await createOpenVpn(payload)
      // console.log(resp)
      if(resp.status == 200){
          context.root.$router.replace("/network/vpn/config/openvpn");
      }else{
        console.log(resp)
      }
    }
    
    // {
    //   "instance_name": "test-from-postman",
    //   "openstack_project": "0956887fef5d4fb696d738ef89c61450",
    //   "pfsense_CA_create": {
    //     "descr": "from BE v3"
    //   },
    //   "pfsense_user_create": {
    //     "username": "create-from-be",
    //     "password": "12345678",
    //     "expires": "03/03/2025",
    //     "descr": "from BE v3"
    //   },
    //   "pfsense_srv_cert_gen": {
    //     "descr": "from BE v3"
    //   },
    //   "pfsense_user_cert_gen": {
    //     "descr": "from BE v3"
    //   },
    //   "pfsense_OVPN_create": {
    //     "description": "from BE v3",
    //     "local_network": "103.148.190.242/24",
    //     "tunnel_network": "103.148.190.0/24"
    //   },
    //   "pfsense_OVPN_rule_wan": {
    //     "descr": "from BE v3"
    //   },
    //   "pfsense_OVPN_rule_lan": {
    //     "descr": "from BE v3",
    //     "src": "103.148.190.0/24"
    //   },
    //   "add_firewall_rule_ovpn": {
    //     "descr": "test firewall from BE v3",
    //     "src": "103.148.190.0/24"
    //   }
    // }
    return {
      $v,
      create,
      tunnel,
      create_user,
      rule_wan,
      rule_lan,
      create_wan,
      ca_create,
      srv_cert,
      // user_cert,
      descr,
      isLoadingBtn,
      prefixes,
      prefix_firewall,
      src_firewall,
      descr_firewall,
      dst_firewall,
      prefixDst_firewall
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