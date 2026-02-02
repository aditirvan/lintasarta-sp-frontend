<template>
  <v-dialog v-model="value" persistent max-width="500">
    <v-card>
      <v-card-title class="headline">
        Delete Alert
      </v-card-title>
      <v-card-text class="pb-0">
        <p class="font-weight-bold mb-0">Are you sure you want to proceed?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn depressed
              :disabled="isLoading"
              height="50"
              color="accent"
              block
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              <b>Cancel</b>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn depressed
              :disabled="isLoading"
              height="50"
              color="error"
              block
              @click="
                () => {
                  $emit('confirm');
                }
              "
            >
              <b>Destroy</b>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useAlert } from './useAlert'
export default {
	props: ['value'],
	setup() {
		return {
			...useAlert()
		}
	},
};
</script>

<style scoped>
</style>