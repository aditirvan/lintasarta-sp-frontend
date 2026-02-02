<template>
  <v-dialog persistent v-model="addService" max-width="700">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Add Service</h2>
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
          <v-col md="3" class="d-flex align-items-center">Protocol</v-col>
          <v-col class="pt-0 mt-0" cols="12" sm="6">
            <v-select :items="listProtocol" v-model="selectProtocol" item-text="name" item-value="value"></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Source Port</v-col>
          <v-col class="pt-0 mt-0" cols="12" sm="6">
            <v-text-field v-model="sourcePort" placeholder="Any"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <p class="ml-6 mb-0 fz-12 font-weight-light">Leaving this field empty will make this rule apply to any port</p>
      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Destination Port</v-col>
          <v-col class="pt-0 mt-0" cols="12" sm="6">
            <v-text-field v-model="destinationPort" placeholder="Any"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

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
import { ref } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPSECURITY } from "../namespace";
export default {
  props: {
    addService: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { updateRuleFirewall, getListFirewallRuleNsxv } = useNamespacedActions(DPSECURITY, ["updateRuleFirewall", "getListFirewallRuleNsxv"]);
    const { payloadRuleFirewallNsxv, listRuleFirewallNsxv, detailFirewall } = useNamespacedGetters(DPSECURITY, [
      "payloadRuleFirewallNsxv",
      "listRuleFirewallNsxv",
      "detailFirewall",
    ]);
    const listProtocol = ref([
      { id: 1, name: "TCP", value: "tcp" },
      { id: 2, name: "UDP", value: "udp" },
      { id: 3, name: "ICMP", value: "icmp" },
      { id: 4, name: "Any", value: "any" },
    ]);
    const selectProtocol = ref("any");
    const sourcePort = ref("any");
    const destinationPort = ref("any");
    const onCancel = () => {
      context.emit("update:addService", false);
      selectProtocol.value = "any";
      destinationPort.value = "any";
      sourcePort.value = "any";
    };
    const onSubmit = () => {
      const id = context.root.$route.params.idEdge;

      const dataService = {
        protocol: selectProtocol.value,
        port: [destinationPort.value],
        sourcePort: [sourcePort.value],
      };

      if (!detailFirewall.value.application) {
        const object = { service: [] };
        const xxx = object.service.push(dataService);
        detailFirewall.value.application = object;
      } else {
        // console.log("push data", detailFirewall.value.application.vnicGroupId);
        detailFirewall.value.application.service.push(dataService);
      }

      context.emit("update:addService", false);
      selectProtocol.value = "any";
      destinationPort.value = "any";
      sourcePort.value = "any";

      // const cek = listRuleFirewallNsxv.value.find((item) => item.ruleId == props.idService);
      // if (!cek.application) {
      //   const object = { service: [] };
      //   const xxx = object.service.push(dataService);
      //   listRuleFirewallNsxv.value.find((item) => item.ruleId == props.idService).application = object;
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
      //       return item.application.service.push(dataService);
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
      // context.emit("update:addService", false);
      // selectProtocol.value = "any";
      // destinationPort.value = "any";
      // sourcePort.value = "any";
    };
    return {
      onCancel,
      onSubmit,
      updateRuleFirewall,
      selectProtocol,
      listProtocol,
      sourcePort,
      destinationPort,
      payloadRuleFirewallNsxv,
      listRuleFirewallNsxv,
      getListFirewallRuleNsxv,
      detailFirewall,
    };
  },
};
</script>

<style lang="scss" scoped></style>
