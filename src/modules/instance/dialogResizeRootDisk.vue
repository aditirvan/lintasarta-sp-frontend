<template>
  <v-dialog :value="value" @close="$emit('close')" persistent max-width="800">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text">
          Increase Root Disk Size
        </div>
      </v-card-title>
      <v-card-text>
        <p class="font-weight-bold">
          Select size for your root disk. Must be greater than
          {{ currentRootDisk }} GB. This change is not reversible.
        </p>
        <p>
          Note: Selected instance will be automatically turned off before the
          root disk size increased.
        </p>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col class="pb-0" cols="12">
            <p>
              <span class="font-weight-bold mb-0">Select Volume Size</span>
              <span
                class="ml-2 error--text"
                style="font-size: 10px"
                v-if="
                  $v.volumeSelected.$errors.length ||
                  $v.customSize.$errors.length
                "
              >
                *{{
                  $v.volumeSelected.$errors[0]
                    ? $v.volumeSelected.$errors[0].$message
                    : $v.customSize.$errors[0].$message
                }}</span
              >
            </p>
          </v-col>
          <v-col class="d-flex pt-0 flex-wrap">
            <v-card
              width="170"
              border-color="primary"
              outlined
              class="rounded-lg select-instance mb-4"
              :class="{
                'highlight-error': $v.customSize.$errors.length,
                'hightlighted selected':
                  $v.customSize.$errors.length < 1 && isCustomSizeHighlighted,
              }"
              style="text-align: center; margin-right: 10px"
            >
              <v-card-text class="pb-0 pt-4 d-flex flex-column m-0">
                <div v-if="rootDiskDiscount && rootDiskDiscount > 0 && customSize">
                  <p class="body-2 mb-0" style="text-decoration: line-through">
                    {{ calculateCustomRootDisk() }}/mo
                  </p>
                  <p class="font-weight-bold blue--text mb-1">
                    {{ calculateCustomRootDisk(rootDiskDiscount) }}/mo
                  </p>

                  <p class="body-2 mb-0" style="text-decoration: line-through">
                    {{ calculateCustomRootDisk(undefined, 'hour') }}/hour
                  </p>
                  <p class="font-weight-bold blue--text">
                    {{ calculateCustomRootDisk(rootDiskDiscount, 'hour') }}/hour
                  </p>
                </div>
                <div v-else>
                  <p class="font-weight-bold mb-0">
                    {{ calculateCustomRootDisk() }}/mo
                  </p>
                  <p class="font-weight-bold">
                    {{ calculateCustomRootDisk(undefined, 'hour') }}/hour
                  </p>
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
                  @blur="
                    () => (isCustomSizeHighlighted = !customSize ? false : true)
                  "
                ></v-text-field>
              </v-card-text>
            </v-card>
            <div
              v-for="storageCard in listInstanceRootDisk.filter((row) => {
                return row.volume_size > parseInt(removeGBText(currentRootDisk));
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
                  <div v-if="rootDiskDiscount && rootDiskDiscount > 0">
                    <p class="body-2 mb-0" style="margin-bottom: 2.5rem; text-decoration: line-through">
                      {{ calculateRootDisk(storageCard.price_per_month) }}/mo
                    </p>
                    <p class="font-weight-bold blue--text mb-1" style="margin-bottom: 2.5rem">
                      {{ calculateRootDisk(storageCard.price_per_month, rootDiskDiscount) }}/mo
                    </p>
                    <p class="body-2 mb-0" style="text-decoration: line-through">
                      {{ calculateRootDisk(storageCard.price_per_hour) }}/hour
                    </p>
                    <p class="font-weight-bold blue--text">{{ calculateRootDisk(storageCard.price_per_hour, rootDiskDiscount) }}/hour</p>
                  </div>
                  <div v-else>
                    <p class="font-weight-bold mb-0">{{ calculateRootDisk(storageCard.price_per_month) }}/mo</p>
                    <p class="font-weight-bold">{{ calculateRootDisk(storageCard.price_per_hour) }}/hour</p>
                  </div>
                </v-card-text>
                <v-divider />
                <v-card-text class="flavor-card">
                  <p class="font-weight-bold mb-0">{{ storageCard.volume_size }} GB</p>
                </v-card-text>
              </v-card>
            </div>

            <!-- <div v-for="storage in filteredVolumeSize" :key="storage.id">
              <v-card
                v-if="
                  storage.volume_size &&
                  selectedInstance.storage_type === storage.type.name
                "
                width="170"
                :class="{
                  highlight: volumeSelected
                    ? is(volumeSelected.id, storage.id)
                    : false,
                  'highlight-error': $v.volumeSelected.$errors.length,
                }"
                @click="
                  () => {
                    volumeSelected = storage;
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
                  <div v-if="rootDiskDiscount && rootDiskDiscount > 0">
                      <p class="body-2 mb-0" style="text-decoration: line-through">
                        {{ calculateRootDisk(storage.volume_size, storage.type_id) }}/mo
                      </p>
                      <p class="font-weight-bold blue--text mb-1">
                        {{ calculateRootDisk(storage.volume_size, storage.type_id, rootDiskDiscount) }}/mo
                      </p>

                      <p class="body-2 mb-0" style="text-decoration: line-through">
                        {{ calculateRootDisk(storage.volume_size, storage.type_id, undefined, 'hour') }}/hour
                      </p>
                      <p class="font-weight-bold blue--text">
                        {{ calculateRootDisk(storage.volume_size, storage.type_id, rootDiskDiscount, 'hour') }}/hour
                      </p>
                    </div>
                    <div v-else>
                      <p class="font-weight-bold mb-0">
                        {{ calculateRootDisk(storage.volume_size, storage.type_id) }}/mo
                      </p>
                      <p class="font-weight-bold">
                        {{ calculateRootDisk(storage.volume_size, storage.type_id, undefined, 'hour') }}/hour
                      </p>
                    </div>
                </v-card-text>
                <v-divider />
                <v-card-text class="flavor-card">
                  <p class="font-weight-bold mb-0">
                    {{ storage.volume_size }} GB
                  </p>
                </v-card-text>
              </v-card>
            </div> -->
          </v-col>
        </v-row>
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
                  volumeSelected = null;
                  customSize = null;
                  $v.$reset();
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
              :disabled="isLoading"
              @click="() => {
                user.role.toLowerCase() !== 'superadmin' ?
                displayRootdiskDialog() :
                doResizeRootDisk()
                
              }"
            >
              <beat-loader
                v-if="isLoading"
                :loading="isLoading"
                color="white"
                size="10px"
              ></beat-loader>
              <span v-else>Resize Root Disk</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <!-- dialog resize rootdisk -->
    <dialogNewServiceAvailability
      v-if="rootdiskDialog" 
      :onClose="() => {rootdiskDialog = false}"
      serviceName="Rootdisk"
      actionName="Resize Rootdisk"
      :onAvailable="doResizeRootDisk"
    />
  </v-dialog>
