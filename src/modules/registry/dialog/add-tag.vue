<template>
  <div class="text-center">
    <v-dialog v-model="close" width="500" persistent>
      <v-card>
        <v-card-title class="pb-7">
          <div class="headline font-weight-bold font--text">ADD Tag</div>
        </v-card-title>
        <v-card-text class="pb-0">
          <p class="font-weight-bold">Name</p>
          <v-text-field
            v-model="name"
            outlined
            placeholder="Name"
            @blur="$v.name.$touch()"
            :error-messages="
              $v.name.$errors.length ? 'Description couldnt be empty.' : ''
            "
          />
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn
                depressed
                height="50"
                color="accent"
                block
                @click="onCancel()"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                depressed
                height="50"
                color="secondary"
                block
                @click="create()"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useNamespacedActions } from "vuex-composition-helpers";
import { REGISTRY } from "../namespace";
export default {
  props: {
    close: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { addTags } = useNamespacedActions(REGISTRY, ["addTags"]);
    const name = ref("");
    function onCancel() {
      $v.value.$reset();
      this.$emit("update:close", false);
      name.value = "";
    }
    const $v = useVuelidate(
      {
        name: { required },
      },
      {
        name,
      }
    );
    function create() {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const body = {
        // repository_id: 0,
        name: name.value,
        // push_time: "2022-10-13T01:32:48.219Z",
        // pull_time: "2022-10-13T01:32:48.219Z",
        // signed: true,
        // id: 0,
        // immutable: true,
        // artifact_id: 0,
      };
      const params = {
        project_name: context.root.$route.params.project_name,
        project: context.root.$route.params.project,
        artifacts: context.root.$route.params.artifacts,
      };
      const payload = { body: body, params: params };
      // console.log(payload);
      addTags(payload);
      this.$emit("update:close", false);
      name.value = ""
    }
    return {
      onCancel,
      create,
      name,
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