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

          <p class="headline font-weight-bold font--text pt-4">
            We don't recognize the {{ errmsg }}
          </p>
        </div>
      </v-card-title>

      <v-card-text class="pb-0">
        <p>
          We do not recognize the {{ errmsg }} you're using to login. We will
          send an OTP verification to your email!
        </p>
      </v-card-text>

      <v-card-actions>
        <v-row class="ma-2">
          <v-col>
            <v-btn depressed color="secondary" height="50" block to="/otp">
              OK
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed } from "@vue/composition-api";

export default {
  props: ["value", "errmsg"],
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });

    return {
      dialog,
    };
  },
};
</script>
