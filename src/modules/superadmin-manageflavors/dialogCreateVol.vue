<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">
          Create Storage Flavor
        </div>
      </v-card-text>
      <v-card-text v-if="isDevMode">
        <p class="titletext">Storage Type</p>
        <v-select
          id="volumetype"
          placeholder="Select Volume Type"
          :items="type_ids"
          v-model="type_id"
          outlined
          single-line
          append-icon="mdi-chevron-down"
          :error-messages="
            type_idValidation.$errors.length
              ? type_idValidation.$errors[0].$message
              : ''
          "
        />
      </v-card-text>
      <v-card-text>
        <p class="titletext">
          Storage Size*
          <span
            v-if="volume_size < 20"
            class="error--text ml-2 pt-1"
            style="font-size: 10px"
          >
            must be atleast 20 GB
          </span>
        </p>
        <v-text-field
          maxlength="3"
          id="volumesize"
          type="number"
          v-model.number="volume_size"
          placeholder="0"
          min="0"
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
      <!-- <v-card-text>
        <p class="titletext">Price per Month</p>
        <v-text-field
          :class="{hideinput:pricepermonthfocus==false}"
          maxlength="10"
          id="pricepermonth"
          v-model.number="price_per_month"
          placeholder="0"
          min="0"
          type="number"
          flat
          outlined
          @focus="pricepermonthfocus = true"
          @blur="pricepermonthfocus = false"
          :error-messages="price_per_monthValidation.$errors.length?price_per_monthValidation.$errors[0].$message:''"

        >
        <template v-slot:prepend-inner>
          <span><span class="font--text">IDR | </span>{{pricepermonthfocus?'':Rpformat.format(price_per_month)}}</span>
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
              @click="CreateVol"
              :disabled="volume_size < 20"
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
import { useCreateVol } from "./useCreateVol";
import { ref, watch } from "@vue/composition-api";
import { useNamespacedState } from "vuex-composition-helpers";
import { MANAGEFLAVOR } from "./namespace";
import { useDialog } from "@/composable/usedialog";
import api from "@/lib/api";
const { required, email } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;

// const isDevMode = process.env.VUE_APP_DEV_MODE === 'fase-1.3'
const isDevMode = true;

export default {
  props: ["value"],
  data() {
    return {
      isDevMode,
      type_ids: [
        // {text: 'Standart', value: 'standart'},
        // {text: 'Premium', value: 'premium'}
      ],
    };
  },
  setup(props, { emit, root }) {
    const { dialog } = useDialog(props, { emit, root });
    const usecreatevol = useCreateVol(props, { emit, root });
    const { volume_size, price_per_month, type_id } = usecreatevol;
    // const {volume_size, price_per_month, price_per_hours, type_id} = usecreatevol
    // price_per_hours.value = 0
    // const {volume_size, price_per_month} = usecreatevol
    const { defaultstoragesize } = useNamespacedState(MANAGEFLAVOR, [
      "defaultstoragesize",
    ]);

    watch(volume_size, (val) => {
      price_per_month.value = val * defaultstoragesize.value[0].price_per_month;
      if (type_id.value && defaultstoragesize.value.length) {
        const defaultType = defaultstoragesize.value.find(
          (el) => el.type_id === type_id.value
        );

        if (defaultType) {
          price_per_month.value = val * defaultType.price_per_month;
        }
      }
    });

    watch(type_id, (val) => {
      if (val && defaultstoragesize.value.length) {
        const defaultType = defaultstoragesize.value.find(
          (el) => el.type_id === val
        );

        if (defaultType && volume_size.value) {
          price_per_month.value =
            volume_size.value * defaultType.price_per_month;
        }
      }
    });

    return {
      defaultstoragesize,
      Rpformat,
      dialog,
      ...usecreatevol,
      pricepermonthfocus: ref(false),
      priceperhourfocus: ref(false),
      prevent: ref(false),
    };
  },
  methods: {
    async getVolumeTypes() {
      try {
        const res = await api.GET("/flavor/storage/type");
        if (res.data.length) {
          const newArr = res.data.map((type) => {
            const { name, id } = type;

            return {
              text: name,
              value: id,
            };
          });
          this.type_ids = newArr;
        }
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying volume types"
        );
      }
    },
  },
  mounted() {
    this.getVolumeTypes();
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
