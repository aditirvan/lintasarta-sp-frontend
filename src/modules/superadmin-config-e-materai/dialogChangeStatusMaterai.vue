<template>
  <div>
    <v-dialog v-model="value" max-width="500">
      <v-card>
        <v-card-title>
          <div class="headline font-weight-bold font--text pt-4 pb-1">
            {{ item.status == 0 ? "Activated" : "Deactivated" }} E-Materai
            {{ item.stamp_code }}
          </div>
        </v-card-title>
        <v-card-text class="pb-0">
          <p>Are you sure you want to proceed? *only one can be used</p>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn
                color="accent"
                block
                depressed
                height="50"
                @click="$emit('close', $event)"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="secondary"
                block
                height="50"
                depressed
                @click="$emit('confirm', item)"
              >
                <beat-loader
                  v-if="isLoading"
                  :loading="isLoading"
                  :color="'white'"
                  :size="'10px'"
                  style="transform: translateY(3px)"
                  class="mr-2"
                ></beat-loader>
                <b>Confirm</b>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { EMATERAI } from "./namespace";
import { useNamespacedState } from "vuex-composition-helpers";

const module = defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  setup() {
    const { isLoading } = useNamespacedState(EMATERAI, ["isLoading"]);
    return {
      isLoading,
    };
  },
});
export default module;
</script>
