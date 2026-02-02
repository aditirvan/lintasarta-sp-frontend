<template>
  <div>
    <!-- <v-col cols="12"> -->
    <v-card class="rounded-lg" flat outlined>
      <v-container fluid class="px-7 py-4">
        <v-row>
          <v-col cols="9">
            <div class="firewall-title">Create Registry</div>
          </v-col>
        </v-row>
        <v-card flat outlined class="rounded-lg">
          <!-- <v-col md="10"> -->
          <!-- <v-card flat class="rounded-lg flex-grow-1 ma-auto"> -->
          <!-- <v-card-text> -->
          <div class="ma-7">
            <v-row>
              <v-col cols="4" class="bs">
                <span class="font-weight-bold">Repository Name</span>
                <v-text-field
                  class="mt-2"
                  placeholder="Repository Name"
                  v-model="inputName"
                  outlined
                  single-line
                  :value="nameProject.name.toLowerCase().replace(/ /g, '-')"
                  :error-messages="$v.inputName.$errors.length ? $v.inputName.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="bs">
                <p><b>Billing Type</b></p>
                <v-select
                  id="billingType"
                  placeholder="Choose Instance Billing Type"
                  v-model="selectedBillingType"
                  :items="billingTypes"
                  :error-messages="$v.selectedBillingType.$errors.length ? $v.selectedBillingType.$errors[0].$message : ''"
                  outlined
                ></v-select>
                <p v-if="selectedBillingType === 'PPU'"> {{ registryPriceText() }}</p>
              </v-col>
            </v-row>
            <v-row>
            <v-col cols="4" class="bs" v-if="selectedBillingType == 'Trial'">
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
            <v-row>
              <v-col cols="6" class="">
                <span class="font-weight-bold">Type</span>
                <v-radio-group class="my-2" v-model="optionRepo" row hide-details>
                  <!-- <v-col md="4"> -->
                  <!-- <v-row>
                            <v-col md="4" class="mr-2"
                              > -->
                  <v-radio label="Public" value="public"></v-radio>
                  <!-- </v-col>
                            <v-col md="3"> -->
                  <v-icon style="margin-right: 100px">mdi-earth</v-icon>
                  <!-- </v-col>
                          </v-row> -->
                  <!-- </v-col>
                        <v-col md="4"> -->
                  <!-- <v-row>
                            <v-col md="4" class="mr-2"
                              > -->
                  <v-radio label="Private" value="private"> </v-radio>
                  <!-- </v-col>
                            <v-col md="3"
                              > -->
                  <v-icon>mdi-lock-outline</v-icon>
                  <!-- </v-col
                            >
                          </v-row> -->
                  <!-- </v-col> -->
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="ma-0">
                <span class="font-weight-bold">Storage Size</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="pt-0">
                <!-- <p class="font-weight-bold">Storage</p> -->
                <v-text-field
                  outlined
                  placeholder="Storage Size"
                  single-line
                  v-model="size_storage"
                  type="number"
                  :error-messages="$v.size_storage.$errors.length ? $v.size_storage.$errors[0].$message : ''"
                />
                <p class="font-italic">
                  Your available storage is : <span class="font-weight-bold">{{ sisaKuota }}</span>
                </p>
              </v-col>
              <v-col cols="4" class="pt-0">
                <v-select
                  v-model="storageUnit"
                  :items="itemsUnit"
                  placeholder="Size"
                  outlined
                  autocomplete="off"
                  item-title="text"
                  item-value="value"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8" class="bs">
                <span class="font-weight-bold">Description</span>
                <v-textarea
                  name="input-7-4"
                  placeholder="Description"
                  class="mt-4"
                  outlined
                  v-model="inputDesc"
                  @blur="$v.inputDesc.$touch()"
                  :error-messages="$v.inputDesc.$errors.length ? 'Description couldnt be empty.' : ''"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row
              ><v-col cols="12">
                <v-row>
                  <v-col cols="12" v-if="role.toLowerCase() !== 'superadmin' && !statusCheckEula" class="pt-0">
                    <div class="d-flex align-center">
                      <v-checkbox v-model="agree" label="By Creating Cluster Deka Harbor You Agree To The"> </v-checkbox>
                      <span class="text-decoration-underline primary--text ml-2 fz-16 mb-1 font-weight-bold cursor-pointer" @click="getEula()"
                        >Terms of Service</span
                      >
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-btn
                  v-if="role.toLowerCase() == 'superadmin'"
                  :disabled="isLoading"
                  width="100%"
                  append
                  max-width="300"
                  height="50"
                  depressed
                  color="#CDCDCD"
                  class="fz-16"
                  exact
                  @click="$router.go(-1)"
                >
                  Cancel
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn
                  v-if="role.toLowerCase() == 'superadmin'"
                  :loading="isLoading"
                  width="100%"
                  append
                  max-width="300"
                  height="50"
                  depressed
                  color="secondary"
                  class="fz-16"
                  exact
                  @click="addRepo()"
                >
                  Create
                </v-btn>
                <v-btn
                  v-else-if="statusCheckEula"
                  :disabled="isLoading"
                  :loading="isLoading"
                  width="100%"
                  append
                  max-width="300"
                  height="50"
                  depressed
                  color="secondary"
                  class="fz-16"
                  exact
                  @click="addRepo()"
                >
                  Create
                </v-btn>
                <v-btn
                  v-else
                  :disabled="isLoading || !agree"
                  :loading="isLoading"
                  width="100%"
                  append
                  max-width="300"
                  height="50"
                  depressed
                  color="secondary"
                  class="fz-16"
                  exact
                  @click="addRepo()"
                >
                  Create
                </v-btn>
              </v-col>
            </v-row>
            <!-- </v-card-text> -->
            <!-- </v-card> -->
            <!-- </v-col> -->
          </div>
        </v-card>
      </v-container>
    </v-card>
    <!-- </v-col> -->
  </div>
