<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-5">
            <v-row>
              <v-col md="3">
                <p class="font-weight-bold mb-0">Create Edge Gateway</p>
                <!-- <p v-if="typeOrg == 'T'">{{ generalVarT }}</p> -->
                <v-stepper v-model="steper" vertical>
                  <v-stepper-step :complete="steper > 1" step="1"> Organization VDC </v-stepper-step>
                  <v-stepper-content step="1"></v-stepper-content>
                  <div v-if="typeOrg == 'V'">
                    <v-stepper-step :complete="steper > 2" step="2"> General </v-stepper-step>
                    <v-stepper-content step="2"></v-stepper-content>
                    <v-stepper-step :complete="steper > 3" step="3"> External Network </v-stepper-step>
                    <v-stepper-content step="3"></v-stepper-content>
                    <v-stepper-step step="4" :complete="steper > 4"> Default Gateway </v-stepper-step>
                    <v-stepper-content step="4"></v-stepper-content>
                    <v-stepper-step step="5" :complete="steper > 5"> Advanced Options</v-stepper-step>
                    <v-stepper-content step="5"></v-stepper-content>
                    <v-stepper-step v-if="advancedOptionsVar.ipSettings" step="6" :complete="steper > 6"> IP Settings</v-stepper-step>
                    <v-stepper-content v-if="advancedOptionsVar.ipSettings" step="6"></v-stepper-content>
                    <v-stepper-step v-if="advancedOptionsVar.subIpPool" :step="!advancedOptionsVar.ipSettings ? '6' : '7' " :complete="steper > 7"> Sub-allocated IP Pools</v-stepper-step>
                    <v-stepper-content v-if="advancedOptionsVar.subIpPool" :step="!advancedOptionsVar.ipSettings ? '6' : '7'"></v-stepper-content>
                    <v-stepper-step :step="stepReadyNo"> Ready To Complete </v-stepper-step>
                  </div>
                  <div v-else>
                    <v-stepper-step :complete="steper > 2" step="2"> General </v-stepper-step>
                    <v-stepper-content step="2"></v-stepper-content>
                    <v-stepper-step :complete="steper > 3" step="3"> Tier-O Gateway </v-stepper-step>
                    <v-stepper-content step="3"></v-stepper-content>
                    <v-stepper-step step="4" :complete="steper > 4"> Edge Cluster </v-stepper-step>
                    <v-stepper-content step="4"></v-stepper-content>
                    <v-stepper-step step="5" :complete="steper > 5"> Allocated IPs</v-stepper-step>
                    <v-stepper-content step="5"></v-stepper-content>
                    <v-stepper-step :step="stepReadyNo"> Ready To Complete </v-stepper-step>
                  </div>
                  <!-- <v-stepper-step step="6" :complete="steper > 6"> IP Settings </v-stepper-step>
                  <v-stepper-content step="6"></v-stepper-content>
                  <v-stepper-step step="7" :complete="steper > 7"> Sub-allocated IP pools </v-stepper-step>
                  <v-stepper-content step="7"></v-stepper-content> -->
                </v-stepper>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col md="9">
                <org-vdc v-if="steper == 1" v-model="orgVar" :step.sync="steper" />
                <div v-if="typeOrg == 'V'">
                  <general v-if="steper == 2" v-model="generalVar" :step.sync="steper" />
                  <external-network v-if="steper == 3" v-model="externalNetworkVar" :provider="orgVar.orgVdc" @filterNetwork="getFilterNetwork" :step.sync="steper" />
                  <default-gateway v-if="steper == 4" v-model="defaultGatewayVar" :itemsNetwork="itemsNetworkDefault" :step.sync="steper" />
                  <advanced-options v-if="steper == 5" v-model="advancedOptionsVar" :step.sync="steper" />
                  <ip-settings v-if="steper == 6 && advancedOptionsVar.ipSettings" v-model="ipSettingsVar" :step.sync="steper" />
                  <sub-ip-pools v-if="((steper == 7 && advancedOptionsVar.ipSettings) && advancedOptionsVar.subIpPool) || ((steper == 6 && !advancedOptionsVar.ipSettings) && advancedOptionsVar.subIpPool)" v-model="subIpPoolsVar" :step.sync="steper" />
                  <ready-complete v-if="steper == stepReadyNo" :data="payloadCreateEdge"  :step.sync="steper" />
                </div>
                <div v-else>
                  <general-t v-if="steper == 2" v-model="generalVarT" :step.sync="steper" />
                  <tier-gateway-t v-if="steper == 3" v-model="tierGatewayVar" :provider="orgVar.orgVdc" :enabledDedicate="generalVarT.general.enabledDedicateTier" :step.sync="steper" />
                  <edge-cluster-t v-if="steper == 4" v-model="edgeClusterVar" :provider="orgVar.orgVdc" :step.sync="steper" />
                  <allocated-ips-t v-if="steper == 5" v-model="tierGatewayVar" :step.sync="steper" :externalNetwork="tierGatewayVar.tier" />
                  <ready-complete-t v-if="steper == 6" :data="payloadCreateEdgeT" :step.sync="steper" />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { computed, reactive, ref, watch } from '@vue/composition-api'
