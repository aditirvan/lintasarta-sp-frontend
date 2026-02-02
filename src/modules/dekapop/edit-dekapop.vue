<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-overlay :value="isLoading">
          <v-progress-circular
            indeterminate
            size="64"
            color="primary"
          ></v-progress-circular>
        </v-overlay>

        <v-card v-if="!isLoading" class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="7">
                <div class="psk-title d-flex align-items-center">
                  Edit Deka Pop
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Select Product</p>
                <v-select
                  v-model="selectedProduct"
                  :items="listProducts"
                  item-text="name"
                  item-value="id"
                  placeholder="Select Product"
                  outlined
                  :error-messages="
                    $v.selectedProduct.$errors.length
                      ? $v.selectedProduct.$errors[0].$message
                      : ''
                  "
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Select Usage Meter</p>
                <v-autocomplete
                  v-model="selectedAgent"
                  :items="listAgents"
                  item-text="label"
                  return-object
                  placeholder="Select Usage Meter"
                  outlined
                  :error-messages="
                    $v.selectedAgent.$errors.length
                      ? $v.selectedAgent.$errors[0].$message
                      : ''
                  "
                  :search-input.sync="searchAgent"
                  clearable
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          No data matching your search "<strong>{{
                            searchAgent
                          }}</strong
                          >".
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Customer Name</p>
                <v-text-field
                  v-model="username"
                  placeholder="Select Customer Name"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Service Instance</p>
                <v-text-field
                  v-model="serviceInstance"
                  placeholder="Insert Service Instance"
                  single-line
                  outlined
                  type="number"
                  :error-messages="
                    $v.serviceInstance.$errors.length
                      ? $v.serviceInstance.$errors[0].$message
                      : ''
                  "
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-card-text class="pt-0 pl-0 pr-0">
                  <p for="start-date"><b>License Created</b></p>
                  <v-menu
                    ref="menu1"
                    v-model="toggleStartDatePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="licenseCreated"
                        id="formated_start_date"
                        placeholder="DD/MM/YYYY"
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :error-messages="
                          $v.licenseCreated.$errors.length
                            ? $v.licenseCreated.$errors[0].$message
                            : ''
                        "
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="licenseCreated"
                      no-title
                      @input="toggleStartDatePicker = false"
                      color="primary"
                    ></v-date-picker>
                  </v-menu>
                </v-card-text>
              </v-col>
              <v-col cols="12" md="6">
                <v-card-text class="pt-0 pl-0 pr-0">
                  <p for="end-date"><b>License Expired</b></p>
                  <v-menu
                    ref="menu2"
                    v-model="toggleEndDatePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="licenseExpired"
                        id="formated_end_date"
                        placeholder="DD/MM/YYYY"
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :error-messages="
                          $v.licenseExpired.$errors.length
                            ? $v.licenseExpired.$errors[0].$message
                            : ''
                        "
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="licenseExpired"
                      no-title
                      @input="toggleEndDatePicker = false"
                      color="primary"
                    ></v-date-picker>
                  </v-menu>
                </v-card-text>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6" md="6">
                <p class="font-weight-bold">Description</p>
                <v-textarea
                  v-model="description"
                  placeholder="Insert Description"
                  single-line
                  outlined
                ></v-textarea>
              </v-col>
              <v-col cols="6" md="6">
                <p class="font-weight-bold" v-if="!hideCommitmentCoreInput">Commitment Core</p>
                <v-text-field
                  v-if="!hideCommitmentCoreInput"
                  v-model="limitCommitmentCore"
                  placeholder="Insert Commitment Core"
                  single-line
                  outlined
                  type="number"
                  :readonly="isCommitmentCoreReadonly"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                v-for="(license, index) in licenses"
                :key="index"
                cols="12"
              >
                <v-row>
                  <v-col cols="6">
                    <p class="font-weight-bold">License Name</p>
                    <v-text-field
                      v-model="license.name"
                      placeholder="License Name"
                      single-line
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <p class="font-weight-bold">License Key</p>
                    <v-text-field
                      v-model="license.key"
                      placeholder="License Key"
                      single-line
                      outlined
                      :error-messages="
                        (!license.key || license.key.trim() === '') 
                          ? 'License key is required' 
                          : ''
                      "
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center">
                    <v-btn
                      color="red"
                      icon
                      @click="removeLicense(index)"
                      v-if="licenses.length > 1 && !license.is_default"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- <v-row v-if="hasEmptyLicenseKeys">
              <v-col cols="12">
                <v-alert
                  type="error"
                  dense
                  outlined
                  class="mb-0"
                >
                  <div class="d-flex align-center">
                    <v-icon small class="mr-2">mdi-alert-circle</v-icon>
                    <span class="text-caption font-weight-medium">All license key must be filled</span>
                  </div>
                </v-alert>
              </v-col>
            </v-row> -->
            <v-row>
              <v-col cols="12">
                <!-- <v-btn color="primary" @click="addLicense">+ Add License</v-btn> -->
              </v-col>
            </v-row>

            <v-row class="my-7">
              <v-col cols="12" md="6">
                <v-btn
                  :disabled="isLoadingBtn"
                  block
                  class="accent fz-14"
                  @click="$router.go(-1)"
                  height="50"
                >
                  <span>Cancel</span>
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  :loading="isLoadingBtn"
                  :disabled="isSubmitDisabled"
                  block
                  class="secondary fz-14"
                  depressed
                  @click="create"
                  height="50"
                >
                  <span>Edit Deka Pop</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { POP } from "./namespace";
