<template>
  <div>
    <v-card class="rounded-lg mt-3" flat>
      <v-container>
        <v-row>
          <v-col cols="1">
            <div
              class="mx-2"
              style="
                padding-left: 30;
                width: 50px;
                height: 50px;
                background: #f1f2f2;
                border-radius: 50%;
              "
            ></div>
          </v-col>
          <v-col class="px-0">
            <p class="mb-0 fz-21 font-weight-bold">{{ vpc.name }}</p>
            <p class="mb-0 accent--text">
              {{ vpc.region }}
              <!-- <span class="linkpointer font-weight-bold">Copy</span> -->
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <div style="height: 30px; width: auto" />
    <v-card flat class="rounded-lg">
      <v-tabs v-model="tabs" height="64" slider-size="4">
        <v-tab class="px-8 fz-14">Overview</v-tab>
        <v-tab class="px-8 fz-14">Resources</v-tab>
        <v-tab class="px-8 fz-14">Settings</v-tab>
        <v-tab v-if="vpc.type !== 'Expert'" class="px-8 fz-14">Subnets</v-tab>
        <v-tab v-if="vpc.type !== 'Expert'" class="px-8 fz-14">Ports</v-tab>
      </v-tabs>
      <v-divider />
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-card-text class="pa-8">
            <p class="fz-21 font-weight-bold">Description</p>
            <p class="mb-3">
              {{ vpc.description }}
            </p>
            <br />
            <v-divider />
            <div style="width: auto; height: 30px" />
            <p class="fz-21 font-weight-bold">Billing Details</p>
            <v-row>
              <v-col>
                <p>
                  <b>Billing Type:</b> {{ vpc.billing_type }}
                </p>
              </v-col>
            </v-row>
            <v-divider />
            <div style="width: auto; height: 30px" />
            <p class="fz-21 font-weight-bold">Type</p>
            <v-row>
              <v-col>
                <p>
                  <b>Type:</b> {{ vpc.type }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-tab-item>

        <v-tab-item>
          <v-card-text class="pa-8">
            <p class="fz-21 font-weight-bold">Instance</p>
            <v-data-table
              :headers="headerload"
              hide-default-footer
              :items="vpc.resources"
              :options.sync="vpcdetailOptions"
              :items-per-page="itemsPerPage"
              :server-items-length="vpcdetailPaginator.count"
            >
              <template v-slot:item.instance_name="{ item }">
                <div>
                  <p class="mb-0">
                    <span class="linkpointer">{{ item.instance_name }}</span>
                  </p>
                  <!-- <p class="mb-0">{{ item.spec }}</p> -->
                </div>
              </template>
              <template v-slot:item.ip_address="{ item }">
                <div>
                  <p class="mb-0">
                    {{ item.ip_address }}
                  </p>
                </div>
              </template>
              <!-- <template v-slot:item.action>
                <span class="primary--text">Edit</span>
                <span style="cursor: pointer" class="pl-3 error--text"
                  >Delete</span
                >
              </template> -->
              <template
                v-slot:footer="{ props }"
                v-if="vpc.resources.length"
              >
                <custom-footer-datatable @input="(val) => vpcdetailOptions = val" :props="props" />
              </template>
            </v-data-table>
          </v-card-text>
        </v-tab-item>

        <v-tab-item>
          <v-card-text class="pa-8">
            <p class="fz-21 font-weight-bold">Settings</p>
            <br />
            <v-row>
              <v-col md="6">
                <p class="mb-3"><b>Name</b></p>
                <v-text-field
                  maxlength="50"
                  outlined
                  :disabled="read_only"
                  v-model="vpc.name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <p class="mb-3"><b>Description</b></p>
                <v-textarea outlined v-model="vpc.description" :disabled="read_only"> </v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6" v-if="!read_only">
                <v-btn
                  height="55"
                  :disabled="isLoading"
                  block
                  depressed
                  color="secondary"
                  @click="
                    () => {
                      validateprivilages(['Network', 'editor', true]).then(
                        () => {
                          updateVPC(vpc);
                        }
                      );
                    }
                  "
                >
                  <div v-if="isLoading">
                    <beat-loader
                      :loading="isLoading"
                      :color="'white'"
                      :size="'10px'"
                    ></beat-loader>
                  </div>
                  <span v-else>Save</span>
                </v-btn>
              </v-col>
            </v-row>
            <br />
            <v-divider />
            <div class="d-flex flex-row align-center ">
              <div class="mb-4">
                <div style="width: auto; height: 30px" />
                <p class="fz-21 font-weight-bold">Destroy</p>
                <p>
                  To destroy a VPC network, you must destroy all resources
                  within it first. The default VPC cannot be destroyed.
                </p>
              </div>
              <v-spacer />
              <v-btn
                v-if="!read_only"
                @click="
                  () => {
                    validateprivilages(['Network', 'editor', true]).then(() => {
                        vpcselected = vpc.type;
                        opendialogdeletevpc = true;
                    });
                  }
                "
                style="border: 1px solid #EB5757;background-color:white"
                depressed
                height="45"
                width="150"
                class="error--text"
                >Destroy</v-btn
              >
            </div>

            <v-divider />
          </v-card-text>
        </v-tab-item>

        <v-tab-item>
          <v-card-text class="pa-8">
            <v-col class="d-flex flex-row align-center">
              <p class="fz-21 font-weight-bold mb-0">Subnets</p>
              <v-spacer />
            
              <div style="height: auto; width: 30px" />

              <v-btn
                v-if="!read_only"
                id="CreatePort"
                depressed
                height="50"
                width="150"
                class="secondary"
                @click="
                  () => {
                    selectedVPCSubnet = null
                    openDialogAddVPCSubnet = true
                  }
                "
              >
                <span class="fz-14">Add Subnet</span>
              </v-btn>
            </v-col>            

            <v-data-table
              :headers="headersubnet"
              hide-default-footer
              :items="vpc.vpc_subnets"
              :items-per-page="itemsPerPage"
              :options.sync="options"
            >
              <template v-slot:item.name="{ item }">
                <div>
                  <p class="mb-0">
                    <span>{{ item.name }}</span>
                  </p>
                </div>
              </template>
              <template v-slot:item.ip_prefix="{ item }">
                <div>
                  <p class="mb-0">
                    {{ item.ip_prefix }}
                  </p>
                </div>
              </template>
              <template v-slot:item.enable_dhcp="{ item }">
                <div>
                  <p class="mb-0">
                    {{ item.enable_dhcp == true ? "Yes" : "No" }}
                  </p>
                </div>
              </template>
              <template v-slot:item.action="{ item }">
                <popupquote
                v-model="item.open"
                :offsetTop="20"
                :documentid="'popup' + item.id"
                offset-y
                allow-overflow
              >
                <template v-slot:activator="{ on, attrs }">
                  <label
                    v-bind="attrs"
                    class="primary--text linkpointer"
                    style="position: relative; white-space: nowrap"
                    @click="
                      ($event) => {
                        on.click($event);                        
                        showSubnet($event, item);                        
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
                    v-if="!read_only"
                    @click="
                      () => {
                        selectedVPCSubnet = item
                        openDialogAddVPCSubnet = true
                      }
                    "
                  >
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>                  
                  <v-list-item  style="min-height:1px; margin-left:-16px; margin-right:-16px" >
                  <v-divider style="min-width: 160px" />
                  </v-list-item>
                  <v-list-item v-if="!read_only && vpcsubnet != item.name"
                    @click="
                      () => {
                        selectedVPCSubnet = item
                        openDialogDeleteVPCSubnet = true
                      }
                    "                    
                  >
                    <v-list-item-title class="error--text">Delete</v-list-item-title>
                  </v-list-item>
                </v-list>                
              </popupquote>
              </template>
              <template v-slot:footer="{ props }">
                <custom-footer-datatable
                  @input="
                    (val) => {
                      options = { ...options, ...val };
                    }
                  "
                  :props="props"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-tab-item>

        <v-tab-item>
          <v-card-text class="pa-8">
            <v-col class="d-flex flex-row align-center">
              <p class="fz-21 font-weight-bold mb-0">Ports</p>
              <v-spacer />
            
              <div style="height: auto; width: 30px" />

              <v-btn
                v-if="!read_only"
                id="CreatePort"
                depressed
                height="50"
                width="150"
                class="secondary"
                @click="
                  () => {
                    selectedVPCPort = null
                    openDialogAddVPCPort = true
                  }
                "
              >
                <span class="fz-14">Add Port</span>
              </v-btn>
            </v-col>            

            <v-data-table
              :headers="headerport"
              hide-default-footer
              :items="vpc.vpc_ports"
              :items-per-page="itemsPerPage"
              :options.sync="options"
            >
              <template v-slot:item.name="{ item }">
                <div>
                  <p class="mb-0">
                    <span>{{ item.name }}</span>
                  </p>
                </div>
              </template>
              <template v-slot:item.ip_address="{ item }">
                <div>
                  <p class="mb-0">
                    {{ item.ip_address }}
                  </p>
                </div>
              </template>
              <template v-slot:item.port_security="{ item }">
                <div>
                  <p class="mb-0">
                    {{ (item.port_security_enabled == true ? 'Enabled' : 'Disabled') }}
                  </p>
                </div>
              </template>
              <template v-slot:item.created_at="{ item }">
                <div>
                  <p class="mb-0">
                    {{ $moment(new Date(item.created_at)).format("DD/MM/YYYY") }}
                  </p>
                </div>
              </template>
              <template v-slot:item.action="{ item }">
                <popupquote
                v-model="item.open"
                :offsetTop="20"
                :documentid="'popup' + item.id"
                offset-y
                allow-overflow
              >
                <template v-slot:activator="{ on, attrs }">
                  <label
                    v-bind="attrs"
                    class="primary--text linkpointer"
                    style="position: relative; white-space: nowrap"
                    @click="
                      ($event) => {
                        on.click($event);                        
                        show($event, item);                        
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
                    v-if="!read_only"
                    @click="
                      () => {
                        selectedVPCPort = item
                        openDialogAddVPCPort = true
                      }
                    "
                  >
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>                  
                  <v-list-item
                    style="min-height: 1px; margin-left: -16px; margin-right: -16px"
                  >
                    <v-divider style="min-width: 160px" />
                  </v-list-item>
                  <v-list-item
                    v-if="!read_only && item.status != 'attached'"
                    @click="
                      () => {
                        selectedVPCPort = item
                        openDialogDeleteVPCPort = true
                      }
                    "                    
                  >
                    <v-list-item-title class="error--text">Delete</v-list-item-title>
                  </v-list-item>
                </v-list>                
              </popupquote>
              </template>
              <template v-slot:footer="{ props }">
                <custom-footer-datatable
                  @input="
                    (val) => {
                      options = { ...options, ...val };
                    }
                  "
                  :props="props"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-tab-item>

        <!-- <v-tab-item>
          <network
          v-model="networkTab"
          />
        </v-tab-item>

        <v-tab-item>
          <interface-page
          v-model="interfaceTab"
          />
        </v-tab-item>
        
        <v-tab-item>
          <static-routing
          v-model="srTab"
          />
        </v-tab-item>

        <v-tab-item>
          <nat-gateway
          v-model="ngTab"
          />
        </v-tab-item> -->
      </v-tabs-items>
    </v-card>

    <dialogDeleteVpc
      v-model="opendialogdeletevpc"
      @delete="
        () => {
            vpcselected != 'Expert' ? deleteSelectedVPC() : deleteVpcAdvanced() 
        }
      "
    />

    <dialogAddVPCSubnet v-if="openDialogAddVPCSubnet" v-model="openDialogAddVPCSubnet" :selectedVPCSubnet="selectedVPCSubnet" @create="(payload) => doCreateVPCSubnet(payload)" @update="(payload) => doUpdateVPCSubnet(payload)" />

    <dialogDeleteVPCSubnet
      v-model="openDialogDeleteVPCSubnet"
      :selectedVPCSubnet="selectedVPCSubnet"
      @delete="(payload) => doDeleteVPCSubnet(payload)"
    />

    <dialogAddVPCPort
      v-model="openDialogAddVPCPort"
      :selectedVPCPort="selectedVPCPort"
      @create="(payload) => doCreateVPCPort(payload)"
      @update="(payload) => doUpdateVPCPort(payload)"
    />

    <dialogDeleteVPCPort
      v-model="openDialogDeleteVPCPort"
      :selectedVPCPort="selectedVPCPort"
      @delete="(payload) => doDeleteVPCPort(payload)"
    />
  </div>
</template>

<script>
import { ref, onMounted, watch, defineComponent} from "@vue/composition-api";
import dialogDeleteVpc from "./dialogDeleteVpc";
import dialogAddVPCSubnet from "./dialogAddVPCSubnet.vue";
import dialogDeleteVPCSubnet from "./dialogDeleteVPCSubnet.vue";
import dialogAddVPCPort from "./dialogAddVPCPort.vue";
import dialogDeleteVPCPort from "./dialogDeleteVPCPort.vue";
// import staticRouting from './static-routing'
// import natGateway from './nat-gateway.vue'
// import network from './network.vue'
// import interfacePage from './interface.vue'
import {
  useNamespacedActions,
  useNamespacedState
} from "vuex-composition-helpers";
import { NETWORKVPC } from "../namespace.ts";
import localstorage from "@/lib/localstorage";
import { AccessControl } from "@/lib/middleware";

export default defineComponent ({
  components: { 
    dialogDeleteVpc,
    // staticRouting,
    // natGateway,
    // network,
    // interfacePage,
    dialogAddVPCSubnet,
    dialogDeleteVPCSubnet,
    dialogAddVPCPort,
    dialogDeleteVPCPort
  },
  setup(props, context) {
    props;
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Network'));
    const { fetchvpcs, DELETE_VPC,DELETE_VPC_ADVANCED, } = useNamespacedActions(NETWORKVPC, [
      "fetchvpcs",
      "DELETE_VPC",
      "DELETE_VPC_ADVANCED"
    ]);
    const { vpcs } = useNamespacedState(NETWORKVPC, ["vpcs"]);
    const vpcselected = ref();

    const { vpcid } = context.root._route.params;
    const { vpc, isLoading, vpcdetailPaginator, instances } = useNamespacedState(NETWORKVPC, [
      "vpc",
      "isLoading",
      "vpcdetailPaginator",
      "instances"
    ]);
    
    const { DETAIL_VPC, UPDATE_VPC, DETAIL_VPC2, createVPCSubnet, updateVPCSubnet, deleteVPCSubnet, createVPCPort, updateVPCPort, deleteVPCPort } = useNamespacedActions(NETWORKVPC, [
      "DETAIL_VPC",
      "UPDATE_VPC",
      "DETAIL_VPC2",
      "createVPCSubnet",
      "updateVPCSubnet",
      "deleteVPCSubnet",
      "createVPCPort",
      "updateVPCPort",
      "deleteVPCPort"
    ]);
    const vpcsubnet  = "subnet-"+vpcid;
    const tabs = ref()
    const subnetTab = ref(false)
    const portTab = ref(false)

    const selectedVPCSubnet = ref(null)
    const openDialogAddVPCSubnet = ref(false)
    const openDialogDeleteVPCSubnet = ref(false)
    const routerid = ref(null)

    const doCreateVPCSubnet = async (payload) => {
      payload.router_id = routerid.value
      const response = await createVPCSubnet({payload, vpcid})
      if (response.status == 200) {
        openDialogAddVPCSubnet.value = false
        context.root.$emit('resetFormVPCSubnet')
      }
    }
    
    const doUpdateVPCSubnet = async (payload) => {
      const response = await updateVPCSubnet({payload, vpcid})
      if (response.status == 200) openDialogAddVPCSubnet.value = false
    }

    const doDeleteVPCSubnet = async (vpcSubnetID) => {      
      const response = await deleteVPCSubnet({vpcSubnetID, vpcid, routerid})
      openDialogDeleteVPCSubnet.value = false
    }

    const selectedVPCPort = ref(null)
    const openDialogAddVPCPort = ref(false)
    const openDialogDeleteVPCPort = ref(false)
    const options = ref(null)

    const doCreateVPCPort = async (payload) => {
      const response = await createVPCPort({payload, vpcid})
      if (response.status == 200) {
        openDialogAddVPCPort.value = false
        context.root.$emit('resetFormVPCPort')
      }
    }

    const doUpdateVPCPort = async (payload) => {
      const response = await updateVPCPort({payload, vpcid})
      if (response.status == 200) openDialogAddVPCPort.value = false
    }
    
    const doDeleteVPCPort = async (vpcPortID) => {      
      const response = await deleteVPCPort({vpcPortID, vpcid})
      openDialogDeleteVPCPort.value = false
    }

    watch(tabs, (newVal) => {
      if(newVal == 3){
        subnetTab.value = true
        portTab.value = false
      }else if(newVal == 4){
        portTab.value = true
        subnetTab.value = false
      }else{
        portTab.value = false
        subnetTab.value = false
        vpc.value.project_ids = vpc.value.project_ids == null ? [] : vpc.value.project_ids
        console.log('other')
      }
    })

    watch(options, async (val) => {      
      await DETAIL_VPC({ id: vpcid })
    })

    onMounted(async () => {
      await DETAIL_VPC({ id: vpcid });
      routerid.value = vpc.value.vpc_openstack_data.router_id
    });

    const {
      validateprivilages,
      validateprivilagesync
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync"
    ]);

    //VPC Detail Pagination
    const vpcdetailOptions = ref({})
    watch(vpcdetailOptions, async (val) => {
      let params = {
        id: vpcid,
        limit: val.itemsPerPage,
        page: val.page
      }
      await DETAIL_VPC(params)
      // await DETAIL_VPC2(params)
    })

    const itemsPerPage = 10
    //END VPC Detail Pagination

    const updateVPC = async (vpc) => {
        const payload = {
            id: vpc.id,
            name: vpc.name,
            description: vpc.description,
            region: vpc.region,
            ip: vpc.ip_prefix,
            network_size: vpc.network_size,
            type: vpc.type,
            project_ids: vpc.project_ids,
            shared: vpc.project_ids.length == 0 ? false : true
        }
        await UPDATE_VPC(payload);
    }

    const opendialogdeletevpc = ref(false)
    const deleteVpcAdvanced = async () => {
        opendialogdeletevpc.value = false
        let payload = {
            id_vpc: vpcid
        }
        await DELETE_VPC_ADVANCED(payload).then(response => {
            if (response && response.status === true) {
                context.root.$router.replace("/network/vpc");
            }
        });
    }

    const deleteSelectedVPC = async () => {
        opendialogdeletevpc.value = false
        DELETE_VPC({
            id: vpcid
        }).then(response => {
            if (response && response.code === 200) {
                context.root.$router.replace("/network/vpc");
            }
        });
    }

    return {
      vpcid,
      routerid,
      read_only,
      vpcs,
      fetchvpcs,
      DELETE_VPC,
      DELETE_VPC_ADVANCED,
      vpcselected,      
      validateprivilages,
      validateprivilagesync,
      vpc,
      vpcsubnet,
      isLoading,
      itemsPerPage,
      vpcdetailOptions,
      vpcdetailPaginator,
      instances,
      opendialogdeletevpc: ref(false),
      tabs, 
      subnetTab,
      selectedVPCSubnet,
      openDialogAddVPCSubnet,
      openDialogDeleteVPCSubnet,
      showSubnet: ($event, item) => {
        selectedVPCSubnet.value = item;
      },
      doCreateVPCSubnet,
      doUpdateVPCSubnet,
      doDeleteVPCSubnet,

      portTab,
      selectedVPCPort,
      doCreateVPCPort,
      doUpdateVPCPort,
      doDeleteVPCPort,
      openDialogAddVPCPort,
      openDialogDeleteVPCPort,
      options,
      show: ($event, item) => {
        selectedVPCPort.value = item;
      },
      updateVPC,
      deleteVpcAdvanced,
      deleteSelectedVPC,
      headerload: ref([
        { text: "Name", value: "instance_name" },
        { text: "IP Address", value: "ip_address" }
        // { text: "Action", value: "action", sortable: false, align: "center", width: 150 },
      ]),
      headersubnet: ref([
        { text: "Name", value: "name" },
        { text: "IP Address", value: "ip_prefix" },
        { text: "Enable DHCP", value: "enable_dhcp" },
        { text: 'Action', value: 'action' },
      ]),
      headerport: ref([
        { text: "Name", value: "name" },
        { text: "IP Address", value: "ip_address" },
        { text: "Mac Address", value: "mac_address" },
        { text: "Status", value: "status" },
        { text: "Port Security", value: "port_security" },
        { text: "Created At", value: "created_at" },
        { text: 'Action', value: 'action' },
      ]),
      loaddata: ref([
        {
          name: "Instance 1",
          spec: "2 vCPU/ 2GB RAM",
          status: "Running",
          ip: "192.168.100.0"
        }
      ])
    };
  }
});
</script>

<style lang="scss" scoped>
@media (max-width: 800px) {
  .network-desc{
    flex-direction: column !important;
  }
  .desc-child{
    align-self: center;
    margin: 3px 0px;
  }
}
.head{
	p:first-child{
		font-weight: 700;
	}
}
</style>
