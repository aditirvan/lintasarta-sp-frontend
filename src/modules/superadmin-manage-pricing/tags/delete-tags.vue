<template>
  <div>
    <v-dialog persistent v-model="dialogClosed" max-width="500">
      <v-card class="pt-5 rounded-lg">
        <v-card-text class="pb-3">
          <v-row>
            <v-col><p class="fz-18 font-weight-bold mb-0">Are you absolutely sure?</p></v-col>
            <v-col class="d-flex justify-end"
              ><span class="cursor-pointer" @click="onCancel()"><v-icon color="red">mdi-close-circle</v-icon></span></v-col
            >
          </v-row>
        </v-card-text>

        <v-card-text class="mb-2" style="border-top: 1px solid #ffc107; border-bottom: 1px solid #ffc107; background-color: rgba(255, 193, 7, 0.1)">
          <div class="mt-4">
            <span class="warning--text">Unexpected bad things will happen if you don't read this!</span>
          </div>
        </v-card-text>
        <v-card-text class="pt-5">
          <p>
            This action cannot be undone. This will permanently delete the
            <b>{{ dataTags.name }}</b> tags, wiki, issues, comments, packages, secrets, workflow runs, and remove all team assosiations.
          </p>
          <p>
            Please type <b>{{ dataTags.name }}</b> to confirm
          </p>
        </v-card-text>
        <v-card-text>
          <v-text-field
            v-model="inputTags"
            outlined
            @blur="$v.inputTags.$touch()"
            :error-messages="$v.inputTags.$errors.length ? $v.inputTags.$errors[0].$message : ''"
          ></v-text-field>
          <v-btn @click="onConfirm()" :loading="loadingCreateProduct" depressed class="error" block>I understand the consequences, delete this tags</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
import { helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  props: {
    dialogClosed: {
      type: Boolean,
      default: false,
    },
    dataTags: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { deleteTags } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["deleteTags"]);
    const { statusDelete, loadingCreateProduct } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["statusDelete", "loadingCreateProduct"]);
    const inputTags = ref("");
    const onConfirm = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      deleteTags(props.dataTags.id);
    };
    const onCancel = () => {
      context.emit("update:dialog-closed", false);
    };

    const $v = useVuelidate(
      {
        inputTags: {
          required: helpers.withMessage("Name couldnt be empty.", (val) => {
            return val;
          }),
          nameTags: helpers.withMessage("The Name you entered don't match", (val) => {
            return val == props.dataTags.name;
          }),
        },
      },
      {
        inputTags,
      }
    );

    watch(statusDelete, () => {
      if (statusDelete.value == 200) {
        context.emit("update:dialog-closed", false);
      }
    });
    return {
      onCancel,
      onConfirm,
      statusDelete,
      loadingCreateProduct,
      inputTags,
      $v,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
