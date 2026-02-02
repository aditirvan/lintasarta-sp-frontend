import { reactive, ref, watch } from '@vue/composition-api'
import { useNamespacedGetters } from 'vuex-composition-helpers'
import { EDGEGATEWAY } from '../../namespace';

const generalVarT = reactive({
  general: {
    name: '',
    description: '',
    enabledDedicateTier: false
  }
})

const tierGatewayVar = reactive({
  tier: {},
  primaryIp: ''
})

const edgeClusterVar = reactive({
  edgeType: 'notSpecific',
  edgeCluster: {}
})

const allocatedIpsVar = reactive({
  primaryIp: '',
  allocatedIps: []
})

const payloadCreateEdgeT = ref()

export const useTypeT = () => {
  const { listAvailableIp,  } = useNamespacedGetters(EDGEGATEWAY, ["listAvailableIp", ])

  const MappingPayloadT = (orgVar) => {
    // allocatedIpsVar.allocatedIps = listAvailableIp.value
    payloadCreateEdgeT.value = {
      ...generalVarT,
      ...tierGatewayVar,
      ...edgeClusterVar,
      // ...allocatedIpsVar,
      ...orgVar
    }
    console.log(payloadCreateEdgeT.value)
    // Edge Cluster di pilih -> STEP 4
    payloadCreateEdgeT.value = payloadMappingCreateT(payloadCreateEdgeT.value)
    if(edgeClusterVar.edgeType == 'specific'){
        payloadCreateEdgeT.value = {
        ...payloadCreateEdgeT.value,
        edgeClusterConfig: {
          primaryEdgeCluster: {
            backingId: edgeClusterVar.edgeCluster.id
          }
        }
      }
    }
    // Primary IP di isi -> STEP 5
    if(tierGatewayVar.primaryIp){
      payloadCreateEdgeT.value = {
        ...payloadCreateEdgeT.value,
        edgeGatewayUplinks: [{
          ...payloadCreateEdgeT.value.edgeGatewayUplinks[0],
          subnets: {
            values: payloadCreateEdgeT.value.edgeGatewayUplinks[0].subnets.values.map((x) =>{
              let gateway, ip
              let lastIndexPoint
              let ipPointIndex = tierGatewayVar.primaryIp.lastIndexOf('.')
              let primaryIP = null
              if(x.gateway.includes('.')){
                lastIndexPoint = x.gateway.lastIndexOf('.')
                gateway = x.gateway.substring(0,lastIndexPoint)
                ip = tierGatewayVar.primaryIp.substring(0,ipPointIndex)
                if(ip == gateway){
                  primaryIP = tierGatewayVar.primaryIp
                }
              }
              return {
                ...x,
                primaryIp: primaryIP
              }
            })
          }
        }]
        
      }
    }

    payloadCreateEdgeT.value = {
      payload: payloadCreateEdgeT.value,
      org: orgVar,
      externalNetwork: tierGatewayVar.tier,
      edgeCluster: edgeClusterVar,
      allocatedIps: allocatedIpsVar
    }
    console.log(payloadCreateEdgeT.value)
    // console.log(generalVarT.value)
  }

  const payloadMappingCreateT = (data) =>{
    let href = data.orgVdc.href
    let replaceHref = href.replace("https://", '')
    let splitHref = replaceHref.split("/")
    allocatedIpsVar.allocatedIps = []

    return {
      name: data.general.name,
      description: data.general.description,
      orgVdc: {
        id: `urn:vcloud:vdc:${splitHref[4]}`
      },
      edgeGatewayUplinks: 
        [{
          uplinkId: data.tier.id,
          uplinkName: data.tier.name,
          dedicated: data.general.enabledDedicateTier,
          subnets: {
            values: data.tier.subnets.map((sub) => {
              let split
              let ipRanges = []
              if(sub.inputIpRanges.value.length){
                // Split IP Ranges in --> STEP 5
                ipRanges = sub.inputIpRanges.value.map((el) => {
                  split = el.split('-')
                  allocatedIpsVar.allocatedIps.push({ 
                    startAddress: split[0].trim(),
                    endAddress: split[1].trim()
                   })
                  return {
                    startAddress: split[0].trim(),
                    endAddress: split[1].trim()
                  }
                })
                
              }
              return{
                gateway: sub.gateway,
                prefixLength: sub.prefixLength,
                dnsSuffix: sub.dnsSuffix,
                dnsServer1: sub.dnsServer1,
                dnsServer2: sub.dnsServer2,
                ipRanges: {
                  values: ipRanges
              },
                enabled: sub.enabled,
                totalIpCount: sub.totalIpCount,
                usedIpCount: sub.usedIpCount,
                // primaryIp: null
              }
            })
          }
        }]
      // })
    }
  }

  watch(() => tierGatewayVar.tier, (newVal) => {
    // console.log(newVal)
  })

  return{
    generalVarT,
    tierGatewayVar,
    edgeClusterVar,
    allocatedIpsVar,
    payloadMappingCreateT,
    payloadCreateEdgeT,
    MappingPayloadT
  }
}