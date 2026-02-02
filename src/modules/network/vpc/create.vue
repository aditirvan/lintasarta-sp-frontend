<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-container fluid class="pa-7 pb-1">
            <div class="vpc-title">
              {{ vpcedit ? "Edit VPC Network" : "Create VPC Network" }}
            </div>
            <div class="vpc-content pt-5 pb-9">
              A Virtual Private Cloud (VPC) Network ensures secure traffic
              between any resources like Instances, Kubernetes clusters,
              database clusters, and load balancers. Any resources you create
              within a VPC can communicate securely over their private IP
              Addresses.
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Name</p>
                <v-text-field
                  v-if="!isEdit"
                  maxlength="50"
                  placeholder="Insert Name"
                  single-line
                  outlined
                  v-model="name"
                  :error-messages="nameError"
                ></v-text-field>
                <v-text-field
                  v-else
                  maxlength="50"
                  placeholder="Insert Name Edit"
                  single-line
                  outlined
                  v-model="nameEdit"
                  :error-messages="nameEditError"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Description</p>
                <v-textarea
                  outlined
                  name="input-7-4"
                  placeholder="Insert Description"
                  v-model="description"
                  :error-messages="descriptionError"
                ></v-textarea>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Region</p>
                <v-select
                  v-model="regionidselected"
                  :items="selectregions"
                  disabled
                  label="TKP"
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
                :disabled="vpcedit"
                :items="billingTypes"
                :error-messages="selectedBillingTypeError"
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6" class=""
              v-if="selectedBillingType == 'Trial'"
            >
              <p><b>Trial Voucher</b></p>
              <v-select
                id="trialVoucher"
                placeholder="Choose trial voucher to use"
                v-model="selectedTrialVoucher"
                :error-messages="
                  $v.selectedTrialVoucher.$errors.length
                    ? $v.selectedTrialVoucher.$errors[0].$message
                    : ''
                "
                :items="vouchers"
                item-text="voucher.name"
                item-value="id"
                outlined
              >
                <template v-slot:selection="{ item }">
                {{item.name}} - {{item.code}}
                </template>
                <template v-slot:item="{ item }">
                {{item.name}} - {{item.code}}
                </template>
              </v-select>
            </v-col>
          </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Configure IP Range</p>
                <v-row>
                  <v-col cols="6" class="py-0"
                    ><v-text-field
                      :disabled="vpcedit"
                      maxlength="30"
                      placeholder="IP Prefix"
                      single-line
                      outlined
                      v-model="ip"
                      @keypress="
                        (e) => {
                          if (!/[\d.]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }
                      "
                      @change="
                        () => {
                          $v.ip.$touch();
                        }
                      "
                      :error-messages="ipError"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="6" class="pt-0"  >
                    <v-text-field
                    maxlength="50"
                    placeholder="Network Size"
                    single-line
                    outlined
                    type="number"
                    prefix="/"
                    v-model="prefix"
                    :error-messages="prefixError"
                    :disabled="vpcedit"
                    ></v-text-field>

                    <!-- <v-select
                      placeholder="Network Size"
                      v-model="prefix"
                      :disabled="vpcedit"
                      :items="prefixes"
                      :error-messages="prefixError"
                      outlined
                    ></v-select> -->
                </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12" class="py-0">
                    <p><b>VPC Type</b></p>
                    <v-select
                      placeholder="VPC Type"
                      v-model="type"
                      :disabled="vpcedit"
                      :items="types"
                      :error-messages="typeError"
                      outlined
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6" v-if="isEdit">
                    <v-btn
                    block
                    height="45"
                    depressed
                    class="accent fz-14"
                    @click="$router.go(-1)"
                    >
                      <span>Cancel</span>
                    </v-btn>
                  </v-col>
                  <v-col
                    :cols="!isEdit ? 7 : 6"
                    v-if="user.role.toLowerCase() !== 'superadmin'"
                  >
                    <v-btn
                      v-if="vpcedit"
                      block
                      :disabled="isLoading"
                      class="secondary fz-14"
                      depressed
                      @click="() => UpdateVpc()"
                    >
                      <div v-if="isLoading">
                        <beat-loader
                          :loading="isLoading"
                          :color="'white'"
                          :size="'10px'"
                        ></beat-loader>
                      </div>
                      <span v-else>Save</span>
                    </v-btn>
                    <v-btn
                      v-else
                      block
                      :disabled="isLoading"
                      class="secondary fz-14"
                      depressed
                      @click="addVpc()"
                    >
                      <div v-if="isLoading">
                        <beat-loader
                          :loading="isLoading"
                          :color="'white'"
                          :size="'10px'"
                        ></beat-loader>
                      </div>
                      <span v-else>Create VPC Network</span>
                    </v-btn>
                  </v-col>
                  <v-col :cols="!isEdit ? 7 : 6" v-else>
                    <v-btn
                      v-if="vpcedit"
                      block
                      :disabled="isLoading"
                      class="secondary fz-14"
                      depressed
                      @click="() => UpdateVpc()"
                    >
                      <div v-if="isLoading">
                        <beat-loader
                          :loading="isLoading"
                          :color="'white'"
                          :size="'10px'"
                        ></beat-loader>
                      </div>
                      <span v-else>Save</span>
                    </v-btn>
                    <v-btn
                      v-else
                      block
                      :disabled="isLoading"
                      class="secondary fz-14"
                      depressed
                      @click="addVpc()"
                    >
                      <div v-if="isLoading">
                        <beat-loader
                          :loading="isLoading"
                          :color="'white'"
                          :size="'10px'"
                        ></beat-loader>
                      </div>
                      <span v-else>Create VPC Network</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import network from "../NetworkComposition";
import { useRegion } from "@/modules/instance/compositionapi/useregion";
import { ref, computed, watch, onMounted } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required, maxValue, requiredIf, minLength, helpers, minValue } from "@vuelidate/validators";
import { useVoucher } from '@/modules/voucher/useVoucher'
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { NETWORKVPC } from "./namespace";
import { mapGetters } from "vuex";
import api from "@/lib/api";
import localstorage from '@/lib/localstorage';

