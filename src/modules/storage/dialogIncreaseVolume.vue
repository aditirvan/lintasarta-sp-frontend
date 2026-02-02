<template>
  <v-dialog v-model="value" persistent max-width="800">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text">Increase Storage</div>
      </v-card-title>
      <v-card-text v-if="storage && storage.storage_type">
        <p class="font-weight-bold" v-if="!isAttached">
          Select size for your volume. Must be greater than
          {{ storage && storage.size }}. This change is not reversible.
        </p>
      </v-card-text>
      <v-card-text v-else> No data available </v-card-text>
      <v-card-text v-if="!isAttached && storage && storage.storage_type">
        <v-row>
          <v-col class="pb-0" cols="12">
            <p>
              <span class="font-weight-bold mb-0">Select Volume Size</span>
              <span class="ml-2 error--text" style="font-size: 10px" v-if="$v.volumeSelected.$errors.length || $v.customSize.$errors.length">
                *{{ $v.volumeSelected.$errors[0] ? $v.volumeSelected.$errors[0].$message : $v.customSize.$errors[0].$message }}</span
              >
            </p>
          </v-col>
          <!-- v-if="filteredVolumeSize.length && value" -->
          <v-slide-group class="py-2 pt-0 ma-0" active-class="success" show-arrows>
            <v-col class="d-flex pt-0 flex-wrap">
              <v-card
                width="170"
                border-color="primary"
                outlined
                class="rounded-lg select-instance mb-4"
                :class="{
                  'highlight-error': $v.customSize.$errors.length,
                  'hightlighted selected': $v.customSize.$errors.length < 1 && isCustomSizeHighlighted,
                }"
                style="text-align: center; margin-right: 10px"
              >
                <v-card-text class="pb-0 pt-4 d-flex flex-column m-0">
                  <div v-if="storageDiscount && storageDiscount > 0 && customSize">
                    <p class="body-2 mb-0" style="text-decoration: line-through">{{ toIDRWithDotFormat(calculateCustomStorage()) }}/mo</p>
                    <p class="font-weight-bold blue--text mb-1">{{ toIDRWithDotFormat(calculateCustomStorage(storageDiscount)) }}/mo</p>

                    <p class="body-2 mb-0" style="text-decoration: line-through">{{ toIDRWithDotFormat(calculateCustomStorage(undefined, "hour")) }}/hour</p>
                    <p class="font-weight-bold blue--text">{{ toIDRWithDotFormat(calculateCustomStorage(storageDiscount, "hour")) }}/hour</p>
                  </div>
                  <div v-else>
                    <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateCustomStorage()) }}/mo</p>
                    <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateCustomStorage(undefined, "hour")) }}/hour</p>
                  </div>
                </v-card-text>
                <v-divider />
                <v-card-text class="pa-0">
                  <v-text-field
                    v-model="customSize"
                    class="px-4 pt-2"
                    @keydown="(ev) => (customSize = addGBText(ev, customSize))"
                    style="width: 170px"
                    max="100"
                    flat
                    label="Enter Size in GB"
                    @click="
                      () => {
                        volumeSelected = null;
                        isCustomSizeHighlighted = true;
                      }
                    "
                    @blur="() => (isCustomSizeHighlighted = !customSize ? false : true)"
                  ></v-text-field>
                </v-card-text>
              </v-card>
              <div
                v-for="storageCard in listInstanceRootDisk.filter((row) => {
                  return row.volume_size > parseInt(removeGBText(storage.size));
                })"
                :key="storageCard.id"
              >
                <v-card
                  width="170"
                  :class="{
                    highlight: volumeSelected ? is(volumeSelected.id, storageCard.id) : false,
                    'highlight-error': $v.volumeSelected.$errors.length,
                  }"
                  @click="
                    () => {
                      volumeSelected = storageCard;
                      customSize = null;
                      isCustomSizeHighlighted = false;
                    }
                  "
                  border-color="primary"
                  outlined
                  class="rounded-lg select-instance mb-4"
                  style="text-align: center; margin-right: 10px"
                >
                  <v-card-text class="pb-0 pt-4 px-2">
                    <div v-if="storageDiscount && storageDiscount > 0">
                      <p class="body-2 mb-0" style="margin-bottom: 2.5rem; text-decoration: line-through">
                        {{ toIDRWithDotFormat(calculateStorage(storageCard.price_per_month)) }}/mo
                      </p>
                      <p class="font-weight-bold blue--text mb-1" style="margin-bottom: 2.5rem">
                        {{ toIDRWithDotFormat(calculateStorage(storageCard.price_per_month, storageDiscount)) }}/mo
                      </p>
                      <p class="body-2 mb-0" style="text-decoration: line-through">
                        {{ toIDRWithDotFormat(calculateStorage(storageCard.price_per_hour)) }}/hour
                      </p>
                      <p class="font-weight-bold blue--text">{{ toIDRWithDotFormat(calculateStorage(storageCard.price_per_hour, storageDiscount)) }}/hour</p>
                    </div>
                    <div v-else>
                      <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateStorage(storageCard.price_per_month)) }}/mo</p>
                      <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateStorage(storageCard.price_per_hour)) }}/hour</p>
                    </div>
                  </v-card-text>
                  <v-divider />
                  <v-card-text class="flavor-card">
                    <p class="font-weight-bold mb-0">{{ storageCard.volume_size }} GB</p>
                  </v-card-text>
                </v-card>
              </div>
            </v-col>
          </v-slide-group>
        </v-row>
      </v-card-text>
      <v-card-text v-if="storage && isAttached">
        Your storage is attached to
        <b class="primary--text">{{ storage.instance.instanceName }}</b
        >. Please detach selected storage from <b class="primary--text">{{ storage.instance.instanceName }}</b> before increasing volume size.
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              depressed
              height="50"
              color="accent"
              block
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              depressed
              height="50"
              color="secondary"
              block
              :disabled="isLoading || isAttached"
              @click="
                () => {
                  user.role.toLowerCase() !== 'superadmin' ?
                  displayStorageDialog() :
                  resizeVolume(storage)
                }
              "
            >
              <div v-if="isLoading">
                <beat-loader :loading="isLoading" color="white" size="10px"></beat-loader>
              </div>
              <span v-else> Resize Volume </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <!-- dialog resize storage -->
    <dialogNewServiceAvailability
      v-if="storageDialog" 
      :onClose="() => {storageDialog = false}"
      serviceName="Storage"
      actionName="Resize Storage"
      :onAvailable="() => resizeVolume(storage)"
    />

  </v-dialog>
