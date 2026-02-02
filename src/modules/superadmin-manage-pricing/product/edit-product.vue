<template>
  <div>
    <v-dialog persistent v-model="dialogEdit" max-width="500">
      <v-card class="rounded-lg elevation-0">
        <v-container class="px-7 py-4" fluid>
          <v-row>
            <v-col>
              <div class="headline font-weight-bold font--text">Edit Product</div>
            </v-col>
          </v-row>
          <v-card-text class="pb-0">
            <v-row>
              <v-col class="pt-0 pb-0"
                ><p class="font-weight-bold">Name</p>
                <v-text-field
                  outlined
                  v-model="name"
                  placeholder="Name"
                  @blur="$v.name.$touch()"
                  :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text class="pb-0">
            <v-row>
              <v-col class="pt-0 pb-0"
                ><p class="font-weight-bold">Status</p>
                <v-switch v-model="status" inset :true-value="1" :false-value="0"></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text class="pb-0">
            <v-row>
              <v-col>
                <v-btn depressed color="#a5b3bf" class="white--text" block height="50" @click="onCancel()">
                  <span class="fz-16">Cancel</span>
                </v-btn>
              </v-col>

              <v-col cols="6">
                <v-btn depressed block height="50" class="secondary" @click="onSubmit()" :loading="loadingCreateProduct"
                  ><span class="fz-16">Submit</span></v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { minLength, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
export default {
  props: {
    dialogEdit: {
      type: Boolean,
      default: false,
    },
    dataProduct: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { updateProduct } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["updateProduct"]);
    const { loadingCreateProduct } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["loadingCreateProduct"]);

    const name = ref(props.dataProduct.name);
    const status = ref(props.dataProduct.status);

    const onSubmit = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const params = { name: name.value, status: status.value };
      const payload = {
        id: props.dataProduct.id,
        body: params,
      };
      const res = await updateProduct(payload);
      if (res.status == 200) {
        context.emit("update:dialog-edit", false);
      }
    };
    const onCancel = () => {
      context.emit("update:dialog-edit", false);
    };
    const $v = useVuelidate(
      {
        name: {
          required: helpers.withMessage("Name couldnt be empty.", (val) => {
            return val;
          }),
          minLength: minLength(3),
        },
      },
      {
        name,
      }
    );
    return {
      name,
      status,
      $v,
      onSubmit,
      loadingCreateProduct,
      onCancel,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
