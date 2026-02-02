<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-5">
            <v-row>
              <v-col md="3">
                <p class="font-weight-bold mb-0">New Organization VDC Network</p>
                <!-- <p>{{ providerValue }}</p> -->
                <v-stepper v-model="steper" vertical>
                  <v-stepper-step :complete="steper > 1" step="1"> General </v-stepper-step>
                  <v-stepper-content step="1"></v-stepper-content>
                  <!-- <v-stepper-step :complete="steper > 2" step="2"> Organization </v-stepper-step>
                  <v-stepper-content step="2"></v-stepper-content> -->
                  <v-stepper-step :complete="steper > 2" step="2"> Provider VDC </v-stepper-step>
                  <v-stepper-content step="2"></v-stepper-content>
                  <v-stepper-step step="3" :complete="steper > 3"> Allocation Model </v-stepper-step>
                  <v-stepper-content step="3"></v-stepper-content>
                  <v-stepper-step step="4" :complete="steper > 4"> Allocation Pools</v-stepper-step>
                  <v-stepper-content step="4"></v-stepper-content>
                  <v-stepper-step step="5" :complete="steper > 5"> Storage Policies </v-stepper-step>
                  <v-stepper-content step="5"></v-stepper-content>
                  <v-stepper-step step="6" :complete="steper > 6"> Network Pool </v-stepper-step>
                  <v-stepper-content step="6"></v-stepper-content>
                  <v-stepper-step step="7"> Ready To Complete </v-stepper-step>
                </v-stepper>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col md="9">
                <general v-if="steper == 1" v-model="generalValue" :step.sync="steper" />
                <!-- <organization v-if="steper == 2" v-model="orgValue" :step.sync="steper" /> -->
                <providerVdc v-if="steper == 2" v-model="providerValue" :step.sync="steper"  />
                <allocationModel v-if="steper == 3" :step.sync="steper" @allocationModelVal="allocationModelVal" />
                <allocationPool v-if="steper == 4" v-model="allocationPoolValue" :step.sync="steper" :model="model" />
                <storage-policies v-if="steper == 5" v-model="storagePolValue" :step.sync="steper" :provider="providerValue" />
                <network-pool v-if="steper == 6" v-model="networkPollValue" :step.sync="steper" :provider="providerValue" />
                <complete v-if="steper == 7" :data="payloadCreateOrgVdc" :step.sync="steper" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { reactive, ref, watch } from '@vue/composition-api'
import general from './step-create/general.vue'
import organization from './step-create/organization.vue'
import providerVdc from './step-create/provider-vdc.vue'
import allocationModel from './step-create/allocation-model.vue'
import allocationPool from './step-create/allocation-pool.vue'
import StoragePolicies from './step-create/storage-policies.vue'
import NetworkPool from './step-create/network-pool.vue'
import Complete from './step-create/complete.vue'

