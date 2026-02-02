<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Add to Region
        </div>
      </v-card-title>
      <v-card-text>
        <p>
          Select the regions that you would like your snapshot to be available
          in.
        </p>
        <v-select :items="selectregions" single-line outlined></v-select>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="secondary"
              block
              height="50"
              depressed
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              Rename
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useRegion } from '../instance/compositionapi/useregion'
export default {
    setup(){
        const Composable = {
            ...useRegion()
        }
        const { selectregions,fetchregions  } = Composable
        return {
            selectregions, fetchregions
        }
    },
  props: ["value"],
  computed: {
    dialog: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("close", val);
      },
    },
  },
  created(){
      this.fetchregions()
  }
};
</script>