<template>
  <div>
    <v-card-text class="pb-0">
      <v-row>
        <v-col cols="12" md="6">
          <p class="mb-0"><b>Processor</b></p>
          <v-item-group>
            <v-row>
              <v-col v-for="(row, index) in listProcessorType" :key="index" md="5" sm="12">
                <v-item v-slot="{ active, toggle }">
                  <v-card
                    class="d-flex align-center rounded-lg no-shadow"
                    height="200"
                    @click="toggle"
                    :style="{ border: active || processor.includes(row.name.toLowerCase()) ? '2px solid #1F60A8' : '2px solid #A5B3BF' }"
                    :class="{ 'error-red': $v.processor.$errors.length }"
                  >
                    <v-card-text class="ma-0 pa-0">
                      <v-img class="ma-7" :src="require(`@/assets/${row.img}`)" max-height="75"></v-img>
                      <p class="font-weight-bold mb-0 text-center">{{ row.name }}</p>
                      <v-divider
                        :color="active || processor.includes(row.name.toLowerCase()) ? '#1F60A8' : '#A5B3BF'"
                        class="mt-2"
                        :class="{ 'error-red': $v.processor.$errors.length }"
                      ></v-divider>
                      <v-card-text class="ma-0 pa-0">
                        <v-select
                          :placeholder="$v.processor.$errors.length ? '' : 'Select Processor'"
                          v-model="processor"
                          :error-messages="$v.processor.$errors.length ? $v.processor.$errors[0].$message : ''"
                          :items="row.text"
                          item-value="id"
                          item-text="name"
                          outlined
                          class="ma-0 pb-2 select-version"
                        >
                        </v-select>
                      </v-card-text>
                    </v-card-text>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0" v-if="processor">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0">
          <p class="font-weight-bold">Choose a Plan</p>
          <v-select
            id="chooseaplan"
            placeholder="Choose a Plan"
            v-model="planSelected"
            :items="listInstanceType"
            item-value="id"
            item-text="name"
            @change="changeType($event)"
            outlined
            @blur="$v.planSelected.$touch()"
            :error-messages="$v.planSelected.$errors.length ? $v.planSelected.$errors[0].$message : ''"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0" v-if="planSelected">
      <v-row>
        <v-col class="mb-2">
          <div>
            <p class="mb-0"><span class="font-weight-bold">Instance Size</span></p>
            <p class="mt-2 mb-0" v-if="dataDetails.billing_type == 'PPU'">
              If service usage has exceeded
              <b class="primary--text">95%</b> in one month, payment will be shifted from hourly to monthly
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex flex-wrap pt-0">
          <v-card
            v-if="planSelected && !listInstanceSize.length"
            width="170"
            height="100"
            border-color="primary"
            outlined
            class="rounded-lg select-instance mb-5 mt-4"
            style="margin-right: 20px"
            disabled
          >
            <v-card-text class="pb-0 text-center">
              <p class="mb-0">There is no available flavor for selected processor, plan & region</p>
            </v-card-text>
          </v-card>

          <v-sheet v-if="planSelected && listInstanceSize.length" max-width="100%" class="mt-0">
            <v-slide-group class="py-4 pt-0" active-class="success" show-arrows>
              <v-card
                v-for="(instance, index) in listInstanceSize.filter((ele) => ele.status == 1).sort((a, b) => (a.vcpu > b.vcpu ? 1 : -1))"
                :key="index"
                :set="(discount = getInstanceDiscount(instance.flavor_ids))"
                @click="
                  () => {
                    instanceSelected = instance.id;
                  }
                "
                :disabled="instance.outOfStock"
                border-color="primary"
                outlined
                class="rounded-lg select-instance"
                :class="{
                  selected: instanceSelected ? Boolean(instanceSelected == instance.id) : false,
                }"
                style="margin-right: 20px; min-width: 170px"
                :style="{
                  border: $v.instanceSelected.$errors.length ? '1px solid #eb5757 !important' : '',
                }"
              >
                <v-card-text class="pb-0 text-center">
                  <p class="ma-0 pb-2">{{ instance.name }}</p>
                  <!-- <p class="text-subtitle-2 ma-0 pb-2"> ({{instance.region}}) </p> -->
                </v-card-text>
                <v-divider />
                <div v-if="discount">
                  <v-card-text class="pb-0 text-center">
                    <p class="body-2 mb-0" style="text-decoration: line-through">
                      {{ `${toIDRWithDotFormat(instance.price_per_month)}/mo` }}
                    </p>
                    <p class="font-weight-bold blue--text mb-0">
                      {{ `${toIDRWithDotFormat(instance.price_per_month - Math.round((instance.price_per_month * discount) / 100))}/mo` }}
                    </p>
                    <p class="body-2 mb-0" style="text-decoration: line-through">
                      {{ `${toIDRWithDotFormat(instance.price_per_hour)}/hour` }}
                    </p>
                    <p class="font-weight-bold blue--text">
                      {{ `${toIDRWithDotFormat(instance.price_per_hour - Math.round((instance.price_per_hour * discount) / 100))}/hour` }}
                    </p>
                  </v-card-text>
                  <v-divider />
                  <v-card-text class="m-0 p-0 text-center" style="padding: 20px">
                    <p class="fz-12 p-0" style="margin-bottom: 0">
                      <b>{{ instance.vcpu }} CPU</b> / {{ instance.ram }} GB Memory
                      <br />
                    </p>
                    <p v-if="instance.gpu" class="fz-12 ma-0 p-0">
                      with <b>{{ instance.gpu }}</b> unit{{ instance.gpu > 1 ? "s" : "" }}
                      Nvidia T4
                    </p>
                    <p v-if="instance.outOfStock" class="mb-0" style="font-size: 10px">Out of Stock</p>
                  </v-card-text>
                </div>

                <div v-else>
                  <v-card-text class="pb-0 text-center">
                    <p class="font-weight-bold mb-0">
                      {{ `${toIDRWithDotFormat(instance.price_per_month)}/mo` }}
                    </p>
                    <p>
                      {{ `${toIDRWithDotFormat(instance.price_per_hour)}/hour` }}
                    </p>
                  </v-card-text>
                  <v-divider />
                  <v-card-text class="m-0 p-0 text-center" style="padding: 20px">
                    <p class="fz-12 p-0" style="margin-bottom: 0">
                      <b>{{ instance.vcpu }} CPU</b> / {{ instance.ram }} GB Memory
                      <br />
                    </p>
                    <p v-if="instance.gpu" class="fz-12 ma-0 p-0">
                      with <b>{{ instance.gpu }}</b> unit{{ instance.gpu > 1 ? "s" : "" }}
                      Nvidia T4
                    </p>
                    <p v-if="instance.outOfStock" class="mb-0" style="font-size: 10px">Out of Stock</p>
                  </v-card-text>
                </div>
              </v-card>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0">
      <v-row>
        <v-col cols="12" md="6" class="pt-0">
          <p><b>Storage Type</b></p>
          <v-select
            id="vm_root_disk_type_id"
            placeholder="Choose Storage Type"
            v-model="selectedStorageType"
            :items="listStorageTypeBilling"
            item-value="id"
            outlined
            @change="changeTypeStorage($event)"
            @blur="$v.selectedStorageType.$touch()"
            :error-messages="$v.selectedStorageType.$errors.length ? $v.selectedStorageType.$errors[0].$message : ''"
          >
            <template v-slot:selection="{ item }"> {{ item.name }} - {{ item.description }} </template>
            <template v-slot:item="{ item }"> {{ item.name }} - {{ item.description }} </template>
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <v-row v-if="selectedStorageType" id="col_rootDiskSelected">
        <v-col class="py-0">
          <p class="font-weight-bold">
            Instance Root Disk
            <!-- <span class="primary--text ml-2" style="font-size: 12px" v-if="useRootDiskFromSnapshot">
              *Instance root disk size automatically uses the size of root disk in the selected snapshot.
            </span> -->
            <span
              :class="{
                'error--text': $v.rootDiskSelected.$errors.length,
              }"
              class="ml-2"
              style="font-size: 10px"
              v-if="$v.rootDiskSelected.$errors.length && dontShowError"
            >
              *{{ $v.rootDiskSelected.$errors[0].$message }}
            </span>

            <span
              :class="{
                'error--text': $v.customRootDiskSize.$errors.length,
              }"
              class="ml-2 pt-1"
              style="font-size: 10px"
              v-if="$v.customRootDiskSize.$errors.length"
            >
              *{{ $v.customRootDiskSize.$errors[0].$message }}
            </span>
          </p>
        </v-col>
      </v-row>

      <v-row v-if="selectedStorageType">
        <v-slide-group class="py-4 pt-0 px-0" active-class="success" show-arrows>
          <v-col class="d-flex py-0 px-0 flex-wrap">
            <v-card
              tabindex="0"
              min-width="170"
              border-color="primary"
              outlined
              :class="`rounded-lg select-instance mb-4 ${isCustomRootDiskSizeHighlighted || customRootDiskSize ? 'highlighted selected' : ''}`"
              style="text-align: center; margin-right: 20px"
              id="customSizeRootDisk"
            >
              <v-card-text class="pb-0 pt-5">
                <div v-if="discountStorage && discountStorage > 0 && customRootDiskSize">
                  <p class="body-2 mb-0" style="text-decoration: line-through">{{ calculateCustomRootDisk() }}/mo</p>
                  <p class="font-weight-bold blue--text mb-1">{{ calculateCustomRootDisk(discountStorage) }}/mo</p>

                  <p class="body-2 mb-0" style="text-decoration: line-through">{{ calculateCustomRootDisk(undefined, "hour") }}/hour</p>
                  <p class="font-weight-bold blue--text">{{ calculateCustomRootDisk(discountStorage, "hour") }}/hour</p>
                </div>

                <div v-else>
                  <p class="font-weight-bold mb-0">{{ calculateCustomRootDisk() }}/mo</p>
                  <p class="font-weight-bold">{{ calculateCustomRootDisk(undefined, "hour") }}/hour</p>
                </div>
              </v-card-text>

              <v-divider />
              <v-card-text class="pa-0">
                <v-text-field
                  class="px-4 pt-2 mt-2"
                  style="width: 170px"
                  flat
                  label="Enter Size"
                  suffix="GB"
                  v-model="customRootDiskSize"
                  @focus="
                    () => {
                      rootDiskSelected = null;
                      isCustomRootDiskSizeHighlighted = true;
                    }
                  "
                  @blur="
                    () => {
                      if (!customRootDiskSize) isCustomRootDiskSizeHighlighted = false;
                    }
                  "
                />
              </v-card-text>
            </v-card>

            <v-card
              width="170"
              v-for="(storage, index) in listInstanceRootDisk"
              :key="index"
              @click="
                () => {
                  rootDiskSelected = storage;
                  isCustomRootDiskSizeHighlighted = false;
                  customRootDiskSize = null;
                  sizeActive = null;
                }
              "
              border-color="primary"
              outlined
              class="rounded-lg select-instance mb-4"
              style="text-align: center; margin-right: 20px"
              :class="{
                bordererror: $v.rootDiskSelected.$errors.length,
                highlight: rootDiskSelected ? Boolean(rootDiskSelected.id == storage.id) : false || sizeActive == storage.volume_size ? true : false,
                selected: rootDiskSelected ? Boolean(rootDiskSelected.id == storage.id) : false || sizeActive == storage.volume_size ? true : false,
              }"
            >
              <v-card-text v-if="selectedStorageType" class="pb-0 pt-5">
                <div v-if="discountStorage && discountStorage > 0">
                  <p class="body-2 mb-0" style="text-decoration: line-through">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_month)) }}/mo</p>
                  <p class="font-weight-bold blue--text mb-1">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_month, discountStorage)) }}/mo</p>

                  <p class="body-2 mb-0" style="text-decoration: line-through">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_hour)) }}/hour</p>
                  <p class="font-weight-bold blue--text">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_hour, discountStorage)) }}/hour</p>
                </div>
                <div v-else>
                  <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_month)) }}/mo</p>

                  <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_hour)) }}/hour</p>
                </div>
              </v-card-text>

              <v-divider />

              <v-card-text>
                <p class="font-weight-bold mb-0">{{ storage.volume_size }} GB</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-slide-group>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col cols="12" md="6" class="pt-0">
          <p class="font-weight-bold fz-20">Default Instance Data Disk</p>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pt-0">
      <v-row>
        <v-col cols="12" md="6" class="pt-0">
          <p class="font-weight-bold">Volume Type</p>
          <v-select
            placeholder="Choose Volume Type"
            v-model="volumeTypeDefault"
            :items="listStorageTypeBilling"
            item-value="id"
            @change="changeDataDiskSize($event)"
            outlined
            :error-messages="defaultDiskTypeError"
            ><template v-slot:selection="{ item }"> {{ item.name }} - {{ item.description }} </template>
            <template v-slot:item="{ item }"> {{ item.name }} - {{ item.description }} </template></v-select
          >
        </v-col>
        <v-col cols="12" md="4" class="pt-0">
          <p class="font-weight-bold">Size</p>
          <v-select
            placeholder="Choose a Size"
            v-model="defaultDiskSize"
            :items="defaultInstanceDataDisk"
            outlined
            :disabled="!volumeTypeDefault"
            :filled="!volumeTypeDefault"
            :error-messages="defaultDiskSizeError"
          >
            <template v-slot:selection="{ item }"> {{ item.volume_size }} GB </template>
            <template v-slot:item="{ item }"> {{ item.volume_size }} GB </template></v-select
          >
        </v-col>
        <v-col cols="12" md="2" class="d-flex justify-center align-items-center">
          <v-btn depressed outlined height="55" width="100%" class="secondary white--text mt-3" @click="addDefaultDisk()"> Add </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0">
      <v-row>
        <v-col>
          <p
            class="error--text mb-0"
            :style="{
              opacity: addDefaultDiskError ? 1 : 0,
            }"
          >
            <b>{{ addDefaultDiskError }}</b>
          </p>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0">
      <v-row>
        <v-col class="d-flex align-items-center"><h2>Custom Instance Data Disk (max 12 Data Disk)</h2></v-col>
        <v-col class="d-flex justify-end"
          ><v-btn color="secondary" class="fz-14" outlined depressed height="50" @click="addCustomDataDisk()">Add Custom Data Disk</v-btn></v-col
        >
      </v-row>
    </v-card-text>

    <v-card-text class="pt-0">
      <v-row>
        <v-col>
          <v-data-table :headers="customDataDiskHeaders" :items="customDataDiskItems" :items-per-page="13" hide-default-footer>
            <template v-slot:item.type="{ item }">
              <v-select
                placeholder="Choose Volume Type"
                item-value="id"
                :value="item.type"
                @input="
                  (e) => {
                    customDiskItemChange(item.index, 'type', e);
                  }
                "
                :error-messages="item.typeError ? 'Value is required' : ''"
                :items="listStorageTypeBilling"
                outlined
                :disabled="item.disable"
                :filled="item.disable"
                ><template v-slot:selection="{ item }"> {{ item.name }} - {{ item.description }} </template>
                <template v-slot:item="{ item }"> {{ item.name }} - {{ item.description }} </template>
              </v-select>
            </template>

            <template v-slot:item.size="{ item }">
              <v-text-field
                :value="item.size"
                @input="
                  (e) => {
                    customDiskItemChange(item.index, 'size', e ? parseInt(e) : e);
                  }
                "
                :error-messages="item.sizeError"
                outlined
                autocomplete="nope"
                placeholder="Enter in GB"
                type="number"
                :disabled="item.disable"
                :filled="item.disable"
                suffix="GB"
              >
              </v-text-field>
            </template>

            <template v-slot:item.index="{ item }">
              <v-col class="pt-0">
                <v-btn @click="deleteCustomDataDisk(item.index)" depressed outlined height="55" width="150" class="error white--text"> Delete </v-btn></v-col
              >
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="mt-4">
      <v-row class="d-flex justify-end">
        <v-col class="d-flex flex-row justify-center" cols="3">
          <v-btn class="fz-16" color="secondary" block outlined height="45" @click="prev()"> Previous </v-btn>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3">
          <v-btn class="white--text fz-16" color="secondary" block height="45" @click="next()"> Next </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "@vue/composition-api";
