<template>
  <div>
    <v-card class="rounded-lg" flat>
      <v-card-text class="pa-8" >
        <!-- <p class="fz-21 font-weight-bold">Network</p> -->
        <!-- <v-row> -->
            <!-- <div class="d-flex flex-column mb-6" style="max-width: 400px">
              <v-chip
                class="font-weight-bold d-flex justify-center"
                color="indigo darken-3"
                large
                outlined
                >
                  <v-icon left>
                    mdi-access-point-network
                  </v-icon>
                  {{ vpc.vyos.network_name }}
                </v-chip>
            </div>
            <div class="d-flex justify-space-between network-desc">
              <div class="d-flex flex-column desc-child">
                <p class="fz-16 font-weight-bold mb-1">IP Private</p>
                <span>{{ vpc.vyos.ip_private ? vpc.vyos.ip_private : '-' }}</span>
              </div>
              <div class="d-flex flex-column desc-child">
                <p class="fz-16 font-weight-bold mb-1">IP Public</p>
                <span>{{ vpc.vyos.ip_public ? vpc.vyos.ip_public : '-' }}</span>
              </div>
              <div class="d-flex flex-column desc-child">
                <p class="fz-16 font-weight-bold mb-1">MAC Address</p>
                <span>{{ vpc.vyos.mac_address ? vpc.vyos.mac_address : '-' }}</span>
              </div>
              <div class="d-flex flex-column desc-child">
                <p class="fz-16 font-weight-bold mb-1">Gateway</p>
                <span>{{ vpc.vyos.gateway ? vpc.vyos.gateway : '-' }}</span>
              </div>
              <div class="d-flex flex-column desc-child">
                <p class="fz-16 font-weight-bold mb-1">VPC ID</p>
                <span>{{ vpc.vyos.vpc_id ? vpc.vyos.vpc_id : '-' }}</span>
              </div>
            </div> -->
            <!-- <v-row class="d-flex">
              <v-col> -->
                <!-- <v-card
                outlined
                class="rounded-lg fullheight"
                style="border-color: #2c94d2">
                  <v-card-text>
                    <div class="d-flex flex-column my-0">
                      <div class="d-flex align-center my-3">
                        <v-icon
                          class="mr-2"
                          style="font-size: 30px"
                          color="blue"
                          >mdi-access-point-network
                        </v-icon>
                        <span class="font-weight-bold fz-18">{{  vpc.vyos && vpc.vyos.network_name ? vpc.vyos.network_name : '' }}</span>
                      </div>
                      <v-divider style="border: 0.5px dashed #2c94d2" />
                      <div class="d-flex flex-row head mt-3 mb-0">
                        <p>IP Private</p>
                        <v-spacer></v-spacer>
                        <p>{{ vpc.vyos && vpc.vyos.ip_private ? vpc.vyos.ip_private : '-' }}</p>
                      </div>
                      <div class="d-flex flex-row head py-0 my-0">
                        <p>IP Public</p>
                        <v-spacer></v-spacer>
                        <p>{{ vpc.vyos && vpc.vyos.ip_public ? vpc.vyos.ip_public : '-' }}</p>
                      </div>
                      <div class="d-flex flex-row head py-0 my-0">
                        <p>MAC Address</p>
                        <v-spacer></v-spacer>
                        <p>{{ vpc.vyos && vpc.vyos.mac_address ? vpc.vyos.mac_address : '-' }}</p>
                      </div>
                      <div class="d-flex flex-row head py-0 my-0">
                        <p>Gateway</p>
                        <v-spacer></v-spacer>
                        <p>{{ vpc.vyos && vpc.vyos.gateway ? vpc.vyos.gateway : '-' }}</p>
                      </div>
                      <div class="d-flex flex-row head py-0 my-0">
                        <p>VPC ID</p>
                        <v-spacer></v-spacer>
                        <p>{{ vpc.vyos && vpc.vyos.vpc_id ? vpc.vyos.vpc_id : '-' }}</p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card> -->
                <v-data-table
                class=""
                :headers="headersNetwork"
                hide-default-footer
                :items="networks"
                :options.sync="options"
                :items-per-page="10"
                :server-items-length="totalRowsNetwork"
                >
                <template v-slot:no-data>
                  <v-progress-circular v-if="isLoading"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                  <div class="my-7 text-center" v-else>
                    <p
                      style="
                        font-size: 16px;
                        margin-bottom: 10px;
                        text-transform: capitalize;
                      "
                      class="font-weight-bold"
                    >
                      Looks like you don’t have any Advanced Network
                    </p>
                  </div>
                </template>
                <template v-slot:header.action="{ header }">
                  {{ header.text }} 
                  <v-tooltip bottom max-width="">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="grey"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        class=""
                      >
                        mdi-information
                      </v-icon>
                    </template>
                    <span>
                      Enable SNAT true NAT Gateway.  
                    </span>
                  </v-tooltip>
                </template>
                <template #[`item.instance_network_mgmt`]="{ item }">
                  <span> {{ vyos.ip_private ? vyos.ip_private : '-' }} </span>
                </template>
                <template #[`item.ip_public`]="{ item }">
                  <span> {{ item.ip_public ? item.ip_public : '-' }} </span>
                </template>
                <template v-slot:item.status="{ item }">
                  <span
                  v-if="item.status"
                  
                  :class="{
                    'success--text': item.status == 'CREATED',
                    'error--text' : item.status == 'FAILED',
                    'grey--text' : item.status == 'ON-PROGRESS' 
                    }"
                  >{{ item.status }}</span>
                  <span v-else>
                    -
                  </span>
                </template>
                <template v-slot:item.action="{ item }">
                  <div style="width: 180px" class="d-flex">
                    <v-switch
                    @click="doAction(item, item.router && !item.router.status ? false : true)"
                    hide-details
                    class="pb-5"
                    color="primary"
                    v-model="switchGateway"
                    :loading="isLoadingSwitch"
                    :disabled="isLoadingSwitch"
                    :value="valueSwitch(item)"
                    inset>
                    </v-switch>
                    <!-- <span
                    v-if="item.router && !item.router.status"
                    style="cursor:pointer"
                    class="primary--text mr-2"
                    @click="
                    () => {
                      itemSelected = item
                      headerName = 'Set'
                      opendialogconfirm = true
                    }
                    ">Set Gateway</span>
                    <span
                    v-if="item.router && item.router.status == 'CREATED'"
                    style="cursor:pointer"
                    class="red--text"
                    @click="
                    () => {
                      itemSelected = item
                      headerName = 'Clear'
                      opendialogconfirm = true
                    }
                    ">Clear Gateway</span> -->
                  </div>
                </template>
                <template v-slot:footer="{ props }">
                  <custom-footer-datatable
                  v-if="networks.length > 5"
                  @input="
                    (val) => {
                      options = val;
                    }
                  " 
                  :props="props" />
                </template>
                </v-data-table>
              <!-- </v-col>
            </v-row> -->
          <!-- </v-col> -->
        <!-- </v-row> -->
      </v-card-text>
      <dialog-confirm
      v-if="opendialogconfirm == true"
      v-model="opendialogconfirm"
      :itemSelected="itemSelected"
      :header="headerName"
      @refreshTab="refreshTab"
      />

      <dialog-delete
      v-if="opendialogdeletenetwork == true"
      v-model="opendialogdeletenetwork"
      :itemSelected="itemSelected"
      :header="headerName"
      @refreshTab="refreshTab"
      />
    </v-card>
  </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api'
