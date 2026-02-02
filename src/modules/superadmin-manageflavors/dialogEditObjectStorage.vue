<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">
          Edit Default Object Storage
        </div>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Volume Size</p>
        <v-text-field
          maxlength="3"
          :disabled="objectStorage && objectStorage.is_default"
          type="number"
          v-model.number="quotaSize"
          placeholder="0"
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
      <v-card-text>
        <p class="titletext">Price per Month</p>
        <v-text-field
          :class="{ hideinput: pricepermonthfocus == false }"
          maxlength="10"
          id="pricepermonth"
          v-model.number="pricePerMonth"
          placeholder="0"
          type="number"
          flat
          outlined
          @focus="pricepermonthfocus = true"
          @blur="pricepermonthfocus = false"
          :error-messages="
            $v.pricePerMonth.$errors.length
              ? $v.pricePerMonth.$errors[0].$message
              : ''
          "
        >
          <template v-slot:prepend-inner>
            <span
              ><span class="font--text">IDR | </span
              >{{
                pricepermonthfocus
                  ? ""
                  : toThousandsWithDotFormat(pricePerMonth)
              }}</span
            >
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Price per Hours</p>
        <v-text-field
          :class="{ hideinput: priceperhourfocus == false }"
          maxlength="10"
          id="pricePerHours"
          v-model.number="pricePerHours"
          placeholder="0"
          type="number"
          flat
          outlined
          @focus="priceperhourfocus = true"
          @blur="priceperhourfocus = false"
          :error-messages="
            $v.pricePerHours.$errors.length
              ? $v.pricePerHours.$errors[0].$message
              : ''
          "
        >
          <template v-slot:prepend-inner>
            <span
              ><span class="font--text">IDR | </span
              >{{
                priceperhourfocus ? "" : toThousandsWithDotFormat(pricePerHours)
              }}</span
            >
          </template>
        </v-text-field>
      </v-card-text>

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
              @click="editS3DefaultPrice"
              block
              height="50"
              depressed
              class="secondary"
            >
              <span style="font-size: 14px">Save</span></v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { toThousandsWithDotFormat } from "@/lib/formatter";
import { ref, computed } from "@vue/composition-api";
import { useDialog } from "@/composable/usedialog";
import { useNamespacedActions } from "vuex-composition-helpers";

const { required } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;

export default {
  props: ["value", "objectStorage"],
  setup(props, { emit, root }) {
    const quotaSize = ref(props.objectStorage.object_storage_size);
    const pricePerMonth = ref(props.objectStorage.price_per_month);
    const pricePerHours = ref(props.objectStorage.price_per_hours);
    const { updateS3DefaultPrice } = useNamespacedActions("MANAGEFLAVOR", [
      "updateS3DefaultPrice",
    ]);
    const { dialog } = useDialog(props, { emit, root });

    const $v = useVuelidate(
      {
        quotaSize: { required, $autoDirty: true },
        pricePerMonth: { required, $autoDirty: true },
        pricePerHours: { required, $autoDirty: true },
      },
      {
        quotaSize,
        pricePerMonth,
        pricePerHours,
      }
    );

    const editS3DefaultPrice = async () => {
      const response = await updateS3DefaultPrice({
        id: props.objectStorage.id,
        object_storage_size: quotaSize.value,
        price_per_month: pricePerMonth.value,
        price_per_hours: pricePerHours.value,
      });
      if (response.status == 200) dialog.value = false;
    };

    return {
      $v,
      dialog,
      editS3DefaultPrice,
      toThousandsWithDotFormat,
      quotaSize,
      pricePerMonth,
      pricePerHours,
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
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f2f2f2;
  }
}
</style>
