<template>
<div>
  <v-card v-if="load" flat outlined class="rounded-lg">
    <v-row>
      <v-col md="12">
        <v-card
        flat
        class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
        >
          <v-card-text style="padding-top: 72px; padding-bottom: 78px">
            <v-row>
              <v-col>
                <v-progress-circular
                indeterminate
                color="primary"
                ></v-progress-circular>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
  <v-card  v-else class="rounded-lg pa-7" flat>
    <v-row v-if="getListOpenVpn.length">
      <v-col class="pt-0">
        <div class="headline font-weight-bold font--text">
          OpenVPN Detail
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col
      v-if="getListOpenVpn.length"
      cols="12"
      sm="12"
      md="6"
      lg="4">
        <!-- <div class="d-flex">
          <span class="page-title pb-5">OpenVPN Servers</span>
          <v-spacer></v-spacer>
          <v-btn
          width="150"
          class="secondary fz-14"
          depressed
          to="/network/vpn/config/openvpn/create"
          v-if="isLoading || getListOpenVpn.length"
          >
          Create OpenVPN
        </v-btn>
        </div> -->
        <v-card
        outlined
        class="rounded-lg fullheight"
        style="border-color: #2c94d2"
        >
          <v-card-text>
            <div class="d-flex flex-column">
              <div class="d-flex align-center mb-2">
                <span class="font-weight-bold fz-18">{{ vpnVal.instance_name }}</span>
                <v-spacer></v-spacer>
                <v-chip
                  class="ma-2"
                  :color="getListOpenVpn[0] && getListOpenVpn[0].status == 'CREATED' ? 'green' : 'grey'"
                  text-color="white"
                >
                {{ getListOpenVpn[0] && getListOpenVpn[0].status }}
                  <!-- {{ vpnVal && vpnVal.status }} -->
                </v-chip>
              </div>
              <v-divider style="border: 0.5px dashed #2c94d2" />
              <div class="d-flex flex-row head mt-3 mb-0">
                <p>Protocol</p>
                <v-spacer></v-spacer>
                <p>{{ getListOpenVpn[0] && getListOpenVpn[0].open_vpn_create && toUpper(getListOpenVpn[0].open_vpn_create.protocol) }} / {{ getListOpenVpn[0] && getListOpenVpn[0].open_vpn_create && getListOpenVpn[0].open_vpn_create.local_port }} 
                ({{ getListOpenVpn[0] && getListOpenVpn[0].open_vpn_create && toUpper(getListOpenVpn[0].open_vpn_create.dev_mode) }})</p>
              </div>
              <div class="d-flex flex-row head py-0 my-0">
                <p>Network</p>
                <v-spacer></v-spacer>
                <p>{{ getListOpenVpn[0] && getListOpenVpn[0].open_vpn_create && getListOpenVpn[0].open_vpn_create.tunnel_network }}</p>
              </div>
              <div class="d-flex flex-row head py-0 my-0">
                <p>Billing Type</p>
                <v-spacer></v-spacer>
                <p>{{ vpnVal.billing_type }}</p></p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <ClientExport v-if="getListOpenVpn.length" />
    <div class="d-flex mb-4">
      <span class="page-title mt-4" v-if="getListOpenVpn.length">OpenVPN User</span>
      <v-spacer></v-spacer>
      <v-btn
      v-if="getTotalRowsOpenvpn == 1 && getTRUserOpenvpn == 1"
      class="error fz-14 mr-3"
      :disabled="getListOpenVpn[0] && getListOpenVpn[0].status != 'CREATED' "
      depressed
      @click="() => {
        validateprivilages(['Network', 'editor', true]).then(() => {
          selectedItem = getListOpenVpn[0]
          opendialogdelete = true
          headerDelete = 'OpenVPN'
        })
      }"
      >
        Delete OpenVPN
      </v-btn>
      <v-btn
      v-if="getTotalRowsOpenvpn >= 1"
      :disabled="getListOpenVpn[0] && getListOpenVpn[0].status != 'CREATED' "
      class="secondary fz-14"
      depressed
      @click="() => {
        validateprivilages(['Network', 'editor', true]).then(() => {
          openDialogAdd = true
          title = 'add'
        })
      }"
      >
        Add New User
      </v-btn>
    </div>
     <v-data-table
     v-if="isLoadingUserVpn || getUserOpenvpn.length"
    :headers="headersUser"
    :items="getUserOpenvpn"
    :options.sync="optionsUser"
    :items-per-page="10"
    :server-items-length="getTRUserOpenvpn"
    :loading="isLoadingUserVpn"
    class="elevation-0"
    hide-default-footer
    >
      <template v-slot:item.expires="{ item }">
        <span v-if="!edited || item.uid != edited_id" :class="compareDate(item.expires) ? 'red--text' : '#556272--text'">{{ item.expires }}</span>
        <v-row v-else>
          <v-col v-if="item.uid == edited_id">
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
              :min="changeFormateDate(item.expires)"
              :show-current="changeFormateDate(item.expires)"
              v-model="expires"
              @input="menu2 = false"
              color="primary"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.action="{ item }">
         <popupquote
          v-if="!edited || item.uid != edited_id"
          v-model="item.open"
          :offsetTop="20"
          :documentid="'popup' + item.id"
          offset-y
          allow-overflow
          >
              <template  v-slot:activator="{ on, attrs }">
                <label v-if="getListOpenVpn.length && getListOpenVpn[0].status != 'CREATED' " class="grey--text">
                  More
                    <v-icon>
                    mdi-chevron-down
                  </v-icon>
                </label>
                <label
                  v-else
                  v-bind="attrs"
                  class="primary--text linkpointer"
                  style="position: relative; white-space: nowrap"
                  @click="
                  ($event) => {
                      on.click($event);
                  }
                  "
                  >More
                  <v-icon
                  :class="{
                      rotate: item.open,
                  }"
                  :id="'popup' + item.id"
                  color="primary"
                  >mdi-chevron-down</v-icon
                  >
                  </label>
              </template>
              <v-list>  

                <v-list-item
                style="cursor:pointer"
                @click="() => {
                  validateprivilages(['Network', 'editor', true]).then(() => {
                    selectedItem = item
                    openDialogExp = true
                    title='password'
                  })
                }"
                >
                  <v-list-item-title class="mr-4 edit">Reset Password</v-list-item-title>
                </v-list-item>
                <v-list-item
                style="cursor:pointer"
                @click="() => {
                  validateprivilages(['Network', 'editor', true]).then(() => {
                    selectedItem = item
                    openDialogExp = true
                    title='exp'
                  })
                }"
                >
                    <!-- edited = true
                    item.open = !item.open
                    edited_id = item.uid -->
                  <v-list-item-title class="mr-4 edit">Edit Expiration Date</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="getUserOpenvpn.length>1" style="min-height: 1px; margin-left: -16px; margin-right: -16px">
                  <v-divider style="min-width: 160px" />
                </v-list-item>

                <v-list-item
                  v-if="getUserOpenvpn.length>1"
                  @click="
                  () => {
                    validateprivilages(['Network', 'editor', true]).then(() => {
                      selectedItem = item
                      opendialogdelete = true
                      headerDelete = 'User OpenVPN'
                    })
                  }
                  ">
                    <v-list-item-title class="error--text"> Delete</v-list-item-title>
                </v-list-item>
              </v-list>
          </popupquote>
          <div v-else-if="edited && item.uid == edited_id">
            <div v-if="isLoadingBtn" class="d-flex">
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
                edited_id = null
                $v.$reset()
              }">Cancel</span>
            </div>
          </div>
        <!-- <span
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
        </div> -->
      </template>
      <template v-slot:footer="{ props }">
          <custom-footer-datatable 
          v-if="getUserOpenvpn.length"
          @input="
            (val) => {
              optionsUser = val;
            }
          " 
          :props="props" />
      </template>
      </v-data-table>
    <!-- <v-data-table
      v-if="isLoading || getListOpenVpn.length"
      :headers="headers"
      :items="getListOpenVpn"
      :options.sync="options"
      :items-per-page="10"
      :server-items-length="getTotalRowsOpenvpn"
      class="elevation-0"
      hide-default-footer
      >
      <template v-slot:item.interface="{ item }">
        <span>{{ item.open_vpn_create.interface | hurufGede }}</span>
      </template>
      
      <template v-slot:item.protocol="{ item }">
        <span>{{ item.open_vpn_create.protocol | hurufGede }} / {{ item.open_vpn_create.local_port }} ({{ item.open_vpn_create.dev_mode | hurufGede }})</span>
      </template>

      <template v-slot:item.tunnel="{ item }">
        <span>{{ item.open_vpn_create.tunnel_network }}</span>
      </template>

      <template v-slot:item.mode="{ item }">
        <table class="table-ip" style="border-bottom:none;">
          <tr>
            <td style="padding-top: 0 !important;padding-bottom: 0 !important">Mode</td>
            <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ item.open_vpn_create.mode }}</td>
          </tr>
          <tr>
            <td style="padding-top: 0 !important;padding-bottom: 0 !important">Data Chipers</td>
            <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ item.open_vpn_create.data_ciphers_fallback}}</td>
          </tr>
          <tr>
            <td style="padding-top: 0 !important;padding-bottom: 0 !important">Digest</td>
            <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ item.open_vpn_create.digest }}</td>
          </tr>
          <tr>
            <td style="padding-top: 0 !important;padding-bottom: 0 !important">D-H Params</td>
            <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ item.open_vpn_create.dh_length }}</td>
          </tr>
        </table>
      </template>

      <template v-slot:item.descr="{ item }">
        <span>{{ item.open_vpn_create.description }}</span>
      </template>

      <template v-slot:item.action="{ item }">
        <div v-if="item.status == 'CREATED' ||item.status == 'FAILED' ">
          <span
          style="cursor:pointer"
          class=""
          @click="
          () => {
            selectedItem = item
            opendialogdetail = true
          }
          ">Detail</span>
          <span
          class="error--text pr-3 delete ml-4"
          @click="
          () => {
            validateprivilages(['Network', 'editor', true]).then(() => {
              selectedItem = item
              opendialogdelete = true
            });
          }
          ">Delete</span>
        </div>
        <div v-else>
          <span
          class="grey--text"
          >Detail</span>
          <span
          class="grey--text ml-4"
          >Delete</span>
        </div>
      </template>
      <template v-slot:item.status="{ item }">
        <span
        class="black--text"
        :class="{
          'success--text': item.status == 'CREATED',
          'error--text' : item.status == 'FAILED',
          'grey--text' : item.status == 'ON-PROGRESS' 
          }"
        >{{ item.status }}</span>
      </template>
      <template v-slot:footer="{ props }">
          <custom-footer-datatable 
          v-if="getListOpenVpn.length > 5"
          @input="
            (val) => {
              options = val;
            }
          " 
          :props="props" />
      </template>
    </v-data-table> -->
    <v-card flat outlined class="rounded-lg" v-else>
      <v-row>
        <v-col md="12">
          <v-card
          flat
          class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
          >
            <v-card-text style="padding-top: 72px; padding-bottom: 78px">
              <p
              style="
                  font-size: 16px;
                  margin-bottom: 10px;
                  text-transform: capitalize;
              "
              class="font-weight-bold"
              >
              Looks like you don’t have any OpenVPN
              </p>
              <v-row>
                <v-col>
                    <p
                    style="
                    font-size: 12px;
                    color: #a5b3bf;
                    margin-bottom: 20px;
                    "
                    >
                    
                    </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                    <v-btn
                    width="100%"
                    append
                    max-width="300"
                    height="50"
                    depressed
                    class="secondary"
                    exact
                    to="/network/vpn/config/openvpn/create"
                    >
                    Create OpenVPN
                    </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <br />
    <v-divider v-if="getListOpenVpn.length" style="min-width: 160px" />
    <br />
    <div v-if="getListOpenVpn.length && getListOpenVpn[0].status != 'ON-PROGRESS'">
      <div class="d-flex mb-4">
        <span class="page-title mt-4">OpenVPN Status</span>
        <v-spacer></v-spacer>
        <v-btn fab
          icon
          color="green"
        @click="refreshStatus">
          <v-icon>mdi-cached</v-icon>
        </v-btn>
      </div>
      <StatusOpenvpn
      v-if="currentVpn"
      :dataValue="currentVpn"/>
    </div>
  </v-card>

  <dialog-user-vpn
  v-if="openDialogAdd"
  v-model="openDialogAdd"
  @refreshTable="refreshTab"
  />

  <dialog-passexp
  v-if="openDialogExp == true"
  v-model="openDialogExp"
  :itemSelected="selectedItem"
  :title="title"
  @refreshTable="refreshTab"
  />

  <dialogDetail
  v-if="opendialogdetail == true"
  v-model="opendialogdetail"
  :dataValue="selectedItem"
  @refreshTable="refreshTab"
  />

  <dialogDelete
  v-if="opendialogdelete == true"
  v-model="opendialogdelete"
  :dataValue="selectedItem"
  :headerDelete="headerDelete"
  @close="opendialogdelete = false"
  @refreshTable="refreshTab"
  />