</template>
<script>
import { computed, ref, watch, onMounted } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedState,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { toIDRWithDotFormat } from "../../lib/formatter";
import { addGBText, removeGBText } from "@/lib/formatter";
import { useStorage } from "../instance/compositionapi/usestorage";
import { MANAGEVOUCHER } from "../superadmin-managevoucher/namespace";
import { STORAGE } from "@/modules/storage/namespace";
import localstorage from "@/lib/localstorage";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";
import { mapGetters } from "vuex";

const { required, requiredIf, helpers } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;

export default {
  components: {
    dialogNewServiceAvailability,
  },
  props: {
    value: Boolean,
    selectedInstance: Object,
  },
  setup(props, context) {
    const { fetchVoucherDiscountByProjectID } = useNamespacedActions(MANAGEVOUCHER, [
      "fetchVoucherDiscountByProjectID",
    ]);
    const { getListInstanceRootDisk, getDefaultPriceStorage } = useNamespacedActions(STORAGE, ["getListInstanceRootDisk", "getDefaultPriceStorage"]);

    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, [
      "voucherDiscountProject",
    ]);
    const { listInstanceRootDisk, defaultPriceStorage } = useNamespacedGetters(STORAGE, ["listInstanceRootDisk", "defaultPriceStorage"]);

    const {checkAvailability} = useNewServiceAvailability()

    const projJson = localstorage.getItem("currentProj");
    const projObj =  projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};

    const { isLoading } = useNamespacedState("STORAGE", ["isLoading"]);
    let { volumeSize } = useNamespacedState("STORAGE", ["volumeSize"]);
    const filterBiggerVolumeSize = (currentStorage, flavorSize) => {
      if (flavorSize > currentStorage) return true;
      return false;
    };

    // const { defaultstoragesize, fetchdefaultstoragesize } = useStorage();
    const rootDiskDiscount = ref(0);

    onMounted(async () => {
      // await fetchdefaultstoragesize();
      const params = new URLSearchParams();
      params.append("storage_type_id", props.selectedInstance.package.root_disk_type_id);
      await getListInstanceRootDisk(params);
      await getDefaultPriceStorage(params);
      await fetchVoucherDiscountByProjectID(projObj.id)
      if (voucherDiscountProject.value) {
        rootDiskDiscount.value = voucherDiscountProject.value.voucher_discount_detail.root_disk
      }
    });

    const isCustomSizeHighlighted = ref(false);
    const customSize = ref(null);
    const currentRootDisk = ref(0);
    currentRootDisk.value = props.selectedInstance.package?.root_disk;
    const rootdiskDialog = ref(false)

    let filteredVolumeSize = ref([]);
    const volumesWithSameType = computed(() => {
      if (!props.selectedInstance.package?.root_disk_type) {
        return [];
      }

      return filteredVolumeSize.value.filter(
        (s) => s.type_id === props.selectedInstance.package.root_disk_type
      );
    });

    watch(
      () => props.selectedInstance,
      (size) => {
        if (!props.selectedInstance.package) return;
        currentRootDisk.value = props.selectedInstance.package.root_disk;
        filteredVolumeSize.value = volumeSize.value
          .filter((x) => {
            if (showCustomDiskFlavors) {
              if (x.organization_id) return true;
              else return false;
            } else {
              if (x.organization_id) return false;
              else return true;
            }
          })
          .filter((x) =>
            filterBiggerVolumeSize(currentRootDisk.value, x.volume_size)
          );
      }
    );

    watch(volumeSize, (size) => {
      if (!props.selectedInstance.package) return;
      filteredVolumeSize.value = volumeSize.value
        .filter((x) => {
          if (showCustomDiskFlavors) {
            if (x.organization_id) return true;
            else return false;
          } else {
            if (x.organization_id) return false;
            else return true;
          }
        })
        .filter((x) =>
          filterBiggerVolumeSize(currentRootDisk.value, x.volume_size)
        );
    });

    const { fetchVolumeSize } = useNamespacedActions("STORAGE", [
      "fetchVolumeSize",
      "RESIZE_VOLUME",
    ]);
    const { resizeRootDisk } = useNamespacedActions("INSTANCE", [
      "resizeRootDisk",
    ]);

    watch(
      props.selectedInstance,
      (val) => {
        if (!val) {
          return;
        }

        fetchVolumeSize({ limit: 999, type_id: val.package.root_disk_type });
      },
      { immediate: true }
    );

    const volumeSelected = ref(null);
    const showCustomDiskFlavors =
      process.env.VUE_APP_SHOW_CUSTOM_DISK_FLAVORS == "true";

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
          bigger: helpers.withMessage(
            `Value must be greater than current root disk size`,
            (val) => {
              if (customSize.value === null) return true;
              let size = val ? removeGBText(val) : null;
              return size > currentRootDisk.value;
            }
          ),
          moreThan20: helpers.withMessage(
            "Custom size must be atleast 20 GB",
            (val) => {
              if (customSize.value === null) return true;
              let size = val ? removeGBText(val) : null;
              return size >= 20;
            }
          ),
        },
      },
      {
        volumeSelected,
        customSize,
      }
    );

    const calculateCustomRootDisk = (discount = 0, unit = "month") => {
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

      return toIDRWithDotFormat(Math.round(total))
    };

    const calculateRootDisk = (price, discount = 0) => {
      let total = 0;
      total = price;

      if (discount) {
        discount = (price * discount) / 100;
        total = total - discount;
      }

      return toIDRWithDotFormat(Math.round(total))
    };

    const displayRootdiskDialog = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      await checkAvailability(
        {
          by: customSize.value ? "service" : "item", 
          item: {
            service_name: 'ROOT_DISK', 
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

      rootdiskDialog.value = true;
    }

    return {
      // defaultstoragesize,
      showCustomDiskFlavors,
      $v,
      addGBText,
      removeGBText,
      isCustomSizeHighlighted,
      customSize,
      currentRootDisk,
      filteredVolumeSize,
      defaultPriceStorage,
      isLoading,
      toIDRWithDotFormat,
      volumeSize,
      volumeSelected,
      rootDiskDiscount,
      calculateCustomRootDisk,
      calculateRootDisk,
      listInstanceRootDisk,
      rootdiskDialog,
      displayRootdiskDialog,
      is(a, b) {
        return a == b;
      },
      isSelected: (id) => {
        return id == volumeSelected.id;
      },
      doResizeRootDisk: async () => {
        $v.value.$touch();
        if ($v.value.$invalid) return;

        let payload = {
          instance_id: props.selectedInstance.id || null,
        };

        if (volumeSelected.value)
          payload.vm_root_disk_id = volumeSelected.value.id;
        if (customSize.value) {
          const flavorSameSize = volumesWithSameType.value.filter(
            (x) =>
              parseInt(x.volume_size) ===
              parseInt(removeGBText(customSize.value))
          );
          if (flavorSameSize.length > 0)
            payload.vm_root_disk_id = flavorSameSize[0].id;
          else payload.custom_size = parseInt(removeGBText(customSize.value));
        }

        const response = await resizeRootDisk(payload);
        customSize.value = null;
        $v.value.$reset();
        if (response) context.emit("close");
      },
      logging: () => console.log("DIALOG", props),
      filterBiggerVolumeSize,
    };
  },
  computed: {
    ...mapGetters({
      user: "ROLEPERMISSION/getuser",
    }),
  },
};
</script>
<style lang="css">
#customSize .v-label--active {
  top: 10px !important;
}
</style>
<style lang="scss" scoped>
.highlight {
  border: 1px solid #2c94d2;
}

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

.v-btn {
  ::v-deep .v-btn__content {
    font-size: 14px;
    font-weight: 700;
  }
}

.highlight-error {
  border: 1px solid red;
}
</style>
