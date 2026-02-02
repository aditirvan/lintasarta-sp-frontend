<template>
  <v-dialog persistent v-model="deleteSource" max-width="400">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Delete Service</h2>
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
          <p class="mb-0 text-h7">This action cannot be undone. This will permanently delete the source.</p>
          <p class="text-h7">I understand the consequences, delete this Source.</p>
        </div>
      </v-card-text>

      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="4">
            <v-btn class="white--text" color="#a5b3bf" block height="35" @click="onCancel()"> Cancel </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="4">
            <v-btn color="error" block height="35" @click="onSubmit()"> Confirm </v-btn>
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
    deleteSource: {
      type: Boolean,
      default: false,
    },
    idDelete: {
      type: Number,
      default: 0,
    },
    idService: {
      type: Number,
      default: 0,
    },
    action: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const { updateRuleFirewall } = useNamespacedActions(DPSECURITY, ["updateRuleFirewall"]);
    const { payloadRuleFirewallNsxv, listRuleFirewallNsxv } = useNamespacedGetters(DPSECURITY, ["payloadRuleFirewallNsxv", "listRuleFirewallNsxv"]);

    const onCancel = () => {
      context.emit("update:deleteSource", false);
    };
    const onSubmit = () => {
      const id = context.root.$route.params.idEdge;
      listRuleFirewallNsxv.value.find((item) => {
        if (item.ruleId == props.idService) {
          if (props.action == "vnic") {
            return item.source.vnicGroupId.splice(props.idDelete, 1);
          } else if (props.action == "ip") {
            return item.source.ipAddress.splice(props.idDelete, 1);
          }
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
      context.emit("update:deleteSource", false);
    };
    return {
      onCancel,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped></style>
