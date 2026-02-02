<template>
  <div>
    <v-dialog persistent v-model="dialog" max-width="500">
      <v-card class="pt-7 rounded-lg">
        <v-card-text>
          <div class="d-flex flex-row">
            <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
            <p class="fz-18 font-weight-bold mb-0"> Failed Delete Registry</p>
          </div>
        </v-card-text>
        <v-card-text>
          <div class="text-center mt-2">
            <p class="mb-0 text-h6">
              This registry contains repositories, can not be deleted
            </p>
          </div>
        </v-card-text>
        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col class="d-flex flex-row justify-center">
              <v-btn
                color="error"
                depressed
                block
                height="35"
                @click="
                        dialog = false
                      "
              >
                Ok
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { REGISTRY } from "../namespace";
import { ref,computed } from "@vue/composition-api";
export default {
  props: ["value"],
  setup(props, { emit }) {
    const dialog = computed({
        get: () => props.value,
        set: (val) => {
            if(!val){
                emit('clearItem', {})
            }
            emit("input", val);
            
        },
    });
    return {
      dialog,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>