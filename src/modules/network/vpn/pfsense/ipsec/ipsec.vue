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
  <v-card v-else class="rounded-lg pa-7" flat>
    <v-row v-if="isLoading || getListIpsec.length">
      <v-col class="pt-0">
        <div class="headline font-weight-bold font--text">
          IPsec Detail
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col
      cols="12"
      sm="12"
      md="6"
      lg="4">
        <v-card
        v-if="isLoading || getListIpsec.length"
        outlined
        class="rounded-lg fullheight"
        style="border-color: #2c94d2"
        >
           <v-card-text>
            <div class="d-flex flex-column">
              <div class="d-flex align-center mb-2">
                <span class="font-weight-bold fz-18">VPN</span>
                <v-spacer></v-spacer>
                <v-progress-circular
                v-if="isLoading"
                indeterminate
                color="primary"
                ></v-progress-circular>
                <!-- <v-progress-linear
                v-else-if="getListIpsec[0].status == 'ON-PROGRESS'"
                color="blue"
                height="25"
                striped
                rounded
                indeterminate
                >
                  Deleting
                </v-progress-linear> -->
                <span class="font-weight-bold fz-18">{{ vpnVal.real_instance_name }}</span>
                <!-- <v-chip
                v-else
                class="ma-2"
                :color="getListIpsec[0] && getListIpsec[0].status == 'CREATED' ? 'green' : 'grey'"
                text-color="white"
                >
                  {{ getListIpsec[0] && getListIpsec[0].status }}
                </v-chip> -->
              </div>
              <v-divider style="border: 0.5px dashed #2c94d2" />
              <div class="d-flex flex-row head mt-3 mb-0">
                <p>Floating IP</p>
                <v-spacer></v-spacer>
                <p>{{ vpnVal.ip_public_pfsense }}</p>
              </div>
              <div class="d-flex flex-row head mb-0">
                <p>Network</p>
                <v-spacer></v-spacer>
                <p>{{ vpc.ip_prefix }}/{{ vpc.network_size }}</p>
              </div>
              <div class="d-flex flex-row head mb-0">
                <p>Billing Type</p>
                <v-spacer></v-spacer>
                <p>{{ vpnVal.billing_type }}</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="isLoading || getListIpsec.length">
      <v-col>
        <div class="d-flex">
          <span class="page-title pb-3">IPsec Tunnels</span>
          <v-spacer></v-spacer>
          <v-btn
          width="200"
          class="secondary fz-14"
          depressed
          to="/network/vpn/config/ipsec/phase2"
          v-if="isLoading || getListIpsec.length >= 1"
          >
              Add Phase 2
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-data-table
      v-if="isLoading || getListIpsec.length"
      :headers="headers"
      :items="getListIpsec"
      :items-per-page="10"
			:options.sync="options"
      :server-items-length="getTotalRowsOpenIpsec"
      :loading="isLoading"
      class="elevation-0"
      hide-default-footer
      >
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

        <template v-slot:item.ipsec_status="{ item }">
          <span
          class="black--text"
          :class="{
            'primary--text': item.ipsec_status == 'Enable',
            'warning--text' : item.ipsec_status == 'Disable',
            }"
          >{{ item.ipsec_status }}</span>
        </template>

        <template v-slot:item.connection_status="{ item }">
          <span
          class="black--text"
          :class="{
            'success--text': item.connection_status == 'CONNECTED',
            'error--text' : item.connection_status == 'DISCONNECTED',
            }"
          >{{ item.connection_status }}</span>
        </template>

        <template v-slot:item.vpn_ipsec_p2.remoteid_address="{ item }">
          <span
          :class="{
            'grey--text': item.status == 'ON-PROGRESS'
          }">
            {{ item.vpn_ipsec_p2.remoteid_address }}
          </span>
        </template>

        <template v-slot:item.vpn_ipsec_p1.remote_gateway="{ item }">
          <span
          :class="{
            'grey--text': item.status == 'ON-PROGRESS'
          }">
            {{ item.vpn_ipsec_p1.remote_gateway }}
          </span>
        </template>

        <template v-slot:item.iketype="{ item }">
					<span>{{ item.vpn_ipsec_p1.iketype }}</span>
				</template>

        <template v-slot:item.vpn_ipsec_p1.pre_shared_key="{ item }">
          <span
          :class="{
            'grey--text': item.status == 'ON-PROGRESS'
          }">
          <!-- {{
            item.vpn_ipsec_p1.pre_shared_key > 10
              ? item.vpn_ipsec_p1.pre_shared_key.substring(0, 5) + "..."
              : item.vpn_ipsec_p1.pre_shared_key.substring(0, 10) + "..."
          }} -->
          *********
          </span>
          <v-icon
          v-if="item.status != 'ON-PROGRESS'"
          small
          class="mb-2 ml-2 secondary white--text py-1 px-2 rounded"
          style="cursor: pointer;"
          @click="
            () => {
              validateprivilages(['Network', 'editor', true]).then(() => {
                showDialogReveal(item);
              });
            }
          ">mdi-eye</v-icon>

          <v-icon
          v-else
          small
          class="mb-2 ml-2 py-1 px-2 rounded"
          >mdi-eye</v-icon>
        </template>


				<template v-slot:item.ip_vpn="{ item }">
					<span>{{ item.vpn_ipsec_p1.peerid_data }}</span>
				</template>

				<template v-slot:item.protocol="{ item }">
          <span>{{ uppercaseWord(item.encryption_vpn_ipsec_p1[0].encryption_algorithm_name)  }} {{  `(${item.encryption_vpn_ipsec_p1[0].encryption_algorithm_keylen} bits)` }}</span>
				</template>

				<template v-slot:item.p1_transform="{ item }">
					<span>{{ uppercaseWord(item.encryption_vpn_ipsec_p1[0].hash_algorithm ) }}</span>
				</template>

        <template v-slot:item.p1_dhgroup="{ item }">
					<span>{{ item.encryption_vpn_ipsec_p1[0].dhgroup + ' (2048 bit)' }}</span>
				</template>

        <template v-slot:item.description="{ item }">
					<span>{{ item.vpn_ipsec_p1.descr }}</span>
				</template>

        <template v-slot:item.connectdate="{ item }">
          <span
            v-if="item.connection_status == 'DISCONNECTED'"> -
          </span>
          <!-- <span
            v-if="item.connection_status == 'CONNECTED'">Established {{ $moment((new Date(item.updated_at) - new Date())).format("HH:mm:ss") }}
          </span> -->
          <span 
            v-if="item.connection_status == 'CONNECTED'">{{ convertDatetime(item.updated_at) }}
          </span>
        </template>

        <template v-slot:item.action="{ item }">
         <popupquote
          v-model="item.open"
          :offsetTop="20"
          :documentid="'popup' + item.id"
          offset-y
          allow-overflow
          >
              <template  v-slot:activator="{ on, attrs }">
                <label v-if="item.status == 'ON-PROGRESS'" class="grey--text">
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
                  @click="
                  () => {
                    selectedItem = [{...item.vpn_ipsec_p2, ...item.encryption_vpn_ipsec_p2[0], ...item.hash_algorithm_vpn_ipsec_p2[0]}]
                    opendialogphase = true
                  }
                  ">
                  <v-list-item-title>IPsec Phase 2</v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="
                  () => {
                    selectedItem = [{...item.vpn_ipsec_p2, ...item.encryption_vpn_ipsec_p2[0], ...item.hash_algorithm_vpn_ipsec_p2[0]}]
                    opendialogdetail = true
                  }
                  ">
                  <v-list-item-title>Encryption Algorithm</v-list-item-title>
                </v-list-item>
                <!-- handle connect or disconnect -->
                <v-list-item
                  v-if="item.connection_status == 'DISCONNECTED' && item.ipsec_status == 'Enable'"
                  @click="doConnect(item)">
                  <v-list-item-title
                    >Connect</v-list-item-title
                  >
                </v-list-item>
                <v-list-item v-else>
                  <v-list-item-title class="grey--text"
                    >Connect</v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                  v-if="item.connection_status == 'CONNECTED'"
                  @click="doDisconnect(item)">
                  <v-list-item-title
                    >Disconnect</v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                  v-if="item.ipsec_status == 'Disable'"
                  @click="doEnable(item)">
                  <v-list-item-title
                    >Enable</v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                  v-if="item.ipsec_status == 'Enable'"
                  @click="doDisable(item)">
                  <v-list-item-title
                    >Disable</v-list-item-title
                  >
                </v-list-item>
                <!-- end of handle connect or disconnect -->

                <!-- <v-list-item
                  style="cursor:pointer"
                  class=""
                  @click="
                  () => {
                    openStatus(item)
                  }
                  ">
                  <v-list-item-title>Status</v-list-item-title>
                </v-list-item> -->

                <v-list-item style="min-height: 1px; margin-left: -16px; margin-right: -16px">
                  <v-divider style="min-width: 160px" />
                </v-list-item>

                <v-list-item
                v-if="item.ipsec_status == 'Enable' && item.connection_status == 'DISCONNECTED'"
                  @click="
                  () => {
                    selectedItem = item
                    opendialogdelete = true
                  }
                  ">
                    <v-list-item-title class="error--text"> Delete</v-list-item-title>
                </v-list-item>
                <v-list-item v-else>
                  <v-list-item-title class="grey--text"
                    >Delete</v-list-item-title
                  >
                </v-list-item>
              </v-list>
          </popupquote>
      </template>
        <template v-slot:item.actions="{ item }">
          <div v-if="item.status == 'CREATED' ||item.status == 'FAILED' ">
            <span
            style="cursor:pointer"
            class=""
            @click="
            () => {
              selectedItem = [{...item.vpn_ipsec_p2, ...item.encryption_vpn_ipsec_p2[0], ...item.hash_algorithm_vpn_ipsec_p2[0]}]
              opendialogdetail = true
            }
            ">Detail</span>
            <span
            class="error--text pr-3 delete ml-4"
            @click="
            () => {
              selectedItem = item
              opendialogdelete = true
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
        <template v-slot:footer="{ props }">
          <custom-footer-datatable 
          v-if="getListIpsec.length > 5"
          @input="
            (val) => {
              options = val;
            }
          " 
          :props="props" />
        </template>
    </v-data-table>
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
              Looks like you don’t have any IPsec
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
                    to="/network/vpn/config/ipsec/create"
                    >
                    Create IPsec
                    </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <br />
    <v-divider v-if="getListIpsec.length" style="min-width: 160px" />
    <br />
    <statusConnIpsec
    v-if="getListIpsec.length > 0"
    />
  </v-card>
  <dialog-detail
  v-if="opendialogdetail == true"
  v-model="opendialogdetail"
  :dataValue="selectedItem"
  />

  <dialog-phase
  v-if="opendialogphase == true"
  v-model="opendialogphase"
  :dataValue="selectedItem"
  />

  <dialogDelete
  v-if="opendialogdelete == true"
  v-model="opendialogdelete"
  :dataValue="selectedItem"
  :headerDelete="headerDelete"
  @close="opendialogdelete = false"
  @refreshTable="refreshTab"
  />

  <dialogRevealAccessKey
      v-model="openDialogRevealAccessKey"
      :accessKey="accessKeyToReveal"
      @close="
        ($event) => {
          openDialogRevealAccessKey = false;
        }
      "
      @refreshTable="refreshTab"
    />
</div>
</template>

<script>
import { computed, onMounted, ref, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from 'vuex-composition-helpers';
import { VPN } from "../../namespace"
import dialogDelete from '../dialogDelete.vue'
import dialogDetail from './dialogDetailIp2.vue'
import dialogPhase from './dialogPhaseTwo.vue'
import dialogRevealAccessKey from "./dialogRevealAccessKey";
import statusConnIpsec from './statusIpsec.vue'
import { NETWORKVPC } from '@/modules/network/vpc/namespace'

export default {
  components: {
    dialogRevealAccessKey,
    dialogDelete,
    dialogDetail,
    dialogPhase,
    statusConnIpsec,
  },
  setup(props, context) {
		const { fetchIpsec, disconnectIPsec, connectIPsec, enableIPsec, disableIPsec, fetchIpsecById, fetchIpsecStatus } = 
    useNamespacedActions(VPN, ["fetchIpsec", "disconnectIPsec", "connectIPsec", "enableIPsec", "disableIPsec", "fetchIpsecById", "fetchIpsecStatus"])
    const { getListIpsec, getTotalRowsOpenIpsec, isLoading } = useNamespacedGetters(VPN, ["getListIpsec", "getTotalRowsOpenIpsec", "isLoading"])
    const { vpc } = useNamespacedState(NETWORKVPC, [
      "vpc"
    ]);
    
    const { DETAIL_VPC } = useNamespacedActions(NETWORKVPC, [
      "DETAIL_VPC"
    ]);
    const {
      validateprivilages,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
    ]);
    let currentProj = JSON.parse(localStorage.getItem('currentProj'))
    let currentVpn = JSON.parse(localStorage.getItem('vpn'))
    let userId = JSON.parse(localStorage.getItem('userId'))

    const opendialogdelete = ref(false)
    const opendialogdetail = ref(false)
    const opendialogphase = ref(false)
    const selectedItem = ref(null)
    const headerDelete = ref('IPsec')
		const vpn = ref([])
    const vpnVal = ref([])
		const headers = ref([
			{ text: "Status", value: "ipsec_status", sortable: false  },
			// { text: "Name", value: "instance_name" },
			//{ text: "IKE", value: "iketype", sortable: false  },
			//{ text: "IP Sec", value: "ip_vpn", sortable: false  },
      //{ text: "Remote Subnet", value: "vpn_ipsec_p2.remoteid_address", sortable: false  },
      { text: "Remote VPN", value: "vpn_ipsec_p1.remote_gateway", sortable: false  },
      { text: "Pre Shared Key", value: "vpn_ipsec_p1.pre_shared_key", sortable: false, width: "180px"  },
      { text: "Deployment Status", value: "status", sortable: false  },
      { text: "Connection Status", value: "connection_status", sortable: false  },
      { text: "Duration", value: "connectdate", sortable: false, width: "180px"  },
			// { text: "Status", value: "status", sortable: false  },
      { text: "Action", value: "action", align: "center", sortable: false  },
		]);

		const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      projek: currentProj.openstack_project_id,
      instance_name: currentVpn.instance_name
    })
    
    watch(options,async (val) => {
      try {
          await fetchIpsec(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    const refreshTab = async () => {
      options.value.page = 1
      await fetchIpsec(options.value)
    }

    const doConnect = async(item) => {
      // context.emit('delete')
      let payload = {
        id: item.id,
        org_id: currentProj.organization_id,
        project_id: currentProj.id,
        user_id: userId
      }
      let resp;
      resp = await connectIPsec(payload)
      // console.log(resp)
      
      if(resp.status == 200){
        refreshTab()
        await fetchIpsecStatus({
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          instance_name: currentVpn.instance_name
        })
      }else{
        console.log(resp)
      }
    }

    const doDisconnect = async(item) => {
      // context.emit('delete')
      let payload = {
        id: item.id,
        org_id: currentProj.organization_id,
        project_id: currentProj.id,
        user_id: userId
      }
      let resp;
      resp = await disconnectIPsec(payload)
      
      // console.log(resp)
      if(resp.status == 200){
        refreshTab()
        context.root.$store.commit('VPN/setListStatusIpsec', [])
        // await fetchIpsecStatus({
        //   page: 1,
        //   itemsPerPage: 10,
        //   sortBy: [],
        //   sortDesc: [],
        //   instance_name: currentVpn.instance_name
        // })
      }else{
        console.log(resp)
      }
    }

    const doEnable = async(item) => {
      // context.emit('delete')
      let payload = {
        id: item.id,
        user_id: userId
      }
      let resp;
      resp = await enableIPsec(payload)
      // console.log(resp)
      
      if(resp.status == 200){
        refreshTab()
        await fetchIpsecStatus({
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          instance_name: currentVpn.instance_name
        })
      }else{
        console.log(resp)
      }
    }

    const doDisable = async(item) => {
      // context.emit('delete')
      let payload = {
        id: item.id,
        user_id: userId
      }
      let resp;
      resp = await disableIPsec(payload)
      
      // console.log(resp)
      if(resp.status == 200){
        refreshTab()
        context.root.$store.commit('VPN/setListStatusIpsec', [])
        // await fetchIpsecStatus({
        //   page: 1,
        //   itemsPerPage: 10,
        //   sortBy: [],
        //   sortDesc: [],
        //   instance_name: currentVpn.instance_name
        // })
      }else{
        console.log(resp)
      }
    }

    const detailP2 = (item) => {
      console.log(item)
      // let ipsec_p2 = item.vpn_ipsec_p2
      // selectedItem.value = [{...ipsec_p2, ...item.encryption_vpn_ipsec_p2[0]}]
      // console.log(selectedItem.value)
      // opendialogdetail.value = true
    }
    
    const uppercaseWord = (str) => {
      return str.toUpperCase()
    }

    const convertDatetime = (str) => {
      // var date1 = new Date(); // current date
      // var date2 = new Date("07/12/2023"); // mm/dd/yyyy format
      var date2 = new Date(str);
      var date1 = new Date();
      var timeDiff = Math.abs(date1.getTime() - date2.getTime()); // in miliseconds
      // var timeDiffInSecond = Math.ceil(timeDiff / 1000); // in second
      // var timeDiffInMinutes = Math.ceil(timeDiff / (1000 * 60)); // in second
      // var timeDiffInHours = Math.floor(timeDiff / 3600000); 
      // var timeDiffInSeconds = timeDiffInSecond % 10;

      var milliseconds = Math.floor((timeDiff % 1000) / 100),
      seconds = Math.floor((timeDiff / 1000) % 60),
      minutes = Math.floor((timeDiff / (1000 * 60)) % 60),
      hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      return hours + (hours <= 1 ? ' Hour ' : ' Hours ') + minutes + (minutes <= 1 ? ' Minute' : ' Minutes ')

      // return 'Established '+ timeDiffInSecond +' seconds ('+ timeDiffInHours +':'+ timeDiffInMinutes +':'+ timeDiffInSeconds +'0) ago' 
    }

    const accessKeyToReveal = ref(null);
    const openDialogRevealAccessKey = ref(false);
    const showDialogReveal = (key) => {
      // console.log(key)
      openDialogRevealAccessKey.value = true;
      accessKeyToReveal.value = key;
    };

    const openStatus = async(item) => {
      // console.log(item)
      await fetchIpsecById({id_ipsec: item.id})
      selectedItem.value = item
      opendialogdetail.value = true
    }
    const load = ref(false)
		onMounted(async() => {
      load.value = true
      vpnVal.value = currentVpn
			await fetchIpsec({
				page: 1,
				itemsPerPage: 10,
				sortBy: [],
				sortDesc: [],
        projek: currentProj.openstack_project_id,
        instance_name: currentVpn.instance_name

			})
      await fetchIpsecStatus({
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          instance_name: currentVpn.instance_name
        })
      await DETAIL_VPC({ id: currentVpn.existing_vpc });
      load.value = false
		})
		return {
      vpnVal,
			vpn,
      vpc,
			headers,
			options,
			isLoading,
			getListIpsec,
      opendialogdelete,
      opendialogdetail,
      opendialogphase,
      selectedItem,
      refreshTab,
      detailP2,
      headerDelete,
      getTotalRowsOpenIpsec,
      uppercaseWord,
      doDisconnect,
      doConnect,
      doDisable,
      doEnable,
      showDialogReveal,
      openDialogRevealAccessKey,
      accessKeyToReveal,
      validateprivilages,
      openStatus,
      convertDatetime,
      load
		}
	},
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
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}

.head{
	p:first-child{
		font-weight: 700;
	}
}
</style>
