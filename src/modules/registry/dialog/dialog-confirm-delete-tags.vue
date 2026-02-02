<template>
  <v-dialog persistent v-model="close" max-width="500">
    <v-card class="pt-7 rounded-lg">
      <v-card-text>
        <div class="d-flex flex-row">
          <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
          <p class="fz-18 font-weight-bold mb-0"> Delete Tags</p>
        </div>
      </v-card-text>
      <v-card-text>
        <div class="text-center mt-2">
          <p class="mb-0 text-h7">
            This action cannot be undone. This will permanently delete the
            Tags.
          </p>
        </div>
        <br />
        <span v-if="check == true" class="red--text">{{ error }}</span>
      </v-card-text>
      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn
              color="#CDCDCD"
              depressed
              block
              height="35"
              @click="onCancel()"
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn
              color="red"
              depressed
              block
              height="35"
              style="color: white"
              @click="onDelete()"
            >
              Delete
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { REGISTRY } from "../namespace";
import { ref } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default {
  props: {
    close: {
      type: Boolean,
      default: false,
    },
    dataDelete: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const { deleteTags } = useNamespacedActions(REGISTRY, ["deleteTags"]);
    const error = ref("");
    const check = ref(false);
    const rule = ref({
      required: (value) => !!value || "Required.",
    });

    function onCancel() {
      this.$emit("update:close", false);
      error.value = "";
      check.value = false;
      // deleteRepository.value = "";
      // $v.value.$reset();
    }
    function onDelete() {
      deleteTags(props.dataDelete);
      this.$emit("update:close", false);
    }
    return {
      onCancel,
      onDelete,
      deleteTags,
      rule,
      error,
      check,
      // $v,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
::v-deep .v-messages__message {
  margin-top: 10px;
}
</style>