</template>

<script>
import { ref, onMounted, computed } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedMutations, useNamespacedState } from "vuex-composition-helpers";
import { REGISTRY, REGISTRYBILLING } from "./namespace";
import useVuelidate from "@vuelidate/core";
import { required, minValue, maxValue, requiredIf, helpers } from "@vuelidate/validators";
import RootDiskTbl from "../billing/billing-corporate-detail-billing-type/RootDiskTbl.vue";
import { formatSize } from "@/lib/formatSize";
import { INSTANCE } from "../instance/namespace.ts";
import localstorage from "@/lib/localstorage";
import { useVoucher } from "@/modules/voucher/useVoucher"
import { MANAGEVOUCHER } from "../superadmin-managevoucher/namespace";
import { toIDRWithDotFormat } from "@/lib/formatter";


export default {
  setup(props, context) {

    const { fetchVouchers, vouchers } = useVoucher();
    const { fetchVoucherDiscountByProjectID } = useNamespacedActions(MANAGEVOUCHER, ["fetchVoucherDiscountByProjectID"]);

    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, ["voucherDiscountProject"]);

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
    const selectedTrialVoucher = ref(null);

    const { getDefaultPriceRegistry } = useNamespacedActions(REGISTRYBILLING, [
      "getDefaultPriceRegistry",
    ]);
    const { defaultPriceRegistry } = useNamespacedGetters(REGISTRYBILLING, [
      "defaultPriceRegistry",
    ]);

    const registryPriceText = () => {
      if (defaultPriceRegistry.value.price_per_hour || defaultPriceRegistry.value.price_per_month) {
        const currProjJson = localstorage.getItem("currentProj");
        const currProj = currProjJson && currProjJson !== "undefined" ? JSON.parse(currProjJson) : {};
        let text = "*Registry price is "
        if (currProj.payment_method === "postpaid") return text + toIDRWithDotFormat(defaultPriceRegistry.value.price_per_month) + " /month (Per GB)"
        else return text + toIDRWithDotFormat(defaultPriceRegistry.value.price_per_hour) + " /hour (Per GB)"
      }
      return ""
    }

    onMounted(async () => {
      const params = new URLSearchParams();
      params.append("project_id", localStorage.getItem("projectid"));
      params.append("form_name", "Deka Registry Form");
      await checkEula(params);
      setLoadCard(false);
      await getdetailquota();
      getDefaultPriceRegistry();
    });

    const { createProject, getdetailquota } = useNamespacedActions(REGISTRY, ["createProject", "getdetailquota"]);
    const { setLoadCard } = useNamespacedMutations(REGISTRY, ["setLoadCard"]);
    const { isLoading, detailquotalimits } = useNamespacedGetters(REGISTRY, ["isLoading", "detailquotalimits"]);
    const { validateEula, checkEula } = useNamespacedActions(INSTANCE, ["validateEula", "checkEula"]);
    const { statusCheckEula } = useNamespacedState(INSTANCE, ["statusCheckEula"]);
    const nameProject = ref(JSON.parse(localStorage.getItem("currentProj") || "{}"));
    const sisaKuota = computed(() => {
      let sisa = formatSize(detailquotalimits.value?.Limit_storage?.limit - detailquotalimits.value?.Limit_storage?.used);
      return sisa;
    });
    const role = ref(localStorage.getItem("role"));
    const inputName = ref("");
    const inputDesc = ref("");
    const optionRepo = ref("public");
    const size_storage = ref();
    const storageUnit = ref(1048576);
    const agree = ref(false);
    var publics = false;
    const itemsUnit = ref([
      // { text: "MiB", value: 1048576 },
      { text: "GiB", value: 1073741824 },
      { text: "TiB", value: 1099511627776 },
    ]);
    const addRepo = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      if (optionRepo.value == "public") {
        publics = "true";
      } else {
        publics = "false";
      }

      // console.log("=========publics=========",publics)
      const params = {
        project_name: inputName.value.toLowerCase().replace(/ /g, "-"),
        metadata: {
          public: publics,
        },
        description: inputDesc.value,
        storage_limit: size_storage.value * storageUnit.value,
        billing_type: selectedBillingType.value,
      };
      if (selectedBillingType.value == "Trial" && selectedTrialVoucher.value) params.voucher_id = selectedTrialVoucher.value;
      
      let resp = await createProject(params);
      if (resp.status <= 299) {
        if (!statusCheckEula.value && role.value.toLowerCase() !== 'superadmin') {
          const payload = {
            form_name: "Deka Registry Form",
            project_id: localStorage.getItem("projectid"),
          };
          validateEula(payload);
        }
        context.root.$router.replace(`/registry/${params.project_name}/overview`);
      }
    };
    const rules = ref({
      required: (value) => !!value || "Content couldn't be empty.",
    });

    const $v = useVuelidate(
      {
        inputName: { required },
        inputDesc: { required },
        // optionRepo: { required },
        selectedTrialVoucher: {
          required: requiredIf((val) => {
            return selectedBillingType.value === "Trial";
          }),
        },
        selectedBillingType: {
          required,
        },
        size_storage: {
          required,
          $autoDirty: true,
          minValue: minValue(0),
          maxValue: helpers.withMessage(
            () => {
              let splitSisa = sisaKuota.value.split(" ");

              if (splitSisa[0] == "0") {
                return `You don't have a storage quota`;
              } else {
                return `The maximum value allowed is ${sisaKuota.value}`;
              }
            },
            (val) => {
              let valid = true;
              let inputVal = val * storageUnit.value;
              let sisa = detailquotalimits.value?.Limit_storage?.limit - detailquotalimits.value?.Limit_storage?.used;

              if (inputVal > sisa) {
                valid = false;
              } else {
                valid = true;
              }
              return valid;
            }
          ),
        },
      },
      {
        inputName,
        inputDesc,
        selectedBillingType,
        selectedTrialVoucher,
        // optionRepo,
        size_storage,
      }
    );

    return {
      nameProject,
      vouchers,
      selectedTrialVoucher,
      selectedBillingType,
      billingTypes,
      inputName,
      inputDesc,
      optionRepo,
      agree,
      createProject,
      rules,
      $v,
      setLoadCard,
      addRepo,
      isLoading,
      size_storage,
      storageUnit,
      itemsUnit,
      detailquotalimits,
      sisaKuota,
      role,
      statusCheckEula,
      registryPriceText,
    };
  },
  methods: {
    async getEula() {
      const routeData = this.$router.resolve({ name: "eulaContent", query: { form_name: "Deka Registry Form" }, path: "/eula-content" });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>

//
<style lang="scss" scoped>
// .fz-16 {
//   font-size: 16px;
// }
// .bs
//   ::v-deep
//   .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
//   > .v-input__control
//   > .v-input__slot {
//   box-shadow: none;
// }

// ::v-deep .v-text-field__details {
//   position: static;
// }
//
</style>
