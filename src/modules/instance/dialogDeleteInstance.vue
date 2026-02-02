<template>
  <v-dialog v-model="dialog" max-width="546">
    <v-card class="rounded-l pa-7">
      <v-card-title class="pa-0 mb-5">
        <div class="headline font-weight-bold font--text">Delete Instance</div>
      </v-card-title>
      <div class="banner mb-5">
        <p class="mb-0" style="color: #f99c1d; font-weight: 600">
          Unexpected bad things will happen if you dont read this!
        </p>
      </div>
      <v-card-text class="pa-0 mb-4">
        <p class="mb-5">
          Resource associated with this instance needs to be unattached first
          before you delete this instance
        </p>
        <p>
          Please type <b>{{ selectedinstance.instanceName }}</b> to confirm
        </p>
        <v-text-field
          id="instanceName"
          v-model="deleteType"
          flat
          outlined
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="pa-0">
        <v-row class="ma-0">
          <v-btn
            id="confirm"
            color="error"
            block
            height="50"
            depressed
            :disabled="disableBtn || isLoading"
            @click="validateInstance"
          >
            <beat-loader
              v-if="isLoading"
              :loading="isLoading"
              :color="'white'"
              :size="'10px'"
              class="ml-2"
            />
            {{
              isLoading
                ? ""
                : "I understand the consequences, delete this instance"
            }}
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useDialog } from "@/composable/usedialog";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { computed, ref, watch } from "@vue/composition-api";
import INSTANCE from "./namespace";
export default {
  props: ["value", "instanceName", "selectedinstance"],
  setup: (props, context) => {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        val == false ? (deleteType.value = "") : "";
        context.emit("input", val);
      },
    });
    const { deleteInstance, validateInstanceName } = useNamespacedActions(
      INSTANCE,
      ["deleteInstance", "validateInstanceName"]
    );
    const { isLoading } = useNamespacedState(INSTANCE, ["isLoading"]);
    const deleteType = ref("");
    const disableBtn = ref(true);

    const validateInstance = () => {
      const name = props.selectedinstance.instanceName;
      if (name == deleteType.value) {
        deleteInstance({
          project_id: props.selectedinstance.project_id,
          instance_id: props.selectedinstance.id,
        }).then(() => {
          dialog.value = false;
        });
      }
    };

    watch(deleteType, (val) => {
      return val == props.selectedinstance.instanceName
        ? (disableBtn.value = false)
        : (disableBtn.value = true);
    });

    return {
      validateInstanceName,
      deleteInstance,
      validateInstance,
      deleteType,
      dialog,
      disableBtn,
      isLoading,
    };
  },
};
</script>
<style lang="css">
.banner {
  background-color: #faefd0;
  padding: 10px;
  border-radius: 8px;
}
</style>
