<template>
  <div>
    <v-row v-if="isLoading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="7">
                <div class="psk-title d-flex align-items-center">
                  Create Deka Pop
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
              <v-col cols="6" md="6" v-if="!showCustomCommitmentCore">
                <p class="font-weight-bold">Commitment Core</p>
                <v-text-field
                  v-model="limitCommitmentCore"
                  placeholder="Insert Commitment Core"
                  single-line
                  outlined
                  type="number"
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
            <v-row>
              <v-col cols="12">
                <v-btn color="primary" @click="addLicense">+ Add License</v-btn>
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
                  <span>Create Deka Pop</span>
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
import { required } from "@vuelidate/validators";
import { values } from "lodash";

export default {
  setup(props, context) {
    const {
      createPop,
      getOrganization,
      getListAgents,
      getListProducts,
      getListTypeLicense,
      getCustomCommitmentCore,
    } = useNamespacedActions(POP, [
      "createPop",
      "getOrganization",
      "getListAgents",
      "getListProducts",
      "getListTypeLicense",
      "getCustomCommitmentCore",
    ]);
    const {
      isLoadingBtn,
      dataOrgName,
      listAgents,
      listProducts,
      listTypeLicense,
      defaultProduct,
      listCustomCommitmentCore,
    } = useNamespacedGetters(POP, [
      "isLoadingBtn",
      "dataOrgName",
      "listAgents",
      "listProducts",
      "listTypeLicense",
      "defaultProduct",
      "listCustomCommitmentCore",
    ]);

    const currentProj = JSON.parse(localStorage.getItem("currentProj"));

    const isLoading = ref(true);

    onMounted(async () => {
      try {
        await Promise.all([
          getOrganization(currentProj.organization_id),
          getListAgents(),
          getListProducts(),
          getListTypeLicense(),
        ]);

        // Setelah semua API selesai, baru set licenses
        licenses.value = listTypeLicense.value.map((item) => ({
          name: item.name,
          key: "",
          is_default: true,
        }));

        selectedProduct.value = defaultProduct.value;
        isLoading.value = false;
      } catch (error) {
        console.error("Error loading data:", error);
        isLoading.value = false;
      }
    });

    const username = computed(() => {
      return dataOrgName.value?.name;
    });
    const productId = ref("");
    const serviceInstance = ref("");
    const productName = ref("");
    const licenseType = ref("");
    const licenseName = ref("");
    const licenseKey = ref("");
    const noContract = ref("");
    const licenseCreated = ref("");
    const licenseExpired = ref("");
    const description = ref("");
    const toggleStartDatePicker = ref(false);
    const toggleEndDatePicker = ref(false);
    const selectedTypeCore = ref();
    const usageMeterId = ref();
    const usageMeterName = ref();
    const currentDate = ref(moment(new Date()).format("YYYY-MM-DD"));
    const selectedProduct = ref(null);
    const selectedAgent = ref(null);
    const selectedTypeLicense = ref(null);
    const limitCommitmentCore = ref("");
    const searchAgent = ref("");
    console.log("defaultProduct ", defaultProduct.value.is_default);
    const licenses = ref(
      listTypeLicense.value.map((item) => ({
        name: item.name,
        key: "",
        is_default: true,
      }))
    );

    const addLicense = () => {
      licenses.value.push({ name: "", key: "", is_default: false });
    };

    const removeLicense = (index) => {
      if (licenses.value.length > 1) {
        licenses.value.splice(index, 1);
      }
    };

    selectedProduct.value = defaultProduct.value;
    const formatToDate = (date) =>
      moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");

    const $v = useVuelidate(
      {
        licenseCreated: { required },
        licenseExpired: { required },
        serviceInstance: { required },
        selectedProduct: { required },
        selectedAgent: { required },
      },
      {
        licenseCreated,
        licenseExpired,
        serviceInstance,
        selectedProduct,
        selectedAgent,
      }
    );

    const showCustomCommitmentCore = ref(false);

    // Watch selectedAgent changes
    watch(
      () => selectedAgent.value,
      async (newVal) => {
        if (newVal && newVal.isCustomBilling) {
          showCustomCommitmentCore.value = true;
          limitCommitmentCore.value = ""; // Reset nilai
        } else {
          showCustomCommitmentCore.value = false;
        }
      }
    );

    const create = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length || hasEmptyLicenseKeys.value) {
        console.log($v.value.$errors);
        return;
      }
      console.log("selectedProduct", selectedProduct.value);
      console.log("selectedAgent", selectedAgent.value);
      console.log("selectedTypeLicense", selectedTypeLicense.value);
      const productId = ref("");

      if (typeof selectedProduct.value === "object") {
        productId.value = selectedProduct.value.id;
      } else {
        productId.value = selectedProduct.value;
      }

      let payload = {
        id: "",
        user_id: JSON.parse(localStorage.getItem("userId")),
        no_contract: noContract.value,
        licence_created: licenseCreated.value,
        license_expired: licenseExpired.value,
        project_id: currentProj.id,
        organization_id: currentProj.organization_id,
        description: description.value,
        service_instance: serviceInstance.value,
        limit_commitment_core: parseInt(limitCommitmentCore.value),
        agent_id: selectedAgent.value.agentId,
        usage_meter_name: selectedAgent.value.label,
        // license_type_id: selectedTypeLicense.value,
        product_id: productId.value,
        license_name: licenseName.value,
        license_key: licenseKey.value,
        licenses: licenses.value,
      };
      console.log(payload);
      await createPop(payload);
    };

    // Computed property untuk mengecek apakah ada license key yang kosong
    const hasEmptyLicenseKeys = computed(() => {
      if (!licenses.value || licenses.value.length === 0) return false;
      return licenses.value.some(license => !license.key || license.key.trim() === '');
    });

    // Computed property untuk disabled state tombol submit
    const isSubmitDisabled = computed(() => {
      return isLoadingBtn.value || hasEmptyLicenseKeys.value;
    });

    return {
      $v,
      create,
      productName,
      licenseType,
      noContract,
      licenseCreated,
      licenseExpired,
      formatToDate,
      currentDate,
      toggleStartDatePicker,
      toggleEndDatePicker,
      isLoadingBtn,
      username,
      description,
      dataOrgName,
      productId,
      serviceInstance,
      selectedTypeCore,
      usageMeterId,
      usageMeterName,
      listAgents,
      listProducts,
      listTypeLicense,
      selectedProduct,
      selectedAgent,
      selectedTypeLicense,
      limitCommitmentCore,
      licenseName,
      licenseKey,
      licenses,
      addLicense,
      removeLicense,
      searchAgent,
      isLoading,
      showCustomCommitmentCore,
      listCustomCommitmentCore,
      hasEmptyLicenseKeys,
      isSubmitDisabled,
    };
  },
};
</script>

<style scoped>
.psk-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
</style>
