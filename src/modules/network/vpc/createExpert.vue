<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-container fluid class="pa-7 pb-1" id="container">
            <div class="expert-title">Create NAT Gateway</div>
            <!-- <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-18 mb-0" style="font-weight: 600">
                  Create VPC
                </p>
                <v-spacer />
              </v-col>
            </v-row> -->
            <div class="vpc-content pt-5 pb-9">
              Provides a free routing platform that competes directly with other commercially available solutions from well known network providers.
            </div>
            <v-row>
              <v-col cols="12" md="6" class="pt-0">
                <p class="font-weight-bold">Name</p>
                <v-text-field maxlength="50" placeholder="Insert Name" single-line outlined v-model="nameVpc" :error-messages="nameVpcError"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Description</p>
                <v-textarea outlined name="input-7-4" placeholder="Insert Description" v-model="description" :error-messages="descriptionError"></v-textarea>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Region</p>
                <v-select
                  v-model="regionidselected"
                  :items="selectregions"
                  single-line
                  outlined
                  selected
                >
                </v-select>
              </v-col>
            </v-row> -->
            <v-row>
              <v-col cols="12" md="6" class="py-0">
                <p><b>Billing Type</b></p>
                <v-select
                  id="billingType"
                  placeholder="Choose Instance Billing Type"
                  v-model="selectedBillingType"
                  :items="billingTypes"
                  outlined
                  :error-messages="selectedBillingTypeError"
                ></v-select>
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
            <v-row>
              <v-col cols="12" md="6" class="pb-0">
                <p class="font-weight-bold">Configure IP Range</p>
                <v-row>
                  <v-col cols="6" class="pb-0"
                    ><v-text-field
                      maxlength="30"
                      placeholder="IP Prefix"
                      single-line
                      outlined
                      v-model="ipVpc"
                      @keypress="
                        (e) => {
                          if (!/[\d.]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }
                      "
                      @change="
                        () => {
                          $v.ipVpc.$touch();
                        }
                      "
                      :error-messages="ipVpcError"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="6" class="pb-0">
                    <v-text-field
                      maxlength="10"
                      placeholder="Network Size"
                      single-line
                      outlined
                      prefix="/"
                      type="number"
                      v-model="prefixVpc"
                      :error-messages="prefixVpcError"
                    ></v-text-field>

                    <!-- <v-select
                      placeholder="Network Size"
                      v-model="prefixVpc"
                      :items="prefixes"
                      :error-messages="prefixVpcError"
                      outlined
                      single-line
                    ></v-select> -->
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- <br />
            <v-divider></v-divider> -->

            <!-- <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-18 mb-0" style="font-weight: 600">
                  Create Subnet
                </p>
                <v-spacer />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" class="pt-0">
                <p class="font-weight-bold">Subnet Name</p>
                <v-text-field
                  maxlength="50"
                  placeholder="Insert Name"
                  single-line
                  outlined
                  v-model="nameSubnet"
                  :error-messages="nameSubnetError"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Configure IP Range</p>
                <v-row>
                  <v-col cols="6" class="py-0"
                    ><v-text-field
                      maxlength="30"
                      placeholder="IP Prefix"
                      single-line
                      outlined
                      v-model="ipSubnet"
                      @change="
                        () => {
                          $v.ipSubnet.$touch();
                        }
                      "
                      :error-messages="ipSubnetError"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="6" class="pt-0">
                      <v-select
                      placeholder="Choose Network Size"
                      v-model="prefixSubnet"
                      :items="prefixes"
                      :error-messages="prefixSubnetError"
                      outlined
                      single-line
                    ></v-select>
                    </v-col>
                </v-row>
              </v-col>
            </v-row>
            <br />
            <v-divider></v-divider> -->

            <!-- <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-18 mb-0" style="font-weight: 600">
                  Create Router
                </p>
                <v-spacer />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" class="pt-0">
                <p class="font-weight-bold">Router Name</p>
                <v-text-field
                  maxlength="50"
                  placeholder="Insert Name"
                  single-line
                  outlined
                  v-model="nameRouter"
                  :error-messages="nameRouterError"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Type</p>
                    <v-select
                    placeholder="Type"
                    v-model="typeRouter"
                    :items="typesRouters"
                    :error-messages="typeRouterError"
                    outlined
                    single-line
                  ></v-select>
              </v-col>
            </v-row> -->

            <v-row>
              <v-col cols="12" v-if="role.toLowerCase() !== 'superadmin' && !statusCheckEula" class="pt-0">
                <div class="d-flex align-center">
                  <v-checkbox v-model="agree" label="By Creating NAT Gateway You Agree To The"> </v-checkbox>
                  <span class="text-decoration-underline primary--text ml-2 fz-16 mb-1 font-weight-bold cursor-pointer" @click="getEula()"
                    >Terms of Service</span
                  >
                </div>
              </v-col>
            </v-row>

            <v-row>
              <!-- <v-col class="pt-0" cols="6" md="3">
                <v-btn block height="45" depressed class="accent fz-14" :disabled="isLoadingBtn" :loading="isLoadingBtn" @click="$router.push('/network/vpc')">
                  <span>Cancel</span>
                </v-btn>
              </v-col> -->
              <v-col cols="6" md="3">
                <!-- <v-btn block depressed class="secondary fz-14" :disabled="isLoadingBtn || !agree" :loading="isLoadingBtn" @click="createWizard">
                  <span>Create NAT Gateway</span>
                </v-btn> -->
                <v-btn
                  :disabled="isLoadingBtn"
                  class="secondary fz-14"
                  block
                  height="45"
                  @click="createWizard()"
                  v-if="role.toLowerCase() == 'superadmin'"
                >
                  <span>Create NAT Gateway</span>
                </v-btn>

                <v-btn class="secondary fz-14"  block height="45" @click="createWizard()" :disabled="isLoadingBtn" v-else-if="statusCheckEula">
                  <span>Create NAT Gateway</span>
                </v-btn>
                <v-btn class="secondary fz-14" block height="45" @click="createWizard()" :disabled="!agree || isLoadingBtn" v-else>
                  <span>Create NAT Gateway</span>
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
import { computed, onMounted, ref } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required, maxValue, minLength, requiredIf, minValue } from "@vuelidate/validators";
import { useRegion } from "@/modules/instance/compositionapi/useregion";
import { useVoucher } from "@/modules/voucher/useVoucher";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { NETWORKVPC } from "./namespace";
import INSTANCE from "@/modules/instance/namespace";

