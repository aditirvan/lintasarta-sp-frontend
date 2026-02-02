<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">
          Create Deka Box
        </div>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Volume Size</p>
        <v-text-field
          maxlength="3"
          id="volumesize"
          type="number"
          v-model.number="quotaSize"
          placeholder="0"
          min="0"
          flat
          outlined
          :error-messages="
            $v.quotaSize.$errors.length ? $v.quotaSize.$errors[0].$message : ''
          "
        >
          <template v-slot:append>
            <span class="font--text">GB</span>
          </template>
        </v-text-field>
      </v-card-text>
      <!-- <v-card-text>
        <p class="titletext">Price per Month</p>
        <v-text-field
          :class="{hideinput:pricepermonthfocus==false}"
          maxlength="10"
          id="pricepermonth"
          v-model.number="pricePerMonth"
          placeholder="0"
          min="0"
          type="number"
          flat
          outlined
          @focus="pricepermonthfocus = true"
          @blur="pricepermonthfocus = false"
          :error-messages="$v.pricePerMonth.$errors.length ? $v.pricePerMonth.$errors[0].$message : '' "
        >
        <template v-slot:prepend-inner>
          <span><span class="font--text">IDR | </span> {{ pricepermonthfocus ? '' : Rpformat.format(pricePerMonth) }}</span>
        </template>
        </v-text-field>
      </v-card-text> -->

      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
              @click="dialog = false"
              block
              height="50"
              depressed
              class="accent"
            >
              <span style="font-size: 14px">Cancel</span></v-btn
            >
          </v-col>
          <v-col>
            <v-btn
              @click="create"
              block
              height="50"
              depressed
              class="secondary"
            >
              <span style="font-size: 14px">Create</span></v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { Rpformat } from "@/lib/formatter";
import { ref, watch } from "@vue/composition-api";
import {
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { MANAGEFLAVOR } from "./namespace";
import { useDialog } from "@/composable/usedialog";
const { required, helpers } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;
export default {
  props: ["value"],
  setup(props, { emit, root }) {
    const { dialog, showCommonDialogSuccess, showCommonDialogWarning } =
      useDialog(props, { emit, root });
    const pricePerMonth = ref(0);
    const quotaSize = ref(0);

    const { s3Default } = useNamespacedState(MANAGEFLAVOR, ["s3Default"]);

    const { createS3Flavor } = useNamespacedActions(MANAGEFLAVOR, [
      "createS3Flavor",
    ]);

    const $v = useVuelidate(
      {
        quotaSize: {
          required,
          autoDirty: true,
          notZero: helpers.withMessage("Value could not be zero.", (val) => {
            return val > 0;
          }),
        },
        pricePerMonth: {
          required,
          autoDirty: true,
          notZero: helpers.withMessage("Value could not be zero.", (val) => {
            return val > 0;
          }),
        },
      },
      {
        quotaSize,
        pricePerMonth,
      }
    );

    watch(quotaSize, (val) => {
      pricePerMonth.value = val * s3Default.value[0].price_per_month;
    });

    const create = async () => {
      $v.value.$touch();
      if ($v.value.$invalid) return;

      const response = await createS3Flavor({
        object_storage_size: quotaSize.value,
        price_per_month: pricePerMonth.value,
      });
      if (response.status === 200) {
        dialog.value = false;
        showCommonDialogSuccess();
      }
    };

    return {
      $v,
      pricePerMonth,
      quotaSize,
      create,
      s3Default,
      Rpformat,
      dialog,
      pricepermonthfocus: ref(false),
      priceperhourfocus: ref(false),
      prevent: ref(false),
    };
  },
};
</script>
<style lang="scss" scoped>
.titletext {
  font-weight: 700;
  font-size: 12px;
}
.hideinput {
  ::v-deep input {
    position: relative;
    bottom: 50px;
    z-index: -2;
  }
}
</style>
