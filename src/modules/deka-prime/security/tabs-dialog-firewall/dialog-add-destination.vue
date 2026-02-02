<template>
  <v-dialog persistent v-model="objectDestination" max-width="600">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Select Object</h2>
          </v-card-text>
        </v-col>
        <v-col class="pt-0">
          <v-card-text>
            <div class="d-flex justify-end mb-4">
              <span class="cursor-pointer" @click="onCancel()"><v-icon color="red">mdi-close-circle</v-icon></span>
            </div>
          </v-card-text>
        </v-col>
      </v-row>

      <v-card-text>
        <v-row>
          <v-col md="4" class="d-flex align-items-center">Browse objects of type</v-col>
          <v-col class="pt-0 mt-0" md="4">
            <v-select :items="dataObject" v-model="selectObject" item-text="name" item-value="value" @change="changeObject()"></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <p class="ml-6 mb-0 fz-12 font-weight-light mb-5">Gateway Interfaces</p>

      <v-row class="ma-4">
        <v-col md="8"
          ><v-card class="scroll" max-width="300" :loading="loadingObject"
            ><div v-if="listObject.length == 0" class="d-flex justify-center mt-10">Data not available</div>
            <v-list dense v-else>
              <v-list-item-group v-model="selectedItem" color="primary" multiple>
                <v-list-item v-for="(item, i) in listObject" :key="i" :value="item">
                  <v-list-item-icon>
                    <v-icon small>mdi-wan</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list> </v-card
        ></v-col>
        <!-- <v-col md="2">
          <v-col
            ><v-btn block color="primary" outlined :disabled="selectedFilterItem == 0" @click="removeObject()"
              ><v-icon small>mdi-arrow-left-bold</v-icon></v-btn
            ></v-col
          ><v-col
            ><v-btn block color="primary" outlined @click="pushObject()" :disabled="selectedItem == 0"
              ><v-icon small>mdi-arrow-right-bold</v-icon></v-btn
            ></v-col
          ></v-col
        > -->

        <!-- <v-col md="5"
          ><v-card class="scroll" max-width="300">
            <v-list dense>
              <v-list-item-group v-model="selectedFilterItem" color="primary" multiple>
                <v-list-item v-for="(item, i) in listFilterObject" :key="i" :value="item.name">
                  <v-list-item-icon>
                    <v-icon small>mdi-wan</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list> </v-card
        ></v-col> -->
      </v-row>

      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="4">
            <v-btn class="white--text" color="#a5b3bf" block height="35" @click="onCancel()"> Cancel </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="4">
            <v-btn color="secondary" block height="35" @click="onSubmit()"> Confirm </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { onMounted, ref } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPSECURITY } from "../namespace";
