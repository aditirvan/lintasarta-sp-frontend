<template>
  <v-dialog v-model="openDialog" max-width="500">
    <v-card class="rounded-lg pa-2">
      <v-card-title>
        <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
        <div class="headline font-weight-bold font--text">Turn {{ dataStatus.status == true ? "off" : "on" }} Confirmation</div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p class="mb-0">Are you sure to turn {{ dataStatus.status == true ? "off" : "on" }} region {{ dataStatus.name }}</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="mx-1">
          <v-col cols="6">
            <v-btn color="accent" block depressed height="50" @click="onCancel()">
              <span class="fz-14">Cancel</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn color="secondary" block height="50" depressed @click="onSubmit()" :loading="isRegionLoading">
              <span class="fz-14">Yes</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useNamespacedState, useNamespacedActions } from "vuex-composition-helpers";
import { DEKABOXREGION } from "../../namespace";

export default {
  props: {
    dataStatus: {
      type: Object,
      default: () => {},
    },
    openDialog: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { updateStatus } = useNamespacedActions(DEKABOXREGION, ["updateStatus"]);
    const { isRegionLoading } = useNamespacedState(DEKABOXREGION, ["isRegionLoading"]);
    const onCancel = () => {
      context.emit("update:open-dialog", false);
    };
    const onSubmit = async () => {
      const params = {
        id: props.dataStatus.id,
        status: props.dataStatus.status == true ? "deactive" : "active",
      };
      const resp = await updateStatus(params);
      if (resp.status == 200) {
        context.emit("update:open-dialog", false);
      }
    };
    return {
      onCancel,
      onSubmit,
      isRegionLoading,
    };
  },
};
</script>
