<template>
  <v-dialog v-if="dialog" v-model="dialog" max-width="500">
    <v-card class="py-4">
      <v-card-title class="d-flex flex-row justify-center">
        <svg
          width="70"
          height="70"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M57.5004 87.4997L42.9171 72.9164C42.5357 72.5304 42.0815 72.2239 41.5809 72.0148C41.0802 71.8056 40.543 71.6979 40.0004 71.6979C39.4578 71.6979 38.9206 71.8056 38.4199 72.0148C37.9192 72.2239 37.4651 72.5304 37.0837 72.9164C36.6977 73.2978 36.3913 73.7519 36.1821 74.2526C35.9729 74.7533 35.8652 75.2905 35.8652 75.8331C35.8652 76.3757 35.9729 76.9129 36.1821 77.4136C36.3913 77.9142 36.6977 78.3684 37.0837 78.7497L54.5421 96.2081C56.1671 97.8331 58.7921 97.8331 60.4171 96.2081L104.584 52.0831C104.97 51.7017 105.276 51.2476 105.485 50.7469C105.695 50.2462 105.802 49.709 105.802 49.1664C105.802 48.6238 105.695 48.0866 105.485 47.5859C105.276 47.0853 104.97 46.6311 104.584 46.2497C104.202 45.8637 103.748 45.5573 103.248 45.3481C102.747 45.139 102.21 45.0312 101.667 45.0312C101.124 45.0312 100.587 45.139 100.087 45.3481C99.5859 45.5573 99.1317 45.8637 98.7504 46.2497L57.5004 87.4997Z"
            fill="#A9DD8B"
          />
          <circle cx="70" cy="70" r="67.5" stroke="#EDF8E6" stroke-width="5" />
        </svg>
      </v-card-title>
      <v-card-text class="text-center mt-4">
        <p class="font-weight-bold" style="font-size: 20px">
          Data has been saved!
        </p>
        <p>Your data has been submitted!</p>
      </v-card-text>
      <v-card-text class="text-center">
        <v-btn
          @click="
            () => {
              dialog = false;
            }
          "
          depressed
          width="100"
          height="40"
          class="secondary"
          >OK</v-btn
        >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { computed } from "@vue/composition-api";
import {
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  props: ["value"],
  setup(props, context) {
    const { opendialoghavebeensubmitted } = useNamespacedState('DASHBOARD', [
      "opendialoghavebeensubmitted",
    ]);
    const { setopendialoghavebeensubmitted } = useNamespacedMutations(
      'DASHBOARD',
      ["setopendialoghavebeensubmitted"]
    );
    const dialog = computed({
      get: () => opendialoghavebeensubmitted.value,
      set: (val) => setopendialoghavebeensubmitted(val),
    });
    return {
      dialog,
    };
  },
};
</script>