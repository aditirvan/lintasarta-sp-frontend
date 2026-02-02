<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Destroy Deka Box
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Destroying a bucket will schedule the bucket and all the objects inside to be permanently destroyed.</p>
        <p><b>Warning:</b> Destroying a bucket can take several days depending on the amount of data. During this time, the name of the bucket cannot be reused.</p>
        <p>Do you want to permanently destroy this?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn depressed
              color="accent"
              block
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
            <v-btn depressed
              color="error"
              block
              height="50"
              @click="
                () => {
                  $emit('confirm')
                }
              "
            >
              Destroy
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