export default {
  setup(props, context) {
    const Composable = {
      ...useRegion(),
    };
    const { selectregions, fetchregions, regionidselected } = Composable;
    const { fetchVouchers, vouchers } = useVoucher();

    const projJson = localStorage.getItem("currentProj");
    const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};
    const postpaid_type = projObj.postpaid_type;

    const { CREATE_VPC_ADVANCED } = useNamespacedActions(NETWORKVPC, ["CREATE_VPC_ADVANCED"]);
    const { isLoadingBtn } = useNamespacedState(NETWORKVPC, ["isLoadingBtn"]);
    const { validateEula, checkEula } = useNamespacedActions(INSTANCE, ["validateEula", "checkEula"]);
    const { statusCheckEula } = useNamespacedState(INSTANCE, ["statusCheckEula"]);
    const role = ref(localStorage.getItem("role"));
    const agree = ref(false);
    const nameVpc = ref("");
    const description = ref("");
    const prefixVpc = ref();
    const ipVpc = ref("");
    const selectedBillingType = ref("");
    const selectedBillingTypeError = ref("");
    const prefixes = ref([8, 16, 24, 29]);
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
    const billingTypes = ref([]);
    const selectedTrialVoucher = ref(null);

    const $v = useVuelidate(
      {
        nameVpc: {
          required,
          minLength: minLength(5),
          $autoDirty: true,
          conditional: {
            $message: "Can not contain special character",
            $validator: (val) => {
              return /^[A-Za-z0-9\s\-_]+$/g.test(val);
            },
          },
        },
        description: { required },
        selectedBillingType: { required },
        selectedTrialVoucher: {
          required: requiredIf((val) => {
            return selectedBillingType.value == "Trial";
          }),
        },
        ipVpc: {
          required,
          regex: {
            $message: "Invalid ip value",
            $validator: (val) => {
              return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(val);
            },
          },
        },
        prefixVpc: { required, minValue: minValue(1) },
      },
      {
        nameVpc,
        description,
        ipVpc,
        prefixVpc,
        selectedBillingType,
        selectedBillingTypeError,
        selectedTrialVoucher,
        // nameSubnet,
        // ipSubnet,
        // prefixSubnet,
        // nameRouter,
        // typeRouter
      }
    );

    const Error = {};
    const Validation = ["nameVpc", "description", "ipVpc", "prefixVpc", "selectedBillingType"];
    Validation.forEach((key) => {
      Error[key + "Error"] = computed(() => {
        return $v.value[key].$errors.length ? $v.value[key].$errors[0].$message : "";
      });
    });

    const createWizard = async () => {
      $v.value.$touch();
      if (!selectedBillingType.value) {
        selectedBillingTypeError.value = "Value is required";
      } else {
        if ($v.value.$errors.length) {
          let container = document.getElementById("container");
          container.scrollIntoView({ behavior: "smooth" });
          return;
        }
        const currentProj = JSON.parse(localStorage.getItem('currentProj'))
        //if(!currentProj.region.includes('TKP')){
        //   context.root.$store.dispatch(
        //       "HOMEPAGE/showErrorToast",
        //       `You can't create NAT Gateway in ${currentProj.region}`,
        //       { root: true }
        //     );
        //     return
        // }
        const Value = {
          name: nameVpc.value,
          description: description.value,
          region: currentProj.region,
          //region: ''+regionidselected.value.region_credential_openstack_id+'',
          ip: ipVpc.value,
          network_size: parseInt(prefixVpc.value, 10), // Convert to integer.value,
          voucher_id: selectedBillingType.value == 'Trial' ? selectedTrialVoucher.value : null,
          billing_type: selectedBillingType.value,
          type: "Expert",
          openstack_project_id: currentProj.openstack_project_id,
          organization_id: currentProj.organization_id,
          project_id: currentProj.id,
          user_id: JSON.parse(localStorage.getItem("userId")),
        };

        // When the select region button is disabled
        // if (!regionidselected.value) Value.region = 'TKP'

        // console.log(Value)
        let resp = await CREATE_VPC_ADVANCED(Value);
        if (resp.status == 200) {
          if (!statusCheckEula.value && role.value.toLowerCase() !== 'superadmin') {
            const payload = {
              form_name: "Form Create NAT Gateway",
              project_id: localStorage.getItem("projectid"),
            };
            validateEula(payload);
          }
          context.root.$router.replace("/network/vpc");
        } else {
          console.log(resp);
        }
      }
    };

    onMounted(async () => {
      if (postpaid_type && postpaid_type === "fixed") {
        billingTypes.value = fixedPostpaid;
        selectedBillingType.value = "";
      } else {
        billingTypes.value = defaultBillingTypes;
        selectedBillingType.value = "Default";
      }

      await fetchVouchers();
      const params = new URLSearchParams();
      params.append("project_id", localStorage.getItem("projectid"));
      params.append("form_name", "Form Create NAT Gateway");
      await checkEula(params);
    });

    const getEula = () => {
      const routeData = context.root.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Create NAT Gateway" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    };

    return {
      $v,
      ...Error,
      nameVpc,
      description,
      selectregions,
      regionidselected,
      selectedTrialVoucher,
      ipVpc,
      prefixVpc,
      vouchers,
      // nameSubnet,
      // ipSubnet,
      // prefixSubnet,
      // nameRouter,
      // typeRouter,
      // typesRouters,
      prefixes,
      fetchregions,
      selectedBillingType,
      billingTypes,
      createWizard,
      isLoadingBtn,
      agree,
      role,
      getEula,
      statusCheckEula,
    };
  },
  created() {
    this.fetchregions();
  },
};
</script>

<style lang="scss" scoped>
.expert-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
.vpc-content {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 140%;
  color: #a5b3bf;
}
.v-btn {
  height: 55px !important;
}
::v-deep .v-text-field__details {
  position: static;
}
</style>