import { useTypeT } from './step-create/type-T/useTypeT'
import orgVdc from './step-create/org-vdc.vue'
import general from './step-create/general.vue'
import externalNetwork from './step-create/external-network.vue'
import defaultGateway from './step-create/default-gateway.vue'
import advancedOptions from './step-create/advanced-options.vue'
import ipSettings from './step-create/ip-settings.vue'
import subIpPools from './step-create/sub-ip-pools.vue'
import readyComplete from './step-create/ready-complete.vue'
import generalT from './step-create/type-T/general.vue'
import tierGatewayT from './step-create/type-T/tier-gateway.vue'
import edgeClusterT from './step-create/type-T/edge-cluster.vue'
import allocatedIpsT from './step-create/type-T/allocated-ips.vue'
import readyCompleteT from './step-create/type-T/ready-complete.vue'

export default {
  components: {
    orgVdc,
    general,
    externalNetwork,
    defaultGateway,
    advancedOptions,
    ipSettings,
    subIpPools,
    readyComplete,
    generalT,
    tierGatewayT,
    edgeClusterT,
    allocatedIpsT,
    readyCompleteT,
  },
  setup() {

    const { 
      generalVarT,
      tierGatewayVar,
      edgeClusterVar,
      allocatedIpsVar,
      payloadCreateEdgeT,
      MappingPayloadT,
     } = useTypeT()

    const payloadCreateEdge = ref()

    const steper = ref(1)
    const typeOrg = ref("V")
    watch(steper, (newVal) => {

      if(typeOrg.value == 'V'){
        if(newVal == 6){
          payloadCreateEdge.value = {
            ...orgVar,
            ...generalVar.value,
            ...externalNetworkVar,
            ...defaultGatewayVar,
            ...itemsNetworkDefault
          }
          if(!advancedOptionsVar.ipSettings){
            if(!advancedOptionsVar.subIpPool){
              payloadCreateEdge.value = payloadMappingCreate(payloadCreateEdge.value)
              payloadCreateEdge.value = {
                payload: payloadCreateEdge.value,
                organization: orgVar.orgVdc,
                defaultGateway: defaultGatewayVar
              }
              defaultGatewayVar.enabledConfigure ? payloadCreateEdge.value.payload.configuration.useDefaultRouteForDnsRelay = defaultGatewayVar.enabledUseDns : ''
            }
          }
        }else if(newVal == 7){
          if(advancedOptionsVar.ipSettings){
            payloadCreateEdge.value = {
              ...payloadCreateEdge.value,
              ...ipSettingsVar,
              ...orgVar,
              ...generalVar.value,
              ...externalNetworkVar,
              ...defaultGatewayVar,
              ...itemsNetworkDefault
            }
            if(!advancedOptionsVar.subIpPool){
              payloadCreateEdge.value = payloadMappingCreate(payloadCreateEdge.value)
              payloadCreateEdge.value = {
                payload: payloadCreateEdge.value,
                organization: orgVar.orgVdc,
                defaultGateway: defaultGatewayVar
              }
              defaultGatewayVar.enabledConfigure ? payloadCreateEdge.value.payload.configuration.useDefaultRouteForDnsRelay = defaultGatewayVar.enabledUseDns : ''
            }
          }else if(advancedOptionsVar.subIpPool){
            payloadCreateEdge.value = {
              ...payloadCreateEdge.value,
              ...subIpPoolsVar,
              ...orgVar,
              ...generalVar.value,
              ...externalNetworkVar,
              ...defaultGatewayVar,
              ...itemsNetworkDefault
            }
            if(!advancedOptionsVar.ipSettings){
              payloadCreateEdge.value = payloadMappingCreate(payloadCreateEdge.value)
              payloadCreateEdge.value = {
                payload: payloadCreateEdge.value,
                organization: orgVar.orgVdc,
                defaultGateway: defaultGatewayVar
              }
              defaultGatewayVar.enabledConfigure ? payloadCreateEdge.value.payload.configuration.useDefaultRouteForDnsRelay = defaultGatewayVar.enabledUseDns : ''
            }
          }
        }else if(newVal == 8){
          payloadCreateEdge.value = {
            ...payloadCreateEdge.value,
            ...subIpPoolsVar,
            ...orgVar,
            ...generalVar.value,
            ...externalNetworkVar,
            ...defaultGatewayVar,
            ...itemsNetworkDefault
          }
          console.log(payloadCreateEdge.value)
          payloadCreateEdge.value = payloadMappingCreate(payloadCreateEdge.value)
          payloadCreateEdge.value = {
            payload: payloadCreateEdge.value,
            organization: orgVar.orgVdc,
            defaultGateway: defaultGatewayVar
          }
          defaultGatewayVar.enabledConfigure ? payloadCreateEdge.value.payload.configuration.useDefaultRouteForDnsRelay = defaultGatewayVar.enabledUseDns : ''
        }
      }else{
        if(newVal == 6){
          // payloadCreateEdgeT.value = {
          //   ...generalVarT,
          //   ...tierGatewayVar,
          //   ...edgeClusterVar,
          //   ...allocatedIpsVar,
          //   ...orgVar
          // }
          // console.log(payloadCreateEdgeT.value)
          MappingPayloadT(orgVar)
        }
      }
      
      // console.log(payloadCreateEdge.value)
    })

    const orgVar = reactive({
      orgVdc: null
    })
    watch(() => orgVar.orgVdc, (newVal) => {
      // console.log(newVal)
      let typeSplit = newVal.networkProviderType.split("_")
      typeOrg.value = typeSplit[1]
    },
    { deep: true})

    // Step 2 General Variable
    const generalVar = ref({
      name: '',
      description: '',
      distributedRouted: false,
      fipsMode: false,
      ha: false,
      config: 'compact'
    })

    
    // Step 3 External Network Variable
    const externalNetworkVar = reactive({
      networkRow: [],
      subnets: []
    })

    watch(() => externalNetworkVar.subnets, (newVal, oldVal) => {
      // console.log(newVal)
    },
    { deep: true})
    watch(() => externalNetworkVar.networkRow, (newVal, oldVal) => {
      // defaultGatewayVar.itemsDefault = []
      // defaultGatewayVar.defaultGateway = {}
      if(!newVal.length){
        externalNetworkVar.subnets = []
      }
    },
    { deep: true})
  
    // Filter External Network 
    const getFilterNetwork = (event) => {
      // console.log(event)
      itemsNetworkDefault.itemsNetworkDefault = event
      externalNetworkVar.networkRow = externalNetworkVar.networkRow.filter((x) => {
        return event.some((y) => {
          return x.id == y.id
        })
      })

      externalNetworkVar.networkRow = externalNetworkVar.networkRow.map((el1, i) => {
        return {
          ...el1,
          subIpPool: '',
          subnetChoice: event[i].subnets
        }
      })
      // subIpPoolsVar.subIpPoolsItems = event.map((x) => { return { ...x, subIpPool: '' }})
      subIpPoolsVar.subIpPoolsItems = externalNetworkVar.networkRow
      externalNetworkVar.networkRow = externalNetworkVar.networkRow.map((x) => {
        return{
          ...x,
          subnets: x.subnets.map((y) => {
            return{
              ...y,
              ipAddress: ''
            }
          })
        }
      })
      ipSettingsVar.ipSettings = externalNetworkVar.networkRow
      // ipSettingsVar.ipSettings = event.map((x) => {
      //   return {
      //     ...x,
      //     subnets: x.subnets.map((y) => {
      //       return {
      //         ...y,
      //         ipAddress: ''
      //       }
      //     })
      //   }
      // })
      // console.log(externalNetworkVar.networkRow)
    }


    // Step 4 Default Gateway Variable
    const defaultGatewayVar = reactive({
      enabledConfigure: true,
      externalNetwork: null,
      itemsDefault: [],
      defaultGateway: {},
      enabledUseDns: false
    })
    const itemsNetworkDefault = reactive({
      itemsNetworkDefault: []
    })

    watch(() => defaultGatewayVar.externalNetwork, (newVal, oldVal) => {
      defaultGatewayVar.defaultGateway = {}
      defaultGatewayVar.itemsDefault = newVal.subnets
    }, { deep: true })

    watch(() => defaultGatewayVar.enabledConfigure, (newVal, oldVal) => {
      if(!newVal){
        defaultGatewayVar.externalNetwork = {}
        defaultGatewayVar.defaultGateway = {}
      }
    }, { deep: true })


    // Step 5 Advanced Options
    const advancedOptionsVar = reactive({
      ipSettings: false,
      subIpPool: false,
      rateLimits: false
    })


    // Step 6 IP Settings Variable
    const ipSettingsVar = reactive({
      ipSettings: []
    })

    watch(() => ipSettingsVar.ipSettings, (newVal) => {
      // console.log(newVal)
    })

    // Step 7 Sub IP Pools
    const subIpPoolsVar = reactive({
      subIpPoolsItems: [],
      subIpChoice: {}
    })

    const splitIOrgId = (data) => {
      let splitData = data.split(':')
      return splitData[3]
    }

    const payloadMappingCreate = (data) => {
      return {
          name: data.name,
          description: data.description,
          configuration: {
            distributedRoutingEnabled: data.distributedRouted,
            fipsModeEnabled: data.fipsMode,
            haEnabled: data.ha,
            backwardCompatibilityMode: false,
            gatewayBackingConfig: data.config,
            gatewayInterfaces: {
              gatewayInterface: data.networkRow.map((el1) => {
                return{
                  name: el1.name,
                  network: {
                    href: `https://iaas.lintasarta.net/cloudapi/1.0.0/externalNetworks/${splitIOrgId(el1.id)}`,
                    id: el1.id
                  },
                  interfaceType: "uplink",
                  subnetParticipation: el1.subnets.map((subnet) => {
                    return{
                      gateway: subnet.gateway,
                      subnetPrefixLength: subnet.prefixLength,
                      useForDefaultRoute: subnet.gateway == data.defaultGateway?.gateway ? true : false, // logic
                      netmask: subnet.gateway.includes('.') ? getNetmaskFromSubnetIpv4(subnet.prefixLength) : getNetmaskFromSubnetIpv6(subnet.prefixLength), // ni gatau darimana
                      ipAddress: data.ipSettings ? subnet.ipAddress : '',
                      ipRange: [], // ko kosong?
                    }
                  }),
                  applyRateLimit: false,
                  inRateLimit: null,
                  outRateLimit: null,
                  useForDefaultRoute: el1.id == data.externalNetwork.id ? true : false, // logic
                }
              })
            },
            // useDefaultRouteForDnsRelay: data.enabledUseDns,
            advancedNetworkingEnabled: true,
            edgeGatewayServiceConfiguration: null
          }
      }
    }

    const getNetmaskFromSubnetIpv6 = (subnet) => {
      return '0.0.0.0';
    }

    const getNetmaskFromSubnetIpv4 = (subnet) => {
      switch (subnet) {
        case 1:
          return '128.0.0.0';
        case 2:
          return '192.0.0.0';
        case 3:
          return '224.0.0.0';
        case 4:
          return '240.0.0.0';
        case 5:
          return '248.0.0.0';
        case 6:
          return '252.0.0.0';
        case 7:
          return '254.0.0.0';
        case 8:
          return '255.255.0.0';
        case 9:
          return '255.128.0.0';
        case 10:
          return '255.192.0.0';
        case 11:
          return '255.224.0.0';
        case 12:
          return '255.240.0.0';
        case 13:
          return '255.248.0.0';
        case 14:
          return '255.252.0.0';
        case 15:
          return '255.254.0.0';
        case 16:
          return '255.255.0.0';
        case 17:
          return '255.255.128.0';
        case 18:
          return '255.255.192.0';
        case 19:
          return '255.255.224.0';
        case 20:
          return '255.255.240.0';
        case 21:
          return '255.255.248.0';
        case 22:
          return '255.255.252.0';
        case 23:
          return '255.255.254.0';
        case 24:
          return '255.255.255.0';
        case 25:
          return '255.255.255.128';
        case 26:
          return '255.255.255.192';
        case 27:
          return '255.255.255.224';
        case 28:
          return '255.255.255.240';
        case 29:
          return '255.255.255.248';
        case 30:
          return '255.255.255.252';
        case 31:
          return '255.255.255.254';
        case 32:
          return '255.255.255.255';
        default:
          return '0.0.0.0';
      }
    }

    // Var Ready Number
    const stepReadyNo = computed(() => {
      let numberStepReady = 6
      if(typeOrg.value == 'T'){
        numberStepReady = 6
      }else{
        if(advancedOptionsVar.ipSettings){
          if(advancedOptionsVar.subIpPool){
            numberStepReady = 8
          }else{
            numberStepReady = 7
          }
        }else if(advancedOptionsVar.subIpPool){
          numberStepReady = 7
        }
      }
      return numberStepReady
    })
    
    return{
      steper,
      orgVar,
      generalVar,
      externalNetworkVar,
      defaultGatewayVar,
      getFilterNetwork,
      itemsNetworkDefault,
      advancedOptionsVar,
      stepReadyNo,
      ipSettingsVar,
      subIpPoolsVar,
      payloadCreateEdge,
      typeOrg,
      ...useTypeT()
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .v-sheet.v-stepper:not(.v-sheet--outlined) {
  box-shadow: none;
}
</style>