export default {
  props: {
    objectDestination: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { getObjectBrowser, updateRuleFirewall } = useNamespacedActions(DPSECURITY, ["getObjectBrowser", "updateRuleFirewall"]);
    const { listObject, loadingObject, listRuleFirewallNsxv, payloadRuleFirewallNsxv, detailFirewall } = useNamespacedGetters(DPSECURITY, [
      "listObject",
      "loadingObject",
      "listRuleFirewallNsxv",
      "payloadRuleFirewallNsxv",
      "detailFirewall",
    ]);
    onMounted(async () => {
      const params = {
        idEdge: context.root.$route.params.idEdge,
        object: selectObject.value,
      };
      await getObjectBrowser(params);
    });
    const dataObject = ref([
      { id: 1, name: "Gateway Interfaces", value: "gatewayinterface" },
      { id: 2, name: "Virtual Machines", value: "virtualmachine" },
      { id: 3, name: "Org Vdc Networks", value: "orgvdcnetwork" },
      { id: 4, name: "IP Sets", value: "ipset" },
      { id: 5, name: "Security Groups", value: "securitygroup" },
    ]);
    const listFilterObject = ref([]);
    const selectedFilterItem = ref([]);
    const selectedItem = ref([]);
    const selectObject = ref("gatewayinterface");
    const sourcePort = ref("");
    const destinationPort = ref("");
    const onCancel = () => {
      context.emit("update:objectDestination", false);
      // listFilterObject.value = [];
      selectedItem.value = [];
    };
    const onSubmit = () => {
      const id = context.root.$route.params.idEdge;
      const desti = selectedItem.value.map((item) => {
        return Object.assign({}, ...item.requiredProperties);
      });
      const desti2 = desti.map((item) => {
        return item["value"];
      });

      if (!detailFirewall.value.destination) {
        if (desti[0].name == "vnicGroupId") {
          const object = { vnicGroupId: desti2 };
          detailFirewall.value.destination = object;
        } else if (desti[0].name == "groupingObjectId") {
          const object = { groupingObjectId: desti2 };
          detailFirewall.value.destination = object;
        }
      } else {
        if (desti[0].name == "vnicGroupId") {
          if (detailFirewall.value.destination.vnicGroupId) {
            detailFirewall.value.destination.vnicGroupId.push(desti2.toString());
          } else {
            // const object = { vnicGroupId: desti2 };
            detailFirewall.value.destination.vnicGroupId = desti2;
          }
        } else if (desti[0].name == "groupingObjectId") {
          if (detailFirewall.value.destination.groupingObjectId) {
            detailFirewall.value.destination.groupingObjectId.push(desti2.toString());
          } else {
            // const object = { groupingObjectId: desti2 };
            detailFirewall.value.destination.groupingObjectId = desti2;
          }
        }
      }

      context.emit("update:objectDestination", false);
      selectedItem.value = [];

      // const cek = listRuleFirewallNsxv.value.find((item) => item.ruleId == props.idService);
      // if (!cek.destination) {
      //   const object = { vnicGroupId: desti2 };
      //   listRuleFirewallNsxv.value.find((item) => item.ruleId == props.idService).destination = object;
      //   const params = {
      //     featureType: payloadRuleFirewallNsxv.value.featureType,
      //     version: payloadRuleFirewallNsxv.value.version,
      //     enabled: payloadRuleFirewallNsxv.value.enabled,
      //     defaultPolicy: payloadRuleFirewallNsxv.value.defaultPolicy,
      //     globalConfig: payloadRuleFirewallNsxv.value.globalConfig,
      //     firewallRules: {
      //       firewallRules: listRuleFirewallNsxv.value,
      //     },
      //   };
      //   updateRuleFirewall({ id: id, params: params });
      // } else {
      //   listRuleFirewallNsxv.value.find((item) => {
      //     if (item.ruleId == props.idService) {
      //       return item.destination.vnicGroupId.push(desti2.toString());
      //     }
      //   });
      //   const params = {
      //     featureType: payloadRuleFirewallNsxv.value.featureType,
      //     version: payloadRuleFirewallNsxv.value.version,
      //     enabled: payloadRuleFirewallNsxv.value.enabled,
      //     defaultPolicy: payloadRuleFirewallNsxv.value.defaultPolicy,
      //     globalConfig: payloadRuleFirewallNsxv.value.globalConfig,
      //     firewallRules: {
      //       firewallRules: listRuleFirewallNsxv.value,
      //     },
      //   };
      //   updateRuleFirewall({ id: id, params: params });
      // }
      // context.emit("update:objectDestination", false);
      // listFilterObject.value = [];
      // selectedItem.value = [];
    };
    const changeObject = async () => {
      const params = {
        idEdge: context.root.$route.params.idEdge,
        object: selectObject.value,
      };
      await getObjectBrowser(params);
    };

    const pushObject = () => {
      listFilterObject.value = selectedItem.value.map((item) => {
        return item;
      });
    };

    const removeObject = () => {
      listFilterObject.value = listFilterObject.value.filter((item) => {
        return !selectedFilterItem.value.includes(item.name);
      });

      selectedItem.value = selectedItem.value.filter((item) => {
        return !selectedFilterItem.value.includes(item.name);
      });
    };
    return {
      onCancel,
      onSubmit,
      changeObject,
      pushObject,
      removeObject,
      sourcePort,
      listObject,
      selectObject,
      destinationPort,
      selectedItem,
      dataObject,
      loadingObject,
      listFilterObject,
      selectedFilterItem,
      listRuleFirewallNsxv,
      payloadRuleFirewallNsxv,
    };
  },
};
</script>

<style lang="scss" scoped>
.scroll {
  height: 230px;
  overflow-y: auto;
  // box-shadow: none !important;
  overflow-x: hidden;
  // background-color: transparent;
}
</style>
