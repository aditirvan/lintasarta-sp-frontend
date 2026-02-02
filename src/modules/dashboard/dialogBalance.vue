<template>
  <v-dialog v-model="dialog" persistent max-width="500">
    <v-card>
      <v-card-title>
        <div class="d-flex align-center">
          <img
            src="@/assets/info-red.svg"
            alt="small-red-circle-info-icon"
            style="margin-right: 10px"
          />

          <div class="headline font-weight-bold font--text pb-4">
            Looks like you don't have any balance to
            <br />
            use this service
          </div>
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p><b>Do you want to top up your balance?</b></p>
        <p>
          You can <b>Top Up</b> the deposit balance in your existing billing
          wallet and after that you can access all services with bills deducted
          per-day
        </p>
        <p class="error--text">
          {{ opendialogbalancemsg }}
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
              @click="dialog = false"
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              block
              height="50"
              depressed
              class="secondary"
              @click="() => {
                dialog = false;
                $router.push('/billing/payment');
              }"
            >
              Top Up Now
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
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
  setup() {
    const { opendialogbalance, opendialogbalancemsg } = useNamespacedState(
      "DASHBOARD",["opendialogbalance", "opendialogbalancemsg"]
    );

    const { setopendialogbalance } = useNamespacedMutations(
      "DASHBOARD", ["setopendialogbalance"]);

    const dialog = computed({
      get: () => {
        return opendialogbalance.value;
      },
      set: (val) => {
        setopendialogbalance(val);
      },
    });

    return {
      dialog,
      opendialogbalancemsg,
    };
  },
};
</script>
