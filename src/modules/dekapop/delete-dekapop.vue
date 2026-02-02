<template>
  <div>
    <v-dialog persistent v-model="dialogClosed" max-width="500">
      <v-card class="pt-5 rounded-lg">
        <v-card-text class="pb-3">
          <v-row>
            <v-col
              ><p class="fz-18 font-weight-bold mb-0">
                Are you absolutely sure?
              </p></v-col
            >
            <v-col class="d-flex justify-end pt-0"
              ><span class="cursor-pointer" @click="onCancel()"
                ><v-icon color="red" large>mdi-close-circle</v-icon></span
              ></v-col
            >
          </v-row>
        </v-card-text>

        <v-card-text
          class="mb-2"
          style="
            border-top: 1px solid #ffc107;
            border-bottom: 1px solid #ffc107;
            background-color: rgba(255, 193, 7, 0.1);
          "
        >
          <div class="mt-4">
            <span class="warning--text"
              >Unexpected bad things will happen if you don't read this!</span
            >
          </div>
        </v-card-text>
        <v-card-text class="pt-5">
          <p>
            This action cannot be undone. This will permanently delete the
            <b>{{ dataItem.usage_meter_name }}</b> item, wiki, issues, comments,
            packages, secrets, workflow runs, and remove all team assosiations.
          </p>
          <p>
            Please type <b>{{ dataItem.usage_meter_name }}</b> to confirm
          </p>
        </v-card-text>
        <v-card-text>
          <v-text-field
            v-model="inputProduct"
            outlined
            @blur="$v.inputProduct.$touch()"
            :error-messages="
              $v.inputProduct.$errors.length
                ? $v.inputProduct.$errors[0].$message
                : ''
            "
          ></v-text-field>
          <v-btn
            @click="onConfirm()"
            :loading="loadingDelete"
            depressed
            class="error"
            height="45"
            block
            >I understand the consequences, delete this item</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { POP } from "./namespace";

export default {
  props: {
    dialogClosed: {
      type: Boolean,
      default: false,
    },
    dataItem: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { deletePop, fetchPop } = useNamespacedActions(POP, [
      "deletePop",
      "fetchPop",
    ]);
    const { loadingDelete } = useNamespacedGetters(POP, ["loadingDelete"]);

    const inputProduct = ref("");
    const onConfirm = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const resp = await deletePop(props.dataItem.id);
      if (resp.status == 200) {
        const params = new URLSearchParams();
        params.append("projectId", props.dataItem.project_id);
        params.append("limit", "10");
        params.append("page", "1");
        params.append("sort", "created_at desc");
        fetchPop(params);
        context.emit("update:dialog-closed", false);
      }
    };
    const onCancel = () => {
      context.emit("update:dialog-closed", false);
    };

    const $v = useVuelidate(
      {
        inputProduct: {
          required: helpers.withMessage("Name couldnt be empty.", (val) => {
            return val;
          }),
          nameTags: helpers.withMessage(
            "The Name you entered don't match",
            (val) => {
              return val == props.dataItem.usage_meter_name;
            }
          ),
        },
      },
      {
        inputProduct,
      }
    );

    return {
      onCancel,
      onConfirm,
      inputProduct,
      $v,
      loadingDelete,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
