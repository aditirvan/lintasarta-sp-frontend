<template>
  <v-dialog v-model="value" persistent max-width="500">
    <v-card>
      <v-card-title class="headline">
        <img
          src="@/assets/info-red.svg"
          alt="small-red-info-circle-icon"
          class="mr-4"
        />
        <!-- <v-icon color="red" class="mr-4">info</v-icon> -->
        Spesification Info
      </v-card-title>

      <v-card-text style="padding-top: 20px; padding-bottom: 0;">
        <p>This Service Has Been Changed Before</p>
      </v-card-text>

      <v-card-actions>
        <v-row class="ma-2">
          <v-col>
            <v-btn color="primary" block @click="$emit('close')">
              Okay
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["value"],
};
</script>
