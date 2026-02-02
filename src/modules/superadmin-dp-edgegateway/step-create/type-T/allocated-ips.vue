<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Allocated IPs</p> </v-col>
          </v-row>
        </div>

        <div class="d-flex flex-column">
          <v-row >
            <v-col md="2" sm="12">
              <p class="font-weight-bold mt-3">Primary IP</p>
            </v-col>
            <v-col md="6"  sm="12" class="d-flex">
              <v-text-field
              v-model="value.primaryIp"
              placeholder="Insert IP"
              single-line
              outlined
              dense
              @change="
                () => {
                  $v.rule.primaryIp.$touch();
                }
              "
              :error-messages="$v.rule.primaryIp.$errors.length ? $v.rule.primaryIp.$errors[0].$message : ''"
              ></v-text-field>
              <v-tooltip class="" right max-width="45%">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="grey"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="ml-2 pb-2"
                  >
                    mdi-information
                  </v-icon>
                </template>
                <p class="white--text my-1">
                All Edge Gateways require at least one IP address allocated to it. <br />
                This IP address can be used for edge services configuration. <br />
                Not specifying a Primary IP, will result in using the first available IP from the Provider Router.
                </p>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
              :headers="headers"
              :items="value.tier.subnets"
              :items-per-page="100"
              :server-items-length="totalSubnets"
              class="elevation-0 scrollTab"
              hide-default-footer
              item-key="gateway"
              show-expand
              :expanded.sync="expanded"
              >

                <template v-slot:item.ip_block="{ item }">
                  {{ item.gateway + '/' + item.prefixLength }}
                </template>

                <template v-slot:item.providerRouter="{ item }">
                  {{ value.tier.name }}
                </template>

                <template v-slot:item.ip_usage="{ item }">
                  {{ Math.floor(((item.usedIpCount/item.totalIpCount)*100)) }}% {{ `(Total: ${item.totalIpCount})` }}
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                <!-- <template v-slot:item.data-table-expand="{ headers, item, }"> -->
                  <td></td>
                  <td class="d-flex flex-column align-start" style="height: 100%; border-bottom: 0px" >
                    <p class="mb-1 mt-3">Available IPs</p>
                    <div class="" v-for="(availSub, key) in listAvailableIp" :key="key">
                      <div v-if="item.gateway == availSub.gateway">
                        <p class="black--text mb-0" v-for="(ipRange, i) in availSub.ipRanges.values" :key="i"> {{ ipRange.startAddress + ' - '  + ipRange.endAddress }} </p>
                      </div>
                    </div>
                  </td>
                  <td colspan="">
                    <ip-ranges-input v-model="item.inputIpRanges" :listAvailableIp="listAvailableIp" :item="item" />
                  </td>
                </template>

                <!-- <template v-slot:footer="{ props }">
                  <custom-footer-datatable
                  @input="
                    (val) => {
                      changePage(val)
                    }
                  "
                  :props="props" />
                </template> -->
              </v-data-table>
              <!-- <p class="font-italic red--text" v-if="$v.rule.tier.$errors.length">*Please choose the gateway  </p> -->
            </v-col>
          </v-row>
        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}/project/${$route.params.project}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-12 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" class="fz-12 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <v-btn v-if="step <= 6" class="white--text fz-12" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { computed, onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { EDGEGATEWAY } from '../../namespace';
import useVuelidate from '@vuelidate/core';
import { required, minValue,  } from '@vuelidate/validators'
import ipRangesInput from './ip-ranges-input.vue'

export default {
  components: {
    ipRangesInput
  },
  props: ["value", "step", "externalNetwork"],
  setup(props, context) {
    const { fetchAvailableIp } = useNamespacedActions(EDGEGATEWAY, ["fetchAvailableIp"])
    const { isLoading, listAvailableIp, TotalRowsEdgeCluster } = useNamespacedGetters(EDGEGATEWAY, ["isLoading", "listAvailableIp", "TotalRowsEdgeCluster"])
    
    onMounted(async() => {
      // console.log(props)
      externalNetworkId.value = props.value.tier?.id
      options.value = { ...options.value, externalNetworkId: externalNetworkId.value }
      if(props.value?.tier?.id){
        await fetchAvailableIp(options.value)
      }
      // console.log(listAvailableIp.value)
    })

    const externalNetworkId = ref()
    const expanded = ref([])
    const headers = ref([
      { text: "", value: "data-table-expand", sortable: false },
      { text: "IP Block", value: "ip_block", sortable: false },
      { text: "Provider Router", value: "providerRouter", sortable: false },
      { text: "IP Usage", value: "ip_usage", sortable: false },
    ])

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      // providerId: props.provider
    })

    const $v = useVuelidate(
      {
        rule: { 
          primaryIp: { 
            regex: {
              $message: "Invalid ip value",
              $validator: (val) => {
                if(!val){
                  return true
                }else{
                  return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                    val
                  );
                }
              },
            },
          },
        }
      },
      {
        // name, description
        rule: props.value
      })

    const deleteRange = (index) => {
      console.log(index)
      // detailFirewall.value.source.vnicGroupId.splice(index, 1);
    };
    
    const next = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    const totalSubnets = computed(() => {
      let length = props.value.tier?.subnets ? props.value.tier?.subnets?.length : 0
      return length
    })
    return{
      prev,
      next,
      headers,
      expanded,
      listAvailableIp,
      deleteRange,
      $v,
      totalSubnets
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  // font-weight: bold;
  font-size: 12px !important;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 14px !important;
}
</style>