<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card class="rounded-xl pa-5">
      <v-card-title class="d-flex justify-center py-0">
        <div style="font-size: 21px" class="pb-0 font-weight-bold font--text">
          Upgrade Organization to Premium
        </div>
      </v-card-title>
      <v-card-title class="d-flex justify-center">
        <div
          class="pb-2 text-center accent--text"
          style="max-width: 324px; font-size: 14px"
        >
          Please Insert Business NPWP before upgrading to premium!
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-text-field
          v-mask="'##.###.###.#-###.###'"
          outlined
          placeholder="Bussiness NPWP Number"
          v-model="npwp_corporate"
          :error-messages="
            $v.npwp_corporate.$errors.length
              ? $v.npwp_corporate.$errors[0].$message
              : ''
          "
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-1">
          <v-col class="py-0">
            <v-btn
              color="secondary"
              block
              height="50"
              depressed
              @click="
                () => {
                  upgrade();
                }
              "
            >
              <span class="fz-14">Upgrade</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { defineComponent, ref } from '@vue/composition-api'
import { useDialog } from "@/composable/usedialog";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useNamespacedActions } from "vuex-composition-helpers";
import { SUPERADMINMANAGEORG } from "./namespace";

export default defineComponent({
  props: ["value", "org"],
  setup(props: any, context) {
    const { dialog } = useDialog(props, context);
    const npwp_corporate = ref("");
    const $v = useVuelidate(
      {
        npwp_corporate: { required },
      },
      { npwp_corporate }
    );
    const { upgradeorg } = useNamespacedActions(SUPERADMINMANAGEORG, [
      "upgradeorg",
    ]);
    const upgrade = () => {
      $v.value.$touch();
      console.log($v.value)
      if ($v.value.$errors.length) return;
      upgradeorg({
        npwp_corporate: npwp_corporate.value.replaceAll('.', '').replaceAll('-', ''),
        id: props.org.id
      }).then(() => {
        context.emit("success");
      });
    };
    return {
      upgrade,
      dialog,
      npwp_corporate,
      $v,
    };
  },
});
</script>