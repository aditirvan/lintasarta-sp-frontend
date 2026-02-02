<template>
  <v-dialog persistent v-model="deleteRule" max-width="400">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Delete Rule</h2>
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
          <p class="mb-0 text-h7">This action cannot be undone. This will permanently delete the Rule.</p>
          <p class="text-h7">I understand the consequences, delete this Rule.</p>
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
import { DPSECURITY } from "../../namespace";
export default {
  props: {
    deleteRule: {
      type: Boolean,
      default: false,
    },
    move: {
      type: Boolean,
      default: false,
    },
    idDelete: {
      type: String,
      default: '',
    },
    idIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const { updateRuleFirewallNsxt } = useNamespacedActions(DPSECURITY, ["updateRuleFirewallNsxt"]);
    const { listRuleFirewallNsxt } = useNamespacedGetters(DPSECURITY, ["listRuleFirewallNsxt"]);

    const onCancel = () => {
      context.emit("update:deleteRule", false);
    };
    const onSubmit = () => {
      const id = context.root.$route.params.idEdge;
      listRuleFirewallNsxt.value.splice(props.idIndex, 1);
      let userData = listRuleFirewallNsxt.value.filter( x => x.id != 'default_rule')
      let defaultData = listRuleFirewallNsxt.value.filter( x => x.id == 'default_rule')

      const params = {
        defaultRules: defaultData,
        userDefinedRules: userData
      };
      console.log('params', params)
      updateRuleFirewallNsxt({ id: id, params: params });
      context.emit("update:deleteRule", false);
      context.emit("update:move", false);
    };
    return {
      onCancel,
      onSubmit,
      listRuleFirewallNsxt,
    };
  },
};
</script>

<style lang="scss" scoped></style>
