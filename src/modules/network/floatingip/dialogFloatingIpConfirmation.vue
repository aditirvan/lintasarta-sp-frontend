<template>
  <v-dialog v-model="modal" max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center pb-4">
        <img
          src="@/assets/info-red.svg"
          alt="small-red-info-circle-icon"
          class="mr-4"
        />

        <div class="headline font-weight-bold font--text">
          Assign Floating IP
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>
          <b>Are you sure you want to assign floating IP?</b>
        </p>

        <p v-if="!isPostpaidFixed">
          If you agree, will be charged
          <b class="primary--text">
            <span v-if="item.payment_method === 'prepaid'">
              IDR {{ item.price_per_hour.toLocaleString("id-ID") }}/Hour
            </span>
            <span v-else>
              IDR {{ item.price_per_month.toLocaleString("id-ID") }}/Month
            </span> </b
          >.
        </p>

        <p v-else>
          If you agree, floating ip will be charged based on Fixed Price per
          Cycle.
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
