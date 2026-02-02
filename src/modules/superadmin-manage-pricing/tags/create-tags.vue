<template>
  <div>
    <v-card class="rounded-lg elevation-0">
      <v-container class="px-7 py-4" fluid>
        <v-row>
          <v-col>
            <div class="headline font-weight-bold font--text">Create Tags</div>
          </v-col>
        </v-row>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
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
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Unit</p>
              <v-text-field
                outlined
                v-model="unit"
                placeholder="Unit"
                @blur="$v.unit.$touch()"
                :error-messages="$v.unit.$errors.length ? $v.unit.$errors[0].$message : ''"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Status</p>
              <v-switch v-model="status" inset value="1"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col>
              <v-btn depressed color="#a5b3bf" class="white--text" block height="50" to="/manage-pricing/tags">
                <span class="fz-16">Cancel</span>
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn depressed block height="50" class="secondary" @click="onSubmit()" :loading="loadingCreateTags"><span class="fz-16">Submit</span></v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { minLength, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
export default {
  setup(props, context) {
    const { postCreateTags } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["postCreateTags"]);
    const { loadingCreateTags } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["loadingCreateTags"]);
    const name = ref("");
    const unit = ref("");
    const status = ref("");
    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const statusNew = status.value ? parseInt(status.value) : 0;
      const params = { name: name.value, status: statusNew, unit: unit.value };
      postCreateTags(params);
    };
    const $v = useVuelidate(
      {
        name: {
          required: helpers.withMessage("Name couldnt be empty.", (val) => {
            return val;
          }),
          minLength: minLength(3),
        },
        unit: {
          required: helpers.withMessage("Unit couldnt be empty.", (val) => {
            return val;
          }),
        },
      },
      {
        name,
        unit,
      }
    );
    return {
      name,
      unit,
      status,
      $v,
      onSubmit,
      loadingCreateTags,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
