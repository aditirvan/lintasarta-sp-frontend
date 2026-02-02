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
                  <v-col class="grey lighten-4"> {{ data.organization.name }} </v-col>
                </v-row>
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">Name</v-col>
                  <v-col class="grey lighten-4">{{ data.payload.name }}</v-col>
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
                  <v-col class="font-weight-bold grey lighten-4">Edge Gateway Configuration</v-col>
                  <v-col class="grey lighten-4">{{ data.payload.configuration.gatewayBackingConfig }}</v-col>
                </v-row>
                <!-- <v-divider></v-divider> -->
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">High Availability</v-col>
                  <v-col class="grey lighten-4">
                    <v-icon :color="data.payload.configuration.haEnabled ? 'success' : 'error'">
                      {{ data.payload.configuration.haEnabled ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                    </v-icon>
                    {{ data.payload.configuration.haEnabled ? 'Enabled' : 'Disabled' }}
                  </v-col>
                </v-row>
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">Advanced Gateway</v-col>
                  <v-col class="grey lighten-4">
                    <v-icon :color="data.payload.configuration.advancedNetworkingEnabled ? 'success' : 'error'">
                      {{ data.payload.configuration.advancedNetworkingEnabled ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                    </v-icon>
                    {{ data.payload.configuration.advancedNetworkingEnabled ? 'Enabled' : 'Disabled' }}
                  </v-col>
                </v-row>
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">Distributed Routing</v-col>
                  <v-col class="grey lighten-4">
                    <v-icon :color="data.payload.configuration.distributedRoutingEnabled ? 'success' : 'error'">
                      {{ data.payload.configuration.distributedRoutingEnabled ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                    </v-icon>
                    {{ data.payload.configuration.distributedRoutingEnabled ? 'Enabled' : 'Disabled' }}
                  </v-col>
                </v-row>
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">Default Gateway</v-col>
                  <v-col class="grey lighten-4">{{ data.defaultGateway.enabledConfigure ? data.defaultGateway.externalNetwork.name + `(${data.defaultGateway.defaultGateway.gateway})` : '-' }}</v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p class="font-weight-bold mb-0">External Networks</p>
              <div class="bor-table d-flex flex-column">
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">External Networks</v-col>
                  <v-col class="font-weight-bold grey lighten-4">Subnets</v-col>
                  <v-col class="font-weight-bold grey lighten-4">IP Addresses</v-col>
                </v-row>
                <v-row class="ma-0 bor-table" v-for="(network, key) in data.payload.configuration.gatewayInterfaces.gatewayInterface" :key="key">
                  <v-col> {{ network.name }} </v-col>
                  <v-col>
                    <p class="mb-0 black--text" v-for="(subnet, subkey) in network.subnetParticipation" :key="subkey">
                      {{ `${subnet.gateway}/${subnet.subnetPrefixLength}` }}
                    </p>
                  </v-col>
                  <v-col>
                    <p class="mb-0 black--text" v-for="(subnet, subkey) in network.subnetParticipation" :key="subkey">
                      {{ subnet.ipAddress ? subnet.ipAddress : 'Auto' }}
                    </p>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p class="font-weight-bold mb-0">Allocated IP Pools</p>
              <div class="bor-table d-flex flex-column">
                <v-row class="ma-0 bor-table">
                  <v-col class="font-weight-bold grey lighten-4">External Networks</v-col>
                  <v-col class="font-weight-bold grey lighten-4">Sub-allocated IP Pool</v-col>
                </v-row>
                <v-row class="ma-0 bor-table" v-for="(network, key) in data.payload.configuration.gatewayInterfaces.gatewayInterface" :key="key">
                  <v-col> {{ network.name }} </v-col>
                  <v-col> - </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>

        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}/project/${$route.params.project}`"> <v-btn :disabled="isLoadingBtn" color="#a5b3bf" width="160px" class="white--text fz-12 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" :disabled="isLoadingBtn" class="fz-12 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <!-- <v-btn v-if="step <= 7" class="white--text fz-12" color="primary" width="160px" depressed height="40" @click="next()"> Next </v-btn> -->
              <v-btn :disabled="isLoadingBtn" :loading="isLoadingBtn" class="white--text fz-12" color="secondary" height="40" width="160px" @click="finish"> Finish </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { EDGEGATEWAY } from '../namespace';

export default {
  props: ["step", "data"],
  setup(props, context) {
    const { createEdgeGatewayV } = useNamespacedActions(EDGEGATEWAY, ["createEdgeGatewayV"])
    const { isLoadingBtn,  } = useNamespacedGetters(EDGEGATEWAY, ["isLoadingBtn"])

    onMounted(() => {
      // console.log(props)
    })

    const splitIOrgId = (data) => {
      let href = data
      let replaceHref = href.replace("https://", '')
      let splitHref = replaceHref.split("/")
      // let providerId = splitHref[4]
      return splitHref[4]
    }

    const finish = async() => {
      // console.log(props.data)
      let resp = await createEdgeGatewayV({payload: props.data.payload, orgId: splitIOrgId(props.data.organization.href)})
      if(resp.status){
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

<style lang="scss" scoped>
.bor-table {
  border: 1px solid rgb(2 0 0 / 12%);
}
</style>