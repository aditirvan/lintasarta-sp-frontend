<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Turn off Instance
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>When you turn off a Instance from the control panel, we first try a graceful shutdown. If that fails, we do a
          forced shutdown, which may corrupt data. To ensure data integrity, we recommend shutting down from the command
          line with poweroff</p>
        <p>When a Instance is off:
          - Its data and IP address are retained and its disk, CPU and RAM are reserved.
          - You continue to accrue its data transfer allowance.
        </p>
        <p> Warning: You will still be billed for a turned off Instance. To end billing, destroy the Instance
          instead.</p>
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
                  $emit('close', false);
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
                  $emit('close', true);
                }
              "
            >
              Turn Off
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ["value"],
  computed: {
    dialog: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("close", val);
      },
    },
  },
};
</script>