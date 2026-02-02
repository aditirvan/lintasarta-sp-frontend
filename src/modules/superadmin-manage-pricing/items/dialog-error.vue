<template>
  <div>
    <v-dialog persistent v-model="dialogError" max-width="400">
      <v-card class="pt-5 rounded-lg">
        <v-card-text class="pb-3">
          <div class="d-flex flex-row">
            <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
            <p class="fz-18 font-weight-bold mb-0 mt-1">Information</p>
          </div>
          <!-- <v-row>
            <v-col
              ><v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
              <p class="fz-18 font-weight-bold mb-0">Information</p></v-col
            >
          </v-row> -->
        </v-card-text>
        <v-card-text class="pb-3">
          <v-row>
            <v-col><p class="fz-16 font-weight-bold mb-0">Field couldnt be empty. Please check your form</p></v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <v-row class="d-flex justify-start">
            <v-col class="d-flex flex-row justify-center">
              <v-btn class="white--text fz-14" color="#a5b3bf" block height="45" @click="onCancel()"> Cancel </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, watch, computed } from "@vue/composition-api";

export default {
  props: {
    dialogError: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const onCancel = () => {
      context.emit("update:dialog-error", false);
    };
    return {
      onCancel,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
