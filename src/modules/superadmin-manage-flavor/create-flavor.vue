<template>
  <div>
    <v-card class="rounded-lg elevation-0">
      <v-container class="px-7 py-4" fluid>
        <v-row>
          <v-col>
            <div class="headline font-weight-bold font--text">Create New Flavor</div>
          </v-col>
        </v-row>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Type</p>
              <v-select
                outlined
                :items="listTypeFlavor"
                item-text="name"
                item-value="id"
                v-model="selectType"
                placeholder="Type"
                @blur="$v.selectType.$touch()"
                :error-messages="$v.selectType.$errors.length ? $v.selectType.$errors[0].$message : ''"
              ></v-select>
            </v-col>
            <v-col sm="12" md="6" class="pt-0 pb-0">
              <p class="font-weight-bold">Region</p>
              <v-select
                :items="selectRegions"
                v-model="selected_region"
                placeholder="Region"
                outlined
                @blur="$v.selected_region.$touch()"
                :error-messages="$v.selected_region.$errors.length ? $v.selected_region.$errors[0].$message : ''"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Name</p>
              <v-text-field
                outlined
                v-model="name"
                placeholder="Name"
                @blur="$v.name.$touch()"
                :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pt-0 pb-0">
              <p class="font-weight-bold">Processor Type</p>
              <v-select
                outlined
                placeholder="Processor Type"
                v-model="processor"
                @blur="$v.processor.$touch()"
                :error-messages="$v.processor.$errors.length ? $v.processor.$errors[0].$message : ''"
                item-value="value"
                item-text="name"
                :items="processorType"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">vCPU</p>
              <v-text-field
                outlined
                v-model="vcpu"
                placeholder="vCPU"
                suffix="Unit"
                @keypress="numbersOnly($event)"
                @blur="$v.vcpu.$touch()"
                :error-messages="$v.vcpu.$errors.length ? $v.vcpu.$errors[0].$message : ''"
              ></v-text-field>
            </v-col>
            <v-col sm="12" md="6" class="pt-0 pb-0">
              <p class="font-weight-bold">Ram</p>
              <v-text-field
                outlined
                v-model="ram"
                placeholder="Ram"
                suffix="GB"
                @keypress="numbersOnly($event)"
                @blur="$v.ram.$touch()"
                :error-messages="$v.ram.$errors.length ? $v.ram.$errors[0].$message : ''"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">GPU</p>
              <v-text-field outlined v-model="gpu" placeholder="GPU" suffix="GB" @keypress="numbersOnly($event)"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Description</p>
              <v-textarea
                outlined
                v-model="description"
                placeholder="Description"
                @blur="$v.description.$touch()"
                :error-messages="$v.description.$errors.length ? $v.description.$errors[0].$message : ''"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="pb-0">
          <v-row>
            <v-col>
              <v-btn depressed color="#a5b3bf" class="white--text" block height="50" to="/manage-flavor">
                <span class="fz-16">Cancel</span>
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn depressed block height="50" class="secondary" @click="onSubmit()" :loading="loadingCreateFlavor"><span class="fz-16">Submit</span></v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from "@vue/composition-api";
import { minLength, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEFLAVOR } from "./namespace";
import { useRegion } from "@/modules/instance/compositionapi/useregion";
import { SUPERADMINMANAGEPRICING } from "../superadmin-manage-pricing/namespace";
export default {
  setup(props, context) {
    const { loadingCreateFlavor, listTypeFlavor } = useNamespacedGetters(SUPERADMINMANAGEFLAVOR, ["loadingCreateFlavor", "listTypeFlavor"]);
    const { postCreateFlavor, getTypeFlavors } = useNamespacedActions(SUPERADMINMANAGEFLAVOR, ["postCreateFlavor", "getTypeFlavors"]);
    const { selectregionsbystatus: selectRegions, fetchregionbystatus } = useRegion();

    onMounted(() => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      fetchregionbystatus();
      getTypeFlavors();
    });
    const processorType = ref([
      { name: "Intel", value: "intel" },
      { name: "AMD High Core (AMD 3rd Gen AMD EPYC 64-Core)", value: "amd_high_core" },
      { name: "AMD High CPU (AMD 2rd Gen AMD EPYC 24-Core)", value: "amd_high_cpu" },
    ]);

    const processor = ref("");
    const name = ref("");
    const selectType = ref("");
    const selected_region = ref("");
    const description = ref("");
    const vcpu = ref("");
    const gpu = ref("");
    const ram = ref("");
    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const params = {
        type_id: selectType.value,
        region: selected_region.value.name,
        flavor_name: name.value,
        ram: parseInt(ram.value),
        vcpu: parseInt(vcpu.value),
        gpu: parseInt(gpu.value),
        description: description.value,
        processor: processor.value,
        usage_limit: -1,
      };
      postCreateFlavor(params);
    };
    const $v = useVuelidate(
      {
        name: {
          required: helpers.withMessage("Name couldnt be empty.", (val) => {
            return val;
          }),
          minLength: minLength(3),
        },
        selectType: {
          required: helpers.withMessage("Type couldnt be empty.", (val) => {
            return val;
          }),
        },
        selected_region: {
          required: helpers.withMessage("Region couldnt be empty.", (val) => {
            return val;
          }),
        },
        vcpu: {
          required: helpers.withMessage("vCPU couldnt be empty.", (val) => {
            return val;
          }),
        },
        processor: {
          required: helpers.withMessage("Processor couldnt be empty.", (val) => {
            return val;
          }),
        },
        ram: {
          required: helpers.withMessage("Ram couldnt be empty.", (val) => {
            return val;
          }),
        },

        description: {
          required: helpers.withMessage("Description couldnt be empty.", (val) => {
            return val;
          }),
        },
      },
      {
        name,
        selectType,
        selected_region,
        vcpu,
        processor,
        ram,
        description,
      }
    );
    const numbersOnly = (evt) => {
      const charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    };
    return {
      name,
      selectType,
      $v,
      onSubmit,
      loadingCreateFlavor,
      listTypeFlavor,
      selectRegions,
      selected_region,
      numbersOnly,
      vcpu,
      gpu,
      ram,
      description,
      processorType,
      processor,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
