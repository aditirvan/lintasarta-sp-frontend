<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete Access Key
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p><b>Warning:</b> Deleting an access key will make you no longer has the access to the bucket with that access key.</p>
        <p>Do you want to permanently delete it?</p>
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
                  $emit('confirm', accessKey.id)
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
  props: ["value", 'accessKey'],
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