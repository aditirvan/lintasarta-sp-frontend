<template>
  <v-dialog v-model="value" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pt-4 pb-1">
          Delete E-Materai {{ item.stamp_code }}
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure you want to proceed?</p>
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
              color="error"
              block
              height="50"
              depressed
              @click="
                () => {
                  deleteMaterai(item);
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
              <b>Confirm</b>
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
import { EMATERAI } from "./namespace";
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
    const { deleteStamp, fetchStamps } = useNamespacedActions(EMATERAI, [
      "deleteStamp",
      "fetchStamps",
    ]);
    const { showErrorToast, showSuccessToast } = useNamespacedActions(
      "HOMEPAGE",
      ["showErrorToast", "showSuccessToast"]
    );
    const { isLoading } = useNamespacedState(EMATERAI, ["isLoading"]);
    const deleteMaterai = (params: any) => {
      if (params.status === 1) {
        showErrorToast("Can not delete e-materai because it is still actived");
        emit("close");
      } else {
        deleteStamp(params.id).then(() => {
          emit("success");
        });
      }
    };
    return {
      deleteMaterai,
      isLoading,
    };
  },
});
export default module;
</script>