export default {
  components:{
    general,
    organization,
    providerVdc,
    allocationModel,
    allocationPool,
    StoragePolicies,
    NetworkPool,
    Complete,
  },
  setup() {

    const steper = ref(1)
    const model = ref('')

    // Step 1
    const generalValue = ref({
      nameOrg: '',
      vatid: '',
      description: '',
      isEnabled: true
    })
    // Step 2
    const orgValue = ref()
    // Step 3
    const providerValue = ref()
    // Step 5
    const allocationPoolValue = ref({
      cpu_allocation : 50,
      cpu_resource : 50,
      cpu_speed : 1,
      memory_allocation : 2000,
      memory_type : 1,
      memory_resource : 50,
      max_number : 'Custom',
      customMaxNumber : 100,
    })
    // Step 6
    const storagePolValue = reactive({
      selectedItems: [],
      defaultPolicy: [],
      thinProv: false,
      fastProv: false,
    })
    // Step 7
    const networkPollValue = reactive({
      checkSpecify: true,
      poolSelected: [],
      max_prov: 1000
    })
    
    const payloadCreateOrgVdc = ref() // All of Payload Create

    const payloadMap = (data) => { // MAPPING PAYLOAD CREATE
      return {
        // organization: { ...data.organization, id: splitIOrgId(data.organization.id) },
        payload: {
          name: data.nameOrg, // Step 1
          vat_id: data.vatid,
          description:data.description, // Step 1
          isEnabled: data.isEnabled, // Step 1
          allocationModel: model.value, // Allocation Model
          computeCapacity: { // Step 5 Allocation Pool field
              cpu: {
                  units: "MHz",
                  limit: 0,
                  allocated: (data.cpu_allocation*1000),
                  // reserved: 37.15
              },
              memory: {
                  units: "MB",
                  limit: 0,
                  allocated: (data.memory_allocation*data.memory_type),
                  // reserved: 154394.5
              }
          },
          vCpuInMhz: (data.cpu_speed*1000), // Step 5 Allocation Pool field "vCPU SPEED" 
          resourceGuaranteedCpu: (data.cpu_resource/100), // Step 5 Allocation Pool field "CPU RESOURCE" 
          resourceGuaranteedMemory: (data.memory_resource/100), // Step 5 Allocation Pool field "MEMORY RESOURCE"
          providerVdcReference: { // Step 3 PROVIDER VDC
              href: data.href,
              name: data.name
          },
          vmQuota: data.max_number == 'Custom' ? data.customMaxNumber : 0, // Step 5 Allocation Pool field "MAXIMUM NUMBER"
          networkPoolReference: !data.checkSpecify ? null :
          { // Step 7 
              name: data.poolSelected.name,
              href: data.poolSelected.href
          },
          networkQuota: parseInt(data.max_prov),
          vdcStorageProfile: 
            data.selectedItems.map((x) => {
              return {
                    default: x.name == data.defaultPolicy.name ? true : false,
                    _default: x.name == data.defaultPolicy.name ? true : false,
                    enabled: x.isEnabled,
                    units: "MB",
                    limit: (x.allocatedStorage*1024),
                    providerVdcStorageProfile: {
                        href: x.href,
                        name: x.name
                    }
                }
            }),
          isThinProvision: data.thinProv, // Step 6 Storage Policy
          usesFastProvisioning: data.fastProv // Step 6 Storage Policy
        }
      }
    }

    watch(steper, (newVal) => {
      if(newVal == 7) {
        payloadCreateOrgVdc.value = {
          ...generalValue.value,
          // organization: orgValue.value,
          ...providerValue.value,
          ...allocationPoolValue.value,
          ...storagePolValue,
          ...networkPollValue,
        }
        // console.log(payloadCreateOrgVdc.value)
        payloadCreateOrgVdc.value = payloadMap(payloadCreateOrgVdc.value)
        // console.log(payloadCreateOrgVdc.value)
      }
    })

    // Set [] when no data Storage Selected
    watch(() => storagePolValue.selectedItems, (newVal) => {
      // console.log(newVal)
      if(newVal.length){
        storagePolValue.defaultPolicy = newVal[0]
      }
      else if(!newVal.length){
        storagePolValue.defaultPolicy = []
      }
    }, { deep: true })

    // When provider changed, Set Storage Pool to []
    watch(providerValue, (newVal, oldVal) => {
      if(oldVal){
        if(newVal.name != oldVal.name){
          storagePolValue.selectedItems = []
          storagePolValue.defaultPolicy = []
        }
      }
    }, { deep: true })

    // if Check Disabled then Set selectedPool to []
    watch(() => networkPollValue.checkSpecify, (newVal) => {
      if(!newVal){
        networkPollValue.poolSelected = []
      }
 
    }, { deep: true })

    const allocationModelVal = (event) => {
      // console.log(event)
      model.value = event.allocationModel
    }

    const splitIOrgId = (data) => {
      let splitData = data.split(':')
      return splitData[3]
    }

    const payloadCreate = ref({
      name: "sp-dev-org-1-vdc-1", // Step 1
      description: "Service Portal Development Organization 1 VDC 1", // Step 1
      isEnabled: true, // Step 1
      allocationModel: "AllocationPool", // Allocation Model
      computeCapacity: { // Step 5 Allocation Pool field
          cpu: {
              units: "MHz",
              limit: 0,
              allocated: 74300,
              reserved: 37.15
          },
          memory: {
              units: "MB",
              limit: 0,
              allocated: 308789,
              reserved: 154394.5
          }
      },
      vCpuInMhz: 1000, // Step 5 Allocation Pool field "vCPU SPEED" 
      resourceGuaranteedCpu: 0.5, // Step 5 Allocation Pool field "CPU RESOURCE" 
      resourceGuaranteedMemory: 0.5, // Step 5 Allocation Pool field "MEMORY RESOURCE"
      providerVdcReference: { // Step 3 PROVIDER VDC
          href: "https://iaas.lintasarta.net/api/admin/providervdc/162cbd95-2904-4b0a-aa87-d0adb6855c3e",
          name: "JAHProd01_pVDC"
      },
      vmQuota: 100, // Step 5 Allocation Pool field "MAXIMUM NUMBER"
      networkPoolReference: { // Step 7 
          name: "JAHProd01_pVDC-VXLAN-NP",
          href: "https://iaas.lintasarta.net/api/admin/extension/networkPool/74382541-7956-46d6-80f8-1c7305e15bdd"
      },
      networkQuota: 1000,
      vdcStorageProfile: [ // Step 6 Storage Policy(TABLE)
          {
              default: true,
              _default: true,
              enabled: true,
              units: "MB",
              limit: 102400,
              providerVdcStorageProfile: {
                  href: "https://iaas.lintasarta.net/api/admin/pvdcStorageProfile/ed0a5e64-9863-40dc-a072-2435e625ef94",
                  name: "SSD-JAH-STANDARD"
              }
          }
      ],
      isThinProvision: false, // Step 6 Storage Policy
      usesFastProvisioning: false // Step 6 Storage Policy
    })
    
    return{
      steper,
      allocationModelVal,
      model,
      generalValue,
      orgValue,
      providerValue,
      allocationPoolValue,
      storagePolValue,
      networkPollValue,
      payloadCreateOrgVdc
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .v-sheet.v-stepper:not(.v-sheet--outlined) {
  box-shadow: none;
}
</style>