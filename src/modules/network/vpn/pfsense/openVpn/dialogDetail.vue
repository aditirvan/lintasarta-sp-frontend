<template>
  <v-dialog v-model="modal" max-width="1000">
  <v-card>
    <v-card-title class="px-7">
      <div class="headline font-weight-bold font--text">
        {{ headerName != 'VPN' ? 'Detail OpenVPN' : 'Detail VPN' }}
      </div>
    </v-card-title>
    <v-card-text>
      <v-tabs v-model="tabs" class="">
        <!-- <v-tab class="px-8 fz-14"><span>Certificate Authority</span></v-tab> -->
        <!-- <v-tab class="px-8 fz-14"><span>Server Certificate</span></v-tab> -->
        <v-tab class="px-8 fz-14" v-if="headerName != 'VPN'"><span>User OpenVPN</span></v-tab>
        <v-tab class="px-8 fz-14" v-else-if="headerName == 'VPN'"><span>Status OpenVPN</span></v-tab>
        <!-- <v-tab class="px-8 fz-14"><span>User Certificate</span></v-tab> -->
        <!-- <v-tab class="px-8 fz-14"><span>Tunnel Settings</span></v-tab> -->
        <!-- <v-tab class="px-8 fz-14"><span>Firewall</span></v-tab> -->
        <!-- <v-tab class="px-8 fz-14"><span>Rule LAN</span></v-tab> -->
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <!-- <v-tab-item>
          <v-card-text class="pa-8">
            <v-row class="">
              <v-col class="d-flex py-0">
                <p class="d-flex fz-21 font-weight-bold align-center justify-center">Certificate Authority</p>
                <v-spacer />
              </v-col>
            </v-row>
            <v-data-table
            :headers="headers.cacert"
            :items="dataItems.ca_create"
            :items-per-page="10"
            class="elevation-0"
            hide-default-footer
            >
            </v-data-table>
          </v-card-text>
        </v-tab-item> -->
        <!-- <v-tab-item>
          <v-card-text class="pa-8">
            <v-row class="">
              <v-col class="d-flex py-0">
                <p class="d-flex fz-21 font-weight-bold align-center justify-center">Server Certificate</p>
                <v-spacer />
              </v-col>
            </v-row>
            <v-data-table
            :headers="headers.srvcert"
            :items="dataItems.srvcert"
            :items-per-page="10"
            class="elevation-0"
            hide-default-footer
            >
            </v-data-table>
          </v-card-text>
        </v-tab-item> -->
        <v-tab-item v-if="headerName != 'VPN'">
          <v-card-text class="pa-8">
            <v-row class="">
              <v-col class="d-flex py-0">
                <p class="d-flex fz-21 font-weight-bold align-center justify-center">User OpenVPN</p>
                <v-spacer />
              </v-col>
            </v-row>
            <v-data-table
            :headers="headers.user"
            :items="dataItems.user"
            :items-per-page="10"
            class="elevation-0"
            hide-default-footer
            >
            <template v-slot:item.expires="{ item }">
              <span v-if="!edited" :class="dateNow > dateView ? 'red--text' : '#556272--text'">{{ dateView }}</span>
              <v-row v-else>
                <v-col>
                  <!-- <p class="font-weight-bold">Expiration date</p> -->
                  <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                    dense
                    v-model="dateFormatted"
                    label="Choose a Date"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    :error-messages="$v.expires.$errors.length?$v.expires.$errors[0].$message:''"
                    ></v-text-field>
                    </template>
                    <v-date-picker
                    :min="min_date"
                    :show-current="min_date"
                    v-model="expires"
                    @input="menu2 = false"
                    color="primary"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </template>
            <template v-slot:item.action="{ item }">
              <span
              v-if="!edited"
              style="cursor:pointer"
              class="primary--text"
              @click="
              () => {
                validateprivilages(['Network', 'editor', true]).then(() => {
                  edited = true
                });
              }
              ">Edit</span>
              <div v-else>
                <div v-if="isLoadingBtn" class="d-flexr">
                  <v-progress-circular
                    :size="25"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>
                <div v-else>
                  <span
                  style="cursor:pointer"
                  class="success--text"
                  @click="updateUser(item)">Save</span>
                  <span
                  style="cursor:pointer"
                  class="accent--text ml-2"
                  @click="() => {
                    edited = !edited
                    expires = null
                    menu2 = false
                    $v.$reset()
                  }">Cancel</span>
                </div>
              </div>
            </template>
            </v-data-table>
          </v-card-text>
        </v-tab-item>
        <v-tab-item v-else-if="headerName == 'VPN'">
          <v-card-text class="pa-5">
            <v-row class="mb-2">
              <v-col class="d-flex py-0">
                <p class="d-flex fz-21 font-weight-bold align-center justify-center">Status OpenVPN</p>
                <v-spacer />
              </v-col>
            </v-row>
            <status-openvpn :user="dataItems.user"/>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-card-text>
      <v-row>
        <v-col>
          <v-btn
          block
          height="45"
          depressed
          class="accent fz-14"
          @click="modal = false"
        >
          <span>Close</span>
        </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  </v-dialog>
