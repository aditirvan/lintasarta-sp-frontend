<template>
  <v-dialog persistent v-model="newRule" max-width="400">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Add Rule</h2>
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
        <div class="text-center mt-2">
          <p class="mb-0 text-h7">This action cannot be undone. This will permanently create the Rule.</p>
          <p class="text-h7">I understand the consequences, create this Rule.</p>
        </div>
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
    newRule: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { updateRuleFirewallNsxv } = useNamespacedActions(DPSECURITY, ["updateRuleFirewallNsxv"]);
    const { payloadRuleFirewallNsxv, listRuleFirewallNsxv } = useNamespacedGetters(DPSECURITY, ["payloadRuleFirewallNsxv", "listRuleFirewallNsxv"]);

    const onCancel = () => {
      context.emit("update:newRule", false);
    };
    const onSubmit = () => {
      const id = context.root.$route.params.idEdge;
      const data = {
        name: "New Rule",
        ruleType: "user",
        enabled: true,
        loggingEnabled: false,
        action: "accept",
      };
      listRuleFirewallNsxv.value.push(data);

      const params = {
        featureType: payloadRuleFirewallNsxv.value.featureType,
        version: payloadRuleFirewallNsxv.value.version,
        enabled: payloadRuleFirewallNsxv.value.enabled,
        defaultPolicy: payloadRuleFirewallNsxv.value.defaultPolicy,
        globalConfig: payloadRuleFirewallNsxv.value.globalConfig,
        firewallRules: {
          firewallRules: listRuleFirewallNsxv.value,
        },
      };
      updateRuleFirewallNsxv({ id: id, params: params });
      context.emit("update:newRule", false);
    };
    return {
      onCancel,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped></style>
