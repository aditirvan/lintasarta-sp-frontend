<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="12" class="pt-0 pb-0 d-flex">
              <p class="font-weight-bold fz-16">Ready to Complete</p>
              <v-spacer></v-spacer>
              <!-- <v-text-field
                class="search mr-2"
                placeholder="Search Organization"
                outlined
                hide-details
                style="max-width: 200px;"
                v-model="searchOrg"
                clearable
                dense
                ></v-text-field> -->
            </v-col>
          </v-row>
        </div>

        <div class="d-flex flex-column">
          <v-row>
            <v-col>
              <p class="font-weight-bold mb-0">General</p>
              <div class="bor-table d-flex flex-column">
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">Site</v-col>
                  <v-col class="grey lighten-4">iaas.lintasarta.net</v-col>
                </v-row>
                <!-- <v-divider></v-divider> -->
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">Organization VDC</v-col>
                  <v-col class="grey lighten-4"> {{ data.org.orgVdc.name }} </v-col>
                </v-row>
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">Name</v-col>
                  <v-col class="grey lighten-4"> {{ data.payload.name }} </v-col>
                </v-row>
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">Description</v-col>
                  <v-col class="grey lighten-4"> {{ data.payload.description }} </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p class="font-weight-bold mb-0">Configuration</p>
              <div class="bor-table d-flex flex-column">
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">Dedicate External Network</v-col>
                  <v-col class="grey lighten-4"> {{ data.payload.edgeGatewayUplinks[0].dedicated ? 'Yes' : 'No' }} </v-col>
                </v-row>
                <!-- <v-divider></v-divider> -->
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">External Network</v-col>
                  <v-col class="grey lighten-4"> {{ data.externalNetwork.name }} </v-col>
                </v-row>
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4 pb-1">Subnets</v-col>
                  <v-col class="grey lighten-4 pb-1"> {{ data.payload.edgeGatewayUplinks[0].subnets.values[0].gateway + '/' + data.payload.edgeGatewayUplinks[0].subnets.values[0].prefixLength}} </v-col>
                </v-row>
                <v-row class="ma-0 bor-table"  v-for="(item, key) in data.payload.edgeGatewayUplinks[0].subnets.values" :key="key">
                  <v-col v-if="key != 0" class="grey lighten-4"></v-col>
                  <v-col v-if="key != 0"  class="grey lighten-4 py-0">
                    {{ item.gateway +'/'+ item.prefixLength }}
                  </v-col>
                </v-row>
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">Edge Cluster</v-col>
                  <v-col class="grey lighten-4"> {{ data.edgeCluster.edgeType == 'specific'? data.edgeCluster.edgeCluster.name : '-' }} </v-col>
                </v-row>
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4 pb-1">Allocated IPs</v-col>
                  <v-col class="grey lighten-4 pb-1"> {{ !data.allocatedIps.allocatedIps.length ? '-' : data.allocatedIps.allocatedIps[0].startAddress + ' - ' + data.allocatedIps.allocatedIps[0].endAddress }}  </v-col>
                </v-row>
                <v-row class="ma-0 bor-table"  v-for="(item, i) in data.allocatedIps.allocatedIps" :key="item.startAddress">
                  <v-col v-if="i != 0" class="grey lighten-4"></v-col>
                  <v-col v-if="i != 0"  class="grey lighten-4 py-0">
                    {{ item.startAddress + ' - ' + item.endAddress }}
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}/project/${$route.params.project}`"> <v-btn :disabled="isLoadingBtn" color="#a5b3bf" width="160px" class="white--text fz-12 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" :disabled=isLoadingBtn class="fz-12 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <!-- <v-btn v-if="step <= 7" class="white--text fz-12" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn> -->
              <v-btn :loading="isLoadingBtn" :disabled="isLoadingBtn" class="white--text fz-12" color="secondary" height="40" width="160px" @click="finish"> Finish </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted } from '@vue/composition-api';
import { EDGEGATEWAY } from '../../namespace';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';

export default {
  props: ["step", "data"],
  setup(props, context) {
    const { createEdgeGatewayT } = useNamespacedActions(EDGEGATEWAY, ["createEdgeGatewayT"])
    const { isLoadingBtn,  } = useNamespacedGetters(EDGEGATEWAY, ["isLoadingBtn"])

    onMounted(() => {
      // console.log(props.data)
    })

    const finish = async() => {
      console.log(props.data)
      let resp = await createEdgeGatewayT(props.data.payload)
      if(resp.status){
      //   context.root.$router.replace("/manage-edge");
        context.root.$router.replace(`/organization-detail/${context.root.$route.params.organizationid}/project/${context.root.$route.params.project}`);
      }
    }

    const next = () => {
      // console.log(props.value)
      // $v.value.$touch();
      // if ($v.value.$errors.length) return

      // context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    
    return{
      prev, 
      next,
      finish,
      isLoadingBtn
    }
  },
}
</script>