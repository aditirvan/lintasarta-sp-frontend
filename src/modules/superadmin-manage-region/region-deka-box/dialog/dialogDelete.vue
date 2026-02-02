<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">Delete Region</div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure you delete this region ?</p>
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
                  $emit('delete', selectedRegion.id);
                }
              "
              :disabled="isRegionLoading"
            >
              <beat-loader v-if="isRegionLoading" size="10px" color="white" :loading="isRegionLoading" />
              <span v-else> Delete </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useNamespacedState } from "vuex-composition-helpers";
import { DEKABOXREGION } from "../../namespace";
export default {
  props: ["value", "selectedRegion"],
  setup(props, { root }) {
    const { isRegionLoading } = useNamespacedState(DEKABOXREGION, ["isRegionLoading"]);

    return {
      isRegionLoading,
    };
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