import { onMounted, ref, computed, watch } from "@vue/composition-api";
import moment from "moment";
import useVuelidate from "@vuelidate/core";
import { required, minValue, maxValue } from "@vuelidate/validators";

export default {
  setup(props, context) {
    const {
      getDetailPop,
      editPop,
      getListAgents,
      getListProducts,
      getCustomCommitmentCore,
    } = useNamespacedActions(POP, [
      "getDetailPop",
      "editPop",
      "getListAgents",
      "getListProducts",
      "getCustomCommitmentCore",
    ]);

    const {
      isLoadingBtn,
      detailPop,
      userPop,
      listAgents,
      listProducts,
      listCustomCommitmentCore,
    } = useNamespacedGetters(POP, [
      "isLoadingBtn",
      "detailPop",
      "userPop",
      "listAgents",
      "listProducts",
      "listCustomCommitmentCore",
    ]);
    const currentProj = JSON.parse(localStorage.getItem("currentProj"));

    const isLoading = ref(true);
    const licenses = ref([]);

    const isCommitmentCoreReadonly = ref(false);
    const hideCommitmentCoreInput = ref(false);

    onMounted(async () => {
      try {
        isLoading.value = true;
        await Promise.all([
          getDetailPop(context.root.$route.params.id),
          getListAgents(),
          getListProducts(),
        ]);

        if (detailPop.value && detailPop.value.licenses) {
          licenses.value = detailPop.value.licenses.map((lic) => ({
            name: lic.Name || "",
            key: lic.Key || "",
            is_default: true,
          }));
        }

        if (detailPop.value?.usage_meter_id) {
          const selectedUsageMeter = listAgents.value.find(
            (agent) => agent.agentId === detailPop.value.usage_meter_id
          );
          isCommitmentCoreReadonly.value = selectedUsageMeter?.isCustomBilling || false;
          
          // Hide commitment core input for specific usage_meter_id
          hideCommitmentCoreInput.value = detailPop.value.usage_meter_id === "62e3d2bc-0c36-4a98-99ea-d5d873895896";
        }

        if (detailPop.value) {
          console.log("detailPop.value:", detailPop.value);
          limitCommitmentCore.value = detailPop.value.limit_commitment_core;
          
        }

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        isLoading.value = false;
      }
    });

    const username = computed(() => {
      return detailPop.value?.user_name;
    });

    const description = computed({
      get: () => detailPop.value.description,
      set: (val) => {
        detailPop.value.description = val;
      },
    });
    const licenseType = computed({
      get: () => detailPop.value.license_type,
      set: (val) => {
        detailPop.value.license_type = val;
      },
    });
    const noContract = computed({
      get: () => detailPop.value.no_contract,
      set: (val) => {
        detailPop.value.no_contract = val;
      },
    });
    const licenseCreated = computed({
      get: () => formatToDate(detailPop.value.license_created),
      set: (val) => {
        detailPop.value.license_created = val;
      },
    });
    const licenseExpired = computed({
      get: () => formatToDate(detailPop.value.license_expired),
      set: (val) => {
        detailPop.value.license_expired = val;
      },
    });
    const productId = computed({
      get: () => detailPop.value.product_id,
      set: (val) => {
        detailPop.value.product_id = val;
      },
    });
    const serviceInstance = computed({
      get: () => detailPop.value.service_instance,
      set: (val) => {
        detailPop.value.service_instance = val;
      },
    });

    const limitCommitmentCore = computed({
      get: () => detailPop.value?.commitment_core || "",
      set: (val) => {
        if (detailPop.value) {
          detailPop.value.commitment_core = val;
        }
      },
    });
    const selectedProduct = computed({
      get: () => detailPop.value?.product_id || "",
      set: (val) => {
        if (detailPop.value) {
          detailPop.value.product_id = val;
        }
      },
    });
    const selectedAgent = computed({
      get: () => {
        if (!detailPop.value || !detailPop.value.usage_meter_id) return null;
        return {
          id: detailPop.value.usage_meter_id,
          label: detailPop.value.usage_meter_name,
        };
      },
      set: (val) => {
        if (detailPop.value) {
          detailPop.value.usage_meter_id = val?.id;
          detailPop.value.usage_meter_name = val?.label;
        }
      },
    });
    const searchAgent = ref("");

    const toggleStartDatePicker = ref(false);
    const toggleEndDatePicker = ref(false);
    const currentDate = ref(moment(new Date()).format("YYYY-MM-DD"));
    const formatToDate = (date) => moment(date).format("YYYY-MM-DD");

    // Computed property untuk mengecek apakah ada license key yang kosong (untuk validasi form)
    const hasEmptyLicenseKeysForValidation = computed(() => {
      if (!licenses.value || licenses.value.length === 0) return false;
      return licenses.value.some(license => !license.key || license.key.trim() === '');
    });

    // Computed property untuk disabled state tombol submit
    const isSubmitDisabled = computed(() => {
      return isLoadingBtn.value || hasEmptyLicenseKeysForValidation.value;
    });

    const $v = useVuelidate(
      {
        licenseCreated: { required },
        licenseExpired: { required },
        productId: { required },
        serviceInstance: { required },
        selectedProduct: { required },
        selectedAgent: { required },
      },
      {
        licenseCreated,
        licenseExpired,
        productId,
        serviceInstance,
        selectedProduct,
        selectedAgent,
      }
    );

    const addLicense = () => {
      console.log("addLicense");
      licenses.value.push({ name: "", key: "", is_default: false });
    };

    const removeLicense = (index) => {
      if (licenses.value.length > 1) {
        licenses.value.splice(index, 1);
      }
    };

    // Modifikasi watch selectedAgent
    watch(
      () => selectedAgent.value,
      async (newVal) => {
        if (newVal) {
          const selectedUsageMeter = listAgents.value.find(
            (agent) => agent.agentId === newVal.id
          );
          isCommitmentCoreReadonly.value = selectedUsageMeter?.isCustomBilling || false;
          
          // Hide commitment core input for specific usage_meter_id
          hideCommitmentCoreInput.value = newVal.id === "62e3d2bc-0c36-4a98-99ea-d5d873895896";
          
          // Reset commitment core value ketika berganti agent
          if (selectedUsageMeter?.isCustomBilling) {
            limitCommitmentCore.value = "";
          } else {
            // Reset juga ketika berganti dari custom billing ke non-custom billing
            limitCommitmentCore.value = "";
          }
        } else {
          // Reset ketika agent di-clear
          isCommitmentCoreReadonly.value = false;
          hideCommitmentCoreInput.value = false;
          limitCommitmentCore.value = "";
        }
      }
    );

    const create = async () => {
      $v.value.$touch();
      
      if ($v.value.$errors.length || hasEmptyLicenseKeysForValidation.value) {
        console.log("error", $v.value.$errors);
        return;
      }
      let payload = {
        id: detailPop.value.id,
        project_id: currentProj.id,
        organization_id: currentProj.organization_id,
        user_id: JSON.parse(localStorage.getItem("userId")),
        license_type: licenseType.value,
        no_contract: noContract.value,
        licence_created: licenseCreated.value,
        license_expired: licenseExpired.value,
        description: description.value,
        product_id: selectedProduct.value,
        service_instance: serviceInstance.value,
        usage_meter_id: selectedAgent.value?.id,
        limit_commitment_core: parseInt(limitCommitmentCore.value) || 0,
        licenses: licenses.value,
      };
      console.log("payload", payload);  
      await editPop(payload);
    };

    return {
      $v,
      create,
      licenseType,
      noContract,
      formatToDate,
      currentDate,
      licenseCreated,
      licenseExpired,
      computed,
      toggleStartDatePicker,
      toggleEndDatePicker,
      isLoadingBtn,
      detailPop,
      username,
      userPop,
      description,
      productId,
      serviceInstance,
      selectedProduct,
      selectedAgent,
      listAgents,
      listProducts,
      searchAgent,
      limitCommitmentCore,
      licenses,
      addLicense,
      removeLicense,
      isLoading,
      isCommitmentCoreReadonly,
      listCustomCommitmentCore,
      hideCommitmentCoreInput,
      hasEmptyLicenseKeysForValidation,
      isSubmitDisabled,
    };
  },
};
</script>

<style lang="scss" scoped>
.psk-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
</style>