import { NETWORKVPC } from "../namespace.ts";
import dialogDelete from './dialogDelete.vue'
import dialogConfirm from './dialogConfirmGateway.vue'
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from 'vuex-composition-helpers'
import { stubFalse } from 'lodash';

export default {
  props: ["value"],
  components:{
    dialogDelete,
    dialogConfirm
  },
  setup(props, context) {
    const { vyosid } = context.root._route.params;
    const { 
      fetchNetwork,
      DETAIL_VPC2,
      setGateway,
      setDeleteGateway,
      DETAIL_VYOS
      } = useNamespacedActions(NETWORKVPC, [
      "fetchNetwork",
      "DETAIL_VPC2",
      "setGateway",
      "setDeleteGateway",
      "DETAIL_VYOS"
    ]);

    const { 
      networks,
      totalRowsNetwork,
      isLoading,
      vpc,
      detailVyos: vyos,
      isLoadingSwitch
      } = useNamespacedState(NETWORKVPC, [
      "networks",
      "totalRowsNetwork",
      "isLoading",
      "vpc",
      "detailVyos",
      "isLoadingSwitch"
    ]);

    const { setNetworks } = useNamespacedMutations(NETWORKVPC, ["setNetworks"])

    const switchGateway = ref(false)
    const itemSelected = ref(null)
    const headersNetwork = ref([
      { text: "Name", value: "name", sortable: false,},
      // { text: "Management IP", value: "instance_network_mgmt", sortable: false,},
      // { text: "IP Private", value: "ip_private", sortable: false  },
      // { text: "Public IP", value: "ip_public", sortable: false  },
      // { text: "MAC Address", value: "mac_address", sortable: false  },
      // { text: "Gateway", value: "gateway", sortable: false  },
      { text: "Status", value: "status", sortable: false,  },
      // { text: "Action", value: "action", sortable: false, },
    ])
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      // vpc_id: vyos.value.vpc_id || vyosls.value.vpc_id,
    })
    watch(options, async (val) => {
        // loading.value = true
        try{
          if(val){
            setNetworks([])
            await DETAIL_VYOS({vyosid: vyosid})
            val.vpc_id = vyos.value.vpc_id
            await fetchNetwork(val);
          }
        }finally {
            // loading.value = false;
        }
      },
      { deep: true }
    )
    const refreshTab = async() => {
      options.value.page = 1
      await fetchNetwork(options.value)
    }

    const valueSwitch = (item) => {
      if(item.router && !item.router.status){
        switchGateway.value = false
        return false
      }else if(item.router && item.router.status == 'CREATED'){
        switchGateway.value = true
        return true
      } 
    }

    const doAction = async(item, action) => {
      let id = !action ? item.id : item.router.id
      let resp = await setDeleteGateway({ id: id, header: action})
      if(resp.status == 200){
        refreshTab()
      }
    }

    onMounted(() => {
    })

    return{
      itemSelected,
      headersNetwork,
      options,
      networks,
      totalRowsNetwork,
      isLoading,
      refreshTab,
      opendialogdeletenetwork: ref(false),
      opendialogconfirm: ref(false),
      headerName: ref(''),
      setGateway,
      switchGateway,
      doAction,
      valueSwitch,
      isLoadingSwitch,
      vyos
    }
  },
}
</script>