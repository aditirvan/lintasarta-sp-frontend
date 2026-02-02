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
            <b>{{ dataService.name }}</b> service, wiki, issues, comments, packages, secrets, workflow runs, and remove all team assosiations.
          </p>
          <p>
            Please type <b>{{ dataService.name }}</b> to confirm
          </p>
        </v-card-text>
        <v-card-text>
          <v-text-field
            v-model="inputService"
            outlined
            @blur="$v.inputService.$touch()"
            :error-messages="$v.inputService.$errors.length ? $v.inputService.$errors[0].$message : ''"
          ></v-text-field>
          <v-btn @click="onConfirm()" :loading="loadingCreateProduct" depressed class="error" block>I understand the consequences, delete this service</v-btn>
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
    dataService: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { deleteService } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["deleteService"]);
    const { statusDelete, loadingCreateProduct } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["statusDelete", "loadingCreateProduct"]);

    const inputService = ref("");
    const onConfirm = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      const id = { idService: props.dataService.id, idProduct: props.dataService.product_id };
      const payload = {
        params: params,
        id: id,
      };
      deleteService(payload);
    };
    const onCancel = () => {
      context.emit("update:dialog-closed", false);
    };

    const $v = useVuelidate(
      {
        inputService: {
          required: helpers.withMessage("Name couldnt be empty.", (val) => {
            return val;
          }),
          nameTags: helpers.withMessage("The Name you entered don't match", (val) => {
            return val == props.dataService.name;
          }),
        },
      },
      {
        inputService,
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
      inputService,
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
