<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          {{ title }}
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>{{ desc }}</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              :disabled="loading"
              @click="$emit('input', false)"
            >
              Cancel

              <!-- loading indicator -->
              <beat-loader
                v-if="loading"
                :loading="loading"
                :color="'white'"
                :size="'10px'"
                class="ml-2"
              />
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="error"
              block
              height="50"
              depressed
              :disabled="loading"
              @click="$emit('confirm')"
            >
              Yes

              <!-- loading indicator -->
              <beat-loader
                v-if="loading"
                :loading="loading"
                :color="'white'"
                :size="'10px'"
                class="ml-2"
              />
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ["value", "loading", "title", "desc"],
  computed: {
    dialog: {
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>
