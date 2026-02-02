<template>
  <div>
    <v-card-text class="pb-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0">
          <p class="font-weight-bold">Server Groups</p>
          <v-select
            placeholder="Choose Server Group"
            :items="servergroupByProject"
            v-model="selectServer"
            item-value="id"
            item-text="text"
            outlined
            ><template v-slot:selection="{ item }"> {{ item.name }} - {{ formatCapitalize(item.policy) }} </template>
            <template v-slot:item="{ item }"> {{ item.name }} - {{ formatCapitalize(item.policy) }} </template>
          </v-select>
          <!-- @blur="$v.selectServer.$touch()"
            :error-messages="$v.selectServer.$errors.length ? $v.selectServer.$errors[0].$message : ''" -->
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="mt-4">
      <v-row class="d-flex justify-end">
        <v-col class="d-flex flex-row justify-center" cols="3">
          <v-btn class="fz-16" color="secondary" block outlined height="45" @click="prev()"> Previous </v-btn>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3">
          <v-btn class="white--text fz-16" color="secondary" block height="45" @click="next()"> Next </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import INSTANCE from "../namespace";
export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
    dataServer: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { fetchServerGroupByProject } = useNamespacedActions(INSTANCE, ["fetchServerGroupByProject"]);
    const { servergroupByProject } = useNamespacedState(INSTANCE, ["servergroupByProject"]);
    onMounted(() => {
      fetchServerGroupByProject();
    });
    const selectServer = ref("");
    const $v = useVuelidate(
      {
        selectServer: {
          required: helpers.withMessage("Server Groups couldnt be empty.", (val) => {
            return val;
          }),
        },
      },
      {
        selectServer,
      }
    );

    const next = () => {
      // $v.value.$touch();
      // if ($v.value.$errors.length) return;
      const payload = {
        server_group_id: selectServer.value,
      };
      context.emit("get-data", payload);
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    const formatCapitalize = (text) => {
      const name = text.replace(/(^|[\s-])\S/g, (match) => {
        return match.toUpperCase();
      });
      return name.replace(/-/g, " ");
    };
    return {
      prev,
      next,
      $v,
      selectServer,
      servergroupByProject,
      formatCapitalize,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-btn.v-size--default {
  font-size: 16px;
}

::v-deep .v-list-item--link:before {
  background-color: none;
}
</style>
