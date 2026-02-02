<template>
  <v-card flat class="rounded-lg pa-4">
    <v-card-text>
      <div v-if="!instance" class="headline font-weight-bold font--text">Create Flavor</div>
      <div v-else-if="instance" class="headline font-weight-bold font--text">Edit Flavor</div>
    </v-card-text>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6" class="py-0">
          <p><b>Choose a Type*</b></p>
          <v-select
            placeholder="Choose a Type"
            v-model="type_id"
            :error-messages="type_idValidation.$errors.length ? type_idValidation.$errors[0].$message : ''"
            item-value="id"
            item-text="name"
            :items="instancetype"
            outlined
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="6" class="py-0">
          <p class="font-weight-bold">Choose Region</p>
          <v-select
            id="SelectRegion"
            v-model="instanceFlavorRegion"
            outlined
            :items="selectRegions"
            placeholder="Choose Region"
            :error-messages="instanceFlavorRegionValidation.$errors.length ? instanceFlavorRegionValidation.$errors[0].$message : ''"
          >
          </v-select>
          <p class="secondary--text" v-if="instanceFlavorRegion">
            <span v-if="instanceFlavorRegion.cpu_limit">vCPU Resource Remaning: {{ instanceFlavorRegion.cpu_limit - instanceFlavorRegion.cpu_usage }}</span>
            <br />
            <span v-if="instanceFlavorRegion.ram_limit"
              >Memory Resource Remaining:
              {{ instanceFlavorRegion.ram_limit - instanceFlavorRegion.ram_usage }}
              GB</span
            >
          </p>
        </v-col>
      </v-row>
      <v-divider class="mt-3 mb-2" />
      <v-row>
        <v-col cols="12" md="6">
          <p><b>Flavor Name*</b></p>
          <v-text-field
            maxlength="30"
            outlined
            placeholder="Type Flavor Name"
            v-model="flavor_name"
            :error-messages="flavor_nameValidation.$errors.length ? flavor_nameValidation.$errors[0].$message : ''"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <p><b>Processor Type*</b></p>
          <v-select
            maxlength="30"
            outlined
            placeholder="Type Flavor Name"
            v-model="processor"
            :error-messages="processorValidation.$errors.length ? processorValidation.$errors[0].$message : ''"
            item-value="value"
            item-text="name"
            :items="processorType"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <p>
            <b>vCPU*</b>
          </p>
          <v-text-field
            maxlength="3"
            id="cpu"
            type="number"
            v-model.number="vcpu"
            :error-messages="vcpuValidation.$errors.length ? vcpuValidation.$errors[0].$message : ''"
            outlined
            placeholder="Type vCPU"
          >
            <template v-slot:append><span class="font--text">vCPU</span></template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <p>
            <b>Memory*</b>
          </p>
          <v-text-field
            maxlength="3"
            type="number"
            v-model.number="ram"
            :error-messages="ramValidation.$errors.length ? ramValidation.$errors[0].$message : ''"
            outlined
            placeholder="Type Memory"
            ><template v-slot:append><span class="font--text">GB</span></template>
          </v-text-field>
        </v-col>
        <!-- <v-col cols="12" md="6">
          <p><b>Root Disk (GB)*</b></p>
          <v-text-field
            maxlength="3"
            id="rootdisk"
            disabled
            filled
            type="number"
            v-model.number="root_disk"
            :error-messages="
              root_diskValidation.$errors.length
                ? root_diskValidation.$errors[0].$message
                : ''
            "
            outlined
            placeholder="Root Disk Size"
          >
            <template v-slot:append
              ><span class="font--text">GB</span></template
            >
          </v-text-field>
        </v-col> -->
        <!-- <v-col cols="12" md="6">
          <p><b>Ephemeral Disk (GB)</b></p>
          <v-text-field
            maxlength="3"
            type="number"
            v-model.number="ephermeral_disk"
            :error-messages="
              ephermeral_diskValidation.$errors.length
                ? ephermeral_diskValidation.$errors[0].$message
                : ''
            "
            outlined
            placeholder="Ephemeral Disk Size"
            ><template v-slot:append
              ><span class="font--text">GB</span></template
            >
          </v-text-field>
        </v-col> -->
        <!-- <v-col cols="12" md="6">
          <p><b>Swap Disk (GB)</b></p>
          <v-text-field
            maxlength="3"
            type="number"
            v-model.number="swap_disk"
            :error-messages="
              swap_diskValidation.$errors.length
                ? swap_diskValidation.$errors[0].$message
                : ''
            "
            outlined
            placeholder="Swap Disk Size"
            ><template v-slot:append
              ><span class="font--text">GB</span></template
            >
          </v-text-field>
        </v-col> -->
        <v-col cols="12" md="6">
          <p><b>GPU (GHz)</b></p>
          <v-text-field
            maxlength="3"
            type="number"
            v-model.number="gpu"
            :error-messages="gpuValidation.$errors.length ? gpuValidation.$errors[0].$message : ''"
            outlined
            placeholder="GPU GHz"
            ><template v-slot:append><span class="font--text">GHz</span></template>
          </v-text-field>
        </v-col>
        <!-- <v-col cols="12" md="6">
          <p><b>Meta Data GPU</b></p>
          <v-text-field
            maxlength="3"
            v-model="meta_data_gpu"
            :error-messages="
              meta_data_gpuValidation.$errors.length
                ? meta_data_gpuValidation.$errors[0].$message
                : ''
            "
            outlined
          />
        </v-col> -->
      </v-row>
      <!-- <v-divider /> -->
    </v-card-text>
    <!-- <v-card-text>
      <div class="headline font-weight-bold font--text">Price Package</div>
    </v-card-text> -->

    <!-- <v-card-text class="pt-0">
      <v-row>
        <v-col cols="12" md="6" class="py-0">
          <p><b>Price per Month*</b></p>
          <v-text-field
            maxlength="10"
            class="currency"
            id="pricepermonth"
            type="number"
            v-model.number="price_per_month"
            :error-messages="
              price_per_monthValidation.$errors.length
                ? price_per_monthValidation.$errors[0].$message
                : ''
            "
            outlined
            placeholder="IDR | 0"
            @focus="
              () => {
                pricepermonthfocus = true;
              }
            "
            @blur="
              () => {
                pricepermonthfocus = false;
              }
            "
          >
            <template v-slot:prepend-inner>
              <div v-if="!pricepermonthfocus">
                {{
                  price_per_month
                    ? $IDRformat.format(price_per_month)
                    : "IDR | 0"
                }}
              </div>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="py-0">
          <p><b>Price per Hour*</b></p>
          <v-text-field
            maxlength="10"
            class="currency"
            id="priceperhour"
            type="number"
            v-model.number="price_per_hours"
            :error-messages="
              price_per_hoursValidation.$errors.length
                ? price_per_hoursValidation.$errors[0].$message
                : ''
            "
            outlined
            placeholder="IDR | 0"
            @focus="
              () => {
                priceperhourfocus = true;
              }
            "
            @blur="
              () => {
                priceperhourfocus = false;
              }
            "
          >
            <template v-slot:prepend-inner>
              <div v-if="!priceperhourfocus">
                {{
                  price_per_hours
                    ? $IDRformat.format(price_per_hours)
                    : "IDR | 0"
                }}
              </div>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text> -->
    <v-card-text>
      <v-row>
        <v-col>
          <v-btn height="58" depressed block color="accent" to="/manage-pricing" exact>
            <span style="font-size: 16px"> Cancel</span>
          </v-btn>
        </v-col>
        <v-col v-if="!flavorbeingedit">
          <v-btn @click="createPackage" height="58" depressed block color="secondary">
            <span style="font-size: 16px"> Create Package</span>
          </v-btn>
        </v-col>
        <v-col v-else-if="flavorbeingedit">
          <v-btn
            @click="
              () => {
                editPackage(flavorbeingedit);
              }
            "
            height="58"
            depressed
            block
            color="secondary"
          >
            <span style="font-size: 16px"> Save</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import { useRegion } from "@/modules/instance/compositionapi/useregion";
