<template>
  <div>
    <!-- <v-card-text class="pb-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0">
          <p class="font-weight-bold">Type</p>
          <v-select
            placeholder="Select Type"
            :items="listTypes"
            v-model="selectType"
            item-value="name"
            item-text="text"
            outlined
            @blur="$v.selectType.$touch()"
            :error-messages="$v.selectType.$errors.length ? $v.selectType.$errors[0].$message : ''"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text> -->
    <v-card-text class="pb-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0">
          <p class="font-weight-bold">VPC Network</p>
          <v-select
            placeholder="Select VPC Network"
            :items="vpcs"
            v-model="selectedVPC"
            outlined
            item-value="id"
            @blur="$v.selectedVPC.$touch()"
            :error-messages="$v.selectedVPC.$errors.length ? $v.selectedVPC.$errors[0].$message : ''"
          >
            <template v-slot:selection="{ item }">
              {{ item.name }} (<span v-for="(row, index) in item.subnets" :key="index">
                {{ row.ip_prefix }}/{{ row.network_size }}<span v-if="item.subnets.length - 1 != index">,&nbsp;</span></span
              >)</template
            > 
            <template v-slot:item="{ item }">
              {{ item.name }} (<span v-for="(row, index) in item.subnets" :key="index">
                {{ row.ip_prefix }}/{{ row.network_size }}<span v-if="item.subnets.length - 1 != index">,&nbsp;</span></span
              >)</template
            >
          </v-select>
        </v-col>
        <!-- <v-col sm="12" md="6" class="pt-0 pb-0">
          <p class="font-weight-bold">IP Address</p>
          <v-text-field maxlength="50" v-model="ipAddress" outlined placeholder="IP Address"></v-text-field>
        </v-col> -->
      </v-row>
    </v-card-text>

    <!-- <v-card-text class="pb-0" v-if="selectType === 'port'">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0">
          <p class="font-weight-bold">Port</p>
          <v-select
            placeholder="Select Port"
            :items="vpcports"
            v-model="selectedVPCPort"
            outlined
            item-value="id"
            @blur="$v.selectedVPCPort.$touch()"
            :error-messages="$v.selectedVPCPort.$errors.length ? $v.selectedVPCPort.$errors[0].$message : ''"
            ><template v-slot:selection="{ item }">
              {{ item.vpc_name }}&nbsp; <span>(&nbsp;{{ item.name }}/{{ item.ip_address }}&nbsp;)</span>
            </template>
            <template v-slot:item="{ item }">
              {{ item.vpc_name }}&nbsp; <span>(&nbsp;{{ item.name }}/{{ item.ip_address }}&nbsp;)</span></template
            ></v-select
          >
        </v-col>
      </v-row>
    </v-card-text> -->

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
import { ref, onMounted, computed } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import INSTANCE from "../namespace";
import { required, helpers, requiredIf } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
    dataNetwork: {
      type: Object,
      default: () => {},
    },
    billingType: {
      type: String,
      default: "",
    },
    dataDetails: {
      default: () => {},
    }
  },
  setup(props, context) {
    const { fetchvpcs, fetchvpcportattached, fetchvpcportenabled, fetchvpcportdetacheds } = useNamespacedActions(INSTANCE, [
      "fetchvpcs",
      "fetchvpcportattached",
      "fetchvpcportenabled",
      "fetchvpcportdetacheds",
    ]);
    const { vpcs, vpcportattached, vpcportenabled, vpcports } = useNamespacedState(INSTANCE, ["vpcs", "vpcportattached", "vpcportenabled", "vpcports"]);
    onMounted(() => {
      // fetchvpcportdetacheds();
      // fetchvpcportattached();
      // fetchvpcportenabled();
      if (props.dataDetails.billing_type == "Trial") {
        const params = { active_trial: true, trial: true };
        fetchvpcs(params);
      } else {
        const params = { trial: false };
        fetchvpcs(params);
      }
    });
    const listVpcs = computed(() => {
      const data = vpcs.value
        .filter((x) => x.subnets.length != 0)
        .map((y) => {
          return { id: y.id, name: y.name, subnets: y.subnets };
        });
      const arrayData = vpcs.value
        .filter((x) => x.subnets.length == 0)
        .map((y) => {
          const container = {};
          container.id = y.id;
          container.name = y.name;
          container.subnets = [{ name: `subnet-${y.id}`, ip_prefix: y.ip_prefix, network_size: y.network_size.toString() }];
          return container;
        });
      return data.concat(arrayData);
    });
    const selectedVPC = ref(props.dataNetwork.vpc_id);
    const selectType = ref("");
    const selectedVPCPort = ref("");
    const ipAddress = ref("");
    const listTypes = ref([
      {
        text: "by VPC",
        name: "vpc",
      },
      {
        text: "by Port",
        name: "port",
      },
    ]);
    const $v = useVuelidate(
      {
        // selectType: {
        //   required: helpers.withMessage("Type couldnt be empty.", (val) => {
        //     return val;
        //   }),
        // },
        selectedVPC: {
          required: requiredIf((val) => {
            return selectType.value === "vpc";
          }),
        },
        // selectedVPCPort: {
        //   required: requiredIf((val) => {
        //     return selectType.value === "port";
        //   }),
        // },
      },
      {
        // selectType,
        selectedVPC,
        // selectedVPCPort,
      }
    );

    const next = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
        vpc_id: selectedVPC.value,
      };
      context.emit("get-data", payload);
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    return {
      prev,
      next,
      vpcs,
      selectedVPC,
      $v,
      listTypes,
      selectType,
      selectedVPCPort,
      ipAddress,
      listVpcs,
      vpcportattached,
      vpcportenabled,
      vpcports,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-btn.v-size--default {
  font-size: 16px;
}
</style>
