<template>
  <v-dialog v-model="value" persistent max-width="800">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text">Increase Storage Size</div>
      </v-card-title>
      <v-card-text>
        <p class="font-weight-bold" v-if="objectStorage.package_object_storage">
          Select size for your volume. Must be greater than {{ objectStorage.package_object_storage.object_storage_size }}. This change is not reversible.
        </p>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col class="pb-0" cols="12">
            <p>
              <span class="font-weight-bold mb-0">Select Volume Size</span>
              <span class="ml-2 error--text" style="font-size: 10px" v-if="$v.customSize.$errors.length"> *{{ $v.customSize.$errors[0].$message }}</span>
            </p>
          </v-col>
          <template v-if="isLoadingFlavor">
            <v-col class="pb-0" cols="12">
            <v-progress-linear indeterminate color="primary" class="my-4"></v-progress-linear>
            </v-col>
          </template>
         
          <!--  -->

          <template v-else>
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
                  <v-card-text class="pb-0 pt-4 d-flex flex-column m-0" v-if="s3DefaultPrice">
                    <div v-if="objectStorageDiscount && objectStorageDiscount > 0 && customSize">
                      <p class="body-2 mb-0" style="text-decoration: line-through">{{ toIDRWithDotFormat(calculateCustomObjectStorage()) }}/mo</p>
                      <p class="font-weight-bold blue--text mb-1">{{ toIDRWithDotFormat(calculateCustomObjectStorage(objectStorageDiscount)) }}/mo</p>
                      <p class="body-2 mb-0" style="text-decoration: line-through">
                        {{ toIDRWithDotFormat(calculateCustomObjectStorage(undefined, "hour")) }}/hour
                      </p>
                      <p class="font-weight-bold blue--text">{{ toIDRWithDotFormat(calculateCustomObjectStorage(objectStorageDiscount, "hour")) }}/hour</p>
                    </div>
                    <div v-else>
                      <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateCustomObjectStorage()) }}/mo</p>
                      <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateCustomObjectStorage(undefined, "hour")) }}/hour</p>
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

                <div v-if="listFlavorObjectStorage">
                  <div
                    v-for="objectStorageCard in listFlavorObjectStorage.filter((row) => {
                      return row.object_storage_size > objectStorage.package_object_storage.object_storage_size;
                    })"
                    :key="objectStorageCard.id"
                  >
                    <v-card
                      v-if="objectStorageCard"
                      width="170"
                      :class="{
                        highlight: volumeSelected ? is(volumeSelected.id, objectStorageCard.id) : false,
                        'highlight-error': $v.volumeSelected.$errors.length,
                      }"
                      @click="
                        () => {
                          volumeSelected = objectStorageCard;
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
                        <div v-if="objectStorageDiscount && objectStorageDiscount > 0">
                          <p class="body-2 mb-0" style="text-decoration: line-through">
                            {{ toIDRWithDotFormat(calculateObjectStorage(objectStorageCard.price_per_month)) }}/mo
                          </p>
                          <p class="font-weight-bold blue--text mb-1">
                            {{ toIDRWithDotFormat(calculateObjectStorage(objectStorageCard.price_per_month, objectStorageDiscount)) }}/mo
                          </p>
                          <p class="body-2 mb-0" style="text-decoration: line-through">
                            {{ toIDRWithDotFormat(calculateObjectStorage(objectStorageCard.price_per_hour, undefined)) }}/hour
                          </p>
                          <p class="font-weight-bold blue--text">
                            {{ toIDRWithDotFormat(calculateObjectStorage(objectStorageCard.price_per_hour, objectStorageDiscount)) }}/hour
                          </p>
                        </div>
                        <div v-else>
                          <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateObjectStorage(objectStorageCard.price_per_month)) }}/mo</p>
                          <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateObjectStorage(objectStorageCard.price_per_hour)) }}/hour</p>
                        </div>
                      </v-card-text>
                      <v-divider />
                      <v-card-text class="flavor-card">
                        <p class="font-weight-bold mb-0">{{ objectStorageCard.object_storage_size }} GB</p>
                      </v-card-text>
                    </v-card>
                  </div>
                </div>
              </v-col>
            </v-slide-group>
          </template>


          <!--  -->
         
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
                  customSize = null;
                  isCustomSizeHighlighted = false;
                  volumeSelected = false;
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
              @click="
                () => {
                  user.role.toLowerCase() !== 'superadmin' ?
                  displayObjStorageDialog() :
                  resizeVolume(objectStorage);
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

    <!-- dialog resize object storage -->
    <dialogNewServiceAvailability
      v-if="objStorageDialog" 
      :onClose="() => {objStorageDialog = false}"
      serviceName="Object Storage"
      actionName="Resize Object Storage"
      :onAvailable="() => resizeVolume(objectStorage)"
    />

  </v-dialog>
</template>
<script>
import { onMounted, ref, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState,useNamespacedMutations } from "vuex-composition-helpers";
import { IDRformat } from "../../lib/formatter";
import { useObjectStorage } from "./composableapi/useobjectstorage";
import { addGBText, removeGBText } from "@/lib/formatter";
const { requiredIf, helpers } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;
import { toIDRWithDotFormat } from "../../lib/formatter";
import { MANAGEVOUCHER } from "../superadmin-managevoucher/namespace";
import localstorage from "@/lib/localstorage";
import OBJECTSTORAGEBILLING from "./namespace";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";
import { mapGetters } from "vuex";

export default {
  components: {
    dialogNewServiceAvailability,
  },
  props: {
    value: Boolean,
    objectStorage: Object,
  },
  setup(props, context) {
    const { fetchVoucherDiscountByProjectID } = useNamespacedActions(MANAGEVOUCHER, ["fetchVoucherDiscountByProjectID"]);
    const {checkAvailability} = useNewServiceAvailability()
    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, ["voucherDiscountProject"]);
    const { getFlavorObjectStorageByRegion, getDefaultObjectStorageByRegion } = useNamespacedActions(OBJECTSTORAGEBILLING, [
      "getFlavorObjectStorageByRegion",
      "getDefaultObjectStorageByRegion",
    ]);
    const { listFlavorObjectStorage, defaultFlavorObjectStorage,isLoadingFlavor } = useNamespacedGetters(OBJECTSTORAGEBILLING, [
      "listFlavorObjectStorage",
      "defaultFlavorObjectStorage",
      "isLoadingFlavor",
    ]);

    const { setIsLoadingFlavor } = useNamespacedMutations(OBJECTSTORAGEBILLING, [
      "setIsLoadingFlavor",
    ]);
    

    const projJson = localstorage.getItem("currentProj");
    const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};

    const { isLoading } = useNamespacedState("OBJECTSTORAGE", ["isLoading"]);
    const volumeSelected = ref(null);
    const isCustomSizeHighlighted = ref(false);
    const customSize = ref(null);
    let filteredS3Flavors = ref([]);
    const objectStorageDiscount = ref(0);
    const price_per_month = ref(0);
    const price_per_hour = ref(0);
    const objStorageDialog = ref(false)

    const useComposable = {
      ...useObjectStorage(),
    };

    const { s3Flavors, fetchS3Flavors, s3DefaultPrice, fetchS3DefaultPrice,fetchUsage,objectStorageUsage } = useComposable;

    const flavorsFilter = (currentObjectStorage, flavorSize) => {
      const currentObjectStorageSize = Object.keys(currentObjectStorage).length ? currentObjectStorage.package_object_storage.object_storage_size : 0;
      if (flavorSize.organization_id) return false;
      if (flavorSize.object_storage_size > currentObjectStorageSize) return true;
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

            let tempCurrent = props.objectStorage.package_object_storage.object_storage_size;
            let size = val ? removeGBText(val) : null;
            let currentSize = val ? tempCurrent : null;

            return size > currentSize;
          }),
        },
      },
      {
        volumeSelected,
        customSize,
      }
    );

    const { increaseVolume } = useNamespacedActions("OBJECTSTORAGE", ["increaseVolume"]);

    watch(
      () => props.objectStorage,
      async (storage) => {
        await fetchS3Flavors({ limit: 999 });
      }
    );

    watch(s3Flavors, (size) => {
      filteredS3Flavors.value = s3Flavors.value
        .filter((x) => flavorsFilter(props.objectStorage || {}, x))
        .sort((a, b) => a.object_storage_size - b.object_storage_size);
    });

    
    

    onMounted(async () => {
      setIsLoadingFlavor(true); 
     
      await fetchS3Flavors({ limit: 999 });
      await fetchS3DefaultPrice();
      await fetchVoucherDiscountByProjectID(projObj.id);
      await fetchUsage({ id: props.objectStorage.id });
      console.log("objectStorageUsage", objectStorageUsage.value);
      
      const buckets = objectStorageUsage.value.data.buckets;
      console.log("buckets ", buckets);
      const idRegion= buckets.length > 0 ? buckets[0].id_region : null;
      console.log("idRegion ",idRegion);
      console.log("isLoadingFlavor ", isLoadingFlavor);
      await getFlavorObjectStorageByRegion(idRegion);
      await getDefaultObjectStorageByRegion(idRegion);

      console.log("listFlavorObjectStorage.value ", listFlavorObjectStorage.value);
      console.log("defaultFlavorObjectStorage.value ", defaultFlavorObjectStorage.value);
        if (voucherDiscountProject.value) {
          objectStorageDiscount.value = voucherDiscountProject.value.voucher_discount_detail.object_storage;
        }
    });

    const calculateCustomObjectStorage = (discount = 0, unit = "month") => {
      const size = customSize.value ? Number(customSize.value.slice(0, customSize.value.length - 3)) : 0;

      let price = 0;
      if (unit == "hour") {
        price = defaultFlavorObjectStorage.value.price_per_hour;
      } else {
        price = defaultFlavorObjectStorage.value.price_per_month;
      }

      let total = 0;
      total = price * size;

      if (discount) {
        discount = (price * size * discount) / 100;
        total = total - discount;
      }

      // return toIDRWithDotFormat(Math.round(total));
      return Math.round(total);
    };

    const calculateObjectStorage = (price, discount = 0) => {
      // let price = 0
      // if (unit == "hour") {
      //   price = s3DefaultPrice.value.price_per_hours
      // } else {
      //   price = s3DefaultPrice.value.price_per_month
      // }

      let total = 0;
      total = price;

      if (discount) {
        discount = (price * discount) / 100;
        total = total - discount;
      }

      // return toIDRWithDotFormat(Math.round(total));
      return Math.round(total);
    };

    const displayObjStorageDialog = async () => {
      $v.value.$touch()
      if ($v.value.$errors.length) return;

      await checkAvailability(
        {
          by: customSize.value ? "service" : "item", 
          item: {
            service_name: 'OBJECT_STORAGE', 
            id: customSize.value ? defaultFlavorObjectStorage.value.id : volumeSelected.value.id,
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

      objStorageDialog.value = true;
    };

    return {
      $v,
      addGBText,
      removeGBText,
      isCustomSizeHighlighted,
      customSize,
      s3DefaultPrice,
      filteredS3Flavors,
      isLoading,
      IDRformat,
      volumeSelected,
      objectStorageDiscount,
      price_per_month,
      price_per_hour,
      calculateCustomObjectStorage,
      calculateObjectStorage,
      toIDRWithDotFormat,
      isLoadingFlavor,
      is(a, b) {
        return a == b;
      },
      isSelected: (id) => {
        return id == volumeSelected.id;
      },
      resizeVolume: async (objectStorage) => {
        $v.value.$touch();
        if ($v.value.$invalid) return;

        const payload = {
          object_storage_id: objectStorage.id || null,
          package_object_storage_id: customSize.value ? defaultFlavorObjectStorage.value.id : volumeSelected.value.id,
          custom_size: customSize.value ? parseInt(removeGBText(customSize.value)) : 0,
        };

        const response = await increaseVolume(payload);
        if (response.status == 200) {
          customSize.value = null;
          volumeSelected.value = null;
          $v.value.$reset();
          context.emit("close");
        }
      },
      logging: () => console.log("DIALOG", props),
      flavorsFilter,
      listFlavorObjectStorage,
      defaultFlavorObjectStorage,
      objStorageDialog,
      displayObjStorageDialog,
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
