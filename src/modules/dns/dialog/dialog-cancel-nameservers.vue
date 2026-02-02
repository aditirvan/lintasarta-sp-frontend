<template>
  <div>
    <v-dialog persistent v-model="cancel" max-width="500">
      <v-card class="pt-7 rounded-lg">
        <v-card-text>
          <div class="d-flex flex-row">
            <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
            <p class="fz-18 font-weight-bold mb-0">Cancel Nameservers</p>
          </div>
        </v-card-text>
        <v-card-text>
          <div class="text-center mt-2">
            <p class="mb-0 text-h6">
              Do you want to cancel this custom Nameservers ?
            </p>
          </div>
        </v-card-text>
        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="#CDCDCD"
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
                color="primary"
                depressed
                block
                height="35"
                @click="onConfirm()"
                :loading="loadingCancel"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  useNamespacedGetters,
  useNamespacedActions,
} from "vuex-composition-helpers";
export default {
  props: {
    cancel: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { detailDns, loadingCancel } = useNamespacedGetters("DNS", [
      "detailDns",
      "loadingCancel",
    ]);
    const { postCancelNameservers } = useNamespacedActions("DNS", [
      "postCancelNameservers",
    ]);
    function onCancel() {
      this.$emit("update:cancel", false);
    }
    function onConfirm() {
      const it = {
        id_custom: detailDns.value.custom_ns[0].id,
        id_record: detailDns.value.record_id_ns[0].id,
      };
      const params = {
        id: detailDns.value.id,
        name: detailDns.value.custom_ns[0].name,
        ns1_name: detailDns.value.custom_ns[0].ns1_name,
        ns2_name: detailDns.value.custom_ns[0].ns2_name,
        organization_id: detailDns.value.organization_id,
        project_id: detailDns.value.project_id,
      };
      postCancelNameservers({ id: it, data: params });
    }
    return {
      onCancel,
      onConfirm,
      postCancelNameservers,
      detailDns,
      loadingCancel,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>