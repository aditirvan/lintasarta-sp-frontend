<template>
  <v-dialog persistent v-model="value" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete Auto Scaling
        </div>
      </v-card-title>

      <v-card-text class="pb-0">
        <!-- <p>
          Resources associated with this Instance will not be automatically
          destroyed, and you may continue to be billed for them.
        </p> -->
        <p><b>Do you wish to proceed?</b></p>
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
                  $emit('cancel');
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>

          <v-col cols="6">
            <v-btn
              :disabled="loading"
              color="error"
              block
              height="50"
              depressed
              @click="
                () => {
                  $emit('submit');
                }
              "
            >
              {{ loading ? "Loading..." : "Delete Instance" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["value", "item", "loading"],
};
</script>
