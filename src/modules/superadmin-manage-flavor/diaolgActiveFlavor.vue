<template>
  <v-dialog v-model="dialogActive" max-width="500">
    <v-card class="rounded-lg pa-2">
      <v-card-title>
        <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
        <div class="headline font-weight-bold font--text">Turn {{ dataFlavor.status == "active" ? "Off" : "On" }} Confirmation</div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p class="mb-0">
          Are you sure to turn {{ dataFlavor.status == "active" ? "Off" : "On" }} <b>{{ dataFlavor.flavor_name }}</b> ?
        </p>
      </v-card-text>
      <v-card-actions>
        <v-row class="mx-1">
          <v-col cols="6">
            <v-btn color="accent" block depressed height="50" @click="onCancel()">
              <!-- <beat-loader v-if="loading" :loading="loading" color="#2C94D2" size="10px" class="ml-2" /> -->

              <span class="fz-14">Cancel</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn color="secondary" block height="50" depressed @click="onConfirm()">
              <span class="fz-14">Yes</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useNamespacedActions } from "vuex-composition-helpers";
import { SUPERADMINMANAGEFLAVOR } from "./namespace";

export default {
  props: {
    dataFlavor: {
      type: Object,
      default: true,
    },
    dialogActive: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { activateFlavor } = useNamespacedActions(SUPERADMINMANAGEFLAVOR, ["activateFlavor"]);
    const onCancel = () => {
      context.emit("update:dialog-active", false);
    };
    const onConfirm = async () => {
      const params = { id: props.dataFlavor.id, status: props.dataFlavor.status == "active" ? "deactive" : "active" };
      const response = await activateFlavor(params);
      if (response.status == 200) {
        context.emit("update:dialog-active", false);
      }
    };
    return {
      onCancel,
      onConfirm,
    };
  },
};
</script>
