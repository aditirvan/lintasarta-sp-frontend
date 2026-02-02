<template>
  <v-dialog persistent v-model="editName" max-width="400">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Edit Name</h2>
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
          <v-text-field :value="dataEdit.name" @input="inputName = $event"></v-text-field>
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
    editName: {
      type: Boolean,
      default: false,
    },
    dataEdit: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { updateRuleFirewall } = useNamespacedActions(DPSECURITY, ["updateRuleFirewall"]);
    const { payloadRuleFirewallNsxv, listRuleFirewallNsxv } = useNamespacedGetters(DPSECURITY, ["payloadRuleFirewallNsxv", "listRuleFirewallNsxv"]);

    const onCancel = () => {
      context.emit("update:editName", false);
    };
    const inputName = ref("");
    const onSubmit = () => {
      const id = context.root.$route.params.idEdge;

      listRuleFirewallNsxv.value.find((item) => {
        if (item.ruleId == props.dataEdit.ruleId) {
          return (item.name = inputName.value);
        }
      });

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
      updateRuleFirewall({ id: id, params: params });
      context.emit("update:editName", false);
    };
    return {
      onCancel,
      onSubmit,
      inputName,
    };
  },
};
</script>

<style lang="scss" scoped></style>
