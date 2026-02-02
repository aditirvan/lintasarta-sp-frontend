<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">
          Edit Default {{ volume.type.name }} Storage
        </div>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Storage Size</p>
        <v-text-field
          maxlength="3"
          :disabled="volume && volume.is_default"
          type="number"
          v-model.number="volume_size"
          placeholder="0"
          flat
          outlined
          :error-messages="
            volume_sizeValidation.$errors.length
              ? volume_sizeValidation.$errors[0].$message
              : ''
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
          v-model.number="price_per_month"
          placeholder="0"
          type="number"
          flat
          outlined
          @focus="pricepermonthfocus = true"
          @blur="pricepermonthfocus = false"
          :error-messages="
            price_per_monthValidation.$errors.length
              ? price_per_monthValidation.$errors[0].$message
              : ''
          "
        >
          <template v-slot:prepend-inner>
            <span
              ><span class="font--text">IDR | </span
              >{{
                pricepermonthfocus
                  ? ""
                  : toThousandsWithDotFormat(price_per_month)
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
          id="priceperhours"
          v-model.number="price_per_hours"
          placeholder="0"
          type="number"
          flat
          outlined
          @focus="priceperhourfocus = true"
          @blur="priceperhourfocus = false"
        >
          :error-messages="price_per_hoursValidation.$errors.length?price_per_hoursValidation.$errors[0].$message:''"
          <template v-slot:prepend-inner>
            <span
              ><span class="font--text">IDR | </span
              >{{
                priceperhourfocus
                  ? ""
                  : toThousandsWithDotFormat(price_per_hours)
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
              @click="
                () => {
                  EditVol(volume).then(() => {
                    $emit('edited');
                    dialog = false;
                  });
                }
              "
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
import { useCreateVol } from "./useCreateVol";
import { ref } from "@vue/composition-api";
import { useDialog } from "@/composable/usedialog";
const { required, email } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;
export default {
  props: ["value", "volume"],
  setup(props, { emit, root }) {
    const { dialog } = useDialog(props, { emit, root });
    const usecreatevol = useCreateVol(props, { emit, root });
    const { volume_size, price_per_month, price_per_hours } = usecreatevol;
    volume_size.value = props.volume.volume_size;
    price_per_month.value = props.volume.price_per_month;
    // let price_per_hours = ref(0)
    price_per_hours.value = props.volume.price_per_hours;
    return {
      toThousandsWithDotFormat,
      dialog,
      ...usecreatevol,
      price_per_month,
      price_per_hours,
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