export default {
  data: () => ({
    tnc: false,
    dataTnc: {},
    region: ["Indonesia"]
  }),
  setup(props, context) {
    const { createVpc, isEditVpc } = network();
    const Composable = {
      ...useRegion(),
    };
    const { selectregions, fetchregions, regionidselected } = Composable;
    const name = ref("");
    const description = ref("");
    const prefix = ref("");
    const prefixes = ref([8, 16, 24, 29])
    const ip = ref("");
    const nameEdit = ref("")
    const { fetchVouchers, vouchers } = useVoucher()

    const defaultBillingTypes = [
      {
        text: "Pay Per Use (PPU)",
        value: "PPU",
      },
      {
        text: "Trial",
        value: "Trial",
      },
    ]

    const fixedPostpaid = [
      {
        text: "Fixed",
        value: "Fixed",
      },
      {
        text: "Trial",
        value: "Trial",
      },
    ]

    const projJson = localstorage.getItem('currentProj')
    const projObj = projJson && projJson !== 'undefined' ? JSON.parse(projJson) : {}
    const postpaid_type = projObj.postpaid_type

    // const billingTypes = ref(postpaid_type && postpaid_type === 'fixed' ? fixedPostpaid : defaultBillingTypes)
    const billingTypes = ref([])

    // const selectedBillingType = ref('Default')
    const selectedBillingType = ref('')
    // const selectedBillingTypeError = ref("");
    const selectedTrialVoucher = ref(null)
    const type = ref('')
    const types = ref([
      { text: 'Simple', value: 'Simple'},
      { text: 'Isolated', value: 'Isolated'}
    ])
    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
        nameEdit: {
          required: requiredIf(() => {
            return isEdit.value == true;
          }),
          $autoDirty: true,
          minLength: minLength(5),
          conditional: helpers.withMessage(
            "Can not contain special character",
            val => { 
              let valid = true 
              if(isEdit.value){
                if(!(/^[A-Za-z0-9\s\-_]+$/g.test(val))){
                  valid = false
                }
              }
              return valid
          }),
        },
        selectedBillingType:{ required},
        description: { required },        
        selectedTrialVoucher: {
          required: requiredIf((val) => {
            return selectedBillingType.value == "Trial";
          }),
        },
        ip: {
          required,
          regex: {
            $message: "Invalid ip value",
            $validator: (val) => {
              return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                val
              );
            },
          },
        },
        prefix: { required, minValue: minValue(1)},
        type:{ required},
      },
      {
        selectedTrialVoucher,
        name,
        description,
        ip,
        prefix,
        nameEdit,
        selectedBillingType,
        type
      }
    );
    const Error = {};
    const Validation = ["name", "description", "ip", "prefix", "nameEdit","selectedBillingType","type"];
    Validation.forEach((key) => {
      Error[key + "Error"] = computed(() => {
        return $v.value[key].$errors.length
          ? $v.value[key].$errors[0].$message
          : "";
      })
    })
    const { isLoading } = useNamespacedState(NETWORKVPC, ["isLoading"]);
    const {
      CREATE_VPC,
      DETAIL_VPC,
      DETAIL_VPC2,
      UPDATE_VPC,
    } = useNamespacedActions(NETWORKVPC, [
      "CREATE_VPC",
      "DETAIL_VPC",
      "DETAIL_VPC2",
      "UPDATE_VPC",
    ]);
    const vpcedit = ref();
    const isEdit = ref(false)
    const setvpcedit = (payload) => {
      vpcedit.value = payload;
    };
    watch(vpcedit, (val) => {
      name.value = val.name;
      description.value = val.description;
      ip.value = val.ip;
      prefix.value = val.prefix;
      nameEdit.value = val.name
      selectedBillingType.value = val.billing_type
      
    });
    function addVpc() {
      console.log(selectedTrialVoucher)
      $v.value.$touch();
        const Value = {
          name: name.value,
          description: description.value,
          region: regionidselected.value,
          ip: ip.value,
          network_size: parseInt(prefix.value, 10), // Convert to integer
          voucher_id: selectedBillingType.value == 'Trial' ? selectedTrialVoucher.value : null,
          billing_type: selectedBillingType.value,
          type: type.value
        };
        if ($v.value.$errors.length) return;

        // When the select region button is disabled
        if (!regionidselected.value) Value.region = 'TKP'

        CREATE_VPC(Value).then(response => {
          if (response && response.code === 200) {
            this.$router.push("/network/vpc");
            context.root.$store.dispatch(
              "HOMEPAGE/showSuccessToast",
              "VPC Network has been successfully created",
              { root: true }
            );
          }
        });
    }
    const UpdateVpc = () => {
      const { id } = context.root._route.query;
      $v.value.$touch();
      const Value = {
        id: id,
        name: isEdit.value ? nameEdit.value : name.value,
        description: description.value,
        region: regionidselected.value,
        ip: ip.value,
        network_size: parseInt(prefix.value, 10), // Convert to integer
      };
      if ($v.value.$errors.length) return;
      UPDATE_VPC(Value).then((response) => {
        if (response && response.code === 200) {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToast",
            "VPC Network has been successfully updated",
            { root: true }
          );
          context.root.$router.replace("/network/vpc");
        }
      });
    };

    const fetchDataVPC = async () => {
      const { id } = context.root._route.query;
      if (!id) return;
      // const response = await DETAIL_VPC({ id });
      const response = await DETAIL_VPC2({ id });
      const { name, description, ip_prefix, network_size, type, billing_type } = response.data;
      const payload = {
        name,
        description,
        ip: ip_prefix,
        prefix: network_size,
        billing_type,
      };
      type == 'Expert' ? isEdit.value = true : isEdit.value = false
      setvpcedit(payload);
    };

    const dummyRegions = [
      {
        region: "TKP",
      },
    ];

    onMounted(async () => {
      if (postpaid_type && postpaid_type === 'fixed') {
        billingTypes.value = fixedPostpaid
        selectedBillingType.value = ''
      } else {
        billingTypes.value = defaultBillingTypes
        selectedBillingType.value = 'Default'
      }

      await fetchVouchers()
    })

    return {
      isLoading,
      $v,
      ...Error,
      vouchers,
      selectedTrialVoucher,
      selectedBillingType,
      // selectedBillingTypeError,
      billingTypes,
      name,
      description,
      ip,
      prefix,
      prefixes,
      addVpc,
      isEditVpc,
      selectregions,
      fetchregions,
      regionidselected,
      vpcedit,
      setvpcedit,
      UpdateVpc,
      fetchDataVPC,
      dummyRegions,
      nameEdit,
      isEdit,
      type,
      types
    };
  },
  created() {
    this.fetchregions();
    this.fetchDataVPC();
  },
  beforeRouteEnter(to, from, next) {
    const id = to.query.id;
    if (id) {
      next();
    } else {
      next();
    }
  },
  computed: {
    ...mapGetters({
      projectId: "PROJECT/getprojectid",
      user: "ROLEPERMISSION/getuser"
    })
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.vpc-title {
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
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
::v-deep .v-text-field__details {
  position: static;
}
</style>