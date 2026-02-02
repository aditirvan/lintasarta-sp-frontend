<template>
  <v-dialog v-model="value" max-width="500">
    <v-card>
      <v-card-title>
        <div
          class="headline font-weight-bold font--text pb-4 d-flex justify-center"
        >
          <v-icon color="warning" class="mr-2">mdi-alert-circle-outline</v-icon>
          Looks like your email failed to send
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p class="font-weight-bold mb-2">Do you want to resend your email?</p>
        <p>
          The email will be sent to the registered email address, so double
          check whether your email address is correct or not
        </p>
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
              @click="$emit('submit', item)"
            >
              <beat-loader
                v-if="isLoading"
                :loading="isLoading"
                :color="'white'"
                :size="'10px'"
                style="transform: translateY(3px)"
                class="mr-2"
              ></beat-loader>
              <b>Resend</b>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { ref } from "@vue/composition-api";
import {
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { SUPERADMINMANAGEMAILBOX } from "./namespace";

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
  setup(props) {
    const { isLoading } = useNamespacedState(SUPERADMINMANAGEMAILBOX, [
      "isLoading",
    ]);
    return {
      isLoading,
    };
  },
});
export default module;
</script>