</template>

<script>
import { computed, onMounted, ref, watch } from '@vue/composition-api'
import moment from 'moment'
import useVuelidate from '@vuelidate/core'
import {required, } from '@vuelidate/validators'
import { VPN } from "../../namespace"
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'
import StatusOpenvpn from './statusOpenvpn.vue'

export default {
  components: {
    StatusOpenvpn
  },
  props:["value", "dataValue", "headerName"],
  setup(props, context) {
    const { updateUserOpenVpn,  } = useNamespacedActions(VPN, ["updateUserOpenVpn"])
    const { isLoadingBtn } = useNamespacedGetters(VPN, ["isLoadingBtn"])
    const {
      validateprivilages,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
    ]);
    
    const tabs = ref('')
    const modal = computed({
      get: () => props.value,
      set: (val) => {
        if(!val){
          // textDel.value = ''
        }
        context.emit("input", false)
      }
    })
    const headers = ref(
      {
        cacert: [
          { text: "Method", value: "method", sortable: false },
          { text: "Descriptive Name", value: "descr", sortable: false },
        ],
        user: [
          { text: "Username", value: "username", sortable: false },
          { text: "Expiration Date", value: "expires", sortable: false },
          // { text: "Description", value: "descr", sortable: false },
          { text: "Action", value: "action", sortable: false },
        ],
        srvcert: [
          { text: "Descriptive Name", value: "descr", sortable: false },
        ],
        usercert: [
          { text: "Descriptive Name", value: "descr", sortable: false },
        ],
        tunnel: [
          { text: "Tunnel Network", value: "tunnel_network", sortable: false },
          // { text: "Local Network", value: "local_network", sortable: false },
          // { text: "Remote Network", value: "remote_network" },
          { text: "Description", value: "description", sortable: false },
        ],
        rulewan: [
          // { text: "Detination IP", value: "dst"},
          { text: "Descriptive Name", value: "descr", sortable: false}
        ],
        rulelan: [
          { text: "Source", value: "src", sortable: false},
          { text: "Descriptive Name", value: "descr", sortable: false}
        ],
        firewall: [
          { text: "Source", value: "src", sortable: false},
          { text: "Descriptive Name", value: "descr", sortable: false}
        ],
      },
    )
    const dataItems = ref([])
    const edited = ref(false)
    const menu2 = ref(false)
    const dateNow = moment(new Date()).format('MM/DD/YYYY')
    const expires = ref()
    const dateView = ref()
    const min_date = ref()

    const $v = useVuelidate({
      expires: { required }
    },
    {
      expires
    })

    watch(tabs, (newVal) => {
      if(newVal != 2){
        edited.value = false
        expires.value = null
        menu2.value = false
        $v.value.$reset()
      }
    })

    const updateUser = async(item) => {
      $v.value.$touch()
      if ($v.value.$errors.length) return;
      let mapping = [item].map((x) => {
        return {
          id: x.id,
          // open_vpn_id: "e6ec8549-5309-48bf-8d76-d9d5e2a836eb",
          username: x.username,
          password: x.password,
          // expires: x.expires,
          disabled: x.disabled,
          descr: x.descr
        }
      })
      let [tahun, bulan, tgl] = expires.value.split('-')
      let payload = mapping[0]
      payload.open_vpn_id = props.dataValue?.id
      payload.expires = `${bulan}/${tgl}/${tahun}`
      let resp = await updateUserOpenVpn(payload)
      if(resp.status == 201){
        context.emit('refreshTable')
        dateView.value = `${bulan}/${tgl}/${tahun}`
        min_date.value = expires.value
        expires.value = null
        edited.value = false
        $v.value.$reset()
      }else{
        console.log(resp)
      }
    }
    const formatDate = (date) => {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    }

    const dateFormatted = computed(() => {
      return formatDate(expires.value)
    })

    onMounted(() => {
      dataItems.value.ca_create = [props.dataValue.open_vpn_ca_create]
      dataItems.value.user = [props.dataValue.open_vpn_user_create]
      dataItems.value.srvcert = [props.dataValue.open_vpn_srv_cert_gen]
      dataItems.value.usercert = [props.dataValue.open_vpn_srv_cert_gen]
      dataItems.value.tunnel = [props.dataValue.open_vpn_create]
      dataItems.value.rulewan = [props.dataValue.open_vpn_rule_wan]
      dataItems.value.rulelan = [props.dataValue.open_vpn_rule_lan]
      dataItems.value.firewall = [props.dataValue.firewall_rule_ovpn]
      dateView.value = props.dataValue?.open_vpn_user_create?.expires
      min_date.value = moment(dateView.value).format('YYYY-MM-DD')
      // console.log(min_date.value)
      // console.log(dateView.value)
    })

    return{
      modal,
      tabs,
      headers,
      // headers_cacert,
      // headers_user,
      dataItems,
      $v,
      dateFormatted,
      menu2,
      dateNow,
      expires,
      edited,
      dateView,
      updateUser,
      min_date,
      isLoadingBtn,
      validateprivilages
    }
  },
}
</script>