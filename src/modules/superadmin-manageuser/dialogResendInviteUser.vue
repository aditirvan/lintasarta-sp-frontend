<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Resend Invitation
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure resend email to this user ?</p>
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
                  $emit('confirm');
                  $emit('input', false);
                }
              "
            >
              Yes
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
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>
