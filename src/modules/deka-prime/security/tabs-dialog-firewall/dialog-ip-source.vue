<template>
  <v-dialog persistent v-model="ipSource" max-width="700">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Destination IP Address</h2>
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
          <v-col md="3" class="d-flex align-items-center">Value :</v-col>
          <v-col class="pt-0 mt-0" cols="12" sm="6">
            <v-text-field v-model="dataIp"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <p class="ml-6 mb-0 fz-12 font-weight-light">Leaving this field empty will make this rule apply to any ip</p>

      <v-card-text class="mt-10">
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
    ipSource: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { listRuleFirewallNsxv, payloadRuleFirewallNsxv, detailFirewall } = useNamespacedGetters(DPSECURITY, [
      "listRuleFirewallNsxv",
      "payloadRuleFirewallNsxv",
      "detailFirewall",
    ]);
    const { updateRuleFirewall } = useNamespacedActions(DPSECURITY, ["updateRuleFirewall"]);
    const dataIp = ref("");
    const onCancel = () => {
      context.emit("update:ipSource", false);
      dataIp.value = "";
    };
    const onSubmit = () => {
      const id = context.root.$route.params.idEdge;
      const ip = [dataIp.value];
      if (!detailFirewall.value.source) {
        const object = { ipAddress: ip };
        detailFirewall.value.source = object;
      } else {
        if (detailFirewall.value.source.ipAddress) {
          detailFirewall.value.source.ipAddress.push(dataIp.value);
        } else {
          detailFirewall.value.source.ipAddress = ip;
        }
        // console.log("push data", detailFirewall.value.source.ipAddress);
      }

      context.emit("update:ipSource", false);
      dataIp.value = "";

      // const cek = listRuleFirewallNsxv.value.find((item) => item.ruleId == props.idService);
      // if (!cek.source) {
      //   const object = { ipAddress: ip };
      //   listRuleFirewallNsxv.value.find((item) => item.ruleId == props.idService).source = object;
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
      //       return item.source.ipAddress.push(dataIp.value);
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

      // context.emit("update:ipSource", false);
      // dataIp.value = "";
    };
    return {
      onCancel,
      onSubmit,
      dataIp,
      detailFirewall,
    };
  },
};
</script>

<style lang="scss" scoped></style>
