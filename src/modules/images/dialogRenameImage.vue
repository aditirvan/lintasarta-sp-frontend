<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Rename Snapshot
        </div>
      </v-card-title>
      <v-card-text>
        <v-text-field
          maxlength="50"
          id="RenameSnapshot"
          v-model="name"
          hide-details
          outlined
        ></v-text-field>
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
              id="RenameButton"
              color="secondary"
              block
              height="50"
              depressed
              @click="
                () => {
                  rename().then(() => {
                    $emit('close', false);
                  });
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
import { ref } from "@vue/composition-api";
import { useNamespacedActions } from "vuex-composition-helpers";
import { IMAGES } from "./namespace";
export default {
  setup(props) {
    const name = ref(props.selectedsnapshot.name);
    const { updatesnapshot } = useNamespacedActions(IMAGES, ["updatesnapshot"]);
    return {
      name,
      rename: async () => {
        return updatesnapshot({
          snapshot: props.selectedsnapshot,
          data: { name: name.value },
        });
      },
    };
  },
  props: ["value", "selectedsnapshot"],
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
};
</script>