<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Transfer to another user
        </div>
      </v-card-title>
      <v-card-text>
          <p>Transfer your snapshot to another user. Once the user accepts the transfer, you will lose access to this snapshot.</p>
        <v-text-field 
				maxlength="50"
        placeholder="Enter Recipients Email" hide-details outlined></v-text-field>
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
                  $emit('close');
                }
              "
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
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              Transfer Snapshot
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