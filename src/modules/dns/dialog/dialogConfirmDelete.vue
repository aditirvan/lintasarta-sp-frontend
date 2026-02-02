<template>
  <v-dialog persistent v-model="hide" max-width="500">
    <v-card class="pt-7 rounded-lg">
      <v-card-text>
        <div class="d-flex flex-row">
          <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
          <p class="fz-18 font-weight-bold mb-0">DNS Delete</p>
        </div>
      </v-card-text>
      <v-card-text>
        <div class="text-center mt-2">
          <p class="mb-0 text-h7">
            This action cannot be undone. This will permanently delete the dns.
          </p>
          <p class="mb-0 text-h7">
            Please type <b>{{ idHapus.name }}</b> to confirm
          </p>
          <p class="mb-6 text-h7">
            I understand the consequences, delete this DNS.
          </p>
        </div>
        <v-text-field
          v-model="deleteField"
          outlined
          dense
          label="Input DNS"
          :rules="[rule.required]"
        ></v-text-field>
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
              :loading="isLoadUpdate"
              @click="onDelete(idHapus)"
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
import { ref } from "@vue/composition-api";
import { DNS } from "../namespace";
export default {
  props: {
    hide: {
      type: Boolean,
      default: false,
    },
    idHapus: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const { deleteDns } = useNamespacedActions(DNS, ["deleteDns"]);
    const { isLoadUpdate } = useNamespacedGetters("DNS", ["isLoadUpdate"]);
    const deleteField = ref("");
    const error = ref("");
    const check = ref(false);
    const rule = ref({
      required: (value) => !!value || "Required.",
    });

    function onCancel() {
      this.$emit("update:hide", false);
    }
    function onDelete(item) {
      if (item.name === deleteField.value) {
        check.value = false;
        deleteDns(item);
      } else {
        error.value = "The DNS you entered don't match";
        check.value = true;
      }
    }
    return {
      onCancel,
      onDelete,
      rule,
      deleteDns,
      isLoadUpdate,
      deleteField,
      error,
      check,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>