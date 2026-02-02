<template>
  <v-dialog v-model="value" persistent max-width="500">
    <v-card>
      <v-card-title class="headline">
        Destroy this bucket
      </v-card-title>
      <v-card-text>
        This will schedule your bucket to be deleted. Your bucket and all associated objects will be permanently destroyed, scrubbed, and irretrievable after the deletion period. You will NOT be billed for the bucket from the time you requested a delete to time the bucket and its contents are actually deleted.
      </v-card-text>
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
                  $emit('close');
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

import { useObjectStorage } from './composableapi/useobjectstorage'

export default {
  props: ["value"],
  setup(props, context){
    const Composable = { ...useObjectStorage() }
    const {
      isLoading
    } = Composable
    return {
      isLoading
    }
  }
};
</script>