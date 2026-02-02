<template>
  <v-dialog v-model="modal" max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center pb-4">
        <v-col cols="1" class="pa-0">
          <img
            src="@/assets/info-red.svg"
            alt="small-red-info-circle-icon"
            class="mr-4"
          />
        </v-col>
        <v-col class="pr-0">
          <div class="headline font-weight-bold font--text">
            Looks Like You Don't Have Any Balance to Use This Service
          </div>
        </v-col>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>
          <b>
            Your balance is :
            <span class="primary--text">{{
              toIDRWithDotFormat(item.balance)
            }}</span>
          </b>
        </p>
        <p>
          <b>
            Minimum balance price for this service :
            <span class="primary--text">{{
              toIDRWithDotFormat(item.minimal_balance)
            }}</span>
          </b>
        </p>
        <p>
          <b> Do you want to top up your balance? </b>
        </p>
        <p>
          You can <b>Top Up</b> the deposit balance in your existing billing
          wallet and after that you can access all services with bills deducted
          per-day
        </p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6" class="pl-0">
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
          <v-col cols="6" class="px-0">
            <v-btn
              color="secondary"
              block
              height="50"
              depressed
              @click="
                () => {
                  $emit('confirm', false);
                }
              "
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
import { defineComponent, ref } from "@vue/composition-api";
import api from "@/lib/api";
import { toIDRWithDotFormat } from "@/lib/formatter";

const isDevModeSnapshot = true;

export default defineComponent({
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const item = ref(props.data);
    const modal = ref(true);
    return {
      item,
      modal,
      toIDRWithDotFormat,
    };
  },
});
</script>