</div>
</template>

<script>
import { VPN } from "../../namespace"
import { computed, onMounted, ref, watch } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import dialogDelete from '../dialogDelete.vue'
import dialogDetail from './dialogDetail.vue'
import useVuelidate from '@vuelidate/core';
import DialogUserVpn from './dialogAddUser.vue'
import dialogPassexp from './dialogPassExp.vue'
import ClientExport from '../clientexport/clientexport.vue'
import StatusOpenvpn from "./statusOpenvpn.vue";
import {required, } from '@vuelidate/validators'
import moment from 'moment';

export default {
  components: {
    dialogDelete,
    dialogDetail,
		DialogUserVpn,
    dialogPassexp,
    ClientExport,
    StatusOpenvpn
  },
  setup(props, context) {
    const { fetchOpenVpn, tesWs, fetchUserOpenVpn, fetchStatusOpenVpn } = useNamespacedActions(VPN, ["fetchOpenVpn", "tesWs", "fetchUserOpenVpn", "fetchStatusOpenVpn"])
    const { getListOpenVpn, getTotalRowsOpenvpn, isLoading, getUserOpenvpn, getTRUserOpenvpn, isLoadingBtn, isLoadingUserVpn } = useNamespacedGetters(VPN, 
    ["getListOpenVpn", "getTotalRowsOpenvpn", "isLoading", "getUserOpenvpn", "getTRUserOpenvpn", "isLoadingBtn", "isLoadingUserVpn"])
    const {
      validateprivilages,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
    ]);
    let currentProj = JSON.parse(localStorage.getItem('currentProj'))
    let currentVpn = JSON.parse(localStorage.getItem('vpn'))
    const role = localStorage.getItem('role')
    const vpnVal = ref([])

    const headers = ref([
      // { text: "ID", value: "ID" },
      // { text: "Interface", value: "interface", width: "120px" },
      { text: "Protocol ", value: "protocol", sortable: false  },
      { text: "Network", value: "tunnel", sortable: false  },
      // { text: "Mode", value: "mode", width: "250px", sortable: false  },
      // { text: "Description", value: "descr", },
      { text: "Status", value: "status" },
      { text: "Action", value: "action", align: "center", sortable: false  },
    ]);

    const headersUser = ref([
      { text: "Username", value: "username", sortable: false },
      // { text: "Password", value: "password", sortable: false },
      { text: "Expiration Date", value: "expires", sortable: false },
      // { text: "Description", value: "descr", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ])

    const opendialogdelete = ref(false)
    const opendialogdetail = ref(false)
    const openDialogAdd = ref(false)
    const openDialogExp = ref(false)
    const selectedItem = ref(null)
    const headerDelete = ref('')
    const expires = ref()
    const dateNow = moment(new Date()).format('MM/DD/YYYY')
    const edited = ref(false)
    const menu2 = ref(false)
    const min_date = ref()
    const edited_id = ref()
    const title = ref()

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      projek: currentProj.openstack_project_id,
      instance_name: currentVpn.instance_name
    })

    const optionsUser = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      // openvpn_id: getListOpenVpn.value[0]?.id
      // instance_name: currentVpn.instance_name
    })
    
    watch(options,async (val) => {
      try {
          await fetchOpenVpn(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    watch(optionsUser,async (val) => {
      try {
        let to = setTimeout(async() => {
          await fetchUserOpenVpn(val)
        }, 2000)
        // clearTimeout(to)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    const refreshTab = async () => {
      options.value.page = 1
      optionsUser.value.page = 1
      if(headerDelete.value == 'OpenVPN'){
        await fetchOpenVpn(options.value)
      }
      else{
        await fetchUserOpenVpn(optionsUser.value)
      }
      // if(title.value == 'add'){
      // }
      // await fetchOpenVpn(options.value)
    }

    const refreshStatus = async () => {
      await fetchStatusOpenVpn({ vpnname: currentVpn.instance_name })
    }

    const $v = useVuelidate({
      expires: { required }
    },
    {
      expires
    })

    const formatDate = (date) => {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    }
    const dateFormatted = computed(() => {
      return formatDate(expires.value)
    })
    const changeFormateDate = (date) => {
      return moment(date).format('YYYY-MM-DD')
    }

    const compareDate = (dateExp) => {
      return Date.parse(dateNow) > Date.parse(dateExp) ? true : false
    }

    const toUpper = (data) => {
      return data.toUpperCase()
    }
    const load = ref(false)
    onMounted(async() => {
      // tesWs()
      // if(role != 'Superadmin' && role != 'Owner'){
      //   console.log(' masuk if')
      //   headersUser.value.splice(1,1)
      // }
      load.value = true
      vpnVal.value = currentVpn
      await fetchOpenVpn({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        projek: currentProj.openstack_project_id,
        instance_name: currentVpn.instance_name
      })
      await fetchUserOpenVpn({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        // openvpn_id: getListOpenVpn.value[0].id
        // instance_name: currentVpn.instance_name
      })
      load.value = false
    })

    return{
      headers,
      options,
      getListOpenVpn,
      isLoading,
      refreshTab,
      opendialogdelete,
      opendialogdetail,
      selectedItem,
      headerDelete,
      getTotalRowsOpenvpn,
      validateprivilages,
      vpnVal,
      toUpper,
      headersUser,
      optionsUser,
      getUserOpenvpn,
      getTRUserOpenvpn,
      dateFormatted,
      dateNow,
      edited,
      menu2,
      $v,
      isLoadingBtn,
      expires,
      changeFormateDate,
      openDialogAdd,
      openDialogExp,
      edited_id,
      title,
      isLoadingUserVpn,
      currentVpn,
      compareDate,
      load,
      refreshStatus
    }
  },
  filters:{
    hurufGede (str){
      return str.toUpperCase()
    }
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  height: 55px !important;
}
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
.head{
	p:first-child{
		font-weight: 700;
	}
}
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}
</style>
