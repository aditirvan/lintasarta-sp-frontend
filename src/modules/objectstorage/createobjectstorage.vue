<template>
  <div>
    <!-- contoh template -->
    <v-row>
      <v-col cols="12" class="pt-3">
        <v-card flat class="rounded-lg">
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="12">
                <div class="headline font-weight-bold font--text">Create Deka Box</div>
              </v-col>
            </v-row>
            <v-row>
            <v-col sm="12" md="6">
              <p class="font-weight-bold">Dekabox Type</p>
              <v-select
                id="SelectRegion"
                outlined
                placeholder="Choose Region"
                :items="activeRegion"
                item-value="id"
                item-text="type_region"
                v-model="selectedRegionActive"
                :error-messages="$v.selectedRegionActive.$errors.length ? $v.selectedRegionActive.$errors[0].$message : ''"
              >
              </v-select>
            </v-col>
          </v-row>

          <template v-if="selectedRegionActive">
            
            <v-row>
            <v-col sm="12" md="6">
              <p class="font-weight-bold">Choose Region</p>
              <v-select
                id="SelectRegion"
                outlined
                placeholder="Choose Region"
                :items="buckets"
                item-value="id"
                item-text="display_name"
                v-model="selectedBucket"
                :error-messages="$v.selectedBucket.$errors.length ? $v.selectedBucket.$errors[0].$message : ''"
              >
              </v-select>
            </v-col>
          </v-row>
          </template>
            
            <!-- start find size -->
            <template v-if="selectedBucket">
            <v-row>
              <v-col class="pb-0" cols="12">
                <p>
                  <span class="font-weight-bold mb-0">Select Volume Size</span>
                  <span
                    :class="{
                      'error--text': $v.selectedS3Flavor.$errors.length,
                    }"
                    class="ml-2"
                    style="font-size: 10px; position: absolute"
                    v-if="$v.selectedS3Flavor.$errors.length"
                  >
                    *{{ $v.selectedS3Flavor.$errors[0].$message }}</span
                  >
                </p>
              </v-col>
              <v-slide-group class="py-4 pt-0" active-class="success" show-arrows>
                <v-col class="d-flex flex-row flex-wrap">
                  <v-card
                    tabindex="0"
                    v-if="defaultFlavorObjectStorage"
                    min-width="170"
                    :class="{
                      bordererror: $v.selectedS3Flavor.$errors.length,
                      highlight: isCustomQuotaHighlighted,
                      selected: isCustomQuotaHighlighted,
                    }"
                    :key="defaultFlavorObjectStorage.id"
                    @click="
                      () => {
                        isCustomQuotaHighlighted = true;
                        selectedS3Flavor = null;
                      }
                    "
                    border-color="primary"
                    outlined
                    class="rounded-lg select-instance mb-4"
                    style="text-align: center; margin-right: 20px"
                  >
                    <v-card-text class="pb-0 pt-4 d-flex flex-column m-0">
                      <div v-if="objectStorageDiscount && objectStorageDiscount > 0 && customQuota">
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
                        v-model="customQuota"
                        @keydown="(ev) => (customQuota = addGBText(ev, customQuota))"
                        maxlength="50"
                        class="px-4 pt-2 mt-2 label-bold"
                        style="width: 170px"
                        flat
                        label="Enter Size in GB"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                  <v-card
                    width="170"
                    :class="{
                      bordererror: $v.selectedS3Flavor.$errors.length,
                      highlight: selectedS3Flavor && selectedS3Flavor.id == storage.id,
                      selected: selectedS3Flavor && selectedS3Flavor.id == storage.id,
                    }"
                    v-for="storage in listFlavorObjectStorage"
                    :key="storage.id"
                    @click="
                      () => {
                        selectedS3Flavor = storage;
                        customQuota = null;
                        isCustomQuotaHighlighted = false;
                      }
                    "
                    border-color="primary"
                    outlined
                    class="rounded-lg select-instance mb-4"
                    style="text-align: center; margin-right: 20px"
                  >
                    <!-- filteredS3Flavors -->
                    <!-- listFlavorObjectStorage -->
                    <v-card-text class="pb-0 pt-5">
                      <div v-if="objectStorageDiscount && objectStorageDiscount > 0">
                        <p class="body-2 mb-0" style="text-decoration: line-through">
                          {{ toIDRWithDotFormat(calculateObjectStorage(storage.price_per_month)) }}/mo
                        </p>
                        <p class="font-weight-bold blue--text mb-1">
                          {{ toIDRWithDotFormat(calculateObjectStorage(storage.price_per_month, objectStorageDiscount)) }}/mo
                        </p>

                        <p class="body-2 mb-0" style="text-decoration: line-through">
                          {{ toIDRWithDotFormat(calculateObjectStorage(storage.price_per_hour)) }}/hour
                        </p>
                        <p class="font-weight-bold blue--text">
                          {{ toIDRWithDotFormat(calculateObjectStorage(storage.price_per_hour, objectStorageDiscount)) }}/hour
                        </p>
                      </div>

                      <div v-else>
                        <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateObjectStorage(storage.price_per_month)) }}/mo</p>
                        <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateObjectStorage(storage.price_per_hour)) }}/hour</p>
                      </div>
                    </v-card-text>
                    <v-divider />
                    <v-card-text class="d-flex flavor-card">
                      <p class="mb-0">{{ storage.object_storage_size }} GB</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-slide-group>
            </v-row>
            </template>
         
            <v-row>
              <v-col sm="12" md="6">
                <p class="font-weight-bold">Billing Type</p>
                <v-select
                  id="SelectRegion"
                  outlined
                  placeholder="Choose Billing Type"
                  :items="billingTypes"
                  v-model="selectedBillingType"
                  :error-messages="$v.selectedS3Flavor.$errors.length ? $v.selectedS3Flavor.$errors[0].$message : ''"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" class="pt-0" v-if="selectedBillingType == 'Trial'">
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
            <v-divider class="my-4" />
            <v-row>
              <v-col>
                <p class="font-weight-bold mb-0" style="font-size: 21px">File Listing</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="12" md="6">
                <p style="font-size: 12px">
                  <span class="primary--text"><b>Important:</b></span> User who create deka box or the Creator, will be given an access key to the
                  bucket. Any access to the bucket will require an access key. The Creator can also create new access key to other user in Access Keys menu.
                </p>
              </v-col>
            </v-row>
            <v-divider />
            <v-row>
              <v-col cols="12" sm="12" md="6" class="mt-2">
                <p class="font-weight-bold">Choose a unique name</p>
                <v-text-field
                  maxlength="50"
                  :error-messages="createErrorMessage('objectStorageName')"
                  id="ChooseUniqueName"
                  v-model="objectStorageName"
                  outlined
                  placeholder="Type a unique subdomain name for your bucket"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- <v-row>
            
          <v-col cols="12" sm="12" md="12" class="pt-0 mt-0">
          
            <v-row>
              <v-col cols="12" sm="12" md="12" class="pt-0 mt-0">
                <v-checkbox
                  label="Object Version"
                  v-model="objectVersion"
                  :readonly="objectLock"
                ></v-checkbox>
              </v-col>
              <v-col cols="6" sm="6" md="6" class="pt-0 mt-0">
                <p style="font-size: 12px">
                  <span class="primary--text"><b>Important:</b></span> Enable object versioning if you want to store every version of each object in this bucket. You can then retrieve previous versions of an object as needed.
                </p>
              </v-col>

              <v-col cols="12" sm="12" md="12" class="pt-0 mt-0">
                <v-checkbox
                  label="Object Lock"
                  v-model="objectLock"
                ></v-checkbox>
              </v-col>
              <v-col cols="6" sm="6" md="6" class="pt-0 mt-0">
                <p style="font-size: 12px">
                  <span class="primary--text"><b>Important:</b></span> S3 Object Lock allows you to specify retention and legal hold settings for the objects ingested into a bucket. If you want to use S3 Object Lock, you must enable this setting when you create the bucket. 
                  You cannot add or disable S3 Object Lock after a bucket is created
                  If S3 Object Lock is enabled, object versioning is enabled for the bucket automatically and cannot be suspended.
                </p>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" sm="6" md="6" class="pt-0 mt-0" v-if="objectLock">
            <v-row>
              <v-col cols="9" sm="9" md="9">
                <v-text-field
                  v-model="retentionPeriod"
                  label="Retention Period"
                  type="number"
                  min="0"
                ></v-text-field>
              </v-col>
              <v-col cols="3" sm="3" md="3">
                <v-select
                  v-model="retentionType"
                  :items="['Days', 'Years']"
                  label="Retention Type"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
            </v-row> -->
            <v-row v-if="user.role.toLowerCase() !== 'superadmin' && !statusCheckEula">
              <v-col cols="12">
                <div class="d-flex align-center">
                  <v-checkbox v-model="agree">
                    <template v-slot:label>
                      <div>By Creating Deka Box You Agree To The</div>
                    </template>
                  </v-checkbox>

                  <button type="button" class="font-weight-bold text-decoration-underline primary--text ml-2 mb-1 fz-16" @click="getEula()">Terms of Service</button>
                </div>
              </v-col>
            </v-row>
            <div style="width: auto; height: 10px" />
            <v-divider />
            <div style="width: auto; height: 10px" />
            <v-row>
              <v-col cols="6"><v-btn depressed block height="50" class="accent" to="/object-storage">Cancel</v-btn></v-col>
              <v-col cols="6">
                <v-btn
                  v-if="user.role.toLowerCase() == 'superadmin'"
                  depressed
                  id="CreateObjectStorage"
                  :disabled="isLoading"
                  block
                  height="50"
                  class="secondary"
                  @click="create"
                  >
                  <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                  <span v-else> Create Deka Box</span>
                </v-btn>
                <v-btn v-else-if="statusCheckEula" depressed id="CreateObjectStorage" @click="displayObjStorageDialog" :disabled="isLoading" block height="50" class="secondary">
                  <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                  <span v-else> Create Deka Box</span>
                </v-btn>
                <v-btn v-else depressed id="CreateObjectStorage" @click="displayObjStorageDialog" :disabled="isLoading || !agree" block height="50" class="secondary">
                  <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                  <span v-else> Create Deka Box</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <!-- dialog purchase storage -->
    <dialogNewServiceAvailability
      v-if="objStorageDialog" 
      :onClose="() => {objStorageDialog = false}"
      serviceName="Deka Box"
      actionName="Create Deka Box"
      :onAvailable="create"
    />
  </div>
