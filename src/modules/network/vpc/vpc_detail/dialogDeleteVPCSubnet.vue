<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete VPC Subnet
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure you delete this vpc subnet ?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              @click="
                () => {
                  $emit('input', false);
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="error"
              block
              height="50"
              depressed
              @click="
                () => {
                  $emit('delete', selectedVPCSubnet.id);
                }
              "
              :disabled="isLoading"
            >
              <beat-loader v-if="isLoading" size="10px" color="white" :loading="isLoading"/>
              <span v-else>
                Delete
              </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from 'vuex-composition-helpers'
import { NETWORKVPC } from '../namespace'
export default {
  props: ["value", 'selectedVPCSubnet'],
  setup(props, { root }){
    const {
      isLoading,
    } = useNamespacedState(NETWORKVPC, [
      "isLoading",
    ])

    return {
      isLoading,
    }
  },
  computed: {
    dialog: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>