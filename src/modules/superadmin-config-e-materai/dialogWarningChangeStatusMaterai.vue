<template>
  <v-dialog v-model="value" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pt-4 pb-1">
          Warning E-Materai
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>
          There is other e-materai currently active. Please set current
          e-materai Deativated? *only one can be used
        </p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6 ml-auto">
            <v-btn
              color="error"
              block
              depressed
              height="50"
              @click="$emit('close', $event)"
            >
              Oke
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

const module = defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
});
export default module;
</script>
