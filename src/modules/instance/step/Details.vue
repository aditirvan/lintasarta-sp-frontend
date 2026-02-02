<template>
  <div>
    <v-card-text class="pt-0">
      <v-row
        ><v-col sm="12" md="6" class="pt-0 pb-0">
          <p class="font-weight-bold">Instance Name</p>
          <v-text-field
            id="InstanceName"
            v-model="instanceName"
            :error-messages="$v.instanceName.$errors.length ? $v.instanceName.$errors[0].$message : ''"
            return-object
            placeholder="Instance Name"
            outlined
          >
          </v-text-field> </v-col
      ></v-row>
    </v-card-text>
    <v-card-text class="pb-0 pt-0 ml-3">
      <v-row>
        <v-radio-group
          v-model="selectTypeInstance"
          row
          @blur="$v.selectTypeInstance.$touch()"
          :error-messages="$v.selectTypeInstance.$errors.length ? $v.selectTypeInstance.$errors[0].$message : ''"
        >
          <v-radio
            label="Operating System"
            value="operatingsystem"
            class="font-weight-bold d-flex align-center flex-row px-4 rounded-lg cursor-pointer"
            :style="{
              border: `2px solid ${selectTypeInstance == 'operatingsystem' ? '#2C94D2' : '#BDBDBD'}`,
              border: `2px solid ${$v.selectTypeInstance.$errors.length ? '#eb5757' : '#BDBDBD'}`,
              width: '233px',
              height: `65px`,
            }"
          ></v-radio>
          <v-radio
            label="Instance Image"
            value="instanceimage"
            class="font-weight-bold d-flex align-center flex-row px-4 rounded-lg cursor-pointer"
            :style="{
              border: `2px solid ${selectTypeInstance == 'instanceimage' ? '#2C94D2' : '#BDBDBD'}`,
              border: `2px solid ${$v.selectTypeInstance.$errors.length ? '#eb5757' : '#BDBDBD'}`,
              width: '233px',
              height: `65px`,
            }"
          ></v-radio>
        </v-radio-group>
      </v-row>
    </v-card-text>
    <!-- end select type-->

    <v-card-text class="pb-0 pt-0">
      <v-row v-if="selectTypeInstance == 'operatingsystem'">
        <v-col cols="12" class="mb-0 pb-0">
          <p class="font-weight-bold">Operating System & Version</p>
        </v-col>

        <v-col v-if="listOs.length == 0" class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-col>

        <v-col class="d-flex flex-wrap pt-0 pl-0 ml-5" v-else>
          <v-sheet max-width="100%" class="mt-0 pl-0 ml-0">
            <v-slide-group class="py-2 pt-0 ma-0" active-class="success" show-arrows>
              <v-card
                v-for="os in listOs"
                :key="os.value"
                @click="
                  () => {
                    osSelected = os.value;
                  }
                "
                border-color="primary"
                outlined
                class="rounded-lg select-instance pb-0 d-flex flex-column"
                style="margin-right: 30px; max-width: 170px; width: 100%; flex: 1"
                :style="{
                  border: `1px solid ${os.value === osSelected ? '#2C94D2' : '#A5B3BF'}`,
                  backgroundColor: os.value === osSelected ? '#2C94D205' : undefined,
                  cursor: 'pointer',
                }"
              >
                <v-card-text class="py-3 d-flex flex-column" style="flex: 1">
                  <div class="pa-0 ma-0 d-flex justify-center flex-column align-center" style="flex: 1">
                    <v-img
                      v-if="os.logo"
                      :aspect-ratio="1 / 1"
                      :src="os.logo"
                      :alt="os.text"
                      width="32"
                      height="32"
                      class="mb-3"
                      style="max-height: 32px; max-width: 32px; background-image: contain"
                    />
                    <p
                      class="font-weight-bold mb-0 text-center"
                      style="font-size: 16px"
                      :style="{
                        color: `${os.value === osSelected ? '#1F60A8' : '#A5B3BF'}`,
                      }"
                    >
                      {{ os.text }}
                    </p>
                    <!-- diskon -->
                    <!-- os.price > 0 && osChargingDiscount && osChargingDiscount > 0 // -->
                    <div v-if="os.price > 0 && discountOs && discountOs > 0">
                      <p class="mb-0 ma-1 body-2 font-weight-black text-decoration-line-through">
                        {{ os.price == 0 ? "Non Paid - Free" : toIDRWithDotFormat(os.price) }}
                      </p>
                      <p
                        class="mb-0 ma-1"
                        style="font-weight: 600"
                        :style="{
                          color: `${os.value === osSelected ? '#1F60A8' : '#A5B3BF'}`,
                        }"
                      >
                        {{ os.price == 0 ? "Non Paid - Free" : toIDRWithDotFormat(os.price - (os.price * discountOs) / 100) }}
                      </p>
                    </div>

                    <div v-else>
                      <p
                        class="mb-0 ma-1"
                        style="font-weight: 600"
                        :style="{
                          color: `${os.value === osSelected ? '#1F60A8' : '#A5B3BF'}`,
                        }"
                      >
                        {{ os.price == 0 ? "Non Paid - Free" : toIDRWithDotFormat(os.price) }}
                      </p>
                    </div>
                  </div>
                </v-card-text>
                <v-divider
                  :style="{
                    background: `${os.value === osSelected ? '#2C94D2' : '#A5B3BF'}`,
                  }"
                />
                <v-card-text class="ma-0 pa-0" style="max-height: 44px">
                  <v-select
                    v-if="os.value === osSelected"
                    v-model="versionSelected"
                    :error-messages="$v.versionSelected.$errors.length ? $v.versionSelected.$errors[0].$message : ''"
                    :items="
                      images
                        .filter((x) => x.os_id === osSelected)
                        .map((x) => {
                          return {
                            text: `${x.version_number} ${x.version_name}`,
                            value: x.id,
                          };
                        })
                    "
                    class="ma-0 px-0 py-0 select-version"
                    :placeholder="$v.versionSelected.$errors.length ? '' : 'Select Version'"
                    style="margin-top: -6px !important; color: #1f60a8"
                    outlined
                  >
                    <template class="pa-0 ma-0" v-slot:selection="{ item }">
                      <p class="font-weight-medium mb-0 my-0 pa-0">
                        {{ item.text }}
                      </p>
                    </template>
                    <template v-slot:item="{ item }" class="rounded-xl rounded-t-0" style="color: '#1F60A8'">
                      {{ item.text }}
                    </template>
                  </v-select>
                  <v-select
                    v-else
                    :error-messages="$v.versionSelected.$errors.length ? $v.versionSelected.$errors[0].$message : ''"
                    :items="
                      images
                        .filter((x) => x.os_id === osSelected)
                        .map((x) => {
                          return {
                            text: `${x.version_number} ${x.version_name}`,
                            value: x.id,
                          };
                        })
                    "
                    class="ma-0 px-0 py-0 select-version"
                    :placeholder="$v.versionSelected.$errors.length ? '' : 'Select Version'"
                    style="margin-top: -6px !important; color: '#A5B3BF'"
                    outlined
                  >
                    <template class="pa-0 ma-0" v-slot:selection="{ item }">
                      <p
                        class="font-weight-medium mb-0 my-0 pa-0"
                        :style="{
                          color: `${os.value === osSelected ? '#1F60A8' : '#BDBDBD'}`,
                        }"
                      >
                        {{ item.text }}
                      </p>
                    </template>
                    <template class="" v-slot:item="{ item }">
                      {{ item.text }}
                    </template>
                  </v-select>
                </v-card-text>
              </v-card>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0" v-if="selectTypeInstance == 'instanceimage'">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0">
          <p class="font-weight-bold">Instance Image</p>
          <v-select
            :items="customImages"
            v-model="selectedCustomImage"
            placeholder="Choose Custom Image"
            outlined
            :error-messages="$v.selectedCustomImage.$errors.length ? 'Instance Image couldnt be empty.' : ''"
            item-value="id"
            return-object
          >
            <template v-slot:selection="{ item }"> {{ item.name }} (version {{ item.version }}) </template>
            <template v-slot:item="{ item }"> {{ item.name }} (version {{ item.version }}) </template></v-select
          >
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0">
          <p class="font-weight-bold">Zone</p>
          <v-select
            id="SelectZone"
            v-model="selectedZoneModel"
            :items="zoneByProject"
            item-value="zone"
            item-text="name"
            return-object
            placeholder="Choose Zone"
            outlined
            :error-messages="$v.selectedZoneModel.$errors.length ? $v.selectedZoneModel.$errors[0].$message : ''"
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="6" class="pt-0 pb-0">
          <p><b>Instance Billing Type</b></p>
          <v-select
            id="billingType"
            placeholder="Choose Instance Billing Type"
            v-model="selectedBillingType"
            :items="listBillingType"
            item-value="value"
            item-text="text"
            @change="getTrial($event)"
            outlined
            @blur="$v.selectedBillingType.$touch()"
            :error-messages="$v.selectedBillingType.$errors.length ? $v.selectedBillingType.$errors[0].$message : ''"
          >
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
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
    </v-card-text>

    <v-card-text class="mt-4">
      <v-row class="d-flex justify-end">
        <!-- <v-col cols="3">
          <router-link to="/networking"> <v-btn color="#a5b3bf" class="white--text fz-16" block height="40"> Cancel </v-btn></router-link>
        </v-col> -->
        <!-- <v-col class="d-flex flex-row justify-center" cols="3">
          <v-btn class="fz-16" color="primary" block outlined height="45" @click="prev()"> Previous </v-btn>
        </v-col> -->
        <v-col class="d-flex flex-row justify-center" cols="3">
          <v-btn class="white--text fz-16" color="secondary" block height="45" @click="next()"> Next </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "@vue/composition-api";
