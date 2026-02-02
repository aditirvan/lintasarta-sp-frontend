<template>
  <div>
    <!-- contoh template -->
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg pa-7" flat>
          <v-row>
            <v-col cols="12">
              <div class="headline font-weight-bold font--text">Create Storage</div>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>Block storage volumes are created in the same region and project as the Instance they are attached to.</p>
            </v-col>
          </v-row>

          <v-row v-if="isDevModeStorageTiering && psid === undefined">
            <v-col md="6" sm="12">
              <p class="font-weight-bold">Storage Type</p>
              <v-select
                id="SelectType"
                v-model="type_id"
                outlined
                placeholder="Select a Storage Type"
                :items="listStorageTypeBilling"
                item-value="id"
                @change="changeTypeStorage($event)"
                :error-messages="$v.type_id.$errors.length ? $v.type_id.$errors[0].$message : ''"
              >
                <template v-slot:selection="{ item }"> {{ item.name }} - {{ item.description }} </template>
                <template v-slot:item="{ item }"> {{ item.name }} - {{ item.description }} </template>
                <!-- :item-text="(item)=>`${item.name} ${item.description}`" -->
              </v-select>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col md="6" sm="12">
              <p class="font-weight-bold">Use Snapshot As A Source</p>
              <v-text-field maxlength="50" id="TypeFromSource" v-model="typeFromSource" full-width outlined disabled> </v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="type_id && psid === undefined">
            <v-col class="pb-0" cols="12">
              <p :class="{ 'error--text': $v.storageselected.$errors.length }">
                <span class="font-weight-bold mb-0">Select Volume Size</span>
                <span class="ml-2" style="font-size: 10px; position: absolute" v-if="$v.storageselected.$errors.length">
                  *{{ $v.storageselected.$errors[0].$message }}</span
                >
              </p>
            </v-col>
            <v-slide-group class="py-4 pt-0" active-class="success" show-arrows>
              <v-col class="d-flex pt-0 flex-wrap">
                <v-card
                  width="170"
                  border-color="primary"
                  outlined
                  :class="`rounded-lg select-instance mb-4 ${isCustomSizeHighlighted ? 'hightlighted selected' : ''}`"
                  style="text-align: center; margin-right: 20px"
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
                      class="px-4 pt-2 mt-2"
                      @keydown="(ev) => (customSize = addGBText(ev, customSize))"
                      style="width: 170px"
                      max="100"
                      flat
                      label="Enter Size in GB"
                      @click="
                        () => {
                          storageselected = null;
                          isCustomSizeHighlighted = true;
                        }
                      "
                      @blur="() => (isCustomSizeHighlighted = !customSize ? false : true)"
                    ></v-text-field>
                  </v-card-text>
                </v-card>
                <!-- <div
                  v-for="storage in filteredVolumeSizes"
                  :key="storage.id"
                > -->
                <div v-for="storage in listInstanceRootDisk" :key="storage.id">
                  <v-card
                    v-if="storage.volume_size"
                    width="170"
                    :class="{
                      highlight: storageselected ? is(storageselected.id, storage.id) : false,
                    }"
                    @click="
                      () => {
                        storageselected = storage;
                        customSize = null;
                        isCustomSizeHighlighted = false;
                      }
                    "
                    border-color="primary"
                    outlined
                    class="rounded-lg select-instance mb-4"
                    style="text-align: center; margin-right: 20px"
                  >
                    <!-- <v-card-text class="pb-0 pt-5"> -->
                    <v-card-text v-if="type_id" class="pb-0 pt-5">
                      <div v-if="storageDiscount && storageDiscount > 0">
                        <p class="body-2 mb-0" style="margin-bottom: 2.5rem; text-decoration: line-through">
                          {{ toIDRWithDotFormat(calculateStorage(storage.price_per_month)) }}/mo
                        </p>
                        <p class="font-weight-bold blue--text mb-1" style="margin-bottom: 2.5rem">
                          {{ toIDRWithDotFormat(calculateStorage(storage.price_per_month, storageDiscount)) }}/mo
                        </p>
                        <p class="body-2 mb-0" style="text-decoration: line-through">{{ toIDRWithDotFormat(calculateStorage(storage.price_per_hour)) }}/hour</p>
                        <p class="font-weight-bold blue--text">{{ toIDRWithDotFormat(calculateStorage(storage.price_per_hour, storageDiscount)) }}/hour</p>
                      </div>
                      <div v-else>
                        <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateStorage(storage.price_per_month)) }}/mo</p>
                        <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateStorage(storage.price_per_hour, storageDiscount)) }}/hour</p>
                      </div>
                    </v-card-text>
                    <v-card-text v-if="!type_id" class="pb-0 pt-5">
                      <div v-if="storageDiscount && storageDiscount > 0">
                        <p class="body-2 mb-0" style="margin-bottom: 2.5rem; text-decoration: line-through">
                          {{ toIDRWithDotFormat(calculateStorage(storage.price_per_month)) }}/mo
                        </p>
                        <p class="font-weight-bold blue--text mb-1" style="margin-bottom: 2.5rem">
                          {{ toIDRWithDotFormat(calculateStorage(storage.price_per_month, storageDiscount)) }}/mo
                        </p>
                        <p class="body-2 mb-0" style="text-decoration: line-through">{{ toIDRWithDotFormat(calculateStorage(storage.price_per_hour)) }}/hour</p>
                        <p class="font-weight-bold blue--text">{{ toIDRWithDotFormat(calculateStorage(storage.price_per_hour, storageDiscount)) }}/hour</p>
                      </div>
                      <div v-else>
                        <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateStorage(storage.price_per_month)) }}/mo</p>
                        <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateStorage(storage.price_per_hour, storageDiscount)) }}/hour</p>
                      </div>
                    </v-card-text>
                    <v-divider />
                    <v-card-text class="flavor-card">
                      <p class="font-weight-bold mb-0">{{ storage.volume_size }} GB</p>
                    </v-card-text>
                  </v-card>
                </div>
              </v-col>
            </v-slide-group>
          </v-row>

          <v-divider class="mb-3" />

          <v-row>
            <v-col>
              <div class="d-flex flex-row align-center">
                <p class="mb-0">
                  <b>Do you want to attach this storage to an instance or not?</b>
                </p>
                <div style="width: 30px"></div>
                <input type="radio" id="yes" value="true" name="attach" v-model="attachstorage" />
                <div style="width: 10px"></div>

                <label :class="{ 'error--text': $v.attachstorage.$errors.length }" for="yes">Yes</label>

                <div style="width: 30px"></div>
                <input type="radio" id="no" value="false" name="attach" v-model="attachstorage" />
                <div style="width: 10px"></div>
                <label :class="{ 'error--text': $v.attachstorage.$errors.length }" for="no">No</label>
              </div>
              <p class="error--text" style="font-size: 12px; position: relative; left: 430px" v-if="$v.attachstorage.$errors.length">
                {{ $v.attachstorage.$errors[0].$message }}
              </p>
            </v-col>
          </v-row>

          <v-row v-if="attachstorage == 'true'">
            <v-col md="6" sm="12">
              <p class="font-weight-bold">Select Instance</p>
              <v-autocomplete
                id="SelectInstance"
                v-model="instanceselected"
                :no-data-text="isInstancesLoading ? 'Loading..' : 'No data available'"
                :items="instancesActive"
                outlined
                placeholder="Select an Instance"
                :error-messages="$v.instanceselected.$errors.length ? $v.instanceselected.$errors[0].$message : ''"
              >
                <template v-slot:selection="{ item }">
                  {{ item.text }}
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="6" sm="12">
              <p class="font-weight-bold">Name Volume</p>
              <v-text-field
                maxlength="50"
                id="NameVolume"
                v-model="volumename"
                full-width
                placeholder="Type volume name"
                outlined
                :error-messages="createErrorMessage('volumename')"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-divider />
          <br />

          <v-row>
            <v-col cols="12" md="6" class="py-0">
              <p><b>Billing Type</b></p>
              <v-select
                id="billingType"
                placeholder="Choose Instance Billing Type"
                v-model="selectedBillingType"
                :items="billingTypes"
                :error-messages="createErrorMessage('selectedBillingType')"
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <br />

          <v-row>
            <v-col cols="12" md="6" class="py-0">
              <p><b>Zone</b></p>
              <v-select
                id="SelectZone"
                v-model="selectedZoneModel"
                outlined
                :items="selectZones"
                placeholder="Choose Zone"
                :error-messages="createErrorMessage('selectedZoneModel')"
              >
              </v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6" class="" v-if="selectedBillingType == 'Trial'">
              <p><b>Trial Voucher</b></p>
              <v-select
                id="trialVoucher"
                placeholder="Choose trial voucher to use"
                v-model="selectedTrialVoucher"
                :error-messages="$v.selectedTrialVoucher.$errors.length ? $v.selectedTrialVoucher.$errors[0].$message : ''"
                :items="vouchers"
                item-value="id"
                outlined
              >
                <template v-slot:selection="{ item }"> {{ item.name }} - {{ item.code }} </template>
                <template v-slot:item="{ item }"> {{ item.name }} - {{ item.code }} </template>
              </v-select>
            </v-col>
          </v-row>

          <!-- btns -->
          <v-row>
            <v-col cols="6">
              <v-btn :disabled="loading" @click="$router.go(-1)" depressed block height="50" class="accent">
                <span style="font-size: 16px; font-weight: 700">Cancel</span>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                v-if="user.role.toLowerCase() !== 'superadmin'"
                @click="displayStorageDialog"
                :disabled="isStorageLoading"
                depressed
                block
                height="50"
                class="secondary"
              >
                <span style="font-size: 16px; font-weight: 700"
                  >Create Storage</span
                >
              </v-btn>
              <v-btn
                v-else
                @click="createstorage"
                :disabled="isStorageLoading"
                depressed
                block
                height="50"
                class="secondary"
              >
                <span style="font-size: 16px; font-weight: 700"
                  >Create Storage</span
                >
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- dialog purchase storage -->
    <dialogNewServiceAvailability
      v-if="storageDialog" 
      :onClose="() => {storageDialog = false}"
      serviceName="Storage"
      actionName="Create Storage"
      :onAvailable="createstorage"
    />
  </div>
