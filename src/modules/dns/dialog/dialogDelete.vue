<template>
  <div>
    <v-dialog persistent v-model="close" max-width="500">
      <v-card class="pt-7 rounded-lg">
        <v-card-text>
          <div class="d-flex flex-row">
            <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
            <p class="fz-18 font-weight-bold mb-0">DNS Delete</p>
          </div>
        </v-card-text>
        <v-card-text>
          <div class="text-center mt-2">
            <p class="mb-0 text-h6">
              Do you want to delete this DNS ?
            </p>
          </div>
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
                color="primary"
                depressed
                block
                height="35"
                @click="onConfirm()"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <dialogConfirmDelete :hide.sync="closed" :id-hapus="idDns"></dialogConfirmDelete>
  </div>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { ref } from "@vue/composition-api";
import { DNS } from "../namespace";
import dialogConfirmDelete from "../dialog/dialogConfirmDelete.vue";
export default {
  components: {
    dialogConfirmDelete,
  },
  props: {
    close: {
      type: Boolean,
      default: false,
    },
    idDns: {
        type: Object,
        default: () => {}
    }
  },
  setup() {
    const { deleteDns } = useNamespacedActions(DNS, ["deleteDns"]);
    const closed = ref(false);

    function onConfirm() {
      //   this.$emit("update:close", false);
      closed.value = true;
    }
    function onCancel() {
      this.$emit("update:close", false);
    }
    return {
      onCancel,
      onConfirm,
      deleteDns,
      closed,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>