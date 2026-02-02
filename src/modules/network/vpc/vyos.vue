<template>
  <div>
    <v-card class="pa-7 rounded-0 rounded-b-lg" flat>
      <!-- <v-card-text class="pa-8" > -->
        <!-- <v-row>
          <v-col>
            <span class="" style="font-size: 18px; font-weight: bold; color: #556272;">Vyos</span>
          </v-col>
        </v-row> -->
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
                class="elevation-0"
                :headers="_header"
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
                      Looks like you don’t have any NAT Gateway
                    </p>
                  </div>
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
                  <!-- <span
                  style="cursor:pointer"
                  class="red--text"
                  @click="
                  () => {
                    opendialogdeletenetwork = true
                    itemSelected = item
                    headerName = 'network'
                  }
                  ">Delete</span> -->
                  <router-link v-if="item.status == 'CREATED'" :to="{ path: `/network/nat/${item.id}` }">
                    Configuration
                  </router-link>
                  <span v-else class="grey--text">
                    Configuration
                  </span>
                  <!-- <span
                  style="cursor:pointer"
                  class="primary--text"
                  @click="
                  () => {
                    itemSelected = item
                  }
                  ">Configuration</span> -->
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
      <!-- </v-card-text> -->
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
import { computed, onMounted, ref, watch } from '@vue/composition-api'
import { NETWORKVPC } from "./namespace";
import dialogDelete from './vpc_detail/dialogDelete.vue'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers'
import { AccessControl } from "@/lib/middleware";

export default {
  props: ["value"],
  components:{
    dialogDelete
  },
  setup(props, context) {
    const { vpcid } = context.root._route.params;
    const { 
      fetchNetwork,
      DETAIL_VPC2
      } = useNamespacedActions(NETWORKVPC, [
      "fetchNetwork",
      "DETAIL_VPC2"
    ]);

    const { 
      networks,
      totalRowsNetwork,
      isLoading,
      vpc
      } = useNamespacedState(NETWORKVPC, [
      "networks",
      "totalRowsNetwork",
      "isLoading",
      "vpc"
    ]);
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Network'));
    
    watch(() => props.value, async (newVal) => {
      if(newVal){
        options.value.page = 1
        await fetchNetwork(options.value);
      }
    })

    const itemSelected = ref(null)
    const headersNetwork = ref([
      { text: "NAT Gateway Name ", value: "name", sortable: false  },
      // { text: "IP Private", value: "ip_private", sortable: false  },
      // { text: "Floating IP", value: "ip_public", sortable: false  },
      // { text: "MAC Address", value: "mac_address", sortable: false  },
      // { text: "Gateway", value: "gateway", sortable: false  },
      { text: "Status", value: "status", sortable: false  },
      { text: "Action", value: "action", sortable: false  },
    ])
    const _header = computed(() => {
        // headersNetwork.value.push({text: "Action", value: "action", sortable: false })
      // headersNetwork.value.map( item => {
      //   return {
      //     ...item,
      //     show: path.value == '/network/nat' ? true : false
      //   }
      // })
      return headersNetwork.value
    })
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      vpc_id: vpcid
    })
    watch(options, async (val) => {
        // loading.value = true
        try{
          if(val){
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


    onMounted(() => {
      if(read_only.value){
        headersNetwork.value.pop()
      }
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
      headerName: ref(''),
      _header,
      read_only
    }
  },
}
</script>