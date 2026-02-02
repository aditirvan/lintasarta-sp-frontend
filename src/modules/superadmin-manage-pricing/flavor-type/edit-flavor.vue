<template>
  <div>
    <v-card class="rounded-lg elevation-0">
      <v-container fluid class="px-7 py-4" v-if="loadingDetail">
        <v-card flat outlined class="rounded-lg">
          <div class="d-flex justify-center pa-10">
            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
          </div>
        </v-card>
      </v-container>
      <v-container class="px-7 py-4" fluid v-else>
        <v-row>
          <v-col>
            <div class="headline font-weight-bold font--text">Create New Flavor Type</div>
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
              ><p class="font-weight-bold">Description</p>
              <v-textarea
                outlined
                v-model="description"
                placeholder="Description"
                @blur="$v.description.$touch()"
                :error-messages="$v.description.$errors.length ? $v.description.$errors[0].$message : ''"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Status</p>
              <v-switch v-model="status" inset></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col>
              <v-btn depressed color="#a5b3bf" class="white--text" block height="50" to="/manage-pricing/flavor-type">
                <span class="fz-16">Cancel</span>
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn depressed block height="50" class="secondary" @click="onSubmit()" :loading="loadingUpdate"><span class="fz-16">Submit</span></v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "@vue/composition-api";
import { minLength, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
export default {
  setup(props, context) {
    const { getDetailFlavor, updateFlavor } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["getDetailFlavor", "updateFlavor"]);
    const { detailFlavor, loadingDetail, loadingUpdate } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["detailFlavor", "loadingDetail", "loadingUpdate"]);
    onMounted(() => {
      getDetailFlavor(context.root.$route.params.id);
    });
    const name = computed({
      get: () => detailFlavor.value.name,
      set: (val) => {
        detailFlavor.value.name = val;
      },
    });
    const description = computed({
      get: () => detailFlavor.value.description,
      set: (val) => {
        detailFlavor.value.description = val;
      },
    });

    const status = computed({
      get: () => detailFlavor.value.status,
      set: (val) => {
        const newStatus = val == true ? 1 : 0;
        detailFlavor.value.status = newStatus;
      },
    });
    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const statusNew = status.value ? parseInt(status.value) : 0;
      const body = { name: name.value, status: statusNew, description: description.value };
      const payload = {
        id: context.root.$route.params.id,
        body: body,
      };
      updateFlavor(payload);
    };
    const $v = useVuelidate(
      {
        name: {
          required: helpers.withMessage("Name couldnt be empty.", (val) => {
            return val;
          }),
          minLength: minLength(3),
        },
        description: {
          required: helpers.withMessage("Description couldnt be empty.", (val) => {
            return val;
          }),
        },
      },
      {
        name,
        description,
      }
    );
    return {
      name,
      status,
      $v,
      onSubmit,
      description,
      loadingUpdate,
      loadingDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
