<template>
  <v-dialog persistent v-model="show" max-width="500">
    <v-card class="pt-7 rounded-lg">
      <v-card-text>
        <div class="d-flex flex-row">
          <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
          <p class="fz-21 font-weight-bold mb-0">DNS Update</p>
        </div>
      </v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          label="Add a Site"
          v-model="inputDns"
          :rules="[rule.required]"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn
              color="warning"
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
              color="success"
              depressed
              block
              height="35"
              :loading="isLoadUpdate"
              @click="onUpdate(detailDns)"
            >
              Confirm
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
    show: {
      type: Boolean,
      default: false,
    },
    detailDns: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    const { updateDns } = useNamespacedActions(
      DNS,
      []
    );
    const { isLoadUpdate } = useNamespacedGetters("DNS", ["isLoadUpdate"]);
    const inputDns = ref("")
    const rule = ref({
      required: (value) => !!value || "Required.",
    });
    function onUpdate(item) {
      const params = {
        id: item.id,
        name: inputDns.value,
        organization_id: item.organization_id,
        project_id: item.project_id
      }
      updateDns(params)

      this.$emit("update:show", false);
    }
    function onCancel() {
      this.$emit("update:show", false);
    }
    return {
      isLoadUpdate,
      rule,
      updateDns,
      inputDns,
      onUpdate,
      onCancel
    };
  },
};
</script>