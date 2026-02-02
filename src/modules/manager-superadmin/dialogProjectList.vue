<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Project List 
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-data-table
        :headers="[{text:'Project name', value:'name'}]"
        hide-default-footer
        :items="projects"
        ></v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col >
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
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ["value","projects"],
  computed: {
    dialog: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>