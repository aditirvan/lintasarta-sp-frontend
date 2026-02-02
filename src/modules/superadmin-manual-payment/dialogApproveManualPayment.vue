<template>
  <v-dialog v-model="value" max-width="500">
    <v-card>
      <v-card-title>
        <div
          class="headline font-weight-bold font--text pt-4 pb-1 flex justify-center"
        >
          <v-icon color="warning" class="mr-2">mdi-alert-circle-outline</v-icon>
          Manual Payment
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>
          Are you sure you want to approve manual payments for this
          organization?
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
              color="success"
              block
              height="50"
              depressed
              @click="
                () => {
                  approvePayment(item);
                }
              "
            >
              <beat-loader
                v-if="isLoading"
                :loading="isLoading"
                :color="'white'"
                :size="'10px'"
                style="transform: translateY(3px)"
                class="mr-2"
              ></beat-loader>
              <b>Yes, Approve</b>
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
import { MANUALPAYMENT } from "./namespace";
import {
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";

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
  setup(props, { emit }) {
    const {
      editManualPayment,
      fetchManualPayment,
    } = useNamespacedActions(MANUALPAYMENT, [
      "editManualPayment",
      "fetchManualPayment",
    ]);
    const {
      showErrorToast,
      showSuccessToast,
    } = useNamespacedActions("HOMEPAGE", [
      "showErrorToast",
      "showSuccessToast",
    ]);
    const { isLoading } = useNamespacedState(MANUALPAYMENT, ["isLoading"]);
    const approvePayment = (params: any) => {
      const payload = {
        id: params.id,
        data: {
          status: "true",
        },
      };
      editManualPayment(payload).then(() => {
        fetchManualPayment().then(() => {
          showSuccessToast("Approved success!");
          emit("close");
        });
      });
    };
    return {
      approvePayment,
      isLoading,
    };
  },
});
export default module;
</script>