import { required, helpers, requiredIf, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import INSTANCE from "../namespace";
import { IMAGES } from "@/modules/images/namespace";
import { MANAGEZONE } from "@/modules/superadmin-manageflavors/namespace";
import { MANAGEVOUCHER } from "@/modules/superadmin-managevoucher/namespace";
import { VOUCHER } from "@/modules/voucher/namespace";

export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
    dataDetails: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { fetchimages } = useNamespacedActions(INSTANCE, ["fetchimages"]);
    const { images, instanceDetail } = useNamespacedState(INSTANCE, ["images", "instanceDetail"]);
    const { fetchCustomImage } = useNamespacedActions(IMAGES, ["fetchCustomImage"]);
    const { customImages } = useNamespacedState(IMAGES, ["customImages"]);
    const { fetchZoneByProject } = useNamespacedActions(MANAGEZONE, ["fetchZoneByProject"]);
    const { zoneByProject } = useNamespacedState(MANAGEZONE, ["zoneByProject"]);
    const { fetchVoucherDiscountByProjectID } = useNamespacedActions(MANAGEVOUCHER, ["fetchVoucherDiscountByProjectID"]);
    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, ["voucherDiscountProject"]);
    const { fetchVouchers } = useNamespacedActions(VOUCHER, ["fetchVouchers"]);
    const { vouchers } = useNamespacedState(VOUCHER, ["vouchers"]);

    onMounted(() => {
      localCurrentProj.value = JSON.parse(localStorage.getItem("currentProj") || "{}");
      const paramsImage = {
        limit: 999,
        region: localCurrentProj.value.region,
      };

      fetchimages(paramsImage);
      fetchCustomImage();
      fetchZoneByProject({ project_id: localCurrentProj.value.id });
      fetchVoucherDiscountByProjectID(localCurrentProj.value.id);

      if (context.root.$route.query.image_ref) {
        selectTypeInstance.value = "instanceimage";
        selectedCustomImage.value = context.root.$route.query.image_ref;
        setTimeout(() => {
          selectedZoneModel.value = zoneByProject.value.find((item) => item.name == instanceDetail.value.zone);
          selectedBillingType.value = instanceDetail.value.billing_type;
        }, 2500);
      }
    });

    const listOs = computed(() => {
      let osIds = [];
      return images.value
        .filter((img) => {
          if (!osIds.includes(img.os_id)) {
            osIds.push(img.os_id);
            return true;
          }
          return false;
        })
        .map((x) => {
          return {
            text: x.os_name,
            value: x.os_id,
            logo: x.os_logo,
            version: x.version_name,
            price: x.os.price,
          };
        });
    });

    const discountOs = computed(() => {
      return voucherDiscountProject.value ? voucherDiscountProject.value?.voucher_discount_detail?.os_charging : 0;
    });
    const localCurrentProj = ref("");
    const selectTypeInstance = ref(props.dataDetails.typeInstance);
    const versionSelected = ref(props.dataDetails.image_os_id);
    const osSelected = ref(props.dataDetails.osSelected);
    const selectedCustomImage = ref(props.dataDetails.image_id);
    const selectedZoneModel = ref(props.dataDetails.zone);
    const instanceName = ref(props.dataDetails.name);
    const selectedBillingType = ref(props.dataDetails.billing_type);
    const selectedTrialVoucher = ref(props.dataDetails.voucher_id);

    const listBillingType = computed(() => {
      const ppu = [{ text: "Pay Per Use (PPU)", value: "PPU" }];
      const fixed = [{ text: "Fixed", value: "Fixed" }];
      const trial = [{ text: "Trial", value: "Trial" }];
      const data = localCurrentProj.value.postpaid_type == "fixed" ? trial.concat(fixed) : trial.concat(ppu);
      return data;
    });

    const $v = useVuelidate(
      {
        selectTypeInstance: {
          required: helpers.withMessage("Type couldnt be empty.", (val) => {
            return val;
          }),
        },
        versionSelected: {
          required: requiredIf((val) => {
            return selectTypeInstance.value === "operatingsystem";
          }),
        },
        selectedCustomImage: {
          required: requiredIf((val) => {
            return selectTypeInstance.value === "instanceimage";
          }),
        },
        selectedZoneModel: {
          required: helpers.withMessage("Zone couldnt be empty.", (val) => {
            return val;
          }),
        },
        instanceName: {
          required: helpers.withMessage("Instance Name couldnt be empty.", (val) => {
            return val;
          }),
          minLength: minLength(5),
          $autoDirty: true,
          whitespaceStart: helpers.withMessage("Can not start with whitespace", (val) => {
            if (val[0] === " ") return false;
            return true;
          }),
          whitespaceEnd: helpers.withMessage("Can not end with whitespace", (val) => {
            let endChar = val.length - 1;
            if (val[endChar] === " ") return false;
            return true;
          }),
          specialChars: helpers.withMessage("Can not contain special character", (val) => {
            return !val.match(/[^A-Za-z0-9-_]/g);
          }),
        },
        selectedBillingType: {
          required: helpers.withMessage("Instance Billing Type couldnt be empty.", (val) => {
            return val;
          }),
        },
        selectedTrialVoucher: {
          required: requiredIf((val) => {
            return selectedBillingType.value === "Trial";
          }),
        },
      },
      {
        selectTypeInstance,
        versionSelected,
        selectedZoneModel,
        selectedCustomImage,
        instanceName,
        selectedBillingType,
        selectedTrialVoucher,
      }
    );
    const getTrial = (event) => {
      if (event == "Trial") {
        fetchVouchers();
      }
    };
    const next = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
        name: instanceName.value,
        zone: selectedZoneModel.value.zone ? selectedZoneModel.value.zone : props.dataDetails.zone,
        region: selectedZoneModel.value.region ? selectedZoneModel.value.region : props.dataDetails.region,
        typeInstance: selectTypeInstance.value,
        billing_type: selectedBillingType.value,
        // osSelected: osSelected.value ? osSelected.value : props.dataDetails.osSelected,
      };
      if (selectTypeInstance.value === "operatingsystem") payload.image_os_id = versionSelected.value;
      if (selectTypeInstance.value === "operatingsystem") payload.osSelected = osSelected.value ? osSelected.value : props.dataDetails.osSelected;      
      if (selectTypeInstance.value === "instanceimage"){
        if(selectedCustomImage.value.id === undefined){           
          payload.image_id = selectedCustomImage.value;
        }else{
          payload.image_id = selectedCustomImage.value.id ? selectedCustomImage.value.id : props.dataDetails.image_id;
        }    
      }                      
      if (selectedBillingType.value == "Trial") payload.voucher_id = selectedTrialVoucher.value;

      // console.log("payload", payload);
      context.emit("get-data", payload);
      context.emit("update:step", props.step + 1);
    };

    return {
      localCurrentProj,
      selectTypeInstance,
      versionSelected,
      selectedCustomImage,
      $v,
      images,
      listOs,
      osSelected,
      selectedZoneModel,
      customImages,
      toIDRWithDotFormat,
      zoneByProject,
      instanceName,
      next,
      voucherDiscountProject,
      discountOs,
      selectedBillingType,
      listBillingType,
      selectedTrialVoucher,
      getTrial,
      vouchers,
      instanceDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
.select-version.v-text-field--outlined {
  ::v-deep fieldset {
    border-color: transparent;
    color: #2c94d2;
  }
}
#SelectVersion .v-select .dropdown-toggle {
  margin: 0;
}

.v-application p,
.v-application label,
.v-application td,
.v-application .select-version .v-menu__content {
  border-radius: 15px 15px 50px 50px;
}
// ::v-deep .v-text-field__details {
//   position: static;
// }
</style>
