<template>
  <v-dialog v-model="modal" max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center pb-4">
        <img
          src="@/assets/info-red.svg"
          alt="small-red-info-circle-icon"
          class="mr-4"
        />

        <div class="headline font-weight-bold font--text">Take a Snapshot</div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>
          <b>Are you sure you want to take a snapshot?</b>
        </p>

        <p v-if="!isPostpaidFixed">
          If you agree, Snapshots will be charged based on space used and are
          charged
          <b class="primary--text">
            IDR {{ item.price.toLocaleString("id-ID") }}/{{ item.unit }}
          </b>
        </p>

        <p v-else>
          if you agree, snapshot will be charged based on Fixed Price per Cycle.
        </p>
        <!-- <p><b>Do you wish to proceed?</b></p> -->
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6" class="pl-0">
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
          <v-col cols="6" class="px-0">
            <v-btn
              color="secondary"
              block
              height="50"
              depressed
              @click="
                () => {
                  $emit('confirm', false);
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
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import libProject from "@/lib/project";

// const isDevModeSnapshot = process.env.VUE_APP_DEV_MODE === 'fase-1.3'
const isDevModeSnapshot = true;

export default defineComponent({
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const item = ref(props.data);
    const modal = ref(true);

    const isPostpaidFixed = ref(false);

    onMounted(async () => {
      const currProj = await libProject.getActiveProject();
      isPostpaidFixed.value = currProj.postpaid_type === "fixed";
    });

    return {
      item,
      modal,
      isPostpaidFixed,
    };
  },
});
</script>