</template>

<script>
import { toIDRWithDotFormat } from "../../lib/formatter";
import { useStorage } from "../instance/compositionapi/usestorage";
import { useCreatedInstance } from "../instance/compositionapi/usecreatedinstance";
import { computed, ref, watch, onMounted } from "@vue/composition-api";
import libProject from "@/lib/project";

const { required, requiredIf, minLength } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;
import { useCreateStorage } from "./composableapi/usecreatestorage";
import { mapGetters } from "vuex";
import { addGBText, removeGBText } from "@/lib/formatter";
import { useVoucher } from "@/modules/voucher/useVoucher";
import api from "@/lib/api";
import { useNamespacedState, useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import localstorage from "@/lib/localstorage";
import { MANAGEVOUCHER } from "../superadmin-managevoucher/namespace";
import { useZone } from "@/modules/instance/compositionapi/usezone";
import INSTANCE from "../instance/namespace";
import { STORAGE } from "./namespace";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";

// const isDevModeStorageTiering = process.env.VUE_APP_DEV_MODE === "fase-1.3"
const isDevModeStorageTiering = true;

export default {
  components: {
    dialogNewServiceAvailability,
  },
  setup(props, context) {
    props;
    const $router = context.root.$router;
    const UseCreatedInstance = useCreatedInstance();
    const { instanceselected, instanceSelect, instancesAll } = UseCreatedInstance;
    const { fetchVouchers, vouchers } = useVoucher();

    const { fetchVoucherDiscountByProjectID } = useNamespacedActions(MANAGEVOUCHER, ["fetchVoucherDiscountByProjectID"]);

    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, ["voucherDiscountProject"]);

    const { getListStorageType, getListInstanceRootDisk, getDefaultPriceStorage } = useNamespacedActions(STORAGE, [
      "getListStorageType",
      "getListInstanceRootDisk",
      "getDefaultPriceStorage",
    ]);
    const { listStorageTypeBilling, listInstanceRootDisk, defaultPriceStorage } = useNamespacedGetters(STORAGE, [
      "listStorageTypeBilling",
      "listInstanceRootDisk",
      "defaultPriceStorage",
    ]);

    const { selectzonebyproject: selectZones, fetchzonebyproject } = useZone();

    const {checkAvailability} = useNewServiceAvailability()

    const defaultBillingTypes = [
      {
        text: "Pay Per Use (PPU)",
        value: "PPU",
      },
      {
        text: "Trial",
        value: "Trial",
      },
    ];

    const fixedPostpaid = [
      {
        text: "Fixed",
        value: "Fixed",
      },
      {
        text: "Trial",
        value: "Trial",
      },
    ];

    const projJson = localstorage.getItem("currentProj");
    const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};
    const postpaid_type = projObj.postpaid_type;

    const billingTypes = ref(postpaid_type && postpaid_type === "fixed" ? fixedPostpaid : defaultBillingTypes);

    const selectedBillingType = ref(null);
    const selectedZoneModel = ref(null);
    const selectedTrialVoucher = ref(null);
    const { isLoading: isInstancesLoading } = useNamespacedState("INSTANCE", ["isLoading"]);

    const { isLoading: isStorageLoading } = useNamespacedState("STORAGE", [
      "isLoading",
    ]);

    const UseStorage = useStorage();
    const { storageselected, defaultstoragesize: defaultstoragesizeS, volumeSize, fetchpackagestorage, packagestorage } = UseStorage;

    // const defaultstoragesize = computed(() => {
    //   return defaultstoragesizeS.value.slice().map((x) => {
    //     x.size = 0;
    //     return x;
    //   });
    // });

    const type_id = ref("");
    const volumename = ref("");
    const configoptions = ref("auto");
    const filesystem = ref("");
    const voucher = ref("");
    const loading = ref(false);
    const attachstorage = ref("true");
    const storageDiscount = ref(0);
    const price_per_month = ref(0);
    const price_per_hour = ref(0);
    const { psid } = context.root._route.query;
    const { iid } = context.root._route.query;
    const typeFromSource = ref("");
    const storageDialog = ref(false)

    const additionalRule = isDevModeStorageTiering
      ? {
          type_id: {
            required: requiredIf((val) => {
              return psid === undefined;
            }),
          },
        }
      : {};
    const additionalValidation = isDevModeStorageTiering ? { type_id } : {};

    const $v = useVuelidate(
      {
        storageselected: {
          required: requiredIf((val) => {
            return customSize.value === null && storageselected.value === null && psid === undefined;
          }),
        },
        selectedTrialVoucher: {
          required: requiredIf((val) => {
            return selectedBillingType.value === "Trial" && psid === undefined;
          }),
        },
        selectedBillingType: {
          required,
        },
        selectedZoneModel: {
          required,
        },
        customSize: {
          required: requiredIf((val) => {
            return customSize.value === null && storageselected.value === null && psid === undefined;
          }),
        },
        instanceselected: {
          conditional: {
            $message: "please select one or more instance to attach",
            $validator: (val) => {
              if (attachstorage.value == "true") {
                return val;
              } else {
                return true;
              }
            },
          },
        },
        // type_id: {required},
        volumename: {
          required,
          minLength: minLength(5),
        },
        attachstorage: { required },
        ...additionalRule,
      },
      {
        selectedBillingType,
        selectedZoneModel,
        storageselected,
        instanceselected,
        // type_id,
        volumename,
        configoptions,
        filesystem,
        attachstorage,
        selectedTrialVoucher,
        ...additionalValidation,
      }
    );

    const { createstorage: CreateStorage, attachStorage: AttachStorage } = useCreateStorage();

    function createErrorMessage(element) {
      return $v.value[element].$errors.length ? $v.value[element].$errors[0].$message : "";
    }

    // function enterSizeInGB(e) {
    //   if (e.code.match(/^Digit/)) {
    //     defaultstoragesize.value[0].size = Number("" + defaultstoragesize.value[0].size + e.key);
    //   } else if (e.code == "Backspace") {
    //     defaultstoragesize.value[0].size = Math.floor(defaultstoragesize.value[0].size / 10);
    //   }
    // }

    const customSize = ref(null);
    const isCustomSizeHighlighted = ref(false);
    // const filteredVolumeSizes2 = ref([])
    // const filteredVolumeSizes = computed(() => {
    //   let showCustomFlavor = process.env.VUE_APP_SHOW_CUSTOM_DISK_FLAVORS == "true" ? true : false;
    //   const filtered = volumeSize.value
    //     .filter((x) => !x.is_default && x.status == "active")
    //     .filter((x) => {
    //       if (showCustomFlavor) return true;
    //       else {
    //         if (x.organization_id) return false; // custom flavor has org id
    //         return true;
    //       }
    //     })
    //     .sort((a, b) => a.volume_size - b.volume_size);

    //   if (type_id) {
    //     filtered.filter((s) => s.type_id === type_id);
    //   }

    //   return filtered;
    // });

    // const filteredVolumeSizes2 = ref([]);

    // if (isDevModeStorageTiering) {
    //   watch(type_id, (val) => {
    //     storageselected.value = null;
    //     filteredVolumeSizes2.value = filteredVolumeSizes.value.filter((s) => s.type_id === type_id.value);
    //   });
    // }

    async function createstorage() {
      if (storageDiscount.value) {
        price_per_month.value = customSize.value ? calculateCustomStorage(storageDiscount.value) : 0;
      } else {
        price_per_month.value = customSize.value ? parseInt(removeGBText(customSize.value)) * defaultPriceStorage.value.price_per_month : 0;
      }

      if (storageDiscount.value) {
        price_per_hour.value = customSize.value ? calculateCustomStorage(storageDiscount.value, "hour") : 0;
      } else {
        price_per_hour.value = customSize.value ? parseInt(removeGBText(customSize.value)) * defaultPriceStorage.value.price_per_hour : 0;
      }

      const activeProjectID = await libProject.getActiveProjectID();
      let payload = isDevModeStorageTiering
        ? {
            project_id: activeProjectID,
            name: volumename.value,
            billing_type: selectedBillingType.value,
            type_id: type_id.value,
            zone: selectedZoneModel.value.zone,
            custom_size: customSize.value ? parseInt(removeGBText(customSize.value)) : 0,
            package_storage_id: customSize.value ? defaultPriceStorage.id : storageselected.value.id,
            type_name: filterTypeName(type_id.value),
            storage_service_id: customSize.value ? defaultPriceStorage.value.id : undefined,
          }
        : {
            project_id: activeProjectID,
            name: volumename.value,
            billing_type: selectedBillingType.value,
            zone: selectedZoneModel.value.zone,
            custom_size: customSize.value ? parseInt(removeGBText(customSize.value)) : 0,
            package_storage_id: customSize.value ? defaultPriceStorage.id : storageselected.value.id,
            type_name: filterTypeName(type_id.value),
            storage_service_id: customSize.value ? defaultPriceStorage.value.id : undefined,
          };

      if (selectedBillingType.value === "Trial") payload.voucher_id = selectedTrialVoucher.value;
      if (attachstorage.value == "true") payload.instance_id = instanceselected.value.id;
      const response = await CreateStorage(payload);
      if (response.status === 200) {
        this.$router.push("/storage");
      }
    }

    const displayStorageDialog = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      await checkAvailability(
        {
          by: customSize.value ? "service" : "item", 
          item: {
            service_name: 'STORAGE', 
            id: customSize.value ? type_id.value : storageselected.value.id,
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
    }

    onMounted(async () => {
      let params = {
        project_id: projObj.id,
      };
      await fetchzonebyproject(params);

      if (context.root.previousInstance) instanceselected.value = instancesAll.value.find((x) => x.value.id === context.root.previousInstance.id).value;
      const paramsType = new URLSearchParams();
      paramsType.append("project_id", projObj.id);
      await getListStorageType(paramsType);
      await fetchVouchers();
      // filteredVolumeSizes2.value = filteredVolumeSizes
      await fetchVoucherDiscountByProjectID(projObj.id);
      if (voucherDiscountProject.value) {
        storageDiscount.value = voucherDiscountProject.value.voucher_discount_detail.storage;
      }

      const payload = {
        psid: psid,
      };

      if (psid !== undefined) {
        await fetchpackagestorage(payload);
        typeFromSource.value = packagestorage.value["description"] + " (" + packagestorage.value["volume_size"] + " GB)";
        type_id.value = packagestorage.value.type_id
        customSize.value = packagestorage.value.volume_size.toString() + " GB"
      }
    });

    watch(attachstorage, (val) => {
      if (val == "false") instanceselected.value = null;
    });

    // watch(type_id, (val) => {
    //   storageselected.value = null
    // })

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

      // return toIDRWithDotFormat(Math.round(total));
      return Math.round(total);
    };

    const calculateStorage = (price, discount = 0) => {
      let total = 0;
      total = price;

      if (discount) {
        discount = (price * discount) / 100;
        total = total - discount;
      }

      // return toIDRWithDotFormat(Math.round(total));
      return Math.round(total);
    };

    const changeTypeStorage = (event) => {
      const params = new URLSearchParams();
      params.append("storage_type_id", event);
      getListInstanceRootDisk(params);
      getDefaultPriceStorage(params);
    };

    const filterTypeName = (event) => {
      const data = listStorageTypeBilling.value.find((elem) => elem.id == event);
      return data.name;
    };

    return {
      loading,
      isInstancesLoading,
      isStorageLoading,
      vouchers,
      selectedTrialVoucher,
      selectedBillingType,
      billingTypes,
      // filteredVolumeSizes,
      addGBText,
      removeGBText,
      isCustomSizeHighlighted,
      customSize,
      attachstorage,
      $v,
      createErrorMessage,
      ...UseStorage,
      ...UseCreatedInstance,
      configoptions,
      toIDRWithDotFormat,
      filesystem,
      type_id,
      volumename,
      voucher,
      createstorage,
      inputdefaultstorage: ref(false),
      // defaultstoragesize,
      ...additionalValidation,
      instancesAll,
      storageDiscount,
      calculateCustomStorage,
      calculateStorage,
      psid,
      iid,
      fetchpackagestorage,
      typeFromSource,
      selectZones,
      selectedZoneModel,
      listStorageTypeBilling,
      listInstanceRootDisk,
      changeTypeStorage,
      defaultPriceStorage,
      filterTypeName,
      price_per_month,
      price_per_hour,
      storageDialog,
      displayStorageDialog,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const isFromDetailInstance = from.params.instanceid ? true : false;
      if (isFromDetailInstance) vm.$root.previousInstance = vm.$store.getters["INSTANCE/getInstanceDetail"];
      else vm.$root.previousInstance = null;
    });
  },
  async created() {
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const currentOrgID = currentOrg ? currentOrg.id : null;

    await this.fetchdefaultstoragesize();
    await this.fetchVolumeSize({ limit: 999 });
    await this.fetchinstances({ limit: 999});
    this.getTypes();
  },
  data() {
    return {
      tnc: false,
      dataTnc: {},
      isDevModeStorageTiering,
      radios: "",
      selectedssh: "",
      storageTypes: [
        // {text: 'Standart', value: 'standart'},
        // {text: 'Premium', value: 'premium'}
      ],
    };
  },
  computed: {
    ...mapGetters({
      projectId: "PROJECT/getprojectid",
      user: "ROLEPERMISSION/getuser",
    }),
  },
  methods: {
    is(a, b) {
      return a == b;
    },
    select(storage) {
      this.storageselected = storage;
    },
    async getTypes() {
      try {
        const res = await api.GET("/flavor/storage/type");

        if (res.data.length) {
          const newArr = res.data.map((type) => {
            const { name, id } = type;
            const formattedName = {
              Premium: "Premium Volume SSD with 2250 - 4500 IOPS",
              Standard: "Standard Volume SSD with 750 - 2500 IOPS",
            };

            return {
              text: formattedName[name],
              value: id,
            };
          });

          this.storageTypes = newArr;
        }
      } catch {
        this.$store.dispatch("HOMEPAGE/showErrorToast", "Sorry, an error occurred while displaying storage types");
      }
    },
  },
};
</script>

<style lang="css">
#customSize .v-label--active {
  top: 10px !important;
}
</style>

<style scoped lang="scss">
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

.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>
