<template>
  <div>
    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Ready To Complete</p> </v-col>
      </v-row>
    </v-card-text>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4 d-flex flex-column">
            <!-- <v-card-text class="pb-0 pt-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Scope</p> </v-col>
              </v-row>
            </v-card-text> -->

            <div class="bor-table d-flex flex-column">
              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Name</v-col>
                <v-col>{{ data.payload.name }}</v-col>
              </v-row>
              <!-- <v-divider></v-divider> -->
              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Business VAT ID</v-col>
                <v-col>{{ data.payload.vat_id }}</v-col>
              </v-row>
              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Description</v-col>
                <v-col>{{ data.payload.description }}</v-col>
              </v-row>

              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Status</v-col>
                <v-col>
                  <v-chip
                  :color="data.payload.isEnabled ? 'success' : 'red'"
                  label
                  >
                    {{ data.payload.isEnabled ? 'Enabled' : 'Disabled' }}
                  </v-chip>
                </v-col>
              </v-row>

              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Organization</v-col>
                <!-- <v-col> {{ data.organization.displayName }} </v-col> -->
                <v-col> {{ orgDP && orgDP.displayName }} </v-col>
              </v-row>

              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Provider VDC</v-col>
                <v-col> {{ data.payload.providerVdcReference.name }} </v-col>
              </v-row>
              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Allocation Model</v-col>
                <v-col> {{ data.payload.allocationModel == "AllocationPool" ? 'Allocation Model' : data.payload.allocationModel }} </v-col>
              </v-row>

              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">CPU</v-col>
                <v-col> {{ `${formatDecimal(data.payload.computeCapacity.cpu.allocated/1000)} GHz` }} allocated</v-col>
              </v-row>
              <v-row class="ma-0">
                <v-col class="grey lighten-4"></v-col>
                <v-col class="pt-0"> {{ `${formatDecimal((data.payload.computeCapacity.cpu.allocated/1000)*data.payload.resourceGuaranteedCpu)} GHz` }}  guaranteed</v-col>
              </v-row>

              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Memory</v-col>
                <v-col>{{ `${formatDecimal(data.payload.computeCapacity.memory.allocated/1024)} GB` }} allocated</v-col>
              </v-row>
              <v-row class="ma-0">
                <v-col class="grey lighten-4"></v-col>
                <v-col class="pt-0"> {{ `${formatDecimal((data.payload.computeCapacity.memory.allocated/1024)*data.payload.resourceGuaranteedMemory)} GB` }} guaranteed</v-col>
              </v-row>

              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Maximum Number of VMs</v-col>
                <v-col> {{ data.payload.vmQuota }} </v-col>
              </v-row>

              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Storage Policies</v-col>
                <v-col> {{ data.payload.vdcStorageProfile[0].providerVdcStorageProfile.name }} </v-col>
              </v-row>
              <v-row class="ma-0" v-for="(item, key) in data.payload.vdcStorageProfile" :key="item.id">
                <v-col v-if="key != 0" class="grey lighten-4"></v-col>
                <v-col  v-if="key != 0" class="pt-0">{{ item.providerVdcStorageProfile.name }}</v-col>
              </v-row>
              <!-- <v-row class="ma-0">
                <v-col ></v-col>
                <v-col>Guaranteed</v-col>
              </v-row> -->

              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Thin Provisioning</v-col>
                <v-col> 
                  <v-icon :color="'grey'">
                    {{ data.payload.isThinProvision ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                  </v-icon>
                  <!-- {{ data.payload.isThinProvision }} -->
                </v-col>
              </v-row>
              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Fast Provisioning</v-col>
                <v-col> 
                  <v-icon :color="'grey'">
                    {{ data.payload.usesFastProvisioning ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                  </v-icon>
                  <!-- {{ data.payload.usesFastProvisioning }} -->
                </v-col>
              </v-row>
              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Network Pool</v-col>
                <v-col> {{ data.payload.networkPoolReference ? data.payload.networkPoolReference.name : '-' }} </v-col>
              </v-row>
              <v-row class="ma-0">
                <v-col class="font-weight-bold grey lighten-4">Maximum Provisioned Network</v-col>
                <v-col>{{ data.payload.networkQuota }}</v-col>
              </v-row>
            </div>

            <div class="d-flex mt-auto align-self-end pt-2">
              <v-row>
                <v-col>
                  <router-link :to="`/organization-detail/${$route.params.organizationid}`"> <v-btn color="#a5b3bf" width="160px" :disabled="isLoadingBtn" class="white--text fz-12 mr-2" depressed height="40"> Cancel </v-btn></router-link>
                  <v-btn v-if="step > 1" class="fz-12 mr-2" color="primary" width="160px" :disabled="isLoadingBtn" depressed outlined height="40" @click="prev()"> Previous </v-btn>
                  <v-btn v-if="step <= 6" class="white--text fz-12" :disabled="isLoadingBtn" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn>
                  <v-btn :disabled="isLoadingBtn" :loading="isLoadingBtn" class="white--text fz-16" color="secondary" height="40" width="160px" @click="finish()"> Finish </v-btn>

                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { ORGVDC } from '../namespace';

export default {
  props: ["step", "data"],
  setup(props, context) {
    const { createOrgVdc } = useNamespacedActions(ORGVDC, ["createOrgVdc"])
    const { isLoadingBtn } = useNamespacedGetters(ORGVDC, ["isLoadingBtn"])

    onMounted(() => {
      // console.log(props.data)
      orgDP.value = JSON.parse(localStorage.getItem("orgDP"))
      console.log(orgDP.value)
    })
    const orgDP = ref()
    const formatDecimal = (data) => {
      if(String(data).includes(".")){
        return data.toFixed(2)
      }
      return data
    }

    const finish = async() => {
      console.log(props.data)
      let payload = {
        // organization: {
        //   ...props.data.organization
        // },
        spOrgId: context.root.$route.params.organizationid,
        payload: {
          dekaprimeRequest: {
          ...props.data.payload
        },
          spRequest: {
            token: localStorage.getItem('token')
          }
        }
      }
      console.log(payload)
      let resp = await createOrgVdc(payload)
      if(resp.status){
        // context.root.$router.replace("/manage-orgvdc");
        context.root.$router.replace(`/organization-detail/${context.root.$route.params.organizationid}`);
      }
    }

    const next = () => {
      // getEdgeConnection(detailInstance.value.Name);
      // console.log(selectedItems.value)
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    return {
      next,
      prev,
      finish,
      formatDecimal,
      isLoadingBtn,
      orgDP
    }
  },
}
</script>