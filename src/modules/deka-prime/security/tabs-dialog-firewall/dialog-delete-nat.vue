<template>
  <v-dialog persistent v-model="dialogDelete" max-width="400">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Delete NAT</h2>
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
          <p class="mb-0 text-h7">This action cannot be undone. This will permanently delete the NAT.</p>
          <p class="text-h7">I understand the consequences, delete this NAT.</p>
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
    dialogDelete: {
      type: Boolean,
      default: false,
    },
    move: {
      type: Boolean,
      default: false,
    },
    idIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const { listRuleNatNsxv, payloadRuleNat } = useNamespacedGetters(DPSECURITY, ["listRuleNatNsxv", "payloadRuleNat"]);
    const { updateRuleNatNsxv } = useNamespacedActions(DPSECURITY, ["updateRuleNatNsxv"]);

    const onCancel = () => {
      context.emit("update:dialogDelete", false);
    };
    const onSubmit = () => {
      const id = context.root.$route.params.idEdge;
      listRuleNatNsxv.value.splice(props.idIndex, 1);

      const params = {
        enabled: payloadRuleNat.value.enabled,
        featureType: payloadRuleNat.value.featureType,
        version: payloadRuleNat.value.version,
        nat64Rules: {},
        rules: {
          natRulesDtos: listRuleNatNsxv.value,
        },
      };
      updateRuleNatNsxv({ id: id, params: params });
      context.emit("update:dialogDelete", false);
      context.emit("update:move", false);
    };
    return {
      onCancel,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped></style>
