<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div
          style="text-transform: capitalize"
          class="headline font-weight-bold font--text"
        >
          Edit Default {{ item.name }} Price
        </div>
      </v-card-text>
      <v-card-text>
        <p style="text-transform: capitalize" class="titletext">
          {{ item.name }} Size
        </p>
        <v-text-field
          maxlength="3"
          disabled
          type="number"
          v-model.number="item.total"
          placeholder="0"
          flat
          outlined
        >
          <template v-slot:append>
            <span class="font--text">{{ unit }}</span>
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
        <p class="titletext">Price per Hour</p>
        <v-text-field
          :class="{ hideinput: priceperhourfocus == false }"
          maxlength="10"
          id="priceperhour"
          v-model.number="price_per_hours"
          type="number"
          placeholder="0"
          flat
          outlined
          @focus="priceperhourfocus = true"
          @blur="priceperhourfocus = false"
          :error-messages="
            price_per_hoursValidation.$errors.length
              ? price_per_hoursValidation.$errors[0].$message
              : ''
          "
        >
          <template v-slot:prepend-inner>
            <span
              ><span class="font--text">IDR | </span>
              {{
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
              block
              @click="
                () => {
                  EditDef().then(() => {
                    dialog = false;
                  });
                }
              "
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
import { Rpformat } from "@/lib/formatter";
import { useEditDef } from "./useEditDef";
import { ref } from "@vue/composition-api";
import { useDialog } from "@/composable/usedialog";
import { toThousandsWithDotFormat } from "@/lib/formatter";

export default {
  props: ["value", "item", "unit"],
  setup(props, { emit, root }) {
    const { dialog } = useDialog(props, { emit, root });
    const useeditdef = useEditDef(props, { emit, root });
    const { total, price_per_month, price_per_hours } = useeditdef;
    total.value = props.item.total;
    price_per_month.value = props.item.price_per_month;
    price_per_hours.value = props.item.price_per_hours;
    return {
      toThousandsWithDotFormat,
      dialog,
      ...useeditdef,
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