import { helpers, requiredIf } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { toIDRWithDotFormat } from "@/lib/formatter";
import INSTANCE from "../namespace";
import { STORAGE } from "@/modules/storage/namespace";
import { MANAGEFLAVOR } from "@/modules/superadmin-manageflavors/namespace";
import { MANAGEVOUCHER } from "@/modules/superadmin-managevoucher/namespace";
import { addGBText, removeGBText } from "@/lib/formatter";
import libProject from "@/lib/project";
import { VoucherDiscountDetailType } from "../../superadmin-managevoucher/type";

export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
    dataVolume: {
      type: Object,
      default: () => {},
    },
    dataDetails: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const {
      getListStorageType,
      getProcessorType,
      getListInstanceType,
      getListInstanceSize,
      getListInstanceRootDisk,
      getDefaultPriceStorage,
      getDefaultInstanceDataDisk,
      getDefaultInstancePriceDataDisk,
    } = useNamespacedActions(INSTANCE, [
      "getListStorageType",
      "getProcessorType",
      "getListInstanceType",
      "getListInstanceSize",
      "getListInstanceRootDisk",
      "getDefaultPriceStorage",
      "getDefaultInstanceDataDisk",
      "getDefaultInstancePriceDataDisk",
    ]);
    const {
      listStorageTypeBilling,
      listProcessorType,
      listInstanceType,
      listInstanceSize,
      listInstanceRootDisk,
      defaultPriceStorage,
      defaultInstanceDataDisk,
      defaultInstancePriceDataDisk,
    } = useNamespacedState(INSTANCE, [
      "listStorageTypeBilling",
      "listProcessorType",
      "listInstanceType",
      "listInstanceSize",
      "listInstanceRootDisk",
      "defaultPriceStorage",
      "defaultInstanceDataDisk",
      "defaultInstancePriceDataDisk",
    ]);

    const { fetchdefaultstoragesize } = useNamespacedActions(MANAGEFLAVOR, ["fetchdefaultstoragesize"]);
    const { defaultstoragesize } = useNamespacedState(MANAGEFLAVOR, ["defaultstoragesize"]);
    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, ["voucherDiscountProject"]);
    const { instanceDetail } = useNamespacedState(INSTANCE, ["instanceDetail"]);

    onMounted(async () => {
      const activeProjectID = await libProject.getActiveProjectID();
      const params = new URLSearchParams();
      params.append("project_id", activeProjectID);
      localCurrentProj.value = JSON.parse(localStorage.getItem("currentProj") || "{}");
      await getListInstanceType();
      await getListStorageType(params);
      await fetchdefaultstoragesize();
      await getProcessorType(params);
      if (props.dataVolume.vm_root_disk_id) {
        rootDiskSelected.value = listInstanceRootDisk.value.find((ele) => ele.id == props.dataVolume.vm_root_disk_id);
      }
      if (context.root.$route.query.image_ref) {
        setTimeout(() => {
          const data = listProcessorType.value.flatMap((d) => {
            return d.text.map((y) => {
              return {
                id: y.id,
                name: y.name,
                value: y.value,
              };
            });
          });
          if (data) {
            const nilai = data.find((item) => item.value == instanceDetail.value.package_instance.processor);
            processor.value = nilai.id;
          }
        }, 2000);
      }
      if (props.dataVolume.dataDisk) {
        customDataDiskItems.value = props.dataVolume.dataDisk;
      }
    });

    const discountInstance = computed(() => {
      return voucherDiscountProject.value ? voucherDiscountProject.value?.voucher_discount_detail?.instance_based : 0;
    });
    const discountStorage = computed(() => {
      return voucherDiscountProject.value ? voucherDiscountProject.value?.voucher_discount_detail?.root_disk : 0;
    });

    const customDiskError = ref("");
    const defaultDiskSizeError = ref("");
    const defaultDiskSize = ref("");
    const defaultDiskType = ref("");
    const defaultDiskTypeError = ref("");
    const addDefaultDiskError = ref("");
    const customDataDiskItems = ref(props.dataVolume.storages ? props.dataVolume.storages : []);
    const volumeTypeDefault = ref("");
    const sizeActive = ref("");
    const rootDiskSelected = ref();
    const processor = ref(props.dataVolume.processor ? props.dataVolume.processor : "");
    const customRootDiskSize = ref(props.dataVolume.vm_root_disk_custom_size);
    const isCustomRootDiskSizeHighlighted = ref(false);
    const selectedStorageType = ref(props.dataVolume.vm_root_disk_type_id);
    const planSelected = ref(props.dataVolume.planSelected);
    const instanceSelected = ref(props.dataVolume.item_id);
    const localCurrentProj = ref("");
    const dontShowError = ref(true);

    const calculateCustomRootDisk = (discount = 0, unit = "month") => {
      const size = customRootDiskSize.value ? parseInt(customRootDiskSize.value) : 0;

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
        discount = (price * size * discount) / 100;
        total = total - discount;
      }

      return toIDRWithDotFormat(Math.round(total));
    };

    const calculateRootDisk = (price, discount = 0) => {
      let total = 0;
      total = price;

      if (discount) {
        discount = (price * discount) / 100;
        total = total - discount;
      }

      return Math.round(total);
    };

    const calculateInstanceSize = (price) => {
      return Math.round(price - (price * discountInstance.value) / 100);
    };

    const customDataDiskHeaders = [
      { text: "Volume Type", value: "type", sortable: false },
      { text: "Size", value: "size", sortable: false },
      { text: "Action", value: "index", sortable: false },
    ];

    const customDiskItemChange = async (index, property, value) => {
      if (property == "type") {
        const params = new URLSearchParams();
        params.append("storage_type_id", value);
        const res = await getDefaultInstancePriceDataDisk(params);
        if (res.status == 200) {
          const index2 = customDataDiskItems.value.findIndex((item) => item.index === index);
          customDataDiskItems.value[index2][property] = value;
          customDataDiskItems.value[index2]["package_storage_id"] = defaultInstancePriceDataDisk.value.id;
          checkCustomDataDiskFields();
        }
      } else {
        const index2 = customDataDiskItems.value.findIndex((item) => item.index === index);
        customDataDiskItems.value[index2][property] = value;
        customDataDiskItems.value[index2]["price_per_hour"] = defaultInstancePriceDataDisk.value.price_per_hour * value;
        customDataDiskItems.value[index2]["price_per_month"] = defaultInstancePriceDataDisk.value.price_per_month * value;
        checkCustomDataDiskFields();
      }
     
    };

    const checkCustomDataDiskFields = () => {
      // const totalSize = customDataDiskItems.value.reduce((num, obj) => num + obj.size, 0);

      for (let i = 0; i < customDataDiskItems.value.length; i++) {
        if (!customDataDiskItems.value[i].type) {
          customDataDiskItems.value[i].typeError = true;
        } else {
          customDataDiskItems.value[i].typeError = false;
        }

        if (!customDataDiskItems.value[i].size) {
          customDataDiskItems.value[i].sizeError = "Value is required";
        } else {
          customDataDiskItems.value[i].sizeError = "";
        }
      }
    };

    const addDefaultDisk = () => {
      addDefaultDiskError.value = "";

      // const totalSize = customDataDiskItems.value.reduce((num, obj) => num + obj.size, 0);

      if (customDataDiskItems.value.length === 12) {
        addDefaultDiskError.value = "Max = 12 items Instance Data Disk";
        return;
      }

      if (!volumeTypeDefault.value) {
        defaultDiskTypeError.value = "Value is required";
        return;
      }

      if (!defaultDiskSize.value) {
        defaultDiskSizeError.value = "Value is required";
        return;
      }

      const disk = defaultInstanceDataDisk.value.find((elem) => elem.id === defaultDiskSize.value.id);

      const data = {
        index: Math.random().toString(36).slice(2),
        type: volumeTypeDefault.value,
        package_storage_id: defaultDiskSize.value.id,
        size: defaultDiskSize.value ? defaultDiskSize.value.volume_size : null,
        typeError: false,
        sizeError: "",
        disable: true,
        price_per_hour: disk.price_per_hour,
        price_per_month: disk.price_per_month,
      };

      customDataDiskItems.value.push(data);
    };
    const addCustomDataDisk = () => {
      if (customDiskError.value) customDiskError.value = "";

      const emptyTypeOrSize = customDataDiskItems.value.length && customDataDiskItems.value.some((item) => !item.type || !item.size);
      // const areFieldsWeird = emptyTypeOrSize;

      // max custom disks = 12
      if (customDataDiskItems.value.length && customDataDiskItems.value.length === 12) {
        customDiskError.value = "*Max 12 items";
      }

      // size or type is empty
      else if (emptyTypeOrSize) {
        customDiskError.value = "*Type or size is empty";
        checkCustomDataDiskFields();
      }

      // add new field
      else {
        customDataDiskItems.value.push({
          index: Math.random().toString(36).slice(2),
          type: "",
          size: null,
          typeError: false,
          sizeError: "",
          disable: false,
          price_per_hour: 0,
          price_per_month: 0,
          package_storage_id: "",
        });
      }
    };
    const deleteCustomDataDisk = (index) => {
      const index2 = customDataDiskItems.value.findIndex((item) => item.index === index);
      customDataDiskItems.value.splice(index2, 1);
    };

    const $v = useVuelidate(
      {
        planSelected: {
          required: helpers.withMessage("Plan couldnt be empty.", (val) => {
            return val;
          }),
        },
        instanceSelected: {
          required: helpers.withMessage("Size couldnt be empty.", (val) => {
            return val;
          }),
        },
        selectedStorageType: {
          required: helpers.withMessage("Storage Type couldnt be empty.", (val) => {
            return val;
          }),
        },
        rootDiskSelected: {
          required: requiredIf((val) => {
            return customRootDiskSize.value == null && rootDiskSelected.value == null;
          }),
          moreThan20: helpers.withMessage("The minimum required size for the root disk is 20 GBxxxxxx", () => {
            if (!rootDiskSelected.value) return true;
            // if (useRootDiskFromSnapshot.value) return true;
            let value = parseInt(rootDiskSelected.value.volume_size);
            if (rootDiskSelected.value.volume_size) {
              return value >= 20;
            } else {
              return true;
            }
          }),
        },
        customRootDiskSize: {
          required: requiredIf((val) => {
            return (customRootDiskSize.value == null || customRootDiskSize.value == "") && rootDiskSelected.value == null;
          }),
          moreThan20: helpers.withMessage("The minimum required size for the root disk is 20 GB", () => {
            if (!customRootDiskSize.value) return true;
            // if (useRootDiskFromSnapshot.value) return true;
            const value = customRootDiskSize.value;
            return value >= 20;
          }),
        },
        processor: {
          required: helpers.withMessage("Processor couldnt be empty.", (val) => {
            return val;
          }),
        },
      },
      {
        planSelected,
        instanceSelected,
        selectedStorageType,
        rootDiskSelected,
        customRootDiskSize,
        processor,
      }
    );

    const next = () => {
      $v.value.$touch();
      dontShowError.value = !customRootDiskSize.value && !rootDiskSelected.value ? false : true
      if ($v.value.$errors.length) return;
      const payload = {
        item_id: instanceSelected.value,
        vm_root_disk_type_id: selectedStorageType.value,
        planSelected: planSelected.value,
        processor: processor.value,
        package_storage_type_name: getTypeNameStorage(selectedStorageType.value), 
        dataDisk: customDataDiskItems.value,
      };
      if (customDataDiskItems.value.length > 0)
        payload.storages = customDataDiskItems.value.map((v) => {
          if (v.disable == true) {
            return { package_storage_type_id: v.type, package_storage_id: v.package_storage_id };
          } else {
            return { package_storage_type_id: v.type, custom_size: v.size, package_storage_id: v.type };
          }
        });

      if (rootDiskSelected.value) payload.vm_root_disk_id = rootDiskSelected.value.id;

      if (customRootDiskSize.value) {
        const flavorSameSize = listInstanceRootDisk.value.find((x) => {
          return x.volume_size == parseInt(customRootDiskSize.value) && x.type_id == selectedStorageType.value;
        });
        if (flavorSameSize) {
          payload.vm_root_disk_id = flavorSameSize.id;
        } else {
          payload.vm_root_disk_custom_size = parseInt(customRootDiskSize.value);
          payload.vm_root_disk_custom_service_id = selectedStorageType.value;
          payload.customRootDiskSize = customRootDiskSize.value;
        }
      }
      context.emit("get-data", payload);
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    const getInstanceDiscount = (flavor_ids) => {
      const voucherDiscount = voucherDiscountProject.value;
      if (voucherDiscount) {
        if (voucherDiscount.voucher_discount_detail.type === VoucherDiscountDetailType.INSTANCE_BASED) {
          return voucherDiscount.voucher_discount_detail.instance_based;
        } else {
          const discountFlavors = voucherDiscount.voucher_discount_detail.instance_flavors;
          if (discountFlavors && discountFlavors.length) {
            const flavors = discountFlavors.filter((x) => flavor_ids.include(x.package_instance_id));
            if (flavors && flavors.length) return flavors[0].discount;
          }
        }
      }
      return null;
    };

    const changeType = (event) => {
      const params = new URLSearchParams();
      params.append("project_id", localCurrentProj.value.id);
      params.append("processor_id", processor.value);
      params.append("type_id", event);
      getListInstanceSize(params);
    };

    const changeTypeStorage = (event) => {
      const params = new URLSearchParams();
      params.append("storage_type_id", event);
      getListInstanceRootDisk(params);
      getDefaultPriceStorage(params);
    };

    const changeDataDiskSize = (event) => {
      const params = new URLSearchParams();
      params.append("storage_type_id", event);
      getDefaultInstanceDataDisk(params);
    };

    const getTypeNameStorage = (id) => {
      const data = listStorageTypeBilling.value.find((ele) => ele.id == id);
      return data?.name;
    };
    const getSizeCustomDataDisk = (id) => {
      const data = defaultInstanceDataDisk.value.find((ele) => {
        return ele.id == id;
      });
      return data?.volume_size;
    };

    watch(volumeTypeDefault, () => {
      defaultDiskTypeError.value = "";
    });
    watch(defaultDiskSize, () => {
      defaultDiskSizeError.value = "";
    });
    // watch([props.dataVolume.vm_root_disk_id], (val) => {
    //   rootDiskSelected.value = listInstanceRootDisk.value.find((ele) => ele.id == props.dataVolume.vm_root_disk_id);
    // });
    // watch([processor], (val) => {
    //   let params = {
    //     type_id: planSelected.value,
    //     region: localCurrentProj.value.region,
    //     processor: processor.value,
    //   };
    //   fetchMasterInstances(params);
    // });

    return {
      prev,
      next,
      $v,
      planSelected,
      changeType,
      localCurrentProj,
      instanceSelected,
      toIDRWithDotFormat,
      selectedStorageType,
      isCustomRootDiskSizeHighlighted,
      customRootDiskSize,
      calculateCustomRootDisk,
      defaultstoragesize,
      calculateRootDisk,
      rootDiskSelected,
      sizeActive,
      volumeTypeDefault,
      customDataDiskHeaders,
      customDataDiskItems,
      customDiskItemChange,
      addDefaultDiskError,
      defaultDiskTypeError,
      addDefaultDisk,
      addCustomDataDisk,
      defaultDiskType,
      defaultDiskSize,
      defaultDiskSizeError,
      customDiskError,
      deleteCustomDataDisk,
      voucherDiscountProject,
      discountInstance,
      discountStorage,
      calculateInstanceSize,
      addGBText,
      removeGBText,
      processor,
      listProcessorType,
      listStorageTypeBilling,
      listInstanceType,
      listInstanceSize,
      getInstanceDiscount,
      changeTypeStorage,
      listInstanceRootDisk,
      defaultPriceStorage,
      changeDataDiskSize,
      defaultInstancePriceDataDisk,
      defaultInstanceDataDisk,
      getTypeNameStorage,
      instanceDetail,
      getSizeCustomDataDisk,
      dontShowError,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-btn.v-size--default {
  font-size: 16px;
}
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
.bordererror {
  border: 1px solid red;
}

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

.no-shadow {
  box-shadow: none !important;
}
.error-red {
  border: 1px solid red !important;
}
</style>
