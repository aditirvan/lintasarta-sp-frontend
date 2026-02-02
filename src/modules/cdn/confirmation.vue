<template>
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card class="pt-5">
        <v-card-text>
          <div class="font-weight-bold fz-18">
            <slot name="title-icon"></slot>
            <span v-if="title">{{ title }}</span>
            <slot v-else name="title"></slot>
          </div>
        </v-card-text>
        <v-card-text class="pb-0">
          <p v-if="desc">{{ desc }}</p>
          <slot v-else name="desc"></slot>
        </v-card-text>
          <v-card-text>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn
                class="white--text"
                data-qa="btnCancel"
                color="grey"
                block
                depressed
                height="50"
                :disabled="loading"
                @click="$emit('close')"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                class="white--text"
                color="red"
                block
                height="50"
                :loading="loading"
                :disabled="loading"
                @click="$emit('confirm')"
              >
                Yes
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
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