import { useFlavor } from "./useflavor";
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from "vuex-composition-helpers";
import { Keys } from "./useflavor";
import { MANAGEFLAVOR } from "./namespace";
export default defineComponent({
  setup(props, context) {
    const { fetchinstancetype } = useNamespacedActions(MANAGEFLAVOR, ["fetchinstancetype"]);

    const { instancetype, flavorbeingedit } = useNamespacedState(MANAGEFLAVOR, ["instancetype", "flavorbeingedit"]);

    const { setflavorbeingedit } = useNamespacedMutations(MANAGEFLAVOR, ["setflavorbeingedit"]);

    const { selectregions: selectRegions, fetchregions } = useRegion();

    if (context.root.$route.fullPath == "/manage-pricing/create") {
      setflavorbeingedit("");
    }
    const Composable = useFlavor(props, context);

    onMounted(() => {
      fetchregions();
      if (flavorbeingedit.value && context.root.$route.fullPath == "/manage-pricing/edit") {
        const {
          type_id,
          flavor_name,
          vcpu,
          ram,
          root_disk,
          ephermeral_disk,
          swap_disk,
          gpu,
          // meta_data_gpu,
          rx_tx,
          price_per_month,
          price_per_hours,
          processor,
        } = Composable;
        type_id.value = flavorbeingedit.value.type_id;
        flavor_name.value = flavorbeingedit.value.flavor_name;
        vcpu.value = flavorbeingedit.value.vcpu;
        ram.value = flavorbeingedit.value.ram;
        root_disk.value = flavorbeingedit.value.root_disk;
        ephermeral_disk.value = flavorbeingedit.value.ephermeral_disk;
        swap_disk.value = flavorbeingedit.value.swap_disk;
        gpu.value = flavorbeingedit.value.gpu;
        // meta_data_gpu.value = flavorbeingedit.value.meta_data_gpu;
        rx_tx.value = flavorbeingedit.value.rx_tx;
        price_per_month.value = flavorbeingedit.value.price_per_month;
        price_per_hours.value = flavorbeingedit.value.price_per_hours;
        processor.value = flavorbeingedit.value.processor;
      } else if (context.root.$route.fullPath == "/manage-pricing/create") {
        // console.log(flavorbeingedit.value);
      } else {
        context.root.$router.replace("/manage-pricing");
      }
    });

    const { instance, usageUnlimited, usageLimit } = Composable;

    watch(usageUnlimited, (unlimited) => {
      if (unlimited) usageLimit.value = null;
    });

    watch(instance, (val) => {
      if (val) {
        Keys.forEach((key) => {
          Composable[key].value = val[key];
        });
      }
    });

    const processorType = ref([
      { name: "Intel", value: "intel" },
      { name: "AMD High Core (AMD 3rd Gen AMD EPYC 64-Core)", value: "amd_high_core" },
      { name: "AMD High CPU (AMD 2rd Gen AMD EPYC 24-Core)", value: "amd_high_cpu" },
    ]);
    const priceperhourfocus = ref(false);
    const pricepermonthfocus = ref(false);
    const { defaultcpu, defaultram, defaultdisk, defaultgpu } = useNamespacedState(MANAGEFLAVOR, ["defaultcpu", "defaultram", "defaultdisk", "defaultgpu"]);
    const { vcpu, ram, root_disk, price_per_month, price_per_hours, gpu, instanceFlavorRegion, processor } = Composable;
    root_disk.value = 0;

    const calculatedefaultprice = () => {
      price_per_month.value =
        vcpu.value * defaultcpu.value.price_per_month +
        ram.value * defaultram.value.price_per_month +
        root_disk.value * defaultdisk.value.price_per_month +
        gpu.value * defaultgpu.value.price_per_month;

      price_per_hours.value =
        vcpu.value * defaultcpu.value.price_per_hours +
        ram.value * defaultram.value.price_per_hours +
        root_disk.value * defaultdisk.value.price_per_hours +
        gpu.value * defaultgpu.value.price_per_hours;
    };
    watch(vcpu, (val) => {
      calculatedefaultprice();
    });

    watch(ram, (val) => {
      calculatedefaultprice();
    });

    watch(root_disk, (val) => {
      calculatedefaultprice();
    });

    watch(gpu, (val) => {
      calculatedefaultprice();
    });

    return {
      priceperhourfocus,
      selectRegions,
      pricepermonthfocus,
      flavorbeingedit,
      fetchinstancetype,
      instancetype,
      ...Composable,
      setinstance(val) {
        instance.value = val;
      },
      instance,
      processorType,
    };
  },
  created() {
    this.fetchinstancetype();
    this.fetchflavors();
  },
});
</script>
<style lang="scss" scoped>
.currency:not(.v-input--is-focused) {
  ::v-deep input {
    z-index: -1;
  }
}
</style>
