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
          <v-container fluid class="px-7 py-4">
            <v-card-text class="pb-0 pt-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Scope</p> </v-col>
              </v-row>
            </v-card-text>

            <div class="bor-table">
              <v-row class="ma-0">
                <v-col>Site</v-col>
                <v-col>{{ getScope(detailInstance.HREF) }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Scope</v-col>
                <v-col>{{ detailInstance.Name }}</v-col>
              </v-row>
            </div>

            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"><p class="font-weight-bold fz-16">General</p> </v-col>
              </v-row>
            </v-card-text>

            <div class="bor-table">
              <v-row class="ma-0">
                <v-col>Name</v-col><v-col>{{ dataGeneral.generalName }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Description</v-col><v-col>{{ dataGeneral.generalDesc }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Network Type</v-col><v-col>{{ dataNetwork == "NAT_ROUTED" ? "Routed" : "Isolated" }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Shared</v-col><v-col>{{ dataGeneral.generalShared == true ? "Yes" : "No" }}</v-col>
              </v-row>
              <v-divider v-if="dataNetwork == 'NAT_ROUTED'"></v-divider>
              <v-row class="ma-0" v-if="dataNetwork == 'NAT_ROUTED'">
                <v-col>Connection</v-col> <v-col>{{ dataEdge.connectionName }}</v-col>
              </v-row>
              <v-divider v-if="dataNetwork == 'NAT_ROUTED'"></v-divider>
              <v-row class="ma-0" v-if="dataNetwork == 'NAT_ROUTED'">
                <v-col>Connection Type</v-col><v-col>{{ dataEdge.selectConnection }}</v-col>
              </v-row>
              <v-divider v-if="dataNetwork == 'NAT_ROUTED'"></v-divider>
              <v-row class="ma-0" v-if="dataNetwork == 'NAT_ROUTED'">
                <v-col>Guest VLAN Allowed</v-col><v-col>{{ dataEdge.guestVlan == true ? "Yes" : "No" }}</v-col>
              </v-row>
            </div>

            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Gateway CIDR</p> </v-col>
              </v-row>
            </v-card-text>

            <div class="bor-table">
              <!-- <v-row class="ma-0"> <v-col>Dual Stack Mode</v-col><v-col>No</v-col> </v-row>
              <v-divider></v-divider> -->
              <v-row class="ma-0">
                <v-col>Gateway CIDR</v-col><v-col>{{ dataGeneral.generalGatewayCidr }}</v-col>
              </v-row>
            </div>

            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Static IP Pools</p> </v-col>
              </v-row>
            </v-card-text>

            <div class="bor-table">
              <v-row class="ma-0">
                <v-col>Static IP Pools</v-col
                ><v-col v-if="dataStatic.length != 0"
                  ><div v-for="(row, index) in dataStatic" :key="index">{{ row.startAddress }} - {{ row.endAddress }}</div></v-col
                >
                <v-col v-else><div>-</div></v-col>
              </v-row>
            </div>

            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"><p class="font-weight-bold fz-16">DNS</p> </v-col>
              </v-row>
            </v-card-text>

            <div class="bor-table">
              <v-row class="ma-0">
                <v-col>Primary DNS</v-col><v-col>{{ dataDns.primaryDns || "-" }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Secondary DNS</v-col><v-col>{{ dataDns.secondaryDns || "-" }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>DNS suffix</v-col><v-col>{{ dataDns.suffixDns || "-" }}</v-col>
              </v-row>
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-card-text>
      <v-row class="d-flex justify-end">
        <v-col cols="3">
          <router-link to="/networking"> <v-btn color="#a5b3bf" class="white--text fz-16" block height="40"> Cancel </v-btn></router-link>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3" v-if="step > 1">
          <v-btn class="fz-16" color="secondary" block outlined height="40" @click="prev()"> Previous </v-btn>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3">
          <v-btn class="white--text fz-16" color="secondary" block height="40" @click="finish()" :loading="isLoadingCreate"> Finish </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPNETWORK } from "../../namespace";

export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
    dataDns: {
      type: Object,
      default: () => {},
    },
    dataStatic: {
      type: Array,
      default: () => [],
    },
    dataNetwork: {
      type: String,
      default: "",
    },
    dataGeneral: {
      type: Object,
      default: () => {},
    },
    dataEdge: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { postCreateNetwork } = useNamespacedActions(DPNETWORK, ["postCreateNetwork"]);
    const { isLoadingCreate, detailInstance } = useNamespacedGetters(DPNETWORK, ["isLoadingCreate", "detailInstance"]);
    const finish = () => {
      const dataSubmit = {
        connection: {
          connectionType: props.dataEdge.selectConnection,
          connectionTypeValue: props.dataEdge.selectConnection,
          routerRef: {
            id: props.dataEdge.idGateway,
            name: props.dataEdge.connectionName,
          },
        },
        description: props.dataGeneral.generalDesc,
        enableDualSubnetNetwork: false,
        guestVlanTaggingAllowed: props.dataEdge.guestVlan,
        name: props.dataGeneral.generalName,
        networkType: props.dataNetwork,
        ownerRef: {
          id: props.dataEdge.idVdc,
          name: detailInstance.value.Name,
        },
        shared: props.dataGeneral.generalShared,
        subnets: {
          values: [
            {
              dnsServer1: props.dataDns.primaryDns,
              dnsServer2: props.dataDns.secondaryDns,
              dnsSuffix: props.dataDns.suffixDns,
              gateway: props.dataGeneral.generalGatewayIp,
              ipRanges: {
                values: props.dataStatic,
              },
              prefixLength: props.dataGeneral.generalPrefixIp,
            },
          ],
        },
      };

      const dataSubmitIsolated = {
        ownerRef: {
          id: detailInstance.value.ID,
          name: detailInstance.value.Name,
        },
        name: props.dataGeneral.generalName,
        description: props.dataGeneral.generalDesc,
        networkType: props.dataNetwork,
        shared: props.dataGeneral.generalShared,
        subnets: {
          values: [
            {
              dnsServer1: props.dataDns.primaryDns,
              dnsServer2: props.dataDns.secondaryDns,
              dnsSuffix: props.dataDns.suffixDns,
              gateway: props.dataGeneral.generalGatewayIp,
              ipRanges: {
                values: props.dataStatic,
              },
              prefixLength: props.dataGeneral.generalPrefixIp,
            },
          ],
        },
        enableDualSubnetNetwork: false,
      };

      if (props.dataNetwork == "NAT_ROUTED") {
        postCreateNetwork(dataSubmit);
      } else {
        postCreateNetwork(dataSubmitIsolated);
      }
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    const getScope = (item) => {
      const string = item;
      const pattern = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      const hasil = string.match(pattern);
      const site = hasil[3];
      return site;
    };

    return {
      finish,
      prev,
      isLoadingCreate,
      stop,
      detailInstance,
      getScope,
    };
  },
};
</script>

<style lang="scss" scoped>
.bor-table {
  border: 1px solid rgb(2 0 0 / 12%);
}
</style>
