<template>
  <v-dialog v-model="dialog" width="650">
    <v-card>
      <v-card-title class="font-weight-bold fz-21"> Detail Zone </v-card-title>
      <v-card-text>
        <v-row class="mb-dr">
          <v-col cols="6">
            <p class="font-weight-bold">Region</p>
          </v-col>
          <v-col cols="6">
            <p>{{ selectedZone.region }}</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row class="mb-dr">
          <v-col cols="6">
            <p class="font-weight-bold">Name</p>
          </v-col>
          <v-col cols="6">
            <p>{{ selectedZone.name }}</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row class="mb-dr">
          <v-col cols="6">
            <p class="font-weight-bold">Zone</p>
          </v-col>
          <v-col cols="6">
            <p>{{ selectedZone.zone }}</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-btn
          @click="
            () => {
              dialog = false;
            }
          "
          block
          depressed
          class="accent"
          >Close</v-btn
        >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style>
.mb-dr {
  margin-bottom: -3% !important;
}
</style>
<script>
import { useDialog } from "@/composable/usedialog";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: ["value", "selectedZone"],
  setup(props, context) {
    const { dialog } = useDialog(props, context);
    return {
      dialog,
    };
  },
});
</script>
