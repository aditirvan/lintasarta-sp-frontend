<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Add Floating IP</div>
      </v-card-text>

      <v-card-text v-if="!isPrepaid">
        <p class="titletext">Floating IP Type</p>

        <v-select
          id="floatingIpType"
          placeholder="Select Floating IP Type"
          :items="listFloatingIp"
          v-model="floatingIpType"
          outlined
          single-line
          append-icon="mdi-chevron-down"
          :error-messages="floatingIpTypeError"
          item-text="type"
          item-value="id"
          @change="changeType($event)"
        />

        <div v-if="Object.keys(dataFloatingType).length != 0" class="primary--text">
          <p v-if="floatingIpDiscount && floatingIpDiscount > 0" class="body-2 primary--text">
            *{{ dataFloatingType.type }}
            Price
            <span style="text-decoration: line-through">{{ toIDRWithDotFormat(dataFloatingType.price_per_month) }}/month</span>
            <span class="body-2 font-weight-bold ml-1">{{ toIDRWithDotFormat(dataFloatingType.price_per_month) }}/month</span>
          </p>
          <p v-else>*{{ dataFloatingType.type }} Price {{ toIDRWithDotFormat(dataFloatingType.price_per_month) }}/month</p>
        </div>
        <p v-else class="primary--text">*Information about floating IP type price</p>

        <!-- <p class="primary--text">
          *Reserved Price RP 10,003/month
        </p> -->
      </v-card-text>

      <v-card-text>
        <p class="titletext">Billing Type</p>
        <v-select
          id="billingType"
          placeholder="Select Billing Type"
          :items="billingTypes"
          v-model="billingType"
          outlined
          single-line
          append-icon="mdi-chevron-down"
          :error-messages="billingTypeError"
        />
      </v-card-text>

      <v-card-text v-if="billingType === 'Trial'">
        <p class="titletext">Trial Voucher</p>
        <v-select
          id="trialVoucher"
          placeholder="Choose trial voucher to use"
          :items="vouchers"
          v-model="trialVoucher"
          item-value="id"
          outlined
          single-line
          append-icon="mdi-chevron-down"
          :error-messages="trialVoucherError"
        >
          <template v-slot:selection="{ item }"> {{ item.name }} - {{ item.code }} </template>
          <template v-slot:item="{ item }"> {{ item.name }} - {{ item.code }} </template>
        </v-select>
      </v-card-text>

      <!-- <v-card-text>
        <p class="titletext">VPC</p>
        <v-select
          id="selectedVPC"
          placeholder="Select VPC"
          :items="vpcItems"
          v-model="selectedVPC"
          outlined
          single-line
          append-icon="mdi-chevron-down"
          :error-messages="selectedVPCError"
        />
      </v-card-text> -->

      <v-card-text>
        <p class="titletext">Port</p>
        <v-select
          id="selectedVPCPort"
          placeholder="Select Port"
          :items="vpcportItems"
          v-model="selectedVPCPort"
          item-disabled="disable"
          outlined
          single-line
          append-icon="mdi-chevron-down"
          :error-messages="selectedVPCPortError"
        />
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="
                () => {
                  $emit('input', false);
                }
              "
              :disabled="loading"
            >
              <!-- loading indicator -->
              <beat-loader v-if="loading" :loading="loading" :color="'white'" :size="'10px'" class="ml-2" />

              Cancel
            </v-btn>
          </v-col>

          <v-col>
            <v-btn id="Add" depressed height="45" block class="secondary" @click="processFloatingIP" :disabled="loading">
              <!-- loading indicator -->
              <beat-loader v-if="loading" :loading="loading" :color="'white'" :size="'10px'" class="ml-2" />

              Create
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- <dialogFloatingIpConfirmation
      v-if="isShowConfirmDialog"
      :data="confirmDialogData"
      v-model="isShowConfirmDialog"
      @confirm="
        () => {
          submit();
          isShowConfirmDialog = false;
        }
      "
    /> -->

    <!-- dialog purchase floating ip -->
    <dialogNewServiceAvailability
      v-if="isShowConfirmDialog"
      :onClose="() => {isShowConfirmDialog = false}"
      serviceName="Floating IP"
      actionName="Assign Floating IP"
      :onAvailable="submit"
    />
  </v-dialog>
