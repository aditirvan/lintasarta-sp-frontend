<template>
  <v-dialog v-model="modal" persistent max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center pb-4">
        <img
          src="@/assets/info-red.svg"
          alt="small-red-info-circle-icon"
          class="mr-4"
        />

        <div class="headline font-weight-bold font--text">{{ actionName }}</div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>
          <b>Are you sure you want to {{ actionName }}?</b>
        </p>

        <p>
          {{ infoText }}
        </p>
        
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6" class="pl-0">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              @click="() => {
                $emit('onClose')
              }"
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6" class="px-0">
            <v-btn
              color="secondary"
              block
              height="50"
              depressed
              @click="
                () => {
                  $emit('confirm');
                  $emit('onClose');
                }
              "
            >
              Yes, I Agree
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  props: {
    actionName: {
      type: String,
      required: true,
      default: "",
    },
    infoText: {
      type: String,
      required: true,
      default: "",
    },
  },
  setup(props, { emit }) {
    const modal = ref(true);
    
    return {
      modal
    };
  },
});
</script>