</template>
<script>
import { onMounted, ref, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { toIDRWithDotFormat } from "../../lib/formatter";
import { useStorage } from "../instance/compositionapi/usestorage";

const { required, requiredIf, helpers } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;
import { addGBText, removeGBText } from "@/lib/formatter";
import { MANAGEVOUCHER } from "../superadmin-managevoucher/namespace";
import localstorage from "@/lib/localstorage";
import { STORAGE } from "./namespace";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";
import { mapGetters } from "vuex";

export default {
  components: {
    dialogNewServiceAvailability,
  },
  props: {
    value: Boolean,
    storage: Object,
  },
  setup(props, context) {
    const { isLoading } = useNamespacedState("STORAGE", ["isLoading"]);
    let { volumeSize } = useNamespacedState("STORAGE", ["volumeSize"]);

    const projJson = localstorage.getItem("currentProj");
    const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};

    const { fetchVoucherDiscountByProjectID } = useNamespacedActions(MANAGEVOUCHER, ["fetchVoucherDiscountByProjectID"]);
    const {checkAvailability} = useNewServiceAvailability()
    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, ["voucherDiscountProject"]);
    const { getListInstanceRootDisk, getDefaultPriceStorage } = useNamespacedActions(STORAGE, ["getListInstanceRootDisk", "getDefaultPriceStorage"]);
    const { listInstanceRootDisk, defaultPriceStorage } = useNamespacedGetters(STORAGE, ["listInstanceRootDisk", "defaultPriceStorage"]);
    let isAttached = ref(false);
    const volumeSelected = ref(null);
    const isCustomSizeHighlighted = ref(false);
    const customSize = ref(null);
    let filteredVolumeSize = ref([]);
    const storageDiscount = ref(0);
    const price_per_month = ref(0);
    const price_per_hour = ref(0);
    const storageDialog = ref(false)

    const { defaultstoragesize, fetchdefaultstoragesize } = useStorage();

    isAttached.value = !!(props.storage && props.storage.instance ? true : false);
    const filterBiggerVolumeSize = (currentStorage, flavorSize) => {
      const currentStorageSize = Object.keys(currentStorage).length ? currentStorage.size.split(" ")[0] : 0;
      if (flavorSize > currentStorageSize) return true;
      return false;
    };

    const $v = useVuelidate(
      {
        volumeSelected: {
          required: requiredIf((val) => {
            return customSize.value === null && volumeSelected.value === null;
          }),
          autoDirty: true,
        },
        customSize: {
          autoDirty: true,
          required: requiredIf((val) => {
            return customSize.value === null && volumeSelected.value === null;
          }),
          bigger: helpers.withMessage(`Value must be greater than current storage size`, (val) => {
            if (customSize.value === null) return true;
            let size = val ? removeGBText(val) : null;
            let currentSize = val ? removeGBText(props.storage.size) : null;
            return size > currentSize;
          }),
        },
      },
      {
        volumeSelected,
        customSize,
      }
    );

    // watch(
    //   () => props.storage,
    //   async (storage) => {
    //     isAttached.value = props.storage && props.storage.instance ? true : false;
    //     await fetchVolumeSize({ limit: 999 });
    //   }
    // );

    watch(volumeSize, (size) => {
      filteredVolumeSize.value = volumeSize.value.filter((x) => filterBiggerVolumeSize(props.storage || {}, x.volume_size));
    });

    const { fetchVolumeSize, RESIZE_VOLUME } = useNamespacedActions("STORAGE", ["fetchVolumeSize", "RESIZE_VOLUME"]);
    onMounted(async () => {
      const params = new URLSearchParams();
      params.append("storage_type_id", props.storage.package_storage.type_id);
      await getListInstanceRootDisk(params);
      await getDefaultPriceStorage(params);
      await fetchVolumeSize({ limit: 999 });
      // await fetchdefaultstoragesize();
      await fetchVoucherDiscountByProjectID(projObj.id);
      if (voucherDiscountProject.value) {
        storageDiscount.value = voucherDiscountProject.value.voucher_discount_detail.storage;
      }
    });

    const calculateCustomStorage = (discount = 0, unit = "month") => {
      const size = customSize.value ? Number(customSize.value.slice(0, customSize.value.length - 3)) : 0;

      let price = 0;
      if (unit == "hour") {
        price = defaultPriceStorage.value.price_per_hour;
      } else {
        price = defaultPriceStorage.value.price_per_month;
      }

      let total = 0;
      total = price * size;

      if (discount) {
        discount = (price * size * discount) / 100;
        total = total - discount;
      }

      // return toIDRWithDotFormat(Math.round(total))
      return Math.round(total);
    };

    const calculateStorage = (price, discount = 0) => {
      let total = 0;
      total = price;

      if (discount) {
        discount = (price * discount) / 100;
        total = total - discount;
      }

      // return toIDRWithDotFormat(Math.round(total))
      return Math.round(total);
    };

    const displayStorageDialog = async () => {
      $v.value.$touch()
      if ($v.value.$errors.length) return;

      await checkAvailability(
        {
          by: customSize.value ? "service" : "item", 
          item: {
            service_name: 'STORAGE', 
            id: customSize.value ? defaultPriceStorage.value.id : volumeSelected.value.id,
            ...( 
              customSize.value ? 
              {
                tags: [{
                  name:'Volume',
                  qty: parseInt(removeGBText(customSize.value)),
                }]
              }
              :
              {}
            )
          }
        }
      )

      storageDialog.value = true;
    };


    return {
      defaultstoragesize,
      $v,
      addGBText,
      removeGBText,
      isCustomSizeHighlighted,
      customSize,
      isAttached,
      filteredVolumeSize,
      isLoading,
      toIDRWithDotFormat,
      volumeSize,
      volumeSelected,
      storageDiscount,
      calculateCustomStorage,
      calculateStorage,
      is(a, b) {
        return a == b;
      },
      isSelected: (id) => {
        return id == volumeSelected.id;
      },
      resizeVolume: async (storage) => {
        $v.value.$touch();
        if ($v.value.$invalid) return;

        const payload = {
          storage_id: storage.id || null,
          package_storage_id: customSize.value ? defaultPriceStorage.value.id : volumeSelected.value.id,
          custom_size: customSize.value ? parseInt(removeGBText(customSize.value)) : 0,
        };

        // if (volumeSelected.value) {
        //   payload.package_storage_id = volumeSelected.value.id;
        //   payload.custom_size = volumeSelected.value.volume_size;
        // }
        // if (customSize.value) {
        //   const flavorSameSize = volumeSize.value.filter((x) => parseInt(x.volume_size) === parseInt(removeGBText(customSize.value)));
        //   if (flavorSameSize.length > 0) payload.package_storage_id = flavorSameSize[0].id;
        //   payload.custom_size = parseInt(removeGBText(customSize.value));
        // }
        const response = await RESIZE_VOLUME(payload);
        if (response.status == 200) {
          customSize.value = null;
          volumeSelected.value = null;
          $v.value.$reset();
          context.emit("close");
        }
      },
      logging: () => console.log("DIALOG", props),
      filterBiggerVolumeSize,
      defaultPriceStorage,
      listInstanceRootDisk,
      price_per_month,
      price_per_hour,
      storageDialog,
      displayStorageDialog,
    };
  },
  computed: {
    ...mapGetters({
      user: "ROLEPERMISSION/getuser",
    }),
  },
};
</script>
<style lang="scss" scoped>
.select-instance,
.select-storage {
  cursor: pointer;

  &.selected {
    border-color: #2c94d2;

    .v-divider {
      border-color: #2c94d2;
    }
  }
}

.v-card.select-storage {
  p {
    margin-bottom: 0px;
    text-align: left;
  }
}

.v-card__title {
  line-height: 1.5rem;
}

.highlight {
  border: 1px solid #2c94d2;
}

.v-btn {
  ::v-deep .v-btn__content {
    font-size: 14px;
    font-weight: 700;
  }
}
</style>