</template>

<script>
import { computed, ref, onMounted, watch } from "@vue/composition-api";
import api from "@/lib/api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedMutations, useNamespacedState } from "vuex-composition-helpers";
import { INSTANCE } from "./namespace";
import { useVoucher } from "@/modules/voucher/useVoucher";
// import dialogFloatingIpConfirmation from "../network/floatingip/dialogFloatingIpConfirmation.vue";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import libProject from "@/lib/project";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { MANAGEVOUCHER } from "../superadmin-managevoucher/namespace";
import localstorage from "@/lib/localstorage";
import { NETWORKFLOATINGIP } from "../network/floatingip/namespace";
import { useVpc } from "./compositionapi/usevpc";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";

export default {
  props: ["value", "item"],
  components: {
    // dialogFloatingIpConfirmation,
    dialogNewServiceAvailability,
  },
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });
    const { fetchVouchers, vouchers, claimVoucher } = useVoucher();
    const loading = ref(false);

    const defaultBillingTypeTrial = {
      text: "Trial",
      value: "Trial",
    }

    const defaultBillingTypePpu = {
      text: "Pay Per Use (PPU)",
      value: "PPU",
    }

    const defaultBillingTypeMonthly = {
      text: "Monthly",
      value: "Monthly",
    }

    const defaultBillingTypeFixed = {
      text: "Fixed",
      value: "Fixed",
    }

    const billingTypes = ref([]);

    const projJson = localstorage.getItem("currentProj");
    const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};
    const postpaid_type = projObj.postpaid_type;
    const { fetchVoucherDiscountByProjectID } = useNamespacedActions(MANAGEVOUCHER, ["fetchVoucherDiscountByProjectID"]);
    const { listFloatingIp } = useNamespacedGetters(NETWORKFLOATINGIP, ["listFloatingIp"]);
    const { getFlavorFloatingIp } = useNamespacedActions(NETWORKFLOATINGIP, ["getFlavorFloatingIp"]);

    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, ["voucherDiscountProject"]);
    const billingType = ref("");
    const billingTypeError = ref("");
    const floatingIpTypes = ref([]);
    const floatingIpType = ref("");
    const floatingIpTypeError = ref("");
    // const trialVouchers = ref([]);
    const trialVoucher = ref("");
    const trialVoucherError = ref("");
    const isShowConfirmDialog = ref(false);
    const confirmDialogData = ref(null);
    const isPrepaid = ref(false);
    const floatingIpDiscount = ref(0);
    // const selectedVPC = ref("")
    // const selectedVPCError = ref("");
    const selectedVPCPort = ref("");
    const selectedVPCPortError = ref("");
    // const vpcItems = ref([]);
    const vpcportItems = ref([]);
    const dataFloatingType = ref({});

    const checkIsPrepaid = async () => {
      const currProj = await libProject.getActiveProject();
      isPrepaid.value = currProj.payment_method.toLowerCase() === "prepaid" ? true : false;
    };

    const { addfloatingip, confirmFloatingIp,validateVPCPortFloatingIp } = useNamespacedActions("NETWORKFLOATINGIP", ["addfloatingip", "confirmFloatingIp","validateVPCPortFloatingIp"]);
    const { setopendialogbalance, setopendialogbalancemsg } = useNamespacedMutations("DASHBOARD", ["setopendialogbalance", "setopendialogbalancemsg"]);
    const { fetchPaginatedInstances } = useNamespacedActions(INSTANCE, ["fetchPaginatedInstances"]);

    const useComposable = {
      ...useVpc(),
    };

    // async function getVpcs() {
    //   const vpcs = await useComposable.fetchvpcs();
    //   vpcItems.value = vpcs.map((vpc) => {
    //     return {
    //       text: vpc.name+" ("+vpc.ip_prefix+"/"+vpc.network_size+")",
    //       value: vpc.id,
    //     };
    //   });
    // }

    const changeType = (event) => {
      const data = listFloatingIp.value.find((row) => row.id == event);
      dataFloatingType.value = data;
      // return data;
    };

    const getTypeName = (event) => {
      const data = listFloatingIp.value.find((row) => row.id == event);
      return data?.type.toLowerCase();
    };

    const getTypeId = (event) => {
      const data = listFloatingIp.value.find((row) => row.type.toLowerCase() == event.toLowerCase());
      return data?.id;
    };

    async function getVpcPorts() {      
      const vpcports = await useComposable.fetchvpcportsfiplist(props.item.id);
      vpcportItems.value = vpcports.map((vpcport) => {
        return {
          text: vpcport.vpc_name + " (" + vpcport.name + "/" + vpcport.ip_address + ")",
          value: vpcport.id,
          disable: vpcport.disable
        };
      });
    }

    const assignFloatingIP = async (obj) => {
      loading.value = true;
      try {
        const response = await addfloatingip(obj);
        emit("input", false);
        if (response.status === 200) await fetchPaginatedInstances();
      } catch (error) {}
      loading.value = false;
    };

    const processFloatingIP = async () => {
      // cek terlebih dahulu apakah portnya sudah di attach
      const payloadValidate = {
        port_id: selectedVPCPort.value,
      };
      const response = await validateVPCPortFloatingIp(payloadValidate);
      console.log("res validate ", response);
      if (response.data.code !== 200) {
        console.log("status code bukan 200 ", response.code);
        return;
      }

      const role = localStorage.getItem("role")

      if (isPrepaid.value) {
        floatingIpType.value = "non-reserved";
      }
      if (!billingType.value && !floatingIpType.value) {
        billingTypeError.value = "Value is required";
        floatingIpTypeError.value = "Value is required";
      } else if (!billingType.value) billingTypeError.value = "Value is required";
      else if (!floatingIpType.value) floatingIpTypeError.value = "Value is required";
      // else if (!selectedVPC.value)
      //   selectedVPCError.value = "Value is required";
      else if (!selectedVPCPort.value) selectedVPCPortError.value = "Value is required";
      else if (billingType.value && billingType.value === "trial" && !trialVoucher.value) trialVoucherError.value = "Value is required";
      
      if (role !== "Superadmin") {
        await checkAvailability(
          {
            by: "custom", 
            item: {
              service_name: 'FLOATING_IP', 
              id: isPrepaid.value ? getTypeId(floatingIpType.value) : floatingIpType.value,
            }
          }
        )
        
        isShowConfirmDialog.value = true
      } else {
        submit()
      }
    };

    const submit = () => {
      assignFloatingIP({
        id: props.item.id,
        voucher_id: trialVoucher.value ? trialVoucher.value : null,
        ip_type: floatingIpType.value,
        billing_type: billingType.value,
        vpc_id: selectedVPCPort.value,
        port_id: selectedVPCPort.value,
      });
    };

    onMounted(async () => {
      if (isPrepaid.value || postpaid_type !== "fixed") {
        billingTypes.value = [defaultBillingTypePpu, defaultBillingTypeTrial]
      } else {
        billingTypes.value = [defaultBillingTypeFixed, defaultBillingTypeTrial]
      }

      await getFlavorFloatingIp();
      await getVpcPorts();
      if (props.item.billing_type === "Trial") {
        loading.value = true;
        await fetchVouchers();
        loading.value = false;
      }

      await fetchVoucherDiscountByProjectID(projObj.id);
      if (voucherDiscountProject.value) {
        floatingIpDiscount.value = voucherDiscountProject.value.voucher_discount_detail.floating_ip;
      }

      // getVpcs();
    });

    const {checkAvailability} = useNewServiceAvailability()

    watch(
      floatingIpType,
      () => {
        if (postpaid_type === 'fixed') {
          billingTypes.value = [defaultBillingTypeFixed, defaultBillingTypeTrial]
          return
        } else if (floatingIpType.value) {
          switch (getTypeName(floatingIpType.value)) {
            case "reserved": {
              billingTypes.value = [defaultBillingTypeMonthly, defaultBillingTypeTrial]
              return
            }
            case "non-reserved": {
              billingTypes.value = [defaultBillingTypePpu, defaultBillingTypeTrial]
              return
            }
          }

        }
        billingTypes.value = []
      },
      { deep: true }
    );

    return {
      vouchers,
      checkIsPrepaid,
      isPrepaid,
      submit,
      confirmDialogData,
      confirmFloatingIp,
      processFloatingIP,
      assignFloatingIP,
      dialog,
      loading,
      billingTypes,
      billingType,
      billingTypeError,
      floatingIpTypes,
      floatingIpType,
      floatingIpTypeError,
      // trialVouchers,
      trialVoucher,
      trialVoucherError,
      // vpcItems,
      // selectedVPC,
      // selectedVPCError,
      vpcportItems,
      selectedVPCPort,
      selectedVPCPortError,
      isShowConfirmDialog,
      floatingIpDiscount,
      toIDRWithDotFormat,
      listFloatingIp,
      changeType,
      dataFloatingType,
      getTypeName,
    };
  },
  computed: {
    selectedFloatingIP() {
      return this.floatingIpTypes.find((type) => type.value === this.floatingIpType);
    },
    floatingIpPrice() {
      if (this.selectedFloatingIP) {
        return this.selectedFloatingIP.price;
      }

      return 0;
    },
    floatingIpName() {
      if (this.selectedFloatingIP) {
        return this.selectedFloatingIP.text;
      }

      return "";
    },
  },
  methods: {
    async getFloatingIpTypes(type, text) {
      this.loading = true;

      try {
        const res = await api.GET("/network/floating-ip/price/" + type);

        this.floatingIpTypes.push({
          text,
          value: res.data.type,
          price: res.data.price_per_month,
        });
      } catch {
        this.$store.dispatch("HOMEPAGE/showErrorToast", `Sorry, an error occurred while displaying floating IP ${type} type`);
      }

      this.loading = false;
    },
    // async getTrialVouchers() {
    //   this.loading = true;

    //   // console.log(x.voucher)

    //   try {
    //     const res = await api.GET("/user/voucher/claimed");

    //     this.trialVouchers = res.data
    //     // this.trialVouchers = res.data.filter((x) => x.voucher.id);
    //   } catch {
    //     this.$store.dispatch(
    //       "HOMEPAGE/showErrorToast",
    //       "Sorry, an error occurred while displaying trial vouchers"
    //     );
    //   }

    //   this.loading = false;
    // },
    onChangeHandler(e) {
      if (!this[e.target.id] && !this[e.target.id + "Error"]) {
        this[e.target.id + "Error"] = "Value is required";
      }

      if (this[e.target.id] && this[e.target.id + "Error"]) {
        this[e.target.id + "Error"] = "";
      }
    },
  },
  mounted() {
    this.getFloatingIpTypes("reserved", "Reserved");
    this.getFloatingIpTypes("non-reserved", "Non-Reserved");
    this.checkIsPrepaid();
  },
  watch: {
    billingType() {
      this.onChangeHandler({ target: { id: "billingType" } });
    },
    floatingIpType() {
      this.onChangeHandler({ target: { id: "floatingIpType" } });
    },
    trialVoucher() {
      this.onChangeHandler({ target: { id: "trialVoucher" } });
    },
  },
};
</script>

<style lang="scss" scoped>
.titletext {
  font-weight: 700;
  font-size: 12px;
}
</style>