</template>
<script>
import api from "@/lib/api";
const { required, requiredIf, helpers, minLength, minValue } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;
import { ref, watch, onMounted, computed } from "@vue/composition-api";
import { useProjects } from "../project/useprojects";
import { useObjectStorage } from "./composableapi/useobjectstorage";
import { useVoucher } from "../voucher/useVoucher";
import { useSelectVolume } from "./useSelectVolume";
import { useRegion } from "./useRegion";
import { toIDRWithDotFormat } from "@/lib/formatter";
import libProject from "@/lib/project";
import { toThousands, addGBText, removeGBText } from "@/lib/formatter";
import localstorage from "@/lib/localstorage";
import { mapGetters } from "vuex";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { MANAGEVOUCHER } from "../superadmin-managevoucher/namespace";
import OBJECTSTORAGEBILLING from "./namespace";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";
import INSTANCE from "../instance/namespace";
import { DEKABOXREGION } from "../superadmin-manage-region/namespace";


export default {
  components: {
    dialogNewServiceAvailability
  },
  setup(props, context) {
    props;
    context.root.$router;
    const useComposable = {
      ...useObjectStorage(),
      ...useRegion(),
    };


    
    const { fetchBucketRegionByActiveObjectStorage,getActiveRegionById,fetchBuckets } = useNamespacedActions(DEKABOXREGION, ["fetchBucketRegionByActiveObjectStorage","getActiveRegionById","fetchBuckets"]);
    
    const { fetchVoucherDiscountByProjectID } = useNamespacedActions(MANAGEVOUCHER, ["fetchVoucherDiscountByProjectID"]);

    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, ["voucherDiscountProject"]);
    const { getFlavorObjectStorageByRegion, getDefaultObjectStorageByRegion } = useNamespacedActions(OBJECTSTORAGEBILLING, [
      "getFlavorObjectStorageByRegion",
      "getDefaultObjectStorageByRegion",
    ]);
    const { listFlavorObjectStorage, defaultFlavorObjectStorage } = useNamespacedGetters(OBJECTSTORAGEBILLING, [
      "listFlavorObjectStorage",
      "defaultFlavorObjectStorage",
    ]);
    const { validateEula, checkEula } = useNamespacedActions(INSTANCE, ["validateEula", "checkEula"]);
    const { statusCheckEula } = useNamespacedState(INSTANCE, ["statusCheckEula"]);

    const {checkAvailability} = useNewServiceAvailability()

    const { fetchVouchers, vouchers } = useVoucher();
    const projJson = localstorage.getItem("currentProj");
    const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};
    const postpaid_type = projObj.postpaid_type;

    // const billingTypes = ref(postpaid_type && postpaid_type === 'fixed' ? fixedPostpaid : defaultBillingTypes)
    const billingTypes = ref([]);

    const selectedBillingType = ref("");
    const selectedTrialVoucher = ref(null);
    const activeRegion =ref([]);
    const buckets=ref([]);


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

    const { createObjectStorage, s3Flavors, customQuota, selectedS3Flavor, fetchS3Flavors, s3DefaultPrice, selectedRegion } = useComposable;
    const allowFileListing = ref("disable");
    const objectStorageName = ref("");
    const objectStorageDiscount = ref(0);
    const price_per_month = ref(0);
    const price_per_hour = ref(0);
    const objStorageDialog = ref(false)
    const selectedBucket = ref(null)
    const selectedRegionActive =ref(null)
    const objectVersion=ref(false);
    const objectLock =ref(false);
    const retentionPeriod=ref(0);
    const retentionType=ref("Days");

    const $v = useVuelidate(
      {
        selectedBucket: { required, $autoDirty: true },
        selectedRegionActive:{ required, $autoDirty: true },
        allowFileListing: { required, $autoDirty: true },
     
        objectStorageName: {
          required,
          minLength: minLength(5),
          $autoDirty: true,
          clean: helpers.withMessage("Can only contains lowercase letters, numbers, and dash.", (val) => {
            return !val.match(/([^a-z0-9-])+/g);
          }),
        },
        selectedTrialVoucher: {
          required: requiredIf((val) => {
            return selectedBillingType.value === "Trial";
          }),
        },
        selectedS3Flavor: {
          required: requiredIf((val) => {
            return customQuota.value === null && selectedS3Flavor.value === null;
          }),
        },
        customQuota: {
          required: requiredIf((val) => {
            return customQuota.value === null && selectedS3Flavor.value === null;
          }),
        },
       
        selectedBillingType: { required },
      },
      {
        selectedBucket,
        selectedRegionActive,
        selectedBillingType,
        selectedS3Flavor,
        allowFileListing,
        objectStorageName,
        selectedTrialVoucher,
      }
    );

    
    //  await getFlavorObjectStorageByRegion();
    //   await getDefaultObjectStorageByRegion();

     watch(selectedBucket, async (newVal) => {
      if (newVal) {
        console.log("selectedBucket newVal", newVal);

        var parts = newVal.split(' ');
        console.log("selectedBucket newVal", parts[0]);
        await getFlavorObjectStorageByRegion(parts[0]);
        await getDefaultObjectStorageByRegion(parts[0]);
      }
    });

    watch(selectedRegionActive, async (newVal) => {
      if (newVal) {
        console.log("selectedRegionActive newVal", newVal);
        const resBucket =await fetchBuckets(newVal);
        console.log(resBucket.data.data)
        buckets.value = resBucket.data.data
      }
    });

    watch(objectLock, async (newVal) => {
      if (newVal) {
          objectVersion.value = true
      }else{
         objectVersion.value = false
        
      }
    })




    async function create() {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      if (objectStorageDiscount.value) {
        price_per_month.value = customQuota.value ? calculateCustomObjectStorage(objectStorageDiscount.value) : 0;
        // price_per_month.value = customQuota.value
        //   ? calculateCustomObjectStorage(objectStorageDiscount.value)
        //   : calculateObjectStorage(selectedS3Flavor.value.price_per_month, objectStorageDiscount.value);
      } else {
        price_per_month.value = customQuota.value ? parseInt(removeGBText(customQuota.value)) * defaultFlavorObjectStorage.value.price_per_month : 0;
        // price_per_month.value = customQuota.value
        //   ? parseInt(removeGBText(customQuota.value)) * defaultFlavorObjectStorage.value.price_per_month
        //   : selectedS3Flavor.value.price_per_month;
      }

      if (objectStorageDiscount.value) {
        price_per_hour.value = customQuota.value ? calculateCustomObjectStorage(objectStorageDiscount.value, "hour") : 0;
        // price_per_hour.value = customQuota.value
        //   ? calculateCustomObjectStorage(objectStorageDiscount.value, "hour")
        //   : calculateObjectStorage(selectedS3Flavor.value.price_per_hour, objectStorageDiscount.value);
      } else {
        price_per_hour.value = customQuota.value ? parseInt(removeGBText(customQuota.value)) * defaultFlavorObjectStorage.value.price_per_hour : 0;
        // price_per_hour.value = customQuota.value
        //   ? parseInt(removeGBText(customQuota.value)) * defaultFlavorObjectStorage.value.price_per_hour
        //   : selectedS3Flavor.value.price_per_hour;
      }

      console.log("selectedBucket.value.id ", selectedBucket.value);

      var parts = selectedBucket.value.split(' ');


      let payload = {
        object_storage_region_name: parts[0],
        enable_file_listing: allowFileListing.value === "enable" ? true : false,
        name: objectStorageName.value,
        project_id: await libProject.getActiveProjectID(),
        billing_type: selectedBillingType.value,
        voucher_id: null,
        custom_size: customQuota.value ? parseInt(removeGBText(customQuota.value)) : 0,
        package_object_storage_id: customQuota.value ? defaultFlavorObjectStorage.value.id : selectedS3Flavor.value.id,
        object_storage_service_id: customQuota.value ? defaultFlavorObjectStorage.value.id : undefined,
        object_versioning:objectVersion.value,
        object_lock:objectLock.value,
        type_object_lock:retentionType.value,
        count_object_lock:parseInt(retentionPeriod.value),
      };

      console.log("payload ", payload);

      if (selectedTrialVoucher.value && selectedBillingType.value == "Trial") {
        payload.voucher_id = selectedTrialVoucher.value;
      }

      const response = await createObjectStorage(payload);
      if (response.status === 200) {
        if (!statusCheckEula.value && localStorage.getItem("role").toLowerCase() !== 'superadmin') {
            const payload = {
              form_name: "Form Create Deka Box",
              project_id: localStorage.getItem("projectid"),
            };
            validateEula(payload)
          }

        this.$router.push("/object-storage");  
        // if (this.user.role.toLowerCase() !== "superadmin" && this.agree2 === false) {
        //   this.validateEula();
        // }
        // if (this.user.role.toLowerCase() !== "superadmin" && this.agree2 === true) {
        //   this.$router.push("/object-storage");
        // }
        // if (this.user.role.toLowerCase() === "superadmin") {
        //   this.$router.push("/object-storage");
        // }
      }
    }

    const displayObjStorageDialog = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      await checkAvailability(
        {
          by: customQuota.value ? "service" : "item", 
          item: {
            service_name: 'OBJECT_STORAGE', 
            id: customQuota.value ? defaultFlavorObjectStorage.value.id : selectedS3Flavor.value.id,
            ...( 
                customQuota.value ? 
                  {
                    tags: [{
                      name:'Volume',
                      qty: parseInt(removeGBText(customQuota.value)),
                    }]
                  }
                  :
                  {}
                )
          }
        }
      )

      objStorageDialog.value = true;
    }

    function createErrorMessage(element) {
      return $v.value[element].$errors.length ? $v.value[element].$errors[0].$message : "";
    }

    onMounted(async () => {

     const respactiveRegion= await getActiveRegionById();
     activeRegion.value = respactiveRegion.data.data;
     console.log("activeRegion.value ", activeRegion.value);

      const params = new URLSearchParams();
      params.append("project_id", localStorage.getItem("projectid"));
      params.append("form_name", "Form Create Deka Box");
      await checkEula(params);
      // await getFlavorObjectStorage();
      // await getDefaultObjectStorage();
      if (postpaid_type && postpaid_type === "fixed") {
        billingTypes.value = fixedPostpaid;
        selectedBillingType.value = "Fixed";
      } else {
        billingTypes.value = defaultBillingTypes;
        selectedBillingType.value = "PPU";
      }

      await fetchVouchers();
      // await fetchS3Flavors({ limit: 999 });
      setTimeout(() => {
        Promise.all([useComposable.fetchregions({ status: true })]);
      }, 500);

      await fetchVoucherDiscountByProjectID(projObj.id);
      if (voucherDiscountProject.value) {
        objectStorageDiscount.value = voucherDiscountProject.value.voucher_discount_detail.object_storage;
      }

      //get region
      await fetchBucketRegionByActiveObjectStorage();



    });

    const calculateCustomObjectStorage = (discount = 0, unit = "month") => {
      const size = customQuota.value ? Number(customQuota.value.slice(0, customQuota.value.length - 3)) : 0;

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

    return {
      ...useComposable,
      vouchers,
      billingTypes,
      selectedRegion,
      // filteredS3Flavors,
      addGBText,
      removeGBText,
      $v,
      allowFileListing,
      objectStorageName,
      create,
      createErrorMessage,
      toIDRWithDotFormat,
      selectedTrialVoucher,
      selectedBillingType,
      objectStorageDiscount,
      calculateCustomObjectStorage,
      calculateObjectStorage,
      listFlavorObjectStorage,
      defaultFlavorObjectStorage,
      price_per_month,
      price_per_hour,
      objStorageDialog,
      displayObjStorageDialog,
      statusCheckEula,
      buckets,
      selectedBucket,
      activeRegion,
      objectVersion,
      objectLock,
      selectedRegionActive,
      retentionPeriod,
      retentionType,
      

    };
  },
  async created() {
    // await this.checkEula();
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const currentOrgID = currentOrg ? currentOrg.id : null;
    // this.fetchS3DefaultPrice();
  },
  data() {
    return {
      agree: false,
      agree2: true,
      tnc: false,
      dataTnc: {},
      radios: "",
    };
  },
  computed: {
    ...mapGetters({
      projectId: "PROJECT/getprojectid",
      user: "ROLEPERMISSION/getuser",
    }),
  },
  methods: {
  
    async getEula() {
      const routeData = this.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Create Deka Box" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    },
    is(a, b) {
      return a == b;
    },
    select(instance) {
      this.instanceselected = instance;
    },
    isSelected(id) {
      return id == this.instanceselected.id;
    },
  },
  watch: {
    selectedBillingType(newVal) {
      // console.log("selectedBillingType newVal", newVal);
    },
  },
};
</script>

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
.v-input--radio-group {
  ::v-deep .v-messages {
    width: 50px;
  }
  &:not(.error--text) {
    ::v-deep .v-messages {
      display: none;
    }
  }
  ::v-deep .v-input__slot {
    margin-bottom: 0;
  }
}
.higlight {
  border: 1px solid #2c94d2;
}
.bordererror {
  border: 1px solid red;
}
button {
  ::v-deep .v-btn__content {
    font-size: 14px;
    font-weight: 700;
  }
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>