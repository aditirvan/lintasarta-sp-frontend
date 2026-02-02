<template>
  <div>
    <v-dialog persistent v-model="closePass" max-width="500">
      <v-card class="pt-7 rounded-lg">
        <v-card-text>
          <div class="d-flex flex-row">
            <!-- <v-icon left>$vuetify.icons.alertcircleIcon</v-icon> -->
            <p class="fz-18 font-weight-bold mb-0">
              Your Password
            </p>
          </div>
        </v-card-text>
        <v-card-text>
          <p>
              Your registry password is 
              <b>{{ dataShow}}</b>
          </p>
          
        </v-card-text>
        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="#CDCDCD"
                depressed
                block
                height="35"
                @click="onCancel()"
              >
                Close
              </v-btn>
            </v-col>
            
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { REGISTRY } from "../namespace";
import { ref } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";

export default {
  props: {
    closePass: {
      type: Boolean,
      default: false,
    },
    dataShow: {
      type: Object,
      default: () => {},
    },
  },
  
  setup(props) {
    function onCancel() {
      this.$emit("update:closePass", false);
    }
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