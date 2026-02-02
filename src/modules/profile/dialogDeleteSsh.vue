<template>
  <v-dialog v-model="value" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete this Ssh key
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure you delete this Ssh key?</p>
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
                  deletessh(sshId, userId);
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
              <b v-else>Yes</b>
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

const module = defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    sshId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { deletesshkey, fetchsshkeys } = useNamespacedActions("PROFILE", [
      "deletesshkey",
      "fetchsshkeys",
    ]);
    const { isLoading } = useNamespacedState("PROFILE", ["isLoading"]);
    const { showSuccessToast } = useNamespacedActions("HOMEPAGE", [
      "showSuccessToast",
    ]);
    const deletessh = (sshId: String, userId: String) => {
      deletesshkey(sshId).then(() => {
        fetchsshkeys(userId);
        showSuccessToast("Keypair success deleted");
        emit("close");
      });
    };
    return {
      isLoading,
      deletessh,
    };
  },
});
export default module;
</script>
